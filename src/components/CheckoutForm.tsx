'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, Building, FileText, MessageCircle, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { CheckoutFormData } from '@/types';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppUrl } from '@/lib/whatsapp';
import { formatPrice, SHOP_DETAILS } from '@/lib/utils';

export const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    mobile: '',
    orderType: 'delivery',
    address: '',
    landmark: '',
    notes: '',
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    const cleanPhone = formData.mobile.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.mobile = 'Mobile number is required';
    } else if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.orderType === 'delivery') {
      if (!formData.address.trim()) {
        newErrors.address = 'Delivery address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.mobile,
          orderType: formData.orderType,
          deliveryAddress: formData.address,
          landmark: formData.landmark,
          customerNotes: formData.notes,
          paymentMethod: formData.paymentMethod,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            withIceCream: item.withIceCream,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError(data.error || 'Failed to submit order. Please check item availability.');
        setSubmitting(false);
        return;
      }

      const { order, whatsappUrl } = data;

      try {
        const orderSummaryPayload = {
          order,
          cart,
          customer: formData,
          subtotal: Math.round(order.subtotal_paise / 100),
          deliveryFee: Math.round(order.delivery_fee_paise / 100),
          total: Math.round(order.total_paise / 100),
          whatsappUrl,
          timestamp: new Date().toISOString(),
        };
        sessionStorage.setItem('last_svs_order', JSON.stringify(orderSummaryPayload));
      } catch (err) {
        console.error('SessionStorage error:', err);
      }

      // Try opening WhatsApp in new window
      try {
        window.open(whatsappUrl, '_blank');
      } catch (e) {
        console.warn('Popup blocked, customer can click button on success page', e);
      }

      clearCart();
      router.push('/order-success');
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'An error occurred while connecting to the shop server.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cream rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-card space-y-8">
      {submitError && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold rounded-2xl p-4 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-black">Order Could Not Be Placed</p>
            <p className="mt-0.5 font-medium">{submitError}</p>
          </div>
        </div>
      )}
      <div className="border-b border-sand-300 pb-4">
        <h2 className="text-2xl font-black text-palm-deep">Complete Your Order</h2>
        <p className="text-xs text-text-muted font-medium mt-1">
          No account signup required. Fill details to generate your WhatsApp order.
        </p>
      </div>

      {/* 1. Order Type */}
      <div className="space-y-3">
        <label className="block text-xs font-extrabold uppercase tracking-widest text-palm-deep">
          1. Order Type <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, orderType: 'delivery' })}
            className={`p-4 rounded-2xl border text-left font-extrabold text-xs uppercase tracking-wider transition-all flex flex-col gap-1 ${
              formData.orderType === 'delivery'
                ? 'bg-palm-deep text-cream border-palm-deep shadow-md'
                : 'bg-sand-100 text-palm-deep border-sand-300 hover:bg-sand-200'
            }`}
          >
            <span className="text-lg">🛵</span>
            <span>Home Delivery</span>
            <span className="text-[10px] opacity-80 font-normal lowercase">Local Thirumalapuram Delivery</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, orderType: 'pickup' })}
            className={`p-4 rounded-2xl border text-left font-extrabold text-xs uppercase tracking-wider transition-all flex flex-col gap-1 ${
              formData.orderType === 'pickup'
                ? 'bg-palm-deep text-cream border-palm-deep shadow-md'
                : 'bg-sand-100 text-palm-deep border-sand-300 hover:bg-sand-200'
            }`}
          >
            <span className="text-lg">🏪</span>
            <span>Takeaway Pickup</span>
            <span className="text-[10px] opacity-80 font-normal lowercase">Collect directly at shop</span>
          </button>
        </div>
      </div>

      {/* 2. Customer Details */}
      <div className="space-y-4 pt-4 border-t border-sand-300">
        <label className="block text-xs font-extrabold uppercase tracking-widest text-palm-deep">
          2. Your Details
        </label>

        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-palm-deep flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gold-500" />
            <span>Full Name <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-palm-green transition-all ${
              errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-sand-100/50'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-palm-deep flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gold-500" />
            <span>Mobile Number <span className="text-rose-500">*</span></span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs font-extrabold text-palm-deep">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="9876543210"
              className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-palm-green transition-all ${
                errors.mobile ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-sand-100/50'
              }`}
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.mobile}
            </p>
          )}
        </div>
      </div>

      {/* 3. Delivery Details */}
      {formData.orderType === 'delivery' ? (
        <div className="space-y-4 pt-4 border-t border-sand-300">
          <label className="block text-xs font-extrabold uppercase tracking-widest text-palm-deep">
            3. Delivery Details
          </label>

          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-palm-deep flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              <span>Delivery Address <span className="text-rose-500">*</span></span>
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Door No, Street Name, Area..."
              className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-palm-green transition-all ${
                errors.address ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-sand-100/50'
              }`}
            />
            {errors.address && (
              <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.address}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-palm-deep flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-gold-500" />
              <span>Landmark (Optional)</span>
            </label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              placeholder="Near college / temple..."
              className="w-full px-4 py-3 rounded-2xl border border-sand-300 bg-sand-100/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-palm-green"
            />
          </div>
        </div>
      ) : (
        <div className="bg-sand-100 p-4 rounded-2xl border border-sand-300 text-xs text-palm-deep space-y-1">
          <p className="font-extrabold flex items-center gap-1">
            <MapPin className="w-4 h-4 text-gold-500" /> Pickup Address:
          </p>
          <p className="font-medium text-text-muted">{SHOP_DETAILS.location}</p>
        </div>
      )}

      {/* 4. Special Instructions & Payment */}
      <div className="space-y-4 pt-4 border-t border-sand-300">
        <label className="block text-xs font-extrabold uppercase tracking-widest text-palm-deep">
          4. Instructions & Payment
        </label>

        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold text-palm-deep flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gold-500" />
            <span>Special Instructions (Optional)</span>
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Less sugar, extra ice..."
            className="w-full px-4 py-3 rounded-2xl border border-sand-300 bg-sand-100/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-palm-green"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-palm-deep">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
              className={`p-3 rounded-2xl border text-xs font-extrabold uppercase tracking-wider text-center transition-all ${
                formData.paymentMethod === 'cod'
                  ? 'bg-palm-deep text-cream border-palm-deep shadow-sm'
                  : 'bg-sand-100 text-palm-deep border-sand-300 hover:bg-sand-200'
              }`}
            >
              {formData.orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Shop'}
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
              className={`p-3 rounded-2xl border text-xs font-extrabold uppercase tracking-wider text-center transition-all ${
                formData.paymentMethod === 'upi'
                  ? 'bg-palm-deep text-cream border-palm-deep shadow-sm'
                  : 'bg-sand-100 text-palm-deep border-sand-300 hover:bg-sand-200'
              }`}
            >
              UPI / Online Pay
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-palm-deep hover:bg-palm-800 disabled:opacity-50 active:scale-95 text-cream font-extrabold text-sm uppercase tracking-wider py-4 px-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all flex items-center justify-center gap-3 border border-palm-700"
      >
        <MessageCircle className="w-5 h-5 text-gold-400" />
        <span>{submitting ? 'Placing Order...' : 'Order on WhatsApp'}</span>
      </button>

      <p className="text-center text-xs text-text-muted font-medium">
        Your order is saved directly in our shop database and formatted for WhatsApp dispatch.
      </p>
    </form>
  );
};
