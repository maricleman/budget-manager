import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { BudgetData, Goal } from "../src/types";

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
    const { name, targetAmount, monthlyContribution } = req.body as {
      name?: string;
      targetAmount?: number;
      monthlyContribution?: number;
    };

    if (!name || targetAmount == null || monthlyContribution == null) {
      res.status(400).json({ error: "Missing name, targetAmount or monthlyContribution" });
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

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetAmount: Number(targetAmount),
      monthlyContribution: Number(monthlyContribution),
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    };

    data.goals.unshift(newGoal);

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
          message: `Add goal: ${name}`,
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
