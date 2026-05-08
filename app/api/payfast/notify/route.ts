import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { validatePayFastSignature } from "@/lib/payfast";
import { sendBuyerConfirmation, sendOwnerNotification, sendDeliveryNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const pfData: Record<string, string> = {};
  formData.forEach((value, key) => {
    pfData[key] = value.toString();
  });

  // Build param string (excluding signature) for verification
  const pfParamString = Object.entries(pfData)
    .filter(([key]) => key !== "signature")
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
    .join("&");

  // Validate signature
  if (!validatePayFastSignature(pfData, pfParamString)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const orderId = pfData.m_payment_id;
  const paymentStatus = pfData.payment_status; // COMPLETE, FAILED, PENDING

  // Update order
  const newStatus = paymentStatus === "COMPLETE" ? "paid" : "cancelled";
  const { data: order, error } = await db
    .from("orders")
    .update({
      payment_id: pfData.pf_payment_id,
      payment_status: paymentStatus.toLowerCase(),
      status: newStatus,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // If payment successful, send all 3 emails
  if (paymentStatus === "COMPLETE") {
    const emailData = {
      orderNumber: order.order_number,
      firstName: order.first_name,
      lastName: order.last_name,
      email: order.email,
      address: order.address,
      city: order.city,
      province: order.province,
      postalCode: order.postal_code,
      items: order.items,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      total: Number(order.total),
    };

    // Send all emails (don't block response)
    Promise.all([
      sendBuyerConfirmation(emailData),
      sendOwnerNotification(emailData),
      sendDeliveryNotification(emailData),
    ]).catch(console.error);
  }

  // If payment failed, restore stock
  if (paymentStatus === "FAILED") {
    for (const item of order.items as { slug: string; qty: number }[]) {
      try {
        await db.rpc("increment_stock", { product_slug: item.slug, qty: item.qty });
      } catch {
        // non-critical
      }
    }
  }

  return NextResponse.json({ ok: true });
}
