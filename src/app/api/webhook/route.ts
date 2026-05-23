/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { generateReply } from "@/lib/groq";

const VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN!;
const WA_ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN!;
const WA_PHONE_ID = process.env.WA_PHONE_NUMBER_ID!;

async function sendWaMessage(to: string, text: string) {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    }
  );
  return res.json();
}

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;

    if (!messages?.[0]) return NextResponse.json({ ok: true });

    const msg = messages[0];
    const from = msg.from;
    const text = msg.text?.body || "";

    if (!text) return NextResponse.json({ ok: true });

    const supabase = getSupabase();
    await supabase.from("chats").insert({
      wa_id: from,
      sender: "customer",
      message: text,
    });

    const { data: faqs } = await supabase.from("faq").select("question, answer");
    const faqContext = (faqs || [])
      .map((f: any) => `Q: ${f.question}\nA: ${f.answer}`)
      .join("\n\n");

    const { data: historyRows } = await supabase
      .from("chats")
      .select("sender, message")
      .eq("wa_id", from)
      .order("created_at", { ascending: false })
      .limit(6);

    const history = (historyRows || [])
      .reverse()
      .map((r: any) => `${r.sender}: ${r.message}`)
      .join("\n");

    const reply = await generateReply(text, faqContext, history) || "Maaf, sedang ada gangguan. Silakan hubungi admin langsung.";

    await sendWaMessage(from, reply);

    await supabase.from("chats").insert({
      wa_id: from,
      sender: "agent",
      message: reply,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}
