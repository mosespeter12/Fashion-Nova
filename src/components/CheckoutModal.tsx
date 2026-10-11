import React, { useState } from 'react';
import { X, CheckCircle2, Lock, ShieldCheck, CreditCard, DollarSign, Sparkles } from 'lucide-react';
import { CartItem, Currency } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentCurrency: Currency;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentCurrency,
  onClearCart,
}) => {
  const [formData, setFormData] = useState({
    fullName: 'Alexander Wright',
    email: 'alexander.wright@luxuryatelier.com',
    phone: '+1 (555) 349-8201',
    address: '742 Evergreen Terrace, Penthouse B',
    city: 'New York',
    state: 'NY',
    postalCode: '10021',
    country: 'United States',
    paymentMethod: 'card' as 'card' | 'applepay' | 'cod',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  });

  const [promoCode, setPromoCode] = useState('NOVA10');
  const [promoApplied, setPromoApplied] = useState(true);
  const [promoError, setPromoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountRate = promoApplied ? 0.1 : 0.0;
  const discountAmount = rawSubtotal * discountRate;
  const shippingCost = rawSubtotal >= 150 ? 0 : 25;
  const finalTotal = (rawSubtotal - discountAmount + shippingCost) * currentCurrency.rate;

  const formatPrice = (amount: number) => {
    if (currentCurrency.code === 'JPY') {
      return `${currentCurrency.symbol}${Math.round(amount).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${amount.toFixed(0)}`;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NOVA10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try NOVA10');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderNumber(`FN-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderConfirmed(true);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#111111] border border-amber-500/30 rounded-2xl shadow-2xl text-white overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold tracking-widest uppercase">
                {orderConfirmed ? 'Order Confirmed' : 'Haute Couture Checkout'}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {orderConfirmed ? 'Thank you for choosing Fashion Nova' : 'Encrypted 256-Bit SSL Atelier Protection'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {orderConfirmed ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Order Ref: {orderNumber}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                Preparing Your Atelier Shipment
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                An artisan confirmation receipt with tracking credentials has been dispatched to{' '}
                <span className="text-white font-medium">{formData.email}</span>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 max-w-md mx-auto text-left text-xs space-y-3">
              <div className="flex justify-between pb-2 border-b border-zinc-800 font-semibold text-zinc-300">
                <span>Total Paid</span>
                <span className="text-[#D4AF37] font-mono text-sm">{formatPrice(finalTotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping Address</span>
                <span className="text-white text-right">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimated Express Arrival</span>
                <span className="text-white font-medium">Within 2–4 Business Days</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Method</span>
                <span className="text-white uppercase">{formData.paymentMethod}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-bold tracking-widest uppercase rounded transition-colors"
              >
                Back To Collection
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Customer and Shipping Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] pb-1 border-b border-zinc-800">
                  1. Shipping & Concierge Details
                </h3>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      State / Prov
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Method & Order Summary */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] pb-1 border-b border-zinc-800">
                  2. Payment Method
                </h3>

                {/* Payment Option Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-3 rounded border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'applepay' })}
                    className={`p-3 rounded border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'applepay'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`p-3 rounded border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Expires (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={formData.cardExp}
                          onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="p-3 bg-zinc-900/80 rounded border border-zinc-800 text-xs text-zinc-300">
                    <p className="font-semibold text-amber-300 mb-1">Cash on Delivery Terms:</p>
                    <p>Pay with cash or card directly to the courier upon white-glove arrival. Ensure adult recipient is present to inspect packaging.</p>
                  </div>
                )}

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. NOVA10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded text-zinc-200 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <span className="text-[11px] text-emerald-400 mt-1 block">
                      ✓ Code NOVA10 applied (10% Atelier Discount)
                    </span>
                  )}
                  {promoError && (
                    <span className="text-[11px] text-red-400 mt-1 block">
                      {promoError}
                    </span>
                  )}
                </div>

                {/* Order Cost Breakdown */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums text-white">
                      {formatPrice(rawSubtotal * currentCurrency.rate)}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-400">
                      <span>VIP Privilege (10%)</span>
                      <span className="font-mono tabular-nums">
                        -{formatPrice(discountAmount * currentCurrency.rate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Express Delivery</span>
                    <span className="text-[#D4AF37]">
                      {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost * currentCurrency.rate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                    <span>Total Due</span>
                    <span className="text-[#D4AF37] font-mono tabular-nums">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>30-Day Atelier Guarantee & Complimentary Return Pickup</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#C5A059] hover:to-[#D4AF37] text-black text-xs font-bold tracking-[0.2em] uppercase rounded transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating Order...' : `Authorize Order (${formatPrice(finalTotal)})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
