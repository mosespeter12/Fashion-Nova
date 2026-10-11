import React, { useState } from 'react';
import { ClothesHangerIcon } from './icons/LuxuryIcons';
import { Check, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-zinc-800 text-zinc-400 text-xs">
      {/* Top Newsletter / VIP Atelier Section */}
      <div className="border-b border-zinc-800/80 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-1">
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
                Private Atelier Club
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                Subscribe for Private Previews & Exclusive Privileges
              </h3>
              <p className="text-xs text-zinc-400">
                Receive inaugural 10% privilege with code <strong className="text-amber-300">NOVA10</strong> and invitation-only runway updates.
              </p>
            </div>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
              {subscribed ? (
                <div className="w-full py-3 px-4 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 text-xs font-semibold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Welcome to the Atelier. Your 10% code is NOVA10.</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold tracking-widest uppercase text-xs rounded transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-[1px]">
                <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center text-[#D4AF37]">
                  <ClothesHangerIcon className="w-4 h-4 text-[#D4AF37]" />
                </div>
              </div>
              <span className="font-heading tracking-[0.25em] text-lg font-bold text-white uppercase">
                FASHION NOVA
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Haute couture menswear, artisanal Italian footwear, and chronometric masterworks. Defined by uncompromising Italian and Swiss craftsmanship.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-400/90 font-semibold tracking-widest uppercase">
              <span>STYLE</span>
              <span>•</span>
              <span>QUALITY</span>
              <span>•</span>
              <span>YOU</span>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('outfits')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Tailored Outfits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('footwear')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Handcrafted Footwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('watches')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Chronograph Watches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('accessories')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Leather Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('new-arrivals')}
                  className="hover:text-amber-300 transition-colors"
                >
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Atelier Concierge */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-white">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="hover:text-white cursor-pointer transition-colors">
                Worldwide Express Shipping
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Bespoke Made-To-Measure
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                30-Day White Glove Returns
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Certificate of Authenticity
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Leather & Horology Restoration
              </li>
            </ul>
          </div>

          {/* Column 4: Global Flagships */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-white">
              Global Boutiques
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <span className="text-white block font-medium">Milan Atelier</span>
                Via Montenapoleone 8
              </li>
              <li>
                <span className="text-white block font-medium">New York Flagship</span>
                740 Madison Avenue
              </li>
              <li>
                <span className="text-white block font-medium">Paris Salon</span>
                Rue du Faubourg Saint-Honoré 22
              </li>
              <li>
                <span className="text-white block font-medium">London Mayfair</span>
                14 New Bond Street
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Security */}
        <div className="mt-14 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>© {new Date().getFullYear()} FASHION NOVA ATELIER GROUP. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-300 cursor-pointer">Authenticity Registry</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
