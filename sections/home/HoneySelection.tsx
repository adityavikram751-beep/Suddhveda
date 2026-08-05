"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ProductCardShop from "@/components/productcardshop";
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

// ---------- Main Component ----------
export default function HoneySelection() {
  const router = useRouter();
  const { updateQuantity } = useCart();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  // ---------- Fetch Wishlist ----------
  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const wishlistProducts = data?.data?.products || [];
        const ids = wishlistProducts.map((item: any) => {
          if (item.productId && typeof item.productId === "object") {
            return item.productId._id;
          }
          return item.productId || item._id;
        }).filter(Boolean).map(String);
        setWishlistIds(ids);
        window.dispatchEvent(
          new CustomEvent("wishlist-count-update", { detail: { count: ids.length } })
        );
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  // ---------- Fetch Products (using helper) ----------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const result = await res.json();
      // ✅ Use helper to get array of ApiProduct
      const productList = getProductsFromResponse(result);
      console.log("✅ Products loaded:", productList.length); // debug
      setProducts(productList);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  // ---------- Auto Slide for Mobile / Tablet (< 1024px) ----------
  useEffect(() => {
    if (products.length === 0) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (window.innerWidth < 1024 && sliderRef.current) {
        const maxLen = products.length; // ab saare dikhenge
        currentIndex = (currentIndex + 1) % maxLen;
        const cardWidth = sliderRef.current.offsetWidth;
        sliderRef.current.scrollTo({
          left: cardWidth * currentIndex,
          behavior: "smooth",
        });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [products]);

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
    return selectedVariants[productId] || getVariantId(variants[0]);
  };

  // ---------- Add to Cart ----------
  const handleAddToCart = async (product: ApiProduct) => {
    const productId = getProductId(product);
    const variantId = getSelectedVariantId(product);
    if (!variantId) return;

    try {
      setActionLoading(productId);
      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          selectedWeight: variantId,
          quantity: 1,
        }),
      });

      if (res.status === 401) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }

      if (!res.ok) throw new Error("Failed to add to cart");

      // Update cart context
      updateQuantity(productId, variantId, 1);
    } catch (err) {
      console.error("Error in Add to Cart:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ---------- Wishlist Toggle ----------
  const handleToggleWishlist = async (productId: string) => {
    const isWishlisted = wishlistIds.includes(productId);
    const prevIds = wishlistIds;
    const nextIds = isWishlisted
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    // Optimistic update
    setWishlistIds(nextIds);
    window.dispatchEvent(
      new CustomEvent("wishlist-count-update", { detail: { count: nextIds.length } })
    );

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
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        return;
      }

      if (!res.ok && !(isWishlisted && res.status === 404)) {
        throw new Error("Wishlist update failed");
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      // Revert on error
      setWishlistIds(prevIds);
      window.dispatchEvent(
        new CustomEvent("wishlist-count-update", { detail: { count: prevIds.length } })
      );
    }
  };

  // Dummy functions for ProductCardShop (not used in this context)
  const dummyHandler = () => {};

  // ---------- Render ----------
  return (
    <section className="relative mt-2 bg-[#FFF7ED] overflow-hidden pt-2 pb-14">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10 pt-10">
        <div className="text-center mb-8">
          <h2 className="text-[34px] md:text-[44px] lg:text-[56px] font-bold leading-tight text-[#2D3A1B]">
            Nature&apos;s Finest Selection
          </h2>
          <p className="mt-2 max-w-[760px] mx-auto text-[#B09077] text-[16px] lg:text-[18px] leading-7 px-4">
            From wildflower meadows to mustard fields, experience honey in its purest
            and most authentic form.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#B09077] text-lg font-medium">
            Loading products...
          </div>
        ) : (
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none gap-4 lg:gap-x-7 lg:gap-y-9 mt-8 pb-4 lg:pb-0 px-2 sm:px-0 scroll-smooth"
            >
              {/* ✅ Saare products dikhenge – slice hata diya */}
              {products.map((product) => {
                const productId = getProductId(product);
                const variants = getProductVariants(product);
                const selectedVariantId = getSelectedVariantId(product);
                const normalized = normalizeProduct(product, selectedVariantId);

                return (
                  <div
                    key={productId}
                    className="w-full min-w-full lg:min-w-0 snap-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg flex-shrink-0 px-4 sm:px-16 lg:px-0 flex justify-center"
                  >
                    <div className="w-full max-w-[340px] lg:max-w-none">
                      <ProductCardShop
                        badge={normalized.badge || "Honey"}
                        image={normalized.image}
                        title={normalized.title}
                        subtitle={normalized.subtitle}
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
                        onIncrement={dummyHandler}
                        onDecrement={dummyHandler}
                        onToggleWishlist={() => handleToggleWishlist(productId)}
                        isWishlisted={wishlistIds.includes(productId)}
                        onOpenDetails={() => router.push(`/shop/products/${productId}`)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}