"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";
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
  const { updateQuantity } = useCart();
  const router = useRouter();

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
    return selectedVariants[productId] || getVariantId(variants[0]);
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

    try {
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
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Could not add to cart");
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

      showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      setWishlistIds(prevIds);
      window.dispatchEvent(new CustomEvent("wishlist-count-update", { detail: { count: prevIds.length } }));
      showToast("Wishlist update failed");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#2D3A1B]" />
      </main>
    );
  }

  if (error && products.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white text-center">
        <p className="text-red-600">Error: {error}</p>
        <button onClick={fetchProducts} className="rounded bg-[#2D3A1B] px-5 py-2 text-white">
          Try Again
        </button>
      </main>
    );
  }

  const activeCategoryName =
    categoryOptions.find((category) => category.slug === appliedFilters.categorySlug)?.name || "All Honeys";

  const promoBannerComponent = (
    <div className="mt-6 overflow-hidden rounded-[14px] bg-[#1F3A2A] px-5 pb-5 pt-6 text-center text-white">
      <h3 className="font-serif text-[22px] font-medium leading-tight">
        Pure Honey.
        <br />
        <span className="text-white/80">Pure You.</span>
      </h3>
      <p className="mx-auto mt-3 max-w-[210px] text-[12px] leading-5 text-white/70">
        Boost your wellness with nature&apos;s sweetest gift.
      </p>
      <div className="relative mt-6 h-[280px] w-full overflow-hidden rounded-[12px]">
        <Image src="/Promo.png" alt="Bee on flower" fill priority className="object-contain" />
      </div>
    </div>
  );

  const filterContent = (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between lg:hidden pb-4 mb-2 border-b border-[#F0E4D0]">
        <h2 className="font-['Playfair_Display'] text-[18px] font-bold text-[#2D3A1B]">Filters</h2>
        <button onClick={() => setIsFilterOpen(false)} className="p-1 text-gray-500 hover:text-black">
          <X size={20} />
        </button>
      </div>

      <h2 className="hidden lg:block font-['Playfair_Display'] text-[15px] font-bold uppercase tracking-wide text-[#2D3A1B]">
        Filter By
      </h2>

      <FilterSection title="Search" isOpen={openSections.search} onToggle={() => toggleSection("search")}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search Honey"
            className="h-10 w-full rounded border border-[#E4E8EE] pl-9 pr-3 text-[13px] outline-none focus:ring-1 focus:ring-[#2D3A1B]"
          />
        </div>
      </FilterSection>

      <FilterSection title="Honey Category" isOpen={openSections.category} onToggle={() => toggleSection("category")}>
        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#4E4E4E]">
          <input
            type="radio"
            checked={!selectedCategorySlug}
            onChange={() => setSelectedCategorySlug("")}
            className="h-4 w-4 accent-[#2D3A1B]"
          />
          All Honeys ({allProducts.length})
        </label>
        {categoryOptions.map((category) => (
          <label key={category.slug} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#4E4E4E]">
            <input
              type="radio"
              checked={selectedCategorySlug === category.slug}
              onChange={() => setSelectedCategorySlug(category.slug)}
              className="h-4 w-4 accent-[#2D3A1B]"
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
              className="h-4 w-4 accent-[#2D3A1B]"
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
          className="mt-2 w-full accent-[#2D3A1B]"
        />
      </FilterSection>

      <button
        type="button"
        onClick={applyFilters}
        disabled={filterLoading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#2D3A1B] py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#C98715] disabled:opacity-60"
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
    <main className="min-h-screen bg-white text-[#2F241C]">
      <div className="border-t border-[#E8E0D8]" />
      <div className="mx-auto max-w-[1490px] px-4 py-4 lg:py-8 pb-20 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Button + Results Count */}
        <div className="lg:hidden mb-2 flex items-center justify-between">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 rounded-md border border-[#2D3A1B] px-4 py-2 text-[13px] font-semibold text-[#2D3A1B] bg-white shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filter Products
          </button>
          <span className="text-[13px] text-[#A6ADB8]">
            {filteredProducts.length} Results
          </span>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
            <div className="relative ml-auto h-full w-[300px] max-w-full overflow-y-auto bg-white p-4 shadow-xl z-10">
              {filterContent}
            </div>
          </div>
        )}

        <div className="grid h-full gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block sticky top-20 self-start">
            {filterContent}
            {promoBannerComponent}
          </aside>

          {/* Main Products Section - Scrollbar hidden */}
          <section className="h-[calc(100vh--490px)] overflow-y-auto pr-2 no-scrollbar">
            {/* 🔥 HEADING - Minimized gap */}
            <div className="sticky top-0 z-20 bg-white pb-1 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h1 className="font-['Playfair_Display'] text-[28px] font-normal leading-[34px] tracking-normal text-[#1E392A]">
                  {activeCategoryName}
                </h1>
                <p className="mt-0.5 text-[13px] text-[#697386]">
                  Explore our range of natural honey variants.
                </p>
              </div>
            </div>

            {/* Filter Chips - Minimized gap */}
            <div className="sticky top-[58px] z-20 bg-white py-2 mt-0 flex flex-wrap items-center gap-1.5">
              <Chip label={activeCategoryName} />
              {appliedFilters.search && <Chip label={`Search: ${appliedFilters.search}`} />}
              {appliedFilters.weights.map((weight) => (
                <Chip key={weight} label={weight} />
              ))}
              {appliedFilters.price < MAX_PRICE && <Chip label={`Rs. ${appliedFilters.price}`} />}
              {(appliedFilters.categorySlug || appliedFilters.weights.length > 0 || appliedFilters.price < MAX_PRICE || appliedFilters.search) && (
                <button type="button" onClick={clearFilters} className="text-[12px] font-medium text-[#697386] underline hover:text-[#2D3A1B]">
                  Clear all
                </button>
              )}
            </div>

            {error && <p className="mt-2 text-[13px] text-red-600">{error}</p>}

            {/* 🟢 Products Grid - Minimal gap */}
            <div className="mt-1 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-3 items-stretch lg:grid-cols-3">
              {filteredProducts.map((item) => {
                const productId = getProductId(item);
                const variants = getProductVariants(item);
                const selectedVariantId = getSelectedVariantId(item);
                const product = normalizeProduct(item, selectedVariantId);

                return (
                  <div key={productId} className="flex flex-col h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex flex-col h-full w-full [&>div]:h-full [&>div]:flex [&>div]:flex-col [&>div]:justify-between">
                      <ProductCardShop
                        badge={product.badge}
                        image={product.image}
                        title={product.title}
                        subtitle={product.subtitle}
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
                        onIncrement={() => {}}
                        onDecrement={() => {}}
                        onOpenDetails={() => router.push(`/shop/products/${productId}`)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center text-[#697386]">
                <ShoppingCart size={32} className="text-[#2D3A1B]" />
                <p>No honey matches your filters right now.</p>
                <button type="button" onClick={clearFilters} className="text-[13px] font-semibold text-[#2D3A1B] underline">
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#2D3A1B] px-6 py-3 text-white shadow-lg">
          {toastMessage}
        </div>
      )}
      
      {/* 🟢 CSS to hide scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
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

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF3E4] px-2.5 py-0.5 text-[11px] font-medium text-[#1E392A]">
      {label}
    </span>
  );
}