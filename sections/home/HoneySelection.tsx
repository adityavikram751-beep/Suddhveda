"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL, getStoredSession, getStoredToken } from "@/lib/auth";
import { getCachedData, setCachedData, preloadImages, optimizeCloudinaryUrl } from "@/lib/cache-utils";
import {
  type ApiProduct,
  getProductId,
  getProductName,
  getProductVariants,
  getProductImages,
  getProductsFromResponse,
  getVariantId,
  normalizeProduct,
  isVariantOutOfStock,
} from "@/lib/api-products";

// ---------- Main Component ----------
export default function HoneySelection() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<ApiProduct[]>(() => {
    return getCachedData<ApiProduct[]>("all_products") || [];
  });
  const [comboProducts, setComboProducts] = useState<any[]>(() => {
    return getCachedData<any[]>("combo_products_2_3_4") || [];
  });
  const [loading, setLoading] = useState(() => {
    const cached = getCachedData<ApiProduct[]>("all_products");
    return !cached || cached.length === 0;
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Desktop Slider Ref & Hover State for Auto-scroll
  const desktopSliderRef = useRef<HTMLDivElement>(null);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Auto-scroll on Desktop (Every 2.5s, smooth scroll, pauses on hover)
  useEffect(() => {
    if (isSliderHovered) return;

    const interval = setInterval(() => {
      if (typeof window === "undefined" || window.innerWidth < 1024) return;
      if (desktopSliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = desktopSliderRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (maxScroll <= 5) return;

        // On desktop, 4 cards are shown. Step is 1 card width + gap
        const step = (clientWidth + 28) / 4;

        if (scrollLeft + step >= maxScroll - 15) {
          desktopSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          desktopSliderRef.current.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [products, comboProducts, isSliderHovered]);



  // ---------- Fetch Wishlist ----------
  const fetchWishlist = async (broadcast = true) => {
    try {
      const { getGuestWishlist } = await import("@/lib/wishlist");
      const guestIds = getGuestWishlist();
      let backendIds: string[] = [];

      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const wishlistProducts = data?.data?.products || data?.products || [];
        backendIds = wishlistProducts
          .map((item: any) => {
            if (item.productId && typeof item.productId === "object") {
              return String(item.productId._id || item.productId.id || "");
            }
            if (typeof item.productId === "string") {
              return item.productId;
            }
            return String(item._id || item.id || "");
          })
          .filter(Boolean);
      }

      const combined = Array.from(new Set([...backendIds, ...guestIds]));
      setWishlistIds(combined);
      if (broadcast) {
        window.dispatchEvent(
          new CustomEvent("wishlist-count-update", { detail: { count: combined.length, source: "HoneySelection" } })
        );
      }
    } catch (err) {
      try {
        const { getGuestWishlist } = await import("@/lib/wishlist");
        setWishlistIds(getGuestWishlist());
      } catch { }
    }
  };

  // ---------- Fetch Products ----------
  const fetchProducts = async () => {
    try {
      if (products.length === 0) {
        setLoading(true);
      }
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const result = await res.json();
      const productList = getProductsFromResponse(result);
      setProducts(productList);
      setCachedData("all_products", productList);
      preloadImages(
        productList
          .map((p) => {
            const doc = getProductImages(p);
            return doc?.[0]?.image_url;
          })
          .filter(Boolean)
      );
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch Curated Combos (2, 3, 4 jars) ----------
  const fetchComboProducts = async () => {
    try {
      let res = await fetch(`${API_BASE_URL}/api/combo/products/combo-products/2-3-4`, {
        credentials: "include",
      });
      const isSpecificEndpoint = res.ok;
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/combo/products/all/combo-products`, {
          credentials: "include",
        });
      }
      if (res.ok) {
        const json = await res.json();
        const rawData: any[] = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.comboProducts)
          ? json.comboProducts
          : Array.isArray(json?.products)
          ? json.products
          : Array.isArray(json)
          ? json
          : [];
        const active = rawData.filter(
          (item: any) => item.is_active !== false && item.isActive !== false
        );

        let finalCombos: any[] = [];
        if (isSpecificEndpoint && active.length > 0) {
          finalCombos = active.sort(
            (a: any, b: any) =>
              (Number(a.combo_size) || 0) - (Number(b.combo_size) || 0)
          );
        } else {
          const combo2 =
            active.find((c: any) => Number(c.combo_size) === 2 && c.slug?.includes("golden")) ||
            active.find((c: any) => Number(c.combo_size) === 2);
          const combo3 =
            active.find((c: any) => Number(c.combo_size) === 3 && c.slug?.includes("golden")) ||
            active.find((c: any) => Number(c.combo_size) === 3);
          const combo4 =
            active.find((c: any) => Number(c.combo_size) === 4 && (c.slug?.includes("signature") || c.slug?.includes("explorer"))) ||
            active.find((c: any) => Number(c.combo_size) === 4);

          finalCombos = [combo2, combo3, combo4].filter(Boolean);
        }

        setComboProducts(finalCombos);
        setCachedData("combo_products_2_3_4", finalCombos);

        const comboImgs = finalCombos.map((c) => {
          const raw = c.images?.find((img: any) => img.is_primary)?.url || c.images?.[0]?.url || c.image || c.image_url;
          return optimizeCloudinaryUrl(raw, 1000);
        });
        preloadImages(comboImgs);
      }
    } catch (err) {
      console.error("Error fetching combo products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchComboProducts();
    fetchWishlist(true);

    const handleWishlistChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.source === "HoneySelection") return;
      fetchWishlist(false);
    };

    window.addEventListener("wishlist-count-update", handleWishlistChange);
    return () => {
      window.removeEventListener("wishlist-count-update", handleWishlistChange);
    };
  }, []);

  // ---------- Variant Selection ----------
  const handleVariantSelect = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantId,
    }));
  };

  const getSelectedVariantId = (product: ApiProduct) => {
    const productId = getProductId(product);
    const variants = getProductVariants(product);
    const inStockVariant = variants.find((v) => !isVariantOutOfStock(v));
    return selectedVariants[productId] || getVariantId(inStockVariant || variants[0]);
  };


  // ---------- Add to Cart (Guest & Logged-In) ----------
  const handleAddToCart = async (product: ApiProduct) => {
    const productId = getProductId(product);
    const variantId = getSelectedVariantId(product);
    if (!variantId) return;

    const variants = getProductVariants(product);
    const selectedVariant = variants.find((v) => getVariantId(v) === variantId) || variants[0];
    const weightLabel = selectedVariant ? `${selectedVariant.weight}${selectedVariant.unit || "g"}` : "";
    const price = selectedVariant?.price || product.price || 0;
    const image = product.image?.image_url || product.image?.url || "/placeholder.png";

    try {
      setActionLoading(productId);
      await addToCart(productId, variantId, {
        type: "NORMAL",
        productId,
        variantId,
        productName: getProductName(product),
        image,
        price,
        weight: weightLabel,
      });
    } catch (err) {
      console.error("Error in Add to Cart:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ---------- Buy Now (Adds to cart & redirects to login if guest, else /cart) ----------
  const handleBuyNow = async (product: ApiProduct) => {
    const token = getStoredToken();
    const session = getStoredSession();
    if (!token || !session || !session.user?.mobile) {
      router.push("/login");
      return;
    }

    const productId = getProductId(product);
    const variantId = getSelectedVariantId(product);
    if (!variantId) return;

    const variants = getProductVariants(product);
    const selectedVariant = variants.find((v) => getVariantId(v) === variantId) || variants[0];
    const weightLabel = selectedVariant ? `${selectedVariant.weight}${selectedVariant.unit || "g"}` : "";
    const price = selectedVariant?.price || product.price || 0;
    const image = product.image?.image_url || product.image?.url || "/placeholder.png";

    try {
      setActionLoading(productId);
      await addToCart(productId, variantId, {
        type: "NORMAL",
        productId,
        variantId,
        productName: getProductName(product),
        image,
        price,
        weight: weightLabel,
      });

      router.push("/cart");
    } catch (err) {
      console.error("Error in Buy Now:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ---------- Wishlist Toggle (Guest & Logged-In) ----------
  const handleToggleWishlist = async (productId: string) => {
    const isWishlisted = wishlistIds.includes(productId);
    const nextIds = isWishlisted
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    setWishlistIds(nextIds);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/wishlist/${isWishlisted ? "remove" : "add"}/${productId}`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 401) {
        const { toggleGuestWishlist } = await import("@/lib/wishlist");
        const res = toggleGuestWishlist(productId);
        setWishlistIds(res.wishlistIds);
        return;
      }

      window.dispatchEvent(
        new CustomEvent("wishlist-count-update", { detail: { count: nextIds.length } })
      );
    } catch (err) {
      const { toggleGuestWishlist } = await import("@/lib/wishlist");
      const res = toggleGuestWishlist(productId);
      setWishlistIds(res.wishlistIds);
    }
  };

  const dummyHandler = () => { };

  // ---------- Render ----------
  return (
    <section className="relative bg-gradient-to-b from-[#FDF9F3] via-[#FAF6F0] to-[#FDF9F3] overflow-hidden py-14 border-b border-[#EADCC9]/50">
      {/* Ambient Gold Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#D49313]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-[34px] sm:text-[44px] md:text-[54px] font-serif font-bold text-[#593102] leading-tight tracking-tight">
            Nature&apos;s Finest Honey Selection
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto my-3.5 rounded-full" />

          <p className="mt-2 text-[#7A6A5C] text-[15px] sm:text-[17px] leading-relaxed font-medium px-4">
            Ethically harvested from wildflower meadows and wild forests, experience raw organic honey in its purest, most authentic royal form.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#B09077] text-lg font-medium">
            Loading products...
          </div>
        ) : (
          <div className="relative">
            <div
              ref={desktopSliderRef}
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
              onTouchStart={() => setIsSliderHovered(true)}
              onTouchEnd={() => setIsSliderHovered(false)}
              className="grid grid-cols-2 gap-3 sm:gap-5 lg:flex lg:overflow-x-auto lg:snap-x lg:snap-mandatory lg:gap-7 mt-5 sm:mt-6 pt-3 sm:pt-4 pb-5 sm:pb-6 scroll-smooth lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none]"
            >
              {products.map((product, idx) => {
                const productId = getProductId(product);
                const variants = getProductVariants(product);
                const selectedVariantId = getSelectedVariantId(product);
                const normalized = normalizeProduct(product, selectedVariantId);

                const cardBadge = (product as any).product_name
                  ? (product as any).product_name.toUpperCase()
                  : normalized.title
                    ? `${normalized.title.toUpperCase()}`
                    : "RAW HONEY";

                return (
                  <div
                    key={productId}
                    className="w-full flex flex-col items-center h-full lg:w-[calc(25%-21px)] lg:shrink-0 lg:snap-start"
                  >
                    <ProductCardShop
                      compactOnMobile
                      image={normalized.image}
                      title={normalized.title}
                      subtitle={normalized.subtitle}
                      category={normalized.category}
                      tasteProfile={normalized.tasteProfile}
                      shortDescription={normalized.shortDescription}
                      weight={normalized.weight}
                      price={normalized.price}
                      oldPrice={normalized.oldPrice}
                      rating={normalized.rating}
                      reviews={normalized.reviews}
                      quantity={0}
                      variants={variants}
                      selectedVariantId={selectedVariantId}
                      onVariantSelect={(variantId: string) =>
                        handleVariantSelect(productId, variantId)
                      }
                      onAddToCart={() => handleAddToCart(product)}
                      onBuyNow={() => handleBuyNow(product)}
                      onIncrement={dummyHandler}
                      onDecrement={dummyHandler}
                      onToggleWishlist={() => handleToggleWishlist(productId)}
                      isWishlisted={wishlistIds.includes(productId)}
                      onOpenDetails={() => router.push(`/shop/products/${productId}`)}
                    />
                  </div>
                );
              })}

              {/* Curated Honey Combos (2, 3, 4 jars) displayed directly in the product cards grid */}
              {comboProducts.map((combo) => {
                const comboId = combo._id || combo.id;
                const primaryImg = optimizeCloudinaryUrl(
                  combo.images?.find((img: any) => img.is_primary)?.url ||
                  combo.images?.[0]?.url ||
                  combo.image ||
                  combo.image_url ||
                  "/homegift.webp",
                  1000
                );
                const jarCount = Number(
                  combo.combo_size ||
                  (Array.isArray(combo.products) ? combo.products.length : 0)
                );
                const fallbackTitle =
                  jarCount === 2
                    ? "Duo Sets"
                    : jarCount === 3
                    ? "Trio Sets"
                    : jarCount === 4
                    ? "Quad Sets"
                    : "Gift Set";
                const title = combo.combo_name || combo.name || fallbackTitle;
                const fallbackDesc =
                  jarCount === 2
                    ? "Two premium varieties, crafted for meaningful impressions."
                    : jarCount === 3
                    ? "Three premium varieties, crafted for meaningful impressions."
                    : "Four premium varieties, crafted for meaningful impressions.";
                const description = combo.description || fallbackDesc;
                const subText =
                  combo.occasions ||
                  combo.occasion ||
                  combo.tagline ||
                  combo.subtitle ||
                  (Array.isArray(combo.products) && combo.products.length > 0
                    ? combo.products.map((p: any) => p.name?.replace(/ Honey$/i, "")).join(" / ")
                    : "Festivals / Celebration / Just because");

                const targetUrl =
                  jarCount === 2
                    ? "/giftsets?size=2#curatedgift"
                    : jarCount === 3
                    ? "/giftsets?size=3#curatedgift"
                    : jarCount === 4
                    ? "/giftsets?size=4#curatedgift"
                    : "/giftsets#curatedgift";

                return (
                  <div
                    key={comboId}
                    className="w-full flex flex-col items-center h-full lg:w-[calc(25%-21px)] lg:shrink-0 lg:snap-start"
                  >
                    <div
                      onClick={() => router.push(targetUrl)}
                      className="relative flex h-full min-h-[295px] sm:min-h-[470px] p-2 sm:p-2.5 pb-2.5 sm:pb-3.5 rounded-[18px] sm:rounded-[22px] w-full max-w-[280px] sm:max-w-[300px] flex-col justify-between overflow-hidden border border-[#EADCC9] bg-[#FAF5EE] shadow-xs transition-all duration-300 group cursor-pointer hover:-translate-y-1.5 hover:shadow-md hover:border-[#D49313]/40 mx-auto"
                    >
                      <div>
                        {/* Image - Maximized for prominence with scale-110 */}
                        <div className="relative w-full aspect-square rounded-[14px] sm:rounded-[18px] overflow-hidden bg-white shadow-2xs shrink-0">
                          <Image
                            src={primaryImg}
                            alt={title}
                            fill
                            sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 300px"
                            className="object-cover object-center scale-110 group-hover:scale-115 transition-transform duration-500"
                          />
                        </div>

                        <div className="px-1 sm:px-1.5 pt-0.5">
                          {/* Title */}
                          <h4 className="font-serif text-[13px] sm:text-[18px] font-bold text-[#593102] mt-2 sm:mt-2.5 leading-snug line-clamp-1 sm:line-clamp-2 group-hover:text-[#7A450A] transition-colors">
                            {title}
                          </h4>

                          {/* Description */}
                          <p className="text-[11px] sm:text-[12.5px] text-[#5E6D7E] leading-relaxed line-clamp-2 mt-1 font-normal">
                            {description}
                          </p>

                          {/* Occasion / Sub-tagline */}
                          <p className="font-serif text-[10px] sm:text-[12px] text-[#8C5823] mt-1 line-clamp-1">
                            {subText}
                          </p>
                        </div>
                      </div>

                      <div className="px-0.5 sm:px-1.5">
                        {/* Divider */}
                        <div className="border-t border-[#E8DCC9] my-1.5 sm:my-2.5" />

                        {/* Bottom Bar: Single botelgiftc.svg icon + Explore Gift button */}
                        <div className="flex flex-wrap items-center justify-between gap-x-1 sm:gap-x-1.5 gap-y-1.5 pt-0.5">
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[#2F241C] shrink-0">
                            <Image
                              src="/botelgiftc.svg"
                              alt="Jar"
                              width={16}
                              height={16}
                              className="w-3.5 h-3.5 sm:w-5 sm:h-5 object-contain shrink-0"
                            />
                            <span className="text-[10px] min-[370px]:text-[11px] sm:text-[13.5px] font-bold text-[#2F241C] whitespace-nowrap">
                              {jarCount > 0 ? `${jarCount} Jars` : "Gift Set"}
                            </span>
                          </div>

                          <Link
                            href={targetUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center gap-0.5 sm:gap-1 rounded-full bg-[#5D3716] hover:bg-[#784318] text-white px-2 min-[360px]:px-2.5 min-[390px]:px-3 sm:px-4 py-1 sm:py-1.5 text-[9.5px] min-[370px]:text-[10.5px] sm:text-[12.5px] font-medium shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ml-auto"
                          >
                            <span>Explore Gift</span>
                            <ArrowRight size={10} className="shrink-0 sm:w-3.5 sm:h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
