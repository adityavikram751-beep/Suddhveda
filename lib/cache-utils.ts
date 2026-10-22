/**
 * High-performance Cache & Image Optimization Utilities
 * Drastically speeds up page transitions, API response times, and image loading.
 */

// In-memory cache for instant client-side retrieval
const memoryCache = new Map<string, { data: any; expiry: number }>();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Optimizes Cloudinary URLs by inserting auto-format, auto-quality, and max width.
 * Reduces raw image sizes by 80-95% (e.g. from 2.5MB PNG down to 50KB WebP/AVIF).
 */
export function optimizeCloudinaryUrl(
  url?: string | null,
  width: number = 1200
): string {
  if (!url || typeof url !== "string") return "/placeholder.png";
  const trimmed = url.trim();
  if (!trimmed) return "/placeholder.png";
  if (!trimmed.startsWith("http")) return trimmed;
  if (!trimmed.includes("cloudinary.com") || !trimmed.includes("/image/upload/")) {
    return trimmed;
  }

  const uploadMarker = "/image/upload/";
  const uploadIndex = trimmed.indexOf(uploadMarker);
  if (uploadIndex === -1) return trimmed;

  const prefix = trimmed.slice(0, uploadIndex + uploadMarker.length);
  const remaining = trimmed.slice(uploadIndex + uploadMarker.length);
  const parts = remaining.split("/");

  // Strip any old transformation segments (e.g. "f_auto,q_auto", "w_500", "f_auto,q_auto:best,w_600,c_limit", etc.)
  // We preserve the version segment (e.g. "v1790763601") and the folder/file path
  while (parts.length > 0) {
    const first = parts[0];
    if (
      first &&
      !first.includes(".") &&
      !/^v\d+$/.test(first) &&
      (first.includes("f_auto") ||
        first.includes("q_auto") ||
        /^(?:[a-z]{1,3}_[a-zA-Z0-9.:_-]+(?:,|$))+$/i.test(first))
    ) {
      parts.shift();
    } else {
      break;
    }
  }

  // Use q_auto:best and c_limit for crystal-clear labels, vibrant honey tones, and zero blurriness
  const transform = width
    ? `f_auto,q_auto:best,w_${width},c_limit`
    : "f_auto,q_auto:best";

  return `${prefix}${transform}/${parts.join("/")}`;
}

/**
 * Retrieves cached data synchronously from memory or sessionStorage.
 */
export function getCachedData<T>(key: string): T | null {
  const now = Date.now();

  // 1. Check in-memory cache
  const mem = memoryCache.get(key);
  if (mem && mem.expiry > now) {
    return mem.data as T;
  }

  // 2. Check sessionStorage
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(`sv_cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expiry > now) {
          memoryCache.set(key, parsed);
          return parsed.data as T;
        }
        sessionStorage.removeItem(`sv_cache_${key}`);
      }
    } catch {
      // Ignore storage errors
    }
  }

  return null;
}

/**
 * Stores data in memory and sessionStorage.
 */
export function setCachedData<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL): void {
  const expiry = Date.now() + ttlMs;
  const payload = { data, expiry };

  memoryCache.set(key, payload);

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`sv_cache_${key}`, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }
}

/**
 * Stale-While-Revalidate fetch pattern:
 * Returns cached data immediately if available, then updates in background.
 */
export async function swrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  onData: (data: T, isFromCache: boolean) => void,
  ttlMs: number = DEFAULT_TTL
): Promise<T> {
  const cached = getCachedData<T>(key);
  if (cached) {
    onData(cached, true);
  }

  try {
    const fresh = await fetcher();
    if (fresh) {
      setCachedData(key, fresh, ttlMs);
      onData(fresh, false);
    }
    return fresh;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

/**
 * Preloads an image into the browser cache for instant rendering without layout flicker.
 */
export function preloadImage(src: string): void {
  if (typeof window === "undefined" || !src) return;
  try {
    const img = new window.Image();
    img.src = src;
  } catch {
    // Ignore error
  }
}

/**
 * Preloads a list of images in the background.
 */
export function preloadImages(urls: (string | null | undefined)[]): void {
  if (typeof window === "undefined" || !Array.isArray(urls)) return;
  // Delay slightly to prevent blocking initial thread
  setTimeout(() => {
    urls.filter(Boolean).forEach((url) => {
      if (url) preloadImage(url);
    });
  }, 100);
}
