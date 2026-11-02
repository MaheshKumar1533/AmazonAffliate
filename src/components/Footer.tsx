import React from 'react';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  siteName: string;
  affiliateTag: string;
  onOpenJsonManager: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  siteName,
  affiliateTag,
  onOpenJsonManager,
}) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-sm">
              <ShoppingBag className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                {siteName}
              </span>
              <span className="text-xs text-slate-400 block">
                Amazon Affiliate Associate Tag: <code className="font-mono text-amber-600 dark:text-amber-400">{affiliateTag}</code>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenJsonManager}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Edit products.json
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>FTC Compliant</span>
            </div>
          </div>

        </div>

        {/* Amazon FTC Legal Disclosure */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 space-y-2 leading-relaxed">
          <p>
            <strong>Amazon Affiliate Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. Prices and availability of products on Amazon are subject to change without notice.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 text-[11px] gap-2">
            <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Curated for Amazon Affiliates with <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
