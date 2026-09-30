'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Home, ShoppingBag, Palmtree } from 'lucide-react';
import { SHOP_DETAILS, formatPrice } from '@/lib/utils';
import { CartItem, CheckoutFormData } from '@/types';

interface SavedOrderPayload {
  cart: CartItem[];
  customer: CheckoutFormData;
  subtotal: number;
  total: number;
  whatsappUrl: string;
  timestamp: string;
}

export default function OrderSuccessPage() {
  const [orderPayload, setOrderPayload] = useState<SavedOrderPayload | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('last_svs_order');
      if (saved) {
        setOrderPayload(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse order payload:', e);
    }
  }, []);

  const whatsappUrl =
    orderPayload?.whatsappUrl || `https://wa.me/${SHOP_DETAILS.whatsappNumber}`;

  return (
    <div className="py-16 sm:py-24 bg-sand min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-cream rounded-3xl p-8 sm:p-12 border border-sand-300 shadow-card-hover text-center space-y-8">
          {/* Header Icon */}
          <div className="w-20 h-20 bg-palm-deep text-gold-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-palm-700">
            <Palmtree className="w-10 h-10" />
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase text-gold-500 tracking-widest bg-sand-200 px-3 py-1 rounded-full">
              Order Details Prepared
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-palm-deep">
              Order Ready
            </h1>
            <p className="text-sm sm:text-base font-medium text-text-muted max-w-md mx-auto leading-relaxed">
              Your order details are prepared in WhatsApp. Send the message to complete your order.
            </p>
            <div className="bg-gold-500/10 text-gold-500 border border-gold-500/30 text-xs font-extrabold px-4 py-3 rounded-2xl inline-block max-w-md mt-2">
              ⚠️ Please press <span className="underline uppercase font-black">Send</span> in WhatsApp so our shop receives your order!
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-palm-deep hover:bg-palm-800 text-cream font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-card transition-all flex items-center justify-center gap-2.5 active:scale-95 border border-palm-700"
            >
              <MessageCircle className="w-4 h-4 text-gold-400" />
              <span>Open WhatsApp</span>
            </a>

            <Link
              href="/menu"
              className="w-full sm:w-auto bg-sand-200 hover:bg-sand-300 text-palm-deep font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-2xl border border-sand-300 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-gold-500" />
              <span>Back to Menu</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto bg-cream hover:bg-white text-text-muted font-extrabold text-xs uppercase tracking-wider px-5 py-4 rounded-2xl transition-all border border-sand-300 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Order Summary Copy */}
          {orderPayload && (
            <div className="bg-sand-100 rounded-3xl p-6 border border-sand-300 text-left space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-palm-deep border-b border-sand-200 pb-2">
                Order Summary Copy
              </h3>

              <div className="space-y-2 text-xs font-medium text-text-muted">
                <p>
                  Customer: <span className="text-palm-deep font-bold">{orderPayload.customer.name} ({orderPayload.customer.mobile})</span>
                </p>
                <p>
                  Type: <span className="text-palm-deep font-bold uppercase">{orderPayload.customer.orderType}</span>
                </p>
                {orderPayload.customer.orderType === 'delivery' && (
                  <p>
                    Delivery Address: <span className="text-palm-deep font-bold">{orderPayload.customer.address}</span>
                  </p>
                )}
              </div>

              <div className="border-t border-sand-200 pt-3 space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-palm-deep">Items Ordered:</p>
                {orderPayload.cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-text-muted">
                    <span>
                      {item.quantity}x {item.product.name}
                      {item.withIceCream ? ' (With Ice Cream)' : ''}
                    </span>
                    <span className="font-bold text-palm-deep">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand-200 pt-2 flex justify-between font-black text-palm-deep text-sm">
                <span>Total Amount</span>
                <span>{formatPrice(orderPayload.subtotal)}</span>
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="pt-2 text-xs text-text-muted space-y-1 border-t border-sand-200">
            <p className="font-bold text-palm-deep">Need help with your order?</p>
            <p>
              Call us directly at{' '}
              <a href={`tel:${SHOP_DETAILS.phones[0]}`} className="font-bold text-palm-deep underline">
                {SHOP_DETAILS.displayPhones[0]}
              </a>{' '}
              or{' '}
              <a href={`tel:${SHOP_DETAILS.phones[1]}`} className="font-bold text-palm-deep underline">
                {SHOP_DETAILS.displayPhones[1]}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
