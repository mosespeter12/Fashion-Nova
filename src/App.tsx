/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustBar } from './components/TrustBar';
import { FeaturedCollection } from './components/FeaturedCollection';
import { EditorialStory } from './components/EditorialStory';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { VoiceSupportModal } from './components/VoiceSupportModal';
import { Footer } from './components/Footer';
import { PRODUCTS, CURRENCIES } from './data/products';
import { Product, CartItem, Currency } from './types';
import { Check, ShoppingBag, Mic } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'prod-shoes-01-US 9-Espresso Mahogany',
      product: PRODUCTS[0],
      quantity: 1,
      selectedSize: 'US 9',
      selectedColor: 'Espresso Mahogany',
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set(['prod-watch-01']));
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(CURRENCIES.USD);

  // Modals & Drawers state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [voiceSupportOpen, setVoiceSupportOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  // Floating notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    const collectionEl = document.getElementById('collection-section');
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: string,
    quantity: number = 1
  ) => {
    const selectedSize = size || (product.sizes ? product.sizes[0] : undefined);
    const selectedColor = color || (product.colors ? product.colors[0].name : undefined);
    const itemKey = `${product.id}-${selectedSize || 'std'}-${selectedColor || 'std'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            product,
            quantity,
            selectedSize,
            selectedColor,
          },
        ];
      }
    });

    showToast(`Added ${product.name} to your Bag`);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed from your Wishlist`);
      } else {
        next.add(product.id);
        showToast(`Saved ${product.name} to your Wishlist`);
      }
      return next;
    });
  };

  const handleMoveToCartFromWishlist = (product: Product) => {
    handleAddToCart(product);
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(product.id);
      return next;
    });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.has(p.id));

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* 1. TOP MINIMAL ANNOUNCEMENT BAR */}
      <AnnouncementBar
        isVisible={announcementVisible}
        onDismiss={() => setAnnouncementVisible(false)}
      />

      {/* 2. NAVBAR WITH LOGO, GOLD HANGER, LINKS, CURRENCY, WISHLIST & CART */}
      <Navbar
        onSelectCategory={handleSelectCategory}
        activeCategory={activeCategory}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenVoiceSupport={() => setVoiceSupportOpen(true)}
        currentCurrency={currentCurrency}
        onSelectCurrency={setCurrentCurrency}
      />

      {/* 3. HERO SECTION (3-Column Showcase as shown in visual) */}
      <main className="flex-1">
        <HeroSection onSelectCategory={handleSelectCategory} />

        {/* 4. VALUE PROPOSITION / TRUST BAR */}
        <TrustBar />

        {/* 5. FEATURED COLLECTION CATALOG */}
        <FeaturedCollection
          products={PRODUCTS}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onAddToCart={(p) => handleAddToCart(p)}
          onQuickView={(p) => setQuickViewProduct(p)}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          currentCurrency={currentCurrency}
        />

        {/* 6. EDITORIAL MANIFESTO / LOOKBOOK */}
        <EditorialStory
          onExploreCollection={() => handleSelectCategory('all')}
        />
      </main>

      {/* 7. LUXURY FOOTER */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* PERSISTENT AI VOICE SUPPORT BUTTON (Matches dark + red brand style) */}
      <button
        onClick={() => setVoiceSupportOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-[#121212] hover:bg-[#1A1A1A] text-white border border-red-600/60 hover:border-red-500 rounded-full shadow-[0_0_25px_rgba(220,38,38,0.35)] transition-all group hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        aria-label="AI Voice Support"
      >
        <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
          <Mic className="w-3.5 h-3.5 text-red-500" />
        </div>
        <span className="text-xs font-semibold tracking-wider uppercase text-white">
          AI Voice Support
        </span>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      </button>

      {/* AI VOICE SUPPORT ASSISTANT MODAL */}
      <VoiceSupportModal
        isOpen={voiceSupportOpen}
        onClose={() => setVoiceSupportOpen(false)}
      />

      {/* SHOPPING BAG DRAWER */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setCheckoutOpen(true)}
        currentCurrency={currentCurrency}
      />

      {/* WISHLIST DRAWER */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveToCartFromWishlist}
        currentCurrency={currentCurrency}
      />

      {/* SEARCH SPOTLIGHT MODAL */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onAddToCart={(p) => handleAddToCart(p)}
        currentCurrency={currentCurrency}
      />

      {/* QUICK VIEW PRODUCT MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.has(quickViewProduct.id) : false}
        currentCurrency={currentCurrency}
      />

      {/* COMPLETE CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        currentCurrency={currentCurrency}
        onClearCart={handleClearCart}
      />

      {/* NOTIFICATION TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#141414] border border-[#D4AF37]/50 text-white py-3 px-5 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in backdrop-blur-md">
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium tracking-wide">{toastMessage}</span>
          <button
            onClick={() => setCartOpen(true)}
            className="ml-2 text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>View Bag</span>
          </button>
        </div>
      )}
    </div>
  );
}
