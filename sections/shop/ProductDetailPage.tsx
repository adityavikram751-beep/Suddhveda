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
} from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";
import { getCategoryName, getProductImages, getProductVariants, getPrimaryImage, getProductName } from "@/lib/api-products";

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
      setSelectedVariant(variants[0]);
    }
  }, [product, mediaList, variants]);

  useEffect(() => {
    setSelectedQty(1);
  }, [selectedVariant?._id]);

  // Pincode State
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

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

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item._id,
          selectedWeight: variant._id,
          quantity: 1,
        }),
      });

      if (res.status === 401) {
        redirectToLogin();
        return;
      }

      if (res.ok) {
        updateQuantity(item._id, variant._id, 1);
        showToastMessage(`${item.product_name} added to cart! 🛒`, "success");
      }
    } catch (err) {
      console.error("Failed to update recommendation cart:", err);
      showToastMessage("Failed to add to cart", "error");
    }
  };

  const handleCheckPincode = () => {
    if (!pincode.trim()) {
      setPincodeStatus({
        type: "error",
        message: "Please enter a valid pincode.",
      });
      return;
    }
    const isPincodeValid = /^[1-9][0-9]{5}$/.test(pincode.trim());
    if (!isPincodeValid) {
      setPincodeStatus({
        type: "error",
        message: "Invalid pincode structure. Enter 6 digits.",
      });
      return;
    }
    setPincodeStatus({
      type: "success",
      message: "Standard delivery available at this location.",
    });
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
            <div className="space-y-1 bg-[#FAF6F0]/60 p-4 rounded-2xl border border-[#EADCC9]/80">
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
            <div className="space-y-2.5">
              <h3 className="text-[14px] font-bold text-[#593102] uppercase tracking-wider">
                Check Delivery Availability
              </h3>
              <div className="flex flex-col sm:flex-row border border-[#EADCC9] rounded-2xl overflow-hidden bg-white max-w-xl shadow-2xs">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    if (pincodeStatus.type) setPincodeStatus({ type: null, message: "" });
                  }}
                  className="flex-1 px-4 py-3 text-[15px] placeholder-gray-400 font-medium focus:outline-none bg-white text-gray-800"
                />
                <button
                  onClick={handleCheckPincode}
                  className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white px-7 py-3 text-[13px] font-black tracking-widest uppercase flex-shrink-0 cursor-pointer transition-all border-l border-[#FFD700]/30 shadow-sm"
                >
                  CHECK
                </button>
              </div>
              {pincodeStatus.type && (
                <p className={`text-[12px] font-bold mt-1 ${pincodeStatus.type === "success" ? "text-emerald-700" : "text-red-600"
                  }`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Weight Selection */}
            {variants.length > 0 && (
              <div className="space-y-3 pt-1">
                <h3 className="text-[14px] font-bold text-[#593102] uppercase tracking-wider">
                  Select Pack Size
                </h3>
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  {variants.map((option: any) => (
                    <button
                      key={option._id}
                      onClick={() => setSelectedVariant(option)}
                      className={`flex flex-col items-center rounded-2xl border w-[100px] sm:w-[110px] py-3.5 bg-white transition-all cursor-pointer ${selectedVariant?._id === option._id
                          ? "border-[#D49313] bg-[#FAF0DC]/40 ring-2 ring-[#D49313]/50 shadow-md"
                          : "border-[#EADCC9] hover:border-[#D49313]/60"
                        }`}
                    >
                      <span className="text-[13px] font-extrabold text-[#593102]">
                        {option.weight}{option.unit}
                      </span>
                      <div className="relative my-2 h-[42px] w-[42px] overflow-hidden rounded-xl border border-[#EADCC9]">
                        {mediaList[0]?.url && (
                          <Image
                            src={mediaList[0]?.type === "video" ? mediaList[0]?.thumbnail : mediaList[0]?.url}
                            alt={`${option.weight}${option.unit}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="text-[13px] font-bold text-[#D49313]">
                        ₹{option.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Cart Actions (Desktop) */}
            <div className="hidden lg:block space-y-3 pt-2">
              <h3 className="text-[14px] font-bold text-[#593102] uppercase tracking-wider">Quantity</h3>

              <div className="flex items-center gap-3 max-w-xl">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-[#EADCC9] rounded-xl bg-white w-[140px] h-[46px] px-3 shadow-2xs">
                  <button
                    onClick={decrementQty}
                    className="p-1 text-[#593102] hover:text-[#FA4B1B] text-xl font-semibold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-extrabold text-[16px] text-[#593102]">
                    {selectedQty}
                  </span>
                  <button
                    onClick={incrementQty}
                    className="p-1 text-[#593102] hover:text-[#FA4B1B] text-xl font-semibold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Single Primary Add To Cart Button - Slightly Larger */}
                <button
                  disabled={btnLoading}
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 max-w-[320px] bg-[#FA4B1B] hover:bg-[#E64216] text-white h-[46px] px-8 rounded-xl font-extrabold transition-all duration-200 text-[13.5px] tracking-wide uppercase disabled:opacity-50 text-center shadow-sm cursor-pointer active:scale-98"
                >
                  {btnLoading ? "ADDING..." : `ADD TO CART · ₹${currentPrice * selectedQty}`}
                </button>
              </div>
            </div>

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
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EADCC9] p-3 sm:p-3.5 lg:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center border-2 border-[#EADCC9] rounded-2xl overflow-hidden bg-white shadow-2xs shrink-0">
            <button
              onClick={decrementQty}
              className="px-3 py-2.5 hover:bg-gray-50 text-[#593102] font-black text-lg cursor-pointer"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-2.5 py-2.5 text-sm font-black min-w-[32px] text-center text-[#593102]">
              {selectedQty}
            </span>
            <button
              onClick={incrementQty}
              className="px-3 py-2.5 hover:bg-gray-50 text-[#593102] font-black text-lg cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button with Dynamic Total Price */}
          <button
            disabled={btnLoading}
            onClick={() => handleAddToCart(false)}
            className="flex-1 bg-[#FA4B1B] hover:bg-[#E64216] text-white py-3.5 px-3 rounded-2xl font-extrabold text-[13px] sm:text-[14px] uppercase tracking-wider disabled:opacity-50 text-center shadow-md cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-1.5"
          >
            {btnLoading ? "ADDING..." : `ADD TO CART - ₹${currentPrice * selectedQty}`}
          </button>
        </div>
      </div>
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
