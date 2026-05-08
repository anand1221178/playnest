import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string; // e.g. "giggles/star-link"

  if (!file || !folder) {
    return NextResponse.json({ error: "File and folder required" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const ext = file.name.split(".").pop() || "png";
  const fileName = `${folder}/${Date.now()}.${ext}`;

  const { error } = await db.storage
    .from("product-images")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = db.storage.from("product-images").getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}
