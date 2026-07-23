"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
  Info,
  Box,
  Heart,
  ChevronDown,
  ChevronUp,
  Share2,
  Play,
} from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D08722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <circle cx="12" cy="11" r="3"/>
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
      "100% raw and unfiltered honey, cold-extracted and packed in food-grade glass jars. No additives, no preservatives.",
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
  const { cartItems, updateQuantity } = useCart();
  const router = useRouter();

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

    if (product?.imageDocumentId) {
      product.imageDocumentId.forEach((img: any) => {
        list.push({
          id: img._id,
          type: "image",
          url: img.image_url,
          primary: img.is_primary,
        });
      });
    }

    if (product?.videoDocumentId) {
      product.videoDocumentId.forEach((vid: any) => {
        list.push({
          id: vid._id,
          type: "video",
          url: vid.video_url,
          thumbnail: vid.thumbnail_url,
          primary: false,
        });
      });
    }

    return list;
  }, [product]);

  // 2. Dynamic Weight Variants
  const variants = useMemo(() => {
    return product?.variantDocumentId || [];
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
        
        // Update wishlist count in header
        window.dispatchEvent(new CustomEvent('wishlist-count-update', { 
          detail: { count: ids.length } 
        }));
        console.log("Wishlist IDs:", ids);
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

  // Computed Dynamic Prices
  const currentPrice = selectedVariant?.price ?? 0;
  const currentMrp = selectedVariant?.mrp ?? 0;
  const currentSave = selectedVariant?.you_save ?? 0;

  // ---------------- Local quantity picker (+/-) ---------------- //
  const incrementQty = () => setSelectedQty((q) => q + 1);
  const decrementQty = () => setSelectedQty((q) => Math.max(1, q - 1));

  // ---------------- API FUNCTIONS ---------------- //

  // 1. Add to Cart Function
  const handleAddToCart = async (redirect = false) => {
    if (!selectedVariant) return;

    try {
      setBtnLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          selectedWeight: selectedVariant._id,
          quantity: selectedQty,
        }),
      });

      if (res.status === 401) {
        redirectToLogin();
        return;
      }

      if (res.ok) {
        updateQuantity(product, selectedQty);
        setSelectedQty(1);

        if (redirect) {
          router.push("/cart");
        }
      }
    } catch (err) {
      console.error("Failed to update cart:", err);
    } finally {
      setBtnLoading(false);
    }
  };

  // 2. Wishlist Toggle Function (Add / Remove) - With color change and count update
  const handleToggleWishlist = async (productId: string) => {
    const isWishlisted = wishlistIds.includes(productId);

    try {
      if (isWishlisted) {
        // Remove from Wishlist
        const res = await fetch(`${API_BASE_URL}/api/wishlist/remove/${productId}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          redirectToLogin();
          return;
        }

        if (res.ok) {
          const newCount = wishlistIds.length - 1;
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          
          // Update count in header
          window.dispatchEvent(new CustomEvent('wishlist-count-update', { 
            detail: { count: newCount } 
          }));
          
          showToastMessage("Removed from wishlist ❌", "success");
        }
      } else {
        // Add to Wishlist
        const res = await fetch(`${API_BASE_URL}/api/wishlist/add/${productId}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) {
          redirectToLogin();
          return;
        }

        if (res.ok) {
          const newCount = wishlistIds.length + 1;
          setWishlistIds((prev) => [...prev, productId]);
          
          // Update count in header
          window.dispatchEvent(new CustomEvent('wishlist-count-update', { 
            detail: { count: newCount } 
          }));
          
          showToastMessage("Added to wishlist! ❤️", "success");
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      showToastMessage("Something went wrong", "error");
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
        updateQuantity(item, 1);
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

  if (!product) return null;

  return (
    <main className={`bg-white min-h-screen text-[#2F241C] ${inter.className}`}>
      <div className="max-w-[1350px] mx-auto px-4 py-6">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_1fr] gap-8">
          
          {/* THUMBNAILS */}
          <div className="hidden lg:flex flex-col gap-3">
            {mediaList.map((item: any) => (
              <button
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className={`relative h-[68px] w-[68px] overflow-hidden rounded border bg-white transition-colors ${
                  selectedMedia?.id === item.id
                    ? "border-[#F1592B]"
                    : "border-[#EEE7DA] hover:border-[#B8860B]"
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
          <div className="bg-[#FFF5E6] rounded-2xl p-4 md:p-8 flex items-center justify-center relative h-[450px] md:h-[630px] overflow-hidden">
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
                  className="object-cover rounded-2xl"
                  priority
                />
              )
            )}
          </div>

          {/* PRODUCT DETAILS */}
          <div className="space-y-6 relative bg-white">
            <div className="flex justify-between items-start w-full">
              <h1 className={`${playfair.className} text-[32px] md:text-[42px] font-medium text-[#1E1E1E] leading-tight tracking-normal`}>
                {product.product_name}
              </h1>
              <div className="flex items-center gap-3 mt-3 mr-1">
                <button
                  type="button"
                  onClick={() => handleToggleWishlist(product._id)}
                  aria-label="Wishlist"
                  className="transition-colors"
                >
                  <Heart
                    size={24}
                    className={`stroke-[1.5] transition-colors ${
                      wishlistIds.includes(product._id)
                        ? "fill-[#FF6F3C] text-[#FF6F3C]"
                        : "text-gray-400 hover:text-[#FF6F3C]"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  aria-label="Share product"
                  className="text-gray-400 hover:text-[#B8860B] transition-colors"
                >
                  <Share2 size={22} className="stroke-[1.5]" />
                </button>
              </div>
            </div>

            {/* Reviews & Offer Badge */}
            <div className="flex justify-between items-center w-full">
              <span className="text-[14px] text-[#7A7A7A] font-normal tracking-wide">
                Reviews: {product.total_reviews ?? 0}
              </span>
              <span className="bg-[#FF6F3C] text-white text-[11px] font-bold px-3 py-1.5 rounded tracking-wide uppercase">
                {selectedVariant?.discount_value ? `${Math.round(selectedVariant.discount_value)}% OFF` : "OFFER"}
              </span>
            </div>

            {/* Price Block */}
            <div className="space-y-1">
              <div className="relative inline-flex items-center text-[13px] text-[#9E9E9E] font-normal">
                <span>M.R.P ₹{currentMrp}</span>
                <span className="absolute left-0 right-[-45px] top-1/2 h-[1px] bg-[#9E9E9E]"></span>
              </div>
              <div className="text-[44px] font-bold text-[#2A2420] leading-none tracking-tight pt-1">
                ₹{currentPrice}
              </div>
              {currentSave > 0 && (
                <div className="text-[14px] font-bold text-[#FF6F3C] tracking-wide">
                  You Save ₹{currentSave}
                </div>
              )}
              <p className="text-[13px] text-[#909090] font-normal mt-1">
                Taxes included. <span className="underline cursor-pointer decoration-gray-400">Shipping</span> calculated at checkout.
              </p>
            </div>

            {/* Delivery Details */}
            <div className="space-y-2">
              <h3 className="text-[14px] font-bold text-[#3F3F3F] tracking-normal">
                Delivery Details
              </h3>
              <div className="flex border border-[#E3DCCE] rounded overflow-hidden bg-white max-w-xl">
                <input
                  type="text"
                  placeholder="Enter your pincode"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    if (pincodeStatus.type) setPincodeStatus({ type: null, message: "" });
                  }}
                  className="flex-1 px-4 py-3 text-[15px] placeholder-gray-400 font-normal focus:outline-none bg-white text-gray-800"
                />
                <button
                  onClick={handleCheckPincode}
                  className="bg-[#241A14] text-white px-9 py-3 text-[13px] font-bold hover:bg-black transition-colors tracking-widest uppercase flex-shrink-0"
                >
                  CHECK
                </button>
              </div>
              {pincodeStatus.type && (
                <p className={`text-[12px] mt-1 ${
                  pincodeStatus.type === "success" ? "text-green-600" : "text-red-500"
                }`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Weight Selection */}
            {variants.length > 0 && (
              <div className="space-y-3 pt-1">
                <h3 className="text-[15px] font-medium text-[#3F3F3F] tracking-normal">Weight</h3>
                <div className="flex gap-4 flex-wrap">
                  {variants.map((option: any) => (
                    <button
                      key={option._id}
                      onClick={() => setSelectedVariant(option)}
                      className={`flex flex-col items-center rounded-md border w-[105px] py-3.5 bg-white transition-all ${
                        selectedVariant?._id === option._id
                          ? "border-[#FF6F3C] ring-[1px] ring-[#FF6F3C]"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <span className="text-[13px] font-normal text-gray-600">
                        {option.weight}{option.unit}
                      </span>
                      <div className="relative my-2 h-[38px] w-[38px] overflow-hidden rounded">
                        {mediaList[0]?.url && (
                          <Image
                            src={mediaList[0]?.type === "video" ? mediaList[0]?.thumbnail : mediaList[0]?.url}
                            alt={`${option.weight}${option.unit}`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="text-[13px] font-normal text-gray-600">
                        ₹{option.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Cart Actions */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[15px] font-medium text-[#3F3F3F] tracking-normal">Quantity</h3>
              
              <div className="flex gap-4 max-w-xl">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-gray-200 rounded bg-white w-[180px] h-[56px] px-2">
                  <button
                    onClick={decrementQty}
                    className="p-2 text-gray-400 hover:text-gray-600 text-xl font-light"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-normal text-[15px] text-gray-800">
                    {selectedQty}
                  </span>
                  <button
                    onClick={incrementQty}
                    className="p-2 text-gray-400 hover:text-gray-600 text-xl font-light"
                  >
                    +
                  </button>
                </div>
                
                {/* Add To Cart Button */}
                <button
                  disabled={btnLoading}
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 bg-[#FF6F3C] text-white h-[56px] rounded font-semibold hover:bg-[#D64A20] transition-colors text-[14px] tracking-wider uppercase disabled:opacity-50"
                >
                  {btnLoading ? "ADDING..." : "ADD TO CART"}
                </button>
              </div>

              {/* Buy It Now Button */}
              <button
                disabled={btnLoading}
                onClick={() => handleAddToCart(true)}
                className="w-full max-w-xl border border-[#FF6F3C] text-[#FF6F3C] h-[54px] rounded font-semibold hover:bg-[#FFF3EE] transition-colors text-[14px] tracking-wider uppercase bg-white block text-center mt-3 disabled:opacity-50"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Weather Alert */}
            <div className="bg-[#FFF8F5] border-l-[3px] border-[#FF6F3C] p-5 flex items-start gap-3 max-w-xl rounded-r">
              <p className="text-[13px] text-[#555555] font-normal leading-relaxed">
                <strong>Weather Alert:</strong> Due to heavy rainfall, please expect
                slight delays in deliveries. Thank you for your patience!
              </p>
            </div>

            {/* Source Info */}
            <p className="text-[13px] text-[#6F6F6F] font-normal italic pt-1 max-w-xl">
              {product.floral_source} | Raw & Pure | No Heat | No Chemicals
            </p>

            {/* Tasting Notes */}
            <div className="grid grid-cols-2 border border-[#E8E2D5] bg-white overflow-hidden max-w-xl rounded-sm">
              <div className="p-5 border-r border-b border-[#E8E2D5]">
                <TastingItem
                  icon={<svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-700 fill-none stroke-current stroke-2"><circle cx="12" cy="12" r="9" strokeDasharray="3 3"/></svg>}
                  label="AROMA"
                  value="Tropical, fruity"
                />
              </div>
              <div className="p-5 border-b border-[#E8E2D5]">
                <TastingItem
                  icon={<svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-700 fill-none stroke-current stroke-2"><line x1="5" y1="9" x2="19" y2="15"/><line x1="5" y1="15" x2="19" y2="15"/></svg>}
                  label="TASTE NOTE"
                  value="Fruity, sweet, tropical"
                />
              </div>
              <div className="p-5 border-r border-[#E8E2D5]">
                <TastingItem
                  icon={<svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-700 fill-none stroke-current stroke-2"><circle cx="12" cy="12" r="8"/></svg>}
                  label="SWEETNESS"
                  value="Sweetest, rich aftertaste"
                />
              </div>
              <div className="p-5">
                <TastingItem
                  icon={<svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-700 fill-none stroke-current stroke-2"><path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>}
                  label="CRYSTALLIZATION"
                  value="Might crystallize"
                />
              </div>
            </div>

            {/* Accordions */}
            <div className="pt-6 max-w-xl">
              <div className="w-full text-center mb-6">
                <a href="#compare" className="text-[24px] font-normal text-black underline underline-offset-8 tracking-wide inline-block">
                  Compare honey Flora
                </a>
              </div>
              
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {accordionSections.map((section) => {
                  const Icon = section.icon;
                  const isOpen = openSection === section.key;
                  return (
                    <div key={section.key} className="py-0.5">
                      <button
                        onClick={() => setOpenSection(isOpen ? null : section.key)}
                        className="flex w-full items-center justify-between py-4 text-left"
                      >
                        <span className="flex items-center gap-3.5 text-gray-800">
                          <Icon size={20} className="text-[#D08722] stroke-[1.5]" />
                          <span className={`${playfair.className} text-[24px] tracking-wide text-gray-700`}>
                            {section.title}
                          </span>
                        </span>
                        {isOpen ? <ChevronUp size={18} className="text-gray-800" /> : <ChevronDown size={18} className="text-gray-400" />}
                      </button>
                      {isOpen && (
                        <p className="pb-4 pl-9 text-[14px] leading-relaxed text-gray-600 font-normal">
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
        <div className="mt-14 w-full overflow-hidden rounded-xl">
          <Image
            src="/idcard.png"
            alt="Uses of Honey"
            width={1400}
            height={500}
            className="w-full object-cover"
          />
        </div>

        {/* RECOMMENDATIONS SECTION */}
        {recommendations.length > 0 && (
          <section className="mt-16">
            <h2 className={`mb-9 text-[32px] font-bold text-[#2F241C] ${playfair.className}`}>
              Recommendation
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map((item: any) => {
                const recVariants = item.variantDocumentId || [];
                const selectedVariantId = recSelectedVariants[item._id] || recVariants[0]?._id;
                const recVariant = recVariants.find((v: any) => v._id === selectedVariantId) || recVariants[0];

                const primaryImage =
                  item.imageDocumentId?.find((x: any) => x.is_primary)?.image_url ||
                  item.imageDocumentId?.[0]?.image_url || "";
                const weightStr = `${recVariant?.weight ?? ""}${recVariant?.unit ?? ""}`;

                return (
                  <ProductCardShop
                    key={item._id || item.id}
                    badge={item.categoryId?.category_name || "Honey"}
                    image={primaryImage}
                    title={item.product_name}
                    subtitle={item.floral_source}
                    weight={weightStr}
                    price={recVariant?.price ?? 0}
                    oldPrice={recVariant?.mrp ?? 0}
                    rating={item.average_rating}
                    reviews={item.total_reviews}
                    quantity={cartItems[item._id] ?? 0}
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
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in duration-200">
          <div className={`px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
            toastType === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
            {toastMessage}
          </div>
        </div>
      )}

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden shadow-lg z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
            <button
              onClick={decrementQty}
              className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-medium"
            >
              −
            </button>
            <span className="px-3 py-2 text-sm font-normal min-w-[30px] text-center">
              {selectedQty}
            </span>
            <button
              onClick={incrementQty}
              className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-medium"
            >
              +
            </button>
          </div>
          <button
            disabled={btnLoading}
            onClick={() => handleAddToCart(true)}
            className="flex-1 bg-[#FF6F3C] text-white py-3 rounded font-bold text-sm tracking-wide disabled:opacity-50"
          >
            Buy Now · ₹{currentPrice}
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