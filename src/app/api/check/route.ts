export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.GROQ_API_KEY = process.env.GROQ_API_KEY ? "✅ set" : "❌ missing";
  checks.WA_ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN ? "✅ set" : "❌ missing";
  checks.WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID ? "✅ set" : "❌ missing";
  checks.WA_VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN ? "✅ set" : "❌ missing";
  checks.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ set" : "❌ missing";
  checks.SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ set" : "❌ missing";

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("faq").select("id").limit(1);
    checks.SUPABASE_CONNECTION = error ? `❌ ${error.message}` : "✅ connected";
  } catch (e: any) {
    checks.SUPABASE_CONNECTION = `❌ ${e.message}`;
  }

  try {
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "test" }],
      max_tokens: 2,
    });
    checks.GROQ_TEST = "✅ " + res.choices[0]?.message?.content?.substring(0, 20);
  } catch (e: any) {
    checks.GROQ_TEST = `❌ ${e.message}`;
  }

  return NextResponse.json(checks);
}
