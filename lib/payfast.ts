import crypto from "crypto";

const SANDBOX_URL = "https://sandbox.payfast.co.za/eng/process";
const LIVE_URL = "https://www.payfast.co.za/eng/process";

export type PayFastData = {
  orderId: string;
  amount: number; // in ZAR
  itemName: string;
  firstName: string;
  lastName: string;
  email: string;
};

export function buildPayFastForm(data: PayFastData) {
  const isSandbox = process.env.NEXT_PUBLIC_PAYFAST_MODE === "sandbox";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const pfData: Record<string, string> = {
    merchant_id: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID!,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
    return_url: `${siteUrl}/checkout/success?order_id=${data.orderId}`,
    cancel_url: `${siteUrl}/checkout/cancelled`,
    notify_url: `${siteUrl}/api/payfast/notify`,
    name_first: data.firstName,
    name_last: data.lastName,
    email_address: data.email,
    m_payment_id: data.orderId,
    amount: data.amount.toFixed(2),
    item_name: data.itemName,
  };

  // Generate signature
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  const paramString = Object.entries(pfData)
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
    .join("&");

  const signatureString = passphrase
    ? `${paramString}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`
    : paramString;

  pfData.signature = crypto.createHash("md5").update(signatureString).digest("hex");

  return {
    url: isSandbox ? SANDBOX_URL : LIVE_URL,
    fields: pfData,
  };
}

export function validatePayFastSignature(
  pfData: Record<string, string>,
  pfParamString: string
): boolean {
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  const signatureString = passphrase
    ? `${pfParamString}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`
    : pfParamString;

  const calculated = crypto.createHash("md5").update(signatureString).digest("hex");
  return calculated === pfData.signature;
}
