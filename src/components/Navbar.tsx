import React from 'react';
import { ShoppingBag, Search, Heart, Moon, Sun, Code2, X } from 'lucide-react';

interface NavbarProps {
  siteName: string;
  affiliateTag: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  onOpenJsonManager: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  siteName,
  affiliateTag,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  showFavoritesOnly,
  setShowFavoritesOnly,
  onOpenJsonManager,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span>Hand-picked Amazon Deals & Recommendations</span>
        <span className="hidden sm:inline opacity-75">•</span>
        <span className="hidden sm:inline text-[11px] opacity-90">
          Tag: <code className="bg-black/20 px-1 py-0.5 rounded">{affiliateTag}</code>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              {siteName}
            </span>
          </a>

          {/* Search */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or ASIN..."
                className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/80 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              title="Saved Products"
              className={`relative p-2 rounded-xl transition-colors ${
                showFavoritesOnly
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 ring-2 ring-red-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* JSON Manager Button */}
            <button
              onClick={onOpenJsonManager}
              title="Edit Products JSON"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold hover:opacity-90 shadow-sm transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
              <span className="hidden sm:inline">Edit JSON</span>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode((prev: boolean) => !prev)}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
