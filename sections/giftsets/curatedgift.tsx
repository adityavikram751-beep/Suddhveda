"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";
import {
  type ApiProduct,
  getCategoryName,
  getPrimaryImage,
  getProductId,
  getProductName,
  getProductVariants,
  getProductsFromResponse,
  getVariantId,
  getVariantLabel,
  normalizeProduct,
} from "@/lib/api-products";

export default function FeaturedCollection() {
  const router = useRouter();
  const { updateQuantity } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => container.removeEventListener("scroll", checkScroll);
  }, [products.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/products`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const list = getProductsFromResponse(await res.json());
        setProducts(list.slice(0, 8));
        setTimeout(checkScroll, 0);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        const ids = (data?.data?.products || [])
          .map((item: any) =>
            item?.productId && typeof item.productId === "object"
              ? item.productId._id
              : item?.productId || item?._id
          )
          .filter(Boolean)
          .map(String);
        setWishlistIds(ids);
        window.dispatchEvent(new CustomEvent("wishlist-count-update", { detail: { count: ids.length } }));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -container.clientWidth * 0.8 : container.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setStartX(event.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = "grabbing";
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    event.preventDefault();
    const x = event.pageX - container.offsetLeft;
    container.scrollLeft = scrollLeft - (x - startX) * 1.5;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) container.style.cursor = "grab";
  };

  const getSelectedVariantId = (product: ApiProduct) => {
    const productId = getProductId(product);
    const variants = getProductVariants(product);
    return selectedVariants[productId] || getVariantId(variants[0]);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // ---------- ADD TO CART (no toast) ----------
  const handleAddToCart = async (product: ApiProduct) => {
    const productId = getProductId(product);
    const selectedVariantId = getSelectedVariantId(product);
    if (!selectedVariantId) {
      showToast("Please select weight first");
      return;
    }

    try {
      setActionLoading(productId);
      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          selectedWeight: selectedVariantId,
          quantity: 1,
        }),
      });

      if (res.status === 401) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }

      if (!res.ok) throw new Error("Failed to add to cart");

      const normalized = normalizeProduct(product, selectedVariantId);
      updateQuantity(normalized, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Could not add to cart");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    const isWishlisted = wishlistIds.includes(productId);
    const prevIds = wishlistIds;
    const nextIds = isWishlisted
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    setWishlistIds(nextIds);
    window.dispatchEvent(new CustomEvent("wishlist-count-update", { detail: { count: nextIds.length } }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/${isWishlisted ? "remove" : "add"}/${productId}`, {
        method: isWishlisted ? "DELETE" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }

      if (!res.ok && !(isWishlisted && res.status === 404)) {
        throw new Error("Wishlist update failed");
      }

      showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setWishlistIds(prevIds);
      window.dispatchEvent(new CustomEvent("wishlist-count-update", { detail: { count: prevIds.length } }));
      showToast("Wishlist update failed");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FDF1E3] py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.15em] text-[#2D3A1B]">
              OUR FEATURED COLLECTION
            </p>
            <h2 className="mt-2 font-serif text-[30px] text-[#1E392A] md:text-[36px]">
              Thoughtfully Curated Honey Picks
            </h2>
          </div>
        </div>

        <div className="relative">
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6D2B8]/30 bg-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <ChevronLeft size={24} className="text-[#2D3A1B]" />
            </button>
          )}

          {showRightArrow && products.length > 3 && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6D2B8]/30 bg-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <ChevronRight size={24} className="text-[#2D3A1B]" />
            </button>
          )}

          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center text-[#2D3A1B]">
              <Loader2 className="h-9 w-9 animate-spin" />
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="scrollbar-hide flex cursor-grab gap-8 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollBehavior: "smooth" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {products.map((product) => {
                const productId = getProductId(product);
                const variants = getProductVariants(product);
                const selectedVariantId = getSelectedVariantId(product);
                const selectedVariant =
                  variants.find((variant) => getVariantId(variant) === selectedVariantId) || variants[0];
                const normalized = normalizeProduct(product, selectedVariantId);

                return (
                  <article
                    key={productId}
                    onClick={() => router.push(`/shop/products/${productId}`)}
                    className="w-[320px] flex-shrink-0 cursor-pointer rounded-lg border border-[#E6D6C5] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative h-[200px] overflow-hidden rounded-lg bg-[#F9F0E5] p-3">
                      <Image
                        src={getPrimaryImage(product)}
                        alt={getProductName(product)}
                        fill
                        className="object-cover p-3"
                      />
                      <span className="absolute left-3 top-3 rounded bg-[#0E2A17] px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                        {getCategoryName(product)}
                      </span>
                    </div>

                    <div className="pt-3 text-center">
                      <h3 className="font-serif text-[18px] leading-tight text-[#003327]">
                        {getProductName(product)}
                      </h3>
                      <p className="mt-1.5 text-[13px] text-[#8F979C]">
                        {product?.floral_source || normalized.subtitle || "Pure Honey"}
                      </p>

                      <div className="mt-2 text-[17px] font-bold text-[#003327]">
                        Rs. {selectedVariant?.price ?? normalized.price}
                        {selectedVariant?.mrp ? (
                          <>
                            <span className="mx-2 font-normal text-[#8F979C]">-</span>
                            <span>Rs. {selectedVariant.mrp}</span>
                          </>
                        ) : null}
                      </div>

                      {variants.length > 0 && (
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          {variants.map((variant) => {
                            const variantId = getVariantId(variant);
                            const selected = variantId === selectedVariantId;
                            return (
                              <button
                                key={variantId}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
                                }}
                                className={`min-w-[54px] rounded border px-3 py-1 text-[11px] transition-colors ${
                                  selected
                                    ? "border-[#2D3A1B] bg-[#2D3A1B] text-white"
                                    : "border-[#E2E6EA] bg-white text-[#2F3A45] hover:border-[#2D3A1B]"
                                }`}
                              >
                                {getVariantLabel(variant)}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          disabled={actionLoading === productId}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="h-[42px] flex-1 rounded bg-[#2D3A1B] text-[13px] font-bold uppercase text-white transition-colors hover:bg-[#C98715] disabled:opacity-60"
                        >
                          {actionLoading === productId ? "Adding..." : "Add to Cart"}
                        </button>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleToggleWishlist(productId);
                          }}
                          aria-label="Wishlist"
                          className="flex h-[42px] w-[42px] items-center justify-center rounded border border-[#2D3A1B] text-[#2D3A1B] transition-colors hover:bg-[#2D3A1B]/10"
                        >
                          <Heart
                            size={18}
                            className={
                              wishlistIds.includes(productId)
                                ? "fill-[#FF6F3C] text-[#FF6F3C]"
                                : "text-[#FF6F3C]"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#2D3A1B] px-6 py-3 text-white shadow-lg">
          {toastMessage}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}