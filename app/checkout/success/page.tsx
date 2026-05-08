"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Check } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "var(--mint)" }}>
        <Check size={36} className="text-white" strokeWidth={3} />
      </div>

      <h1
        className="mb-3"
        style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 5vw, 48px)", color: "var(--navy)" }}
      >
        Payment Successful!
      </h1>
      <p className="text-base mb-2 max-w-md" style={{ color: "var(--slate)" }}>
        Your order has been placed and confirmed. We've sent a confirmation email with all the details.
      </p>
      <p className="text-sm mb-8 max-w-md" style={{ color: "var(--slate)" }}>
        Your toys will be dispatched within 1-2 business days. We'll email you a tracking number once it ships!
      </p>

      {orderId && (
        <p className="text-sm mb-6" style={{ color: "var(--slate)" }}>
          Order reference: <strong style={{ color: "var(--coral)" }}>{orderId}</strong>
        </p>
      )}

      <Link
        href="/products"
        className="px-8 py-3.5 rounded-full text-white font-extrabold transition-transform hover:scale-105"
        style={{ backgroundColor: "var(--coral)" }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
