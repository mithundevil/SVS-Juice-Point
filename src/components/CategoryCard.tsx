import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryInfo } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

interface CategoryCardProps {
  category: CategoryInfo;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const itemCount = PRODUCTS.filter((p) => p.category === category.id).length;

  return (
    <Link
      href={`/menu?category=${category.id}`}
      className="group relative bg-cream-50 rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-palm-deep/10 transition-all duration-300 flex flex-col justify-between h-full focus:outline-none"
    >
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-sand-200">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-palm-deep/85 via-palm-deep/20 to-transparent" />

        {category.badge && (
          <span className="absolute top-3 right-3 bg-cream text-palm-deep font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-sand-300">
            {category.badge}
          </span>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-gold-400">
            {itemCount} Items
          </span>
          <h3 className="text-xl font-black text-cream leading-tight">
            {category.name}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between bg-cream-50">
        <p className="text-xs text-text-muted font-medium line-clamp-2 mb-4 leading-relaxed">
          {category.description}
        </p>

        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-palm-deep group-hover:text-palm-green pt-3 border-t border-sand-200">
          <span>Explore Category</span>
          <div className="w-7 h-7 rounded-full bg-cream-200 group-hover:bg-palm-deep group-hover:text-cream flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
