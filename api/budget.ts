import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = "maricleman/budget-manager-data";
    const path = "budget.json";

    const ghRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!ghRes.ok) {
      const text = await ghRes.text();
      return res.status(500).json({ error: text });
    }

    const data = await ghRes.json();

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const json = JSON.parse(content);

    res.status(200).json(json);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
}
