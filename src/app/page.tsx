import React from 'react';
import { Hero } from '@/components/Hero';
import { NunguCollection } from '@/components/NunguCollection';
import { CategorySection } from '@/components/CategorySection';
import { PopularProducts } from '@/components/PopularProducts';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { WhatsAppCTA } from '@/components/WhatsAppCTA';
import { ShopLocation } from '@/components/ShopLocation';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Signature Nungu Collection */}
      <NunguCollection />

      {/* 4. Explore Our Menu */}
      <CategorySection />

      {/* 5. Fresh Favourites */}
      <PopularProducts />

      {/* 6. Freshness You Can Taste */}
      <WhyChooseUs />

      {/* 7. WhatsApp Order CTA */}
      <WhatsAppCTA />

      {/* 8. Visit Us Location Section */}
      <ShopLocation />
    </div>
  );
}
