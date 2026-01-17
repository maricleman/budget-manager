export const config = {
  runtime: "nodejs"
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { person, fund, description, amount } = await req.json();

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_PATH } = process.env;

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;

  // 1. Load file
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
    timestamp: Date.now()
  };

  json.transactions.unshift(tx);
  json.funds[fund] = Number((json.funds[fund] + amount).toFixed(2));

  // 3. Save back
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
    return new Response(JSON.stringify({ error: "Failed to save" }), { status: 500 });
  }

  return Response.json({ ok: true });
}
