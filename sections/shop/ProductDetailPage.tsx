"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Info,
  Box,
  Heart,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Share2,
  Play,
  CheckCircle2,
  MapPin,
  Truck,
  ShieldCheck,
  X,
} from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL, getStoredSession, getStoredToken } from "@/lib/auth";
import { getCategoryName, getProductImages, getProductVariants, getPrimaryImage, getProductName, isVariantOutOfStock, getVariantId } from "@/lib/api-products";

const accordionSections = [
  {
    key: "description",
    icon: Info,
    title: "Description",
    content:
      "Our honey is harvested straight from the hive and bottled without heat processing, preserving its natural enzymes, aroma, and nutrients.",
  },
  {
    key: "nutrition",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D49313" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="11" r="3" />
      </svg>
    ),
    title: "Nutritional Info",
    content:
      "Per 100g: Energy ~304 kcal, Carbohydrates 82g, Sugars 82g, Protein 0.3g, Fat 0g. Values may vary slightly by batch.",
  },
  {
    key: "details",
    icon: Box,
    title: "Product Details",
    content:
      "Raw and unfiltered honey, cold-extracted and packed in food-grade glass jars. No additives, no preservatives.",
  },
  {
    key: "benefits",
    icon: Heart,
    title: "Benefits Raw Honey",
    content:
      "Raw honey retains natural antioxidants, enzymes, and pollen that are typically lost in commercial processing, supporting immunity and gut health.",
  },
  {
    key: "ecosystem",
    icon: Heart,
    title: "Ecosystem Advantage",
    content:
      "Every jar supports local beekeepers and sustainable pollination practices, helping protect bee populations and local biodiversity.",
  },
];

