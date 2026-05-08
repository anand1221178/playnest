-- ============================================================
-- PlayNest Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  age_range TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  badge TEXT CHECK (badge IN ('NEW', 'SALE', NULL)),
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),

  -- Customer info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Shipping address
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,

  -- Order items (JSON array of {slug, name, qty, price, image})
  items JSONB NOT NULL DEFAULT '[]',

  -- Money
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- PayFast payment
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_products_category ON products(category_slug);
CREATE INDEX idx_products_active ON products(active);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS policies (service role bypasses these, anon key respects them)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (active = true);

-- No public access to orders (all order operations go through API with service role)
-- Admin operations use service role key which bypasses RLS

-- Storage bucket for product images (run in Supabase dashboard > Storage)
-- CREATE BUCKET: product-images (public)
-- Set public access on the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated/service role to upload
CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- ── Stock management functions ──────────────────────────
CREATE OR REPLACE FUNCTION decrement_stock(product_slug TEXT, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(stock - qty, 0)
  WHERE slug = product_slug;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_stock(product_slug TEXT, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock + qty
  WHERE slug = product_slug;
END;
$$ LANGUAGE plpgsql;
