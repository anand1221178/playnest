import { Resend } from "resend";

let _resend: Resend | null = null;
function resend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

type OrderItem = {
  name: string;
  qty: number;
  price: number;
  image: string;
};

type OrderEmailData = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

function itemsTableHtml(items: OrderItem[]) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.qty}</td>
        <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:right;">R${(item.price * item.qty).toFixed(2)}</td>
      </tr>`
    )
    .join("");
}

function baseTemplate(title: string, body: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFF8ED;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="text-align:center;padding:24px 0;">
      <h1 style="margin:0;font-size:28px;color:#1A1A2E;">PlayNest</h1>
      <p style="margin:4px 0 0;color:#7C7CA0;font-size:14px;">Where Wonder Lives</p>
    </div>

    <!-- Content -->
    <div style="background:white;border-radius:16px;padding:32px;border:1px solid rgba(26,26,46,0.08);">
      <h2 style="margin:0 0 16px;font-size:22px;color:#1A1A2E;">${title}</h2>
      ${body}
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#7C7CA0;font-size:12px;">
      <p>PlayNest - South Africa's Favourite Toy Store</p>
      <p>Questions? Reply to this email and we'll help!</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBuyerConfirmation(data: OrderEmailData) {
  const body = `
    <p style="color:#7C7CA0;line-height:1.6;">
      Hi <strong style="color:#1A1A2E;">${data.firstName}</strong>, thanks for your order! We're getting your toys ready.
    </p>

    <div style="background:#FFF8ED;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:14px;color:#7C7CA0;">Order number</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#FF6B5B;">#${data.orderNumber}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="border-bottom:2px solid #1A1A2E;">
          <th style="padding:8px;text-align:left;font-size:13px;color:#1A1A2E;">Item</th>
          <th style="padding:8px;text-align:center;font-size:13px;color:#1A1A2E;">Qty</th>
          <th style="padding:8px;text-align:right;font-size:13px;color:#1A1A2E;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsTableHtml(data.items)}</tbody>
    </table>

    <div style="border-top:2px solid #1A1A2E;padding-top:12px;margin-top:8px;">
      <div style="display:flex;justify-content:space-between;margin:4px 0;">
        <span style="color:#7C7CA0;font-size:14px;">Subtotal</span>
        <span style="color:#1A1A2E;font-weight:600;font-size:14px;">R${data.subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin:4px 0;">
        <span style="color:#7C7CA0;font-size:14px;">Shipping</span>
        <span style="color:${data.shipping === 0 ? "#3ECFAB" : "#1A1A2E"};font-weight:600;font-size:14px;">${data.shipping === 0 ? "FREE" : `R${data.shipping.toFixed(2)}`}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin:8px 0 0;padding-top:8px;border-top:1px solid #f0f0f0;">
        <span style="color:#1A1A2E;font-weight:800;font-size:16px;">Total</span>
        <span style="color:#FF6B5B;font-weight:800;font-size:16px;">R${data.total.toFixed(2)}</span>
      </div>
    </div>

    <div style="background:#FFF8ED;border-radius:12px;padding:16px;margin:20px 0 0;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#1A1A2E;">Delivering to:</p>
      <p style="margin:4px 0 0;font-size:13px;color:#7C7CA0;line-height:1.5;">
        ${data.firstName} ${data.lastName}<br/>
        ${data.address}<br/>
        ${data.city}, ${data.province} ${data.postalCode}
      </p>
    </div>

    <p style="color:#7C7CA0;font-size:13px;margin-top:20px;line-height:1.5;">
      Your order will be dispatched within 1-2 business days. We'll send you a tracking number once it ships!
    </p>
  `;

  await resend().emails.send({
    from: "PlayNest <orders@playnest.co.za>",
    to: data.email,
    subject: `Order Confirmed! #${data.orderNumber}`,
    html: baseTemplate("Order Confirmed!", body),
  });
}

export async function sendOwnerNotification(data: OrderEmailData) {
  const body = `
    <p style="color:#7C7CA0;line-height:1.6;">
      New order from <strong style="color:#1A1A2E;">${data.firstName} ${data.lastName}</strong> (${data.email})
    </p>

    <div style="background:#E8FFF5;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:14px;color:#7C7CA0;">Order number</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#1A1A2E;">#${data.orderNumber}</p>
      <p style="margin:4px 0 0;font-size:16px;font-weight:800;color:#FF6B5B;">R${data.total.toFixed(2)}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="border-bottom:2px solid #1A1A2E;">
          <th style="padding:8px;text-align:left;font-size:13px;color:#1A1A2E;">Item</th>
          <th style="padding:8px;text-align:center;font-size:13px;color:#1A1A2E;">Qty</th>
          <th style="padding:8px;text-align:right;font-size:13px;color:#1A1A2E;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsTableHtml(data.items)}</tbody>
    </table>

    <div style="background:#FFF8ED;border-radius:12px;padding:16px;margin:20px 0 0;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#1A1A2E;">Ship to:</p>
      <p style="margin:4px 0 0;font-size:13px;color:#7C7CA0;line-height:1.5;">
        ${data.firstName} ${data.lastName}<br/>
        ${data.address}<br/>
        ${data.city}, ${data.province} ${data.postalCode}
      </p>
    </div>
  `;

  await resend().emails.send({
    from: "PlayNest Orders <orders@playnest.co.za>",
    to: process.env.ORDER_NOTIFICATION_EMAIL!,
    subject: `New Order #${data.orderNumber} - R${data.total.toFixed(2)}`,
    html: baseTemplate("New Order Received!", body),
  });
}

export async function sendDeliveryNotification(data: OrderEmailData) {
  const body = `
    <p style="color:#7C7CA0;line-height:1.6;">
      Please arrange collection/delivery for the following order:
    </p>

    <div style="background:#DAEEFF;border-radius:12px;padding:16px;margin:16px 0;">
      <p style="margin:0;font-size:14px;color:#7C7CA0;">Order number</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#1A1A2E;">#${data.orderNumber}</p>
    </div>

    <h3 style="font-size:14px;color:#1A1A2E;margin:20px 0 8px;">Items to ship:</h3>
    <table style="width:100%;border-collapse:collapse;margin:0 0 16px;">
      <thead>
        <tr style="border-bottom:2px solid #1A1A2E;">
          <th style="padding:8px;text-align:left;font-size:13px;color:#1A1A2E;">Item</th>
          <th style="padding:8px;text-align:center;font-size:13px;color:#1A1A2E;">Qty</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map((item) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #f0f0f0;font-size:13px;">${item.name}</td>
            <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;">${item.qty}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div style="background:#FFF8ED;border-radius:12px;padding:16px;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#1A1A2E;">Deliver to:</p>
      <p style="margin:4px 0 0;font-size:13px;color:#7C7CA0;line-height:1.5;">
        ${data.firstName} ${data.lastName}<br/>
        ${data.address}<br/>
        ${data.city}, ${data.province} ${data.postalCode}<br/>
        <strong>Email:</strong> ${data.email}
      </p>
    </div>
  `;

  const deliveryEmail = process.env.DELIVERY_COMPANY_EMAIL;
  if (!deliveryEmail) return; // Skip if no delivery email configured

  await resend().emails.send({
    from: "PlayNest Shipping <orders@playnest.co.za>",
    to: deliveryEmail,
    subject: `Ship Order #${data.orderNumber} - ${data.city}, ${data.province}`,
    html: baseTemplate("New Shipment Request", body),
  });
}
