"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden py-16 px-5" style={{ backgroundColor: "var(--navy)" }}>
      {/* Confetti bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {["10%", "25%", "50%", "75%", "90%"].map((x, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              left: x,
              top: `${20 + i * 15}%`,
              width: `${12 + i * 6}px`,
              height: `${12 + i * 6}px`,
              backgroundColor: ["var(--coral)", "var(--yellow)", "var(--mint)", "var(--sky)", "var(--lavender)"][i],
            }}
          />
        ))}
      </div>

      <div className="relative max-w-xl mx-auto text-center flex flex-col gap-5">
        <h2
          className="text-white fade-in-up"
          style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(26px, 4vw, 44px)" }}
        >
          Get 10% Off Your First Order
        </h2>
        <p className="fade-in-up" style={{ color: "var(--slate)" }}>
          Plus new arrivals, exclusive deals, and parenting tips straight to your inbox.
        </p>

        {submitted ? (
          <div
            className="py-4 px-6 rounded-2xl font-bold text-white"
            style={{ backgroundColor: "var(--mint)" }}
          >
            🎉 Check your inbox for your 10% off code!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 fade-in-up">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none border-2 border-transparent focus:border-[var(--coral)] bg-white/10 text-white placeholder:text-white/40 transition-colors"
              style={{ minHeight: "48px" }}
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full font-extrabold text-white text-sm whitespace-nowrap transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--coral)", minHeight: "48px" }}
            >
              Claim My 10% Off
            </button>
          </form>
        )}

        <p className="text-xs fade-in-up" style={{ color: "var(--slate)" }}>
          No spam. Unsubscribe any time. We're parents too.
        </p>
      </div>
    </section>
  );
}
