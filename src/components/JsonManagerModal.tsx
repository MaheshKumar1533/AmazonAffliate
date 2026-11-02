import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Download, 
  Check, 
  PlusCircle, 
  FileJson, 
  Terminal, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';

interface JsonManagerModalProps {
  products: Product[];
  affiliateTag: string;
  onUpdateAffiliateTag: (newTag: string) => void;
  onUpdateProducts: (newProducts: Product[]) => void;
  onClose: () => void;
}

export const JsonManagerModal: React.FC<JsonManagerModalProps> = ({
  products,
  affiliateTag,
  onUpdateAffiliateTag,
  onUpdateProducts,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'add' | 'api'>('json');
  
  // Format clean 3-field JSON: name, image, link
  const cleanJson = products.map((p) => ({
    name: p.name,
    image: p.image,
    link: p.link,
  }));

  const [jsonText, setJsonText] = useState<string>(JSON.stringify(cleanJson, null, 2));
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [tempTag, setTempTag] = useState(affiliateTag);

  // Quick 3-field form state
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyJson = () => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonText);
      const list = Array.isArray(parsed) ? parsed : parsed.products;
      if (!Array.isArray(list)) {
        throw new Error('JSON must be an array of products: [ { "name": "...", "image": "...", "link": "..." } ]');
      }

      const updated = list.map((item: any, idx: number) => ({
        id: `prod-${idx}-${Date.now()}`,
        name: item.name || item.title || 'Product',
        image: item.image || '',
        link: item.link || item.url || '#',
      }));

      onUpdateProducts(updated);
      setSuccessMsg('✅ Products updated successfully in the app!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax. Please check formatting.');
    }
  };

  const handleSaveTag = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAffiliateTag(tempTag.trim());
    setSuccessMsg('✅ Amazon Affiliate Tag updated!');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !link.trim() || !image.trim()) {
      setError('Please provide Name, Image URL, and Amazon Link.');
      return;
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      image: image.trim(),
      link: link.trim(),
    };

    const updated = [newProd, ...products];
    onUpdateProducts(updated);

    const updatedClean = updated.map((p) => ({
      name: p.name,
      image: p.image,
      link: p.link,
    }));
    setJsonText(JSON.stringify(updatedClean, null, 2));

    setSuccessMsg(`✅ Added "${newProd.name.slice(0, 30)}..." to your site!`);
    setName('');
    setImage('');
    setLink('');
    setActiveTab('json');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Manage Products JSON
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Affiliate Tag Bar */}
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <form onSubmit={handleSaveTag} className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-bold text-slate-700 dark:text-slate-300">Your Associate Tag:</span>
            <input
              type="text"
              value={tempTag}
              onChange={(e) => setTempTag(e.target.value)}
              placeholder="e.g. yourtag-20"
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs w-32 focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-600 transition-colors"
            >
              Save Tag
            </button>
          </form>

          <span className="text-slate-500 dark:text-slate-400">
            Automatically appended to all Amazon URLs.
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 px-6 pt-2">
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'json'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>products.json (Name, Image, Link)</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'add'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Quick Add Item</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'api'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Amazon API Instructions</span>
          </button>
        </div>

        {/* Notification alerts */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-500">
                  File path: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-amber-600 dark:text-amber-400">public/data/products.json</code>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleApplyJson}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply to Site</span>
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  rows={16}
                  className="w-full font-mono text-xs p-4 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                  spellCheck={false}
                />
              </div>

              <p className="text-xs text-slate-500">
                💡 <strong>Format:</strong> An array of objects with only <code>name</code>, <code>image</code>, and <code>link</code>.
              </p>
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleQuickAdd} className="space-y-4 max-w-xl mx-auto">
              <p className="text-xs text-slate-500">
                Fill in the 3 required fields to add a new product directly:
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  2. Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or amazon image link"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  3. Amazon Link or ASIN *
                </label>
                <input
                  type="text"
                  required
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://www.amazon.com/dp/B0BSHF7WHW or B0BSHF7WHW"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all"
              >
                + Add Product
              </button>
            </form>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Automated Fetching with CLI Script
                </h4>
                <p>
                  You don't even need to write the JSON manually! You can run our included script with an Amazon ASIN or URL:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                  npm run sync:asin B0BSHF7WHW
                </pre>
                <p className="text-slate-500">
                  It fetches the product name and image from Amazon and automatically appends it to <code className="font-mono">public/data/products.json</code>!
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Using RapidAPI or Amazon PA-API
                </h4>
                <p>
                  Set your API key in <code className="font-mono">.env</code>:
                </p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                  RAPIDAPI_KEY=your_key_here
                </pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
