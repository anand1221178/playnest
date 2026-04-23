"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Check, ChevronRight, Lock, ShoppingBag } from "lucide-react";

type OrderData = {
  orderNumber: string;
  email: string;
  firstName: string;
};

// ─── Confirmation screen ────────────────────────────────────────────────────
function Confirmation({ order, total }: { order: OrderData; total: number }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "var(--mint)" }}>
        <Check size={36} className="text-white" strokeWidth={3} />
      </div>

      <h1
        className="mb-3"
        style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 5vw, 48px)", color: "var(--navy)" }}
      >
        Order Confirmed! 🎉
      </h1>
      <p className="text-base mb-2 max-w-md" style={{ color: "var(--slate)" }}>
        Thanks, <strong style={{ color: "var(--navy)" }}>{order.firstName}</strong>! Your order{" "}
        <strong style={{ color: "var(--coral)" }}>#{order.orderNumber}</strong> has been placed.
      </p>
      <p className="text-sm mb-8 max-w-md" style={{ color: "var(--slate)" }}>
        We've sent a confirmation to <strong>{order.email}</strong>. Your order will be dispatched within 1–2 business days.
      </p>

      <div
        className="bg-white rounded-2xl p-6 mb-8 text-left max-w-sm w-full border"
        style={{ borderColor: "rgba(26,26,46,0.08)" }}
      >
        <div className="flex justify-between text-sm font-semibold mb-2" style={{ color: "var(--slate)" }}>
          <span>Order number</span>
          <span style={{ color: "var(--navy)" }}>#{order.orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold mb-2" style={{ color: "var(--slate)" }}>
          <span>Email</span>
          <span style={{ color: "var(--navy)" }}>{order.email}</span>
        </div>
        <div className="flex justify-between text-sm font-bold border-t pt-3 mt-2" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <span style={{ color: "var(--navy)" }}>Total paid</span>
          <span className="text-base font-black" style={{ color: "var(--coral)" }}>R{total.toFixed(2)}</span>
        </div>
      </div>

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

