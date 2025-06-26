export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Only GET allowed");

  const repo = "faanzylosttt/DBV1";
  const filename = "DBV1.json";
  const token = process.env.GITHUB_TOKEN;

  try {
    const getFile = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const file = await getFile.json();
    const content = JSON.parse(Buffer.from(file.content, "base64").toString());
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ message: "❌ Gagal mengambil data", error: err.message });
  }
}