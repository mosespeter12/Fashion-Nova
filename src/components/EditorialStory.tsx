import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface EditorialStoryProps {
  onExploreCollection: () => void;
}

export const EditorialStory: React.FC<EditorialStoryProps> = ({ onExploreCollection }) => {
  return (
    <section className="relative py-20 bg-[#0A0A0A] border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full-width editorial card with background photo */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/25 bg-zinc-950 shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] w-full min-h-[420px]">
            <img
              src="/src/assets/images/luxury_lookbook_editorial_1791750004342.jpg"
              alt="Fashion Nova luxury editorial collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            
            {/* Dramatic gradient scrim for high contrast readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/95 via-[#0D0D0D]/75 to-transparent sm:w-3/4" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent sm:hidden" />
          </div>

          {/* Floating Content Box */}
          <div className="absolute inset-0 flex items-center p-6 sm:p-12 lg:p-16 z-10">
            <div className="max-w-xl text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-[0.2em] font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>The Atelier Manifesto</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
                TIMELESS SILHOUETTES. UNCOMPROMISING PRECISION.
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
                Every garment is cut from sustainably sourced Italian mills in Biella, paired with hand-welted Tuscan footwear and horological chronometers assembled in the Swiss Jura. Created for those who understand that true luxury speaks in whispers.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onExploreCollection}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-bold tracking-[0.18em] uppercase rounded transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-105 flex items-center gap-2"
                >
                  <span>Experience The Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[11px] text-zinc-400 tracking-wider">
                  Autumn / Winter Capsule No. VII
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
