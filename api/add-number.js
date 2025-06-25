// /api/add-number.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  const { number } = req.body;
  if (!number) return res.status(400).json({ message: "Nomor kosong" });

  const repo = "databasescript/databasev10"";
  const filename = "databasev10";
  const token = process.env.GITHUB_TOKEN;

  const getFile = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const file = await getFile.json();
  const content = JSON.parse(Buffer.from(file.content, "base64").toString());

  // Cek apakah nomor sudah ada
  if (content.dbny.includes(number)) {
    return res.status(409).json({ message: "Nomor sudah ada" });
  }

  // Tambah nomor
  content.dbny.push(number);

  const updatedContent = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");

  const update = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: `Menambahkan nomor ${number}`,
      content: updatedContent,
      sha: file.sha,
    }),
  });

  const result = await update.json();
  res.status(200).json({ message: "Berhasil", result });
}