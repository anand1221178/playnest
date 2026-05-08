import { supabaseAdmin } from "./supabase";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  ageRange: string;
  price: number;
  salePrice?: number;
  badge?: "NEW" | "SALE";
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  images: string[];
  stock?: number;
};

export const CATEGORIES = [
  { slug: "baby-toddler",   label: "Baby & Toddler",    emoji: "🍼", bg: "#D4F5EC" },
  { slug: "arts-crafts",    label: "Arts & Crafts",     emoji: "🎨", bg: "#EDE9FF" },
  { slug: "puzzles-games",  label: "Puzzles & Games",   emoji: "🧩", bg: "#FFF5CC" },
];

// Map DB snake_case rows to camelCase Product type
function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    category: row.category as string,
    categorySlug: row.category_slug as string,
    ageRange: row.age_range as string,
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : undefined,
    badge: (row.badge as "NEW" | "SALE") || undefined,
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    description: row.description as string,
    features: row.features as string[],
    images: row.images as string[],
    stock: row.stock as number | undefined,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("products")
    .select("*")
    .eq("active", true)
    .order("rating", { ascending: false });
  return (data || []).map(mapProduct);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("category_slug", slug)
    .order("rating", { ascending: false });
  return (data || []).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();
  return data ? mapProduct(data) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("products")
    .select("*")
    .eq("active", true)
    .order("rating", { ascending: false })
    .limit(8);
  return (data || []).map(mapProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("badge", "NEW")
    .limit(4);
  return (data || []).map(mapProduct);
}

export async function getRelatedProducts(categorySlug: string, excludeId: string): Promise<Product[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("category_slug", categorySlug)
    .neq("id", excludeId)
    .limit(4);
  return (data || []).map(mapProduct);
}
