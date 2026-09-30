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
