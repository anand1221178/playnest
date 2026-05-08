import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { buildPayFastForm } from "@/lib/payfast";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, email, address, city, province, postalCode, items } = body;

  // Validate required fields
  if (!firstName || !lastName || !email || !address || !city || !province || !postalCode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Verify stock & prices from DB
  const slugs = items.map((i: { slug: string }) => i.slug);
  const { data: products, error: prodError } = await db
    .from("products")
    .select("*")
    .in("slug", slugs);

  if (prodError || !products) {
    return NextResponse.json({ error: "Failed to verify products" }, { status: 500 });
  }

  // Build verified order items
  const orderItems = [];
  for (const cartItem of items) {
    const product = products.find((p: { slug: string }) => p.slug === cartItem.slug);
    if (!product) {
      return NextResponse.json({ error: `Product ${cartItem.slug} not found` }, { status: 400 });
    }
    if (product.stock < cartItem.qty) {
      return NextResponse.json(
        { error: `${product.name} only has ${product.stock} in stock` },
        { status: 400 }
      );
    }
    orderItems.push({
      slug: product.slug,
      name: product.name,
      qty: cartItem.qty,
      price: product.sale_price || product.price,
      image: product.images[0],
    });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 500 ? 0 : 75;
  const total = subtotal + shipping;

  // Generate order number
  const orderNumber = `PN${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

  // Create order in DB
  const { data: order, error: orderError } = await db
    .from("orders")
    .insert({
      order_number: orderNumber,
      status: "pending",
      first_name: firstName,
      last_name: lastName,
      email,
      address,
      city,
      province,
      postal_code: postalCode,
      items: orderItems,
      subtotal,
      shipping,
      total,
      payment_status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  // Decrement stock
  for (const item of orderItems) {
    try {
      await db.rpc("decrement_stock", { product_slug: item.slug, qty: item.qty });
    } catch {
      // Non-critical — stock will be verified again on payment confirmation
    }
  }

  // Build PayFast payment form data
  const itemName =
    orderItems.length === 1
      ? orderItems[0].name
      : `${orderItems.length} items from PlayNest`;

  const payfast = buildPayFastForm({
    orderId: order.id,
    amount: total,
    itemName,
    firstName,
    lastName,
    email,
  });

  return NextResponse.json({
    orderId: order.id,
    orderNumber,
    payfast,
  });
}
