'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Tag, 
  Plus, 
  Check, 
  Edit3, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Palmtree, 
  Scale, 
  Coffee 
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DbProductWithPrice } from '@/lib/services/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProductWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Price Edit Modal
  const [editingPriceProduct, setEditingPriceProduct] = useState<DbProductWithPrice | null>(null);
  const [newPriceRs, setNewPriceRs] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStock = async (product: DbProductWithPrice) => {
    const nextState = !product.is_available;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_availability',
          productId: product.id,
          isAvailable: nextState,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(
          products.map((p) => (p.id === product.id ? { ...p, is_available: nextState } : p))
        );
      } else {
        alert(data.error || 'Failed to update stock');
      }
    } catch (e: any) {
      alert(e.message || 'Error updating stock');
    }
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceProduct) return;
    setSaving(true);
    setMsg(null);

    const priceNum = parseFloat(newPriceRs);
    if (isNaN(priceNum) || priceNum <= 0) {
      setMsg({ type: 'error', text: 'Please enter a valid price in rupees' });
      setSaving(false);
      return;
    }

    const pricePaise = Math.round(priceNum * 100);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_price',
          productId: editingPriceProduct.id,
          pricePaise,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: `Price updated to ₹${priceNum} successfully!` });
        // Update local list
        setProducts(
          products.map((p) =>
            p.id === editingPriceProduct.id
              ? {
                  ...p,
                  current_price_paise: pricePaise,
                  price_effective_from: new Date().toISOString(),
                }
              : p
          )
        );
        setTimeout(() => {
          setEditingPriceProduct(null);
          setMsg(null);
        }, 1200);
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update price' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'nungu-ilaneer', label: 'Nungu & Ilaneer' },
    { id: 'fresh-juices', label: 'Fresh Juices' },
    { id: 'fresh-ice-creams', label: 'Fruit Ice Creams' },
    { id: 'milk-shake', label: 'Milkshakes' },
    { id: 'sharja', label: 'Sharja' },
    { id: 'sarbath', label: 'Sarbath' },
    { id: 'omlete', label: 'Omlete' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category_id !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.tamil_name && p.tamil_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-palm-deep">
            Daily Fruit & Product Pricing
          </h1>
          <p className="text-xs text-text-muted font-medium mt-1">
            Update seasonal fruit prices, mark items sold out, and manage menu catalog in real-time.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-cream hover:bg-white text-palm-deep px-4 py-2.5 rounded-xl border border-sand-300 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === c.id
                  ? 'bg-palm-deep text-cream shadow-sm'
                  : 'bg-cream text-text-muted hover:bg-sand-200 border border-sand-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by English or Tamil name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-palm-deep outline-none"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 text-center font-bold text-xs uppercase tracking-widest text-text-muted animate-pulse">
          Loading menu items...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-cream rounded-3xl p-12 text-center border border-sand-300">
          <p className="text-sm font-bold text-text-muted">No products found matching filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const priceRs = Math.round((product.current_price_paise || 0) / 100);

            return (
              <div
                key={product.id}
                className={`bg-cream rounded-3xl overflow-hidden border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between ${
                  product.is_available ? 'border-sand-300' : 'border-rose-300 opacity-70 bg-rose-50/20'
                }`}
              >
                {/* Image & Badges */}
                <div className="relative aspect-square w-full bg-sand-200 overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.pricing_type === 'weight' ? (
                      <span className="bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Scale className="w-3 h-3" /> Per Kg
                      </span>
                    ) : (
                      <span className="bg-palm-deep text-cream font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Coffee className="w-3 h-3" /> Per Serving
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleStock(product)}
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border transition-colors ${
                        product.is_available
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-rose-500 text-white border-rose-600'
                      }`}
                    >
                      {product.is_available ? 'In Stock' : 'Sold Out'}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold-500">
                      {product.category_id}
                    </span>
                    <h3 className="text-base font-black text-palm-deep leading-tight mt-0.5">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-text-muted font-medium line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Edit Button */}
                  <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        Price {product.pricing_type === 'weight' ? '(per kg)' : ''}
                      </span>
                      <span className="text-xl font-black text-palm-deep">
                        {formatPrice(priceRs)}
                      </span>
                      {product.price_effective_from && (
                        <span className="text-[9px] text-text-muted block mt-0.5">
                          Updated: {new Date(product.price_effective_from).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setEditingPriceProduct(product);
                        setNewPriceRs(String(priceRs));
                        setMsg(null);
                      }}
                      className="bg-palm-deep hover:bg-palm-800 text-cream p-2.5 rounded-xl shadow-sm transition-transform active:scale-95"
                      title="Update daily price"
                    >
                      <Edit3 className="w-4 h-4 text-gold-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Price Modal */}
      {editingPriceProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream rounded-3xl max-w-md w-full border border-sand-300 shadow-floating p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-sand-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-gold-500 tracking-wider">
                  Update Menu Price
                </span>
                <h3 className="text-xl font-black text-palm-deep mt-0.5">
                  {editingPriceProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingPriceProduct(null)}
                className="text-text-muted hover:text-palm-deep p-1"
              >
                ✕
              </button>
            </div>

            {msg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  msg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-palm-deep mb-1">
                  New Price in Rupees (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-palm-deep font-black text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={newPriceRs}
                    onChange={(e) => setNewPriceRs(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-sand-300 rounded-xl text-lg font-black text-palm-deep focus:ring-2 focus:ring-palm-deep outline-none"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-text-muted mt-1 font-medium">
                  {editingPriceProduct.pricing_type === 'weight'
                    ? 'This will set the current price per kilogram.'
                    : 'This will update the serving price and append to the historical price records.'}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPriceProduct(null)}
                  className="w-1/2 bg-sand-200 hover:bg-sand-300 text-palm-deep py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 bg-palm-deep hover:bg-palm-800 disabled:opacity-50 text-cream py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-card flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-gold-400" />
                  <span>{saving ? 'Saving...' : 'Update Price'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
