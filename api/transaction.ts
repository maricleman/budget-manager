import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = "maricleman/budget-manager-data";
    const path = "budget.json";

    const body = req.body;

    // 1. Load current file
    const ghRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const data = await ghRes.json();

    const decoded = Buffer.from(data.content, "base64").toString("utf-8");
    const json = JSON.parse(decoded);

    // 2. Apply transaction
    json.transactions.unshift({
      ...body,
      date: new Date().toISOString(),
    });

    json.funds[body.fund] += body.amount;

    // 3. Save back to GitHub
    const updatedContent = Buffer.from(
      JSON.stringify(json, null, 2)
    ).toString("base64");

    const putRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update budget",
          content: updatedContent,
          sha: data.sha,
        }),
      }
    );

    if (!putRes.ok) {
      const t = await putRes.text();
      return res.status(500).json({ error: t });
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
}
