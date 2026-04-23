"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

export type { Product };

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded]   = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.round(n) ? "var(--yellow)" : "#E0E0E0", fontSize: "13px" }}>★</span>
    ));

  const thumb = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
      style={{ borderColor: "rgba(26,26,46,0.08)" }}
    >
      {/* Image */}
      <div className="relative bg-gray-50" style={{ height: "200px" }}>
        <Image
          src={thumb}
          alt={product.name}
          fill
          className="object-contain p-3"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />

        {product.badge && (
          <span
            className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-extrabold text-white z-10"
            style={{ backgroundColor: product.badge === "SALE" ? "var(--coral)" : "var(--mint)" }}
          >
            {product.badge}
          </span>
        )}

        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-transform hover:scale-110"
        >
          <Heart size={15} fill={wished ? "var(--coral)" : "none"} stroke={wished ? "var(--coral)" : "var(--slate)"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="self-start text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#D4F5EC", color: "#0D9E7A" }}>
          Ages {product.ageRange}
        </span>

        <h3 className="text-sm font-extrabold leading-snug line-clamp-2" style={{ color: "var(--navy)" }}>
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex">{stars(product.rating)}</div>
          <span className="text-xs" style={{ color: "var(--slate)" }}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          {product.salePrice ? (
            <>
              <span className="font-extrabold text-base" style={{ color: "var(--coral)" }}>R{product.salePrice.toFixed(2)}</span>
              <span className="text-sm line-through" style={{ color: "var(--slate)" }}>R{product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-extrabold text-base" style={{ color: "var(--navy)" }}>R{product.price.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAdd}
          className="w-full py-2.5 rounded-full text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
          style={{ backgroundColor: added ? "var(--mint)" : "var(--coral)" }}
        >
          {added ? <><Check size={15} /> Added!</> : <><ShoppingCart size={15} /> Add to Cart</>}
        </button>
      </div>
    </Link>
  );
}
