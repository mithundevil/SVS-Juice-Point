'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Palmtree, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { SHOP_DETAILS } from '@/lib/utils';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials or unauthorized role.');
        setLoading(false);
        return;
      }

      router.push('/admin/orders');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-block">
          <div className="relative w-48 h-16 mx-auto">
            <Image
              src="/images/svs-logo.png"
              alt={SHOP_DETAILS.nameEnglish}
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="inline-flex items-center gap-2 bg-palm-deep text-cream text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span>Owner Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-palm-deep">
          Shop Owner Sign In
        </h2>
        <p className="text-xs text-text-muted font-medium">
          Access the private dashboard to manage daily fruit prices, orders, and delivery zones.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-cream py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-sand-300 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl p-4 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-palm-deep mb-1.5">
                Owner Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@svsjuice.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-sand-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-palm-deep focus:border-palm-deep outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-palm-deep mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-sand-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-palm-deep focus:border-palm-deep outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-palm-deep hover:bg-palm-800 disabled:opacity-50 text-cream font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl shadow-card transition-all flex items-center justify-center gap-2 border border-palm-700 active:scale-95"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </form>

          <div className="pt-4 border-t border-sand-200 text-center space-y-2">
            <Link
              href="/"
              className="text-xs font-extrabold text-text-muted hover:text-palm-deep transition-colors"
            >
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
