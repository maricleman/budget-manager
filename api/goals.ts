import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { BudgetData } from "../src/types";

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const PATH = process.env.GITHUB_PATH!;
const TOKEN = process.env.GITHUB_TOKEN!;

const GH_API = "https://api.github.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");
    return;
  }

  try {
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

    res.status(200).json({ goals: data.goals ?? [] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Unknown error" });
  }
}
