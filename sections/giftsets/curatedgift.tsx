"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Gift, Loader2, Minus, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

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
      // Use GET method for /api/products/weight?weight=250
      let res = await fetch(`${API_BASE_URL}/api/products/weight?weight=250`, {
        method: "GET",
        credentials: "include",
      });

      // Fallback 1: GET /api/products/weight
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/products/weight`, {
          method: "GET",
          credentials: "include",
        });
      }

      // Fallback 2: GET /api/products
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/api/products`, {
          method: "GET",
          credentials: "include",
        });
      }

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
          if (item?.variant?.variantId) {
            selectedWeight = String(item.variant.variantId);
          } else if (item?.variant?._id) {
            selectedWeight = String(item.variant._id);
          } else if (typeof item?.selectedWeight === "string" && item.selectedWeight) {
            selectedWeight = item.selectedWeight;
          } else if (item?.selectedWeight?._id) {
            selectedWeight = String(item.selectedWeight._id);
          } else if (Array.isArray(item?.weights) && item.weights.length > 0) {
            const w250 = item.weights.find(
              (w: any) => String(w.weight) === "250" || w.weight === 250
            );
            selectedWeight = String(
              (w250 || item.weights[0]).variantId || (w250 || item.weights[0])._id || (w250 || item.weights[0]).id || ""
            );
          } else if (Array.isArray(item?.variants) && item.variants.length > 0) {
            const v250 = item.variants.find(
              (v: any) => String(v.weight) === "250" || v.weight === 250
            );
            selectedWeight = String(
              (v250 || item.variants[0]).variantId || (v250 || item.variants[0])._id || (v250 || item.variants[0]).id || ""
            );
          } else if (Array.isArray(item?.variantDocumentId) && item.variantDocumentId.length > 0) {
            const v250 = item.variantDocumentId.find(
              (v: any) => String(v.weight) === "250" || v.weight === 250
            );
            selectedWeight = String(
              (v250 || item.variantDocumentId[0]).variantId || (v250 || item.variantDocumentId[0])._id || (v250 || item.variantDocumentId[0]).id || ""
            );
          } else {
            selectedWeight = productId;
          }

          const name = item?.product_name || item?.name || item?.title || "Natural Honey";
          const images = item?.imageDocumentId || item?.images || item?.image;
          const image = Array.isArray(images)
            ? (images[0]?.image_url || images[0] || "/honneycart.png")
            : (item?.image_url || item?.image || "/honneycart.png");

          return {
            _id: productId,
            name,
            image,
            productId,
            selectedWeight,
            price: item?.variant?.price || item?.price || 0,
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
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
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

      const firstProduct = selectedSlots[0];
      const payload = {
        giftBoxId: activeGiftBox._id,
        quantity: 1,
        products: selectedSlots.map((slot) => ({
          productId: slot!.productId,
          selectedWeight: slot!.selectedWeight,
        })),
        productId: firstProduct?.productId || activeGiftBox._id,
        selectedWeight: firstProduct?.selectedWeight || "",
      };

      // Extract Auth Token if present in cookies or localStorage
      const token = typeof document !== "undefined"
        ? (document.cookie.match(/(^| )sudhveda_token=([^;]+)/)?.[2] ||
          document.cookie.match(/(^| )token=([^;]+)/)?.[2] ||
          localStorage.getItem("token") ||
          localStorage.getItem("sudhveda_token") || "")
        : "";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${decodeURIComponent(token)}`;
      }

      const candidateEndpoints = [
        `${API_BASE_URL}/api/cart/add-customize/giftbox`,
        `${API_BASE_URL}/api/cart/add/customize-product`,
        `${API_BASE_URL}/api/cart/customize-giftbox`,
        `${API_BASE_URL}/api/cart/add-customize-giftbox`,
        `${API_BASE_URL}/api/cart/add/giftbox`,
      ];

      let success = false;
      let lastErrorMessage = "";

      // Try customize endpoints first
      for (const endpoint of candidateEndpoints) {
        try {
          const attempt = await fetch(endpoint, {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify(payload),
          });

          if (attempt.ok) {
            success = true;
            break;
          } else if (attempt.status === 401) {
            router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
            return;
          } else if (attempt.status !== 404) {
            const errJson = await attempt.json().catch(() => ({}));
            lastErrorMessage = errJson.message || "";
          }
        } catch (e) {
          // ignore
        }
      }

      // If customize endpoints fail (404/route not found), submit selected jars to /api/cart/add
      if (!success) {
        let anyAdded = false;
        for (const slot of selectedSlots) {
          if (!slot || !slot.productId || !slot.selectedWeight) continue;
          try {
            const addRes = await fetch(`${API_BASE_URL}/api/cart/add`, {
              method: "POST",
              credentials: "include",
              headers,
              body: JSON.stringify({
                productId: slot.productId,
                selectedWeight: slot.selectedWeight,
                quantity: 1,
              }),
            });

            if (addRes.status === 401) {
              router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
              return;
            }
            if (addRes.ok) {
              anyAdded = true;
            }
          } catch (e) {
            // ignore
          }
        }

        if (anyAdded) {
          success = true;
        }
      }

      if (!success) {
        throw new Error(lastErrorMessage || "Failed to add gift box to cart");
      }

      // Success
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new CustomEvent("trigger-live-update"));
      showToast(`✨ ${activeGiftBox.name} added to cart successfully!`, "success");
      setActiveGiftBox(null);
    } catch (err) {
      console.error("Error adding gift box to cart:", err);
      showToast(err instanceof Error ? err.message : "Error adding to cart", "warning");
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/80 rounded-[32px] border-2 border-[#E8D5BA] h-[520px] animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {giftBoxes.map((box) => (
              <div
                key={box._id}
                className="bg-[#FDF9F3] border-2 border-[#E8D5BA]/80 rounded-[32px] overflow-hidden shadow-[0_10px_35px_rgba(89,49,2,0.06)] hover:shadow-[0_22px_55px_rgba(89,49,2,0.16)] hover:border-[#D49313] transition-all duration-500 group flex flex-col hover:-translate-y-2 relative"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#FAF0DC] to-[#FDF5E9]">
                  <Image
                    src={box.image || "/honneycart.png"}
                    alt={box.name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/honneycart.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Details */}
                <div className="p-7 sm:p-8 flex flex-col flex-1 text-center bg-[#FAF6F0]/90 relative">
                  <h3 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#593102] leading-tight group-hover:text-[#D49313] transition-colors">
                    {box.name}
                  </h3>

                  <div className="mt-3 inline-flex items-center justify-center gap-2 text-[#593102] text-[13px] font-bold bg-[#FAF0DC] border border-[#E8D5BA] px-4 py-1.5 rounded-full w-max mx-auto shadow-2xs">
                    <span>🫙</span> {box.jar_count} Jars Selection Pack
                  </div>

                  <p className="mt-4 text-[14px] sm:text-[15px] text-[#8D7F73] leading-relaxed line-clamp-2 font-medium">
                    {box.description || "Hand-crafted luxury gift set packed with pure organic raw honey."}
                  </p>

                  <div className="mt-auto pt-7">
                    <button
                      type="button"
                      onClick={() => openCustomizationModal(box)}
                      className="w-full py-4 bg-gradient-to-r from-[#593102] via-[#7A4505] to-[#593102] hover:from-[#D49313] hover:via-[#B87D0E] hover:to-[#593102] text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl cursor-pointer text-[15px] sm:text-[16px] tracking-wide active:scale-98"
                    >
                      <Sparkles size={19} className="text-[#FFD700]" />
                      Customize &amp; Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#FDF9F3] to-[#FAF0DC]/30 border-2 border-[#E8D5BA] rounded-[32px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.35)] flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF0DC] via-[#FDF5E9] to-[#FAF0DC] border-b border-[#E8D5BA] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D49313] bg-white flex-shrink-0 shadow-md">
                  <Image
                    src={activeGiftBox.image || "/honneycart.png"}
                    alt={activeGiftBox.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider bg-[#593102] text-white px-2.5 py-0.5 rounded-full">
                      Step 1 of 2
                    </span>
                  </div>
                  <h3 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#593102] mt-0.5">
                    Customize {activeGiftBox.name}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-[#8D7F73] font-medium">
                    Pick any {activeGiftBox.jar_count} pure 250g honey jars below
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveGiftBox(null)}
                className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#593102] hover:text-red-600 flex items-center justify-center transition-colors shadow-md cursor-pointer border border-[#E8D5BA]"
                title="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-5 sm:p-8 overflow-y-auto overscroll-contain scroll-smooth touch-pan-y flex-1 space-y-7">

              {/* LIVE JAR COUNTER & PROGRESS CARD */}
              <div className="bg-gradient-to-r from-[#593102] via-[#7A4505] to-[#593102] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-[#D49313]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D49313]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg transition-transform duration-300 ${filledCount === activeGiftBox.jar_count
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105 animate-pulse"
                        : "bg-[#FAF0DC] text-[#593102] border-2 border-[#D49313]"
                        }`}
                    >
                      {filledCount === activeGiftBox.jar_count ? "✓" : "🫙"}
                    </div>

                    <div>
                      <h4 className="font-bold text-[16px] sm:text-[19px] leading-tight">
                        {filledCount === activeGiftBox.jar_count ? (
                          <span className="text-green-300 font-extrabold flex items-center gap-2">
                            🎉 Perfect! All {activeGiftBox.jar_count} Jars Selected
                          </span>
                        ) : (
                          <span>
                            {filledCount} Jar(s) Selected •{" "}
                            <span className="text-[#FFD700] font-extrabold underline decoration-[#FFD700]/50 underline-offset-4">
                              {activeGiftBox.jar_count - filledCount} More Jar(s) Remaining
                            </span>
                          </span>
                        )}
                      </h4>
                      <p className="text-[12px] sm:text-[14px] text-[#FAF0DC]/85 mt-1 font-medium">
                        {filledCount === activeGiftBox.jar_count ? (
                          <span>All slots filled! Click &apos;Add Gift Box to Cart&apos; below.</span>
                        ) : (
                          <span>Tap any honey flavor from the list below to fill slot #{filledCount + 1}.</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[13px] font-extrabold px-4 py-2 rounded-full border shadow-md ${filledCount === activeGiftBox.jar_count
                        ? "bg-green-500 text-white border-green-400"
                        : "bg-[#FAF0DC] text-[#593102] border-[#D49313]"
                        }`}
                    >
                      {filledCount} / {activeGiftBox.jar_count} Jars
                    </span>
                  </div>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full bg-white/20 h-3 rounded-full mt-4 overflow-hidden border border-white/10 p-0.5">
                  <div
                    className={`h-full transition-all duration-500 rounded-full shadow-md ${filledCount === activeGiftBox.jar_count
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gradient-to-r from-[#FFD700] to-[#D49313]"
                      }`}
                    style={{
                      width: `${(filledCount / activeGiftBox.jar_count) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* SELECTED SLOTS BAR */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[15px] font-extrabold text-[#593102] uppercase tracking-wider flex items-center gap-2">
                    <Gift size={16} className="text-[#D49313]" />
                    Your Box Slots ({filledCount}/{activeGiftBox.jar_count})
                  </span>
                  {filledCount === activeGiftBox.jar_count && (
                    <span className="text-[13px] font-bold text-green-800 bg-green-100 border border-green-300 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <Check size={15} /> Ready for Cart
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`relative p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center min-h-[130px] ${slot
                        ? "bg-white border-[#D49313] shadow-md hover:shadow-lg"
                        : "bg-[#FAF6F0]/80 border-dashed border-[#E8D5BA] hover:border-[#D49313]/60"
                        }`}
                    >
                      {slot ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(idx)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                            title="Remove this jar"
                          >
                            <X size={15} />
                          </button>
                          <div className="relative w-14 h-14 mb-1.5">
                            <Image
                              src={slot.image}
                              alt={slot.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[12px] font-bold text-[#593102] line-clamp-1">
                            {slot.name}
                          </span>
                          <span className="text-[10px] text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full mt-0.5">
                            Jar #{idx + 1}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#8D7F73]">
                          <span className="text-[24px] mb-1 opacity-70">🫙</span>
                          <span className="text-[12px] font-bold text-[#593102]">Slot #{idx + 1}</span>
                          <span className="text-[10px] opacity-75 mt-0.5">Tap item below</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AVAILABLE PRODUCTS GRID */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[15px] font-extrabold text-[#593102] uppercase tracking-wider">
                    Select 250g Honey Flavors
                  </h4>
                  <span className="text-[12px] text-[#8D7F73] font-semibold">
                    {availableProducts.length} Premium Flavors
                  </span>
                </div>

                {loadingProducts ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="animate-spin text-[#D49313]" size={36} />
                  </div>
                ) : availableProducts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-[#E8D5BA]">
                    <p className="text-gray-500 font-medium">No 250g honey flavors available right now</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                    {availableProducts.map((item) => {
                      const isSlotFull = filledCount === activeGiftBox.jar_count;

                      return (
                        <div
                          key={item.productId}
                          onClick={() => handleSelectProduct(item)}
                          className={`p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#E8D5BA]/80 hover:border-[#D49313] flex flex-col items-center text-center transition-all duration-300 cursor-pointer group hover:shadow-lg relative overflow-hidden ${isSlotFull ? "opacity-90" : "hover:-translate-y-1"
                            }`}
                        >
                          <div className="relative w-22 h-22 mb-2">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain group-hover:scale-108 transition-transform duration-300"
                            />
                          </div>

                          <h5 className="text-[13px] sm:text-[14px] font-bold text-[#593102] line-clamp-2 leading-tight min-h-[36px] flex items-center justify-center">
                            {item.name}
                          </h5>

                          <span className="mt-2 text-[11px] text-[#D49313] font-bold bg-[#FAF0DC] border border-[#E8D5BA] px-3 py-0.5 rounded-full">
                            250g Honey Jar
                          </span>

                          <button
                            type="button"
                            className="mt-3.5 px-3 py-2 bg-[#FAF6F0] group-hover:bg-[#593102] text-[#593102] group-hover:text-white text-[12px] font-bold rounded-xl transition-all w-full flex items-center justify-center gap-1.5 shadow-2xs group-hover:shadow-md"
                          >
                            <Plus size={15} /> Add to Box
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF0DC] via-[#FDF5E9] to-[#FAF0DC] border-t border-[#E8D5BA] flex items-center justify-between flex-wrap gap-4 shadow-lg">
              <div className="hidden sm:block">
                <span className="text-[12px] text-[#8D7F73] font-bold uppercase tracking-wider block">
                  Gift Box Status
                </span>
                <span className="text-[15px] font-extrabold text-[#593102]">
                  {filledCount === activeGiftBox.jar_count
                    ? `Ready (${filledCount}/${activeGiftBox.jar_count} Jars Selected)`
                    : `Incomplete (${filledCount}/${activeGiftBox.jar_count} Jars Selected)`}
                </span>
              </div>

              <button
                type="button"
                disabled={filledCount < activeGiftBox.jar_count || addingToCart}
                onClick={handleAddGiftBoxToCart}
                className={`w-full sm:w-auto px-9 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer text-[16px] tracking-wide shadow-lg ${filledCount === activeGiftBox.jar_count && !addingToCart
                  ? "bg-gradient-to-r from-[#593102] via-[#7A4505] to-[#593102] hover:from-[#D49313] hover:to-[#593102] text-white hover:shadow-xl hover:scale-[1.02] active:scale-98"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} /> Add Gift Box to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Top Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#593102] text-white px-6 py-3.5 rounded-full shadow-2xl text-[14px] sm:text-[15px] font-semibold flex items-center gap-2.5 animate-in slide-in-from-top duration-300 border-2 border-[#D49313] max-w-[92vw] sm:max-w-lg text-center backdrop-blur-md">
          <Sparkles size={18} className="text-[#D49313] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
