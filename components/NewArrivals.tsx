import ProductCard from "./ProductCard";
import { getNewArrivals } from "@/lib/products";

export default function NewArrivals() {
  const products = getNewArrivals();
  return (
    <section className="py-16" style={{ backgroundColor: "var(--cream)" }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <h2
          className="text-center mb-2 fade-in-up"
          style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(26px, 4vw, 44px)", color: "var(--navy)" }}
        >
          Just Landed 🚀
        </h2>
        <p className="text-center mb-10 fade-in-up" style={{ color: "var(--slate)" }}>
          Fresh picks added this week
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
