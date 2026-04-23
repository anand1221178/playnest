const PILLARS = [
  {
    icon: "🔒",
    heading: "Safe & Tested",
    body: "Every toy meets strict safety standards. We only stock what we'd give our own kids.",
  },
  {
    icon: "🚚",
    heading: "Fast Delivery",
    body: "Order before 2pm for same-day dispatch. Free delivery on orders over R500.",
  },
  {
    icon: "💛",
    heading: "Curated with Care",
    body: "No cheap fillers. Every toy is hand-picked by parents and child development experts.",
  },
  {
    icon: "🔄",
    heading: "Hassle-Free Returns",
    body: "Changed your mind? Return within 30 days, no questions asked.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <h2
          className="text-center mb-12 fade-in-up"
          style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(26px, 4vw, 44px)", color: "var(--navy)" }}
        >
          Why Parents Love PlayNest
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map(({ icon, heading, body }) => (
            <div key={heading} className="flex flex-col items-center text-center gap-3 fade-in-up">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: "var(--cream)" }}
              >
                {icon}
              </div>
              <h3 className="font-extrabold text-lg" style={{ color: "var(--navy)" }}>
                {heading}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--slate)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
