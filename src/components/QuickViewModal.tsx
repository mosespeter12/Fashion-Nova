import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Truck } from 'lucide-react';
import { Product, Currency } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  currentCurrency: Currency;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  currentCurrency,
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors ? product.colors[0].name : '');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const formatPrice = (price: number) => {
    const converted = price * currentCurrency.rate;
    if (currentCurrency.code === 'JPY') {
      return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${converted.toFixed(0)}`;
  };

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#111111] border border-zinc-800 rounded-2xl shadow-2xl text-white overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white rounded-full bg-black/50 hover:bg-black transition-colors"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image Display */}
          <div className="relative aspect-[3/4] md:aspect-auto w-full bg-zinc-950 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300 backdrop-blur-md bg-black/40 p-2.5 rounded-lg border border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Certificate of Authenticity
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                Express Shipping
              </span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-widest mb-1.5">
                <span className="text-[#D4AF37] font-semibold">{product.categoryLabel}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-semibold text-white">{product.rating}</span>
                  <span className="text-zinc-500">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono tabular-nums text-2xl font-bold text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-mono tabular-nums text-sm text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-[11px] text-emerald-400 font-medium">In Stock — Dispatches Tomorrow</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                    Color: <span className="text-white font-medium">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full transition-all border-2 flex items-center justify-center ${
                          selectedColor === c.name
                            ? 'border-amber-400 ring-2 ring-amber-400/30 scale-110'
                            : 'border-zinc-700 hover:border-zinc-500'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={`Select color ${c.name}`}
                      >
                        {selectedColor === c.name && (
                          <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] uppercase tracking-wider text-zinc-400">
                      Select Size: <span className="text-white font-medium">{selectedSize}</span>
                    </label>
                    <span className="text-[10px] text-amber-400/90 underline cursor-pointer hover:text-amber-300">
                      Sizing Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                          selectedSize === s
                            ? 'bg-white text-black font-bold border-white'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Craftsmanship Specifications */}
              <div className="mt-5 pt-4 border-t border-zinc-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Atelier Craftsmanship Highlights:
                </span>
                <ul className="grid grid-cols-1 gap-1 text-xs text-zinc-300">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions: Quantity Stepper & Add to Cart */}
            <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-zinc-800 rounded bg-zinc-900 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm text-zinc-400 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="font-mono text-xs px-2 text-white font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm text-zinc-400 hover:text-white"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAdd}
                className="flex-1 py-3 px-4 bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-bold tracking-[0.2em] uppercase rounded transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Added To Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Bag</span>
                  </>
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded border transition-colors ${
                  isWishlisted
                    ? 'bg-red-500/10 border-red-500 text-red-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-400' : ''}`} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
