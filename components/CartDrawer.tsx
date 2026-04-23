"use client";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CartDrawer() {
  const { items, count, total, removeItem, updateQty, closeDrawer, drawerOpen } = useCart();

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40" onClick={closeDrawer} />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-[70] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: "min(420px, 100vw)",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: "var(--coral)" }} />
            <h2 className="font-extrabold text-lg" style={{ fontFamily: "var(--font-fredoka)", color: "var(--navy)" }}>
              Your Cart {count > 0 && <span style={{ color: "var(--coral)" }}>({count})</span>}
            </h2>
          </div>
          <button onClick={closeDrawer} aria-label="Close cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} style={{ color: "var(--navy)" }} />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <span style={{ fontSize: "64px" }}>🧸</span>
            <p className="font-extrabold text-lg" style={{ color: "var(--navy)" }}>Your cart is empty</p>
            <p className="text-sm" style={{ color: "var(--slate)" }}>Add some toys to get started!</p>
            <button
              onClick={closeDrawer}
              className="mt-2 px-6 py-3 rounded-full text-white font-bold"
              style={{ backgroundColor: "var(--coral)" }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.map(({ product, qty }) => (
                <div key={product.slug} className="flex gap-4 items-start">
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
                    <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" sizes="80px" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-snug line-clamp-2 mb-1" style={{ color: "var(--navy)" }}>{product.name}</p>
                    <p className="text-xs mb-2" style={{ color: "var(--slate)" }}>Ages {product.ageRange}</p>

                    <div className="flex items-center justify-between gap-2">
                      {/* Qty stepper */}
                      <div className="flex items-center rounded-full border overflow-hidden" style={{ borderColor: "rgba(26,26,46,0.15)" }}>
                        <button onClick={() => updateQty(product.slug, qty - 1)} className="w-8 h-8 font-bold hover:bg-gray-100 transition-colors text-sm" style={{ color: "var(--navy)" }}>−</button>
                        <span className="w-7 text-center text-sm font-bold" style={{ color: "var(--navy)" }}>{qty}</span>
                        <button onClick={() => updateQty(product.slug, qty + 1)} className="w-8 h-8 font-bold hover:bg-gray-100 transition-colors text-sm" style={{ color: "var(--navy)" }}>+</button>
                      </div>

                      <span className="font-extrabold text-sm" style={{ color: "var(--navy)" }}>
                        R{((product.salePrice ?? product.price) * qty).toFixed(2)}
                      </span>

                      <button onClick={() => removeItem(product.slug)} aria-label="Remove item" className="p-1.5 rounded-full hover:bg-red-50 transition-colors">
                        <Trash2 size={15} style={{ color: "var(--slate)" }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t flex flex-col gap-4" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
              {/* Trust */}
              <div className="flex justify-center gap-4 text-xs" style={{ color: "var(--slate)" }}>
                <span>🚚 Free delivery over R500</span>
                <span>🔄 30-day returns</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="font-bold" style={{ color: "var(--slate)" }}>Subtotal</span>
                <span className="text-xl font-black" style={{ color: "var(--navy)" }}>R{total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-4 rounded-full text-white font-extrabold text-base text-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "var(--coral)" }}
              >
                Checkout — R{total.toFixed(2)}
              </Link>

              <button onClick={closeDrawer} className="text-sm text-center font-semibold underline underline-offset-2" style={{ color: "var(--slate)" }}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
