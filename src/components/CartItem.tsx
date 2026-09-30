'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export const CartItemRow: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product;

  return (
    <div className="bg-cream rounded-3xl p-4 sm:p-5 border border-sand-300 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-sand-300/90">
      {/* Image & Info */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-sand-100 shrink-0 border border-sand-200">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="text-base font-black text-palm-deep leading-tight">
            {product.name}
          </h4>

          {item.withIceCream && (
            <span className="inline-block bg-sand-200 text-palm-deep font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-sand-300">
              🍦 With Ice Cream (+₹20)
            </span>
          )}

          <p className="text-xs text-text-muted font-medium sm:hidden">
            Price: {formatPrice(item.unitPrice)} each
          </p>
        </div>
      </div>

      {/* Controls & Total */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-sand-200">
        {/* Quantity Modifier */}
        <div className="flex items-center gap-2 bg-sand-200/80 p-1.5 rounded-2xl border border-sand-300">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 rounded-xl bg-cream hover:bg-white text-palm-deep disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="w-8 text-center font-black text-sm text-palm-deep">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-xl bg-cream hover:bg-white text-palm-deep flex items-center justify-center transition-colors shadow-sm"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[70px]">
          <p className="text-base font-black text-palm-deep">
            {formatPrice(item.totalPrice)}
          </p>
        </div>

        {/* Remove */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
