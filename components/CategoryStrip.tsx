const CATEGORIES = [
  { label: "Baby & Toddler",    emoji: "🍼", bg: "#D4F5EC" },
  { label: "Building & STEM",   emoji: "🧱", bg: "#DAEEFF" },
  { label: "Outdoor Play",      emoji: "🌿", bg: "#D6F5D6" },
  { label: "Arts & Crafts",     emoji: "🎨", bg: "#EDE9FF" },
  { label: "Dolls & Figures",   emoji: "🪆", bg: "#FFE4E1" },
  { label: "Puzzles & Games",   emoji: "🧩", bg: "#FFF5CC" },
  { label: "Vehicles & Trains", emoji: "🚂", bg: "#DAEEFF" },
  { label: "Plush & Soft Toys", emoji: "🐻", bg: "#FFE4F0" },
];

export default function CategoryStrip() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <h2
          className="text-center mb-2 fade-in-up"
          style={{
            fontFamily: "var(--font-fredoka)",
            fontSize: "clamp(26px, 4vw, 44px)",
            color: "var(--navy)",
          }}
        >
          Shop by Category
        </h2>
        <p className="text-center mb-8 fade-in-up" style={{ color: "var(--slate)" }}>
          Find the perfect toy for every kind of play
        </p>

        {/* Scrollable row */}
        <div className="flex gap-4 overflow-x-auto scroll-hide pb-2 justify-start md:justify-center flex-nowrap md:flex-wrap">
          {CATEGORIES.map(({ label, emoji, bg }) => (
            <button
              key={label}
              className="flex-shrink-0 flex flex-col items-center justify-center gap-3 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer border border-transparent hover:border-white/60"
              style={{ width: "140px", height: "140px", backgroundColor: bg }}
            >
              <span style={{ fontSize: "48px", lineHeight: 1 }}>{emoji}</span>
              <span className="text-xs font-bold text-center leading-tight px-2" style={{ color: "var(--navy)" }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
