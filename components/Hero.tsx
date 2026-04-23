"use client";
import Image from "next/image";

const HERO_PRODUCTS = [
  {
    name: "Shape Sorter Gear Box",
    price: "R199.99",
    image: "/products/giggles/shape-sorter-gear-box/1.png",
    bg: "#E8FFF5",
    rotate: "-8deg",
    zIndex: 3,
    translateX: "-80px",
    translateY: "0",
  },
  {
    name: "Soap Making Kit",
    price: "R349.99",
    image: "/products/handycrafts/soap-making-kit/1.png",
    bg: "#EDE9FF",
    rotate: "4deg",
    zIndex: 2,
    translateX: "0",
    translateY: "40px",
  },
  {
    name: "Othello Classic",
    price: "R349.99",
    image: "/products/games/othello-classic/1.png",
    bg: "#DAEEFF",
    rotate: "-3deg",
    zIndex: 1,
    translateX: "80px",
    translateY: "0",
  },
];

const Confetti = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
    <circle cx="8%"  cy="15%" r="6"  fill="#FF6B5B" opacity="0.18" />
    <circle cx="92%" cy="20%" r="8"  fill="#FFD447" opacity="0.22" />
    <circle cx="75%" cy="80%" r="5"  fill="#3ECFAB" opacity="0.2"  />
    <circle cx="20%" cy="85%" r="7"  fill="#4AB8FF" opacity="0.18" />
    <circle cx="50%" cy="5%"  r="4"  fill="#9B8FF5" opacity="0.2"  />
    <rect x="85%" y="45%" width="10" height="10" rx="2" fill="#FFD447" opacity="0.2"  transform="rotate(30 10 10)" />
    <rect x="12%" y="50%" width="8"  height="8"  rx="2" fill="#FF6B5B" opacity="0.15" transform="rotate(-20 4 4)" />
    <text x="5%"  y="40%" fontSize="16" opacity="0.15" fill="#FFD447">★</text>
    <text x="90%" y="65%" fontSize="20" opacity="0.12" fill="#FF6B5B">★</text>
    <text x="30%" y="10%" fontSize="18" opacity="0.12" fill="#4AB8FF">★</text>
    <text x="78%" y="30%" fontSize="12" opacity="0.18" fill="#FFD447">✦</text>
  </svg>
);

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--cream)", minHeight: "600px" }}>
      <Confetti />
      <div className="relative max-w-[1280px] mx-auto px-5 md:px-10 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">

        {/* LEFT */}
        <div className="flex-1 flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: "#FFF0D9", color: "var(--coral)" }}>
            ✨ New Arrivals Just Landed
          </div>

          <h1
            className="leading-tight"
            style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(38px, 6vw, 72px)", color: "var(--navy)", lineHeight: 1.1 }}
          >
            Toys That<br />
            <span style={{ color: "var(--coral)" }}>Spark Real Joy</span>
          </h1>

          <p className="text-lg" style={{ color: "var(--slate)", maxWidth: "480px", lineHeight: 1.7 }}>
            Hundreds of carefully chosen toys for ages 0–12. Fast delivery, free returns, and a smile guaranteed.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="/products" className="px-8 py-3.5 rounded-full text-white font-extrabold text-base transition-transform hover:scale-105 active:scale-95 inline-block" style={{ backgroundColor: "var(--coral)" }}>
              Shop Now
            </a>
            <a href="/products?category=baby-toddler" className="px-8 py-3.5 rounded-full font-extrabold text-base border-2 transition-colors hover:bg-[var(--navy)] hover:text-white inline-block" style={{ borderColor: "var(--navy)", color: "var(--navy)" }}>
              Shop by Age
            </a>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            {[
              { icon: "⭐", text: "10,000+ Happy Families" },
              { icon: "🚚", text: "Free Delivery Over R500" },
              { icon: "🔄", text: "30-Day Free Returns" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--navy)" }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — real product card collage */}
        <div className="flex-1 relative flex items-center justify-center" style={{ minHeight: "380px" }}>
          {HERO_PRODUCTS.map((p, i) => (
            <div
              key={p.name}
              className={`absolute bg-white rounded-2xl p-4 shadow-xl flex flex-col items-center gap-2 w-44 animate-float-${i + 1}`}
              style={{
                zIndex: p.zIndex,
                transform: `rotate(${p.rotate}) translate(${p.translateX}, ${p.translateY})`,
              }}
            >
              <div className="w-full rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: p.bg, height: "110px" }}>
                <Image src={p.image} alt={p.name} width={100} height={100} className="object-contain w-full h-full p-2" />
              </div>
              <p className="text-xs font-bold text-center leading-tight" style={{ color: "var(--navy)" }}>{p.name}</p>
              <span className="text-sm font-extrabold" style={{ color: "var(--coral)" }}>{p.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
