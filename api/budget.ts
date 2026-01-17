export const config = {
  runtime: "nodejs"
};

export default async function handler() {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_PATH } = process.env;

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;

  const ghRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  });

  if (!ghRes.ok) {
    return new Response(JSON.stringify({ error: "GitHub fetch failed" }), { status: 500 });
  }

  const data = await ghRes.json();
  const content = JSON.parse(Buffer.from(data.content, "base64").toString());

  return Response.json(content);
}
