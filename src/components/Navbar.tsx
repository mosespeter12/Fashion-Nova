import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Mic } from 'lucide-react';
import { ClothesHangerIcon } from './icons/LuxuryIcons';
import { Currency } from '../types';
import { CURRENCIES } from '../data/products';

interface NavbarProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenVoiceSupport: () => void;
  currentCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  activeCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenVoiceSupport,
  currentCurrency,
  onSelectCurrency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const menuItems = [
    { label: 'Outfits', category: 'outfits' },
    { label: 'Footwear', category: 'footwear' },
    { label: 'Watches', category: 'watches' },
    { label: 'Accessories', category: 'accessories' },
    { label: 'New Arrivals', category: 'new-arrivals' },
  ];

  const handleNavClick = (category: string) => {
    onSelectCategory(category);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          {/* ZONE 1: BRAND LOGO WITH GOLD CLOTHES HANGER ICON */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('all')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
              aria-label="FASHION NOVA Homepage"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center text-[#D4AF37]">
                  <ClothesHangerIcon className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading tracking-[0.25em] text-lg sm:text-xl font-bold text-white uppercase transition-colors group-hover:text-amber-200">
                  FASHION NOVA
                </span>
                <span className="text-[9px] tracking-[0.3em] text-zinc-400 font-medium -mt-0.5 uppercase">
                  HAUTE COUTURE
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: NAVIGATION LINKS (Single-line, geometric high-fashion) */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.18em] font-medium uppercase text-zinc-300">
            {menuItems.map((item) => {
              const isActive = activeCategory === item.category;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.category)}
                  className={`relative py-2 transition-colors whitespace-nowrap hover:text-white ${
                    isActive ? 'text-amber-400 font-semibold' : 'text-zinc-300'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: ACTIONS - SEARCH, CURRENCY, WISHLIST, CART, AI VOICE SUPPORT */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AI Voice Support Button */}
            <button
              onClick={onOpenVoiceSupport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#141414] hover:bg-red-600/20 rounded border border-red-600/60 hover:border-red-500 transition-all shadow-[0_0_15px_rgba(220,38,38,0.25)] focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500 shrink-0"
              aria-label="Open AI Voice Support"
              title="AI Voice Support"
            >
              <Mic className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="hidden sm:inline">AI Voice Support</span>
            </button>

            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
              aria-label="Search collection"
              title="Search collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 transition-colors"
                aria-label="Select currency"
              >
                <span>{currentCurrency.code}</span>
                <span className="text-zinc-500 text-[10px]">({currentCurrency.symbol})</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {currencyDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCurrencyDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-32 bg-[#141414] border border-zinc-800 rounded-lg shadow-2xl py-1 z-50 text-xs">
                    {Object.values(CURRENCIES).map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          onSelectCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-zinc-800/70 transition-colors ${
                          currentCurrency.code === curr.code
                            ? 'text-amber-400 font-semibold bg-amber-500/10'
                            : 'text-zinc-300'
                        }`}
                      >
                        <span>{curr.code}</span>
                        <span className="text-zinc-400">{curr.symbol}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
              aria-label="Open Wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-black bg-[#D4AF37] rounded-full px-1 shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon & Count */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 text-zinc-200 hover:text-white rounded border border-amber-500/30 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="hidden sm:inline text-xs tracking-wider font-semibold text-zinc-200">
                BAG
              </span>
              <span className="min-w-[20px] h-5 flex items-center justify-center text-[11px] font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] rounded-full px-1.5 shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111111] border-b border-zinc-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm tracking-widest uppercase">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVoiceSupport();
              }}
              className="text-left py-2.5 px-3 rounded bg-[#161616] border border-red-600/50 text-white font-semibold flex items-center justify-between shadow-[0_0_15px_rgba(220,38,38,0.25)]"
            >
              <span className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-red-500 animate-pulse" />
                <span>AI Voice Support</span>
              </span>
              <span className="text-[10px] text-red-400 bg-red-600/20 px-2 py-0.5 rounded border border-red-500/30">
                Live
              </span>
            </button>

            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.category)}
                className={`text-left py-2 px-3 rounded transition-colors ${
                  activeCategory === item.category
                    ? 'text-amber-400 bg-amber-500/10 font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>Customer Concierge: 1-800-NOVA-LUX</span>
            <span className="text-amber-400">Atelier Online</span>
          </div>
        </div>
      )}
    </header>
  );
};
