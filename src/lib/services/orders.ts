import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { CreateOrderInput } from '@/lib/validations/order';
import { getActiveDeliveryRules, calculateDeliveryFee } from './delivery';
import { PRODUCTS as FALLBACK_PRODUCTS } from '@/data/products';
import { buildWhatsAppOrderMessageWithNumber } from '@/lib/whatsapp';

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface OrderItemRecord {
  id?: string;
  order_id?: string;
  product_id: string | null;
  product_name: string;
  unit: string;
  quantity: number;
  unit_price_paise: number;
  line_total_paise: number;
  with_ice_cream: boolean;
  ice_cream_addon_paise: number;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'delivery' | 'pickup';
  delivery_address: string | null;
  landmark: string | null;
  delivery_distance_km: number | null;
  distance_source: string;
  subtotal_paise: number;
  delivery_fee_paise: number;
  total_paise: number;
  applied_delivery_rule_snapshot?: any;
  pricing_status: 'estimated' | 'confirmed';
  status: OrderStatus;
  payment_method: 'cod' | 'upi';
  customer_notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
}

/**
 * Valid state transitions for orders
 */
export const PERMITTED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_confirmation: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['out_for_delivery', 'completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

// In-memory store for fallback / dev without live Supabase credentials
const memoryOrders: OrderRecord[] = (globalThis as any).__svs_memory_orders || [];
(globalThis as any).__svs_memory_orders = memoryOrders;
let memOrderSeq = (globalThis as any).__svs_order_seq || 1000;

/**
 * Create a new order with 100% server-authoritative pricing and atomic database insertion.
 */
export async function createOrder(input: CreateOrderInput): Promise<{
  order: OrderRecord;
  whatsappUrl: string;
}> {
  const adminClient = createAdminClient();
  const rules = await getActiveDeliveryRules();

  // If Supabase is connected, call RPC function or execute transactional logic
  if (adminClient) {
    try {
      const { data: rpcData, error: rpcError } = await adminClient.rpc('create_order_transaction', {
        p_customer_name: input.customerName,
        p_customer_phone: input.customerPhone,
        p_order_type: input.orderType,
        p_delivery_address: input.deliveryAddress || null,
        p_landmark: input.landmark || null,
        p_customer_notes: input.customerNotes || null,
        p_payment_method: input.paymentMethod || 'cod',
        p_items: input.items,
        p_client_distance_km: input.clientDistanceKm ?? null,
      });

      if (!rpcError && rpcData) {
        // Fetch the complete inserted order with items
        const { data: fullOrder } = await adminClient
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', rpcData.orderId)
          .single();

        if (fullOrder) {
          const items: OrderItemRecord[] = (fullOrder.order_items || []).map((i: any) => ({
            product_id: i.product_id,
            product_name: i.product_name,
            unit: i.unit,
            quantity: Number(i.quantity),
            unit_price_paise: i.unit_price_paise,
            line_total_paise: i.line_total_paise,
            with_ice_cream: i.with_ice_cream,
            ice_cream_addon_paise: i.ice_cream_addon_paise,
          }));

          const orderRecord: OrderRecord = {
            id: fullOrder.id,
            order_number: fullOrder.order_number,
            customer_name: fullOrder.customer_name,
            customer_phone: fullOrder.customer_phone,
            order_type: fullOrder.order_type,
            delivery_address: fullOrder.delivery_address,
            landmark: fullOrder.landmark,
            delivery_distance_km: fullOrder.delivery_distance_km,
            distance_source: fullOrder.distance_source,
            subtotal_paise: fullOrder.subtotal_paise,
            delivery_fee_paise: fullOrder.delivery_fee_paise,
            total_paise: fullOrder.total_paise,
            pricing_status: fullOrder.pricing_status,
            status: fullOrder.status,
            payment_method: fullOrder.payment_method,
            customer_notes: fullOrder.customer_notes,
            created_at: fullOrder.created_at,
            updated_at: fullOrder.updated_at,
            items,
          };

          const whatsappUrl = buildWhatsAppOrderMessageWithNumber(orderRecord);
          return { order: orderRecord, whatsappUrl };
        }
      } else if (rpcError) {
        console.warn('RPC create_order_transaction error, attempting direct query:', rpcError);
      }
    } catch (e) {
      console.error('Error invoking create_order_transaction:', e);
    }
  }

  // Fallback calculation using local catalog (guarantees zero downtime if Supabase is unconfigured)
  let subtotalPaise = 0;
  const items: OrderItemRecord[] = [];

  for (const item of input.items) {
    const fallbackProd = FALLBACK_PRODUCTS.find((p) => p.id === item.productId);
    if (!fallbackProd) {
      throw new Error(`Product ${item.productId} was not found in the catalog.`);
    }

    const unitPricePaise = Math.round(fallbackProd.price * 100);
    const addonPricePaise = item.withIceCream && fallbackProd.allowIceCreamAddon ? 2000 : 0;
    const lineTotalPaise = item.quantity * (unitPricePaise + addonPricePaise);

    subtotalPaise += lineTotalPaise;
    items.push({
      product_id: fallbackProd.id,
      product_name: fallbackProd.name,
      unit: 'serving',
      quantity: item.quantity,
      unit_price_paise: unitPricePaise,
      line_total_paise: lineTotalPaise,
      with_ice_cream: item.withIceCream,
      ice_cream_addon_paise: addonPricePaise,
    });
  }

  const deliveryCalc = calculateDeliveryFee(
    input.orderType,
    subtotalPaise,
    rules,
    input.clientDistanceKm
  );

  const totalPaise = subtotalPaise + deliveryCalc.deliveryFeePaise;
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const orderNumber = `SVS-${todayStr}-${String(++memOrderSeq).slice(-4)}`;

  const orderRecord: OrderRecord = {
    id: `local-${Date.now()}`,
    order_number: orderNumber,
    customer_name: input.customerName.trim(),
    customer_phone: input.customerPhone.trim(),
    order_type: input.orderType,
    delivery_address: input.deliveryAddress?.trim() || null,
    landmark: input.landmark?.trim() || null,
    delivery_distance_km: input.clientDistanceKm ?? null,
    distance_source: deliveryCalc.distanceSource,
    subtotal_paise: subtotalPaise,
    delivery_fee_paise: deliveryCalc.deliveryFeePaise,
    total_paise: totalPaise,
    pricing_status: deliveryCalc.pricingStatus,
    status: 'pending_confirmation',
    payment_method: input.paymentMethod || 'cod',
    customer_notes: input.customerNotes?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items,
  };

  memoryOrders.unshift(orderRecord);
  const whatsappUrl = buildWhatsAppOrderMessageWithNumber(orderRecord);
  return { order: orderRecord, whatsappUrl };
}

/**
 * Fetch orders for owner dashboard with search and filters.
 */
export async function getOrdersAdmin(options?: {
  status?: string;
  search?: string;
  limit?: number;
  page?: number;
}): Promise<{ orders: OrderRecord[]; total: number }> {
  const adminClient = createAdminClient();
  const limit = options?.limit || 20;
  const page = options?.page || 1;
  const offset = (page - 1) * limit;

  if (adminClient) {
    let query = adminClient
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' });

    if (options?.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }

    if (options?.search) {
      const s = options.search.trim();
      query = query.or(`order_number.ilike.%${s}%,customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%`);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (!error && data) {
      const orders: OrderRecord[] = data.map((o: any) => ({
        ...o,
        items: o.order_items || [],
      }));
      return { orders, total: count || orders.length };
    }
  }

  // Fallback to in-memory orders
  let filtered = [...memoryOrders];
  if (options?.status && options.status !== 'all') {
    filtered = filtered.filter((o) => o.status === options.status);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.order_number.toLowerCase().includes(s) ||
        o.customer_name.toLowerCase().includes(s) ||
        o.customer_phone.includes(s)
    );
  }

  const paginated = filtered.slice(offset, offset + limit);
  return { orders: paginated, total: filtered.length };
}

/**
 * Get single order by order number or ID
 */
export async function getOrderByNumber(orderNumber: string): Promise<OrderRecord | null> {
  const adminClient = createAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNumber)
      .single();

    if (!error && data) {
      return {
        ...data,
        items: data.order_items || [],
      };
    }
  }

  return memoryOrders.find((o) => o.order_number === orderNumber) || null;
}

