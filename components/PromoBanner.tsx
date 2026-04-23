const COUNTDOWN = [
  { value: "02", label: "Days" },
  { value: "14", label: "Hours" },
  { value: "37", label: "Mins" },
];

export default function PromoBanner() {
  return (
    <section
      className="py-14 px-5"
      style={{ background: "linear-gradient(135deg, var(--coral) 0%, #FF9A3C 60%, var(--yellow) 100%)" }}
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2
            className="text-white font-black leading-tight mb-2"
            style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(26px, 4vw, 48px)" }}
          >
            🎉 It's Playtime — Up to 40% Off Selected Toys
          </h2>
          <p className="text-white/80 font-semibold">Hurry — offer ends soon!</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          {/* Countdown */}
          <div className="flex gap-3">
            {COUNTDOWN.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center bg-white/20 rounded-xl px-4 py-2 min-w-[60px]">
                <span className="text-white font-black text-2xl leading-none">{value}</span>
                <span className="text-white/80 text-xs font-semibold">{label}</span>
              </div>
            ))}
          </div>

          <button
            className="px-8 py-3.5 rounded-full font-extrabold text-base transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "white", color: "var(--coral)" }}
          >
            Shop the Sale →
          </button>
        </div>
      </div>
    </section>
  );
}
