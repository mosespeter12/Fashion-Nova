import React, { useState } from 'react';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product, Currency } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  currentCurrency: Currency;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
  currentCurrency,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const popularSearches = ['Oxfords', 'Sneakers', 'Suit', 'Cashmere', 'Chronograph', 'Briefcase'];

  const formatPrice = (price: number) => {
    const converted = price * currentCurrency.rate;
    if (currentCurrency.code === 'JPY') {
      return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${converted.toFixed(0)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24">
      <div className="relative w-full max-w-2xl bg-[#111111] border border-zinc-800 rounded-2xl shadow-2xl text-white overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search suits, sneakers, chronographs, accessories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white ml-2 py-1 px-2.5 rounded bg-zinc-900 border border-zinc-800"
          >
            Esc
          </button>
        </div>

        {/* Popular Search Suggestions */}
        {!query && (
          <div className="p-6 space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 block">
              Suggested Haute Couture Searches:
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-[#D4AF37] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="max-h-96 overflow-y-auto p-4 sm:p-6 divide-y divide-zinc-800/80">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No bespoke items found matching &quot;{query}&quot;. Try exploring &quot;Oxfords&quot; or &quot;Suit&quot;.
              </div>
            ) : (
              filtered.map((product) => (
                <div
                  key={product.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-12 h-14 rounded bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-medium">
                        {product.categoryLabel}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {product.name}
                      </h4>
                      <span className="font-mono tabular-nums text-xs font-bold text-zinc-300">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="p-2 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black rounded text-zinc-300 transition-colors"
                      title="Add to bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="p-2 text-zinc-400 hover:text-white"
                      title="View details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
