"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Loader2, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL, getStoredSession, getStoredToken } from "@/lib/auth";
import { getCachedData, setCachedData, optimizeCloudinaryUrl, preloadImages } from "@/lib/cache-utils";
import {
  type ApiProduct,
  getCategoryName,
  getCategorySlug,
  getProductId,
  getProductName,
  getProductVariants,
  getProductImages,
  getProductsFromResponse,
  getVariantId,
  getVariantLabel,
  normalizeProduct,
  parseWeightLabel,
  isVariantOutOfStock,
} from "@/lib/api-products";

const MIN_PRICE = 100;
const MAX_PRICE = 2000;

const DEFAULT_FLORA_SOURCES: string[] = [
  "Ajwain (Carom) plants – Trachyspermum ammi.",
  "Fennel (Saunf) plants – Foeniculum vulgare.",
  "Lychee (Litchi chinensis) trees",
  "Mustard (Brassica) flowers.",
  "Natural Mix of Wild and Seasonal Blossoms",
  "Wildflowers and Flowering Plants",
];

type ProductFilters = {
  categorySlug: string;
  floraSource: string;
  weights: string[];
  price: number;
  search: string;
};

const defaultFilters: ProductFilters = {
  categorySlug: "",
  floraSource: "",
  weights: [],
  price: MAX_PRICE,
  search: "",
};

