"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Leaf,
  Award,
  PenLine,
  ShieldCheck,
  ChevronDown,
  Gift,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

const greetingCardOptions = [
  { id: "Happy Birthday", label: "Happy Birthday" },
  { id: "Happy Anniversary", label: "Happy Anniversary" },
  { id: "With Love", label: "With Love" },
  { id: "Custom Note", label: "Custom Note" },
];

export default function BuildYourOwnGiftBox() {
  // Data States
  const [giftBoxes, setGiftBoxes] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Selection States
  const [selectedBoxId, setSelectedBoxId] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedWeightMap, setSelectedWeightMap] = useState<Record<string, string>>({});
  const [selectedCardMessage, setSelectedCardMessage] = useState<string>("Happy Birthday");
  const [customNote, setCustomNote] = useState<string>("");
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [messageToast, setMessageToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Fetch Gift Boxes & Products
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [boxRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/gift-box`),
          fetch(`${API_BASE_URL}/api/products`),
        ]);

        const boxData = await boxRes.json();
        const prodData = await prodRes.json();

        const boxes = boxData.data || boxData.giftBoxes || boxData || [];
        const prods = prodData.data || prodData.products || prodData || [];

        setGiftBoxes(boxes);
        setProductsList(prods);

        if (boxes.length > 0) {
          setSelectedBoxId(boxes[0]._id || boxes[0].id);
        }

        const initialWeightMap: Record<string, string> = {};
        prods.forEach((p: any) => {
          const variants = p.variantDocumentId || p.variants || [];
          if (variants.length > 0) {
            initialWeightMap[p._id] = variants[0]._id;
          }
        });
        setSelectedWeightMap(initialWeightMap);

        if (prods.length > 0) {
          setSelectedProductIds(prods.slice(0, 3).map((p: any) => p._id));
        }
      } catch (err) {
        console.error("Error loading gift box data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const currentBox = useMemo(() => {
    return giftBoxes.find((b) => (b._id || b.id) === selectedBoxId);
  }, [giftBoxes, selectedBoxId]);

  const maxCapacity = currentBox?.capacity || currentBox?.max_jars || 3;

  const selectedProducts = useMemo(() => {
    return productsList.filter((p) => selectedProductIds.includes(p._id));
  }, [productsList, selectedProductIds]);

  const productsTotal = useMemo(() => {
    return selectedProducts.reduce((sum, prod) => {
      const variants = prod.variantDocumentId || prod.variants || [];
      const selectedVariantId = selectedWeightMap[prod._id];
      const variant = variants.find((v: any) => v._id === selectedVariantId) || variants[0];
      const price = variant?.price ?? prod.price ?? 0;
      return sum + price;
    }, 0);
  }, [selectedProducts, selectedWeightMap]);

  const boxPrice = currentBox?.price || currentBox?.box_price || 0;
  const totalPrice = boxPrice + productsTotal;

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      if (selectedProductIds.length >= maxCapacity) {
        alert(`This box holds a maximum of ${maxCapacity} jars.`);
        return;
      }
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleGlobalWeightChange = (weightLabel: string) => {
    const updatedMap = { ...selectedWeightMap };
    selectedProducts.forEach((p) => {
      const variants = p.variantDocumentId || p.variants || [];
      const match = variants.find(
        (v: any) => `${v.weight}${v.unit}`.toLowerCase() === weightLabel.toLowerCase()
      );
      if (match) {
        updatedMap[p._id] = match._id;
      }
    });
    setSelectedWeightMap(updatedMap);
  };

  // ----- ADD TO CART (Cookies Only) -----
  const handleAddToCart = async () => {
    if (!selectedBoxId) {
      alert("Please select a gift box size.");
      return;
    }

    if (selectedProductIds.length === 0) {
      alert("Please select at least one honey variant.");
      return;
    }

    const payload = {
      giftBoxId: selectedBoxId,
      customMessage: selectedCardMessage === "Custom Note" ? customNote : selectedCardMessage,
      quantity: 1,
      products: selectedProducts.map((p) => ({
        productId: p._id,
        selectedWeight: selectedWeightMap[p._id] || (p.variantDocumentId?.[0]?._id ?? ""),
      })),
    };

    try {
      setSubmitting(true);
      setMessageToast(null);

      const res = await fetch(`${API_BASE_URL}/api/cart/add/customize-product`, {
        method: "POST",
        credentials: "include", // ✅ cookies will be sent
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        alert("Please log in to add items to your cart.");
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
        return;
      }

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setMessageToast({ type: "success", text: "Customized Gift Box added to cart!" });
        // Refresh cart count (you might want to emit event or update cart provider)
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        setMessageToast({
          type: "error",
          text: data?.message || "Failed to add gift box to cart.",
        });
      }
    } catch (err) {
      console.error("Cart API Error:", err);
      setMessageToast({ type: "error", text: "Server error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const globalWeightOptions = useMemo(() => {
    const set = new Set<string>();
    productsList.forEach((p) => {
      const vars = p.variantDocumentId || p.variants || [];
      vars.forEach((v: any) => {
        if (v.weight && v.unit) {
          set.add(`${v.weight}${v.unit}`);
        }
      });
    });
    return Array.from(set);
  }, [productsList]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center bg-white py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#B9791A]" />
        <p className="mt-3 text-sm font-medium text-[#6F665F]">Loading Gift Box Builder...</p>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#FFFCF8] py-16 text-[#2D3A1B]">
      <Image
        src="/contact.png"
        alt=""
        width={150}
        height={110}
        className="pointer-events-none absolute left-0 top-0 select-none opacity-60"
      />
      <Image
        src="/videoleft.png"
        alt=""
        width={220}
        height={140}
        className="pointer-events-none absolute right-6 top-2 hidden select-none opacity-80 lg:block"
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-8">
        <div className="mb-12 text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#A77710]">
            MAKE IT PERSONAL
          </p>
          <h2 className="mt-1 flex items-center justify-center gap-3 font-serif text-[32px] md:text-[42px] text-[#2D3A1B]">
            <span>Build Your Own Gift Box</span>
            <Image src="/customer2.png" alt="" width={28} height={28} />
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[380px_1fr_340px]">
          
          {/* LEFT COLUMN — STEPS */}
          <div className="space-y-8">
            
            {/* Step 1: Choose Your Box */}
            <div className="rounded-2xl border border-[#F0E6D8] bg-white p-6 shadow-sm">
              <StepHeading number={1} title="Choose Your Box" />
              <p className="ml-9 mt-1 text-[11px] font-medium tracking-[0.05em] text-[#8C8073]">
                SELECT THE PERFECT BOX SIZE.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {giftBoxes.map((box) => {
                  const boxId = box._id || box.id;
                  const isSelected = selectedBoxId === boxId;
                  const capacity = box.capacity || box.max_jars || 3;
                  const name = box.title || box.box_name || box.size || "Box";

                  return (
                    <button
                      key={boxId}
                      type="button"
                      onClick={() => {
                        setSelectedBoxId(boxId);
                        if (selectedProductIds.length > capacity) {
                          setSelectedProductIds(selectedProductIds.slice(0, capacity));
                        }
                      }}
                      className={`flex flex-col items-center rounded-xl border-2 p-3 transition-all ${
                        isSelected
                          ? "border-[#B9791A] bg-[#FFFBF5] ring-1 ring-[#B9791A]"
                          : "border-[#ECE2D2] bg-white hover:border-[#D8C4A3]"
                      }`}
                    >
                      <div className="relative flex aspect-square w-full items-center justify-center rounded-lg bg-[#F7F3E9]">
                        {box.image_url || box.image ? (
                          <Image
                            src={box.image_url || box.image}
                            alt={name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <Gift className="h-8 w-8 text-[#B9791A]" />
                        )}
                      </div>
                      <span className="mt-2.5 text-center text-[11px] font-bold tracking-wide uppercase text-[#2D3A1B]">
                        {name}
                      </span>
                      <span className="text-[10px] text-[#8C8073]">
                        ({capacity} Jars)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Honey */}
            <div className="rounded-2xl border border-[#F0E6D8] bg-white p-6 shadow-sm">
              <StepHeading number={2} title="Select Honey" />
              <p className="ml-9 mt-1 text-[11px] font-medium tracking-[0.05em] text-[#8C8073]">
                CHOOSE UP TO {maxCapacity} FAVORITE HONEYS.
              </p>

              <div className="relative mt-5">
                <button
                  type="button"
                  onClick={() => setProductMenuOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#DCD3C5] bg-white px-4 py-3 text-[13px] text-[#4A4038] focus:border-[#B9791A] focus:outline-none"
                >
                  <span className="truncate">
                    {selectedProducts.length > 0
                      ? selectedProducts.map((p) => p.product_name || p.title).join(", ")
                      : "Select Honeys"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#8C8073] transition-transform ${
                      productMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {productMenuOpen && (
                  <div className="absolute z-30 mt-2 max-h-[220px] w-full overflow-y-auto rounded-xl border border-[#E5DBCB] bg-white p-3 shadow-xl">
                    {productsList.map((product) => {
                      const isChecked = selectedProductIds.includes(product._id);
                      return (
                        <label
                          key={product._id}
                          className="flex items-center gap-3 py-2 text-[13px] font-medium text-[#4A4038] hover:bg-[#FAF6F0] px-2 rounded-md cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleProduct(product._id)}
                            className="h-4 w-4 accent-[#B9791A]"
                          />
                          <span className="flex-1 truncate">{product.product_name || product.title}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {globalWeightOptions.length > 0 && (
                <div className="mt-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7C7167] mb-1">
                    Weight (Same for all Jars)
                  </label>
                  <select
                    onChange={(e) => handleGlobalWeightChange(e.target.value)}
                    className="w-full rounded-xl border border-[#DCD3C5] bg-white px-3 py-2.5 text-[13px] text-[#4A4038] focus:border-[#B9791A] focus:outline-none"
                  >
                    {globalWeightOptions.map((wOpt) => (
                      <option key={wOpt} value={wOpt}>
                        {wOpt}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] italic text-[#9E9285]">
                    Weight will be applied to all selected honeys.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Add Greeting Card */}
            <div className="rounded-2xl border border-[#F0E6D8] bg-white p-6 shadow-sm">
              <StepHeading number={3} title="Greeting Card" />

              <div className="mt-4 space-y-2.5">
                {greetingCardOptions.map((card) => (
                  <label
                    key={card.id}
                    className="flex items-center gap-3 text-[13px] font-medium text-[#4A4038] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="greeting-card"
                      checked={selectedCardMessage === card.id}
                      onChange={() => setSelectedCardMessage(card.id)}
                      className="h-4 w-4 accent-[#B9791A]"
                    />
                    <span>{card.label}</span>
                  </label>
                ))}
              </div>

              {selectedCardMessage === "Custom Note" && (
                <div className="mt-3">
                  <textarea
                    rows={2}
                    placeholder="Enter your personal note here..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full rounded-lg border border-[#DCD3C5] p-2.5 text-[13px] text-[#4A4038] focus:border-[#B9791A] focus:outline-none"
                  />
                </div>
              )}
            </div>

          </div>

          {/* MIDDLE COLUMN — VISUAL PREVIEW */}
          <div className="sticky top-10 flex flex-col items-center justify-center pt-4">
            <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#F0E6D8] bg-white p-4 shadow-md">
              <Image
                src={currentBox?.image_url || currentBox?.image || "/image1.png"}
                alt="Gift Box Preview"
                fill
                className="object-cover rounded-xl"
                priority
              />
            </div>
          </div>

          {/* RIGHT COLUMN — PREVIEW & SUMMARY */}
          <div className="sticky top-10">
            <div className="rounded-2xl border border-[#F0E6D8] bg-white p-6 shadow-lg">
              <h3 className="flex items-center gap-2 font-serif text-[20px] text-[#2D3A1B] pb-3 border-b border-[#F0E6D8]">
                <ShoppingBag size={20} className="text-[#B9791A]" />
                Preview Your Gift
              </h3>

              <div className="mt-5 space-y-4 text-[13px]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C8073]">
                    BOX SIZE
                  </p>
                  <p className="font-semibold text-[#2D3A1B]">
                    {currentBox?.title || currentBox?.box_name || "Custom Box"} ({maxCapacity} Jars)
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C8073]">
                    SELECTED HONEYS
                  </p>
                  <div className="mt-1 space-y-1.5">
                    {selectedProducts.length === 0 ? (
                      <p className="italic text-[#9E9285]">No honeys selected</p>
                    ) : (
                      selectedProducts.map((p) => {
                        const variants = p.variantDocumentId || p.variants || [];
                        const selectedVariantId = selectedWeightMap[p._id];
                        const variant = variants.find((v: any) => v._id === selectedVariantId) || variants[0];
                        const weightStr = variant ? `${variant.weight}${variant.unit}` : "";
                        const price = variant?.price ?? p.price ?? 0;

                        return (
                          <div key={p._id} className="flex justify-between text-[#2D3A1B]">
                            <span className="truncate pr-2">
                              • {p.product_name || p.title} {weightStr ? `(${weightStr})` : ""}
                            </span>
                            <span className="font-semibold">₹{price}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Total Weight Calculation */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C8073]">
                    TOTAL WEIGHT
                  </p>
                  <p className="font-medium text-[#2D3A1B]">
                    {selectedProducts.reduce((sum, p) => {
                      const variants = p.variantDocumentId || p.variants || [];
                      const selectedVariantId = selectedWeightMap[p._id];
                      const variant = variants.find((v: any) => v._id === selectedVariantId) || variants[0];
                      const weight = variant?.weight ? parseFloat(variant.weight) : 0;
                      return sum + weight;
                    }, 0)} g
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C8073]">
                    GREETING CARD
                  </p>
                  <p className="font-medium text-[#2D3A1B]">
                    {selectedCardMessage === "Custom Note" ? customNote || "Custom Note" : selectedCardMessage}
                  </p>
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-[#E5DBCB] pt-4 space-y-2 text-[12px]">
                <div className="flex justify-between text-[#6F665F]">
                  <span>Subtotal ({selectedProducts.length} Jars)</span>
                  <span>₹{productsTotal}</span>
                </div>
                <div className="flex justify-between text-[#6F665F]">
                  <span>Packaging Box</span>
                  <span>₹{boxPrice}</span>
                </div>
                <div className="flex justify-between text-[#6F665F]">
                  <span>Gift Wrap</span>
                  <span className="font-bold text-[#1F7A36]">FREE</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#FFF8EF] p-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#2D3A1B]">
                    TOTAL PRICE
                  </p>
                  <p className="text-[10px] text-[#8C8073]">(Inclusive of all taxes)</p>
                </div>
                <p className="text-[22px] font-extrabold text-[#2D3A1B]">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </p>
              </div>

              {messageToast && (
                <div
                  className={`mt-4 rounded-lg p-3 text-[12px] font-medium ${
                    messageToast.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {messageToast.text}
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={submitting}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B9791A] py-3.5 text-[13px] font-bold tracking-wider uppercase text-white shadow-md transition-colors hover:bg-[#9A6213] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    ADDING TO CART...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    ADD TO CART
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        <div className="mt-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-[480px_1fr]">
          <div className="relative mx-auto h-[550px] w-full max-w-[480px] overflow-hidden rounded-[28px]">
            <Image
              src="/image2.png"
              alt="Gift Packaging"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-8 left-6 right-6 rounded-[20px] bg-white/95 p-6 shadow-xl backdrop-blur-sm">
              <p className="font-serif italic text-[#A16A00] text-[28px] leading-[1.2]">
                “Every box is a work of art, packed with intention.”
              </p>
            </div>
          </div>

          <div className="max-w-[580px]">
            <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#A77710]">
              PREMIUM BY NATURE
            </p>

            <h2 className="mt-2 font-serif text-[42px] leading-[1.1] text-[#14361E] md:text-[52px]">
              Every Gift is Packed with Love
            </h2>

            <p className="mt-5 text-[17px] leading-relaxed text-[#6C5D53]">
              We believe the experience starts from the moment the box is held.
              Our packaging is designed to evoke wonder and warmth.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-8">
              <Feature
                icon={<Leaf size={20} />}
                title="Sustainable Materials"
                desc="Eco-friendly boxes and fillers."
              />
              <Feature
                icon={<Award size={20} />}
                title="Hand-Tied Ribbons"
                desc="Premium satin finish."
              />
              <Feature
                icon={<PenLine size={20} />}
                title="Personalized Notes"
                desc="Handwritten for that extra touch."
              />
              <Feature
                icon={<ShieldCheck size={20} />}
                title="Wax-Sealed Cards"
                desc="Ensuring exclusivity."
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1F2B1B] text-[12px] font-bold text-white">
        {number}
      </span>
      <h3 className="font-serif text-[18px] text-[#2D3A1B]">{title}</h3>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-[#B9791A]">{icon}</span>
      <div>
        <p className="text-[14px] font-bold leading-tight text-[#2D3A1B]">
          {title}
        </p>
        <p className="mt-1 text-[12px] leading-snug text-[#6F665F]">
          {desc}
        </p>
      </div>
    </div>
  );
}