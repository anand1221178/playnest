const REVIEWS = [
  {
    name: "Lerato M.",
    role: "Mum of a 4-year-old",
    initials: "LM",
    color: "#FFE4E1",
    quote: "My 4-year-old hasn't put it down since Christmas. Worth every cent.",
    product: "Wooden Rainbow Stacker",
    rating: 5,
  },
  {
    name: "James K.",
    role: "Dad of two",
    initials: "JK",
    color: "#DAEEFF",
    quote: "Delivery was lightning fast and packaging was beautiful. My kids were SO excited.",
    product: "Magnetic Building Tiles",
    rating: 5,
  },
  {
    name: "Priya N.",
    role: "Grandmother",
    initials: "PN",
    color: "#EDE9FF",
    quote: "Ordered as a gift. PlayNest made it so easy. Will definitely be my go-to for grandkids.",
    product: "Play Kitchen Set",
    rating: 5,
  },
];

export default function Reviews() {
  const stars = (n: number) =>
    Array.from({ length: n }, (_, i) => (
      <span key={i} style={{ color: "var(--yellow)" }}>★</span>
    ));

  return (
    <section className="py-16" style={{ backgroundColor: "var(--cream)" }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        {/* Hero rating */}
        <div className="text-center mb-12 fade-in-up">
          <div className="text-3xl mb-2">⭐⭐⭐⭐⭐</div>
          <h2
            style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(22px, 3vw, 36px)", color: "var(--navy)" }}
          >
            Rated 4.9/5 from over 2,400 reviews
          </h2>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(({ name, role, initials, color, quote, product, rating }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm border fade-in-up"
              style={{ borderColor: "rgba(26,26,46,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0"
                  style={{ backgroundColor: color, color: "var(--navy)" }}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-extrabold text-sm" style={{ color: "var(--navy)" }}>{name}</p>
                  <p className="text-xs" style={{ color: "var(--slate)" }}>{role}</p>
                </div>
              </div>

              <div className="flex gap-0.5">{stars(rating)}</div>

              <p className="text-sm leading-relaxed italic" style={{ color: "var(--navy)" }}>
                &ldquo;{quote}&rdquo;
              </p>

              <div
                className="self-start text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: "var(--cream)", color: "var(--slate)" }}
              >
                Bought: {product}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