export default function ShopPage() {
  const { updateQuantity, addToCart } = useCart();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<ApiProduct[]>(() => {
    return getCachedData<ApiProduct[]>("all_products") || [];
  });
  const [products, setProducts] = useState<ApiProduct[]>(() => {
    return getCachedData<ApiProduct[]>("all_products") || [];
  });
  const [loading, setLoading] = useState(() => {
    const cached = getCachedData<ApiProduct[]>("all_products");
    return !cached || cached.length === 0;
  });
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [floraSources, setFloraSources] = useState<string[]>(() => {
    return getCachedData<string[]>("flora_sources") || DEFAULT_FLORA_SOURCES;
  });
  const [selectedFloraSource, setSelectedFloraSource] = useState<string>("");
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(MAX_PRICE);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>(defaultFilters);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [comboProducts, setComboProducts] = useState<any[]>(() => {
    return getCachedData<any[]>("combo_products_2_3_4") || [];
  });

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
    category: false,
    weight: false,
    price: false,
    search: false,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedFloraSource || appliedFilters.floraSource) count++;
    if (selectedWeights.length > 0 || appliedFilters.weights.length > 0) count++;
    if (priceRange < MAX_PRICE || appliedFilters.price < MAX_PRICE) count++;
    if (searchTerm.trim() || appliedFilters.search.trim()) count++;
    if (selectedCategorySlug || appliedFilters.categorySlug) count++;
    return count;
  }, [selectedFloraSource, selectedWeights, priceRange, searchTerm, selectedCategorySlug, appliedFilters]);

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
      if (allProducts.length === 0) {
        setLoading(true);
      }
      setError(null);
      const list = await fetchJsonProducts(`${API_BASE_URL}/api/products`);
      setAllProducts(list);
      setProducts(list);
      setCachedData("all_products", list);

      // Preload primary product images in background for instant responsiveness
      const imagesToPreload = list
        .map((p) => {
          const doc = getProductImages(p);
          return doc?.[0]?.image_url;
        })
        .filter(Boolean);
      preloadImages(imagesToPreload);
    } catch (err) {
      if (allProducts.length === 0) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

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

  const fetchFloraSources = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/filter/flora-sources`);
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json.floraSources || json.sources || [];
        if (Array.isArray(list) && list.length > 0) {
          setFloraSources(list);
          setCachedData("flora_sources", list);
        }
      }
    } catch (err) {
      console.error("Error fetching flora sources:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchComboProducts();
    fetchWishlist();
    fetchFloraSources();
  }, []);

  const getSelectedVariantId = (product: ApiProduct) => {
    const productId = getProductId(product);
    const variants = getProductVariants(product);
    const inStockVariant = variants.find((v) => !isVariantOutOfStock(v));
    return selectedVariants[productId] || getVariantId(inStockVariant || variants[0]);
  };


  const getRefinedProducts = (list: ApiProduct[], filters: ProductFilters) => {
    const query = filters.search.trim().toLowerCase();
    const targetFlora = filters.floraSource.trim().toLowerCase();
    const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanTargetFlora = cleanStr(targetFlora);
    const floraFirstWord = targetFlora ? targetFlora.split(/[\s–\-()]/)[0].toLowerCase() : "";

    return list.filter((product) => {
      const productVariants = getProductVariants(product);
      const prices = productVariants.length > 0
        ? productVariants.map((variant) => Number(variant?.price ?? 0))
        : [Number(product?.price ?? 0)];

      const matchesCategory =
        !filters.categorySlug || getCategorySlug(product) === filters.categorySlug;

      const productFlora = String(product?.floral_source || product?.flora_source || product?.flavor || "").toLowerCase();
      const cleanProductFlora = cleanStr(productFlora);
      const productName = getProductName(product).toLowerCase();

      let matchesFlora = true;
      if (targetFlora) {
        matchesFlora = Boolean(
          (cleanProductFlora && cleanTargetFlora && (cleanProductFlora.includes(cleanTargetFlora) || cleanTargetFlora.includes(cleanProductFlora))) ||
          (floraFirstWord && (productFlora.includes(floraFirstWord) || productName.includes(floraFirstWord))) ||
          (targetFlora.includes("lychee") && (productFlora.includes("litchi") || productName.includes("litchi"))) ||
          (targetFlora.includes("litchi") && (productFlora.includes("lychee") || productName.includes("lychee"))) ||
          (targetFlora.includes("wildflower") && (productFlora.includes("wild") || productName.includes("multi flora") || productName.includes("flora")))
        );
      }

      const matchesWeight =
        filters.weights.length === 0 ||
        productVariants.some((variant) => filters.weights.includes(getVariantLabel(variant)));

      const matchesSearch =
        !query ||
        productName.includes(query) ||
        productFlora.includes(query);

      const matchesPrice = prices.some((price) => price >= MIN_PRICE && price <= filters.price);

      return matchesCategory && matchesFlora && matchesWeight && matchesSearch && matchesPrice;
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
        floraSource: selectedFloraSource,
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

      // Refine against all products to get the EXACT selected product
      const baseList = list.length > 0 ? list : allProducts;
      const refinedList = getRefinedProducts(baseList, nextAppliedFilters);

      const hasSpecificFilter = Boolean(
        selectedFloraSource ||
        selectedCategorySlug ||
        query ||
        selectedWeights.length > 0
      );

      if (hasSpecificFilter && refinedList.length > 0) {
        const targetProduct = refinedList[0];
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
    setSelectedFloraSource("");
    setSelectedWeights([]);
    setPriceRange(MAX_PRICE);
    setSearchTerm("");
    setAppliedFilters(defaultFilters);
    await Promise.all([fetchProducts(), fetchComboProducts()]);
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
    const token = getStoredToken();
    const session = getStoredSession();
    if (!token || !session || !session.user?.mobile) {
      router.push("/login");
      return;
    }

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
      router.push("/cart");
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
        <Image src="/shop3.webp" alt="Raw Honey Pure You" fill priority className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
      </div>
    </div>
  );

  const desktopFilterContent = (
    <div className="rounded-2xl bg-white p-5 border border-[#EADCC9] shadow-2xs">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F0E4D0]">
        <h2 className="font-serif text-[15px] font-bold uppercase tracking-wide text-[#593102]">
          Filter By
        </h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[12px] font-bold text-[#8C5E1E] hover:text-[#593102] hover:underline cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

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

      <FilterSection title="Honey Flora Source" isOpen={openSections.category} onToggle={() => toggleSection("category")}>
        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#4E4E4E]">
          <input
            type="radio"
            checked={!selectedFloraSource}
            onChange={() => {
              setSelectedFloraSource("");
              setSelectedCategorySlug("");
              setAppliedFilters((prev) => ({ ...prev, floraSource: "", categorySlug: "" }));
            }}
            className="h-4 w-4 accent-[#593102]"
          />
          All Flora Sources ({allProducts.length})
        </label>
        {floraSources.map((source) => (
          <label key={source} className="flex cursor-pointer items-start gap-2.5 text-[13px] text-[#4E4E4E] leading-snug">
            <input
              type="radio"
              checked={selectedFloraSource === source}
              onChange={() => {
                setSelectedFloraSource(source);
                setSelectedCategorySlug("");
                setAppliedFilters((prev) => ({ ...prev, floraSource: source, categorySlug: "" }));
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#593102]"
            />
            <span className="hover:text-[#593102] transition-colors">{source}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Net Weight" isOpen={openSections.weight} onToggle={() => toggleSection("weight")}>
        <div className="flex flex-wrap gap-2 pt-1">
          {weightOptions.map((weight) => {
            const isSelected = selectedWeights.includes(weight);
            return (
              <button
                key={weight}
                type="button"
                onClick={() => toggleWeight(weight)}
                className={`rounded-full px-3 py-1 text-[12px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#593102] text-white shadow-xs"
                    : "bg-[#FAF7F2] text-[#4E4E4E] border border-[#EADCC9] hover:border-[#D49313]"
                }`}
              >
                {weight} {isSelected && "✓"}
              </button>
            );
          })}
        </div>
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
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#593102] px-1.5 text-[11px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <span className="text-[13px] font-extrabold text-[#7A6A5C]">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Main Shop Section Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Desktop Left Sidebar (Filters + Promo Banner) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-[135px]">
            {desktopFilterContent}
            {promoBannerComponent}
          </aside>

          {/* Products Grid Column */}
          <section className="lg:col-span-9 w-full">
            {error && <p className="mb-4 text-[13px] text-red-600">{error}</p>}

            {/* Products Grid: 2 Columns on Mobile, 3 Columns on Desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
              {filteredProducts.map((item) => {
                const productId = getProductId(item);
                const variants = getProductVariants(item);
                const selectedVariantId = getSelectedVariantId(item);
                const product = normalizeProduct(item, selectedVariantId);

                return (
                  <div key={productId} className="w-full flex flex-col items-center h-full">
                    <ProductCardShop
                      compactOnMobile
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
                      onIncrement={() => { }}
                      onDecrement={() => { }}
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
                  <div key={comboId} className="w-full flex flex-col items-center h-full">
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

                      <div className="px-1 sm:px-1.5">
                        {/* Divider */}
                        <div className="border-t border-[#E8DCCB] my-2 sm:my-2.5" />

                        {/* Bottom Bar: Single botelgiftc.svg icon + Explore Gift button */}
                        <div className="flex items-center justify-between gap-1.5 pt-0.5">
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[#2F241C] shrink-0">
                            <Image
                              src="/botelgiftc.svg"
                              alt="Jar"
                              width={18}
                              height={18}
                              className="object-contain shrink-0 sm:w-5 sm:h-5"
                            />
                            <span className="text-[11.5px] sm:text-[13.5px] font-bold text-[#2F241C]">
                              {jarCount > 0 ? `${jarCount} Jars` : "Gift Set"}
                            </span>
                          </div>

                          <Link
                            href={targetUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-full bg-[#5D3716] hover:bg-[#784318] text-white px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-[12.5px] font-medium shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                          >
                            <span>Explore Gift</span>
                            <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
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

      {/* Mobile Slide-Over Filter Drawer with Curved Sides & Smooth Animation */}
      <div
        className={`fixed inset-0 z-50 flex justify-end lg:hidden transition-all duration-300 ease-in-out ${
          isFilterOpen ? "visible" : "invisible pointer-events-none"
        }`}
        aria-hidden={!isFilterOpen}
      >
        {/* Backdrop with Fade */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
            isFilterOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsFilterOpen(false)}
        />

        {/* Drawer Panel: Curved Left Side (rounded-l-[32px]) with Smooth Slide-in */}
        <div
          className={`relative z-10 flex h-full w-[86vw] max-w-[360px] flex-col bg-[#FAF7F2] shadow-[-16px_0_40px_rgba(89,49,2,0.25)] transition-transform duration-300 ease-out rounded-l-[32px] sm:rounded-l-[36px] border-l-2 border-[#D49313]/35 overflow-hidden ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* 1. Sticky Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#EADCC9] bg-[#FAF7F2]/95 px-5 py-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF0DC] border border-[#D49313]/40 text-[#D49313]">
                <SlidersHorizontal size={16} />
              </div>
              <h2 className="font-serif text-[18px] font-bold text-[#593102]">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#593102] px-1.5 text-[11px] font-bold text-white shadow-xs">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[12px] font-bold text-[#8C5E1E] hover:text-[#593102] hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFE6D8] text-[#593102] hover:bg-[#E2D4C0] active:scale-95 transition-all cursor-pointer"
                aria-label="Close filters"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* 2. Scrollable Filter Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 overscroll-contain">
            {/* Search Honey Card */}
            <div className="rounded-2xl bg-white p-4 border border-[#EADCC9] shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("search")}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <p className="text-[14px] font-bold text-[#593102]">Search Honey</p>
                <ChevronDown
                  size={16}
                  className={`text-[#8C5E1E] transition-transform duration-200 ${
                    openSections.search ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.search && (
                <div className="mt-3.5 border-t border-[#F2E8DC] pt-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9A9A]" />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search pure honey..."
                      className="h-10 w-full rounded-xl border border-[#E4E8EE] pl-9 pr-3 text-[13px] outline-none focus:border-[#593102] focus:ring-1 focus:ring-[#593102]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Honey Flora Source Card */}
            <div className="rounded-2xl bg-white p-4 border border-[#EADCC9] shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("category")}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <p className="text-[14px] font-bold text-[#593102]">Honey Flora Source</p>
                <ChevronDown
                  size={16}
                  className={`text-[#8C5E1E] transition-transform duration-200 ${
                    openSections.category ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.category && (
                <div className="mt-3.5 space-y-2 border-t border-[#F2E8DC] pt-3">
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl p-2 text-[13px] text-[#4E4E4E] hover:bg-[#FAF7F2] transition-colors">
                    <input
                      type="radio"
                      checked={!selectedFloraSource}
                      onChange={() => {
                        setSelectedFloraSource("");
                        setSelectedCategorySlug("");
                        setAppliedFilters((prev) => ({ ...prev, floraSource: "", categorySlug: "" }));
                      }}
                      className="h-4 w-4 accent-[#593102]"
                    />
                    <span className="font-semibold text-[#593102]">All Flora Sources ({allProducts.length})</span>
                  </label>
                  {floraSources.map((source) => (
                    <label
                      key={source}
                      className="flex cursor-pointer items-start gap-2.5 rounded-xl p-2 text-[13px] text-[#4E4E4E] hover:bg-[#FAF7F2] transition-colors leading-snug"
                    >
                      <input
                        type="radio"
                        checked={selectedFloraSource === source}
                        onChange={() => {
                          setSelectedFloraSource(source);
                          setSelectedCategorySlug("");
                          setAppliedFilters((prev) => ({ ...prev, floraSource: source, categorySlug: "" }));
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#593102]"
                      />
                      <span className={selectedFloraSource === source ? "font-bold text-[#593102]" : ""}>
                        {source}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Net Weight Card */}
            <div className="rounded-2xl bg-white p-4 border border-[#EADCC9] shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("weight")}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <p className="text-[14px] font-bold text-[#593102]">Net Weight</p>
                <ChevronDown
                  size={16}
                  className={`text-[#8C5E1E] transition-transform duration-200 ${
                    openSections.weight ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.weight && (
                <div className="mt-3.5 border-t border-[#F2E8DC] pt-3">
                  <div className="flex flex-wrap gap-2">
                    {weightOptions.map((weight) => {
                      const isSelected = selectedWeights.includes(weight);
                      return (
                        <button
                          key={weight}
                          type="button"
                          onClick={() => toggleWeight(weight)}
                          className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#593102] text-white shadow-xs"
                              : "bg-[#FAF7F2] text-[#4E4E4E] border border-[#EADCC9] hover:border-[#D49313]"
                          }`}
                        >
                          {weight} {isSelected && "✓"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Price Range Card */}
            <div className="rounded-2xl bg-white p-4 border border-[#EADCC9] shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection("price")}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <p className="text-[14px] font-bold text-[#593102]">Price Range</p>
                <ChevronDown
                  size={16}
                  className={`text-[#8C5E1E] transition-transform duration-200 ${
                    openSections.price ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.price && (
                <div className="mt-3.5 border-t border-[#F2E8DC] pt-3">
                  <div className="flex items-center justify-between text-[13px] font-bold text-[#593102]">
                    <span className="rounded-lg bg-[#FAF7F2] border border-[#EADCC9] px-2.5 py-1 text-[12px]">
                      Rs. {MIN_PRICE}
                    </span>
                    <span className="text-[11px] text-[#8C7A6B]">to</span>
                    <span className="rounded-lg bg-[#FAF0DC] border border-[#D49313]/40 px-2.5 py-1 text-[12px] text-[#593102]">
                      Rs. {priceRange}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    value={priceRange}
                    onChange={(event) => setPriceRange(Number(event.target.value))}
                    className="mt-3 w-full accent-[#593102] cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 z-20 border-t border-[#EADCC9] bg-[#FAF7F2]/95 px-5 py-4 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={applyFilters}
              disabled={filterLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#593102] via-[#7A450A] to-[#593102] hover:from-[#D49313] hover:to-[#593102] py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              {filterLoading && <Loader2 size={16} className="animate-spin" />}
              Apply Filters
            </button>
          </div>
        </div>
      </div>

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
