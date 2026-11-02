import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface HeroProps {
  productCount: number;
  onSelectTag: (tag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ productCount, onSelectTag }) => {
  const quickTags = ['Headphones', 'MacBook', 'Mouse', 'Echo Dot', 'Espresso', 'Gaming', 'Air Fryer'];

  return (
    <section className="bg-gradient-to-b from-amber-500/10 via-slate-50 to-white dark:from-amber-500/5 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Micro badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-semibold mb-3 border border-amber-300/60 dark:border-amber-700/40">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Curated Amazon Products & Deals</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
          Top-Rated Finds on{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Amazon
          </span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Hand-picked recommendations and deals. Browse products below and check current pricing directly on Amazon.
        </p>

        {/* Quick Tag Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className="text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-2xs"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Info stats */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            FTC Compliant Affiliate Links
          </span>
          <span>•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {productCount} Products Listed
          </span>
        </div>

      </div>
    </section>
  );
};
