import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  onDismiss?: () => void;
  isVisible: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onDismiss, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="relative bg-[#0A0A0A] border-b border-amber-500/20 text-xs py-2 px-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-zinc-300">
        <div className="hidden sm:flex items-center gap-2 text-amber-400/80 font-medium tracking-wider text-[11px] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Fall / Winter Atelier Edition</span>
        </div>

        <div className="flex-1 text-center font-medium tracking-wider text-xs text-zinc-200">
          <span>Complimentary worldwide express shipping on orders over $150</span>
          <span className="hidden md:inline text-zinc-500 mx-2">|</span>
          <span className="hidden md:inline text-amber-300/90 hover:text-amber-200 cursor-pointer underline underline-offset-4 decoration-amber-500/40">
            Use Code NOVA10 for 10% Off
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-[11px] text-zinc-400 tracking-wider">Duty & Taxes Included</span>
          {onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Close notification bar"
              className="p-1 text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