// ─── Checkout page ───────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [confirmed, setConfirmed]   = useState(false);
  const [orderData, setOrderData]   = useState<OrderData | null>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    address: "", city: "", province: "", postalCode: "",
    cardNumber: "", cardExpiry: "", cardCvc: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.firstName.trim())   e.firstName   = "Required";
    if (!form.lastName.trim())    e.lastName    = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.address.trim())     e.address     = "Required";
    if (!form.city.trim())        e.city        = "Required";
    if (!form.province.trim())    e.province    = "Required";
    if (!form.postalCode.trim())  e.postalCode  = "Required";
    if (form.cardNumber.replace(/\s/g, "").length !== 16) e.cardNumber = "Enter 16-digit card number";
    if (!form.cardExpiry.match(/^\d{2}\/\d{2}$/)) e.cardExpiry = "MM/YY format";
    if (form.cardCvc.length < 3) e.cardCvc = "3 digits required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    // Simulate order processing
    setTimeout(() => {
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderData({ orderNumber, email: form.email, firstName: form.firstName });
      clearCart();
      setConfirmed(true);
      setSubmitting(false);
    }, 1200);
  };

  const shipping = total >= 500 ? 0 : 75;
  const grandTotal = total + shipping;

  if (confirmed && orderData) {
    return <Confirmation order={orderData} total={grandTotal} />;
  }

  if (items.length === 0) {
    return (
      <main>
        <AnnouncementBar />
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-5">
          <span style={{ fontSize: "64px" }}>🛒</span>
          <h2 style={{ fontFamily: "var(--font-fredoka)", fontSize: "32px", color: "var(--navy)" }}>Your cart is empty</h2>
          <Link href="/products" className="px-6 py-3 rounded-full text-white font-bold" style={{ backgroundColor: "var(--coral)" }}>
            Browse Toys
          </Link>
        </div>
      </main>
    );
  }

  const Field = ({ label, id, field, placeholder, type = "text", half = false }: {
    label: string; id: string; field: keyof typeof form; placeholder: string; type?: string; half?: boolean;
  }) => (
    <div className={half ? "flex-1 min-w-0" : "w-full"}>
      <label htmlFor={id} className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>{label}</label>
      <input
        id={id} type={type} placeholder={placeholder} value={form[field]}
        onChange={set(field)}
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--coral)]"}`}
        style={{ color: "var(--navy)" }}
      />
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--slate)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:underline">Shop</Link>
          <ChevronRight size={14} />
          <span style={{ color: "var(--navy)" }}>Checkout</span>
        </div>

        <h1
          className="mb-8"
          style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 4vw, 40px)", color: "var(--navy)" }}
        >
          Checkout
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── LEFT: form ─────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col gap-8">

              {/* Contact — email is the only "account" thing we need */}
              <section className="bg-white rounded-2xl p-6 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <h2 className="font-extrabold text-base mb-1" style={{ color: "var(--navy)" }}>Contact</h2>
                <p className="text-xs mb-5" style={{ color: "var(--slate)" }}>
                  Your order confirmation will be sent here — no account needed.
                </p>
                <div className="flex gap-4 flex-wrap sm:flex-nowrap mb-4">
                  <Field label="First name" id="firstName" field="firstName" placeholder="Lerato" half />
                  <Field label="Last name"  id="lastName"  field="lastName"  placeholder="Mokoena" half />
                </div>
                <Field label="Email address" id="email" field="email" placeholder="lerato@example.com" type="email" />
              </section>

              {/* Delivery */}
              <section className="bg-white rounded-2xl p-6 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <h2 className="font-extrabold text-base mb-5" style={{ color: "var(--navy)" }}>Delivery address</h2>
                <div className="flex flex-col gap-4">
                  <Field label="Street address" id="address" field="address" placeholder="12 Main Street, Apt 3" />
                  <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                    <Field label="City"    id="city"       field="city"       placeholder="Johannesburg" half />
                    <Field label="Province" id="province" field="province"   placeholder="Gauteng" half />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <Field label="Postal code" id="postalCode" field="postalCode" placeholder="2000" />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="bg-white rounded-2xl p-6 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="font-extrabold text-base" style={{ color: "var(--navy)" }}>Payment</h2>
                  <div className="flex items-center gap-1 ml-auto text-xs font-semibold" style={{ color: "var(--mint)" }}>
                    <Lock size={12} /> Secure & encrypted
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>Card number</label>
                    <input
                      id="cardNumber" type="text" placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const spaced = v.replace(/(.{4})/g, "$1 ").trim();
                        setForm((f) => ({ ...f, cardNumber: spaced }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.cardNumber ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--coral)]"}`}
                      style={{ color: "var(--navy)" }}
                    />
                    {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="cardExpiry" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>Expiry date</label>
                      <input
                        id="cardExpiry" type="text" placeholder="MM/YY"
                        value={form.cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                          setForm((f) => ({ ...f, cardExpiry: v }));
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.cardExpiry ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--coral)]"}`}
                        style={{ color: "var(--navy)" }}
                      />
                      {errors.cardExpiry && <p className="text-xs text-red-500 mt-1">{errors.cardExpiry}</p>}
                    </div>
                    <div className="w-28">
                      <label htmlFor="cardCvc" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>CVC</label>
                      <input
                        id="cardCvc" type="text" placeholder="123"
                        maxLength={4}
                        value={form.cardCvc}
                        onChange={(e) => setForm((f) => ({ ...f, cardCvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.cardCvc ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--coral)]"}`}
                        style={{ color: "var(--navy)" }}
                      />
                      {errors.cardCvc && <p className="text-xs text-red-500 mt-1">{errors.cardCvc}</p>}
                    </div>
                  </div>
                </div>

                {/* Payment logos */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {["Visa", "Mastercard", "PayFast", "Yoco"].map((p) => (
                    <span key={p} className="text-xs font-bold px-2.5 py-1 rounded border" style={{ borderColor: "rgba(26,26,46,0.12)", color: "var(--slate)" }}>{p}</span>
                  ))}
                </div>
              </section>
            </div>

            {/* ── RIGHT: order summary ────────────────────────────────────── */}
            <div className="lg:w-[360px] flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 border sticky top-24" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <h2 className="font-extrabold text-base mb-5 flex items-center gap-2" style={{ color: "var(--navy)" }}>
                  <ShoppingBag size={18} style={{ color: "var(--coral)" }} /> Order summary
                </h2>

                {/* Items */}
                <div className="flex flex-col gap-4 mb-5">
                  {items.map(({ product, qty }) => (
                    <div key={product.slug} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl bg-gray-50 flex-shrink-0 border overflow-hidden" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                        <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" sizes="56px" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black text-white flex items-center justify-center" style={{ backgroundColor: "var(--coral)" }}>{qty}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold leading-snug line-clamp-2" style={{ color: "var(--navy)" }}>{product.name}</p>
                        <p className="text-xs" style={{ color: "var(--slate)" }}>Ages {product.ageRange}</p>
                      </div>
                      <span className="text-sm font-extrabold flex-shrink-0" style={{ color: "var(--navy)" }}>
                        R{((product.salePrice ?? product.price) * qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                  <div className="flex justify-between text-sm" style={{ color: "var(--slate)" }}>
                    <span>Subtotal</span>
                    <span className="font-semibold" style={{ color: "var(--navy)" }}>R{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: "var(--slate)" }}>
                    <span>Shipping</span>
                    <span className="font-semibold" style={{ color: shipping === 0 ? "var(--mint)" : "var(--navy)" }}>
                      {shipping === 0 ? "FREE" : `R${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs" style={{ color: "var(--slate)" }}>
                      Add R{(500 - total).toFixed(2)} more for free delivery
                    </p>
                  )}
                  <div className="flex justify-between text-base font-extrabold pt-3 mt-1 border-t" style={{ borderColor: "rgba(26,26,46,0.08)", color: "var(--navy)" }}>
                    <span>Total</span>
                    <span style={{ color: "var(--coral)" }}>R{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-5 py-4 rounded-full text-white font-extrabold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "var(--coral)" }}
                >
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><Lock size={16} /> Pay R{grandTotal.toFixed(2)}</>
                  )}
                </button>

                <p className="text-xs text-center mt-3" style={{ color: "var(--slate)" }}>
                  🔒 Your payment is secure and encrypted
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}
