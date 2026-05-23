export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("chats")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return NextResponse.json(data || []);
}