export default function ProductDetailPage({
  product,
  recommendations = [],
}: {
  product: any;
  recommendations?: any[];
}) {
  const { cartItems, fetchCart, openCart, updateQuantity, addToCart } = useCart();
  const router = useRouter();

  // Recommendations Carousel Ref & Auto-scroll state
  const recSliderRef = useRef<HTMLDivElement>(null);
  const [isRecHovered, setIsRecHovered] = useState(false);

  // Recommendations Auto-Scroll (Every 2 seconds, hidden scrollbar, pauses on hover)
  useEffect(() => {
    if (!recommendations || recommendations.length === 0 || isRecHovered) return;
    const interval = setInterval(() => {
      if (recSliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = recSliderRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const cardsVisible = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1;
        const step = (clientWidth + 24) / cardsVisible;

        if (scrollLeft + step >= maxScroll - 15) {
          recSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          recSliderRef.current.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [recommendations, isRecHovered]);

  const redirectToLogin = () => {
    router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
  };

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToastMessage = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 1. Dynamic Media Gallery (Images + Videos)
  const mediaList = useMemo(() => {
    const list: any[] = [];

    const images = getProductImages(product);
    if (images.length > 0) {
      images.forEach((img: any) => {
        list.push({
          id: img._id,
          type: "image",
          url: img.image_url,
          primary: img.is_primary,
        });
      });
    }

    if (product?.videoDocumentId) {
      const vids = Array.isArray(product.videoDocumentId)
        ? product.videoDocumentId
        : [product.videoDocumentId];
      vids.forEach((vid: any) => {
        if (vid?.video_url) {
          list.push({
            id: vid._id || "vid-1",
            type: "video",
            url: vid.video_url,
            thumbnail: vid.thumbnail_url || "/placeholder.png",
            primary: false,
          });
        }
      });
    }

    return list;
  }, [product]);

  // 2. Dynamic Weight Variants
  const variants = useMemo(() => {
    return getProductVariants(product);
  }, [product]);

  // Selected States
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  // Recommendations state for selected variants per product ID
  const [recSelectedVariants, setRecSelectedVariants] = useState<Record<string, string>>({});

  // Wishlist store state (Array of Product IDs)
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Local quantity picker
  const [selectedQty, setSelectedQty] = useState(1);

  // Fetch current user's wishlist
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const products = data?.data?.products || [];
        const ids = products.map((item: any) => item.productId?._id || item.productId || item._id);
        setWishlistIds(ids);

        window.dispatchEvent(new CustomEvent('wishlist-count-update', {
          detail: { count: ids.length }
        }));
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  // Sync initial selections
  useEffect(() => {
    if (mediaList.length > 0) {
      const primaryMedia = mediaList.find((x) => x.primary) || mediaList[0];
      setSelectedMedia(primaryMedia);
    }
    if (variants.length > 0) {
      const inStockVariant = variants.find((v) => !isVariantOutOfStock(v));
      setSelectedVariant(inStockVariant || variants[0]);
    }
  }, [product, mediaList, variants]);

  useEffect(() => {
    setSelectedQty(1);
  }, [selectedVariant?._id]);

  // Pincode Details Type & State
  type PincodeDetails = {
    type: "success" | "error" | null;
    message: string;
    pincode: string;
    city?: string;
    state?: string;
    district?: string;
    cod?: boolean;
    courier?: string;
    couriersList?: string[];
    deliveryInfo?: {
      day1: number;
      ord1: string;
      month1: string;
      day2: number;
      ord2: string;
      month2: string;
      rawDate?: string;
    };
    rawData?: any;
  };

  const [pincode, setPincode] = useState("");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<PincodeDetails>({ type: null, message: "", pincode: "" });
  const [isPincodeDropdownOpen, setIsPincodeDropdownOpen] = useState(false);

  const [openSection, setOpenSection] = useState<string | null>(null);

  // Computed Dynamic Prices & Discount Percent
  const currentPrice = selectedVariant?.price ?? 0;
  const currentMrp = selectedVariant?.mrp ?? 0;
  const currentSave = selectedVariant?.you_save ?? 0;

  // 🎯 DISCOUNT CALCULATION (API field OR Dynamic MRP Calculation)
  const discountPercent = useMemo(() => {
    if (selectedVariant?.discount_value) {
      return Math.round(Number(selectedVariant.discount_value));
    }
    if (currentMrp > 0 && currentPrice < currentMrp) {
      return Math.round(((currentMrp - currentPrice) / currentMrp) * 100);
    }
    return 0;
  }, [selectedVariant, currentMrp, currentPrice]);

  // ---------------- Local quantity picker (+/-) ---------------- //
  const incrementQty = () => setSelectedQty((q) => q + 1);
  const decrementQty = () => setSelectedQty((q) => Math.max(1, q - 1));

  // ---------------- API FUNCTIONS ---------------- //

  // 1. Add to Cart Function (Guest & Logged-In)
  const handleAddToCart = async (redirect = false) => {
    if (!selectedVariant) return;

    try {
      setBtnLoading(true);
      const weightLabel = selectedVariant.weight ? `${selectedVariant.weight}${selectedVariant.unit || "g"}` : "";
      const price = selectedVariant.price ?? product.price ?? 0;
      const image = getPrimaryImage(product) || "/placeholder.png";

      // Call context addToCart (handles guest localStorage fallback)
      await addToCart(
        product._id,
        selectedVariant._id,
        {
          type: "NORMAL",
          productId: product._id,
          variantId: selectedVariant._id,
          productName: getProductName(product),
          image,
          price,
          weight: weightLabel,
          quantity: selectedQty,
        },
        selectedQty
      );

      setSelectedQty(1);
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new CustomEvent("trigger-live-update"));

      if (redirect) {
        router.push("/cart");
      } else if (openCart) {
        openCart();
      }
    } catch (err) {
      console.error("Failed to update cart:", err);
    } finally {
      setBtnLoading(false);
    }
  };

  // 2. Wishlist Toggle Function (Guest & Logged-In)
  const handleToggleWishlist = async (productId: string) => {
    const isWishlisted = wishlistIds.includes(productId);

    try {
      if (isWishlisted) {
        const res = await fetch(`${API_BASE_URL}/api/wishlist/remove/${productId}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          const { toggleGuestWishlist } = await import("@/lib/wishlist");
          const result = toggleGuestWishlist(productId);
          setWishlistIds(result.wishlistIds);
          showToastMessage("Removed from wishlist ❌", "success");
          return;
        }

        if (res.ok) {
          const newCount = wishlistIds.length - 1;
          setWishlistIds((prev) => prev.filter((id) => id !== productId));

          window.dispatchEvent(new CustomEvent('wishlist-count-update', {
            detail: { count: newCount }
          }));

          showToastMessage("Removed from wishlist ❌", "success");
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/wishlist/add/${productId}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          const { toggleGuestWishlist } = await import("@/lib/wishlist");
          const result = toggleGuestWishlist(productId);
          setWishlistIds(result.wishlistIds);
          showToastMessage("Added to wishlist! ❤️", "success");
          return;
        }

        if (res.ok) {
          const newCount = wishlistIds.length + 1;
          setWishlistIds((prev) => [...prev, productId]);

          window.dispatchEvent(new CustomEvent('wishlist-count-update', {
            detail: { count: newCount }
          }));

          showToastMessage("Added to wishlist! ❤️", "success");
        }
      }
    } catch (err) {
      const { toggleGuestWishlist } = await import("@/lib/wishlist");
      const result = toggleGuestWishlist(productId);
      setWishlistIds(result.wishlistIds);
      showToastMessage(isWishlisted ? "Removed from wishlist ❌" : "Added to wishlist! ❤️", "success");
    }
  };

  // 3. Recommendation Variant Select Helper
  const handleRecVariantSelect = (recProductId: string, variantId: string) => {
    setRecSelectedVariants((prev) => ({
      ...prev,
      [recProductId]: variantId,
    }));
  };

  // 4. Recommendation Add to Cart
  const handleRecommendationCartAction = async (item: any) => {
    const itemVariants = item.variantDocumentId || [];
    const selectedVariantId = recSelectedVariants[item._id] || itemVariants[0]?._id;
    const variant = itemVariants.find((v: any) => v._id === selectedVariantId) || itemVariants[0];

    if (!variant) return;

    const weightLabel = variant.weight ? `${variant.weight}${variant.unit || "g"}` : "";
    const price = variant.price || 0;
    const image = item.imageDocumentId?.[0]?.image_url || item.image?.image_url || "/placeholder.png";

    try {
      await addToCart(item._id, variant._id, {
        type: "NORMAL",
        productId: item._id,
        variantId: variant._id,
        productName: item.product_name,
        image,
        price,
        weight: weightLabel,
      });
    } catch (err) {
      console.error("Failed to update recommendation cart:", err);
    }
  };

  const handleCheckPincode = async () => {
    const trimmedPincode = pincode.trim();
    if (!trimmedPincode) {
      setPincodeStatus({
        type: "error",
        message: "Please enter a valid 6-digit pincode.",
        pincode: "",
      });
      setIsPincodeDropdownOpen(true);
      return;
    }
    const isPincodeValid = /^[1-9][0-9]{5}$/.test(trimmedPincode);
    if (!isPincodeValid) {
      setPincodeStatus({
        type: "error",
        message: "Invalid pincode structure. Enter 6 digits.",
        pincode: trimmedPincode,
      });
      setIsPincodeDropdownOpen(true);
      return;
    }

    try {
      setIsCheckingPincode(true);
      setPincodeStatus({ type: null, message: "", pincode: trimmedPincode });
      setIsPincodeDropdownOpen(true);

      const token = getStoredToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Call Admin Pincode Check API Endpoint requested by user
      let res = await fetch(`${API_BASE_URL}/api/order-service/checkdeliveryavailabilitybyadmin`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ pincode: trimmedPincode }),
      });

      if (!res.ok) {
        // Fallback to standard endpoint if needed
        res = await fetch(`${API_BASE_URL}/api/order-service/checkdeliveryavailability`, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify({ pincode: trimmedPincode }),
        });
      }

      const data = await res.json().catch(() => ({}));
      const isSuccess = res.ok && data?.success !== false && data?.status !== "error" && data?.error === undefined;

      const findDateInObj = (obj: any): string | null => {
        if (!obj || typeof obj !== "object") return null;
        const targetKeys = [
          "expected_delivery_date",
          "expectedDeliveryDate",
          "expected_date",
          "expectedDate",
          "delivery_date",
          "deliveryDate",
          "estimated_delivery_date",
          "estimated_delivery",
          "estimatedDeliveryDate",
          "date",
          "etd",
        ];
        for (const key of targetKeys) {
          if (obj[key] && typeof obj[key] === "string") return obj[key];
        }
        for (const k of Object.keys(obj)) {
          if (typeof obj[k] === "object" && obj[k] !== null) {
            const found = findDateInObj(obj[k]);
            if (found) return found;
          }
        }
        return null;
      };

      let rawDate = findDateInObj(data);
      if (!rawDate) {
        const future = new Date();
        future.setDate(future.getDate() + 5);
        rawDate = future.toISOString().split("T")[0];
      }

      const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
      };

      let deliveryInfo: any = null;
      try {
        const d1 = new Date(rawDate);
        if (!isNaN(d1.getTime())) {
          const d2 = new Date(d1);
          d2.setDate(d2.getDate() + 1);

          const day1 = d1.getDate();
          const ord1 = getOrdinal(day1);
          const month1 = d1.toLocaleDateString("en-US", { month: "short" });

          const day2 = d2.getDate();
          const ord2 = getOrdinal(day2);
          const month2 = d2.toLocaleDateString("en-US", { month: "short" });

          deliveryInfo = { day1, ord1, month1, day2, ord2, month2, rawDate };
        }
      } catch {}

      const findField = (keys: string[], obj: any): any => {
        if (!obj || typeof obj !== "object") return undefined;
        for (const k of keys) {
          if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
        }
        for (const key of Object.keys(obj)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            const found = findField(keys, obj[key]);
            if (found !== undefined) return found;
          }
        }
        return undefined;
      };

      const city = findField(["city", "city_name", "cityName", "district", "area"], data) || "";
      const state = findField(["state", "state_name", "stateName", "region"], data) || "";
      const district = findField(["district", "district_name"], data) || "";
      const codVal = findField(["cod", "is_cod", "cod_available", "isCodAvailable", "cash_on_delivery"], data);
      const cod = codVal !== undefined ? Boolean(codVal) : true;
      const courier = findField(["courier", "courier_name", "express_courier", "carrier"], data) || "";
      const couriersList = Array.isArray(data?.available_couriers || data?.data?.available_couriers || data?.couriers)
        ? (data?.available_couriers || data?.data?.available_couriers || data?.couriers)
        : [];

      const msg = data?.message || data?.msg || data?.data?.message || (isSuccess ? "Delivery is available at this pincode." : "Delivery is not available at this pincode.");

      setPincodeStatus({
        type: isSuccess ? "success" : "error",
        message: msg,
        pincode: trimmedPincode,
        city: typeof city === "string" ? city : "",
        state: typeof state === "string" ? state : "",
        district: typeof district === "string" ? district : "",
        cod,
        courier: typeof courier === "string" ? courier : "",
        couriersList: Array.isArray(couriersList) ? couriersList : [],
        deliveryInfo: deliveryInfo || undefined,
        rawData: data,
      });

      setIsPincodeDropdownOpen(true);
    } catch (err) {
      console.error("Error checking pincode availability:", err);
      setPincodeStatus({
        type: "error",
        message: "Failed to check delivery availability. Please try again.",
        pincode: trimmedPincode,
      });
      setIsPincodeDropdownOpen(true);
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const scrollRecLeft = () => {
    if (recSliderRef.current) {
      recSliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRecRight = () => {
    if (recSliderRef.current) {
      recSliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (!product) return null;

  return (
    <main className="bg-[#FAF7F2] min-h-screen text-[#2F241C] pb-24 lg:pb-12 font-sans scroll-smooth">
      <div className="max-w-[1350px] mx-auto px-4 py-3 sm:py-4">
        {/* MAIN GRID - DESKTOP STICKY GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* LEFT MEDIA COLUMN (DESKTOP STICKY GALLERY BELOW HEADER) */}
          <div className="lg:col-span-6 flex flex-col-reverse lg:flex-row gap-4 lg:sticky lg:top-[120px] lg:self-start z-10">

            {/* THUMBNAILS (Desktop vertical column / Mobile horizontal scroll) */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none shrink-0">
              {mediaList.map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className={`relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl border bg-white transition-colors cursor-pointer ${selectedMedia?.id === item.id
                      ? "border-[#D49313] ring-2 ring-[#D49313]/40"
                      : "border-[#EADCC9] hover:border-[#D49313]"
                    }`}
                >
                  <Image
                    src={item.type === "video" ? item.thumbnail : item.url}
                    alt={product.product_name || "Thumbnail"}
                    width={68}
                    height={68}
                    className="h-full w-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play size={16} className="text-white fill-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* MAIN MEDIA DISPLAY */}
            <div className="bg-[#FAF6F0] border border-[#EADCC9] rounded-3xl p-4 md:p-6 flex items-center justify-center relative w-full h-[380px] sm:h-[480px] lg:h-[540px] overflow-hidden shadow-2xs">
              {selectedMedia?.type === "video" ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                selectedMedia?.url && (
                  <Image
                    src={selectedMedia.url}
                    alt={product.product_name || "Product Media"}
                    fill
                    className="object-contain p-2 rounded-2xl"
                    priority
                  />
                )
              )}
            </div>
          </div>

          {/* RIGHT PRODUCT DETAILS COLUMN */}
          <div className="lg:col-span-6 space-y-6 relative pt-3 lg:pt-5">
            {/* Product Category Tag & Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/50 px-3.5 py-1.5 rounded-full shadow-2xs">
                <span className="text-[12px] font-black text-[#593102] uppercase tracking-wider">
                  {getCategoryName(product) || "Pure Honey"}
                </span>
              </div>

              <div className="flex justify-between items-start w-full gap-4 pt-1">
                <h1 className="font-serif text-[32px] sm:text-[38px] md:text-[44px] font-extrabold text-[#593102] leading-tight tracking-tight">
                  {product.product_name}
                </h1>
                <div className="flex items-center gap-3 mt-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleWishlist(product._id)}
                    aria-label="Wishlist"
                    className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#EADCC9] flex items-center justify-center transition-all hover:border-[#D49313]"
                  >
                    <Heart
                      size={20}
                      className={`transition-colors ${wishlistIds.includes(product._id)
                          ? "fill-[#FA4B1B] text-[#FA4B1B]"
                          : "text-gray-400 hover:text-[#FA4B1B]"
                        }`}
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Share product"
                    className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#EADCC9] flex items-center justify-center text-gray-500 hover:text-[#593102] hover:border-[#D49313] transition-all"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews & Offer Badge */}
            <div className="flex justify-between items-center w-full pt-1">
              <span className="text-[14px] text-[#7A6A5C] font-medium tracking-wide">
                Reviews: {product.total_reviews ?? 0}
              </span>

              {/* DYNAMIC OFFER BADGE DISPLAY */}
              <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] text-white text-[11px] font-black px-3.5 py-1.5 rounded-full tracking-wide uppercase shadow-2xs">
                {discountPercent > 0 ? `${discountPercent}% OFF` : "OFFER"}
              </span>
            </div>

            {/* Price Block */}
            <div className="space-y-1">
              <div className="relative inline-flex items-center text-[14px] text-[#FA4B1B] font-normal line-through decoration-[#FA4B1B]">
                <span>M.R.P ₹{currentMrp}</span>
              </div>
              <div className="text-[38px] sm:text-[44px] font-serif font-extrabold text-[#593102] leading-none tracking-tight pt-1">
                ₹{currentPrice}
              </div>
              {currentSave > 0 && (
                <div className="text-[14px] font-extrabold text-[#D49313] tracking-wide">
                  You Save ₹{currentSave} ({discountPercent}% OFF)
                </div>
              )}
              <p className="text-[13px] text-[#7A6A5C] font-medium mt-1">
                Inclusive of all taxes.
              </p>
            </div>

            {/* Delivery Details */}
            <div className="space-y-2.5 max-w-xl">
              <h3 className="text-[14px] font-bold text-[#593102] uppercase tracking-wider">
                Check Delivery Availability
              </h3>

              {/* Input Box */}
              <div className="flex flex-col sm:flex-row border border-[#EADCC9] rounded-2xl overflow-hidden bg-white shadow-2xs focus-within:border-[#D49313] transition-colors">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode (e.g. 110057)"
                  value={pincode}
                  maxLength={6}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPincode(val);
                    if (pincodeStatus.type) {
                      setPincodeStatus({ type: null, message: "", pincode: "" });
                      setIsPincodeDropdownOpen(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCheckPincode();
                  }}
                  className="flex-1 px-4 py-3 text-[15px] placeholder-gray-400 font-medium focus:outline-none bg-white text-gray-800"
                />
                <button
                  type="button"
                  onClick={handleCheckPincode}
                  disabled={isCheckingPincode}
                  className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] disabled:opacity-50 text-white px-7 py-3 text-[13px] font-black tracking-widest uppercase flex-shrink-0 cursor-pointer transition-all border-l border-[#FFD700]/30 shadow-sm"
                >
                  {isCheckingPincode ? "CHECKING..." : "CHECK"}
                </button>
              </div>

              {/* 🎯 PINCODE AVAILABILITY DROPDOWN CONTAINER */}
              {pincodeStatus.type !== null && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-[#EADCC9] bg-white shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Dropdown Header / Toggle Bar */}
                  <button
                    type="button"
                    onClick={() => setIsPincodeDropdownOpen(!isPincodeDropdownOpen)}
                    className={`w-full px-4 py-3 flex items-center justify-between transition-colors cursor-pointer text-left ${
                      pincodeStatus.type === "success"
                        ? "bg-[#FAF0DC]/90 hover:bg-[#FAF0DC]"
                        : "bg-red-50/90 hover:bg-red-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        pincodeStatus.type === "success" ? "bg-[#16A34A] text-white" : "bg-red-600 text-white"
                      }`}>
                        {pincodeStatus.type === "success" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </div>
                      <div>
                        <span className={`text-[14px] font-black tracking-wide ${
                          pincodeStatus.type === "success" ? "text-[#16A34A]" : "text-red-600"
                        }`}>
                          {pincodeStatus.type === "success"
                            ? `Pincode ${pincodeStatus.pincode || pincode} is Serviceable!`
                            : `Pincode ${pincodeStatus.pincode || pincode} is Non-Serviceable`}
                        </span>
                        <p className="text-[11.5px] font-semibold text-[#6E5D4F] leading-tight">
                          Click to {isPincodeDropdownOpen ? "collapse" : "expand"} delivery details
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[#593102]">
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          isPincodeDropdownOpen ? "rotate-180 text-[#D49313]" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Expandable Details Body */}
                  {isPincodeDropdownOpen && (
                    <div className="p-4 sm:p-5 border-t border-[#EADCC9]/60 space-y-4 bg-gradient-to-b from-white to-[#FFFDF9]">
                      {/* Delivery Date Highlight */}
                      {pincodeStatus.type === "success" && pincodeStatus.deliveryInfo ? (
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF0DC]/60 border border-[#D49313]/30">
                          <Truck className="w-6 h-6 text-[#D49313] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#593102] block">
                              Estimated Delivery Date
                            </span>
                            <p className="text-[15px] font-bold text-[#16A34A] mt-0.5">
                              {pincodeStatus.deliveryInfo.day1}
                              <sup className="text-[10px] lowercase">{pincodeStatus.deliveryInfo.ord1}</sup>
                              {pincodeStatus.deliveryInfo.month1 === pincodeStatus.deliveryInfo.month2 ? (
                                <>
                                  {" – "}
                                  {pincodeStatus.deliveryInfo.day2}
                                  <sup className="text-[10px] lowercase">{pincodeStatus.deliveryInfo.ord2}</sup>
                                  {" "}
                                  {pincodeStatus.deliveryInfo.month1}
                                </>
                              ) : (
                                <>
                                  {" "}
                                  {pincodeStatus.deliveryInfo.month1}
                                  {" – "}
                                  {pincodeStatus.deliveryInfo.day2}
                                  <sup className="text-[10px] lowercase">{pincodeStatus.deliveryInfo.ord2}</sup>
                                  {" "}
                                  {pincodeStatus.deliveryInfo.month2}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className={`text-[13px] font-semibold ${
                          pincodeStatus.type === "success" ? "text-[#16A34A]" : "text-red-600"
                        }`}>
                          {pincodeStatus.message}
                        </p>
                      )}

                      {/* Location & Service Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                        {/* City / State */}
                        {(pincodeStatus.city || pincodeStatus.state) && (
                          <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#EADCC9] bg-white">
                            <MapPin size={16} className="text-[#D49313] shrink-0" />
                            <div>
                              <span className="text-[10px] font-bold text-[#8D7F73] uppercase block">Location</span>
                              <span className="font-extrabold text-[#593102]">
                                {[pincodeStatus.city, pincodeStatus.state].filter(Boolean).join(", ")}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Cash on Delivery */}
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#EADCC9] bg-white">
                          <ShieldCheck size={16} className="text-[#16A34A] shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold text-[#8D7F73] uppercase block">Payment Options</span>
                            <span className="font-extrabold text-[#593102]">
                              {pincodeStatus.cod ? "Prepaid & Cash on Delivery (COD)" : "Prepaid Delivery Available"}
                            </span>
                          </div>
                        </div>

                        {/* Courier Partner */}
                        {pincodeStatus.courier && (
                          <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#EADCC9] bg-white col-span-1 sm:col-span-2">
                            <Truck size={16} className="text-[#593102] shrink-0" />
                            <div>
                              <span className="text-[10px] font-bold text-[#8D7F73] uppercase block">Courier Partner</span>
                              <span className="font-extrabold text-[#593102]">
                                {pincodeStatus.courier}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quality Assurance Badges */}
                      <div className="pt-2 border-t border-[#EADCC9]/50 flex items-center justify-between text-[11px] font-bold text-[#6E5D4F] flex-wrap gap-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> Safe Glass Jar Packaging
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#D49313]" /> Pan-India Express Shipping
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Weight Selection */}
            {variants.length > 0 && (
              <div className="space-y-3 pt-1">
                <h3 className="text-[14px] font-bold text-[#593102] uppercase tracking-wider">
                  Select Pack Size
                </h3>
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  {variants.map((option: any) => {
                    const outOfStock = isVariantOutOfStock(option);
                    const isSelectedOption = getVariantId(selectedVariant) === getVariantId(option);

                    return (
                      <button
                        key={getVariantId(option) || option.weight}
                        onClick={() => setSelectedVariant(option)}
                        className={`relative flex flex-col items-center rounded-2xl border w-[100px] sm:w-[110px] py-3.5 transition-all overflow-hidden cursor-pointer ${
                          outOfStock
                            ? isSelectedOption
                              ? "border-red-500 bg-red-50 ring-2 ring-red-300 shadow-md"
                              : "border-red-300 bg-red-50/70"
                            : isSelectedOption
                            ? "border-[#D49313] bg-[#FAF0DC]/40 ring-2 ring-[#D49313]/50 shadow-md"
                            : "border-[#EADCC9] bg-white hover:border-[#D49313]/60"
                        }`}
                      >
                        {/* Red Diagonal Cross Line for out of stock variant */}
                        {outOfStock && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-20">
                            <div className="w-[160%] h-[2.5px] bg-red-600 rotate-[-25deg] shadow-xs" />
                          </div>
                        )}

                        <span className={`text-[13px] font-extrabold ${outOfStock ? "text-red-700 line-through decoration-red-600 decoration-2" : "text-[#593102]"}`}>
                          {option.weight}{option.unit}
                        </span>

                        <div className={`relative my-2 h-[42px] w-[42px] overflow-hidden rounded-xl border ${outOfStock ? "border-red-200 opacity-50 grayscale" : "border-[#EADCC9]"}`}>
                          {mediaList[0]?.url && (
                            <Image
                              src={mediaList[0]?.type === "video" ? mediaList[0]?.thumbnail : mediaList[0]?.url}
                              alt={`${option.weight}${option.unit}`}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        {outOfStock ? (
                          <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-tight bg-red-600 px-2 py-0.5 rounded-full z-30 shadow-xs -mb-0.5">
                            OUT OF STOCK
                          </span>
                        ) : (
                          <span className="text-[13px] font-bold text-[#D49313]">
                            ₹{option.price}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Cart Actions (Desktop) */}
            {(() => {
              const isSelectedVariantOutOfStock = selectedVariant ? isVariantOutOfStock(selectedVariant) : false;

              return (
                <div className="hidden lg:block space-y-3 pt-2">
                  <h3 className="text-[14px] font-bold text-[#593102] uppercase tracking-wider">Quantity</h3>

                  <div className="flex items-center gap-3 max-w-xl">
                    {/* Quantity Buttons */}
                    <div className={`flex items-center border border-[#EADCC9] rounded-xl bg-white w-[140px] h-[46px] px-3 shadow-2xs ${isSelectedVariantOutOfStock ? "opacity-50 pointer-events-none" : ""}`}>
                      <button
                        disabled={isSelectedVariantOutOfStock}
                        onClick={decrementQty}
                        className="p-1 text-[#593102] hover:text-[#FA4B1B] text-xl font-semibold cursor-pointer disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-extrabold text-[16px] text-[#593102]">
                        {selectedQty}
                      </span>
                      <button
                        disabled={isSelectedVariantOutOfStock}
                        onClick={incrementQty}
                        className="p-1 text-[#593102] hover:text-[#FA4B1B] text-xl font-semibold cursor-pointer disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    {/* Single Primary Add To Cart Button */}
                    <button
                      disabled={btnLoading || isSelectedVariantOutOfStock}
                      onClick={() => handleAddToCart(false)}
                      className={`flex-1 max-w-[320px] h-[46px] px-8 rounded-xl font-extrabold transition-all duration-200 text-[13.5px] tracking-wide uppercase text-center shadow-sm flex items-center justify-center ${
                        isSelectedVariantOutOfStock
                          ? "bg-gray-300 text-gray-500 border border-gray-300 shadow-none cursor-not-allowed opacity-80"
                          : "bg-[#FA4B1B] hover:bg-[#E64216] text-white cursor-pointer active:scale-98 disabled:opacity-50"
                      }`}
                    >
                      {isSelectedVariantOutOfStock
                        ? "OUT OF STOCK"
                        : btnLoading
                        ? "ADDING..."
                        : `ADD TO CART · ₹${currentPrice * selectedQty}`}
                    </button>
                  </div>
                </div>
              );
            })()}


            {/* Accordions */}
            <div className="pt-6 max-w-xl">
              <div className="w-full text-center mb-6">
                <a href="#compare" className="font-serif text-[20px] sm:text-[24px] font-bold text-[#593102] underline underline-offset-8 decoration-[#D49313] tracking-wide inline-block hover:text-[#D49313] transition-colors">
                  Compare Honey Flora &amp; Benefits
                </a>
              </div>

              <div className="divide-y divide-[#EADCC9] border-t border-[#EADCC9]">
                {accordionSections.map((section) => {
                  const Icon = section.icon;
                  const isOpen = openSection === section.key;
                  return (
                    <div key={section.key} className="py-1">
                      <button
                        onClick={() => setOpenSection(isOpen ? null : section.key)}
                        className="flex w-full items-center justify-between py-4 text-left cursor-pointer"
                      >
                        <span className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-[#FAF0DC] border border-[#D49313]/40 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-[#D49313] stroke-[2]" />
                          </div>
                          <span className="font-serif text-[18px] sm:text-[22px] font-bold text-[#593102] tracking-tight">
                            {section.title}
                          </span>
                        </span>
                        {isOpen ? <ChevronUp size={20} className="text-[#593102] shrink-0" /> : <ChevronDown size={20} className="text-[#7A6A5C] shrink-0" />}
                      </button>
                      {isOpen && (
                        <p className="pb-4 pl-12 text-[14px] leading-relaxed text-[#6E5D4F] font-medium">
                          {section.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* USES OF HONEY BANNER */}
        <div className="mt-14 w-full overflow-hidden rounded-3xl border border-[#EADCC9] shadow-xl">
          <Image
            src="/idcard.png"
            alt="Uses of Honey"
            width={1400}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* RECOMMENDATIONS SECTION - AUTO-SCROLL CAROUSEL */}
        {recommendations.length > 0 && (
          <section className="mt-16">
            <div className="flex flex-col items-start mb-8">
              <span className="uppercase tracking-[0.18em] text-[#593102] text-[12px] font-extrabold bg-[#FAF0DC] border border-[#D49313]/50 px-4 py-1.5 rounded-full shadow-2xs mb-2">
                YOU MAY ALSO LIKE
              </span>
              <h2 className="font-serif text-[30px] sm:text-[38px] font-extrabold text-[#593102]">
                Recommended Honey Collections
              </h2>
            </div>

            {/* Auto-scroll Slider Container (Hidden Scrollbar) */}
            <div
              ref={recSliderRef}
              onMouseEnter={() => setIsRecHovered(true)}
              onMouseLeave={() => setIsRecHovered(false)}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pt-3 pb-8 px-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {recommendations.map((item: any) => {
                const recVariants = item.variantDocumentId || [];
                const selectedVariantId = recSelectedVariants[item._id] || recVariants[0]?._id;
                const recVariant = recVariants.find((v: any) => v._id === selectedVariantId) || recVariants[0];

                const primaryImage =
                  item.imageDocumentId?.find((x: any) => x.is_primary)?.image_url ||
                  item.imageDocumentId?.[0]?.image_url || "";
                const weightStr = `${recVariant?.weight ?? ""}${recVariant?.unit ?? ""}`;

                return (
                  <div
                    key={item._id || item.id}
                    className="w-[calc(100%-24px)] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col h-full"
                  >
                    <ProductCardShop
                      badge={getCategoryName(item)}
                      image={primaryImage}
                      title={item.product_name}
                      subtitle={getCategoryName(item)}
                      weight={weightStr}
                      price={recVariant?.price ?? 0}
                      oldPrice={recVariant?.mrp ?? 0}
                      rating={item.average_rating}
                      reviews={item.total_reviews}
                      quantity={cartItems[item._id]?.quantity ?? 0}
                      variants={recVariants}
                      selectedVariantId={selectedVariantId}
                      onVariantSelect={(vId: string) => handleRecVariantSelect(item._id, vId)}
                      onAddToCart={() => handleRecommendationCartAction(item)}
                      onBuyNow={async () => {
                        const token = getStoredToken();
                        const session = getStoredSession();
                        if (!token || !session || !session.user?.mobile) {
                          router.push("/login");
                          return;
                        }
                        await handleRecommendationCartAction(item);
                        router.push("/cart");
                      }}
                      onIncrement={() => handleRecommendationCartAction(item)}
                      onDecrement={() => handleRecommendationCartAction(item)}
                      onOpenDetails={() => router.push(`/shop/products/${item._id}`)}
                      onToggleWishlist={() => handleToggleWishlist(item._id)}
                      isWishlisted={wishlistIds.includes(item._id)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in duration-200">
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-gradient-to-r from-[#593102] via-[#7A450A] to-[#593102] border border-[#D49313]/50 px-7 py-3.5 text-white font-extrabold shadow-2xl flex items-center gap-2 text-[14px]">
            <span>✨</span> {toastMessage}
          </div>
        </div>
      )}

      {/* MOBILE STICKY BAR */}
      {(() => {
        const isSelectedVariantOutOfStock = selectedVariant ? isVariantOutOfStock(selectedVariant) : false;

        return (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EADCC9] p-3 sm:p-3.5 lg:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.1)] z-50">
            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className={`flex items-center border-2 border-[#EADCC9] rounded-2xl overflow-hidden bg-white shadow-2xs shrink-0 ${isSelectedVariantOutOfStock ? "opacity-50 pointer-events-none" : ""}`}>
                <button
                  disabled={isSelectedVariantOutOfStock}
                  onClick={decrementQty}
                  className="px-3 py-2.5 hover:bg-gray-50 text-[#593102] font-black text-lg cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-2.5 py-2.5 text-sm font-black min-w-[32px] text-center text-[#593102]">
                  {selectedQty}
                </span>
                <button
                  disabled={isSelectedVariantOutOfStock}
                  onClick={incrementQty}
                  className="px-3 py-2.5 hover:bg-gray-50 text-[#593102] font-black text-lg cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button with Dynamic Total Price */}
              <button
                disabled={btnLoading || isSelectedVariantOutOfStock}
                onClick={() => handleAddToCart(false)}
                className={`flex-1 py-3.5 px-3 rounded-2xl font-extrabold text-[13px] sm:text-[14px] uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  isSelectedVariantOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-[#FA4B1B] hover:bg-[#E64216] text-white cursor-pointer active:scale-98 disabled:opacity-50"
                }`}
              >
                {isSelectedVariantOutOfStock
                  ? "OUT OF STOCK"
                  : btnLoading
                  ? "ADDING..."
                  : `ADD TO CART - ₹${currentPrice * selectedQty}`}
              </button>
            </div>
          </div>
        );
      })()}

    </main>
  );
}

function TastingItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#3F3F3F]">
          {label}
        </p>
        <p className="text-[14px] font-medium text-gray-600 mt-1">{value}</p>
      </div>
    </div>
  );
}
