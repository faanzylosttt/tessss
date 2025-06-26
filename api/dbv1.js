export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Only GET allowed");
  }

  const rawUrl = "https://raw.githubusercontent.com/faanzylosttt/DBV1/main/DBV1.json";

  try {
    const response = await fetch(rawUrl);

    if (!response.ok) {
      throw new Error("Gagal ambil data dari GitHub");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      message: "❌ Gagal mengambil data",
      error: err.message,
    });
  }
}