/*
# Store schema: products, wishlist, compare, orders, order_items

## Overview
Creates the full e-commerce data model for "The Good Stuff" pantry store.
Supports product catalog (public read), user wishlist, product comparison,
and order checkout with line items.

## New Tables
1. products — Publicly readable catalog
2. wishlist — User saved products (owner-scoped)
3. compare — Products for comparison (owner-scoped)
4. orders — Checkout orders (owner-scoped)
5. order_items — Line items (owner-scoped via parent order)

## Security
- products: SELECT open to anon + authenticated. No write policies.
- wishlist/compare/orders/order_items: RLS enabled, owner-scoped CRUD for authenticated only.
- order_items ownership checked via parent order user_id.
- Owner columns default to auth.uid().

## Seed Data
- 8 products covering chutneys, sauces, jams, spreads.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL,
  description text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '#d93225',
  accent text NOT NULL DEFAULT '#f8cf55',
  price numeric NOT NULL DEFAULT 0,
  size text NOT NULL DEFAULT '250 ml',
  spicy boolean NOT NULL DEFAULT false,
  sweet boolean NOT NULL DEFAULT false,
  vegan boolean NOT NULL DEFAULT true,
  gluten_free boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlist" ON wishlist;
CREATE POLICY "select_own_wishlist" ON wishlist FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlist;
CREATE POLICY "insert_own_wishlist" ON wishlist FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlist;
CREATE POLICY "delete_own_wishlist" ON wishlist FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS compare (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE compare ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_compare" ON compare;
CREATE POLICY "select_own_compare" ON compare FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_compare" ON compare;
CREATE POLICY "insert_own_compare" ON compare FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_compare" ON compare;
CREATE POLICY "delete_own_compare" ON compare FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_compare_user ON compare(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

INSERT INTO products (name, slug, type, description, color, accent, price, size, spicy, sweet, vegan, gluten_free) VALUES
  ('Apricot Chutney', 'apricot-chutney', 'Sweet & tangy', 'Sun-ripened apricots meet a whisper of ginger for a chutney that loves cheese boards, roast sandwiches, and lazy Sunday brunches.', '#e24725', '#f8cf55', 12.00, '250 ml', false, true, true, true),
  ('Cool Mint Sauce', 'cool-mint-sauce', 'Fresh & herby', 'Garden mint, a squeeze of lemon, and nothing getting in the way. The lamb''s best friend and the roasted veg''s secret weapon.', '#2f7c45', '#d9e6b3', 10.00, '250 ml', false, false, true, true),
  ('House Hot Sauce', 'house-hot-sauce', 'Smoky & bold', 'Chipotle, garlic, and a slow burn that builds character. Born for eggs, burgers, and anything that needs a wake-up call.', '#d96b1f', '#f3ad44', 11.00, '250 ml', true, false, true, true),
  ('Cranberry Sauce', 'cranberry-sauce', 'Bright & juicy', 'Whole cranberries, a touch of orange zest, and a texture that''s less jelly, more jewel. Not just for the holidays.', '#b73532', '#f3c5a4', 13.00, '250 ml', false, true, true, true),
  ('Smoky BBQ Glaze', 'smoky-bbq-glaze', 'Rich & sticky', 'Molasses, smoked paprika, and tamarind for a glaze that caramelises on the grill and finishes with a tangy wink.', '#8b3326', '#e89b3a', 14.00, '300 ml', false, true, true, true),
  ('Basil Pesto Spread', 'basil-pesto-spread', 'Garlicky & green', 'Fresh basil, toasted pine nuts, and parmesan blended into a spread that turns bread into dinner and dinner into an event.', '#4a8c3f', '#c5dd8e', 12.00, '200 ml', false, false, false, true),
  ('Spicy Mango Jam', 'spicy-mango-jam', 'Sweet heat', 'Ripe mangoes meet scotch bonnet for a jam that starts sweet, finishes bold, and makes every breakfast a little more interesting.', '#e8a420', '#f4d77a', 11.00, '250 ml', true, true, true, true),
  ('Rosemary Jelly', 'rosemary-jelly', 'Herbal & bright', 'A delicate jelly infused with rosemary sprigs — pair it with roast lamb, soft cheese, or a charcuterie board.', '#7a9c5a', '#e0ebc5', 13.00, '250 ml', false, true, true, true)
ON CONFLICT (slug) DO NOTHING;
