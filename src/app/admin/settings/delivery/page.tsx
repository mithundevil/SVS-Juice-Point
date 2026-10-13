'use client';

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Plus, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  MapPin, 
  HelpCircle,
  Edit2
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DeliveryRule } from '@/lib/services/delivery';

export default function AdminDeliverySettingsPage() {
  const [rules, setRules] = useState<DeliveryRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<DeliveryRule | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [minKm, setMinKm] = useState('0');
  const [maxKm, setMaxKm] = useState('3');
  const [feeRs, setFeeRs] = useState('30');
  const [thresholdRs, setThresholdRs] = useState('1000');
  const [isActive, setIsActive] = useState(true);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/delivery-rules');
      const data = await res.json();
      if (data.success) {
        setRules(data.rules || []);
      }
    } catch (e) {
      console.error('Failed to load rules:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const openEditModal = (rule?: DeliveryRule) => {
    setMsg(null);
    if (rule) {
      setEditingRule(rule);
      setMinKm(String(rule.min_distance_km));
      setMaxKm(String(rule.max_distance_km));
      setFeeRs(String(Math.round(rule.delivery_fee_paise / 100)));
      setThresholdRs(rule.free_delivery_threshold_paise ? String(Math.round(rule.free_delivery_threshold_paise / 100)) : '');
      setIsActive(rule.is_active);
    } else {
      setEditingRule(null);
      setMinKm('');
      setMaxKm('');
      setFeeRs('');
      setThresholdRs('1000');
      setIsActive(true);
    }
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const min = parseFloat(minKm);
    const max = parseFloat(maxKm);
    const fee = parseFloat(feeRs);
    const threshold = thresholdRs.trim() ? parseFloat(thresholdRs) : null;

    if (isNaN(min) || isNaN(max) || isNaN(fee)) {
      setMsg({ type: 'error', text: 'Please fill in valid numbers for distance and fee' });
      setSaving(false);
      return;
    }

    if (max <= min) {
      setMsg({ type: 'error', text: 'Max distance must be strictly greater than Min distance' });
      setSaving(false);
      return;
    }

    try {
      const payload = {
        id: editingRule?.id,
        minDistanceKm: min,
        maxDistanceKm: max,
        deliveryFeePaise: Math.round(fee * 100),
        freeDeliveryThresholdPaise: threshold ? Math.round(threshold * 100) : null,
        isActive,
        sortOrder: editingRule?.sort_order || rules.length + 1,
      };

      const res = await fetch('/api/admin/delivery-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Delivery rule saved successfully!' });
        fetchRules();
        setTimeout(() => {
          setEditingRule(null);
          setMsg(null);
        }, 1200);
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to save rule' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-palm-deep">
            Delivery Zone Rules & Settings
          </h1>
          <p className="text-xs text-text-muted font-medium mt-1">
            Configure tiered delivery fees and free delivery order thresholds by distance from the shop.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => openEditModal()}
            className="inline-flex items-center gap-2 bg-palm-deep hover:bg-palm-800 text-cream px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Add Delivery Tier</span>
          </button>
          <button
            onClick={fetchRules}
            disabled={loading}
            className="p-2.5 bg-cream hover:bg-white text-palm-deep rounded-xl border border-sand-300"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-cream rounded-2xl p-5 border border-sand-300 shadow-card space-y-2">
          <span className="text-[10px] font-black uppercase text-gold-500 tracking-wider">
            Tier 1 Default
          </span>
          <p className="text-2xl font-black text-palm-deep">0 to 3 KM</p>
          <p className="text-xs text-text-muted font-medium">
            Delivery Fee: <strong className="text-palm-deep">₹30</strong> • Free over ₹1,000
          </p>
        </div>

        <div className="bg-cream rounded-2xl p-5 border border-sand-300 shadow-card space-y-2">
          <span className="text-[10px] font-black uppercase text-gold-500 tracking-wider">
            Tier 2 Default
          </span>
          <p className="text-2xl font-black text-palm-deep">3 to 5 KM</p>
          <p className="text-xs text-text-muted font-medium">
            Delivery Fee: <strong className="text-palm-deep">₹60</strong> • Free over ₹1,000
          </p>
        </div>

        <div className="bg-cream rounded-2xl p-5 border border-sand-300 shadow-card space-y-2">
          <span className="text-[10px] font-black uppercase text-gold-500 tracking-wider">
            Beyond 5 KM
          </span>
          <p className="text-2xl font-black text-palm-deep">Manual Review</p>
          <p className="text-xs text-text-muted font-medium">
            Requires manual distance confirmation before dispatch.
          </p>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-cream rounded-3xl border border-sand-300 shadow-card overflow-hidden">
        <div className="p-5 border-b border-sand-300 flex items-center justify-between">
          <h3 className="text-sm font-black text-palm-deep uppercase tracking-wider">
            Active Delivery Rules ({rules.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-text-muted animate-pulse">
            Loading delivery rules...
          </div>
        ) : rules.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-text-muted">
            No delivery rules configured.
          </div>
        ) : (
          <div className="divide-y divide-sand-200">
            {rules.map((rule) => {
              const feeRs = Math.round(rule.delivery_fee_paise / 100);
              const thresholdRs = rule.free_delivery_threshold_paise
                ? Math.round(rule.free_delivery_threshold_paise / 100)
                : null;

              return (
                <div
                  key={rule.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-sand-100 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-palm-deep">
                        {rule.min_distance_km} KM – {rule.max_distance_km} KM
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          rule.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="text-xs text-text-muted flex flex-wrap gap-4">
                      <span>Delivery Fee: <strong className="text-palm-deep">{formatPrice(feeRs)}</strong></span>
                      {thresholdRs && (
                        <span>
                          Free Delivery Above: <strong className="text-palm-green">{formatPrice(thresholdRs)}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => openEditModal(rule)}
                    className="inline-flex items-center gap-1.5 bg-sand-200 hover:bg-sand-300 text-palm-deep px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider w-fit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Tier</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {(editingRule !== null || saving || msg !== null) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream rounded-3xl max-w-md w-full border border-sand-300 shadow-floating p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-sand-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-gold-500 tracking-wider">
                  Delivery Zone Configuration
                </span>
                <h3 className="text-xl font-black text-palm-deep mt-0.5">
                  {editingRule ? 'Edit Delivery Tier' : 'Add New Delivery Tier'}
                </h3>
              </div>
              <button
                onClick={() => setEditingRule(null)}
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

            <form onSubmit={handleSaveRule} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                    Min Distance (KM)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={minKm}
                    onChange={(e) => setMinKm(e.target.value)}
                    placeholder="0"
                    className="w-full p-2.5 bg-white border border-sand-300 rounded-xl text-sm font-bold text-palm-deep"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                    Max Distance (KM)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={maxKm}
                    onChange={(e) => setMaxKm(e.target.value)}
                    placeholder="3"
                    className="w-full p-2.5 bg-white border border-sand-300 rounded-xl text-sm font-bold text-palm-deep"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                  Delivery Fee in Rupees (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={feeRs}
                  onChange={(e) => setFeeRs(e.target.value)}
                  placeholder="30"
                  className="w-full p-2.5 bg-white border border-sand-300 rounded-xl text-sm font-bold text-palm-deep"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">
                  Free Delivery Subtotal Threshold (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={thresholdRs}
                  onChange={(e) => setThresholdRs(e.target.value)}
                  placeholder="1000 (leave empty for none)"
                  className="w-full p-2.5 bg-white border border-sand-300 rounded-xl text-sm font-bold text-palm-deep"
                />
                <p className="text-[10px] text-text-muted mt-1">
                  Orders with subtotal at or above this amount receive free delivery within this zone.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-palm-deep"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-bold text-palm-deep">
                  Rule is active and applied at checkout
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
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
                  <span>{saving ? 'Saving...' : 'Save Rule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
