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

  // Function to update wishlist count in header
  const updateWishlistCount = (count: number) => {
    window.dispatchEvent(new CustomEvent('wishlist-count-update', { 
      detail: { count } 
    }));
  };

  // Function to navigate to product detail
  const navigateToProduct = (productId: string) => {
    router.push(`/shop/products/${productId}`);
  };

  // ---------------- 1. GET Wishlist API ----------------
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        redirectToLogin();
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch wishlist: ${res.status}`);
      }

      const data = await res.json();

      let products = [];
      if (data?.data?.products && Array.isArray(data.data.products)) {
        products = data.data.products;
      } else {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      const formattedItems = products.map((item: any) => {
        const product = item.productId;
        const variants = getProductVariants(product || {});
        const firstVariant = variants[0] || {};

        return {
          id: item._id || product?._id,
          productId: product?._id,
          variantId: firstVariant._id || variants[0]?._id,
          title: product?.product_name || "Honey Product",
          brand: product?.brand || "SudhVeda Honey",
          floral_source: product?.floral_source || "Multiflora",
          weight: `${firstVariant.weight || 250}${firstVariant.unit || 'g'}`,
          image: getPrimaryImage(product || {}),
          price: firstVariant.price || 799,
          mrp: firstVariant.mrp || 999,
          discount: firstVariant.discount_value || 0,
          addedAt: item.addedAt || new Date().toISOString(),
        };
      });

      setWishlistItems(formattedItems);
      
      // Update count in header
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- 2. DELETE Single Item API ----------------
  const removeItem = async (productId: string) => {
    const prevItems = wishlistItems;
    const newItems = wishlistItems.filter((item) => item.productId !== productId);
    setWishlistItems(newItems);

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        setWishlistItems(prevItems);
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

      // Update count in header
      updateWishlistCount(newItems.length);
      showToast("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
      showToast("Error removing item");
      setWishlistItems(prevItems);
    }
  };

  // ---------------- 3. Clear All Wishlist Items ----------------
  const clearAll = async () => {
    if (wishlistItems.length === 0) return;

    const prevItems = wishlistItems;

    try {
      const responses = await Promise.all(
        wishlistItems.map((item) =>
          fetch(`${API_BASE_URL}/api/wishlist/remove/${item.productId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
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
      // Update count in header - 0
      updateWishlistCount(0);
      showToast("Wishlist cleared");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      showToast("Failed to clear wishlist");
      setWishlistItems(prevItems);
      fetchWishlist();
    }
  };

  // Move to Cart
  const moveToCart = async (productId: string, variantId: string, title: string) => {
    if (actionLoading) return;
    setActionLoading(productId);

    try {
      const cartRes = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!removeRes.ok && removeRes.status !== 404) {
        throw new Error("Added to cart, but failed to remove from wishlist");
      }

      // Remove from wishlist and update count
      const newItems = wishlistItems.filter((item) => item.productId !== productId);
      setWishlistItems(newItems);
      updateWishlistCount(newItems.length);
      
      showToast(`${title} moved to cart`);
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
      // User cancelled
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
    <section className="bg-[#FFF8EF] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10">

        <div className="flex items-center gap-2 text-[14px] text-[#B59A78]"></div>

        {/* Header */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-[26px] sm:text-[34px] font-bold text-[#3C2015] flex items-center gap-2 sm:gap-3">
              My Wishlist <Heart size={26} className="text-red-400 fill-red-400 shrink-0" />
            </h1>
            <p className="text-[13px] sm:text-[15px] text-[#B59A78] mt-1">Save your favorite products and buy them anytime.</p>
          </div>
          <Image src="/wishlist.png" alt="" width={130} height={130} className="hidden sm:block" />
        </div>

        {/* Main Content Box */}
        <div className="bg-white border border-[#F0E2CC] rounded-2xl mt-6 sm:mt-8 p-4 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[14px] text-[#B59A78] mb-4">
            <span className="font-medium">{wishlistItems.length} Items in Your Wishlist</span>
            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
              <button
                onClick={shareWishlist}
                className="flex items-center gap-1.5 text-[#2D3A1B] hover:text-[#2D3A1B] transition-colors cursor-pointer"
              >
                <ArrowUpRight size={15} /> Share Wishlist
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-[#B59A78] hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 size={15} /> Clear All
              </button>
            </div>
          </div>

          {/* Loader State */}
          {loading ? (
            <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="text-[#2D3A1B] animate-spin" />
              <p className="text-[15px] text-[#B59A78]">Loading your wishlist...</p>
            </div>
          ) : apiError ? (
            <div className="py-16 sm:py-20 text-center">
              <p className="text-[16px] text-red-500 mb-4">{apiError}</p>
              <button
                onClick={fetchWishlist}
                className="inline-block mt-4 text-[15px] font-semibold text-[#2D3A1B] hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="py-16 sm:py-20 text-center">
              <Heart size={40} className="mx-auto text-[#E7D8C2] mb-4" />
              <p className="text-[16px] text-[#B59A78]">Your wishlist is empty.</p>
              <Link
                href="/shop"
                className="inline-block mt-4 text-[15px] font-semibold text-[#2D3A1B] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F0E2CC]">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 py-5">
                  {/* Product Info - Clickable */}
                  <div 
                    className="flex items-center gap-4 sm:gap-6 flex-1 cursor-pointer"
                    onClick={() => navigateToProduct(item.productId)}
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#FFF8EF] shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] sm:text-[17px] font-semibold text-[#3C2015] hover:text-[#D89B00] transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-[13px] sm:text-[14px] text-[#B59A78]">
                        {item.brand} • {item.floral_source}
                      </p>
                      <p className="text-[12px] sm:text-[13px] text-[#B59A78]">
                        {item.weight} • Raw & Unfiltered
                      </p>
                      {item.discount > 0 && (
                        <span className="inline-block mt-1 text-[10px] sm:text-[11px] bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium">
                          {Math.round(item.discount)}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0E2CC]/50 w-full sm:w-auto">
                    <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[17px] sm:text-[19px] font-bold text-[#3C2015]">₹{item.price}</span>
                      {item.mrp > item.price && (
                        <span className="text-[12px] text-[#B59A78] line-through">₹{item.mrp}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => moveToCart(item.productId, item.variantId || '', item.title)}
                        disabled={actionLoading === item.productId}
                        className="shrink-0 flex items-center justify-center gap-2 border border-[#2D3A1B] text-[#2D3A1B] text-[13px] sm:text-[14px] font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-[#FFF8EF] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === item.productId ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={16} />
                        )}
                        {actionLoading === item.productId ? "Moving..." : "Move to Cart"}
                      </button>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-[#F0E2CC] text-[#B59A78] hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                      >
                        <X size={18} />
                      </button>
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
            <Image
              src="/wishlist1.png"
              alt="Refer and earn"
              width={110}
              height={110}
              className="shrink-0 w-20 h-20 sm:w-[110px] sm:h-[110px]"
            />
            <div>
              <p className="text-[17px] sm:text-[19px] font-bold text-[#3C2015]">Refer &amp; Earn Rewards!</p>
              <p className="text-[13px] sm:text-[15px] text-[#2D3A1B] mt-1 sm:mt-1.5">
                Refer your friends and get <span className="text-[#2D3A1B] font-semibold">10% off</span> on their first order.
              </p>
              <button
                onClick={referNow}
                className="mt-3 sm:mt-4 bg-[#2D3A1B] hover:bg-[#C98715] text-white text-[14px] sm:text-[15px] font-semibold px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl transition-colors cursor-pointer w-full sm:w-auto"
              >
                Refer Now
              </button>
            </div>
          </div>

          <Image
            src="/gift.png"
            alt="Gift"
            width={140}
            height={140}
            className="hidden lg:block shrink-0"
          />
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3C2015] text-white text-[13px] sm:text-[14px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-in fade-in duration-200 whitespace-nowrap">
          <Check size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </section>
  );
}
