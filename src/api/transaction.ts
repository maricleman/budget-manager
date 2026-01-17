import type { VercelRequest, VercelResponse } from "@vercel/node";

const {
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_PATH
} = process.env;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { person, fund, description, amount } = req.body;

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;

  // 1. Get file
  const ghRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  });

  const file = await ghRes.json();
  const json = JSON.parse(Buffer.from(file.content, "base64").toString());

  // 2. Apply transaction
  const tx = {
    id: crypto.randomUUID(),
    person,
    fund,
    description,
    amount,
    date: Date.now()
  };

  json.transactions.unshift(tx);
  json.funds[fund] = Number((json.funds[fund] + amount).toFixed(2));

  // 3. Save back to GitHub
  const newContent = Buffer.from(JSON.stringify(json, null, 2)).toString("base64");

  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Add transaction: ${description || amount}`,
      content: newContent,
      sha: file.sha
    })
  });

  if (!putRes.ok) {
    return res.status(500).json({ error: "Failed to save" });
  }

  res.status(200).json({ ok: true });
}
