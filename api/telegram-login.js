export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const { ua, battery, role } = req.body;
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
  const geo = await geoRes.json();

  const date = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  const text = `
🔐 *Login Panel DBV1*
👤 Role: *${role}*
📅 Waktu: ${date}
🌐 IP: ${ip}
📍 Lokasi: ${geo.city}, ${geo.regionName}, ${geo.country}
📶 Provider: ${geo.isp}
🔋 Baterai: ${battery}
🧭 Perangkat: \`${ua}\`
`;

  const token = "7847987165:AAExaFfM8F2eWgJc_0TG8k3xx3uiQKAOZxE";
  const chatid = "7274253936";

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatid,
      text,
      parse_mode: "Markdown"
    })
  });

  res.status(200).json({ ok: true });
}