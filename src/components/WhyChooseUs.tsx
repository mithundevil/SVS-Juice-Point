import React from 'react';
import { Palmtree, Clock, MessageCircle, Heart } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Palmtree,
      title: 'Fresh Ingredients',
      description: 'Carefully selected fruits, fresh ice apples (Nungu), and pure tender coconut water sourced daily.',
    },
    {
      icon: Clock,
      title: 'Made Fresh',
      description: 'Every juice, shake, and ice cream stick is freshly prepared upon receiving your order.',
    },
    {
      icon: MessageCircle,
      title: 'Quick Ordering',
      description: 'Instant WhatsApp ordering with zero account setup or registration required.',
    },
    {
      icon: Heart,
      title: 'Local Favourite',
      description: 'Serving Thirumalapuram with authentic natural cold refreshments and trusted quality.',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-sand border-b border-sand-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-black uppercase text-gold-500 tracking-widest bg-sand-200 px-3.5 py-1 rounded-full">
            Our Promise
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-palm-deep tracking-tight">
            Freshness You Can Taste
          </h2>
          <p className="text-xs sm:text-sm text-text-muted font-medium">
            Dedicated to bringing cold, wholesome, authentic refreshments to Thirumalapuram.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-cream rounded-3xl p-6 border border-sand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-palm-deep text-gold-400 flex items-center justify-center border border-palm-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-palm-deep">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-muted font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
