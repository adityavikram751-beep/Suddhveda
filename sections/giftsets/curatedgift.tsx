"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Gift, Loader2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";
import { useCart } from "@/components/cart/CartProvider";

// ================= TYPES =================
type GiftBox = {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  jar_count: number;
  isActive?: boolean;
};

type SelectedProduct = {
  productId: string;
  selectedWeight: string;
  name: string;
  image: string;
  price?: number;
};

type HoneyProduct = {
  _id: string;
  name: string;
  image: string;
  productId: string;
  selectedWeight: string;
  price?: number;
};

export default function CuratedGift() {
  const router = useRouter();
  const { fetchCart, openCart } = useCart();
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([]);
  const [loadingBoxes, setLoadingBoxes] = useState(true);

  // Modal & Customization States
  const [activeGiftBox, setActiveGiftBox] = useState<GiftBox | null>(null);
  const [availableProducts, setAvailableProducts] = useState<HoneyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<(SelectedProduct | null)[]>([]);

  // Submit & Toast states
  const [addingToCart, setAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ---------- Fetch Gift Boxes ----------
  useEffect(() => {
    const fetchGiftBoxes = async () => {
      try {
        setLoadingBoxes(true);
        const res = await fetch(`${API_BASE_URL}/api/admin/gift-box`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch gift boxes");
        const data = await res.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const activeBoxes = data.data.filter((b: GiftBox) => b.isActive !== false);
          setGiftBoxes(activeBoxes.length > 0 ? activeBoxes : data.data);
        } else {
          setGiftBoxes([]);
        }
      } catch (err) {
        console.error("Error fetching gift boxes:", err);
        setGiftBoxes([]);
      } finally {
        setLoadingBoxes(false);
      }
    };

    fetchGiftBoxes();
  }, []);

  // ---------- Prevent Background Scroll When Modal is Open ----------
  useEffect(() => {
    if (activeGiftBox) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    };
  }, [activeGiftBox]);

  // ---------- Fetch 250g Products when Modal Opens ----------
  const openCustomizationModal = async (giftBox: GiftBox) => {
    setActiveGiftBox(giftBox);
    setSelectedSlots(Array(giftBox.jar_count).fill(null));
    setLoadingProducts(true);

    try {
      // Fetch working clean endpoint: GET /api/products
      let res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const rawList = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.products)
            ? data.data.products
            : Array.isArray(data?.products)
              ? data.products
              : Array.isArray(data)
                ? data
                : [];

        const parsedProducts: HoneyProduct[] = rawList.map((item: any) => {
          // Exact property mapping according to GET /api/products/weight response:
          const productId = String(
            item?.productId || item?._id || item?.id || ""
          );

          let selectedWeight = "";
          // 1. Direct variant object fields
          if (item?.variant?.variantId) {
            selectedWeight = String(item.variant.variantId);
          } else if (item?.variant?._id) {
            selectedWeight = String(item.variant._id);
          } else if (item?.variant?.id) {
            selectedWeight = String(item.variant.id);
          }

          // 2. Check variant arrays (variantDocumentId, variants, weights)
          if (!selectedWeight) {
            const arr = Array.isArray(item?.variantDocumentId) && item.variantDocumentId.length > 0
              ? item.variantDocumentId
              : Array.isArray(item?.variants) && item.variants.length > 0
                ? item.variants
                : Array.isArray(item?.weights) && item.weights.length > 0
                  ? item.weights
                  : [];

            if (arr.length > 0) {
              const v250 = arr.find(
                (v: any) => String(v?.weight || v?.size || v?.unit) === "250" || v?.weight === 250
              ) || arr[0];

              selectedWeight = String(
                v250?.variantId || v250?._id || v250?.id || v250?.variant_id || ""
              );
            }
          }

          // 3. Fallback direct properties if present
          if (!selectedWeight) {
            if (typeof item?.selectedWeight === "string" && item.selectedWeight) {
              selectedWeight = item.selectedWeight;
            } else if (item?.selectedWeight?._id) {
              selectedWeight = String(item.selectedWeight._id);
            } else if (item?.selectedWeight?.variantId) {
              selectedWeight = String(item.selectedWeight.variantId);
            } else {
              selectedWeight = productId;
            }
          }

          const name = item?.product_name || item?.name || item?.title || "Natural Honey";
          const images = item?.imageDocumentId || item?.images || item?.image;
          const image = Array.isArray(images)
            ? (images[0]?.image_url || images[0] || "/honneycart.png")
            : (item?.image_url || item?.image || "/honneycart.png");

          const parseNum = (val: any) => {
            if (val === undefined || val === null) return 0;
            const n = Number(val);
            return !isNaN(n) && n > 0 ? n : 0;
          };

          let realPrice = parseNum(item?.variant?.price) ||
            parseNum(item?.variant?.salePrice) ||
            parseNum(item?.variant?.mrp) ||
            parseNum(item?.price) ||
            parseNum(item?.salePrice) ||
            parseNum(item?.product_price) ||
            parseNum(item?.mrp);

          if (!realPrice) {
            const arr = Array.isArray(item?.variantDocumentId) && item.variantDocumentId.length > 0
              ? item.variantDocumentId
              : Array.isArray(item?.variants) && item.variants.length > 0
                ? item.variants
                : Array.isArray(item?.weights) && item.weights.length > 0
                  ? item.weights
                  : [];

            if (arr.length > 0) {
              const v250 = arr.find(
                (v: any) => String(v?.weight || v?.size || v?.unit) === "250" || v?.weight === 250
              ) || arr[0];

              realPrice = parseNum(v250?.price) ||
                parseNum(v250?.salePrice) ||
                parseNum(v250?.mrp) ||
                parseNum(v250?.product_price);
            }
          }

          if (!realPrice && giftBox?.price && giftBox?.jar_count) {
            realPrice = Math.round(giftBox.price / giftBox.jar_count);
          }

          return {
            _id: productId,
            name,
            image,
            productId,
            selectedWeight,
            price: realPrice,
          };
        });

        setAvailableProducts(parsedProducts);
      }
    } catch (err) {
      console.error("Error fetching weight products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // ---------- Slot Handler ----------
  const handleSelectProduct = (product: HoneyProduct) => {
    if (!activeGiftBox) return;

    // Find first empty slot
    const emptyIndex = selectedSlots.findIndex((slot) => slot === null);
    if (emptyIndex === -1) {
      // ALL SLOTS ARE ALREADY FULL
      showToast(`⚠️ All ${activeGiftBox.jar_count} slots full! Click 'X' on any jar above to change flavor.`, "warning");
      return;
    }

    const updated = [...selectedSlots];
    updated[emptyIndex] = {
      productId: product.productId,
      selectedWeight: product.selectedWeight,
      name: product.name,
      image: product.image,
      price: product.price,
    };
    setSelectedSlots(updated);

    const newFilledCount = updated.filter(Boolean).length;
    if (newFilledCount === activeGiftBox.jar_count) {
      showToast(`🎉 All ${activeGiftBox.jar_count} jars selected! Ready to add to cart.`, "success");
    } else {
      showToast(`✅ Added ${product.name} (${newFilledCount}/${activeGiftBox.jar_count} Jars)`, "info");
    }
  };

  const handleRemoveSlot = (index: number) => {
    if (!activeGiftBox) return;
    const removedName = selectedSlots[index]?.name || `Jar #${index + 1}`;
    const updated = [...selectedSlots];
    updated[index] = null;
    setSelectedSlots(updated);

    showToast(`ℹ️ Removed ${removedName}. Please select a flavor to fill Jar #${index + 1}.`, "info");
  };

  const showToast = (msg: string, type: "success" | "warning" | "info" = "info") => {
    // Toast messages disabled per user request
    return;
  };

  // ---------- Add Customize Gift Box to Cart ----------
  const handleAddGiftBoxToCart = async () => {
    if (!activeGiftBox) return;

    // Verify all slots are filled
    const emptyCount = selectedSlots.filter((slot) => slot === null).length;
    if (emptyCount > 0) {
      showToast(`⚠️ Please select ${emptyCount} more honey jar(s) to complete your ${activeGiftBox.name}!`, "warning");
      return;
    }

    try {
      setAddingToCart(true);

      const payload = {
        giftBoxId: activeGiftBox._id,
        quantity: 1,
        products: selectedSlots
          .filter((slot): slot is SelectedProduct => slot !== null)
          .map((slot) => ({
            productId: slot.productId,
            selectedWeight: slot.selectedWeight,
          })),
      };

      // Extract Auth Token
      const token = typeof document !== "undefined"
        ? (document.cookie.match(/(^| )sudhveda_token=([^;]+)/)?.[2] ||
          document.cookie.match(/(^| )token=([^;]+)/)?.[2] ||
          localStorage.getItem("token") ||
          localStorage.getItem("sudhveda_token") || "")
        : "";

      let success = false;

      // 1. If user is logged in, post directly to single official API: POST /api/cart/add-customize/giftbox
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/cart/add-customize/giftbox`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${decodeURIComponent(token)}`,
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            success = true;
          }
        } catch (e) {
          console.error("API call failed, falling back to guest local cart:", e);
        }
      }

      // 2. If guest user / unauthenticated or API failed -> Save to localStorage (sudhveda_guest_cart)
      if (!success && typeof window !== "undefined") {
        try {
          const GUEST_CART_KEY = "sudhveda_guest_cart";
          const stored = localStorage.getItem(GUEST_CART_KEY);
          const guestItems: Record<string, any> = stored ? JSON.parse(stored) : {};

          const cartItemId = `guest_gift_${activeGiftBox._id}_${Date.now()}`;
          const giftBoxTotalPrice = selectedSlots.reduce((acc, slot) => acc + (slot?.price || 0), 0) || activeGiftBox.price || 0;

          guestItems[cartItemId] = {
            type: "CUSTOM",
            cartItemId,
            productName: activeGiftBox.name,
            image: activeGiftBox.image || "/honneycart.png",
            price: giftBoxTotalPrice,
            quantity: 1,
            giftBoxPayload: payload,
          };

          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
        } catch (err) {
          console.error("Failed to save guest gift cart to localStorage:", err);
        }
      }

      // 3. Refresh Global Cart Provider State & Open Side Cart Drawer
      if (fetchCart) {
        await fetchCart().catch(() => {});
      }
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new CustomEvent("trigger-live-update"));

      setActiveGiftBox(null);
      if (openCart) {
        openCart();
      } else {
        router.push("/cart");
      }
    } catch (err) {
      console.error("Error in handleAddGiftBoxToCart:", err);
      setActiveGiftBox(null);
      if (openCart) {
        openCart();
      } else {
        router.push("/cart");
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const filledCount = selectedSlots.filter(Boolean).length;

  return (
    <section id="curated-gift-boxes" className="relative bg-gradient-to-b from-[#FDF5E9] via-[#FAF0DC]/50 to-[#FDF5E9] py-16 sm:py-24 md:py-28 transition-colors overflow-hidden scroll-mt-20">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D49313]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#593102]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">

        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="inline-flex items-center gap-2 text-[#D49313] bg-[#FAF0DC] border border-[#E8D5BA] px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-bold tracking-[0.2em] uppercase mb-4 shadow-xs">
            <Gift size={15} className="text-[#D49313]" />
            LUXURY GIFT COLLECTION
          </span>

          <h2 className="font-serif text-[32px] sm:text-[42px] md:text-[52px] font-bold text-[#593102] leading-[1.15] tracking-tight">
            Thoughtfully Curated Honey Gift Sets
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto my-4 rounded-full" />

          <p className="text-[#8D7F73] text-[15px] sm:text-[18px] leading-relaxed max-w-2xl mx-auto font-medium">
            Select your ideal gift box size and customize it with your choice of raw &amp; organic honey flavors.
          </p>
        </div>

        {/* ================= CARDS GRID ================= */}
        {loadingBoxes ? (
          <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 rounded-[20px] border border-[#E8D5BA] h-[460px] animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 justify-center">
            {giftBoxes.map((box) => {
              const jarText = box.jar_count ? `${box.jar_count}x250g` : "Custom Set";

              return (
                <div
                  key={box._id}
                  className="bg-[#FFFDF9] border border-[#EADCC9] rounded-[24px] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#D49313]/60 transition-all duration-300 group flex flex-col relative max-w-[310px] sm:max-w-none mx-auto w-full"
                >
                  {/* Top Image Banner Area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F0E6]">
                    <Image
                      src={box.image || "/honneycart.png"}
                      alt={box.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/honneycart.png";
                      }}
                    />
                  </div>

                  {/* Content Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 bg-[#FFFDF9]">
                    {/* Title */}
                    <div className="text-center sm:text-left">
                      <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#3D260F] leading-tight">
                        {box.name}
                      </h3>
                    </div>

                    {/* Dynamic API Description */}
                    <div className="mt-3.5 border-t border-[#EADCC9]/50 pt-3 min-h-[54px]">
                      {box.description ? (
                        <p className="text-[13px] text-[#7A6A5C] leading-relaxed line-clamp-2 font-medium text-left">
                          {box.description}
                        </p>
                      ) : (
                        <ul className="space-y-1.5 text-[12.5px] text-[#7A6A5C] font-medium">
                          <li className="flex items-center gap-2">
                            <span className="text-[#C87F17] font-bold">•</span>
                            <span>{box.jar_count ? `${box.jar_count} Pure Honey Jars` : "Custom Honey Set"}</span>
                          </li>
                        </ul>
                      )}
                    </div>

                    {/* Bottom Action Row */}
                    <div className="mt-5 pt-1">
                      <button
                        type="button"
                        onClick={() => openCustomizationModal(box)}
                        className="w-full h-[42px] bg-[#FA4B1B] hover:bg-[#E64216] text-white font-extrabold rounded-2xl transition-all duration-200 text-[13px] tracking-wide shadow-sm active:scale-98 cursor-pointer flex items-center justify-center"
                      >
                        Customize Gift Box
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= CUSTOMIZATION MODAL POPUP ================= */}
      {activeGiftBox && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300"
          onClick={() => setActiveGiftBox(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-gradient-to-b from-[#FDF9F3] to-[#FAF0DC]/30 border-2 border-[#E8D5BA] rounded-[28px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.35)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#E8D5BA] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#D49313]/40 bg-[#FAF6F0] flex-shrink-0 shadow-xs">
                  <Image
                    src={activeGiftBox.image || "/honneycart.png"}
                    alt={activeGiftBox.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-[19px] sm:text-[21px] font-bold text-[#3D260F]">
                    Customize {activeGiftBox.name}
                  </h3>
                  <p className="text-[12px] sm:text-[12.5px] text-[#7A6A5C] font-medium">
                    Pick any {activeGiftBox.jar_count} honey jars below ({filledCount}/{activeGiftBox.jar_count} Selected)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveGiftBox(null)}
                className="w-9 h-9 rounded-full bg-[#FAF6F0] hover:bg-[#FAF0DC] text-[#3D260F] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer border border-[#E8D5BA]"
                title="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain scroll-smooth touch-pan-y flex-1 space-y-5 bg-[#FAF7F2]">

              {/* SELECTED SLOTS BAR */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[13px] font-extrabold text-[#3D260F] uppercase tracking-wider flex items-center gap-2">
                    <Gift size={15} className="text-[#C87F17]" />
                    Selected Jars ({filledCount}/{activeGiftBox.jar_count})
                  </span>
                  {filledCount === activeGiftBox.jar_count && (
                    <span className="text-[11.5px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={13} /> Ready for Cart
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {selectedSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`relative p-2.5 rounded-xl border transition-all flex flex-col items-center justify-center text-center min-h-[110px] ${slot
                        ? "bg-white border-[#C87F17] shadow-xs"
                        : "bg-white/60 border-dashed border-[#E8D5BA]"
                        }`}
                    >
                      {slot ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Remove this jar"
                          >
                            <X size={12} />
                          </button>
                          <div className="relative w-11 h-11 mb-1">
                            <Image
                              src={slot.image}
                              alt={slot.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[11px] font-bold text-[#3D260F] line-clamp-1">
                            {slot.name}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                            Jar #{idx + 1}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#8D7F73]">
                          <span className="text-[18px] mb-0.5 opacity-70">🫙</span>
                          <span className="text-[11px] font-bold text-[#3D260F]">Slot #{idx + 1}</span>
                          <span className="text-[9.5px] opacity-75">Tap flavor below</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AVAILABLE PRODUCTS GRID */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-[12.5px] sm:text-[13px] font-extrabold text-[#3D260F] uppercase tracking-wider">
                    Select Honey Flavors
                  </h4>
                  <span className="text-[11.5px] text-[#8D7F73] font-semibold">
                    {availableProducts.length} Flavors Available
                  </span>
                </div>

                {loadingProducts ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="animate-spin text-[#C87F17]" size={30} />
                  </div>
                ) : availableProducts.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-xl border border-[#E8D5BA]">
                    <p className="text-gray-500 text-[12.5px] font-medium">No honey flavors available right now</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
                    {availableProducts.map((item) => {
                      const isSlotFull = filledCount === activeGiftBox.jar_count;

                      return (
                        <div
                          key={item.productId}
                          onClick={() => {
                            if (!isSlotFull) handleSelectProduct(item);
                          }}
                          className={`p-3 rounded-xl bg-white border border-[#EADCC9] flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden ${isSlotFull
                            ? "opacity-60 cursor-not-allowed border-gray-200"
                            : "hover:border-[#C87F17] hover:shadow-md cursor-pointer hover:-translate-y-0.5 group"
                            }`}
                        >
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-1">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          <h5 className="text-[11.5px] sm:text-[12px] font-bold text-[#3D260F] line-clamp-2 leading-tight min-h-[28px] flex items-center justify-center">
                            {item.name}
                          </h5>

                          {item.price && item.price > 0 ? (
                            <span className="text-[12px] sm:text-[12.5px] font-extrabold text-[#3D260F] mt-1 font-sans">
                              ₹{item.price}
                            </span>
                          ) : null}

                          <button
                            type="button"
                            disabled={isSlotFull}
                            className={`mt-2 py-1 px-3 text-[11px] font-bold rounded-lg transition-all w-full flex items-center justify-center ${isSlotFull
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                              : "bg-[#FA4B1B] hover:bg-[#E64216] text-white shadow-2xs cursor-pointer"
                              }`}
                          >
                            {isSlotFull ? "Full" : "Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="p-4 sm:p-4.5 bg-white border-t border-[#E8D5BA] flex items-center justify-between flex-wrap gap-3 shadow-lg">
              <div>
                <span className="text-[10.5px] text-[#8D7F73] font-bold uppercase tracking-wider block">
                  Gift Box Total
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[20px] sm:text-[22px] font-extrabold text-[#3D260F] font-sans">
                    ₹{
                      (() => {
                        const sum = selectedSlots.reduce((acc, slot) => acc + (slot?.price || 0), 0);
                        return sum.toLocaleString("en-IN");
                      })()
                    }
                  </span>
                  <span className="text-[11.5px] font-bold text-[#7A6A5C]">
                    ({filledCount}/{activeGiftBox.jar_count} Jars)
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={filledCount < activeGiftBox.jar_count || addingToCart}
                onClick={handleAddGiftBoxToCart}
                className={`w-full sm:w-auto px-7 py-2.5 sm:py-3 rounded-xl font-black transition-all flex items-center justify-center gap-2 cursor-pointer text-[13.5px] uppercase tracking-wider shadow-md ${filledCount === activeGiftBox.jar_count && !addingToCart
                  ? "bg-[#FA4B1B] hover:bg-[#E64216] text-white hover:scale-105 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="animate-spin" size={17} /> Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={17} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}


    </section>
  );
}
