"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, ArrowUpRight, X, ShoppingCart, Trash2, Check, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";
import { getPrimaryImage, getProductVariants } from "@/lib/api-products";

interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  brand: string;
  floral_source: string;
  weight: string;
  image: string;
  price: number;
  mrp: number;
  discount: number;
  addedAt: string;
  variantId?: string;
}

interface ApiProduct {
  _id?: string;
  product_name?: string;
  name?: string;
  title?: string;
  brand?: string;
  floral_source?: string;
}

interface ApiWishlistItem {
  _id?: string;
  productId?: ApiProduct;
  addedAt?: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const redirectToLogin = () => {
    router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
  };

  const updateWishlistCount = (count: number) => {
    window.dispatchEvent(new CustomEvent('wishlist-count-update', { 
      detail: { count } 
    }));
  };

  const navigateToProduct = (productId: string) => {
    if (!productId) return;
    router.push(`/shop/products/${productId}`);
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setApiError(null);

      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        redirectToLogin();
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch wishlist: ${res.status}`);
      }

      const data = await res.json();
      let products: ApiWishlistItem[] = [];
      if (data?.data?.products && Array.isArray(data.data.products)) {
        products = data.data.products;
      } else {
        setWishlistItems([]);
        setLoading(false);
        updateWishlistCount(0);
        return;
      }

      const formattedItems = products.reduce<WishlistItem[]>((acc, item) => {
        const product = item.productId;
        if (!product || typeof product !== 'object') return acc;

        const title = product?.product_name || product?.name || product?.title || '';
        if (!title.trim()) return acc;

        const variants = getProductVariants(product);
        const firstVariant = variants[0] || {};

        let weightStr = '';
        if (firstVariant.weight && firstVariant.unit) {
          weightStr = `${firstVariant.weight}${firstVariant.unit}`;
        } else if (firstVariant.weight) {
          weightStr = `${firstVariant.weight}`;
        }

        const brand = product?.brand || '';
        const floral = product?.floral_source || '';
        const image = getPrimaryImage(product) || '';
        const price = firstVariant.price ?? 0;
        const mrp = firstVariant.mrp ?? 0;
        const discount = firstVariant.discount_value ?? 0;

        acc.push({
          id: item._id || product?._id || '',
          productId: product?._id || '',
          variantId: firstVariant._id || variants[0]?._id || '',
          title: title.trim(),
          brand,
          floral_source: floral,
          weight: weightStr,
          image,
          price,
          mrp,
          discount,
          addedAt: item.addedAt || new Date().toISOString(),
        });
        return acc;
      }, []);

      setWishlistItems(formattedItems);
      updateWishlistCount(formattedItems.length);
      
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setApiError(error instanceof Error ? error.message : "Couldn't load wishlist items");
      showToast("Couldn't load wishlist items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId: string) => {
    const prevItems = wishlistItems;
    const newItems = wishlistItems.filter((item) => item.productId !== productId);
    setWishlistItems(newItems);
    updateWishlistCount(newItems.length);

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        setWishlistItems(prevItems);
        updateWishlistCount(prevItems.length);
        redirectToLogin();
        return;
      }

      if (res.status === 404) {
        showToast("Item already removed");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to remove item");
      }

      showToast("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
      showToast("Error removing item");
      setWishlistItems(prevItems);
      updateWishlistCount(prevItems.length);
    }
  };

  const clearAll = async () => {
    if (wishlistItems.length === 0) return;
    const prevItems = wishlistItems;

    try {
      const responses = await Promise.all(
        wishlistItems.map((item) =>
          fetch(`${API_BASE_URL}/api/wishlist/remove/${item.productId}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          })
        )
      );

      if (responses.some((r) => r.status === 401)) {
        redirectToLogin();
        return;
      }

      if (responses.some((r) => !r.ok && r.status !== 404)) {
        throw new Error("Some items failed to clear");
      }

      setWishlistItems([]);
      updateWishlistCount(0);
      showToast("Wishlist cleared");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      showToast("Failed to clear wishlist");
      setWishlistItems(prevItems);
      updateWishlistCount(prevItems.length);
      fetchWishlist();
    }
  };

  const moveToCart = async (productId: string, variantId: string, title: string) => {
    if (actionLoading) return;
    setActionLoading(productId);

    try {
      const cartRes = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          selectedWeight: variantId,
          quantity: 1,
        }),
      });

      if (cartRes.status === 401) {
        redirectToLogin();
        return;
      }

      if (!cartRes.ok) {
        const errorData = await cartRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to move item to cart");
      }

      const removeRes = await fetch(`${API_BASE_URL}/api/wishlist/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!removeRes.ok && removeRes.status !== 404) {
        throw new Error("Added to cart, but failed to remove from wishlist");
      }

      const newItems = wishlistItems.filter((item) => item.productId !== productId);
      setWishlistItems(newItems);
      updateWishlistCount(newItems.length);

      showToast(`${title || 'Item'} moved to cart`);
    } catch (error) {
      console.error("Error moving item to cart:", error);
      showToast(error instanceof Error ? error.message : "Couldn't move item to cart");
      fetchWishlist();
    } finally {
      setActionLoading(null);
    }
  };

  const shareWishlist = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Wishlist", url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Wishlist link copied!");
      }
    } catch {
      // user cancelled
    }
  };

  const referNow = async () => {
    const referralLink =
      (typeof window !== "undefined" ? window.location.origin : "") + "/refer?code=SHUDDH10";
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast("Referral link copied!");
    } catch {
      showToast("Couldn't copy link");
    }
  };

  return (
    <section className="bg-[#FFF8EF] min-h-[auto] py-6 sm:py-10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-[26px] sm:text-[34px] font-bold text-[#3C2015] flex items-center gap-2 sm:gap-3">
              My Wishlist <Heart size={26} className="text-red-400 fill-red-400 shrink-0" />
            </h1>
            <p className="text-[13px] sm:text-[15px] text-[#B59A78] mt-1">
              Save your favorite products and buy them anytime.
            </p>
          </div>
          <Image src="/wishlist.png" alt="" width={130} height={130} className="hidden sm:block object-contain" />
        </div>

        {/* Main Content Box */}
        <div className="bg-white border border-[#F0E2CC] rounded-2xl mt-6 sm:mt-8 p-4 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[14px] text-[#B59A78] mb-4">
            <span className="font-medium">{wishlistItems.length} Items</span>
            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
              <button onClick={shareWishlist} className="flex items-center gap-1.5 text-[#593102] hover:text-[#593102] transition-colors cursor-pointer">
                <ArrowUpRight size={15} /> Share Wishlist
              </button>
              <button onClick={clearAll} className="flex items-center gap-1.5 text-[#B59A78] hover:text-red-500 transition-colors cursor-pointer">
                <Trash2 size={15} /> Clear All
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="text-[#593102] animate-spin" />
              <p className="text-[15px] text-[#B59A78]">Loading your wishlist...</p>
            </div>
          ) : apiError ? (
            <div className="py-16 sm:py-20 text-center">
              <p className="text-[16px] text-red-500 mb-4">{apiError}</p>
              <button onClick={fetchWishlist} className="inline-block mt-4 text-[15px] font-semibold text-[#593102] hover:underline cursor-pointer">
                Try Again
              </button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="py-16 sm:py-20 text-center">
              <Heart size={40} className="mx-auto text-[#E7D8C2] mb-4" />
              <p className="text-[16px] text-[#B59A78]">Your wishlist is empty.</p>
              <Link href="/shop" className="inline-block mt-4 text-[15px] font-semibold text-[#593102] hover:underline">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F0E2CC]">
              {wishlistItems.map((item) => (
                <div key={item.id} className="py-4 sm:py-5">
                  
                  {/* MOBILE RESPONSIVE LAYOUT */}
                  <div className="block sm:hidden relative bg-white border border-[#F0E2CC] rounded-xl p-4 shadow-xs">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-3 right-3 text-[#B59A78] hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>

                    <div className="flex items-start gap-3.5">
                      {item.image && (
                        <div 
                          className="relative w-20 h-20 rounded-xl bg-[#FFF8EF] shrink-0 overflow-hidden cursor-pointer border border-[#F0E2CC]/40"
                          onClick={() => navigateToProduct(item.productId)}
                        >
                          <Image src={item.image} alt={item.title || "Product"} fill className="object-contain p-2" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 pr-6">
                        <h3 
                          onClick={() => navigateToProduct(item.productId)}
                          className="text-[16px] font-bold text-[#3C2015] leading-snug cursor-pointer line-clamp-1"
                        >
                          {item.title}
                        </h3>
                        {(item.brand || item.floral_source) && (
                          <p className="text-[13px] text-[#B59A78] mt-0.5 truncate">
                            {[item.brand, item.floral_source].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        {item.weight && (
                          <p className="text-[12px] text-[#B59A78] mt-0.5">{item.weight}</p>
                        )}
                        {item.discount > 0 && (
                          <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium">
                            {Math.round(item.discount)}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0E2CC]/60">
                      <div>
                        {item.price > 0 && (
                          <span className="text-[18px] font-bold text-[#3C2015]">₹{item.price}</span>
                        )}
                        {item.mrp > item.price && item.mrp > 0 && (
                          <span className="text-[12px] text-[#B59A78] line-through ml-2">₹{item.mrp}</span>
                        )}
                      </div>

                      <button
                        onClick={() => moveToCart(item.productId, item.variantId || '', item.title)}
                        disabled={actionLoading === item.productId}
                        className="flex items-center justify-center gap-1.5 bg-[#D49313] hover:bg-[#B37B1B] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {actionLoading === item.productId ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={15} />
                        )}
                        {actionLoading === item.productId ? "Moving..." : "Move to Cart"}
                      </button>
                    </div>
                  </div>

                  {/* DESKTOP VIEW LAYOUT (Exact original widescreen row) */}
                  <div className="hidden sm:flex sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 flex-1 cursor-pointer" onClick={() => navigateToProduct(item.productId)}>
                      {item.image && (
                        <div className="relative w-20 h-20 rounded-xl bg-[#FFF8EF] shrink-0 overflow-hidden">
                          <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-semibold text-[#3C2015] hover:text-[#D89B00] transition-colors truncate">
                          {item.title}
                        </p>
                        {(item.brand || item.floral_source) && (
                          <p className="text-[14px] text-[#B59A78]">
                            {[item.brand, item.floral_source].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        {item.weight && (
                          <p className="text-[13px] text-[#B59A78]">{item.weight}</p>
                        )}
                        {item.discount > 0 && (
                          <span className="inline-block mt-1 text-[11px] bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium">
                            {Math.round(item.discount)}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-6">
                      <div className="flex flex-col items-end">
                        {item.price > 0 && (
                          <span className="text-[19px] font-bold text-[#3C2015]">₹{item.price}</span>
                        )}
                        {item.mrp > item.price && item.mrp > 0 && (
                          <span className="text-[12px] text-[#B59A78] line-through">₹{item.mrp}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => moveToCart(item.productId, item.variantId || '', item.title)}
                          disabled={actionLoading === item.productId}
                          className="shrink-0 flex items-center justify-center gap-2 border border-[#593102] text-[#593102] text-[14px] font-semibold px-6 py-3 rounded-xl hover:bg-[#FFF8EF] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === item.productId ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <ShoppingCart size={16} />
                          )}
                          {actionLoading === item.productId ? "Moving..." : "Move to Cart"}
                        </button>

                        <button onClick={() => removeItem(item.productId)} className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-[#F0E2CC] text-[#B59A78] hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refer Box */}
        <div className="bg-gradient-to-r from-[#FFF2D8] to-[#FDECC8] border border-[#F0DAAE] rounded-2xl p-5 sm:p-7 mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Image src="/wishlist1.png" alt="Refer and earn" width={110} height={110} className="shrink-0 w-20 h-20 sm:w-[110px] sm:h-[110px] object-contain" />
            <div>
              <p className="text-[17px] sm:text-[19px] font-bold text-[#3C2015]">Refer &amp; Earn Rewards!</p>
              <p className="text-[13px] sm:text-[15px] text-[#593102] mt-1 sm:mt-1.5">
                Refer your friends and get <span className="text-[#593102] font-semibold">10% off</span> on their first order.
              </p>
              <button onClick={referNow} className="mt-3 sm:mt-4 bg-[#593102] hover:bg-[#C98715] text-white text-[14px] sm:text-[15px] font-semibold px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl transition-colors cursor-pointer w-full sm:w-auto">
                Refer Now
              </button>
            </div>
          </div>
          <Image src="/gift.png" alt="Gift" width={140} height={140} className="hidden lg:block shrink-0 object-contain" />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3C2015] text-white text-[13px] sm:text-[14px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-in fade-in duration-200 whitespace-nowrap">
          <Check size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </section>
  );
}