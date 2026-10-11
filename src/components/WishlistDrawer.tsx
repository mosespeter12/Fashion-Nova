import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
  currentCurrency: Currency;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    const converted = price * currentCurrency.rate;
    if (currentCurrency.code === 'JPY') {
      return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${converted.toFixed(0)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-zinc-800 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400 fill-red-400/20" />
              <h2 className="font-heading text-lg font-bold tracking-widest uppercase">
                Curated Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-zinc-800/80 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <Heart className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-white tracking-wider uppercase">
                    Your Wishlist Is Empty
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Click the heart icon on any footwear, apparel, or watch to curate your private selection.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-bold tracking-widest uppercase rounded transition-colors"
                >
                  Explore Masterpieces
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div key={product.id} className="pt-4 first:pt-0 flex gap-4">
                  <div className="w-20 h-24 rounded bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]">
                            {product.categoryLabel}
                          </span>
                          <h4 className="font-heading text-xs sm:text-sm font-semibold text-white line-clamp-1">
                            {product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => onRemoveFromWishlist(product)}
                          className="text-zinc-500 hover:text-red-400 p-0.5"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="font-mono tabular-nums text-sm font-bold text-white mt-1">
                        {formatPrice(product.price)}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onMoveToCart(product);
                        }}
                        className="w-full py-1.5 px-3 bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-bold tracking-wider uppercase rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move To Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
