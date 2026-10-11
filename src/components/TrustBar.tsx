import React from 'react';
import { Truck, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      id: 'delivery',
      icon: Truck,
      title: 'FAST & RELIABLE DELIVERY',
      desc: 'Complimentary express worldwide shipping',
    },
    {
      id: 'payments',
      icon: ShieldCheck,
      title: 'SECURE PAYMENTS',
      desc: '256-bit encrypted checkout & fraud protection',
    },
    {
      id: 'quality',
      icon: Award,
      title: 'PREMIUM QUALITY',
      desc: 'Certified artisan craftsmanship & materials',
    },
    {
      id: 'satisfaction',
      icon: HeartHandshake,
      title: 'CUSTOMER SATISFACTION',
      desc: '30-day dedicated luxury concierge returns',
    },
  ];

  return (
    <section className="relative w-full bg-[#0A0A0A] border-y border-amber-500/20 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 py-4 sm:py-2 px-3 sm:px-6 lg:px-8 transition-colors ${
                  index !== 0 ? 'sm:pl-6' : ''
                }`}
              >
                {/* Gold Circle Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-transparent border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <Icon className="w-6 h-6 text-[#D4AF37]" />
                </div>

                {/* Text Description */}
                <div>
                  <h3 className="font-heading text-xs sm:text-[13px] font-bold tracking-[0.14em] text-white uppercase">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-relaxed font-normal">
                    {item.desc}
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
