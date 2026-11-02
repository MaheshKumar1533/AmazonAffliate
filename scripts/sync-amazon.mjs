#!/usr/bin/env node

/**
 * Amazon Product Synchronizer & API Fetcher
 *
 * Usage:
 *   node scripts/sync-amazon.mjs <ASIN or Amazon URL>
 *   npm run sync:asin B0BSHF7WHW
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PRODUCTS_JSON_PATH = path.resolve(__dirname, '../public/data/products.json');

// Parse CLI arguments
const args = process.argv.slice(2);
let asin = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--asin=')) {
    asin = arg.split('=')[1];
  } else if (arg === '--asin' && args[i + 1]) {
    asin = args[++i];
  } else if (!asin) {
    if (/^[A-Z0-9]{10}$/i.test(arg)) {
      asin = arg;
    } else if (arg.includes('/dp/')) {
      const match = arg.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (match) asin = match[1];
    }
  }
}

if (!asin) {
  console.log(`
======================================================
  Amazon Product Sync CLI Tool
======================================================
Usage:
  node scripts/sync-amazon.mjs <ASIN or URL>
  npm run sync:asin B0BSHF7WHW
======================================================
`);
  process.exit(1);
}

asin = asin.trim().toUpperCase();

async function main() {
  console.log(`🔍 [1/3] Fetching product information for ASIN: ${asin}...`);

  // Load existing products.json
  let products = [];
  if (fs.existsSync(PRODUCTS_JSON_PATH)) {
    const raw = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    products = Array.isArray(parsed) ? parsed : parsed.products || [];
  }

  let productDetails = null;

  // 1. RapidAPI Real-Time Amazon Data API (if key exists)
  if (process.env.RAPIDAPI_KEY) {
    try {
      console.log('⚡ Querying RapidAPI...');
      const res = await fetch(`https://real-time-amazon-data.p.rapidapi.com/product-details?asin=${asin}&country=US`, {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
        },
      });
      if (res.ok) {
        const json = await res.json();
        const p = json.data;
        productDetails = {
          name: p.product_title,
          image: p.product_photo,
          link: `https://www.amazon.com/dp/${asin}`,
        };
      }
    } catch (e) {
      console.warn('RapidAPI fetch failed, falling back...');
    }
  }

  // 2. Rainforest API (if key exists)
  if (!productDetails && process.env.RAINFOREST_API_KEY) {
    try {
      console.log('⚡ Querying Rainforest API...');
      const res = await fetch(`https://api.rainforestapi.com/request?api_key=${process.env.RAINFOREST_API_KEY}&type=product&amazon_domain=amazon.com&asin=${asin}`);
      if (res.ok) {
        const json = await res.json();
        productDetails = {
          name: json.product?.title,
          image: json.product?.main_image?.link,
          link: `https://www.amazon.com/dp/${asin}`,
        };
      }
    } catch (e) {
      console.warn('Rainforest API fetch failed, falling back...');
    }
  }

  // 3. Fallback: Amazon Public HTML & OpenGraph
  if (!productDetails) {
    try {
      console.log(`🌐 Querying public Amazon metadata for https://www.amazon.com/dp/${asin}...`);
      const response = await fetch(`https://www.amazon.com/dp/${asin}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      const html = await response.text();

      const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i)?.[1]
        || html.match(/<span\s+id=["']productTitle["'][^>]*>([\s\S]*?)<\/span>/i)?.[1]?.trim();

      const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i)?.[1];

      if (ogTitle) {
        const cleanTitle = ogTitle
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s*:\s*Amazon\.com:.*$/i, '')
          .trim();

        productDetails = {
          name: cleanTitle,
          image: ogImage || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
          link: `https://www.amazon.com/dp/${asin}`,
        };
      }
    } catch (e) {
      console.warn('Public fetch failed:', e.message);
    }
  }

  // 4. Default fallback entry
  if (!productDetails) {
    productDetails = {
      name: `Amazon Product (${asin})`,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      link: `https://www.amazon.com/dp/${asin}`,
    };
  }

  console.log(`📦 [2/3] Product retrieved: "${productDetails.name}"`);

  // Check if ASIN already exists
  const existingIdx = products.findIndex((p) => p.link && p.link.includes(asin));
  if (existingIdx >= 0) {
    products[existingIdx] = productDetails;
    console.log(`🔄 Updated existing product in products.json at index ${existingIdx}`);
  } else {
    products.unshift(productDetails);
    console.log(`✨ Added new product to top of products.json`);
  }

  // Save clean array
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`🎉 [3/3] Successfully saved to: ${PRODUCTS_JSON_PATH}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
