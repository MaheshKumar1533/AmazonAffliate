import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { JsonManagerModal } from './components/JsonManagerModal';
import { Footer } from './components/Footer';
import { Product, ViewMode } from './types';
import { extractAsin } from './utils/affiliate';
import { PackageSearch, LayoutGrid, List } from 'lucide-react';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [siteName] = useState<string>('PrimePicks');
  const [affiliateTag, setAffiliateTag] = useState<string>(() => {
    return localStorage.getItem('primepicks_affiliate_tag') || 'maheshkumarvm-21';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('primepicks_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [isJsonManagerOpen, setIsJsonManagerOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Dark mode sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist favorites & affiliate tag
  useEffect(() => {
    localStorage.setItem('primepicks_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('primepicks_affiliate_tag', affiliateTag);
  }, [affiliateTag]);

  // Load public/data/products.json
  useEffect(() => {
    fetch('/data/products.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products.json');
        return res.json();
      })
      .then((json: any) => {
        const rawList = Array.isArray(json) ? json : json.products || [];
        const normalized: Product[] = rawList.map((item: any, index: number) => {
          const link = item.link || item.url || '';
          return {
            id: `prod-${index}`,
            name: item.name || item.title || 'Amazon Product',
            image: item.image || '',
            link: link,
            asin: extractAsin(link) || undefined,
            price: item.price || undefined,
            rating: item.rating || undefined,
          };
        });
        setProducts(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products.json:', err);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (showFavoritesOnly && !favorites.includes(p.id)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchAsin = p.asin?.toLowerCase().includes(q);
        if (!matchName && !matchAsin) return false;
      }
      return true;
    });
  }, [products, searchQuery, showFavoritesOnly, favorites]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <h2 className="text-base font-bold">Loading Products...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">

      {/* Navbar */}
      <Navbar
        siteName={siteName}
        affiliateTag={affiliateTag}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        onOpenJsonManager={() => setIsJsonManagerOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Hero */}
      <Hero
        productCount={products.length}
        onSelectTag={(tag) => setSearchQuery(tag)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        {/* Controls Bar: Count & View Switcher */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {showFavoritesOnly ? (
              <span>Saved Items (<strong className="text-amber-600 dark:text-amber-400">{filteredProducts.length}</strong>)</span>
            ) : (
              <span>Showing <strong className="text-amber-600 dark:text-amber-400">{filteredProducts.length}</strong> of {products.length} products</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Buttons */}
            <div className="flex items-center bg-slate-200/60 dark:bg-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        {filteredProducts.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                affiliateTag={affiliateTag}
                viewMode={viewMode}
                isFavorite={favorites.includes(p.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <PackageSearch className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No products found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try a different keyword or reset your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setShowFavoritesOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all"
            >
              Clear Search
            </button>
          </div>
        )}

      </main>

      {/* JSON Manager Modal */}
      {isJsonManagerOpen && (
        <JsonManagerModal
          products={products}
          affiliateTag={affiliateTag}
          onUpdateAffiliateTag={setAffiliateTag}
          onUpdateProducts={setProducts}
          onClose={() => setIsJsonManagerOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer
        siteName={siteName}
        affiliateTag={affiliateTag}
        onOpenJsonManager={() => setIsJsonManagerOpen(true)}
      />

    </div>
  );
};
