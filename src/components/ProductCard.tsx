import React, { useState } from 'react';
import { ExternalLink, Heart, Share2, Check } from 'lucide-react';
import { Product, ViewMode } from '../types';
import { buildAffiliateUrl } from '../utils/affiliate';

interface ProductCardProps {
  product: Product;
  affiliateTag: string;
  viewMode: ViewMode;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  affiliateTag,
  viewMode,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const affiliateUrl = buildAffiliateUrl(product.link, affiliateTag);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col sm:flex-row gap-5 items-center">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 h-48 shrink-0 bg-slate-50 dark:bg-slate-800/80 rounded-xl overflow-hidden flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            {product.asin && (
              <span className="inline-block text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded mb-2">
                ASIN: {product.asin}
              </span>
            )}

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
              {product.name}
            </h3>

            {product.price && (
              <div className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                {product.price}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(product.id)}
                title="Save product"
                className={`p-2 rounded-xl transition-colors ${
                  isFavorite
                    ? 'text-red-500 bg-red-50 dark:bg-red-950/40'
                    : 'text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                title="Copy affiliate link"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={affiliateUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-amber-500/20 active:scale-98 transition-all"
            >
              <span>View on Amazon</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300 flex flex-col relative">
      {/* Top Image */}
      <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-800/60 p-6 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Favorite & Share overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFavorite(product.id)}
            title="Save product"
            className={`p-2 rounded-xl backdrop-blur-md shadow-xs transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            title="Copy affiliate link"
            className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-amber-500 backdrop-blur-md shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {product.asin && (
          <span className="absolute bottom-2 left-3 text-[10px] font-mono font-bold text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur">
            {product.asin}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          {product.price && (
            <div className="mt-2 text-base font-black text-slate-900 dark:text-white">
              {product.price}
            </div>
          )}
        </div>

        {/* Call to Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <a
            href={affiliateUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20 active:scale-98 transition-all"
          >
            <span>Check on Amazon</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
          </a>
        </div>
      </div>
    </div>
  );
};
