import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface DeliveryRule {
  id: string;
  min_distance_km: number;
  max_distance_km: number;
  delivery_fee_paise: number;
  free_delivery_threshold_paise: number | null;
  is_active: boolean;
  sort_order: number;
}

// Fallback rules if database is unpopulated or offline
export const DEFAULT_DELIVERY_RULES: DeliveryRule[] = [
  {
    id: 'rule-tier-1',
    min_distance_km: 0,
    max_distance_km: 3,
    delivery_fee_paise: 3000, // ₹30
    free_delivery_threshold_paise: 100000, // ₹1,000
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'rule-tier-2',
    min_distance_km: 3,
    max_distance_km: 5,
    delivery_fee_paise: 6000, // ₹60
    free_delivery_threshold_paise: 100000, // ₹1,000
    is_active: true,
    sort_order: 2,
  },
];

export async function getActiveDeliveryRules(): Promise<DeliveryRule[]> {
  const supabase = await createClient();
  if (!supabase) {
    return DEFAULT_DELIVERY_RULES;
  }

  const { data, error } = await supabase
    .from('delivery_rules')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    return DEFAULT_DELIVERY_RULES;
  }

  return data;
}

export async function getAllDeliveryRules(): Promise<DeliveryRule[]> {
  const adminClient = createAdminClient();
  const supabase = adminClient || (await createClient());

  if (!supabase) {
    return DEFAULT_DELIVERY_RULES;
  }

  const { data, error } = await supabase
    .from('delivery_rules')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data || data.length === 0) {
    return DEFAULT_DELIVERY_RULES;
  }

  return data;
}

export interface DeliveryFeeCalculation {
  deliveryFeePaise: number;
  pricingStatus: 'confirmed' | 'estimated';
  distanceSource: 'verified_gps' | 'manual_confirmation' | 'estimated';
  appliedRule: DeliveryRule | null;
  isFreeDelivery: boolean;
}

export function calculateDeliveryFee(
  orderType: 'delivery' | 'pickup',
  subtotalPaise: number,
  rules: DeliveryRule[],
  distanceKm?: number | null
): DeliveryFeeCalculation {
  // Pickup is always free
  if (orderType === 'pickup') {
    return {
      deliveryFeePaise: 0,
      pricingStatus: 'confirmed',
      distanceSource: 'manual_confirmation',
      appliedRule: null,
      isFreeDelivery: true,
    };
  }

  // Distance unknown or unverified
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm)) {
    return {
      deliveryFeePaise: 0,
      pricingStatus: 'estimated',
      distanceSource: 'manual_confirmation',
      appliedRule: null,
      isFreeDelivery: false,
    };
  }

  // Find matching active rule
  const rule = rules.find(
    (r) => r.is_active && distanceKm >= r.min_distance_km && distanceKm <= r.max_distance_km
  );

  if (!rule) {
    // Beyond supported distance (e.g. > 5km): requires manual confirmation
    return {
      deliveryFeePaise: 0,
      pricingStatus: 'estimated',
      distanceSource: 'manual_confirmation',
      appliedRule: null,
      isFreeDelivery: false,
    };
  }

  // Check free delivery threshold
  if (rule.free_delivery_threshold_paise && subtotalPaise >= rule.free_delivery_threshold_paise) {
    return {
      deliveryFeePaise: 0,
      pricingStatus: 'confirmed',
      distanceSource: 'estimated',
      appliedRule: rule,
      isFreeDelivery: true,
    };
  }

  return {
    deliveryFeePaise: rule.delivery_fee_paise,
    pricingStatus: 'confirmed',
    distanceSource: 'estimated',
    appliedRule: rule,
    isFreeDelivery: false,
  };
}
