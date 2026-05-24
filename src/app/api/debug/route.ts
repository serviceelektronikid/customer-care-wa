/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const result: Record<string, any> = {};

  try {
    const body = await req.json();
    result.body_received = true;

    const supabase = getSupabase();
    result.supabase_client = "created";

    const { error: insertError } = await supabase.from("chats").insert({
      wa_id: "628118880292",
      sender: "customer",
      message: "test debug",
    });
    result.insert_result = insertError ? `ERROR: ${insertError.message}` : "OK";

    const { data: faqs, error: faqError } = await supabase.from("faq").select("*");
    result.faq_result = faqError ? `ERROR: ${faqError.message}` : `${(faqs || []).length} faqs`;

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack?.substring(0, 500) });
  }
}
