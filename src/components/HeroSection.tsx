import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ClothesHangerIcon, SneakerIcon, ApparelIcon, WatchIcon } from './icons/LuxuryIcons';

interface HeroSectionProps {
  onSelectCategory: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectCategory }) => {
  const cards = [
    {
      id: 'shoes',
      title: 'SHOES',
      subtitle: 'Step into style',
      category: 'footwear',
      icon: SneakerIcon,
      image: '/src/assets/images/hero_luxury_footwear_1791749973391.jpg',
      alt: 'Sleek luxury leather oxfords and minimalist designer sneakers',
      ctaText: 'Explore Footwear',
      badge: 'Italian Handcrafted',
    },
    {
      id: 'clothes',
      title: 'CLOTHES',
      subtitle: 'Look good, feel great',
      category: 'outfits',
      icon: ApparelIcon,
      image: '/src/assets/images/hero_luxury_apparel_1791749985257.jpg',
      alt: 'Studio clothing rack featuring tailored blazers and luxury knitwear',
      ctaText: 'Shop Collection',
      badge: 'Bespoke Atelier',
      featured: true,
    },
    {
      id: 'watches',
      title: 'WRISTWATCHES',
      subtitle: 'Time for a better you',
      category: 'watches',
      icon: WatchIcon,
      image: '/src/assets/images/hero_luxury_timepiece_1791749995179.jpg',
      alt: 'Luxury automatic chronograph watch with gold accents on velvet pedestal',
      ctaText: 'Discover Timepieces',
      badge: 'Swiss Precision',
    },
  ];

  const handleCardClick = (category: string) => {
    onSelectCategory(category);
    // Smooth scroll down to featured collection
    const collectionEl = document.getElementById('collection-section');
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-10 pb-14 sm:pt-14 sm:pb-20 overflow-hidden bg-gradient-to-b from-[#0D0D0D] via-[#111111] to-[#0D0D0D]">
      {/* Subtle luxury ambient glow in background */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent blur-[120px] pointer-events-none rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CENTER TOP BRAND TITLE & TAGLINE */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Gold Hanger Icon Above Bold Brand Logo */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <ClothesHangerIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#D4AF37]" />
            </div>
          </div>

          {/* Bold Brand Name */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.22em] text-white uppercase drop-shadow-sm">
            FASHION NOVA
          </h1>

          {/* Subtitle / Tagline */}
          <div className="mt-3 flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm tracking-[0.35em] text-[#D4AF37] font-semibold uppercase">
            <span>STYLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
            <span>QUALITY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
            <span>YOU</span>
          </div>

          {/* Category Pills/Tags */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-1.5 px-4 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs sm:text-sm text-zinc-300 font-medium">
            <button 
              onClick={() => handleCardClick('outfits')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Trendy Outfits
            </button>
            <span className="text-zinc-600 font-light" aria-hidden="true">|</span>
            <button 
              onClick={() => handleCardClick('footwear')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Premium Shoes
            </button>
            <span className="text-zinc-600 font-light" aria-hidden="true">|</span>
            <button 
              onClick={() => handleCardClick('watches')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Stylish Watches
            </button>
          </div>
        </div>

        {/* SPLIT 3-COLUMN INTERACTIVE CARD DISPLAY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.category)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-500 cursor-pointer ${
                  card.featured
                    ? 'border-amber-500/30 bg-[#121212] shadow-[0_8px_30px_rgba(0,0,0,0.5)] md:-translate-y-2'
                    : 'border-zinc-800/80 bg-[#111111]'
                } hover:border-amber-500/60 hover:shadow-[0_12px_40px_-8px_rgba(212,175,55,0.22)]`}
              >
                {/* Top Header inside Card: Title + Gold Circle Icon + Subtitle */}
                <div className="p-6 pb-4 z-20 bg-gradient-to-b from-[#111111] via-[#111111]/90 to-transparent">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-semibold">
                        {card.badge}
                      </span>
                      <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-[0.18em] text-white uppercase group-hover:text-amber-300 transition-colors">
                        {card.title}
                      </h2>
                    </div>

                    {/* Gold Circle Icon */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#997926] p-[1.5px] shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-[#161616] flex items-center justify-center text-[#D4AF37]">
                        <IconComponent className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-zinc-300 font-normal tracking-wide">
                    {card.subtitle}
                  </p>
                </div>

                {/* Card Visual / Photography Frame */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={card.image}
                    alt={card.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  {/* Subtle darkening scrim for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-75 group-hover:opacity-60 transition-opacity" />

                  {/* Subtle hover gold border shimmer overlay */}
                  <div className="absolute inset-0 border border-amber-500/0 group-hover:border-amber-400/30 transition-colors pointer-events-none rounded-b-xl" />
                </div>

                {/* Card Bottom CTA Button */}
                <div className="p-5 pt-3 z-20 bg-[#111111] border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300 group-hover:text-amber-300 transition-colors">
                    {card.ctaText}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-zinc-800/80 group-hover:bg-[#D4AF37] group-hover:text-black text-zinc-300 flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
