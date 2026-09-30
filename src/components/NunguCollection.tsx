'use client';

import React from 'react';
import Link from 'next/link';
import { Palmtree, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from './ProductCard';

export const NunguCollection: React.FC = () => {
  const signatureItems = PRODUCTS.filter((p) => p.category === 'nungu-ilaneer').slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-cream border-b border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand-300 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gold-500 bg-cream-200 px-3.5 py-1 rounded-full border border-sand-300">
              <Palmtree className="w-3.5 h-3.5" />
              <span>Signature Collection</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-palm-deep tracking-tight">
              Our Signature Nungu Collection
            </h2>
            <p className="text-sm sm:text-base text-text-muted font-medium max-w-xl">
              A refreshing collection inspired by the palmyra palm. Made with fresh tender ice apples and pure tender coconut.
            </p>
          </div>

          <Link
            href="/menu?category=nungu-ilaneer"
            className="text-xs font-extrabold text-palm-deep hover:text-palm-green uppercase tracking-widest flex items-center gap-2 group border-b-2 border-palm-deep pb-1 w-fit"
          >
            <span>Explore Nungu Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
