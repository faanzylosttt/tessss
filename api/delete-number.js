export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const { number } = req.body;
  if (!number || !/^62\d{8,}$/.test(number)) return res.status(400).json({ message: "Nomor tidak valid" });

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

    if (!content.dbny.includes(number)) return res.status(404).json({ message: "Nomor tidak ditemukan" });

    content.dbny = content.dbny.filter(n => n !== number);
    const updatedContent = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");

    const update = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: `Menghapus nomor ${number}`,
        content: updatedContent,
        sha: file.sha,
      }),
    });

    const result = await update.json();
    return res.status(200).json({ message: "Nomor berhasil dihapus", result });
  } catch (err) {
    return res.status(500).json({ message: "Gagal update GitHub", error: err.message });
  }
}