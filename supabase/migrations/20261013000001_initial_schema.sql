-- ==============================================================================
-- SVS FRESH JUICE POINT – SCHEMA MIGRATION 01: INITIAL SCHEMA & RLS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('owner', 'admin', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper function to check if current user is owner
CREATE OR REPLACE FUNCTION is_owner(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role IN ('owner', 'admin')
  );
END;
$$;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tamil_name TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tamil_name TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  pricing_type TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'weight')),
  unit TEXT NOT NULL DEFAULT 'serving' CHECK (unit IN ('serving', 'kg', 'piece', 'glass', 'gram')),
  is_available BOOLEAN NOT NULL DEFAULT true,
  allow_ice_cream_addon BOOLEAN NOT NULL DEFAULT false,
  popular BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products (is_available);

-- 5. PRODUCT PRICE HISTORY
CREATE TABLE IF NOT EXISTS product_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_paise INTEGER NOT NULL CHECK (price_paise > 0),
  effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_history_lookup 
ON product_price_history (product_id, effective_from DESC, created_at DESC);

-- Current Price View for convenience
CREATE OR REPLACE VIEW products_with_current_price AS
SELECT 
  p.id,
  p.category_id,
  c.name AS category_name,
  c.slug AS category_slug,
  p.name,
  p.slug,
  p.tamil_name,
  p.description,
  p.image_url,
  p.pricing_type,
  p.unit,
  p.is_available,
  p.allow_ice_cream_addon,
  p.popular,
  p.sort_order,
  p.created_at,
  p.updated_at,
  ph.price_paise AS current_price_paise,
  ph.effective_from AS price_effective_from
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN LATERAL (
  SELECT price_paise, effective_from
  FROM product_price_history
  WHERE product_id = p.id AND effective_from <= now()
  ORDER BY effective_from DESC, created_at DESC
  LIMIT 1
) ph ON true;

-- 6. DELIVERY RULES
CREATE TABLE IF NOT EXISTS delivery_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_distance_km NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (min_distance_km >= 0),
  max_distance_km NUMERIC(5, 2) NOT NULL CHECK (max_distance_km > min_distance_km),
  delivery_fee_paise INTEGER NOT NULL DEFAULT 0 CHECK (delivery_fee_paise >= 0),
  free_delivery_threshold_paise INTEGER NULL CHECK (free_delivery_threshold_paise IS NULL OR free_delivery_threshold_paise >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
  delivery_address TEXT,
  landmark TEXT,
  delivery_distance_km NUMERIC(5, 2) NULL,
  distance_source TEXT NOT NULL DEFAULT 'manual_confirmation' CHECK (distance_source IN ('verified_gps', 'manual_confirmation', 'estimated')),
  subtotal_paise INTEGER NOT NULL CHECK (subtotal_paise >= 0),
  delivery_fee_paise INTEGER NOT NULL DEFAULT 0 CHECK (delivery_fee_paise >= 0),
  total_paise INTEGER NOT NULL CHECK (total_paise >= 0),
  applied_delivery_rule_snapshot JSONB,
  pricing_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (pricing_status IN ('estimated', 'confirmed')),
  status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (status IN (
    'pending_confirmation',
    'confirmed',
    'preparing',
    'ready',
    'out_for_delivery',
    'completed',
    'cancelled'
  )),
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'upi')),
  customer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'serving',
  quantity NUMERIC(10, 3) NOT NULL CHECK (quantity > 0),
  unit_price_paise INTEGER NOT NULL CHECK (unit_price_paise >= 0),
  line_total_paise INTEGER NOT NULL CHECK (line_total_paise >= 0),
  with_ice_cream BOOLEAN NOT NULL DEFAULT false,
  ice_cream_addon_paise INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);

-- Sequence for human-readable order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to generate order number: e.g. SVS-20261013-0001
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  today_str TEXT;
  next_val INTEGER;
BEGIN
  today_str := to_char(now(), 'YYYYMMDD');
  next_val := nextval('order_number_seq');
  RETURN 'SVS-' || today_str || '-' || lpad((next_val % 10000)::TEXT, 4, '0');
END;
$$;

