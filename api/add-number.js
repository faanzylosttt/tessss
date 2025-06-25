export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const repoOwner = "faanzylosttt";
  const repoName = "DBV1";
  const filePath = "DBV1.json";
  const branch = "main";

  if (req.method !== "POST") return res.status(405).end("Only POST allowed");

  const { number } = req.body;
  if (!number || !/^62\d{8,}$/.test(number)) {
    return res.status(400).json({ error: "Nomor tidak valid" });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  const fileRes = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`,
    { headers }
  );
  const fileData = await fileRes.json();

  let content = Buffer.from(fileData.content, "base64").toString();
  let dataJson = [];

  try {
    dataJson = JSON.parse(content);
  } catch (e) {
    return res.status(500).json({ error: "Gagal parse file JSON" });
  }

  if (dataJson.includes(number)) {
    return res.status(409).json({ error: "Nomor sudah ada" });
  }

  dataJson.push(number);
  const updatedContent = Buffer.from(JSON.stringify(dataJson, null, 2)).toString("base64");

  const updateRes = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Menambahkan nomor ${number}`,
        content: updatedContent,
        sha: fileData.sha,
        branch,
      }),
    }
  );

  if (updateRes.status === 200 || updateRes.status === 201) {
    return res.status(200).json({ success: true, number });
  } else {
    const errData = await updateRes.json();
    return res.status(500).json({ error: "Gagal update file", detail: errData });
  }
}