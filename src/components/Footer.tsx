import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, MessageCircle, Palmtree } from 'lucide-react';
import { SHOP_DETAILS } from '@/lib/utils';
import { generateGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = generateGeneralInquiryWhatsAppUrl();

  return (
    <footer className="bg-palm-deep text-cream pt-20 pb-24 md:pb-14 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-5">
            <div className="relative w-48 sm:w-56 h-16 sm:h-20">
              <Image
                src="/images/svs-logo.png"
                alt={`${SHOP_DETAILS.nameTamil} - ${SHOP_DETAILS.nameEnglish} Logo`}
                fill
                sizes="(max-width: 640px) 192px, 224px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs text-cream-200 font-medium leading-relaxed max-w-sm">
              Fresh juices, nungu, ilaneer, milkshakes and refreshing favourites made fresh for you inspired by the palmyra palm.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-cream uppercase tracking-widest border-b border-palm-700 pb-2">
              Navigation
            </h4>
            <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-palm-light">
              <li>
                <Link href="/" className="hover:text-gold-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-gold-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-gold-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Order */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-cream uppercase tracking-widest border-b border-palm-700 pb-2">
              Contact & Order
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="text-cream-100">{SHOP_DETAILS.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <div className="flex flex-wrap gap-2 text-cream-100">
                  <a href={`tel:${SHOP_DETAILS.phones[0]}`} className="hover:text-gold-400 font-bold">
                    {SHOP_DETAILS.displayPhones[0]}
                  </a>
                  <span>/</span>
                  <a href={`tel:${SHOP_DETAILS.phones[1]}`} className="hover:text-gold-400 font-bold">
                    {SHOP_DETAILS.displayPhones[1]}
                  </a>
                </div>
              </li>
              <li className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cream hover:bg-white text-palm-deep font-extrabold text-[11px] uppercase tracking-wider px-5 py-3 rounded-2xl shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-palm-green" />
                  <span>Order on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-palm-800 pt-8 text-center text-xs text-palm-light flex flex-col sm:flex-row justify-between items-center gap-3 font-medium">
          <p>© {currentYear} SVS Fresh Juice Point ({SHOP_DETAILS.nameTamil}). All rights reserved.</p>
          <p className="text-palm-light">
            Freshness, Straight From Nature.
          </p>
        </div>
      </div>
    </footer>
  );
};
