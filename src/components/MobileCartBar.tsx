'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export const MobileCartBar: React.FC = () => {
  const { totalItems, subtotal, isHydrated } = useCart();

  if (!isHydrated || totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 pointer-events-none md:hidden animate-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-md mx-auto pointer-events-auto">
        <Link
          href="/cart"
          className="bg-palm-deep text-cream px-5 py-3.5 rounded-3xl shadow-floating flex items-center justify-between transition-all border border-palm-700 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="relative bg-palm-800 p-2 rounded-2xl border border-palm-700">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-palm-deep font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-palm-deep">
                {totalItems}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-sand-300">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Added
              </p>
              <p className="text-base font-black text-cream leading-none mt-0.5">
                {formatPrice(subtotal)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-cream text-palm-deep px-4 py-2 rounded-2xl shadow-sm">
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
};
