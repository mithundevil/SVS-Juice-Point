import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Phone, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Navigation, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Palmtree, 
  Sparkles 
} from 'lucide-react';
import { SHOP_DETAILS } from '@/lib/utils';
import { generateGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contact Us | SVS Fresh Juice Point – நம்ம நுங்கு கடை',
  description:
    'Get in touch with SVS Fresh Juice Point in Thirumalapuram. Call 94424 78101 or 75984 30795, visit us on Loyola College Road, or order directly on WhatsApp.',
};

export default function ContactPage() {
  const whatsappUrl = generateGeneralInquiryWhatsAppUrl();

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-sand min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* 1. Contact Hero */}
        <section className="bg-palm-deep text-cream rounded-3xl p-8 sm:p-14 shadow-card-hover border border-palm-700 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-palm-800/90 text-gold-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-palm-700">
              <Palmtree className="w-4 h-4" />
              <span>{SHOP_DETAILS.nameTamil} • {SHOP_DETAILS.nameEnglish}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              We’d Love to Hear From You
            </h1>

            <p className="text-base sm:text-xl text-sand-200 font-medium leading-relaxed">
              Have questions about today’s fresh Nungu availability, craving a refreshing beverage, or ordering for your family? Reach out to us directly or visit our shop on Loyola College Road.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-extrabold uppercase tracking-wider text-sand-300">
              <span className="flex items-center gap-1.5 bg-palm-800/60 px-3.5 py-1.5 rounded-full border border-palm-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> Instant Response on WhatsApp
              </span>
              <span className="flex items-center gap-1.5 bg-palm-800/60 px-3.5 py-1.5 rounded-full border border-palm-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> Direct Phone Support
              </span>
              <span className="flex items-center gap-1.5 bg-palm-800/60 px-3.5 py-1.5 rounded-full border border-palm-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> Open 7 Days A Week
              </span>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-72 h-72 sm:w-96 sm:h-96 opacity-10 pointer-events-none">
            <Palmtree className="w-full h-full text-white" />
          </div>
        </section>

        {/* 2. Contact Information Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Primary Phone */}
          <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-palm-deep text-gold-400 flex items-center justify-center border border-palm-700 shadow-sm">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gold-500 block">
                  Primary Line
                </span>
                <h3 className="text-xl font-black text-palm-deep mt-1">
                  Call Primary Phone
                </h3>
                <p className="text-xs text-text-muted font-medium mt-1">
                  Call for orders, inquiries, or shop directions.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-2xl font-black text-palm-deep tracking-tight">
                  {SHOP_DETAILS.displayPhones[0]}
                </p>
                <p className="text-xs text-text-muted font-semibold mt-0.5">
                  Alternate: {SHOP_DETAILS.displayPhones[1]}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200 flex flex-col sm:flex-row gap-2.5">
              <a
                href={`tel:${SHOP_DETAILS.phones[0]}`}
                className="w-full bg-palm-deep hover:bg-palm-800 text-cream font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>Call {SHOP_DETAILS.displayPhones[0]}</span>
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp Orders */}
          <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-700 text-white flex items-center justify-center border border-green-800 shadow-sm">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gold-500 block">
                  Direct Messaging
                </span>
                <h3 className="text-xl font-black text-palm-deep mt-1">
                  Order on WhatsApp
                </h3>
                <p className="text-xs text-text-muted font-medium mt-1">
                  Send your order list or ask about daily seasonal specials.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-2xl font-black text-palm-deep tracking-tight">
                  +91 {SHOP_DETAILS.displayPhones[0]}
                </p>
                <p className="text-xs text-green-700 font-bold mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Instant responses during shop hours
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 3: Shop Address */}
          <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-sand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-6 md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-palm-deep text-gold-400 flex items-center justify-center border border-palm-700 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gold-500 block">
                  Visit Our Store
                </span>
                <h3 className="text-xl font-black text-palm-deep mt-1">
                  Shop Location
                </h3>
                <p className="text-xs text-text-muted font-medium mt-1">
                  Serving Thirumalapuram with authentic natural cold drinks.
                </p>
              </div>

              <div className="pt-2 space-y-1">
                <p className="text-lg font-black text-palm-deep leading-snug">
                  {SHOP_DETAILS.location}
                </p>
                <p className="text-xs font-bold text-gold-600 uppercase tracking-wider">
                  {SHOP_DETAILS.nameTamil}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200">
              <a
                href={SHOP_DETAILS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-sand-200 hover:bg-sand-300 text-palm-deep font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-sand-300"
              >
                <Navigation className="w-4 h-4 text-gold-500" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

        </section>

        {/* 3. Business Hours & Visit Guidelines */}
        <section className="bg-cream rounded-3xl p-8 sm:p-12 border border-sand-300 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-gold-500 tracking-widest bg-sand-200 px-3.5 py-1 rounded-full">
                  Operating Hours
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-palm-deep tracking-tight">
                  When You Can Visit Us
                </h2>
              </div>
              <p className="text-sm sm:text-base text-text-muted font-medium leading-relaxed">
                We are open every single day of the week to serve you chilled, fresh beverages. Feel free to drop by for a quick refresher or ring us up for takeout parcel orders.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-sand-100 p-4 rounded-2xl border border-sand-200">
                  <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                    Opening Time
                  </p>
                  <p className="text-lg font-black text-palm-deep mt-0.5">
                    9:00 AM
                  </p>
                </div>
                <div className="bg-sand-100 p-4 rounded-2xl border border-sand-200">
                  <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                    Closing Time
                  </p>
                  <p className="text-lg font-black text-palm-deep mt-0.5">
                    10:00 PM
                  </p>
                </div>
                <div className="bg-sand-100 p-4 rounded-2xl border border-sand-200">
                  <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">
                    Working Days
                  </p>
                  <p className="text-lg font-black text-palm-deep mt-0.5">
                    Monday – Sunday
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-palm-deep text-cream rounded-3xl p-6 sm:p-8 border border-palm-700 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-palm-700 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Service Overview</span>
                </div>
                <span className="bg-gold-500 text-palm-deep font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                  All Days
                </span>
              </div>

              <ul className="space-y-3 text-xs text-sand-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Dine-in at shop counter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Fresh parcels & takeaway packaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>WhatsApp direct order dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Cash & UPI payments accepted</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* 4. Quick Order CTA */}
        <section className="bg-palm-deep text-cream rounded-3xl p-8 sm:p-14 shadow-card-hover border border-palm-700 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-black uppercase text-gold-400 tracking-widest bg-palm-800 px-3.5 py-1 rounded-full border border-palm-700">
              Quick & Easy Ordering
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Order Your Refreshment?
            </h2>
            <p className="text-sm sm:text-base text-sand-200 font-medium leading-relaxed">
              Explore our complete menu of fresh Nungu, fruit juices, cold milkshakes, and handmade ice creams. Order directly with instant WhatsApp dispatch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/menu"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-green-400/30"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${SHOP_DETAILS.phones[0]}`}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-full border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-green-400" />
              <span>Call {SHOP_DETAILS.displayPhones[0]}</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
