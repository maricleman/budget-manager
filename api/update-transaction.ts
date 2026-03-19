import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { BudgetData } from "../src/types";

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const PATH = process.env.GITHUB_PATH!;
const TOKEN = process.env.GITHUB_TOKEN!;

const GH_API = "https://api.github.com";

type UpdateTransactionBody = {
  id?: string;
  fund?: string;
  amount?: number;
  description?: string;
  person?: "david" | "hannah";
  date?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    const { id, fund, amount, description, person, date } = req.body as UpdateTransactionBody;

    if (!id) {
      res.status(400).json({ error: "Missing transaction id" });
      return;
    }

    const getResp = await fetch(`${GH_API}/repos/${OWNER}/${REPO}/contents/${PATH}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!getResp.ok) {
      const t = await getResp.text();
      throw new Error("GitHub GET failed: " + t);
    }

    const file = await getResp.json();
    const decoded = Buffer.from(file.content, "base64").toString("utf8");
    const data: BudgetData = JSON.parse(decoded);

    const tx = data.transactions.find((t) => t.id === id);
    if (!tx) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    const oldFund = tx.fund;
    const oldAmount = tx.amount;

    if (fund) tx.fund = fund as any;
    if (amount !== undefined) tx.amount = Number(amount);
    if (description !== undefined) tx.description = String(description);
    if (person) tx.person = person;
    if (date) tx.date = String(date);

    const newFund = tx.fund;
    const newAmount = tx.amount;

    if (oldFund === newFund) {
      const delta = newAmount - oldAmount;
      data.funds[newFund] = Number((data.funds[newFund] + delta).toFixed(2));
    } else {
      data.funds[oldFund] = Number((data.funds[oldFund] - oldAmount).toFixed(2));
      data.funds[newFund] = Number((data.funds[newFund] + newAmount).toFixed(2));
    }

    const newContent = Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64");

    const putResp = await fetch(`${GH_API}/repos/${OWNER}/${REPO}/contents/${PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Update transaction: ${id}`,
        content: newContent,
        sha: file.sha,
      }),
    });

    if (!putResp.ok) {
      const t = await putResp.text();
      throw new Error("GitHub PUT failed: " + t);
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Unknown error" });
  }
}
