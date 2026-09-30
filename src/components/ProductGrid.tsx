'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Palmtree } from 'lucide-react';
import { Product, CategoryId } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  initialCategory?: CategoryId | 'all';
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query || product.name.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Section */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nungu, sarbath, milkshake, or fruit juice..."
            className="w-full pl-11 pr-10 py-4 rounded-full bg-cream border border-sand-300 text-palm-deep placeholder-text-muted text-sm font-medium focus:outline-none focus:ring-2 focus:ring-palm-green focus:border-transparent shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-palm-deep"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-palm-deep text-cream shadow-sm'
                : 'bg-cream text-palm-deep hover:bg-sand-200 border border-sand-300'
            }`}
          >
            All Products ({products.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-palm-deep text-cream shadow-sm'
                    : 'bg-cream text-palm-deep hover:bg-sand-200 border border-sand-300'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Results Header */}
      <div className="flex items-center justify-between border-b border-sand-300 pb-3">
        <p className="text-xs font-extrabold uppercase tracking-widest text-text-muted">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Item' : 'Items'}
        </p>

        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-extrabold text-gold-500 hover:underline uppercase tracking-wider"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty Search State */
        <div className="bg-cream rounded-3xl p-12 text-center border border-sand-300 max-w-md mx-auto my-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center text-palm-deep mx-auto">
            <Palmtree className="w-8 h-8 text-gold-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-black text-palm-deep">No favourites found</h4>
            <p className="text-xs text-text-muted font-medium">
              We couldn&apos;t find any products matching &quot;{searchQuery}&quot;. Try searching for another keyword.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="bg-palm-deep hover:bg-palm-800 text-cream text-xs font-extrabold uppercase tracking-wider px-6 py-3 rounded-2xl"
          >
            Show All Menu Items
          </button>
        </div>
      )}
    </div>
  );
};
