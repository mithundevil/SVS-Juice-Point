import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Palmtree } from 'lucide-react';
import { generateGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export const WhatsAppCTA: React.FC = () => {
  const whatsappUrl = generateGeneralInquiryWhatsAppUrl(
    'Hello SVS Fresh Juice Point! I would like to order fresh juice directly.'
  );

  return (
    <section className="py-20 sm:py-28 bg-palm-deep text-cream relative overflow-hidden border-b border-palm-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <div className="w-14 h-14 bg-palm-800 rounded-full flex items-center justify-center text-gold-400 mx-auto border border-palm-700 shadow-sm">
          <Palmtree className="w-7 h-7" />
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-cream leading-tight">
            Your favourite refreshment is just a message away.
          </h2>
          <p className="text-sm sm:text-base text-sand-200 font-medium leading-relaxed">
            Browse the menu and place your order directly on WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-cream text-palm-deep hover:bg-white active:scale-95 font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl transition-all border border-sand-300 flex items-center justify-center gap-3 group"
          >
            <MessageCircle className="w-5 h-5 text-palm-green group-hover:scale-110 transition-transform" />
            <span>Order on WhatsApp</span>
            <ArrowRight className="w-4 h-4 text-palm-green group-hover:translate-x-1 transition-transform" />
          </a>

          <Link
            href="/menu"
            className="w-full sm:w-auto bg-palm-800 hover:bg-palm-700 active:scale-95 text-cream font-extrabold text-xs uppercase tracking-widest px-7 py-4 rounded-2xl border border-palm-700 transition-all flex items-center justify-center gap-2"
          >
            <span>View Menu</span>
          </Link>
        </div>

        <p className="text-xs text-sand-300 font-medium">
          Instant shop response • Direct WhatsApp ordering • Pickup & delivery
        </p>
      </div>
    </section>
  );
};
