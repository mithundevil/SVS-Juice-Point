'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export const CartSummary: React.FC = () => {
  const { subtotal, totalItems } = useCart();

  return (
    <div className="bg-cream rounded-3xl p-6 border border-sand-300 shadow-card space-y-6 sticky top-24">
      <h3 className="text-lg font-black text-palm-deep border-b border-sand-300 pb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-gold-500" />
        <span>Order Summary</span>
      </h3>

      <div className="space-y-3.5 text-xs sm:text-sm font-medium text-text-muted">
        <div className="flex justify-between items-center">
          <span>Total Items</span>
          <span className="font-bold text-palm-deep">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-bold text-palm-deep">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Delivery Charge</span>
          <span className="text-palm-green font-bold uppercase tracking-wider text-[11px]">Calculated on WhatsApp</span>
        </div>

        <div className="border-t border-sand-300 pt-3 flex justify-between items-center text-base sm:text-lg font-black text-palm-deep">
          <span>Total Amount</span>
          <span className="text-xl text-palm-deep">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full bg-palm-deep hover:bg-palm-800 active:scale-95 text-cream font-extrabold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all flex items-center justify-center gap-2 text-center"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4 text-gold-400" />
      </Link>

      <div className="bg-sand-100 rounded-2xl p-3.5 border border-sand-200 text-xs text-text-muted space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-palm-deep">
          <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
          <span>WhatsApp Order Dispatch</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Your order will be instantly prepared as a pre-filled WhatsApp message sent to our shop.
        </p>
      </div>
    </div>
  );
};
