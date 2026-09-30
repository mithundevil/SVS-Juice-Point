'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CheckoutForm } from '@/components/CheckoutForm';
import { EmptyState } from '@/components/EmptyState';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { cart, subtotal, totalItems, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="py-20 text-center font-extrabold text-palm-deep text-xs uppercase tracking-wider">
        Loading Checkout...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-12 bg-sand min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            title="Cart is Empty"
            description="You need to add items to your cart before proceeding to checkout."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-sand min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/cart"
            className="text-xs font-extrabold uppercase tracking-wider text-palm-deep hover:text-palm-green inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <h1 className="text-3xl font-black text-palm-deep">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>

          {/* Right Summary Preview */}
          <div className="lg:col-span-5 bg-cream rounded-3xl p-6 border border-sand-300 shadow-card space-y-6 sticky top-24">
            <h3 className="text-lg font-black text-palm-deep border-b border-sand-300 pb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <span>Your Order ({totalItems} items)</span>
              </span>
              <Link href="/cart" className="text-xs font-extrabold text-gold-500 uppercase tracking-wider hover:underline">
                Edit Cart
              </Link>
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm py-2 border-b border-sand-200 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-sand-100 overflow-hidden shrink-0 border border-sand-200">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-extrabold text-palm-deep text-xs sm:text-sm">
                        {item.product.name}
                      </p>
                      {item.withIceCream && (
                        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-wider">
                          🍦 With Ice Cream (+₹20)
                        </p>
                      )}
                      <p className="text-xs text-text-muted font-medium">
                        Qty: {item.quantity} x {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-palm-deep text-sm">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-sand-300 pt-4 space-y-2 text-xs font-medium text-text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-palm-deep text-sm">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-palm-green uppercase tracking-wider text-[10px]">Calculated on WhatsApp</span>
              </div>
              <div className="flex justify-between border-t border-sand-300 pt-3 text-base font-black text-palm-deep">
                <span>Total Amount</span>
                <span className="text-xl">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="bg-sand-100 p-4 rounded-2xl text-xs text-text-muted border border-sand-200 space-y-1">
              <p className="font-extrabold text-palm-deep flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-gold-500" /> Direct WhatsApp Dispatch
              </p>
              <p className="text-[11px] leading-relaxed">
                Clicking &quot;Order on WhatsApp&quot; will launch WhatsApp with your formatted order text.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
