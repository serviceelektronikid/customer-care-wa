import Groq from "groq-sdk";

let client: Groq | null = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    client = new Groq({ apiKey });
  }
  return client;
}

export async function generateReply(
  message: string,
  faqContext: string,
  history: string
): Promise<string | null> {
  const groq = getClient();
  if (!groq) return null;

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `Kamu adalah customer service agent untuk sebuah UKM / toko online.
Kamu ramah, sopan, dan membantu. Balas dalam bahasa Indonesia.

FAQ TOKO:
${faqContext}

RIWAYAT CHAT:
${history}

Gunakan FAQ untuk jawab pertanyaan. Jika tidak tahu, arahkan untuk hubungi admin. Jangan buat jawaban palsu.`,
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return res.choices[0]?.message?.content || "Maaf, saya tidak bisa memproses pertanyaan Anda saat ini.";
}
