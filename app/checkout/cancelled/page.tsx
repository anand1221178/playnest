import Link from "next/link";
import { X } from "lucide-react";

export default function CheckoutCancelled() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#FFE5E5" }}>
        <X size={36} style={{ color: "#E04B3B" }} strokeWidth={3} />
      </div>

      <h1
        className="mb-3"
        style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 5vw, 40px)", color: "var(--navy)" }}
      >
        Payment Cancelled
      </h1>
      <p className="text-base mb-8 max-w-md" style={{ color: "var(--slate)" }}>
        Your payment was not completed. No charges have been made. Your cart items are still saved — you can try again whenever you're ready.
      </p>

      <div className="flex gap-3">
        <Link
          href="/checkout"
          className="px-8 py-3.5 rounded-full text-white font-extrabold transition-transform hover:scale-105"
          style={{ backgroundColor: "var(--coral)" }}
        >
          Try Again
        </Link>
        <Link
          href="/products"
          className="px-8 py-3.5 rounded-full font-extrabold border-2 transition-colors hover:bg-[var(--navy)] hover:text-white"
          style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
