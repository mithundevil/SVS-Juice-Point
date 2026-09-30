import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { PRODUCTS } from '@/data/products';
import { ProductGrid } from '@/components/ProductGrid';
import { SHOP_DETAILS } from '@/lib/utils';
import { CategoryId } from '@/types';

export const metadata: Metadata = {
  title: 'Our Menu | SVS Fresh Juice Point',
  description:
    'Browse our menu of Nungu Sarbath, Ilaneer Shakes, Fresh Fruit Ice Creams, Sarbath, Milkshakes, Sharja, and Fresh Juices.',
};

interface MenuPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedParams = await searchParams;
  const categoryParam = (resolvedParams.category as CategoryId) || 'all';

  return (
    <div className="py-12 sm:py-16 bg-sand min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="bg-palm-deep text-cream rounded-3xl p-8 sm:p-12 shadow-card-hover border border-palm-700 text-center sm:text-left space-y-3">
          <span className="text-xs font-black uppercase text-gold-400 tracking-widest bg-palm-800 px-3.5 py-1 rounded-full border border-palm-700">
            {SHOP_DETAILS.nameTamil}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">Our Menu</h1>
          <p className="text-sm sm:text-base text-sand-200 font-medium max-w-2xl">
            Fresh favourites, crafted for every craving. Choose from cold ice apple juices, handmade fruit ice sticks, and creamy milkshakes.
          </p>
        </div>

        {/* Product Grid */}
        <Suspense fallback={<div className="text-center py-12 text-palm-deep font-extrabold text-sm uppercase tracking-wider">Loading Menu...</div>}>
          <ProductGrid products={PRODUCTS} initialCategory={categoryParam} />
        </Suspense>
      </div>
    </div>
  );
}
