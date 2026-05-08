import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

async function requireAdmin() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// GET all products (including inactive)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — create product
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const db = supabaseAdmin();

  const { data, error } = await db.from("products").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// PUT — update product
export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Product id required" }, { status: 400 });

  const db = supabaseAdmin();
  const { data, error } = await db.from("products").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE — soft delete (set active = false)
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Product id required" }, { status: 400 });

  const db = supabaseAdmin();
  const { error } = await db.from("products").update({ active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
