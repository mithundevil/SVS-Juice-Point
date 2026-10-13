'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  X, 
  MessageCircle, 
  RefreshCw, 
  Bike, 
  Store, 
  Calendar,
  Check,
  Ban
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { OrderRecord, OrderStatus, PERMITTED_STATUS_TRANSITIONS } from '@/lib/services/orders';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Distance / fee edit state
  const [editDistanceKm, setEditDistanceKm] = useState<string>('');
  const [editFeeRs, setEditFeeRs] = useState<string>('');
  const [updateMsg, setUpdateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    setActionLoading(true);
    setUpdateMsg(null);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', orderId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUpdateMsg({ type: 'success', text: `Status updated to ${nextStatus}` });
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: nextStatus });
        }
      } else {
        setUpdateMsg({ type: 'error', text: data.error || 'Failed to update status' });
      }
    } catch (e: any) {
      setUpdateMsg({ type: 'error', text: e.message || 'Error updating status' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateDistanceFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setActionLoading(true);
    setUpdateMsg(null);

    const distance = parseFloat(editDistanceKm);
    const feeRs = parseFloat(editFeeRs);

    if (isNaN(distance) || isNaN(feeRs)) {
      setUpdateMsg({ type: 'error', text: 'Please enter valid numbers for distance and fee' });
      setActionLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_distance_fee',
          orderId: selectedOrder.id,
          distanceKm: distance,
          deliveryFeePaise: Math.round(feeRs * 100),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUpdateMsg({ type: 'success', text: 'Distance & delivery fee confirmed!' });
        fetchOrders();
        // Update local modal view
        setSelectedOrder({
          ...selectedOrder,
          delivery_distance_km: distance,
          delivery_fee_paise: Math.round(feeRs * 100),
          total_paise: selectedOrder.subtotal_paise + Math.round(feeRs * 100),
          pricing_status: 'confirmed',
          distance_source: 'manual_confirmation',
        });
      } else {
        setUpdateMsg({ type: 'error', text: data.error || 'Failed to update' });
      }
    } catch (err: any) {
      setUpdateMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_confirmation':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Pending Confirmation
          </span>
        );
      case 'confirmed':
        return (
          <span className="bg-blue-100 text-blue-900 border border-blue-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Confirmed
          </span>
        );
      case 'preparing':
        return (
          <span className="bg-purple-100 text-purple-900 border border-purple-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Preparing
          </span>
        );
      case 'ready':
        return (
          <span className="bg-teal-100 text-teal-900 border border-teal-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Ready
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Out For Delivery
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-rose-100 text-rose-900 border border-rose-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
            Cancelled
          </span>
        );
    }
  };

  const statusFilters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending_confirmation', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-palm-deep">
            Order Management
          </h1>
          <p className="text-xs text-text-muted font-medium mt-1">
            Review incoming orders, verify delivery fees, and update kitchen progress.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-cream hover:bg-white text-palm-deep px-4 py-2.5 rounded-xl border border-sand-300 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {statusFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedStatus === tab.id
                  ? 'bg-palm-deep text-cream shadow-sm'
                  : 'bg-cream text-text-muted hover:bg-sand-200 border border-sand-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order #, Customer Name, or Phone..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-palm-deep outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-palm-deep hover:bg-palm-800 text-cream px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <div className="py-20 text-center font-bold text-xs uppercase tracking-widest text-text-muted animate-pulse">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-cream rounded-3xl p-12 text-center border border-sand-300 space-y-3">
          <Clock className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="text-base font-black text-palm-deep">No Orders Found</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            {selectedStatus !== 'all' || searchQuery
              ? 'No orders match your filter criteria.'
              : 'New customer orders placed through the website will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => {
            const subtotalRs = Math.round(order.subtotal_paise / 100);
            const deliveryRs = Math.round(order.delivery_fee_paise / 100);
            const totalRs = Math.round(order.total_paise / 100);

            return (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setEditDistanceKm(order.delivery_distance_km ? String(order.delivery_distance_km) : '');
                  setEditFeeRs(order.delivery_fee_paise ? String(deliveryRs) : '30');
                  setUpdateMsg(null);
                }}
                className="bg-cream rounded-2xl p-5 border border-sand-300 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-black text-palm-deep">
                      {order.order_number}
                    </span>
                    {getStatusBadge(order.status)}
                    {order.order_type === 'delivery' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        <Bike className="w-3 h-3" /> Delivery
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Store className="w-3 h-3" /> Pickup
                      </span>
                    )}
                    {order.pricing_status === 'estimated' && (
                      <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        Estimated Pricing
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-text-muted flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-bold text-palm-deep">{order.customer_name}</span>
                    <span>📞 {order.customer_phone}</span>
                    {order.order_type === 'delivery' && order.delivery_address && (
                      <span className="line-clamp-1 max-w-xs">📍 {order.delivery_address}</span>
                    )}
                    <span className="text-[11px] text-text-muted/80">
                      {new Date(order.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="text-xs text-text-muted font-medium line-clamp-1">
                      {order.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                    </div>
                  )}
                </div>

                {/* Right: Price & Arrow */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-sand-200">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-text-muted block">
                      Total
                    </span>
                    <span className="text-lg font-black text-palm-deep">
                      {formatPrice(totalRs)}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-sand-200 flex items-center justify-center text-palm-deep">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream rounded-3xl max-w-2xl w-full border border-sand-300 shadow-floating overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-palm-deep text-cream p-6 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-black uppercase text-gold-400 tracking-widest">
                  Order Details
                </span>
                <h2 className="text-2xl font-black mt-0.5 flex items-center gap-3">
                  <span>{selectedOrder.order_number}</span>
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedOrder.status)}
                  <span className="text-xs text-sand-200">
                    {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-palm-800 text-cream/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {updateMsg && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    updateMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{updateMsg.text}</span>
                </div>
              )}

              {/* Customer Contact Card */}
              <div className="bg-sand-100 rounded-2xl p-4 border border-sand-200 space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-palm-deep">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Name</span>
                    <span className="font-black text-palm-deep text-sm">{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-bold">Phone</span>
                    <a
                      href={`tel:${selectedOrder.customer_phone}`}
                      className="font-black text-palm-green underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {selectedOrder.customer_phone}
                    </a>
                  </div>
                  {selectedOrder.order_type === 'delivery' && (
                    <div className="sm:col-span-2">
                      <span className="text-text-muted block text-[10px] uppercase font-bold">Delivery Address</span>
                      <span className="font-bold text-palm-deep">{selectedOrder.delivery_address}</span>
                      {selectedOrder.landmark && (
                        <span className="text-text-muted block mt-0.5">Landmark: {selectedOrder.landmark}</span>
                      )}
                    </div>
                  )}
                  {selectedOrder.customer_notes && (
                    <div className="sm:col-span-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                      <span className="font-bold block text-[10px] uppercase">Customer Notes:</span>
                      <span>{selectedOrder.customer_notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-palm-deep">
                  Items Snapshot
                </h4>
                <div className="border border-sand-300 rounded-2xl overflow-hidden divide-y divide-sand-200 text-xs">
                  {(selectedOrder.items || []).map((item, idx) => {
                    const unitPriceRs = Math.round(item.unit_price_paise / 100);
                    const lineTotalRs = Math.round(item.line_total_paise / 100);
                    return (
                      <div key={idx} className="p-3 flex justify-between items-center bg-white">
                        <div>
                          <p className="font-black text-palm-deep">
                            {item.quantity}x {item.product_name}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            Unit: {formatPrice(unitPriceRs)} {item.unit !== 'serving' ? `per ${item.unit}` : ''}
                            {item.with_ice_cream && ' • +Ice Cream (+₹20)'}
                          </p>
                        </div>
                        <span className="font-black text-palm-deep">
                          {formatPrice(lineTotalRs)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-sand-100 rounded-2xl p-4 border border-sand-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-bold text-palm-deep">
                    {formatPrice(Math.round(selectedOrder.subtotal_paise / 100))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted flex items-center gap-1">
                    Delivery Fee
                    {selectedOrder.pricing_status === 'estimated' && (
                      <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                        Unconfirmed
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-palm-deep">
                    {formatPrice(Math.round(selectedOrder.delivery_fee_paise / 100))}
                  </span>
                </div>
                <div className="border-t border-sand-300 pt-2 flex justify-between text-sm font-black">
                  <span>Grand Total</span>
                  <span className="text-palm-deep">
                    {formatPrice(Math.round(selectedOrder.total_paise / 100))}
                  </span>
                </div>
              </div>

              {/* Distance Confirmation (for Delivery orders) */}
              {selectedOrder.order_type === 'delivery' && (
                <form
                  onSubmit={handleUpdateDistanceFee}
                  className="bg-cream-200 p-4 rounded-2xl border border-sand-300 space-y-3 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black uppercase tracking-wider text-palm-deep text-[11px]">
                      Manual Distance & Delivery Confirmation
                    </span>
                    <span className="text-[10px] font-bold text-text-muted">
                      Source: {selectedOrder.distance_source}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted mb-1">
                        Distance (KM)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={editDistanceKm}
                        onChange={(e) => setEditDistanceKm(e.target.value)}
                        placeholder="e.g. 2.5"
                        className="w-full p-2 bg-white border border-sand-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-muted mb-1">
                        Delivery Fee (₹)
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={editFeeRs}
                        onChange={(e) => setEditFeeRs(e.target.value)}
                        placeholder="e.g. 30"
                        className="w-full p-2 bg-white border border-sand-300 rounded-lg font-bold"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full bg-palm-deep text-cream py-2 rounded-lg font-bold uppercase tracking-wider text-[11px]"
                  >
                    Confirm Delivery Fee
                  </button>
                </form>
              )}

              {/* Status Update Actions */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-palm-deep block">
                  Update Order Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status === 'pending_confirmation' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      ✓ Confirm Order
                    </button>
                  )}
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'preparing')}
                      disabled={actionLoading}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Start Preparing
                    </button>
                  )}
                  {selectedOrder.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'ready')}
                      disabled={actionLoading}
                      className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Mark Ready
                    </button>
                  )}
                  {selectedOrder.status === 'ready' && (
                    <>
                      {selectedOrder.order_type === 'delivery' && (
                        <button
                          onClick={() => handleStatusChange(selectedOrder.id, 'out_for_delivery')}
                          disabled={actionLoading}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                        >
                          Dispatch Out For Delivery
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                        disabled={actionLoading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                      disabled={actionLoading}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      ✓ Delivered & Completed
                    </button>
                  )}

                  {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this order?')) {
                          handleStatusChange(selectedOrder.id, 'cancelled');
                        }
                      }}
                      disabled={actionLoading}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-4 py-2 rounded-xl text-xs font-bold border border-rose-300"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* WhatsApp Customer Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/91${selectedOrder.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedOrder.customer_name}, regards from SVS Fresh Juice Point regarding your order #${selectedOrder.order_number}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message Customer on WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
