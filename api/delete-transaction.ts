import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { BudgetData } from "../src/types";

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const PATH = process.env.GITHUB_PATH!;
const TOKEN = process.env.GITHUB_TOKEN!;

const GH_API = "https://api.github.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    const { id } = req.body as { id?: string };

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

    data.transactions = data.transactions.filter((t) => t.id !== id);
    const fund = tx.fund;
    const amount = tx.amount;

    data.funds[fund] = Number((data.funds[fund] - amount).toFixed(2));

    const newContent = Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64");

    const putResp = await fetch(`${GH_API}/repos/${OWNER}/${REPO}/contents/${PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete transaction: ${id}`,
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
