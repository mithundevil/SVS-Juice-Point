import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PRODUCTS as FALLBACK_PRODUCTS } from '@/data/products';
import { Product, CategoryId } from '@/types';

export interface DbProductWithPrice {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  slug: string;
  tamil_name: string | null;
  description: string | null;
  image_url: string;
  pricing_type: 'fixed' | 'weight';
  unit: string;
  is_available: boolean;
  allow_ice_cream_addon: boolean;
  popular: boolean;
  sort_order: number;
  current_price_paise: number;
  price_effective_from?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all available products with their current prices.
 * Gracefully falls back to local products.ts if Supabase is unconfigured or unreachable.
 */
export async function getProductsWithPrices(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return FALLBACK_PRODUCTS;
    }

    const { data, error } = await supabase
      .from('products_with_current_price')
      .select('*')
      .eq('is_available', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_PRODUCTS;
    }

    return data.map((item: DbProductWithPrice) => ({
      id: item.id,
      name: item.name,
      tamilName: item.tamil_name,
      category: item.category_id as CategoryId,
      price: Math.round((item.current_price_paise || 0) / 100), // convert paise to rupees for UI
      pricePaise: item.current_price_paise || 0,
      image: item.image_url,
      description: item.description || '',
      available: item.is_available,
      allowIceCreamAddon: item.allow_ice_cream_addon,
      popular: item.popular,
      pricingType: item.pricing_type,
      unit: item.unit,
    }));
  } catch (err) {
    console.warn('Failed to load products from Supabase, using fallback data:', err);
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Fetch all products (including unavailable ones) for Owner Dashboard
 */
export async function getAllProductsAdmin(): Promise<DbProductWithPrice[]> {
  const adminClient = createAdminClient();
  const supabase = adminClient || (await createClient());

  if (!supabase) {
    // Return formatted fallback items with paise
    return FALLBACK_PRODUCTS.map((p, idx) => ({
      id: p.id,
      category_id: p.category,
      category_name: p.category,
      name: p.name,
      slug: p.id,
      tamil_name: p.tamilName || null,
      description: p.description || '',
      image_url: p.image,
      pricing_type: 'fixed',
      unit: 'serving',
      is_available: p.available ?? true,
      allow_ice_cream_addon: p.allowIceCreamAddon ?? false,
      popular: p.popular ?? false,
      sort_order: idx + 1,
      current_price_paise: Math.round(p.price * 100),
      price_effective_from: new Date().toISOString(),
    }));
  }

  const { data, error } = await supabase
    .from('products_with_current_price')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) {
    console.error('Error fetching admin products:', error);
    return [];
  }

  return data;
}

/**
 * Record a new price update in product_price_history.
 * Preserves full historical audit log.
 */
export async function updateProductPrice(
  productId: string,
  pricePaise: number,
  updatedBy?: string
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: 'Database client not configured' };
  }

  const { error } = await adminClient
    .from('product_price_history')
    .insert({
      product_id: productId,
      price_paise: pricePaise,
      effective_from: new Date().toISOString(),
      updated_by: updatedBy || null,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Toggle product availability (In Stock / Sold Out)
 */
export async function toggleProductAvailability(
  productId: string,
  isAvailable: boolean
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: 'Database client not configured' };
  }

  const { error } = await adminClient
    .from('products')
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Upsert product details and insert new price record if price changed
 */
export async function upsertProduct(productData: {
  id: string;
  categoryId: string;
  name: string;
  tamilName?: string | null;
  description?: string;
  imageUrl: string;
  pricingType: 'fixed' | 'weight';
  unit: string;
  isAvailable: boolean;
  allowIceCreamAddon: boolean;
  popular: boolean;
  pricePaise: number;
  updatedBy?: string;
}): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: 'Database client not configured' };
  }

  // 1. Upsert product
  const { error: prodError } = await adminClient
    .from('products')
    .upsert({
      id: productData.id,
      category_id: productData.categoryId,
      name: productData.name,
      slug: productData.id,
      tamil_name: productData.tamilName || null,
      description: productData.description || '',
      image_url: productData.imageUrl,
      pricing_type: productData.pricingType,
      unit: productData.unit,
      is_available: productData.isAvailable,
      allow_ice_cream_addon: productData.allowIceCreamAddon,
      popular: productData.popular,
      updated_at: new Date().toISOString(),
    });

  if (prodError) {
    return { success: false, error: prodError.message };
  }

  // 2. Add new price record
  const { error: priceError } = await adminClient
    .from('product_price_history')
    .insert({
      product_id: productData.id,
      price_paise: productData.pricePaise,
      effective_from: new Date().toISOString(),
      updated_by: productData.updatedBy || null,
    });

  if (priceError) {
    return { success: false, error: priceError.message };
  }

  return { success: true };
}
