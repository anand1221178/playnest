"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { CATEGORIES } from "@/lib/products";
import type { Product } from "@/lib/products";
import { SlidersHorizontal, X } from "lucide-react";

function ProductsContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const urlCategory   = searchParams.get("category");

  const [products, setProducts]               = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [activeCategory, setActiveCategory]   = useState<string | null>(urlCategory);
  const [activeBrand, setActiveBrand]         = useState<string | null>(null);
  const [sort, setSort]                       = useState("rating");
  const [filterOpen, setFilterOpen]           = useState(false);

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    const url = activeCategory
      ? `/api/products?category=${activeCategory}`
      : "/api/products";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Map snake_case from DB to camelCase
        const mapped = data.map((row: Record<string, unknown>) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          brand: row.brand,
          category: row.category,
          categorySlug: row.category_slug,
          ageRange: row.age_range,
          price: Number(row.price),
          salePrice: row.sale_price ? Number(row.sale_price) : undefined,
          badge: row.badge || undefined,
          rating: Number(row.rating),
          reviews: Number(row.reviews),
          description: row.description,
          features: row.features,
          images: row.images,
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  // Sync state when URL param changes
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  const selectCategory = (slug: string | null) => {
    setActiveCategory(slug);
    const url = slug ? `/products?category=${slug}` : "/products";
    router.replace(url, { scroll: false });
  };

  const ALL_BRANDS = [...new Set(products.map((p) => p.brand))].sort();

  let filtered = products;
  if (activeBrand) filtered = filtered.filter((p) => p.brand === activeBrand);
  if (sort === "rating")        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sort === "price-asc")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const clearFilters = () => { selectCategory(null); setActiveBrand(null); };
  const hasFilters   = !!(activeCategory || activeBrand);
  const activeLabel  = CATEGORIES.find((c) => c.slug === activeCategory)?.label;

  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 style={{ fontFamily: "var(--font-fredoka)", fontSize: "clamp(28px, 5vw, 48px)", color: "var(--navy)" }}>
            {activeLabel ?? "All Toys"}
          </h1>
          <p style={{ color: "var(--slate)" }}>
            {loading ? "Loading..." : `${filtered.length} toys found`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-full border" style={{ borderColor: "var(--coral)", color: "var(--coral)" }}>
              <X size={14} /> Clear filters
            </button>
          )}
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm font-semibold px-4 py-2 rounded-full border outline-none cursor-pointer" style={{ borderColor: "rgba(26,26,46,0.15)", color: "var(--navy)" }}>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <button className="md:hidden flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border" style={{ borderColor: "rgba(26,26,46,0.15)", color: "var(--navy)" }} onClick={() => setFilterOpen(!filterOpen)}>
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col gap-6 w-52 flex-shrink-0">
          <div>
            <h3 className="font-extrabold text-sm mb-3" style={{ color: "var(--navy)" }}>Category</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => selectCategory(null)} className="text-sm text-left px-3 py-2 rounded-lg font-semibold transition-colors" style={!activeCategory ? { backgroundColor: "var(--coral)", color: "white" } : { color: "var(--slate)" }}>
                All Toys
              </button>
              {CATEGORIES.map((c) => (
                <button key={c.slug} onClick={() => selectCategory(c.slug)} className="text-sm text-left px-3 py-2 rounded-lg font-semibold transition-colors" style={activeCategory === c.slug ? { backgroundColor: "var(--coral)", color: "white" } : { color: "var(--slate)" }}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-extrabold text-sm mb-3" style={{ color: "var(--navy)" }}>Brand</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveBrand(null)} className="text-sm text-left px-3 py-2 rounded-lg font-semibold transition-colors" style={!activeBrand ? { backgroundColor: "var(--navy)", color: "white" } : { color: "var(--slate)" }}>
                All Brands
              </button>
              {ALL_BRANDS.map((b) => (
                <button key={b} onClick={() => setActiveBrand(b)} className="text-sm text-left px-3 py-2 rounded-lg font-semibold transition-colors" style={activeBrand === b ? { backgroundColor: "var(--navy)", color: "white" } : { color: "var(--slate)" }}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {filterOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
            <div className="relative bg-white rounded-t-2xl p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg" style={{ color: "var(--navy)" }}>Filters</h3>
                <button onClick={() => setFilterOpen(false)}><X size={22} /></button>
              </div>
              <div>
                <p className="font-bold text-sm mb-3" style={{ color: "var(--navy)" }}>Category</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { selectCategory(null); setFilterOpen(false); }} className="px-3 py-1.5 rounded-full text-sm font-bold border" style={!activeCategory ? { backgroundColor: "var(--coral)", color: "white", borderColor: "var(--coral)" } : { borderColor: "rgba(26,26,46,0.15)", color: "var(--slate)" }}>All</button>
                  {CATEGORIES.map((c) => (
                    <button key={c.slug} onClick={() => { selectCategory(c.slug); setFilterOpen(false); }} className="px-3 py-1.5 rounded-full text-sm font-bold border" style={activeCategory === c.slug ? { backgroundColor: "var(--coral)", color: "white", borderColor: "var(--coral)" } : { borderColor: "rgba(26,26,46,0.15)", color: "var(--slate)" }}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setFilterOpen(false)} className="py-3 rounded-full text-white font-extrabold" style={{ backgroundColor: "var(--coral)" }}>Show Results</button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20" style={{ color: "var(--slate)" }}>
              <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--coral)", borderTopColor: "transparent" }} />
              <p className="font-bold">Loading toys...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: "var(--slate)" }}>
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-bold text-lg">No toys found for this filter.</p>
              <button onClick={clearFilters} className="mt-4 px-6 py-2 rounded-full text-white font-bold" style={{ backgroundColor: "var(--coral)" }}>Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Suspense>
        <ProductsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
