import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const db = supabaseAdmin();
  const category = req.nextUrl.searchParams.get("category");

  let query = db.from("products").select("*").eq("active", true);
  if (category) query = query.eq("category_slug", category);

  const { data, error } = await query.order("rating", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
