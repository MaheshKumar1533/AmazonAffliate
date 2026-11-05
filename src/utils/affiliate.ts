/**
 * Extracts the 10-character Amazon ASIN from a link or string.
 */
export function extractAsin(linkOrAsin: string): string | null {
  if (!linkOrAsin) return null;
  const trimmed = linkOrAsin.trim();

  // Direct ASIN (10 alphanumeric chars)
  if (/^[A-Z0-9]{10}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // From Amazon URL (/dp/ASIN or /gp/product/ASIN)
  const dpMatch = trimmed.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i);
  if (dpMatch) return dpMatch[1].toUpperCase();

  return null;
}

/**
 * Builds or updates an Amazon link to include the affiliate tracking tag.
 */
export function buildAffiliateUrl(
  urlOrAsin: string,
  affiliateTag: string = 'maheshkumarvm-21'
): string {
  if (!urlOrAsin) return '#';
  const trimmed = urlOrAsin.trim();

  // If raw ASIN
  if (/^[A-Z0-9]{10}$/i.test(trimmed)) {
    return `https://www.amazon.com/dp/${trimmed}?tag=${encodeURIComponent(affiliateTag)}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('amazon.')) {
      parsed.searchParams.set('tag', affiliateTag);
      return parsed.toString();
    }
    return trimmed;
  } catch {
    return `https://www.amazon.com/dp/${encodeURIComponent(trimmed)}?tag=${encodeURIComponent(affiliateTag)}`;
  }
}
