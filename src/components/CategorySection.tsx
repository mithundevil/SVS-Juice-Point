import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { CategoryCard } from './CategoryCard';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

export const CategorySection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-sand border-b border-sand-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand-300 pb-6">
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-gold-500 tracking-widest bg-sand-200 px-3.5 py-1 rounded-full">
              Full Menu Categories
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-palm-deep tracking-tight">
              Explore Our Menu
            </h2>
            <p className="text-sm sm:text-base text-text-muted font-medium max-w-xl">
              Something fresh for every craving.
            </p>
          </div>

          <Link
            href="/menu"
            className="text-xs font-extrabold text-palm-deep hover:text-palm-green uppercase tracking-widest flex items-center gap-2 group border-b-2 border-palm-deep pb-1 w-fit"
          >
            <span>View All ({PRODUCTS.length} Items)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 7 Categories Grid (4 columns desktop, 2 columns mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