-- 9. TRANSACTIONAL ORDER CREATION FUNCTION
CREATE OR REPLACE FUNCTION create_order_transaction(
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_order_type TEXT,
  p_delivery_address TEXT,
  p_landmark TEXT,
  p_customer_notes TEXT,
  p_payment_method TEXT,
  p_items JSONB, -- Array of { "productId": text, "quantity": number, "withIceCream": boolean }
  p_client_distance_km NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID := gen_random_uuid();
  v_order_number TEXT;
  v_subtotal_paise INTEGER := 0;
  v_delivery_fee_paise INTEGER := 0;
  v_total_paise INTEGER := 0;
  v_pricing_status TEXT := 'confirmed';
  v_distance_source TEXT := 'manual_confirmation';
  v_item JSONB;
  v_product_id TEXT;
  v_qty NUMERIC;
  v_with_ice_cream BOOLEAN;
  v_product RECORD;
  v_unit_price_paise INTEGER;
  v_addon_paise INTEGER;
  v_line_total_paise INTEGER;
  v_rule RECORD;
  v_applied_rule_json JSONB := NULL;
  v_ice_cream_price INTEGER := 2000; -- ₹20 in paise
BEGIN
  v_order_number := generate_order_number();

  -- Validate items exist
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Create temporary storage for order items
  CREATE TEMPORARY TABLE IF NOT EXISTS temp_order_items (
    prod_id TEXT,
    prod_name TEXT,
    u_unit TEXT,
    qty NUMERIC,
    unit_price INT,
    addon_price INT,
    line_total INT,
    has_ice_cream BOOL
  ) ON COMMIT DROP;
  DELETE FROM temp_order_items;

  -- Iterate through items and calculate exact prices from database
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := v_item->>'productId';
    v_qty := (v_item->>'quantity')::NUMERIC;
    v_with_ice_cream := COALESCE((v_item->>'withIceCream')::BOOLEAN, false);

    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', v_product_id;
    END IF;

    -- Fetch product and its active price
    SELECT 
      p.id, 
      p.name, 
      p.unit, 
      p.pricing_type,
      p.is_available, 
      p.allow_ice_cream_addon,
      ph.price_paise
    INTO v_product
    FROM products p
    JOIN LATERAL (
      SELECT price_paise
      FROM product_price_history
      WHERE product_id = p.id AND effective_from <= now()
      ORDER BY effective_from DESC, created_at DESC
      LIMIT 1
    ) ph ON true
    WHERE p.id = v_product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % does not exist or has no active price', v_product_id;
    END IF;

    IF NOT v_product.is_available THEN
      RAISE EXCEPTION 'Product % (%) is currently sold out', v_product.name, v_product_id;
    END IF;

    v_unit_price_paise := v_product.price_paise;
    
    -- Addon calculation
    IF v_with_ice_cream AND v_product.allow_ice_cream_addon THEN
      v_addon_paise := v_ice_cream_price;
    ELSE
      v_addon_paise := 0;
      v_with_ice_cream := false;
    END IF;

    -- Line total
    IF v_product.pricing_type = 'weight' THEN
      -- For weight in kg: qty is in kg, price is per kg
      v_line_total_paise := ROUND(v_qty * v_unit_price_paise) + (ROUND(v_qty) * v_addon_paise);
      v_pricing_status := 'estimated'; -- Final fruit weight to be weighed
    ELSE
      -- Fixed price per serving
      v_line_total_paise := (v_qty::INTEGER) * (v_unit_price_paise + v_addon_paise);
    END IF;

    v_subtotal_paise := v_subtotal_paise + v_line_total_paise;

    INSERT INTO temp_order_items 
    VALUES (
      v_product.id, 
      v_product.name, 
      v_product.unit, 
      v_qty, 
      v_unit_price_paise, 
      v_addon_paise, 
      v_line_total_paise, 
      v_with_ice_cream
    );
  END LOOP;

  -- Calculate delivery fee
  IF p_order_type = 'pickup' THEN
    v_delivery_fee_paise := 0;
    v_pricing_status := 'confirmed';
  ELSE
    -- Delivery: check if distance provided and matches rules
    IF p_client_distance_km IS NOT NULL AND p_client_distance_km >= 0 THEN
      SELECT * INTO v_rule
      FROM delivery_rules
      WHERE is_active = true 
        AND p_client_distance_km >= min_distance_km 
        AND p_client_distance_km <= max_distance_km
      ORDER BY sort_order ASC
      LIMIT 1;

      IF FOUND THEN
        -- Check free delivery threshold
        IF v_rule.free_delivery_threshold_paise IS NOT NULL 
           AND v_subtotal_paise >= v_rule.free_delivery_threshold_paise THEN
          v_delivery_fee_paise := 0;
        ELSE
          v_delivery_fee_paise := v_rule.delivery_fee_paise;
        END IF;

        v_applied_rule_json := row_to_json(v_rule);
        v_distance_source := 'estimated';
      ELSE
        -- Outside configured range (> 5km): manual confirmation required
        v_delivery_fee_paise := 0;
        v_pricing_status := 'estimated';
        v_distance_source := 'manual_confirmation';
      END IF;
    ELSE
      -- Distance unknown: manual confirmation
      v_delivery_fee_paise := 0;
      v_pricing_status := 'estimated';
      v_distance_source := 'manual_confirmation';
    END IF;
  END IF;

  v_total_paise := v_subtotal_paise + v_delivery_fee_paise;

  -- Insert order
  INSERT INTO orders (
    id,
    order_number,
    customer_name,
    customer_phone,
    order_type,
    delivery_address,
    landmark,
    delivery_distance_km,
    distance_source,
    subtotal_paise,
    delivery_fee_paise,
    total_paise,
    applied_delivery_rule_snapshot,
    pricing_status,
    status,
    payment_method,
    customer_notes
  ) VALUES (
    v_order_id,
    v_order_number,
    TRIM(p_customer_name),
    TRIM(p_customer_phone),
    p_order_type,
    p_delivery_address,
    p_landmark,
    p_client_distance_km,
    v_distance_source,
    v_subtotal_paise,
    v_delivery_fee_paise,
    v_total_paise,
    v_applied_rule_json,
    v_pricing_status,
    'pending_confirmation',
    COALESCE(p_payment_method, 'cod'),
    p_customer_notes
  );

  -- Insert order items
  INSERT INTO order_items (
    order_id,
    product_id,
    product_name,
    unit,
    quantity,
    unit_price_paise,
    line_total_paise,
    with_ice_cream,
    ice_cream_addon_paise
  )
  SELECT 
    v_order_id,
    prod_id,
    prod_name,
    u_unit,
    qty,
    unit_price,
    line_total,
    has_ice_cream,
    addon_price
  FROM temp_order_items;

  RETURN jsonb_build_object(
    'orderId', v_order_id,
    'orderNumber', v_order_number,
    'subtotalPaise', v_subtotal_paise,
    'deliveryFeePaise', v_delivery_fee_paise,
    'totalPaise', v_total_paise,
    'pricingStatus', v_pricing_status,
    'status', 'pending_confirmation'
  );
END;
$$;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles can be viewed by self or owner" 
ON profiles FOR SELECT 
USING (auth.uid() = id OR is_owner(auth.uid()));

CREATE POLICY "Only owners can update profiles" 
ON profiles FOR UPDATE 
USING (is_owner(auth.uid()));

-- Categories Policies: Public can view active categories; Owner can do all
CREATE POLICY "Public can view active categories" 
ON categories FOR SELECT 
USING (is_active = true OR is_owner(auth.uid()));

CREATE POLICY "Owners can manage categories" 
ON categories FOR ALL 
USING (is_owner(auth.uid()));

-- Products Policies: Public can view available products; Owner can do all
CREATE POLICY "Public can view available products" 
ON products FOR SELECT 
USING (is_available = true OR is_owner(auth.uid()));

CREATE POLICY "Owners can manage products" 
ON products FOR ALL 
USING (is_owner(auth.uid()));

-- Price History Policies: Public can view active prices; Owner can insert
CREATE POLICY "Public can view effective price history" 
ON product_price_history FOR SELECT 
USING (effective_from <= now() OR is_owner(auth.uid()));

CREATE POLICY "Owners can insert price history" 
ON product_price_history FOR INSERT 
WITH CHECK (is_owner(auth.uid()));

-- Delivery Rules Policies: Public can view active rules; Owner can manage
CREATE POLICY "Public can view active delivery rules" 
ON delivery_rules FOR SELECT 
USING (is_active = true OR is_owner(auth.uid()));

CREATE POLICY "Owners can manage delivery rules" 
ON delivery_rules FOR ALL 
USING (is_owner(auth.uid()));

-- Orders Policies: Owners can view and update; Public can insert via RPC or service role
CREATE POLICY "Owners can view orders" 
ON orders FOR SELECT 
USING (is_owner(auth.uid()));

CREATE POLICY "Owners can update orders" 
ON orders FOR UPDATE 
USING (is_owner(auth.uid()));

-- Order Items Policies: Owners can view
CREATE POLICY "Owners can view order items" 
ON order_items FOR SELECT 
USING (is_owner(auth.uid()));

-- 11. TRIGGER FOR AUTH SIGNUP -> PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'customer' -- New signups are always customer by default; owner is bootstrapped
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
