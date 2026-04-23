"use client";
import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingCart, Heart, Check, Star } from "lucide-react";
import { PRODUCTS, getProductBySlug } from "@/lib/products";
import { useCart } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import ProductCard from "@/components/ProductCard";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const { addItem } = useCart();
  const [added, setAdded]         = useState(false);
  const [wished, setWished]       = useState(false);
  const [qty, setQty]             = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = PRODUCTS
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const stars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} fill={i < Math.round(n) ? "var(--yellow)" : "none"} stroke={i < Math.round(n) ? "var(--yellow)" : "#ccc"} />
    ));

  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--slate)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:underline">All Toys</Link>
          <span>/</span>
          <span style={{ color: "var(--navy)" }}>{product.name}</span>
        </div>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden" style={{ height: "420px" }}>
              <Image
                src={product.images[activeImg]}
                alt={`${product.name} — image ${activeImg + 1}`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.badge && (
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded text-sm font-extrabold text-white z-10"
                  style={{ backgroundColor: product.badge === "SALE" ? "var(--coral)" : "var(--mint)" }}
                >
                  {product.badge}
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImg === i ? "" : "opacity-60 hover:opacity-100"}`}
                    style={{ borderColor: activeImg === i ? "var(--coral)" : "rgba(26,26,46,0.12)" }}
                  >
                    <Image src={src} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: "var(--coral)" }}>{product.brand}</p>
              <h1
                className="leading-tight mb-3"
                style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(26px, 4vw, 40px)", color: "var(--navy)" }}
              >
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-0.5">{stars(product.rating)}</div>
                <span className="text-sm font-semibold" style={{ color: "var(--slate)" }}>
                  {product.rating} · {product.reviews} reviews
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#D4F5EC", color: "#0D9E7A" }}
                >
                  Ages {product.ageRange}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-black" style={{ color: "var(--coral)" }}>R{product.salePrice.toFixed(2)}</span>
                  <span className="text-xl line-through" style={{ color: "var(--slate)" }}>R{product.price.toFixed(2)}</span>
                  <span className="text-sm font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "#FFE4E1", color: "var(--coral)" }}>
                    Save R{(product.price - product.salePrice).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black" style={{ color: "var(--navy)" }}>R{product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-base leading-relaxed" style={{ color: "var(--slate)" }}>
              {product.description}
            </p>

            {/* Features */}
            <ul className="flex flex-col gap-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--navy)" }}>
                  <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--mint)" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Qty + CTA */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              {/* Quantity */}
              <div className="flex items-center gap-0 rounded-full border overflow-hidden" style={{ borderColor: "rgba(26,26,46,0.15)" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-11 text-lg font-bold hover:bg-gray-100 transition-colors" style={{ color: "var(--navy)" }}>−</button>
                <span className="w-10 text-center font-bold text-sm" style={{ color: "var(--navy)" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-10 h-11 text-lg font-bold hover:bg-gray-100 transition-colors" style={{ color: "var(--navy)" }}>+</button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 py-3.5 rounded-full text-white font-extrabold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: added ? "var(--mint)" : "var(--coral)", minWidth: "160px" }}
              >
                {added ? <><Check size={18} /> Added to Cart!</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </button>

              <button
                onClick={() => setWished(!wished)}
                aria-label="Add to wishlist"
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors"
                style={{ borderColor: wished ? "var(--coral)" : "rgba(26,26,46,0.15)" }}
              >
                <Heart size={18} fill={wished ? "var(--coral)" : "none"} stroke={wished ? "var(--coral)" : "var(--slate)"} />
              </button>
            </div>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap gap-4 pt-2 border-t" style={{ borderColor: "rgba(26,26,46,0.08)" }}>
              {["🚚 Free delivery over R500", "🔄 30-day free returns", "🔒 Safe & tested"].map((t) => (
                <span key={t} className="text-xs font-semibold" style={{ color: "var(--slate)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2
              className="mb-8 fade-in-up"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(22px, 3vw, 36px)", color: "var(--navy)" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
