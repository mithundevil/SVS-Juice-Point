'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Tag, 
  Truck, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Menu, 
  X, 
  Home 
} from 'lucide-react';
import { SHOP_DETAILS } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login page, don't wrap with admin navigation bar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const navItems = [
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/products', label: 'Products & Prices', icon: Tag },
    { href: '/admin/settings/delivery', label: 'Delivery Rules', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Admin Header */}
      <header className="bg-palm-deep text-cream border-b border-palm-700 sticky top-0 z-50 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Brand & Owner badge */}
            <div className="flex items-center gap-4">
              <Link href="/admin/orders" className="flex items-center gap-3">
                <div className="relative w-36 sm:w-44 h-10 sm:h-12">
                  <Image
                    src="/images/svs-logo.png"
                    alt={SHOP_DETAILS.nameEnglish}
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </Link>
              <div className="hidden sm:inline-flex items-center gap-1.5 bg-palm-800 text-gold-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-palm-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Owner Dashboard</span>
              </div>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-cream text-palm-deep shadow-sm'
                        : 'text-cream/80 hover:text-cream hover:bg-palm-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-sand-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-palm-800 transition-colors"
              >
                <span>Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 px-3.5 py-2 rounded-xl border border-rose-800/40 transition-colors"
                title="Sign out of owner dashboard"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden p-2 text-cream hover:bg-palm-800 rounded-lg"
              >
                {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-palm-800 border-t border-palm-700 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-cream text-palm-deep'
                      : 'text-cream/80 hover:bg-palm-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-palm-700 flex justify-between items-center px-1">
              <Link
                href="/"
                target="_blank"
                className="text-xs font-bold text-sand-200 flex items-center gap-1.5 py-2"
              >
                <span>Visit Live Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
