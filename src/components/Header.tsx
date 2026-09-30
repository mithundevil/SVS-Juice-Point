'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Phone, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SHOP_DETAILS } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, isHydrated } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 sm:top-4 inset-x-0 z-50 mx-auto max-w-7xl px-0 sm:px-6 lg:px-8 transition-all duration-500">
      <div 
        className={`relative flex items-center justify-between h-[64px] sm:h-[72px] px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#0B2C1F]/60 backdrop-blur-xl border-white/15 shadow-floating sm:rounded-full border-b sm:border' 
            : 'bg-[#0B2C1F]/20 backdrop-blur-md border-white/10 sm:rounded-full border-b sm:border'
        }`}
      >
        
        {/* Brand Logo (Left) */}
        <Link href="/" className="flex items-center group focus:outline-none">
          <div className="relative w-[130px] h-[44px] sm:w-[150px] sm:h-[52px] lg:w-[170px] lg:h-[60px] group-hover:scale-[1.03] transition-transform duration-300">
            <Image
              src="/images/svs-logo.png"
              alt={`${SHOP_DETAILS.nameTamil} - ${SHOP_DETAILS.nameEnglish} Logo`}
              fill
              sizes="(max-width: 640px) 130px, (max-width: 1024px) 150px, 170px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links (Center) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-9 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-[13px] lg:text-[14px] font-semibold tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-green-400 rounded-full -translate-x-1/2 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors focus:outline-none flex items-center justify-center"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-[22px] h-[22px] sm:w-[20px] sm:h-[20px]" />
            {isHydrated && totalItems > 0 && (
              <span className="absolute top-1 right-1 translate-x-1/4 -translate-y-1/4 bg-green-500 text-white font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Order Now Button (Desktop) */}
          <Link
            href="/menu"
            className="hidden sm:flex items-center justify-center h-10 px-6 text-[13px] font-bold tracking-wide text-white transition-all bg-green-600 hover:bg-green-500 rounded-full shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] hover:-translate-y-0.5 border border-green-400/30"
          >
            Order Now
          </Link>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 mx-4 p-5 bg-[#0B2C1F]/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-floating animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3.5 text-[15px] font-bold tracking-wide rounded-xl transition-colors ${
                    isActive ? 'bg-white/15 text-white shadow-inner' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="pt-5 mt-3 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-[15px] tracking-wide shadow-md hover:bg-green-500 transition-colors"
            >
              Order Now
            </Link>
            <a
              href={`tel:${SHOP_DETAILS.phones[0]}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/10 text-white font-bold text-[15px] tracking-wide border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Phone className="w-4 h-4 text-green-400" />
              <span>Call ({SHOP_DETAILS.displayPhones[0]})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

