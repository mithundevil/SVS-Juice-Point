'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, 
  Home, 
  ShoppingBag, 
  Palmtree, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Receipt, 
  AlertCircle 
} from 'lucide-react';
import { SHOP_DETAILS, formatPrice } from '@/lib/utils';
import { CartItem, CheckoutFormData } from '@/types';
import { OrderRecord } from '@/lib/services/orders';

interface SavedOrderPayload {
  order?: OrderRecord;
  cart?: CartItem[];
  customer: CheckoutFormData;
  subtotal: number;
  deliveryFee?: number;
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

  const orderNumber = orderPayload?.order?.order_number || null;
  const isEstimated = orderPayload?.order?.pricing_status === 'estimated';

  return (
    <div className="py-16 sm:py-24 bg-sand min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-cream rounded-3xl p-8 sm:p-12 border border-sand-300 shadow-card-hover text-center space-y-8">
          
          {/* Header Icon */}
          <div className="w-20 h-20 bg-palm-deep text-gold-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-palm-700">
            <Palmtree className="w-10 h-10" />
          </div>

          {/* Title & Order Number */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Order Saved in Shop Database</span>
            </div>

            {orderNumber && (
              <div className="pt-1">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted block">
                  Official Order Number
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-black text-palm-deep mt-0.5">
                  {orderNumber}
                </p>
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl font-black text-palm-deep">
              Order Ready for WhatsApp Dispatch
            </h1>

            <p className="text-sm font-medium text-text-muted max-w-md mx-auto leading-relaxed">
              Your order has been recorded. Click below to send your pre-filled order message to our shop on WhatsApp.
            </p>

            <div className="bg-gold-500/10 text-gold-600 border border-gold-500/30 text-xs font-extrabold px-4 py-3 rounded-2xl inline-block max-w-md mt-2">
              ⚠️ Please press <span className="underline uppercase font-black">Send</span> in WhatsApp so our shop receives your order!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-card transition-all flex items-center justify-center gap-2.5 active:scale-95 border border-green-700"
            >
              <MessageCircle className="w-4 h-4 text-white" />
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
              <span>Home</span>
            </Link>
          </div>

          {/* Order Summary Card */}
          {orderPayload && (
            <div className="bg-sand-100 rounded-3xl p-6 border border-sand-300 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-sand-200 pb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-palm-deep flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-gold-500" />
                  <span>Order Summary</span>
                </h3>
                <span className="text-[10px] font-bold text-text-muted uppercase">
                  Status: Pending Confirmation
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-medium text-text-muted">
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

              {/* Items */}
              <div className="border-t border-sand-200 pt-3 space-y-1.5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-palm-deep">Items:</p>
                {orderPayload.order?.items ? (
                  orderPayload.order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-text-muted">
                      <span>
                        {item.quantity}x {item.product_name}
                        {item.with_ice_cream ? ' (With Ice Cream)' : ''}
                      </span>
                      <span className="font-bold text-palm-deep">
                        {formatPrice(Math.round(item.line_total_paise / 100))}
                      </span>
                    </div>
                  ))
                ) : orderPayload.cart ? (
                  orderPayload.cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-text-muted">
                      <span>
                        {item.quantity}x {item.product.name}
                        {item.withIceCream ? ' (With Ice Cream)' : ''}
                      </span>
                      <span className="font-bold text-palm-deep">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))
                ) : null}
              </div>

              {/* Totals */}
              <div className="border-t border-sand-200 pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-palm-deep">{formatPrice(orderPayload.subtotal)}</span>
                </div>
                {orderPayload.deliveryFee !== undefined && orderPayload.deliveryFee > 0 && (
                  <div className="flex justify-between text-text-muted">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-palm-deep">{formatPrice(orderPayload.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-palm-deep text-base pt-1 border-t border-sand-200">
                  <span>Total Amount</span>
                  <span>{formatPrice(orderPayload.total)}</span>
                </div>
              </div>

              {isEstimated && (
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Final delivery charge or fruit weights will be confirmed on WhatsApp by the shop.</span>
                </div>
              )}
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
