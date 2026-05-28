"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import { ChevronRight, Lock, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    address: "", city: "", province: "", postalCode: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // PayFast redirect form
  const [pfAction, setPfAction] = useState("");
  const [pfFields, setPfFields] = useState<Record<string, string>>({});

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
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ slug: i.product.slug, qty: i.qty })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Something went wrong");
        setSubmitting(false);
        return;
      }

      // Set up PayFast redirect form and auto-submit
      setPfAction(data.payfast.url);
      setPfFields(data.payfast.fields);

      // Auto-submit after state updates
      setTimeout(() => formRef.current?.submit(), 100);
    } catch {
      setServerError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const shipping = total >= 500 ? 0 : 75;
  const grandTotal = total + shipping;

  // If PayFast form is ready, render hidden auto-submit form
  if (pfAction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "var(--cream)" }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--coral)", borderTopColor: "transparent" }} />
        <p className="font-bold" style={{ color: "var(--navy)" }}>Redirecting to PayFast...</p>
        <form ref={formRef} action={pfAction} method="POST">
          {Object.entries(pfFields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
        </form>
      </div>
    );
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

  const fieldClass = (field: keyof typeof form) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--coral)]"}`;

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

        <h1 className="mb-8" style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 4vw, 40px)", color: "var(--navy)" }}>
          Checkout
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT: form */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Contact */}
              <section className="bg-white rounded-2xl p-6 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <h2 className="font-extrabold text-base mb-1" style={{ color: "var(--navy)" }}>Contact</h2>
                <p className="text-xs mb-5" style={{ color: "var(--slate)" }}>
                  Your order confirmation will be sent here — no account needed.
                </p>
                <div className="flex gap-4 flex-wrap sm:flex-nowrap mb-4">
                  <div className="flex-1 min-w-0">
                    <label htmlFor="firstName" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>First name</label>
                    <input id="firstName" placeholder="Lerato" value={form.firstName} onChange={set("firstName")} className={fieldClass("firstName")} style={{ color: "var(--navy)" }} />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label htmlFor="lastName" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>Last name</label>
                    <input id="lastName" placeholder="Mokoena" value={form.lastName} onChange={set("lastName")} className={fieldClass("lastName")} style={{ color: "var(--navy)" }} />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="w-full">
                  <label htmlFor="email" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>Email address</label>
                  <input id="email" type="email" placeholder="lerato@example.com" value={form.email} onChange={set("email")} className={fieldClass("email")} style={{ color: "var(--navy)" }} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </section>

              {/* Delivery */}
              <section className="bg-white rounded-2xl p-6 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <h2 className="font-extrabold text-base mb-5" style={{ color: "var(--navy)" }}>Delivery address</h2>
                <div className="flex flex-col gap-4">
                  <div className="w-full">
                    <label htmlFor="address" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>Street address</label>
                    <input id="address" placeholder="12 Main Street, Apt 3" value={form.address} onChange={set("address")} className={fieldClass("address")} style={{ color: "var(--navy)" }} />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                    <div className="flex-1 min-w-0">
                      <label htmlFor="city" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>City</label>
                      <input id="city" placeholder="Johannesburg" value={form.city} onChange={set("city")} className={fieldClass("city")} style={{ color: "var(--navy)" }} />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <label htmlFor="province" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>Province</label>
                      <input id="province" placeholder="Gauteng" value={form.province} onChange={set("province")} className={fieldClass("province")} style={{ color: "var(--navy)" }} />
                      {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label htmlFor="postalCode" className="block text-xs font-bold mb-1.5" style={{ color: "var(--navy)" }}>Postal code</label>
                    <input id="postalCode" placeholder="2000" value={form.postalCode} onChange={set("postalCode")} className={fieldClass("postalCode")} style={{ color: "var(--navy)" }} />
                    {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </section>

              {/* Payment info box */}
              <section className="bg-white rounded-2xl p-6 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-extrabold text-base" style={{ color: "var(--navy)" }}>Payment</h2>
                  <div className="flex items-center gap-1 ml-auto text-xs font-semibold" style={{ color: "var(--mint)" }}>
                    <Lock size={12} /> Secure & encrypted
                  </div>
                </div>
                <p className="text-sm mb-4" style={{ color: "var(--slate)" }}>
                  You'll be securely redirected to PayFast to complete your payment. We accept Visa, Mastercard, and instant EFT.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {["Visa", "Mastercard", "Instant EFT", "PayFast"].map((p) => (
                    <span key={p} className="text-xs font-bold px-2.5 py-1 rounded border" style={{ borderColor: "rgba(26,26,46,0.12)", color: "var(--slate)" }}>{p}</span>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT: order summary */}
            <div className="lg:w-[360px] flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 border sticky top-24" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                <h2 className="font-extrabold text-base mb-5 flex items-center gap-2" style={{ color: "var(--navy)" }}>
                  <ShoppingBag size={18} style={{ color: "var(--coral)" }} /> Order summary
                </h2>

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

                {serverError && (
                  <p className="text-sm text-red-500 mt-3 text-center font-semibold">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-5 py-4 rounded-full text-white font-extrabold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "var(--coral)" }}
                >
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><Lock size={16} /> Pay R{grandTotal.toFixed(2)} with PayFast</>
                  )}
                </button>

                <p className="text-xs text-center mt-3" style={{ color: "var(--slate)" }}>
                  You'll be redirected to PayFast's secure payment page
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}
