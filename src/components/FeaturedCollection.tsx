import React from 'react';
import { Eye, ShoppingBag, Heart, Star } from 'lucide-react';
import { Product, Currency } from '../types';

interface FeaturedCollectionProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  currentCurrency: Currency;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  wishlistIds,
  currentCurrency,
}) => {
  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'outfits', label: 'Outfits' },
    { id: 'footwear', label: 'Footwear' },
    { id: 'watches', label: 'Wristwatches' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'new-arrivals') return p.isNewArrival;
    return p.category === activeCategory;
  });

  const formatPrice = (price: number) => {
    const converted = price * currentCurrency.rate;
    if (currentCurrency.code === 'JPY') {
      return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${converted.toFixed(0)}`;
  };

  return (
    <section id="collection-section" className="py-16 sm:py-24 bg-[#0D0D0D] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-zinc-800/80 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase mb-2">
              <span>CURATED ATELIER</span>
              <span className="w-8 h-[1px] bg-[#D4AF37]/50" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white uppercase">
              FEATURED ATELIER SELECTIONS
            </h2>
          </div>

          {/* Category Filter Controls */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs tracking-wider uppercase font-medium rounded-full transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-semibold shadow-md'
                      : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlistIds.has(product.id);
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-[#131313] rounded-lg border border-zinc-800/80 hover:border-amber-500/40 transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)]"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg bg-zinc-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Subtle Badge */}
                  {product.isBestseller && (
                    <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[10px] tracking-widest font-bold px-2 py-0.5 rounded uppercase shadow-sm">
                      Bestseller
                    </div>
                  )}
                  {product.isNewArrival && (
                    <div className="absolute top-3 left-3 bg-zinc-800/90 text-amber-300 text-[10px] tracking-widest font-bold px-2 py-0.5 rounded uppercase border border-amber-500/30">
                      New Arrival
                    </div>
                  )}

                  {/* Wishlist Floating Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      isWishlisted
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-black/40 text-zinc-300 hover:text-white hover:bg-black/70 border border-white/10'
                    }`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? 'fill-red-400 text-red-400' : ''}`}
                    />
                  </button>

                  {/* Quick View Button on Image Hover */}
                  <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => onQuickView(product)}
                      className="flex-1 py-2 px-3 bg-zinc-900/90 hover:bg-black text-white text-xs font-medium tracking-wider uppercase rounded border border-zinc-700/80 hover:border-amber-500/50 flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Quick View</span>
                    </button>
                    
                    <button
                      onClick={() => onAddToCart(product)}
                      className="p-2 bg-[#D4AF37] hover:bg-[#c5a059] text-black rounded transition-colors shadow-lg"
                      title="Add to bag"
                      aria-label="Add to bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content Information */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      <span>{product.categoryLabel}</span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-zinc-500">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onQuickView(product)}
                      className="font-heading text-sm sm:text-base font-semibold text-white tracking-wide hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono tabular-nums text-base sm:text-lg font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono tabular-nums text-xs text-zinc-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="text-xs font-semibold tracking-wider uppercase text-amber-400 hover:text-amber-300 flex items-center gap-1 group/btn"
                    >
                      <span>Add</span>
                      <span className="text-zinc-500 group-hover/btn:text-amber-300 transition-colors">+</span>
                    </button>
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
