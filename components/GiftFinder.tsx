import Link from "next/link";

const STEPS = [
  { num: "1", label: "Pick an age",       href: "/products?category=baby-toddler" },
  { num: "2", label: "Choose interests",  href: "/products" },
  { num: "3", label: "Get matched",       href: "/products" },
];

export default function GiftFinder() {
  return (
    <section className="py-16" style={{ backgroundColor: "#EDE9FF" }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Left */}
          <div className="flex-1 flex flex-col gap-6">
            <h2
              className="fade-in-up"
              style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 4vw, 48px)", color: "var(--navy)" }}
            >
              Not Sure What to Get?
            </h2>
            <p className="text-base leading-relaxed fade-in-up" style={{ color: "var(--slate)", maxWidth: "420px" }}>
              Answer 3 quick questions and we'll find the perfect toy for any child.
            </p>

            {/* Steps */}
            <div className="flex gap-4 flex-wrap">
              {STEPS.map(({ num, label }) => (
                <div key={num} className="flex items-center gap-2 fade-in-up">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0"
                    style={{ backgroundColor: "var(--lavender)" }}
                  >
                    {num}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="self-start px-8 py-3.5 rounded-full text-white font-extrabold text-base transition-transform hover:scale-105 active:scale-95 inline-block"
              style={{ backgroundColor: "var(--coral)" }}
            >
              Find the Perfect Gift →
            </Link>
          </div>

          {/* Right — illustrated visual */}
          <div className="flex-shrink-0 flex items-center justify-center w-48 h-48 md:w-64 md:h-64 rounded-3xl relative" style={{ backgroundColor: "#DDD5FF" }}>
            <span style={{ fontSize: "96px" }}>🎁</span>
            {/* Decorative dots */}
            <span className="absolute top-3 right-3 text-2xl opacity-60">✨</span>
            <span className="absolute bottom-3 left-3 text-2xl opacity-60">⭐</span>
            <span className="absolute top-1/2 left-3 text-lg opacity-40">🎀</span>
          </div>
        </div>
      </div>
    </section>
  );
}
