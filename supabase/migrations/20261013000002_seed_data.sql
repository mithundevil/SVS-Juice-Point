-- ==========================================
-- SVS FRESH JUICE POINT - INITIAL SEED DATA
-- ==========================================

-- 1. SEED CATEGORIES
INSERT INTO categories (id, name, slug, tamil_name, description, image_url, is_active, sort_order)
VALUES
  ('nungu-ilaneer', 'Nungu & Ilaneer Juices', 'nungu-ilaneer', 'Nungu & Ilaneer Juices', 'Naturally cooling tender coconut & ice apple specialities inspired by the palmyra palm', '/images/nungu.jpg', true, 1),
  ('fresh-ice-creams', 'Fresh Fruit Ice Creams', 'fresh-ice-creams', 'Fresh Fruit Ice Creams', 'Natural handmade fruit ice bars crafted with authentic taste', '/images/nunku-ice.jpg', true, 2),
  ('sarbath', 'Sarbath & Soda', 'sarbath', 'Sarbath & Soda', 'Traditional Nannari sarbath and fizzy citrus refreshes', '/images/sarbath.jpg', true, 3),
  ('milk-shake', 'Milk Shake', 'milk-shake', 'Milk Shake', 'Rich, thick & creamy shakes made with high-quality ingredients', '/images/chocolate-shake.jpg', true, 4),
  ('fresh-juices', 'Fresh Juices', 'fresh-juices', 'Fresh Juices', 'Pure, freshly extracted fruit juices loaded with natural vitamins', '/images/pomegranate-juice.jpg', true, 5),
  ('sharja', 'Sharja', 'sharja', 'Sharja', 'Signature thick banana & milk blend drinks', '/images/sharja-classic.jpg', true, 6),
  ('omlete', 'Omlete', 'omlete', 'Omlete', 'Freshly made hot bread omelette snack', '/images/bread-omelette.jpg', true, 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  tamil_name = EXCLUDED.tamil_name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- 2. SEED PRODUCTS
INSERT INTO products (id, category_id, name, slug, tamil_name, description, image_url, pricing_type, unit, is_available, allow_ice_cream_addon, popular, sort_order)
VALUES
  ('nungu', 'nungu-ilaneer', 'Nungu', 'nungu', NULL, 'Fresh tender ice apple (nungu), translucent, cooling and naturally rich in minerals.', '/images/nungu.jpg', 'fixed', 'serving', true, false, true, 1),
  ('ilaneer', 'nungu-ilaneer', 'Ilaneer', 'ilaneer', NULL, 'Fresh natural tender coconut water, deeply hydrating and naturally sweet.', '/images/ilaneer.jpg', 'fixed', 'serving', true, false, true, 2),
  ('nunku-juice', 'nungu-ilaneer', 'Nunku Juice', 'nunku-juice', NULL, 'Fresh organic ice apple juice.', '/images/nunku-juice.jpg', 'fixed', 'serving', true, false, true, 3),
  ('nunku-sarbath', 'nungu-ilaneer', 'Nunku Sarbath', 'nunku-sarbath', NULL, 'Fresh organic ice apple juice combined with natural herbal Nannari syrup.', '/images/nunku-sarbath.jpg', 'fixed', 'serving', true, false, true, 4),
  ('nunku-shake', 'nungu-ilaneer', 'Nunku Shake', 'nunku-shake', NULL, 'Creamy cold shake prepared with tender fresh ice apples and chilled milk.', '/images/nunku-shake.jpg', 'fixed', 'serving', true, false, true, 5),
  ('nunku-sharja', 'nungu-ilaneer', 'Nunku Sharjah', 'nunku-sharja', NULL, 'Signature thick blend of fresh ice apple fruit and rich chilled milk.', '/images/nunku-sharjah.jpg', 'fixed', 'serving', true, true, false, 6),
  ('nunku-milk', 'nungu-ilaneer', 'Nunku Milk', 'nunku-milk', NULL, 'Soothing blend of tender ice apple pieces served in sweet chilled milk.', '/images/nunku-milk.jpg', 'fixed', 'serving', true, false, false, 7),
  ('ilaneer-sarbath', 'nungu-ilaneer', 'Ilaneer Sarbath', 'ilaneer-sarbath', NULL, 'Fresh tender coconut water mixed with traditional cooling Nannari syrup.', '/images/ilaneer-sarbath.jpg', 'fixed', 'serving', true, false, false, 8),
  ('ilaneer-shake', 'nungu-ilaneer', 'Ilaneer Shake', 'ilaneer-shake', NULL, 'Thick creamy milkshake enriched with natural tender coconut pulp and water.', '/images/ilaneer-shake.jpg', 'fixed', 'serving', true, false, false, 9),
  ('nunku-ice', 'fresh-ice-creams', 'Nunku Ice', 'nunku-ice', NULL, '', '/images/nunku-ice.jpg', 'fixed', 'serving', true, false, true, 10),
  ('palm-jaggery-ice', 'fresh-ice-creams', 'Palm Jaggery Ice', 'palm-jaggery-ice', NULL, '', '/images/palm-jaggery-ice.jpg', 'fixed', 'serving', true, false, false, 11),
  ('jack-fruit-ice', 'fresh-ice-creams', 'Jack Fruit Ice', 'jack-fruit-ice', NULL, '', '/images/jack-fruit-ice.jpg', 'fixed', 'serving', true, false, false, 12),
  ('watermelon-ice', 'fresh-ice-creams', 'Watermelon Ice', 'watermelon-ice', NULL, '', '/images/watermelon-ice.jpg', 'fixed', 'serving', true, false, false, 13),
  ('ilaneer-ice', 'fresh-ice-creams', 'Ilaneer Ice', 'ilaneer-ice', NULL, '', '/images/ilaneer-ice.jpg', 'fixed', 'serving', true, false, false, 14),
  ('orange-ice', 'fresh-ice-creams', 'Orange Ice', 'orange-ice', NULL, 'Zesty premium orange ice cream made with sweet orange juice.', '/images/orange-ice.jpg', 'fixed', 'serving', true, false, false, 15),
  ('sarbath', 'sarbath', 'Sarbath', 'sarbath', NULL, '', '/images/sarbath.jpg', 'fixed', 'serving', true, false, true, 16),
  ('lemon-soda', 'sarbath', 'Lemon Soda', 'lemon-soda', NULL, '', '/images/lemon-soda.jpg', 'fixed', 'serving', true, false, false, 17),
  ('soda-sarbath', 'sarbath', 'Soda Sarbath', 'soda-sarbath', NULL, '', '/images/soda-sarbath.jpg', 'fixed', 'serving', true, false, false, 18),
  ('vanilla-shake', 'milk-shake', 'Vanilla', 'vanilla-shake', NULL, '', '/images/vanilla-shake.jpg', 'fixed', 'serving', true, true, false, 19),
  ('strawberry-shake', 'milk-shake', 'Strawberry', 'strawberry-shake', NULL, 'Delicious pink strawberry milkshake full of fruity flavor.', '/images/sharja-strawberry.jpg', 'fixed', 'serving', true, true, false, 20),
  ('nungu-sharja-shake', 'milk-shake', 'Nungu Sharja', 'nungu-sharja-shake', NULL, 'Special Nungu Sharja milkshake fusion rich in texture.', '/images/nungu-sharja-shake.jpg', 'fixed', 'serving', true, true, true, 21),
  ('butterscotch-shake', 'milk-shake', 'Butterscotch', 'butterscotch-shake', NULL, '', '/images/butterscotch-shake.jpg', 'fixed', 'serving', true, true, false, 22),
  ('chocolate-shake', 'milk-shake', 'Chocolate', 'chocolate-shake', NULL, '', '/images/chocolate-shake.jpg', 'fixed', 'serving', true, true, true, 23),
  ('pista-shake', 'milk-shake', 'Pista', 'pista-shake', NULL, '', '/images/pista-shake.jpg', 'fixed', 'serving', true, true, false, 24),
  ('mango-shake', 'milk-shake', 'Mango', 'mango-shake', NULL, 'Luscious Alphonso mango pulp whipped with fresh chilled milk.', '/images/mango-shake.jpg', 'fixed', 'serving', true, true, true, 25),
  ('oreo-shake', 'milk-shake', 'Oreo', 'oreo-shake', NULL, 'Crunchy chocolate Oreo cookies blended with chilled milk.', '/images/oreo-shake.jpg', 'fixed', 'serving', true, true, true, 26),
  ('lemon-juice', 'fresh-juices', 'Lemon', 'lemon-juice', NULL, 'Hydrating fresh lemon juice served ice cold.', '/images/lemon-juice.jpg', 'fixed', 'serving', true, false, false, 27),
  ('lemon-honey', 'fresh-juices', 'Lemon with Honey', 'lemon-honey', NULL, 'Immunity booster lemonade prepared with pure natural honey.', '/images/lemon-honey.jpg', 'fixed', 'serving', true, false, false, 28),
  ('lemon-mint', 'fresh-juices', 'Lemon with Mint', 'lemon-mint', NULL, 'Zesty lemon juice crushed with fresh mint leaves.', '/images/lemon-mint.jpg', 'fixed', 'serving', true, false, false, 29),
  ('lemon-pineapple', 'fresh-juices', 'Lemon with Pineapple', 'lemon-pineapple', NULL, 'Tangy blend of citrus lemon and tropical sweet pineapple.', '/images/lemon-pineapple.jpg', 'fixed', 'serving', true, false, false, 30),
  ('lemon-grapes', 'fresh-juices', 'Lemon with Grapes', 'lemon-grapes', NULL, 'Refreshing twist of juicy black grapes with lemon squeeze.', '/images/lemon-grapes.jpg', 'fixed', 'serving', true, false, false, 31),
  ('lemon-ginger', 'fresh-juices', 'Lemon with Ginger', 'lemon-ginger', NULL, 'Spiced digestif lemon juice infused with fresh ginger extract.', '/images/lemon-ginger.jpg', 'fixed', 'serving', true, false, false, 32),
  ('beetroot-juice', 'fresh-juices', 'Beetroot', 'beetroot-juice', NULL, 'Nutrient-rich freshly pressed red beetroot juice.', '/images/beetroot-juice.jpg', 'fixed', 'serving', true, false, false, 33),
  ('papaya-juice', 'fresh-juices', 'Papaya', 'papaya-juice', NULL, 'Smooth and vitamin A packed ripe papaya juice.', '/images/papaya-juice.jpg', 'fixed', 'serving', true, false, false, 34),
  ('mosambi-juice', 'fresh-juices', 'Mosambi', 'mosambi-juice', NULL, 'Freshly extracted sweet lime juice full of natural energy.', '/images/mosambi-juice.jpg', 'fixed', 'serving', true, false, true, 35),
  ('pineapple-juice', 'fresh-juices', 'Pineapple', 'pineapple-juice', NULL, 'Tropical fresh pineapple extract with sweet and tangy notes.', '/images/pineapple-juice.jpg', 'fixed', 'serving', true, false, false, 36),
  ('orange-juice', 'fresh-juices', 'Orange', 'orange-juice', NULL, 'Pure 100% fresh cold-pressed orange juice.', '/images/orange-juice.jpg', 'fixed', 'serving', true, false, true, 37),
  ('grapes-juice', 'fresh-juices', 'Grapes', 'grapes-juice', NULL, 'Rich dark grape juice freshly crushed with natural sweetness.', '/images/grapes-juice.jpg', 'fixed', 'serving', true, false, false, 38),
  ('watermelon-juice', 'fresh-juices', 'Watermelon', 'watermelon-juice', NULL, 'Naturally sweet and hydrating fresh cold watermelon juice.', '/images/watermelon-juice.jpg', 'fixed', 'serving', true, false, true, 39),
  ('abc-juice', 'fresh-juices', 'ABC', 'abc-juice', NULL, 'Healthy miracle blend of Apple, Beetroot, and Carrot.', '/images/abc-juice.jpg', 'fixed', 'serving', true, false, true, 40),
  ('musk-melon-juice', 'fresh-juices', 'Musk Melon', 'musk-melon-juice', NULL, 'Fragrant, thick muskmelon juice prepared fresh to order.', '/images/musk-melon.jpg', 'fixed', 'serving', true, false, false, 41),
  ('apple-juice', 'fresh-juices', 'Apple', 'apple-juice', NULL, 'Crisp fresh red apple juice extracted on demand.', '/images/apple-juice.jpg', 'fixed', 'serving', true, false, false, 42),
  ('apple-milk', 'fresh-juices', 'Apple with Milk', 'apple-milk', NULL, 'Thick nutritious blend of fresh red apples and chilled milk.', '/images/apple-milk.jpg', 'fixed', 'serving', true, false, false, 43),
  ('pomegranate-juice', 'fresh-juices', 'Pomegranate', 'pomegranate-juice', NULL, 'Antioxidant-loaded pure fresh pomegranate juice.', '/images/pomegranate-juice.jpg', 'fixed', 'serving', true, false, false, 44),
  ('pomegranate-milk', 'fresh-juices', 'Pomegranate with Milk', 'pomegranate-milk', NULL, 'Rich luxurious milkshake blended with fresh pomegranate arils.', '/images/pomegranate-milk.jpg', 'fixed', 'serving', true, false, false, 45),
  ('lassi', 'fresh-juices', 'Lassi', 'lassi', NULL, 'Traditional sweet churned yogurt drink topped with aroma.', '/images/lassi.jpg', 'fixed', 'serving', true, false, false, 46),
  ('sharja-classic', 'sharja', 'Sharja', 'sharja-classic', NULL, 'Authentic classic thick Sharja banana shake drink.', '/images/sharja-classic.jpg', 'fixed', 'serving', true, true, true, 47),
  ('sharja-butterscotch', 'sharja', 'Butterscotch', 'sharja-butterscotch', NULL, 'Thick Sharja base infused with sweet butterscotch flavour.', '/images/sharja-butterscotch.jpg', 'fixed', 'serving', true, true, false, 48),
  ('sharja-strawberry', 'sharja', 'Strawberry', 'sharja-strawberry', NULL, 'Creamy Sharja banana blend with strawberry essence.', '/images/sharja-strawberry.jpg', 'fixed', 'serving', true, true, false, 49),
  ('sharja-vanilla', 'sharja', 'Vanilla', 'sharja-vanilla', NULL, 'Smooth vanilla flavored Sharja smoothie blend.', '/images/sharja-vanilla.jpg', 'fixed', 'serving', true, true, false, 50),
  ('sharja-chocolate', 'sharja', 'Chocolate', 'sharja-chocolate', NULL, '', '/images/sharja-chocolate.jpg', 'fixed', 'serving', true, true, false, 51),
  ('sharja-milkshake', 'sharja', 'Milk Shake', 'sharja-milkshake', NULL, '', '/images/sharja-milkshake.jpg', 'fixed', 'serving', true, true, false, 52),
  ('bread-omelette', 'omlete', 'Bread Omelette', 'bread-omelette', NULL, 'Hot freshly toasted buttered bread with spiced double egg omelette.', '/images/bread-omelette.jpg', 'fixed', 'serving', true, false, true, 53)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  allow_ice_cream_addon = EXCLUDED.allow_ice_cream_addon,
  popular = EXCLUDED.popular,
  sort_order = EXCLUDED.sort_order;

-- 3. SEED INITIAL PRODUCT PRICE HISTORY (Price in integer paise: ₹1 = 100 paise)
INSERT INTO product_price_history (product_id, price_paise, effective_from)
VALUES
  ('nungu', 5000, now()),
  ('ilaneer', 4000, now()),
  ('nunku-juice', 7000, now()),
  ('nunku-sarbath', 6000, now()),
  ('nunku-shake', 8000, now()),
  ('nunku-sharja', 8000, now()),
  ('nunku-milk', 5000, now()),
  ('ilaneer-sarbath', 8000, now()),
  ('ilaneer-shake', 8000, now()),
  ('nunku-ice', 3000, now()),
  ('palm-jaggery-ice', 3000, now()),
  ('jack-fruit-ice', 3000, now()),
  ('watermelon-ice', 3000, now()),
  ('ilaneer-ice', 4000, now()),
  ('orange-ice', 7000, now()),
  ('sarbath', 2000, now()),
  ('lemon-soda', 3500, now()),
  ('soda-sarbath', 3500, now()),
  ('vanilla-shake', 7000, now()),
  ('strawberry-shake', 7000, now()),
  ('nungu-sharja-shake', 7000, now()),
  ('butterscotch-shake', 7000, now()),
  ('chocolate-shake', 7000, now()),
  ('pista-shake', 7000, now()),
  ('mango-shake', 7000, now()),
  ('oreo-shake', 7000, now()),
  ('lemon-juice', 3000, now()),
  ('lemon-honey', 3500, now()),
  ('lemon-mint', 3500, now()),
  ('lemon-pineapple', 3500, now()),
  ('lemon-grapes', 5000, now()),
  ('lemon-ginger', 3500, now()),
  ('beetroot-juice', 5000, now()),
  ('papaya-juice', 5000, now()),
  ('mosambi-juice', 6000, now()),
  ('pineapple-juice', 7000, now()),
  ('orange-juice', 7000, now()),
  ('grapes-juice', 7000, now()),
  ('watermelon-juice', 5000, now()),
  ('abc-juice', 6000, now()),
  ('musk-melon-juice', 7000, now()),
  ('apple-juice', 8000, now()),
  ('apple-milk', 10000, now()),
  ('pomegranate-juice', 10000, now()),
  ('pomegranate-milk', 12000, now()),
  ('lassi', 4000, now()),
  ('sharja-classic', 7000, now()),
  ('sharja-butterscotch', 7000, now()),
  ('sharja-strawberry', 7000, now()),
  ('sharja-vanilla', 7000, now()),
  ('sharja-chocolate', 7000, now()),
  ('sharja-milkshake', 7000, now()),
  ('bread-omelette', 5000, now());

-- 4. SEED DEFAULT DELIVERY RULES
-- Up to 3 km: ₹30 (3000 paise)
-- Above 3 km to 5 km: ₹60 (6000 paise)
-- Free delivery threshold: ₹1,000 (100000 paise) within 5 km
INSERT INTO delivery_rules (min_distance_km, max_distance_km, delivery_fee_paise, free_delivery_threshold_paise, is_active, sort_order)
VALUES
  (0.0, 3.0, 3000, 100000, true, 1),
  (3.0, 5.0, 6000, 100000, true, 2);
