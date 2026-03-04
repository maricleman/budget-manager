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
    const { id, monthlyContribution, addAmount, currentAmount, name } = req.body as {
      id?: string;
      monthlyContribution?: number;
      addAmount?: number;
      currentAmount?: number;
      name?: string;
    };

    if (!id) {
      res.status(400).json({ error: "Missing goal id" });
      return;
    }

    const getResp = await fetch(
      `${GH_API}/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!getResp.ok) {
      const t = await getResp.text();
      throw new Error("GitHub GET failed: " + t);
    }

    const file = await getResp.json();
    const decoded = Buffer.from(file.content, "base64").toString("utf8");
    const data: BudgetData = JSON.parse(decoded);

    data.goals ??= [];
    const goal = data.goals.find((g) => g.id === id);
    if (!goal) {
      res.status(404).json({ error: "Goal not found" });
      return;
    }

    if (monthlyContribution !== undefined) {
      goal.monthlyContribution = Number(monthlyContribution);
    }

    if (currentAmount !== undefined) {
      goal.currentAmount = Number(currentAmount);
    } else if (addAmount !== undefined) {
      goal.currentAmount = (goal.currentAmount ?? 0) + Number(addAmount);
    }

    if (name !== undefined && name.trim()) {
      goal.name = name.trim();
    }

    const newContent = Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64");

    const putResp = await fetch(
      `${GH_API}/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update goal: ${id}`,
          content: newContent,
          sha: file.sha,
        }),
      }
    );

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
