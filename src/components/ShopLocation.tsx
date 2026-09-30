import React from 'react';
import { MapPin, Phone, Navigation, Clock, Palmtree, Compass } from 'lucide-react';
import { SHOP_DETAILS } from '@/lib/utils';

export const ShopLocation: React.FC = () => {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-sand border-b border-sand-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream rounded-3xl p-8 sm:p-14 shadow-card border border-sand-300 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-sand-200 px-4 py-1.5 rounded-full text-gold-500 text-[11px] font-black tracking-widest uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>Shop Location</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-5xl font-black text-palm-deep tracking-tight">
                  Visit SVS Fresh Juice Point
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm font-extrabold text-gold-500 uppercase tracking-widest">
                  <span>{SHOP_DETAILS.nameTamil}</span>
                </div>
              </div>

              <div className="bg-sand-100/90 rounded-2xl p-6 border border-sand-200 text-left space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      Address
                    </p>
                    <p className="text-lg font-black text-palm-deep mt-0.5">
                      {SHOP_DETAILS.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-sand-200 text-xs font-bold text-text-muted">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>Phones: {SHOP_DETAILS.displayPhones[0]} / {SHOP_DETAILS.displayPhones[1]}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href={`tel:${SHOP_DETAILS.phones[0]}`}
                  className="w-full sm:w-auto bg-palm-deep hover:bg-palm-800 active:scale-95 text-cream font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-card transition-all flex items-center justify-center gap-2 border border-palm-700"
                >
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span>Call Now</span>
                </a>

                <a
                  href={SHOP_DETAILS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-sand-200 hover:bg-sand-300 active:scale-95 text-palm-deep font-extrabold text-xs uppercase tracking-widest px-7 py-4 rounded-2xl border border-sand-300 transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-gold-500" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Right Minimal Location Card */}
            <div className="lg:col-span-5 bg-palm-deep text-cream rounded-3xl p-8 border border-palm-700 space-y-6 shadow-card">
              <div className="flex items-center justify-between border-b border-palm-700 pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Opening Hours</span>
                </div>
                <span className="bg-gold-500 text-palm-deep font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  Open Today
                </span>
              </div>

              <div className="space-y-4 text-xs font-medium text-sand-200">
                <div className="flex justify-between items-center border-b border-palm-700/60 pb-3">
                  <span className="text-sand-300">Daily Timings</span>
                  <span className="font-extrabold text-gold-400">9:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-palm-700/60 pb-3">
                  <span className="text-sand-300">Days</span>
                  <span className="font-extrabold text-cream">Monday – Sunday (All Days)</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sand-300">Service</span>
                  <span className="font-extrabold text-cream">Takeaway & Local Delivery</span>
                </div>
              </div>

              <div className="pt-2 text-center border-t border-palm-700">
                <span className="text-[11px] text-gold-400 font-bold uppercase tracking-widest">
                  Visit us at Loyola College Road
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
