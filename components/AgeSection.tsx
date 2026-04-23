import Link from "next/link";

const AGE_CARDS = [
  { range: "0–2",   label: "Babies & Toddlers", emoji: "🍼", sub: "Safe. Stimulating. Fun.",           from: "#3ECFAB", to: "#2AB89A", href: "/products?category=baby-toddler" },
  { range: "3–5",   label: "Preschool",          emoji: "🎨", sub: "Creative. Colourful. Curious.",     from: "#9B8FF5", to: "#7B6FD5", href: "/products?category=arts-crafts" },
  { range: "6–9",   label: "School Age",         emoji: "🧩", sub: "Challenging. Exciting. Rewarding.", from: "#4AB8FF", to: "#2A98DF", href: "/products?category=puzzles-games" },
  { range: "10–12", label: "Tweens",             emoji: "♟️", sub: "Bold. Complex. Brilliant.",         from: "#FF6B5B", to: "#E04B3B", href: "/products?category=puzzles-games" },
];

export default function AgeSection() {
  return (
    <section className="py-16" style={{ backgroundColor: "#FFF0D9" }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <h2
          className="text-center mb-2 fade-in-up"
          style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(26px, 4vw, 44px)", color: "var(--navy)" }}
        >
          Shop by Age
        </h2>
        <p className="text-center mb-10 fade-in-up" style={{ color: "var(--slate)" }}>
          Find exactly what they'll love — by age
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {AGE_CARDS.map(({ range, label, emoji, sub, from, to, href }) => (
            <Link
              key={range}
              href={href}
              className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-6 text-left transition-transform hover:scale-[1.03] hover:shadow-xl"
              style={{ background: `linear-gradient(145deg, ${from}, ${to})`, minHeight: "280px" }}
            >
              <span className="absolute top-6 right-6 opacity-90" style={{ fontSize: "64px" }}>{emoji}</span>
              <div className="relative z-10">
                <p className="font-extrabold text-white/80 text-sm mb-1">{label}</p>
                <p className="font-black text-white leading-none mb-2" style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(32px, 5vw, 52px)" }}>
                  Ages {range}
                </p>
                <p className="text-white/80 text-sm mb-4">{sub}</p>
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-white underline underline-offset-2">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
