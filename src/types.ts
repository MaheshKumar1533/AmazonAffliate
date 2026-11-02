export interface Product {
  id: string;
  name: string;
  image: string;
  link: string;
  asin?: string;
  // Optional enriched info if fetched from Amazon API
  price?: string;
  rating?: number;
  reviewCount?: number;
  prime?: boolean;
}

export interface RawProductInput {
  name?: string;
  title?: string;
  image: string;
  link?: string;
  url?: string;
  asin?: string;
  price?: string;
  rating?: number;
}

export type ViewMode = 'grid' | 'list';
