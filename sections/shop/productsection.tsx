"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL, getStoredSession } from "@/lib/auth";
import {
  type ApiProduct,
  getCategoryName,
  getCategorySlug,
  getProductId,
  getProductName,
  getProductVariants,
  getProductsFromResponse,
  getVariantId,
  getVariantLabel,
  normalizeProduct,
  parseWeightLabel,
  isVariantOutOfStock,
} from "@/lib/api-products";

const MIN_PRICE = 100;
const MAX_PRICE = 2000;


type ProductFilters = {
  categorySlug: string;
  weights: string[];
  price: number;
  search: string;
};

const defaultFilters: ProductFilters = {
  categorySlug: "",
  weights: [],
  price: MAX_PRICE,
  search: "",
};

export default function ShopPage() {
  const { updateQuantity, addToCart } = useCart();
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(MAX_PRICE);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(defaultFilters);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Mobile Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileSliderHovered, setIsMobileSliderHovered] = useState(false);

  // 🟢 Strict Background Scroll Lock when Filter Drawer is Open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isFilterOpen]);


  const [openSections, setOpenSections] = useState({
    category: true,
    weight: true,
    price: true,
    search: true,
  });

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    allProducts.forEach((product) => {
      const slug = getCategorySlug(product);
      if (slug) map.set(slug, getCategoryName(product));
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [allProducts]);

  const weightOptions = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((product) => {
      getProductVariants(product).forEach((variant) => {
        const label = getVariantLabel(variant);
        if (label) set.add(label);
      });
    });
    return Array.from(set);
  }, [allProducts]);

  const fetchJsonProducts = async (url: string) => {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return getProductsFromResponse(await res.json());
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
        .map((item: { productId?: { _id?: string } | string; _id?: string }) =>
          item?.productId && typeof item.productId === "object"
            ? item.productId._id
            : item?.productId || item?._id
        )
        .filter(Boolean)
        .map(String);
      setWishlistIds(ids);
      window.dispatchEvent(new CustomEvent("wishlist-count-update", { detail: { count: ids.length } }));
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await fetchJsonProducts(`${API_BASE_URL}/api/products`);
      setAllProducts(list);
      setProducts(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const getSelectedVariantId = (product: ApiProduct) => {
    const productId = getProductId(product);
    const variants = getProductVariants(product);
    const inStockVariant = variants.find((v) => !isVariantOutOfStock(v));
    return selectedVariants[productId] || getVariantId(inStockVariant || variants[0]);
  };


  const getRefinedProducts = (list: ApiProduct[], filters: ProductFilters) => {
    const query = filters.search.trim().toLowerCase();
    return list.filter((product) => {
      const productVariants = getProductVariants(product);
      const prices = productVariants.length > 0
        ? productVariants.map((variant) => Number(variant?.price ?? 0))
        : [Number(product?.price ?? 0)];
      const matchesCategory =
        !filters.categorySlug || getCategorySlug(product) === filters.categorySlug;
      const matchesWeight =
        filters.weights.length === 0 ||
        productVariants.some((variant) => filters.weights.includes(getVariantLabel(variant)));
      const matchesSearch =
        !query ||
        getProductName(product).toLowerCase().includes(query) ||
        String(product?.floral_source || "").toLowerCase().includes(query);
      const matchesPrice = prices.some((price) => price >= MIN_PRICE && price <= filters.price);
      return matchesCategory && matchesWeight && matchesSearch && matchesPrice;
    });
  };

  const filteredProducts = useMemo(
    () => getRefinedProducts(products, appliedFilters),
    [products, appliedFilters]
  );

  // 🟢 Mobile Products Auto-Scroll Effect (Interval every 3.5s)
  useEffect(() => {
    if (isMobileSliderHovered || filteredProducts.length === 0) return;
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isMobileSliderHovered, filteredProducts]);

  const applyFilters = async () => {
    try {
      setFilterLoading(true);
      setError(null);
      let url = `${API_BASE_URL}/api/products`;
      const query = searchTerm.trim();
      const nextAppliedFilters = {
        categorySlug: selectedCategorySlug,
        weights: selectedWeights,
        price: priceRange,
        search: query,
      };

      if (query) {
        url = `${API_BASE_URL}/api/filter/search?name=${encodeURIComponent(query)}`;
      } else if (selectedCategorySlug) {
        url = `${API_BASE_URL}/api/filter/category/${encodeURIComponent(selectedCategorySlug)}`;
      } else if (priceRange < MAX_PRICE) {
        url = `${API_BASE_URL}/api/filter/price?minPrice=${MIN_PRICE}&maxPrice=${priceRange}`;
      } else if (selectedWeights.length > 0) {
        const { weight, unit } = parseWeightLabel(selectedWeights[0]);
        url = `${API_BASE_URL}/api/filter/quantity?weight=${encodeURIComponent(weight)}&unit=${encodeURIComponent(unit)}`;
      }

      const list = await fetchJsonProducts(url);
      setProducts(list);
      setAppliedFilters(nextAppliedFilters);
      setIsFilterOpen(false);

      if (list && list.length > 0 && (selectedCategorySlug || query || selectedWeights.length > 0)) {
        const targetProduct = list[0];
        const targetId = getProductId(targetProduct);
        if (targetId) {
          router.push(`/shop/products/${targetId}`);
          return;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch filtered products");
    } finally {
      setFilterLoading(false);
    }
  };

  const clearFilters = async () => {
    setSelectedCategorySlug("");
    setSelectedWeights([]);
    setPriceRange(MAX_PRICE);
    setSearchTerm("");
    setAppliedFilters(defaultFilters);
    await fetchProducts();
    setIsFilterOpen(false);
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWeight = (weight: string) => {
    setSelectedWeights((prev) =>
      prev.includes(weight) ? prev.filter((item) => item !== weight) : [...prev, weight]
    );
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = async (product: ApiProduct) => {
    const productId = getProductId(product);
    const selectedVariantId = getSelectedVariantId(product);
    if (!selectedVariantId) {
      showToast("Please select weight first");
      return;
    }

    const variants = getProductVariants(product);
    const selectedVariant = variants.find((v) => getVariantId(v) === selectedVariantId) || variants[0];
    const weightLabel = selectedVariant ? `${selectedVariant.weight}${selectedVariant.unit || "g"}` : "";
    const price = selectedVariant?.price || product.price || 0;
    const image = product.image?.image_url || product.image?.url || "/placeholder.png";

    try {
      await addToCart(productId, selectedVariantId, {
        type: "NORMAL",
        productId,
        variantId: selectedVariantId,
        productName: getProductName(product),
        image,
        price,
        weight: weightLabel,
      });
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new CustomEvent("trigger-live-update"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Could not add to cart");
    }
  };

  const handleBuyNow = async (product: ApiProduct) => {
    const productId = getProductId(product);
    const selectedVariantId = getSelectedVariantId(product);
    if (!selectedVariantId) return;

    const variants = getProductVariants(product);
    const selectedVariant = variants.find((v) => getVariantId(v) === selectedVariantId) || variants[0];
    const weightLabel = selectedVariant ? `${selectedVariant.weight}${selectedVariant.unit || "g"}` : "";
    const price = selectedVariant?.price || product.price || 0;
    const image = product.image?.image_url || product.image?.url || "/placeholder.png";

    try {
      await addToCart(productId, selectedVariantId, {
        type: "NORMAL",
        productId,
        variantId: selectedVariantId,
        productName: getProductName(product),
        image,
        price,
        weight: weightLabel,
      });
      const session = getStoredSession();
      if (!session) {
        router.push("/login?redirect=/cart");
      } else {
        router.push("/cart");
      }
    } catch (error) {
      console.error("Error in Buy Now:", error);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    const isWishlisted = wishlistIds.includes(productId);
    const nextIds = isWishlisted
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    setWishlistIds(nextIds);
    window.dispatchEvent(new CustomEvent("wishlist-count-update", { detail: { count: nextIds.length } }));

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

      showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      const { toggleGuestWishlist } = await import("@/lib/wishlist");
      const res = toggleGuestWishlist(productId);
      setWishlistIds(res.wishlistIds);
      showToast("Updated wishlist");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <Loader2 className="h-10 w-10 animate-spin text-[#593102]" />
      </main>
    );
  }

  if (error && products.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#FAF7F2] text-center">
        <p className="text-red-600">Error: {error}</p>
        <button onClick={fetchProducts} className="rounded bg-[#593102] px-5 py-2 text-white">
          Try Again
        </button>
      </main>
    );
  }

  const promoBannerComponent = (
    <div className="mt-6 overflow-hidden rounded-[24px] bg-[#593102] px-5 pt-6 pb-10 text-center text-white shadow-xl border-2 border-[#D49313]/30">
      <h3 className="font-serif text-[19px] sm:text-[21px] font-medium leading-tight whitespace-nowrap">
        Raw Honey. <span className="text-white/80">Pure You.</span>
      </h3>
      <p className="mx-auto mt-2.5 max-w-[210px] text-[12px] leading-5 text-white/70">
        Boost your wellness with nature&apos;s sweetest gift.
      </p>
      <div className="relative mt-5 h-[275px] sm:h-[300px] w-full overflow-hidden rounded-[16px] border border-[#D49313]/40 shadow-sm">
        <Image src="/shop 2.png" alt="Raw Honey Pure You" fill priority className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
      </div>
    </div>
  );

  const filterContent = (
    <div className="rounded-2xl bg-white p-5 border border-[#EADCC9] shadow-2xs">
      <div className="flex items-center justify-between lg:hidden pb-4 mb-2 border-b border-[#F0E4D0]">
        <h2 className="font-serif text-[18px] font-bold text-[#593102]">Filters</h2>
        <button onClick={() => setIsFilterOpen(false)} className="p-1 text-gray-500 hover:text-black cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <h2 className="hidden lg:block font-serif text-[15px] font-bold uppercase tracking-wide text-[#593102]">
        Filter By
      </h2>

      <FilterSection title="Search" isOpen={openSections.search} onToggle={() => toggleSection("search")}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search Honey"
            className="h-10 w-full rounded-xl border border-[#E4E8EE] pl-9 pr-3 text-[13px] outline-none focus:ring-1 focus:ring-[#593102]"
          />
        </div>
      </FilterSection>

      <FilterSection title="Honey Category" isOpen={openSections.category} onToggle={() => toggleSection("category")}>
        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#4E4E4E]">
          <input
            type="radio"
            checked={!selectedCategorySlug}
            onChange={() => setSelectedCategorySlug("")}
            className="h-4 w-4 accent-[#593102]"
          />
          All Honeys ({allProducts.length})
        </label>
        {categoryOptions.map((category) => (
          <label key={category.slug} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#4E4E4E]">
            <input
              type="radio"
              checked={selectedCategorySlug === category.slug}
              onChange={() => setSelectedCategorySlug(category.slug)}
              className="h-4 w-4 accent-[#593102]"
            />
            {category.name}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Net Weight" isOpen={openSections.weight} onToggle={() => toggleSection("weight")}>
        {weightOptions.map((weight) => (
          <label key={weight} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#4E4E4E]">
            <input
              type="checkbox"
              checked={selectedWeights.includes(weight)}
              onChange={() => toggleWeight(weight)}
              className="h-4 w-4 accent-[#593102]"
            />
            {weight}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Price Range" isOpen={openSections.price} onToggle={() => toggleSection("price")}>
        <div className="flex items-center justify-between text-[13px] font-semibold text-[#2F241C]">
          <span>Rs. {MIN_PRICE}</span>
          <span>Rs. {priceRange}</span>
        </div>
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={priceRange}
          onChange={(event) => setPriceRange(Number(event.target.value))}
          className="mt-2 w-full accent-[#593102]"
        />
      </FilterSection>

      <button
        type="button"
        onClick={applyFilters}
        disabled={filterLoading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#593102] via-[#7A450A] to-[#593102] hover:from-[#D49313] hover:to-[#593102] py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-all disabled:opacity-60 cursor-pointer shadow-md"
      >
        {filterLoading && <Loader2 size={15} className="animate-spin" />}
        Apply Filter
      </button>

      {/* Promo Banner inside mobile drawer */}
      <div className="lg:hidden">
        {promoBannerComponent}
      </div>
    </div>
  );

  return (
    <main className="bg-[#FAF7F2] text-[#2F241C]">
      <div className="border-t border-[#E8E0D8]" />
      <div className="mx-auto max-w-[1490px] px-4 py-4 lg:py-8 pb-6 lg:pb-12 sm:px-6 lg:px-8">
        
        {/* Page Heading (Centered & Refined) */}
        <div className="mb-8 lg:mb-10 text-center mx-auto max-w-[760px] px-4 flex flex-col items-center">
          <span className="uppercase tracking-[0.18em] text-[#593102] text-[12px] font-extrabold bg-[#FAF0DC] border border-[#D49313]/50 px-4 py-1.5 rounded-full shadow-2xs mb-3">
            OUR HONEY SELECTION
          </span>
          <h2 className="font-serif text-[34px] sm:text-[44px] lg:text-[48px] font-extrabold leading-tight text-[#593102] tracking-tight">
            Discover Pure Honey Collections
          </h2>
          <p className="mt-3 text-[16px] text-[#6E5D4F] font-medium max-w-[620px] mx-auto leading-relaxed">
            Ethically harvested, raw and filtered honey straight from natural hives.
          </p>
        </div>

        {/* Mobile Filter Toggle Bar */}
        <div className="flex lg:hidden justify-between items-center mb-6 pb-3 border-b border-[#EADCC9]">
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-2.5 text-[13px] font-extrabold text-[#593102] shadow-2xs cursor-pointer active:scale-95 transition-all"
          >
            <SlidersHorizontal size={16} className="text-[#D49313]" />
            <span>Filters</span>
          </button>
          <span className="text-[13px] font-extrabold text-[#7A6A5C]">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Main Shop Section Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar (Filters + Promo Banner) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-[135px]">
            {filterContent}
            {promoBannerComponent}
          </aside>

          {/* Products Grid Column */}
          <section className="lg:col-span-9 w-full">
            {error && <p className="mb-4 text-[13px] text-red-600">{error}</p>}

            {/* Mobile View: Auto-Scrolling Horizontal Carousel */}
            <div
              ref={sliderRef}
              onMouseEnter={() => setIsMobileSliderHovered(true)}
              onMouseLeave={() => setIsMobileSliderHovered(false)}
              onTouchStart={() => setIsMobileSliderHovered(true)}
              onTouchEnd={() => setIsMobileSliderHovered(false)}
              className="flex lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 px-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {filteredProducts.map((item) => {
                const productId = getProductId(item);
                const variants = getProductVariants(item);
                const selectedVariantId = getSelectedVariantId(item);
                const product = normalizeProduct(item, selectedVariantId);

                return (
                  <div key={productId} className="w-full sm:w-[calc(50%-8px)] shrink-0 snap-center flex flex-col h-full items-center">
                    <ProductCardShop
                      badge={product.badge}
                      image={product.image}
                      title={product.title}
                      subtitle={product.subtitle}
                      category={product.category}
                      tasteProfile={product.tasteProfile}
                      shortDescription={product.shortDescription}
                      weight={product.weight}
                      price={product.price}
                      oldPrice={product.oldPrice}
                      rating={product.rating}
                      reviews={product.reviews}
                      quantity={0}
                      variants={variants}
                      selectedVariantId={selectedVariantId}
                      onVariantSelect={(variantId) =>
                        setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }))
                      }
                      isWishlisted={wishlistIds.includes(productId)}
                      onToggleWishlist={() => handleToggleWishlist(productId)}
                      onAddToCart={() => handleAddToCart(item)}
                      onBuyNow={() => handleBuyNow(item)}
                      onIncrement={() => {}}
                      onDecrement={() => {}}
                      onOpenDetails={() => router.push(`/shop/products/${productId}`)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Desktop View: 3-Column Grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {filteredProducts.map((item) => {
                const productId = getProductId(item);
                const variants = getProductVariants(item);
                const selectedVariantId = getSelectedVariantId(item);
                const product = normalizeProduct(item, selectedVariantId);

                return (
                  <div key={productId} className="w-full flex flex-col items-center h-full">
                    <ProductCardShop
                      badge={product.badge}
                      image={product.image}
                      title={product.title}
                      subtitle={product.subtitle}
                      category={product.category}
                      tasteProfile={product.tasteProfile}
                      shortDescription={product.shortDescription}
                      weight={product.weight}
                      price={product.price}
                      oldPrice={product.oldPrice}
                      rating={product.rating}
                      reviews={product.reviews}
                      quantity={0}
                      variants={variants}
                      selectedVariantId={selectedVariantId}
                      onVariantSelect={(variantId) =>
                        setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }))
                      }
                      isWishlisted={wishlistIds.includes(productId)}
                      onToggleWishlist={() => handleToggleWishlist(productId)}
                      onAddToCart={() => handleAddToCart(item)}
                      onBuyNow={() => handleBuyNow(item)}
                      onIncrement={() => {}}
                      onDecrement={() => {}}
                      onOpenDetails={() => router.push(`/shop/products/${productId}`)}
                    />
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center text-[#697386]">
                <ShoppingCart size={32} className="text-[#593102]" />
                <p>No honey matches your filters right now.</p>
                <button type="button" onClick={clearFilters} className="text-[13px] font-semibold text-[#593102] underline cursor-pointer">
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-4 shadow-2xl z-10">
            {filterContent}
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-gradient-to-r from-[#593102] via-[#7A450A] to-[#593102] border border-[#D49313]/50 px-7 py-3.5 text-white font-extrabold shadow-2xl flex items-center gap-2 text-[14px]">
          <span>✨</span> {toastMessage}
        </div>
      )}
    </main>
  );
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 border-t border-[#F0E4D0] pt-5">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between">
        <p className="text-[14px] font-semibold text-[#2F241C]">{title}</p>
        <ChevronDown size={16} className={`text-[#697386] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  );
}
