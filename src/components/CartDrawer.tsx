import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, Currency } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  currentCurrency: Currency;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  currentCurrency,
}) => {
  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const convertedSubtotal = rawSubtotal * currentCurrency.rate;
  const shippingThreshold = 150;
  const freeShippingReached = rawSubtotal >= shippingThreshold;
  const progressPercent = Math.min(100, Math.round((rawSubtotal / shippingThreshold) * 100));

  const formatPrice = (amount: number) => {
    if (currentCurrency.code === 'JPY') {
      return `${currentCurrency.symbol}${Math.round(amount).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${amount.toFixed(0)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
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
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-heading text-lg font-bold tracking-widest uppercase">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#181818] p-4 border-b border-zinc-800 text-xs">
            <div className="flex items-center justify-between font-medium mb-1.5">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                {freeShippingReached ? (
                  <span className="text-[#D4AF37] font-semibold">Complimentary Worldwide Shipping Unlocked!</span>
                ) : (
                  <span>
                    Add <strong className="text-white">{formatPrice((shippingThreshold - rawSubtotal) * currentCurrency.rate)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="font-mono text-zinc-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5DEB3] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-zinc-800/80 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-white tracking-wider uppercase">
                    Your Bag Is Empty
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Explore our curated collection of haute couture footwear, outfits, and chronometers.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-bold tracking-widest uppercase rounded transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading text-xs sm:text-sm font-semibold text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 transition-colors"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-zinc-400 mt-0.5 space-x-2">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && (
                          <span>· Color: {item.selectedColor}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-zinc-800 rounded bg-zinc-900">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs px-2 text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono tabular-nums text-sm font-bold text-white">
                        {formatPrice(item.product.price * item.quantity * currentCurrency.rate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-[#0E0E0E] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-white">
                    {formatPrice(convertedSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Express Shipping</span>
                  <span className="text-[#D4AF37]">
                    {freeShippingReached ? 'FREE' : formatPrice(25 * currentCurrency.rate)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-zinc-800/80 text-white">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-[#D4AF37]">
                    {formatPrice(convertedSubtotal + (freeShippingReached ? 0 : 25 * currentCurrency.rate))}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#C5A059] hover:to-[#D4AF37] text-black text-xs font-bold tracking-[0.2em] uppercase rounded transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.25)]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted & Certified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
