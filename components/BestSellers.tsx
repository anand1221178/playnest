import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export default async function BestSellers() {
  const products = await getFeaturedProducts();
  return (
    <section className="py-16" style={{ backgroundColor: "var(--cream)" }}>
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <h2
          className="text-center mb-2 fade-in-up"
          style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(26px, 4vw, 44px)", color: "var(--navy)" }}
        >
          Loved by Kids Everywhere
        </h2>
        <p className="text-center mb-10 fade-in-up" style={{ color: "var(--slate)" }}>
          Our most popular toys — chosen by thousands of families
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
