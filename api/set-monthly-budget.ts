import type { VercelRequest, VercelResponse } from "@vercel/node";

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const PATH = process.env.GITHUB_PATH!;
const TOKEN = process.env.GITHUB_TOKEN!;

const GH_API = "https://api.github.com";

type BudgetData = {
  funds: Record<string, number>;
  transactions: any[];
  monthlyBudgets?: Record<string, Record<string, number>>;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
    type MonthlyBudgets = Record<string, number>;
    const { yearMonth, budgets } = req.body as {
      yearMonth: string;
      budgets: MonthlyBudgets;
    };

    if (!yearMonth || !budgets) {
      res.status(400).json({ error: "Missing yearMonth or budgets" });
      return;
    }

    // 1. Load existing JSON from GitHub
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

    // 2. Update monthly budgets
    data.monthlyBudgets ??= {};

  const prevBudgets = data.monthlyBudgets[yearMonth] ?? {};

  for (const [fund, newAmount] of Object.entries(budgets)) {
    const oldAmount = Number(prevBudgets[fund] ?? 0);
    const delta = Number(newAmount) - oldAmount;

    if (!Number.isFinite(delta)) continue;

    data.funds[fund] = (data.funds[fund] ?? 0) + delta;
  }

  data.monthlyBudgets[yearMonth] = budgets;



    // 3. Save back to GitHub
    const newContent = Buffer.from(
      JSON.stringify(data, null, 2),
      "utf8"
    ).toString("base64");

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
          message: `Set monthly budget for ${yearMonth}`,
          content: newContent,
          sha: file.sha,
        }),
      }
    );

    if (!putResp.ok) {
      const t = await putResp.text();
      throw new Error("GitHub PUT failed: " + t);
    }

    res.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Unknown error" });
  }
}
