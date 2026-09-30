import React from 'react';
import Link from 'next/link';
import { Palmtree, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Your Cart is Empty',
  description = 'Looks like you haven’t added any delicious juices or ice creams yet.',
  buttonText = 'Explore Juice Menu',
  buttonHref = '/menu',
}) => {
  return (
    <div className="bg-cream rounded-3xl p-12 sm:p-16 text-center border border-sand-300 shadow-card max-w-lg mx-auto space-y-6 my-8">
      <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center text-palm-deep mx-auto shadow-inner border border-sand-200">
        <Palmtree className="w-10 h-10 text-gold-500" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-palm-deep">{title}</h3>
        <p className="text-xs sm:text-sm text-text-muted font-medium max-w-sm mx-auto">{description}</p>
      </div>

      <div>
        <Link
          href={buttonHref}
          className="inline-flex items-center gap-2 bg-palm-deep hover:bg-palm-800 text-cream font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-card transition-all active:scale-95 border border-palm-700"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4 text-gold-400" />
        </Link>
      </div>
    </div>
  );
};
