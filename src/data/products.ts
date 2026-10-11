import { Product, Currency } from '../types';

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  JPY: { code: 'JPY', symbol: '¥', rate: 154.5 },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.38 },
  AUD: { code: 'AUD', symbol: 'AU$', rate: 1.52 },
};

export const PRODUCTS: Product[] = [
  // FOOTWEAR
  {
    id: 'prod-shoes-01',
    name: 'Aurelius Hand-Burnished Calfskin Oxford',
    category: 'footwear',
    categoryLabel: 'Footwear',
    price: 345,
    originalPrice: 420,
    rating: 4.9,
    reviewCount: 84,
    image: '/src/assets/images/hero_luxury_footwear_1791749973391.jpg',
    description: 'Masterfully crafted in Florence using wholecut French calfskin with hand-patinated mahogany finish and Goodyear-welted channeled oak bark leather soles.',
    details: [
      '100% full-grain Tuscan calfskin',
      'Goodyear welt construction with closed channel',
      'Natural cork filling for custom arch molding',
      'Handcrafted in Florence, Italy'
    ],
    inStock: true,
    isBestseller: true,
    sizes: ['US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'],
    colors: [
      { name: 'Espresso Mahogany', hex: '#3E2723' },
      { name: 'Sartorial Black', hex: '#1A1A1A' },
      { name: 'Cognac Saddle', hex: '#795548' }
    ]
  },
  {
    id: 'prod-shoes-02',
    name: 'Monarch Low-Top Minimalist Court Sneaker',
    category: 'footwear',
    categoryLabel: 'Footwear',
    price: 240,
    rating: 4.8,
    reviewCount: 142,
    image: '/src/assets/images/hero_luxury_footwear_1791749973391.jpg',
    description: 'Pristine Italian nappa leather upper paired with Margom vulcanized rubber cupsoles and discreet gold foil serial embossing.',
    details: [
      'Italian butter-soft nappa leather',
      'Authentic Italian Margom rubber soles',
      'Calfskin leather interior lining',
      'Waxed combed cotton laces'
    ],
    inStock: true,
    isNewArrival: true,
    sizes: ['US 7.5', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: [
      { name: 'Pure Chalk White', hex: '#F8F9FA' },
      { name: 'Alabaster & Tan', hex: '#E2DCD5' },
      { name: 'Matte Obsidian', hex: '#1C1917' }
    ]
  },
  // CLOTHES / OUTFITS
  {
    id: 'prod-clothes-01',
    name: 'Sartoriale Double-Breasted Flannel Suit',
    category: 'outfits',
    categoryLabel: 'Outfits',
    price: 780,
    originalPrice: 920,
    rating: 5.0,
    reviewCount: 47,
    image: '/src/assets/images/hero_luxury_apparel_1791749985257.jpg',
    description: 'Sculpted silhouette tailored from Super 150s Vitale Barberis Canonico charcoal flannel, boasting hand-sewn peak lapels and horn buttons.',
    details: [
      'Super 150s Merino wool flannel from Biella',
      'Half-canvas structured construction with soft shoulder',
      'Natural genuine buffalo horn buttons',
      'Curved chest pocket (barchetta) and dual vents'
    ],
    inStock: true,
    isBestseller: true,
    sizes: ['38R', '40R', '42R', '44R', '46L'],
    colors: [
      { name: 'Charcoal Melange', hex: '#374151' },
      { name: 'Midnight Navy', hex: '#1E293B' },
      { name: 'Raven Black', hex: '#111827' }
    ]
  },
  {
    id: 'prod-clothes-02',
    name: 'Atelier Seamless Cashmere Mockneck',
    category: 'outfits',
    categoryLabel: 'Outfits',
    price: 320,
    rating: 4.9,
    reviewCount: 68,
    image: '/src/assets/images/hero_luxury_apparel_1791749985257.jpg',
    description: '100% Grade-A Mongolian cashmere 2-ply knit with seamless 3D circular weaving technology providing an exceptionally soft, pill-resistant drape.',
    details: [
      '100% sustainably sourced Mongolian cashmere',
      '12-gauge 2-ply long-staple yarn',
      'Seamless architectural knit construction',
      'Thermal insulating yet breathable lightweight handle'
    ],
    inStock: true,
    isNewArrival: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Anthracite Grey', hex: '#4B5563' },
      { name: 'Cashmere Camel', hex: '#926F34' },
      { name: 'Onyx Black', hex: '#18181B' }
    ]
  },
  // WATCHES
  {
    id: 'prod-watch-01',
    name: 'Chronographe Royal Gold & Obsidian 41mm',
    category: 'watches',
    categoryLabel: 'Wristwatches',
    price: 1250,
    originalPrice: 1400,
    rating: 5.0,
    reviewCount: 39,
    image: '/src/assets/images/hero_luxury_timepiece_1791749995179.jpg',
    description: 'High-precision automatic chronometer featuring a 41mm 316L stainless case with 18k brushed gold accents, black ceramic bezel, and anti-reflective sapphire crystal.',
    details: [
      'Swiss Calibre automatic movement (28,800 vph)',
      '72-hour power reserve with bi-directional winding rotor',
      'Solid 18k yellow gold-plated tactile pushers',
      '300m / 1000ft water resistance rating with helium escape valve'
    ],
    inStock: true,
    isBestseller: true,
    sizes: ['41mm Case / Standard Link'],
    colors: [
      { name: 'Two-Tone Gold & Steel', hex: '#D4AF37' },
      { name: 'All-Obsidian PVD', hex: '#18181B' }
    ]
  },
  {
    id: 'prod-watch-02',
    name: 'Aethelgard Heritage Minimalist Slim Dress Watch',
    category: 'watches',
    categoryLabel: 'Wristwatches',
    price: 690,
    rating: 4.8,
    reviewCount: 52,
    image: '/src/assets/images/hero_luxury_timepiece_1791749995179.jpg',
    description: 'Ultra-thin 6.8mm case profile with sunburst lacquered midnight dial, faceted gold feuille hands, and vegetable-tanned alligator embossed strap.',
    details: [
      'Ultra-slim 6.8mm case depth',
      'Exhibition sapphire crystal caseback',
      'Hand-applied faceted gold indices',
      'Quick-release Italian leather strap'
    ],
    inStock: true,
    isNewArrival: true,
    sizes: ['38mm Case'],
    colors: [
      { name: 'Champagne Gold / Black Dial', hex: '#C5A059' },
      { name: 'Rose Gold / Warm Silver Dial', hex: '#B76E79' }
    ]
  },
  // ACCESSORIES
  {
    id: 'prod-acc-01',
    name: 'Sovereign Full-Grain Bridle Leather Briefcase',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 490,
    originalPrice: 560,
    rating: 4.9,
    reviewCount: 31,
    image: '/src/assets/images/hero_luxury_apparel_1791749985257.jpg',
    description: 'Forged with English bridle leather and solid antiqued brass hardware. Designed to develop a rich, lustrous patina with each journey.',
    details: [
      'English bridle full-grain vegetable-tanned leather',
      'Solid brass push-lock closure and rivets',
      'Padded compartment fits up to 16” MacBook Pro',
      'Reinforced hand-stitched rolled leather handle'
    ],
    inStock: true,
    sizes: ['16” x 11.5” x 3.5”'],
    colors: [
      { name: 'Espresso Black', hex: '#1C1917' },
      { name: 'Saddle Tan', hex: '#78350F' }
    ]
  },
  {
    id: 'prod-acc-02',
    name: 'Hexagonal Guilloché 18k Gold Cufflinks',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 180,
    rating: 5.0,
    reviewCount: 63,
    image: '/src/assets/images/hero_luxury_timepiece_1791749995179.jpg',
    description: 'Precision-turned cufflinks featuring geometric diamond guilloché engraving with 18k yellow gold vermeil and swivel whaleback toggle.',
    details: [
      '925 Sterling silver core with heavy 18k gold vermeil',
      'Intricate rotary engine guilloché relief pattern',
      'Hand-polished mirror beveled facets',
      'Signature luxury presentation jewelry case included'
    ],
    inStock: true,
    sizes: ['One Size (16mm Diameter)'],
    colors: [
      { name: '18k Yellow Gold', hex: '#D4AF37' },
      { name: 'Platinum Silver', hex: '#CBD5E1' }
    ]
  }
];

export const TRUST_FEATURES = [
  {
    id: 'delivery',
    title: 'FAST & RELIABLE DELIVERY',
    subtitle: 'Complimentary express worldwide shipping',
    icon: 'truck'
  },
  {
    id: 'security',
    title: 'SECURE PAYMENTS',
    subtitle: '256-bit encrypted checkout & guarantee',
    icon: 'shield'
  },
  {
    id: 'quality',
    title: 'PREMIUM QUALITY',
    subtitle: 'Hand-selected European materials',
    icon: 'badge'
  },
  {
    id: 'satisfaction',
    title: 'CUSTOMER SATISFACTION',
    subtitle: '30-day hassle-free return concierge',
    icon: 'heart'
  }
];
