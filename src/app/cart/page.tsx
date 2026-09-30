'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from '@/components/CartItem';
import { CartSummary } from '@/components/CartSummary';
import { EmptyState } from '@/components/EmptyState';

export default function CartPage() {
  const { cart, clearCart, totalItems, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="py-20 text-center font-extrabold text-palm-deep text-xs uppercase tracking-wider">
        Loading Cart...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-12 bg-sand min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-sand min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-sand-300 pb-4">
          <div className="space-y-1">
            <Link
              href="/menu"
              className="text-xs font-extrabold uppercase tracking-wider text-palm-deep hover:text-palm-green inline-flex items-center gap-1 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Menu
            </Link>
            <h1 className="text-3xl font-black text-palm-deep flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-gold-500" />
              <span>Shopping Cart</span>
              <span className="text-sm font-bold text-text-muted font-sans">({totalItems} items)</span>
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-extrabold uppercase tracking-wider text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2.5 rounded-2xl transition-colors inline-flex items-center gap-1.5 border border-rose-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Entire Cart</span>
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
