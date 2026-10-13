import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Palmtree, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Droplets, 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2, 
  Award, 
  MapPin 
} from 'lucide-react';
import { SHOP_DETAILS } from '@/lib/utils';
import { generateGeneralInquiryWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'About Us | SVS Fresh Juice Point – நம்ம நுங்கு கடை',
  description:
    'Learn about SVS Fresh Juice Point (நம்ம நுங்கு கடை), our story, fresh natural ingredients, signature Nungu & Ilaneer drinks, and commitment to pure refreshments in Thirumalapuram.',
};

export default function AboutPage() {
  const whatsappUrl = generateGeneralInquiryWhatsAppUrl();

  const specialties = [
    {
      title: 'Nungu & Ilaneer Juices',
      tamil: 'நுங்கு & இளநீர்',
      desc: 'Translucent tender ice apples (Nungu) and sweet tender coconut water fresh from nature. Sourced daily for the ultimate authentic natural cooling effect.',
      image: '/images/nungu.jpg',
      badge: 'Signature',
    },
    {
      title: 'Handcrafted Fruit Ice Sticks',
      tamil: 'பழக் குச்சி ஐஸ்',
      desc: 'Authentic handmade natural fruit ice bars crafted with real palm fruit, palm jaggery (karupatti), jackfruit, and tender coconut pulp.',
      image: '/images/nunku-ice.jpg',
      badge: 'Handmade',
    },
    {
      title: 'Pure Fresh Juices',
      tamil: 'பிரெஷ் ஜூஸ்',
      desc: 'Vibrant, refreshing juices extracted pure from selected pomegranates, sweet oranges, apples, watermelon, and nutrient-dense ABC blends.',
      image: '/images/pomegranate-juice.jpg',
      badge: '100% Fresh',
    },
    {
      title: 'Creamy Milkshakes',
      tamil: 'மில்க் ஷேக்',
      desc: 'Thick and indulgent milkshakes crafted with chilled rich milk, real chocolate, mango, butterscotch, pista, and crunchy oreo toppings.',
      image: '/images/chocolate-shake.jpg',
      badge: 'Thick & Rich',
    },
    {
      title: 'Signature Sharja',
      tamil: 'ஷாஜா ஸ்பெஷல்',
      desc: 'Our iconic thick banana and cold milk blend, layered with rich nuts, premium flavors, and optional vanilla ice cream scoops.',
      image: '/images/sharja-classic.jpg',
      badge: 'Popular',
    },
    {
      title: 'Traditional Sarbath & Soda',
      tamil: 'சர்பத் & சோடா',
      desc: 'Refreshing cooling herbal Nannari sarbath, zesty fresh lemon soda, and sparkling citrus fizz designed to quench your thirst on warm days.',
      image: '/images/sarbath.jpg',
      badge: 'Traditional',
    },
  ];

  const promisePillars = [
    {
      icon: Droplets,
      title: 'Freshness in Every Drop',
      desc: 'We never compromise on freshness. Every fruit is selected daily, ice apples are sliced tender, and coconuts are cut open fresh.',
    },
    {
      icon: ShieldCheck,
      title: 'Clean & Hygienic Preparation',
      desc: 'Cleanliness is our top priority. Our preparation area, blenders, utensils, and serving counters are maintained with strict hygiene standards.',
    },
    {
      icon: Sparkles,
      title: 'Natural Wholesome Taste',
      desc: 'We celebrate real ingredients. Rich fruit purees, wholesome chilled milk, and herbal syrups provide genuine, unadulterated flavor.',
    },
    {
      icon: Heart,
      title: 'Customer Satisfaction',
      desc: 'Serving each customer with genuine warmth and prompt service, whether you visit our shop counter or order straight to your doorstep via WhatsApp.',
    },
  ];

  const galleryImages = [
    { src: '/images/nungu.jpg', alt: 'Fresh Ice Apple (Nungu)' },
    { src: '/images/ilaneer.jpg', alt: 'Fresh Tender Coconut (Ilaneer)' },
    { src: '/images/pomegranate-juice.jpg', alt: 'Pure Pomegranate Juice' },
    { src: '/images/nunku-ice.jpg', alt: 'Handmade Nunku Ice Cream' },
    { src: '/images/sharja-classic.jpg', alt: 'Signature Classic Sharja' },
    { src: '/images/bread-omelette.jpg', alt: 'Fresh Hot Bread Omelette' },
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-sand min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* 1. Hero Section */}
        <section className="bg-palm-deep text-cream rounded-3xl p-8 sm:p-14 lg:p-16 shadow-card-hover border border-palm-700 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-palm-800/90 text-gold-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-palm-700">
              <Palmtree className="w-4 h-4" />
              <span>{SHOP_DETAILS.nameTamil} • {SHOP_DETAILS.nameEnglish}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Freshness in Every Sip
            </h1>

            <p className="text-base sm:text-xl text-sand-200 font-medium leading-relaxed">
              Welcome to <span className="text-white font-bold">SVS FRESH JUICE POINT</span>, Thirumalapuram’s destination for authentic tender ice apples (Nungu), fresh tender coconut water, pure cold-pressed fruit juices, and creamy handcrafted shakes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-extrabold uppercase tracking-wider text-sand-300">
              <span className="flex items-center gap-1.5 bg-palm-800/60 px-3.5 py-1.5 rounded-full border border-palm-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> 100% Fresh Fruits
              </span>
              <span className="flex items-center gap-1.5 bg-palm-800/60 px-3.5 py-1.5 rounded-full border border-palm-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> Daily Palm & Coconut
              </span>
              <span className="flex items-center gap-1.5 bg-palm-800/60 px-3.5 py-1.5 rounded-full border border-palm-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> Loyola College Road
              </span>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-72 h-72 sm:w-96 sm:h-96 opacity-10 pointer-events-none">
            <Palmtree className="w-full h-full text-white" />
          </div>
        </section>

        {/* 2. Our Story Section */}
        <section className="bg-cream rounded-3xl p-8 sm:p-14 shadow-card border border-sand-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-gold-500 tracking-widest bg-sand-200 px-3.5 py-1 rounded-full">
                  Our Story
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-palm-deep tracking-tight">
                  Born From A Love For Authentic Tropical Cooling
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed font-medium">
                <p>
                  Located on <strong className="text-palm-deep">Loyola College Road in Thirumalapuram</strong>, SVS FRESH JUICE POINT was started with a simple, genuine mission: to serve real, wholesome refreshments that bring true revitalization to our community.
                </p>
                <p>
                  Affectionately celebrated by our customers as <strong className="text-palm-deep">நம்ம நுங்கு கடை (Namma Nungu Kadai)</strong>, our pride lies in the timeless palmyra palm tree. The tender, translucent ice apple (Nungu) and sweet tender coconut water (Ilaneer) are Tamil Nadu’s quintessential natural thirst quenchers, bursting with natural electrolytes and minerals.
                </p>
                <p>
                  Over time, our menu has grown to feature over 50 freshly made favorites—ranging from traditional herbal Nannari sarbaths and zesty citrus sodas to velvety fruit ice cream sticks and signature thick Sharja shakes. Every glass is served with pride, hygiene, and authentic flavor.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4 border-t border-sand-200">
                <div className="flex items-center gap-2 text-palm-deep font-extrabold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span>{SHOP_DETAILS.location}</span>
                </div>
              </div>
            </div>

            {/* Story Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-card-hover border-4 border-white">
                <Image
                  src="/images/nungu.jpg"
                  alt="Fresh Nungu (Ice Apple) at SVS Fresh Juice Point"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 -left-5 sm:bottom-4 sm:-left-6 bg-palm-deep text-cream p-4 sm:p-5 rounded-2xl shadow-floating border border-palm-700 max-w-[240px]">
                <p className="text-gold-400 font-black text-xs uppercase tracking-widest">
                  Daily Fresh
                </p>
                <p className="text-xs font-bold text-sand-100 mt-1">
                  Pure Palmyra Palm & Coconut sourced every single morning.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 3. Our Specialties */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase text-gold-500 tracking-widest bg-sand-200 px-3.5 py-1 rounded-full">
              Handcrafted Menu
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-palm-deep tracking-tight">
              Our Specialties
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-medium">
              Carefully prepared beverage categories crafted to satisfy every craving.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((spec, i) => (
              <div
                key={i}
                className="bg-cream rounded-3xl overflow-hidden border border-sand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-200">
                  <Image
                    src={spec.image}
                    alt={spec.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 right-3 bg-cream/95 text-palm-deep font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-sand-300">
                    {spec.badge}
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold-500 block">
                      {spec.tamil}
                    </span>
                    <h3 className="text-lg font-black text-palm-deep leading-tight mt-1">
                      {spec.title}
                    </h3>
                    <p className="text-xs text-text-muted font-medium leading-relaxed mt-2">
                      {spec.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Our Promise Section */}
        <section className="bg-sand-200/90 rounded-3xl p-8 sm:p-14 border border-sand-300 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase text-gold-500 tracking-widest bg-sand-300/60 px-3.5 py-1 rounded-full">
              Quality Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-palm-deep tracking-tight">
              Our Promise To You
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-medium">
              Built on transparency, wholesome ingredients, and respect for our patrons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promisePillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="bg-cream rounded-3xl p-6 border border-sand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-palm-deep text-gold-400 flex items-center justify-center border border-palm-700 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold text-palm-deep">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-text-muted font-medium leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Visual Gallery */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-300 pb-4">
            <div>
              <span className="text-[11px] font-black uppercase text-gold-500 tracking-widest bg-sand-200 px-3.5 py-1 rounded-full">
                Authentic Craftsmanship
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-palm-deep tracking-tight mt-2">
                A Glimpse of Our Creations
              </h2>
            </div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Real Shop Photos
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-sand-200 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-palm-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                  <span className="text-[10px] font-bold text-white leading-tight">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Call to Action */}
        <section className="bg-palm-deep text-cream rounded-3xl p-8 sm:p-14 shadow-card-hover border border-palm-700 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-black uppercase text-gold-400 tracking-widest bg-palm-800 px-3.5 py-1 rounded-full border border-palm-700">
              Taste The Pure Difference
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Explore Our Refreshments?
            </h2>
            <p className="text-sm sm:text-base text-sand-200 font-medium leading-relaxed">
              Browse our full menu of over 50 cooling drinks, add your favorites to the cart, and order easily on WhatsApp with zero account signup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/menu"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 border border-green-400/30"
            >
              <span>Explore Our Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-widest px-8 py-4 rounded-full border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
