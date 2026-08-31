"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";
import {
  type ApiProduct,
  getProductId,
  getProductName,
  getProductVariants,
  getProductsFromResponse,
  getVariantId,
  normalizeProduct,
  isVariantOutOfStock,
} from "@/lib/api-products";

// ---------- Main Component ----------
export default function HoneySelection() {
  const router = useRouter();
  const { addToCart } = useCart();
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
        const ids = wishlistProducts
          .map((item: any) => {
            if (item.productId && typeof item.productId === "object") {
              return item.productId._id;
            }
            return item.productId || item._id;
          })
          .filter(Boolean)
          .map(String);
        setWishlistIds(ids);
        window.dispatchEvent(
          new CustomEvent("wishlist-count-update", { detail: { count: ids.length } })
        );
      } else {
        const { getGuestWishlist } = await import("@/lib/wishlist");
        const guestIds = getGuestWishlist();
        setWishlistIds(guestIds);
        window.dispatchEvent(
          new CustomEvent("wishlist-count-update", { detail: { count: guestIds.length } })
        );
      }
    } catch (err) {
      const { getGuestWishlist } = await import("@/lib/wishlist");
      const guestIds = getGuestWishlist();
      setWishlistIds(guestIds);
    }
  };

  // ---------- Fetch Products ----------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const result = await res.json();
      const productList = getProductsFromResponse(result);
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

    const handleWishlistChange = () => {
      import("@/lib/wishlist").then(({ getGuestWishlist }) => {
        setWishlistIds(getGuestWishlist());
      });
    };

    window.addEventListener("wishlist-count-update", handleWishlistChange);
    return () => {
      window.removeEventListener("wishlist-count-update", handleWishlistChange);
    };
  }, []);

  // ---------- Auto Slide for Mobile ----------
  useEffect(() => {
    if (products.length === 0) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (window.innerWidth < 1024 && sliderRef.current) {
        const maxLen = products.length;
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

  const dummyHandler = () => {};

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
              ref={sliderRef}
              className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none gap-4 lg:gap-x-7 lg:gap-y-9 mt-8 pb-4 lg:pb-0 px-2 sm:px-0 scroll-smooth"
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
                    className={`w-full min-w-full lg:min-w-0 snap-center flex-shrink-0 px-4 sm:px-16 lg:px-0 flex justify-center ${
                      idx >= 4 ? "lg:hidden" : ""
                    }`}
                  >
                    <div className="w-full max-w-[340px] lg:max-w-none">
                      <ProductCardShop
                        badge={cardBadge}
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

            {/* Shop All Range Button Below 4 Cards */}
            <div className="mt-9 sm:mt-11 flex justify-center px-4">
              <Link
                href="/shop"
                className="w-full max-w-[280px] sm:max-w-[320px] h-[48px] inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#FDF0DF] hover:bg-[#FBE4C6] text-[#3D260F] text-sm sm:text-base font-semibold tracking-wide border border-[#EADBCC] shadow-2xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Shop All Range</span>
                <ChevronRight size={18} className="text-[#3D260F] stroke-[2.5]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
