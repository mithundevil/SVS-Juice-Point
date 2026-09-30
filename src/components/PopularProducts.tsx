'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from './ProductCard';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const PopularProducts: React.FC = () => {
  // Select 6 popular items
  const popularItems = PRODUCTS.filter((p) => p.popular).slice(0, 6);

  return (
    <section className="py-20 sm:py-28 bg-cream border-b border-sand-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand-300 pb-6">
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-gold-500 tracking-widest bg-sand-200 px-3.5 py-1 rounded-full">
              Customer Specials
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-palm-deep tracking-tight">
              Fresh Favourites
            </h2>
            <p className="text-sm sm:text-base text-text-muted font-medium max-w-xl">
              Made fresh. Served chilled.
            </p>
          </div>

          <Link
            href="/menu"
            className="bg-palm-deep hover:bg-palm-800 text-cream font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-sm transition-all flex items-center gap-2 border border-palm-700"
          >
            <ShoppingBag className="w-4 h-4 text-gold-400" />
            <span>Order All Juices</span>
          </Link>
        </div>

        {/* 6 Popular Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
