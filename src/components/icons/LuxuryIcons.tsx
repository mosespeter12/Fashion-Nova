import React from 'react';

// Gold Clothes Hanger Icon as specified in the brief
export const ClothesHangerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Hanger Hook */}
    <path d="M12 4a2 2 0 1 1 2 2c-1.5 1-2 2-2 3v1" />
    {/* Triangular Shoulder Arms */}
    <path d="M12 10 2.5 17.5a1.5 1.5 0 0 0 .9 2.5h17.2a1.5 1.5 0 0 0 .9-2.5L12 10z" />
    {/* Optional Trouser Bar Notch */}
    <line x1="6" y1="18.5" x2="18" y2="18.5" opacity="0.6" strokeWidth="1" />
  </svg>
);

// Sneaker / Footwear Icon in circular gold styling
export const SneakerIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 17h18v2.5a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5V17z" />
    <path d="M3 17v-4c0-2.5 1.8-4.5 4.2-4.8L12 7.5l4 3.5 4 1.5c.7.3 1 1 1 1.8V17" />
    <path d="M8 12.5h5" strokeDasharray="1.5 1.5" />
    <circle cx="8" cy="10" r="0.75" fill="currentColor" />
    <circle cx="10.5" cy="9.5" r="0.75" fill="currentColor" />
  </svg>
);

// Apparel / Jacket Icon in circular gold styling
export const ApparelIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    <path d="M12 2v8" />
    <path d="M8.5 2 12 7l3.5-5" />
  </svg>
);

// Watch / Chronograph Icon in circular gold styling
export const WatchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="6" />
    <polyline points="12 9 12 12 14 13.5" />
    <path d="M9 6.5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3.5" />
    <path d="M9 17.5V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3.5" />
    <path d="M18 12h1" />
    <path d="M17.5 10.5l.8-.5" />
  </svg>
);
