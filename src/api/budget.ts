import type { VercelRequest, VercelResponse } from "@vercel/node";

const {
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_PATH
} = process.env;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;

  const ghRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  });

  if (!ghRes.ok) {
    return res.status(500).json({ error: "Failed to fetch from GitHub" });
  }

  const data = await ghRes.json();
  const content = JSON.parse(Buffer.from(data.content, "base64").toString());

  res.status(200).json(content);
}