/**
 * Transition order status
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  if (adminClient) {
    // Check current status
    const { data: currentOrder } = await adminClient
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single();

    if (currentOrder) {
      const permitted = PERMITTED_STATUS_TRANSITIONS[currentOrder.status as OrderStatus] || [];
      if (!permitted.includes(newStatus)) {
        return {
          success: false,
          error: `Cannot transition from '${currentOrder.status}' to '${newStatus}'`,
        };
      }
    }

    const { error } = await adminClient
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // Fallback in-memory
  const order = memoryOrders.find((o) => o.id === orderId);
  if (order) {
    order.status = newStatus;
    order.updated_at = new Date().toISOString();
    return { success: true };
  }

  return { success: false, error: 'Order not found' };
}

/**
 * Update distance and confirmed delivery fee by owner
 */
export async function updateOrderDistanceAndFee(
  orderId: string,
  distanceKm: number,
  deliveryFeePaise: number
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  if (adminClient) {
    const { data: order } = await adminClient
      .from('orders')
      .select('subtotal_paise')
      .eq('id', orderId)
      .single();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const newTotal = order.subtotal_paise + deliveryFeePaise;

    const { error } = await adminClient
      .from('orders')
      .update({
        delivery_distance_km: distanceKm,
        delivery_fee_paise: deliveryFeePaise,
        total_paise: newTotal,
        pricing_status: 'confirmed',
        distance_source: 'manual_confirmation',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // Fallback in memory
  const order = memoryOrders.find((o) => o.id === orderId);
  if (order) {
    order.delivery_distance_km = distanceKm;
    order.delivery_fee_paise = deliveryFeePaise;
    order.total_paise = order.subtotal_paise + deliveryFeePaise;
    order.pricing_status = 'confirmed';
    order.distance_source = 'manual_confirmation';
    order.updated_at = new Date().toISOString();
    return { success: true };
  }

  return { success: false, error: 'Order not found' };
}
