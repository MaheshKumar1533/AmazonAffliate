import { extractAsin } from './affiliate';

export interface AmazonProductInfo {
  asin: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
  prime?: boolean;
  inStock?: boolean;
}

/**
 * Fetches Amazon live details via RapidAPI or Rainforest API if an API key is configured.
 * Can also be expanded to call your own backend serverless function (e.g. /api/amazon?asin=...)
 */
export async function fetchAmazonProductDetails(
  asinOrLink: string,
  apiKey?: string
): Promise<AmazonProductInfo | null> {
  const asin = extractAsin(asinOrLink);
  if (!asin) return null;

  // If RapidAPI key is provided
  if (apiKey) {
    try {
      const response = await fetch(
        `https://real-time-amazon-data.p.rapidapi.com/product-details?asin=${asin}&country=US`,
        {
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        const p = json.data;
        return {
          asin,
          price: p.product_price || undefined,
          rating: parseFloat(p.product_star_rating) || undefined,
          reviewCount: p.product_num_ratings || undefined,
          prime: p.is_prime ?? true,
          inStock: true,
        };
      }
    } catch (e) {
      console.warn('RapidAPI fetch failed:', e);
    }
  }

  return null;
}
