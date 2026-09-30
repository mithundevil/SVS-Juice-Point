'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, ShoppingBag, Palmtree } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/data/categories';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [withIceCream, setWithIceCream] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const categoryName =
    CATEGORIES.find((c) => c.id === product.category)?.name || 'Juice Bar';

  const extraPrice = product.allowIceCreamAddon && withIceCream ? 20 : 0;
  const currentUnitPrice = product.price + extraPrice;

  const targetCartItemId =
    product.allowIceCreamAddon && withIceCream
      ? `${product.id}_icecream`
      : product.id;
  const existingCartItem = cart.find((item) => item.id === targetCartItemId);

  const handleAddToCart = () => {
    addToCart(product, 1, withIceCream);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1200);
  };

  return (
    <div className="group relative bg-cream-50 rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-palm-deep/10 transition-all duration-300 flex flex-col justify-between h-full">
      <div className="relative aspect-square w-full bg-sand-200 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {product.popular && (
          <span className="absolute top-3 left-3 bg-palm-deep text-cream font-extrabold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-palm-700/50">
            <Palmtree className="w-3 h-3 text-gold-500" />
            <span>Popular</span>
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-gold-500">
            {categoryName}
          </span>

          <h3 className="text-base sm:text-lg font-black text-palm-deep leading-tight group-hover:text-palm-green transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-text-muted font-medium line-clamp-2 leading-relaxed pt-0.5">
              {product.description}
            </p>
          )}
        </div>

        {product.allowIceCreamAddon && (
          <div className="bg-cream-200/80 rounded-2xl p-2.5 border border-sand-300">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-palm-deep">
              <input
                type="checkbox"
                checked={withIceCream}
                onChange={(e) => setWithIceCream(e.target.checked)}
                className="w-4 h-4 rounded text-palm-deep focus:ring-palm-deep border-sand-300 accent-palm-deep"
              />
              <span className="flex-1 font-medium">With Ice Cream</span>
              <span className="text-gold-500 font-black">+₹20</span>
            </label>
          </div>
        )}

        <div className="pt-3 border-t border-sand-200 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted block">
              Price
            </span>
            <span className="text-lg font-black text-palm-deep">
              {formatPrice(currentUnitPrice)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`py-2.5 px-4 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 active:scale-95 shadow-sm ${
              addedFeedback
                ? 'bg-palm-deep text-cream shadow-md'
                : existingCartItem
                ? 'bg-cream-200 text-palm-deep hover:bg-sand-200 border border-sand-300'
                : 'bg-palm-deep hover:bg-palm-green text-cream'
            }`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4 text-gold-500" />
                <span>Added</span>
              </>
            ) : existingCartItem ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-gold-500" />
                <span>Add More ({existingCartItem.quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
