"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, ArrowUpRight, X, ShoppingCart, Trash2, Check, Loader2, Sparkles } from "lucide-react";
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
    try {
      setApiError(null);
      const res = await fetch(`${API_BASE_URL}/api/wishlist/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        redirectToLogin();
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to remove item from wishlist");
      }

      const newItems = wishlistItems.filter((item) => item.productId !== productId);
      setWishlistItems(newItems);
      updateWishlistCount(newItems.length);
      showToast("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
      showToast(error instanceof Error ? error.message : "Couldn't remove item");
      fetchWishlist();
    }
  };

  const clearAll = async () => {
    if (wishlistItems.length === 0) return;
    try {
      setApiError(null);
      const res = await fetch(`${API_BASE_URL}/api/wishlist/clear`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        redirectToLogin();
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to clear wishlist");
      }

      setWishlistItems([]);
      updateWishlistCount(0);
      showToast("Wishlist cleared");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      showToast(error instanceof Error ? error.message : "Couldn't clear wishlist");
      fetchWishlist();
    }
  };

  const moveToCart = async (productId: string, variantId: string, title?: string) => {
    try {
      setActionLoading(productId);
      setApiError(null);

      const cartPayload: { productId: string; quantity: number; variantId?: string } = {
        productId,
        quantity: 1,
      };
      if (variantId) {
        cartPayload.variantId = variantId;
      }

      const cartRes = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartPayload),
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
    <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] min-h-screen py-8 sm:py-12 border-b border-[#EADCC9]/50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2">
              <Sparkles size={13} className="text-[#D49313]" />
              <span>SAVED FAVORITES</span>
            </div>
            <h1 className="text-[28px] sm:text-[38px] font-serif font-extrabold text-[#593102] flex items-center gap-2.5 sm:gap-3">
              My Wishlist{" "}
              <Heart size={28} className="text-[#D49313] fill-[#D49313] shrink-0" />
            </h1>
            <p className="text-[14px] sm:text-[16px] text-[#6E5D4F] font-medium mt-1">
              Save your favorite artisanal honey &amp; gift sets to purchase anytime.
            </p>
          </div>
          <Image src="/wishlist.png" alt="Wishlist jar" width={130} height={130} className="hidden sm:block object-contain" />
        </div>

        {/* Main Content Box */}
        <div className="bg-white/90 backdrop-blur-sm border-2 border-[#EADCC9]/80 rounded-3xl mt-6 sm:mt-8 p-5 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[14px] text-[#6E5D4F] pb-4 border-b border-[#EADCC9]/60">
            <span className="font-bold text-[#593102]">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved</span>
            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
              <button onClick={shareWishlist} className="flex items-center gap-1.5 text-[#593102] font-bold hover:text-[#D49313] transition-colors cursor-pointer">
                <ArrowUpRight size={15} /> Share Wishlist
              </button>
              <button onClick={clearAll} className="flex items-center gap-1.5 text-[#8D7F73] font-semibold hover:text-red-500 transition-colors cursor-pointer">
                <Trash2 size={15} /> Clear All
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="text-[#D49313] animate-spin" />
              <p className="text-[15px] font-medium text-[#6E5D4F]">Loading your wishlist...</p>
            </div>
          ) : apiError ? (
            <div className="py-16 sm:py-20 text-center">
              <p className="text-[16px] font-medium text-red-500 mb-4">{apiError}</p>
              <button onClick={fetchWishlist} className="inline-block mt-4 text-[15px] font-bold text-[#593102] hover:underline cursor-pointer">
                Try Again
              </button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="py-16 sm:py-20 text-center">
              <Heart size={44} className="mx-auto text-[#D49313]/40 mb-4" />
              <p className="text-[17px] font-serif font-bold text-[#593102]">Your wishlist is currently empty.</p>
              <p className="text-[14px] text-[#6E5D4F] mt-1 font-medium">Explore our collection to add your favorite pure honey products.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 mt-5 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white font-bold text-[14px] px-7 py-3 rounded-2xl tracking-wider uppercase shadow-md transition-all duration-300">
                Explore Shop
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#EADCC9]/60">
              {wishlistItems.map((item) => (
                <div key={item.id} className="py-4 sm:py-6">
                  
                  {/* MOBILE RESPONSIVE LAYOUT */}
                  <div className="block sm:hidden relative bg-white border border-[#EADCC9] rounded-2xl p-4 shadow-xs">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-3 right-3 text-[#8D7F73] hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>

                    <div className="flex items-start gap-3.5">
                      {item.image && (
                        <div 
                          className="relative w-20 h-20 rounded-xl bg-[#FAF5EC] shrink-0 overflow-hidden cursor-pointer border border-[#EADCC9]/50"
                          onClick={() => navigateToProduct(item.productId)}
                        >
                          <Image src={item.image} alt={item.title || "Product"} fill className="object-contain p-2" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 pr-6">
                        <h3 
                          onClick={() => navigateToProduct(item.productId)}
                          className="font-serif text-[16px] font-bold text-[#593102] leading-snug cursor-pointer line-clamp-1"
                        >
                          {item.title}
                        </h3>
                        {(item.brand || item.floral_source) && (
                          <p className="text-[13px] text-[#6E5D4F] font-medium mt-0.5 truncate">
                            {[item.brand, item.floral_source].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        {item.weight && (
                          <p className="text-[12px] text-[#8D7F73] font-medium mt-0.5">{item.weight}</p>
                        )}
                        {item.discount > 0 && (
                          <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                            {Math.round(item.discount)}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EADCC9]/60">
                      <div>
                        {item.price > 0 && (
                          <span className="text-[18px] font-bold text-[#593102]">₹{item.price}</span>
                        )}
                        {item.mrp > item.price && item.mrp > 0 && (
                          <span className="text-[12px] text-[#8D7F73] line-through ml-2">₹{item.mrp}</span>
                        )}
                      </div>

                      <button
                        onClick={() => moveToCart(item.productId, item.variantId || '', item.title)}
                        disabled={actionLoading === item.productId}
                        className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-xs disabled:opacity-50 cursor-pointer uppercase tracking-wider"
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

                  {/* DESKTOP VIEW LAYOUT */}
                  <div className="hidden sm:flex sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 flex-1 cursor-pointer" onClick={() => navigateToProduct(item.productId)}>
                      {item.image && (
                        <div className="relative w-20 h-20 rounded-xl bg-[#FAF5EC] shrink-0 overflow-hidden border border-[#EADCC9]/50">
                          <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-[17px] font-bold text-[#593102] hover:text-[#D49313] transition-colors truncate">
                          {item.title}
                        </p>
                        {(item.brand || item.floral_source) && (
                          <p className="text-[14px] text-[#6E5D4F] font-medium">
                            {[item.brand, item.floral_source].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        {item.weight && (
                          <p className="text-[13px] text-[#8D7F73] font-medium">{item.weight}</p>
                        )}
                        {item.discount > 0 && (
                          <span className="inline-block mt-1 text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                            {Math.round(item.discount)}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-6">
                      <div className="flex flex-col items-end">
                        {item.price > 0 && (
                          <span className="text-[20px] font-bold text-[#593102]">₹{item.price}</span>
                        )}
                        {item.mrp > item.price && item.mrp > 0 && (
                          <span className="text-[12px] text-[#8D7F73] line-through">₹{item.mrp}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => moveToCart(item.productId, item.variantId || '', item.title)}
                          disabled={actionLoading === item.productId}
                          className="shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white text-[13.5px] font-bold px-6 py-3 rounded-2xl transition-all duration-300 shadow-md border border-[#FFD700]/30 cursor-pointer uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === item.productId ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <ShoppingCart size={16} />
                          )}
                          {actionLoading === item.productId ? "Moving..." : "Move to Cart"}
                        </button>

                        <button onClick={() => removeItem(item.productId)} className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-[#EADCC9] text-[#8D7F73] hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer bg-white">
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
        <div className="bg-gradient-to-r from-[#FAF0DC] via-[#FEF8F4] to-[#FAF5EC] border-2 border-[#D49313]/30 rounded-3xl p-6 sm:p-8 mt-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto relative z-10">
            <Image src="/wishlist1.png" alt="Refer and earn" width={110} height={110} className="shrink-0 w-20 h-20 sm:w-[110px] sm:h-[110px] object-contain" />
            <div>
              <p className="font-serif text-[18px] sm:text-[20px] font-extrabold text-[#593102]">Refer &amp; Earn Exclusive Rewards! ✨</p>
              <p className="text-[13.5px] sm:text-[15px] text-[#6E5D4F] font-medium mt-1 sm:mt-1.5">
                Refer your friends and get <span className="text-[#D49313] font-extrabold">10% OFF</span> on their first order.
              </p>
              <button onClick={referNow} className="mt-3 sm:mt-4 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white text-[13.5px] sm:text-[14.5px] font-bold px-7 py-3 rounded-xl transition-all duration-300 shadow-md cursor-pointer w-full sm:w-auto uppercase tracking-wider">
                Refer Now
              </button>
            </div>
          </div>
          <Image src="/gift.png" alt="Gift" width={140} height={140} className="hidden lg:block shrink-0 object-contain relative z-10" />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#593102] text-white text-[13px] sm:text-[14px] font-bold px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 border border-[#FFD700]/30 whitespace-nowrap">
          <Check size={16} className="text-[#FFD700]" />
          {toast}
        </div>
      )}
    </section>
  );
}