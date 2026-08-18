"use client";

import { API_BASE_URL } from "./auth";

const GUEST_WISHLIST_KEY = "sudhveda_guest_wishlist";
export const WISHLIST_CHANGED_EVENT = "wishlist-count-update";

// ---------- Get Guest Wishlist Product IDs ----------
export function getGuestWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(GUEST_WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ---------- Save Guest Wishlist ----------
export function saveGuestWishlist(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids));
    window.dispatchEvent(
      new CustomEvent(WISHLIST_CHANGED_EVENT, { detail: { count: ids.length } })
    );
  } catch (err) {
    console.error("Error saving guest wishlist:", err);
  }
}

// ---------- Toggle Guest Wishlist Product ----------
export function toggleGuestWishlist(productId: string): { wishlistIds: string[]; isWishlisted: boolean } {
  const current = getGuestWishlist();
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
  saveGuestWishlist(updated);
  return { wishlistIds: updated, isWishlisted: !exists };
}

// ---------- Sync Guest Wishlist to Backend on Login ----------
export async function syncGuestWishlistOnLogin(): Promise<string[]> {
  if (typeof window === "undefined") return [];
  const guestIds = getGuestWishlist();
  if (guestIds.length === 0) return [];

  console.log("🔄 Syncing guest wishlist items to backend user account...", guestIds);

  for (const productId of guestIds) {
    try {
      await fetch(`${API_BASE_URL}/api/wishlist/add/${productId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(`Failed to sync wishlist item ${productId}:`, err);
    }
  }

  // Clear guest wishlist after syncing
  localStorage.removeItem(GUEST_WISHLIST_KEY);

  // Fetch updated wishlist from backend
  try {
    const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      const wishlistProducts = data?.data?.products || [];
      const ids = wishlistProducts
        .map((item: any) =>
          item.productId && typeof item.productId === "object"
            ? item.productId._id
            : item.productId || item._id
        )
        .filter(Boolean)
        .map(String);

      window.dispatchEvent(
        new CustomEvent(WISHLIST_CHANGED_EVENT, { detail: { count: ids.length } })
      );
      return ids;
    }
  } catch (err) {
    console.error("Error fetching synced wishlist:", err);
  }

  return [];
}
