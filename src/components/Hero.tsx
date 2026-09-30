'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Leaf } from 'lucide-react';
import { SHOP_DETAILS } from '@/lib/utils';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[90svh] min-h-[600px] max-h-[900px] flex items-center justify-start overflow-hidden bg-palm-deep">
      
      {/* Full-width background banner image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/uploaded-banner.jpg"
          alt="SVS Fresh Juice Point Natural Beverage Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-subtle-zoom"
          quality={100}
        />
        
        {/* Cinematic Gradient Overlays for perfect text readability without hiding the image entirely */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent sm:w-[75%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center sm:items-start text-center sm:text-left mt-12 sm:mt-0">
        
        <div className="max-w-2xl space-y-6 sm:space-y-8 animate-fade-in-up">
          
          {/* Top Badge: Tamil Shop Name */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-white/20 transition-colors">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-sm font-bold tracking-widest">{SHOP_DETAILS.nameTamil}</span>
          </div>
          
          {/* Main English Brand Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-2xl leading-[1.1]">
            SVS FRESH <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200">
              JUICE POINT
            </span>
          </h1>
          
          {/* Tagline */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/95 tracking-wide drop-shadow-md">
            Fresh <span className="text-green-400 font-medium mx-1.5">•</span> Natural <span className="text-green-400 font-medium mx-1.5">•</span> Refreshing
          </p>
          
          {/* Supporting Description */}
          <p className="text-base sm:text-lg lg:text-xl text-white/80 font-medium leading-relaxed max-w-xl mx-auto sm:mx-0 drop-shadow">
            Fresh Nungu, Ilaneer, Fruit Juices, Milkshakes and refreshing natural beverages made for every moment.
          </p>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 pt-4 sm:pt-8 w-full sm:w-auto">
            
            <Link
              href="/menu"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm sm:text-base font-bold text-white transition-all duration-300 bg-green-600 rounded-full hover:bg-green-500 shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(22,163,74,0.6)] hover:-translate-y-1"
            >
              Order Now
              <ShoppingBag className="w-5 h-5 ml-2.5 group-hover:scale-110 transition-transform" />
            </Link>
            
            <Link
              href="/menu"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-sm sm:text-base font-bold text-white transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 shadow-lg"
            >
              Explore Menu
              <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            
          </div>
          
        </div>
        
      </div>
      
    </section>
  );
};



