import { NextRequest, NextResponse } from 'next/server';
import { verifyOwnerSession } from '@/lib/services/auth';
import { getAllDeliveryRules } from '@/lib/services/delivery';
import { DeliveryRuleSchema } from '@/lib/validations/delivery';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const session = await verifyOwnerSession();
  if (!session && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const rules = await getAllDeliveryRules();
  return NextResponse.json({ success: true, rules });
}

export async function POST(req: NextRequest) {
  const session = await verifyOwnerSession();
  if (!session && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = DeliveryRuleSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid delivery rule', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, error: 'Database client not configured' },
        { status: 500 }
      );
    }

    const ruleData = parseResult.data;

    // Check for conflicting active distance ranges if needed
    if (ruleData.id) {
      const { error } = await adminClient
        .from('delivery_rules')
        .update({
          min_distance_km: ruleData.minDistanceKm,
          max_distance_km: ruleData.maxDistanceKm,
          delivery_fee_paise: ruleData.deliveryFeePaise,
          free_delivery_threshold_paise: ruleData.freeDeliveryThresholdPaise ?? null,
          is_active: ruleData.isActive,
          sort_order: ruleData.sortOrder,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ruleData.id);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    } else {
      const { error } = await adminClient
        .from('delivery_rules')
        .insert({
          min_distance_km: ruleData.minDistanceKm,
          max_distance_km: ruleData.maxDistanceKm,
          delivery_fee_paise: ruleData.deliveryFeePaise,
          free_delivery_threshold_paise: ruleData.freeDeliveryThresholdPaise ?? null,
          is_active: ruleData.isActive,
          sort_order: ruleData.sortOrder,
        });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delivery rules error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update rule' },
      { status: 500 }
    );
  }
}
