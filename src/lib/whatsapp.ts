import { CartItem, CheckoutFormData } from '@/types';
import { SHOP_DETAILS, formatPrice } from './utils';

export function buildWhatsAppOrderMessage(
  items: CartItem[],
  customer: CheckoutFormData,
  subtotal: number,
  total: number
): string {
  const lines: string[] = [];

  lines.push('🌴 *SVS FRESH JUICE POINT*');
  lines.push(`*${SHOP_DETAILS.nameTamil}*`);
  lines.push('--------------------------------');
  lines.push('*NEW ORDER*');
  lines.push('--------------------------------\n');

  lines.push('*Order Items:*');

  items.forEach((item, index) => {
    const p = item.product;
    const itemTitle = `${index + 1}. *${p.name}*`;
    lines.push(itemTitle);
    lines.push(`   Qty: ${item.quantity} x ${formatPrice(item.unitPrice)}`);
    if (item.withIceCream) {
      lines.push(`   Add-on: With Ice Cream (+₹20)`);
    }
    lines.push(`   Item Total: *${formatPrice(item.totalPrice)}*\n`);
  });

  lines.push('--------------------------------');
  lines.push(`Subtotal: *${formatPrice(subtotal)}*`);
  lines.push(`*Total Amount: ${formatPrice(total)}*`);
  lines.push('--------------------------------\n');

  lines.push('*Customer Details:*');
  lines.push(`👤 *Name:* ${customer.name.trim()}`);
  lines.push(`📞 *Mobile:* ${customer.mobile.trim()}`);
  lines.push(`🛵 *Order Type:* ${customer.orderType === 'delivery' ? 'Delivery' : 'Pickup'}`);

  if (customer.orderType === 'delivery') {
    lines.push(`📍 *Address:* ${customer.address.trim()}`);
    if (customer.landmark && customer.landmark.trim()) {
      lines.push(`🏢 *Landmark:* ${customer.landmark.trim()}`);
    }
  } else {
    lines.push(`🏪 *Pickup Location:* ${SHOP_DETAILS.location}`);
  }

  lines.push(
    `💳 *Payment Method:* ${
      customer.paymentMethod === 'cod'
        ? customer.orderType === 'delivery'
          ? 'Cash on Delivery'
          : 'Pay at Shop'
        : 'UPI / Online'
    }`
  );

  if (customer.notes && customer.notes.trim()) {
    lines.push(`📝 *Notes:* ${customer.notes.trim()}`);
  }

  lines.push('\nThank you for ordering!');

  return lines.join('\n');
}

/**
 * Builds a WhatsApp message using a saved order record from the database.
 * Includes the official Order Number, server-validated totals, and pricing status.
 */
export function buildWhatsAppOrderMessageWithNumber(order: {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'delivery' | 'pickup';
  delivery_address: string | null;
  landmark: string | null;
  subtotal_paise: number;
  delivery_fee_paise: number;
  total_paise: number;
  pricing_status: 'estimated' | 'confirmed';
  payment_method: 'cod' | 'upi';
  customer_notes: string | null;
  items?: Array<{
    product_name: string;
    unit: string;
    quantity: number;
    unit_price_paise: number;
    line_total_paise: number;
    with_ice_cream: boolean;
  }>;
}): string {
  const lines: string[] = [];

  const subtotalRs = Math.round(order.subtotal_paise / 100);
  const deliveryFeeRs = Math.round(order.delivery_fee_paise / 100);
  const totalRs = Math.round(order.total_paise / 100);

  lines.push('🌴 *SVS FRESH JUICE POINT*');
  lines.push(`*${SHOP_DETAILS.nameTamil}*`);
  lines.push('--------------------------------');
  lines.push(`🧾 *ORDER #${order.order_number}*`);
  lines.push('--------------------------------\n');

  lines.push('*Items Ordered:*');
  if (order.items && order.items.length > 0) {
    order.items.forEach((item, index) => {
      const unitPriceRs = Math.round(item.unit_price_paise / 100);
      const lineTotalRs = Math.round(item.line_total_paise / 100);
      const itemTitle = `${index + 1}. *${item.product_name}*`;
      lines.push(itemTitle);
      lines.push(`   Qty: ${item.quantity} x ${formatPrice(unitPriceRs)}`);
      if (item.with_ice_cream) {
        lines.push(`   Add-on: With Ice Cream (+₹20)`);
      }
      lines.push(`   Item Total: *${formatPrice(lineTotalRs)}*\n`);
    });
  }

  lines.push('--------------------------------');
  lines.push(`Subtotal: *${formatPrice(subtotalRs)}*`);

  if (order.order_type === 'delivery') {
    if (order.pricing_status === 'estimated' && order.delivery_fee_paise === 0) {
      lines.push(`Delivery Fee: *To be confirmed by shop* (Estimated)`);
      lines.push(`*Estimated Total: ${formatPrice(totalRs)}* (+ delivery fee)`);
    } else if (order.delivery_fee_paise === 0) {
      lines.push(`Delivery Fee: *FREE* (Above ₹1,000 threshold)`);
      lines.push(`*Total Amount: ${formatPrice(totalRs)}*`);
    } else {
      lines.push(`Delivery Fee: *${formatPrice(deliveryFeeRs)}*`);
      lines.push(`*Total Amount: ${formatPrice(totalRs)}*`);
    }
  } else {
    lines.push(`Delivery Fee: *₹0 (Pickup)*`);
    lines.push(`*Total Amount: ${formatPrice(totalRs)}*`);
  }
  lines.push('--------------------------------\n');

  lines.push('*Customer Information:*');
  lines.push(`👤 *Name:* ${order.customer_name}`);
  lines.push(`📞 *Phone:* ${order.customer_phone}`);
  lines.push(`🛵 *Service:* ${order.order_type === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}`);

  if (order.order_type === 'delivery' && order.delivery_address) {
    lines.push(`📍 *Address:* ${order.delivery_address}`);
    if (order.landmark) {
      lines.push(`🏢 *Landmark:* ${order.landmark}`);
    }
  } else {
    lines.push(`🏪 *Pickup Location:* ${SHOP_DETAILS.location}`);
  }

  lines.push(
    `💳 *Payment:* ${
      order.payment_method === 'cod'
        ? order.order_type === 'delivery'
          ? 'Cash on Delivery'
          : 'Pay at Counter'
        : 'UPI / Online'
    }`
  );

  if (order.customer_notes) {
    lines.push(`📝 *Special Instructions:* ${order.customer_notes}`);
  }

  lines.push(`\n⏳ *Status:* Pending Shop Confirmation`);
  lines.push('⚠️ *Please press SEND to confirm your order with SVS Juice Point!*');

  const text = lines.join('\n');
  return `https://wa.me/${SHOP_DETAILS.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function generateWhatsAppUrl(
  items: CartItem[],
  customer: CheckoutFormData,
  subtotal: number,
  total: number
): string {
  const message = buildWhatsAppOrderMessage(items, customer, subtotal, total);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${SHOP_DETAILS.whatsappNumber}?text=${encodedText}`;
}

export function generateGeneralInquiryWhatsAppUrl(customText?: string): string {
  const defaultMsg = `Hello SVS Fresh Juice Point, I would like to inquire about fresh juices and today's menu!`;
  const text = encodeURIComponent(customText || defaultMsg);
  return `https://wa.me/${SHOP_DETAILS.whatsappNumber}?text=${text}`;
}
