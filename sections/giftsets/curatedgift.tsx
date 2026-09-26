"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  Gift,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";
import { useCart } from "@/components/cart/CartProvider";

// ================= TYPES =================
type ProductItem = {
  name: string;
  weight?: string;
};

type ImageItem = {
  url: string;
  is_primary?: boolean;
};

type ComboProduct = {
  _id: string;
  combo_name: string;
  slug?: string;
  brand?: string;
  combo_size?: number;
  products?: ProductItem[];
  mrp?: number;
  selling_price?: number;
  discount_percent?: number;
  save?: number;
  description?: string;
  key_benefits?: string;
  manufacturer_information?: string;
  shelf_life?: string;
  storage_instructions?: string;
  country_of_origin?: string;
  fssai_license_number?: string;
  is_active?: boolean;
  images?: ImageItem[];
};

export default function CuratedGift() {
  const router = useRouter();
  const { fetchCart, openCart } = useCart();

  const [comboProducts, setComboProducts] = useState<ComboProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected combo item for Detail Modal Popup
  const [selectedCombo, setSelectedCombo] = useState<ComboProduct | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // ---------- FETCH DYNAMIC COMBO PRODUCTS ----------
  useEffect(() => {
    const fetchComboProducts = async () => {
      try {
        setLoading(true);
        let res = await fetch(`${API_BASE_URL}/api/combo/products/all/combo-products`, {
          credentials: "include",
        });

        if (!res.ok) {
          res = await fetch(`${API_BASE_URL}/api/admin/gift-box`, {
            credentials: "include",
          });
        }

        if (res.ok) {
          const json = await res.json();
          const rawData = Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.comboProducts)
            ? json.comboProducts
            : Array.isArray(json?.products)
            ? json.products
            : Array.isArray(json)
            ? json
            : [];

          if (rawData.length > 0) {
            const parsed: ComboProduct[] = rawData
              .filter((item: any) => item.is_active !== false && item.isActive !== false)
              .map((item: any) => {
                let imgList: ImageItem[] = [];

                if (Array.isArray(item.images) && item.images.length > 0) {
                  imgList = item.images.map((img: any) => ({
                    url: typeof img === "string" ? img : img?.url || img?.image_url || "/honneycart.png",
                    is_primary: typeof img === "object" ? !!img?.is_primary : false,
                  }));
                } else if (item.image || item.image_url) {
                  imgList = [{ url: item.image || item.image_url, is_primary: true }];
                }

                const price = Number(item.selling_price || item.price || item.salePrice || 999);
                const mrp = Number(item.mrp || item.originalPrice || Math.round(price * 1.2));
                const discount =
                  Number(item.discount_percent || item.discountPercent) ||
                  (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);
                const save = Number(item.save) || (mrp > price ? mrp - price : 0);
                const size = Number(item.combo_size || item.jar_count || (Array.isArray(item.products) ? item.products.length : 2));

                return {
                  _id: item._id || item.id,
                  combo_name: item.combo_name || item.name || item.title || "Curated Gift Box",
                  slug: item.slug || "",
                  brand: item.brand || "SudhVeda Honey",
                  combo_size: size,
                  products: Array.isArray(item.products)
                    ? item.products.map((p: any) => ({
                        name: typeof p === "string" ? p : p.name || p.title || "Honey Jar",
                        weight: typeof p === "object" ? p.weight || "250g" : "250g",
                      }))
                    : [],
                  mrp,
                  selling_price: price,
                  discount_percent: discount,
                  save,
                  description:
                    item.description ||
                    "A specially curated combo of pure natural raw honeys sourced directly from trusted apiaries.",
                  key_benefits:
                    item.key_benefits ||
                    "Boosts immunity, rich in antioxidants, natural energy booster, aids digestion, no added sugar or preservatives",
                  manufacturer_information:
                    item.manufacturer_information ||
                    "Manufactured and Packed by SudhVeda Honey Pvt. Ltd., Plot No. 12, Industrial Area, Dehradun, Uttarakhand, India - 248001",
                  shelf_life: item.shelf_life || "24 months from the date of packaging",
                  storage_instructions:
                    item.storage_instructions ||
                    "Store in a cool, dry place away from direct sunlight. Do not refrigerate.",
                  country_of_origin: item.country_of_origin || "India",
                  fssai_license_number: item.fssai_license_number || "10021045001234",
                  is_active: item.is_active !== false,
                  images: imgList,
                };
              });

            setComboProducts(parsed);
          } else {
            setComboProducts([]);
          }
        } else {
          setComboProducts([]);
        }
      } catch (err) {
        console.error("Error fetching combo products API:", err);
        setComboProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComboProducts();
  }, []);

  // Prevent Body Scroll when modal is open
  useEffect(() => {
    if (selectedCombo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCombo]);

  const openComboModal = (combo: ComboProduct) => {
    setSelectedCombo(combo);
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  // ---------- ADD TO CART ----------
  const handleAddToCart = async (checkoutImmediately: boolean = false) => {
    if (!selectedCombo) return;

    try {
      setAddingToCart(true);

      const token =
        typeof document !== "undefined"
          ? document.cookie.match(/(^| )sudhveda_token=([^;]+)/)?.[2] ||
            document.cookie.match(/(^| )token=([^;]+)/)?.[2] ||
            localStorage.getItem("token") ||
            localStorage.getItem("sudhveda_token") ||
            ""
          : "";

      let success = false;

      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/cart/add-combo`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${decodeURIComponent(token)}`,
            },
            body: JSON.stringify({
              comboId: selectedCombo._id,
              quantity,
            }),
          });
          if (res.ok) success = true;
        } catch (e) {
          console.error("Cart API failed, fallback to guest cart:", e);
        }
      }

      if (!success && typeof window !== "undefined") {
        const GUEST_CART_KEY = "sudhveda_guest_cart";
        const stored = localStorage.getItem(GUEST_CART_KEY);
        const guestItems: Record<string, any> = stored ? JSON.parse(stored) : {};

        const cartItemId = `guest_combo_${selectedCombo._id}_${Date.now()}`;
        guestItems[cartItemId] = {
          type: "COMBO",
          cartItemId,
          productName: selectedCombo.combo_name,
          image: selectedCombo.images?.[0]?.url || "/honneycart.png",
          price: selectedCombo.selling_price || 999,
          quantity,
          comboProduct: selectedCombo,
        };

        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
      }

      if (fetchCart) await fetchCart().catch(() => {});
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new CustomEvent("trigger-live-update"));

      setSelectedCombo(null);

      if (checkoutImmediately) {
        router.push("/checkout");
      } else if (openCart) {
        openCart();
      } else {
        router.push("/cart");
      }
    } catch (err) {
      console.error("Error adding combo to cart:", err);
      setSelectedCombo(null);
      if (openCart) openCart();
      else router.push("/cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // ---------- GROUP PRODUCTS BY COMBO SIZE ----------
  const duoProducts = comboProducts.filter((p) => p.combo_size === 2 || p.combo_name.toLowerCase().includes("duo"));
  const trioProducts = comboProducts.filter((p) => p.combo_size === 3 || p.combo_name.toLowerCase().includes("trio"));
  const quartetProducts = comboProducts.filter(
    (p) => p.combo_size === 4 || p.combo_name.toLowerCase().includes("quartet") || p.combo_name.toLowerCase().includes("quad")
  );
  const otherProducts = comboProducts.filter(
    (p) => !duoProducts.includes(p) && !trioProducts.includes(p) && !quartetProducts.includes(p)
  );

  const sectionsToRender = [
    { title: "Duo Sets", items: duoProducts },
    { title: "Triple Set", items: trioProducts },
    { title: "Quartet Collection", items: quartetProducts },
    { title: "Gift Combos", items: otherProducts },
  ].filter((sec) => sec.items.length > 0);

  return (
    <section id="curated-gift-boxes" className="relative bg-[#FAF4E8] py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">

        {/* ================= MAIN SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/35 px-4 py-1 rounded-full text-[11.5px] sm:text-[12px] font-extrabold uppercase text-[#593102] tracking-wider mb-2.5 shadow-2xs">
            <Gift size={13} className="text-[#D49313]" />
            <span>CURATED GIFT COLLECTION</span>
          </div>

          <h2 className="font-libre-caslon text-[34px] sm:text-[44px] lg:text-[50px] font-normal text-[#1F1813] leading-[1.12] tracking-tight">
            Ready-to-Gift <span className="text-[#EA580C]">Boxes</span>
          </h2>

          {/* Golden Gradient Glow Accent Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto mt-2.5 mb-2 rounded-full shadow-[0_0_8px_rgba(212,147,19,0.4)]" />

          <p className="font-cormorant italic text-[20px] sm:text-[24px] text-[#593102] font-medium mt-1 leading-snug">
            Thoughtfully curated, pure organic sweetness.
          </p>

          <p className="font-sans text-[14px] sm:text-[15.5px] text-[#6E5D4F] leading-relaxed max-w-xl mx-auto font-normal mt-2">
            Perfect for birthdays, festive celebrations, housewarmings,
            <br className="hidden sm:inline" /> or simply sharing heartfelt sweetness with loved ones.
          </p>
        </div>

        {/* ================= DYNAMIC SECTIONS GRID ================= */}
        {loading ? (
          <div className="space-y-12">
            <div>
              <div className="w-40 h-8 bg-[#EADBCE]/50 rounded-lg animate-pulse mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#FFFDF9] h-[340px] rounded-[20px] animate-pulse border border-[#EADBCE]/60" />
                ))}
              </div>
            </div>
          </div>
        ) : sectionsToRender.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFDF9] rounded-[24px] border border-[#EADBCE]/70 max-w-md mx-auto p-6">
            <Gift className="mx-auto text-[#D97706] mb-3" size={36} />
            <h3 className="font-libre-caslon text-[20px] text-[#382618] font-bold">No Combo Gift Sets Found</h3>
            <p className="text-[13.5px] text-[#6E5D4F] mt-1.5">Check back soon for new curated honey gift boxes.</p>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {sectionsToRender.map((sec) => (
              <div key={sec.title}>
                {/* Section Title */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="font-libre-caslon text-[28px] sm:text-[38px] lg:text-[44px] text-[#382618] font-normal tracking-tight">
                    {sec.title}
                  </h3>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                  {sec.items.map((item) => (
                    <ComboCard
                      key={item._id}
                      product={item}
                      onClick={() => router.push(`/shop/products/${item._id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ================= COMBO PRODUCT DETAIL MODAL POPUP ================= */}
      {selectedCombo && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedCombo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#FFFDF9] border border-[#EADBCE] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh] my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCombo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-[#FAF4E8] text-[#382618] flex items-center justify-center transition-all border border-[#EADBCE] shadow-sm cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* LEFT COLUMN: PRODUCT IMAGE & THUMBNAILS */}
            <div className="w-full lg:w-1/2 p-5 sm:p-8 bg-[#FAF4E8] flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-[#EADBCE]/70">
              {/* Primary Image Container */}
              <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-white shadow-sm border border-[#EADBCE]/50 mb-4">
                {selectedCombo.discount_percent && selectedCombo.discount_percent > 0 ? (
                  <span className="absolute top-3 left-3 z-10 bg-[#D97706] text-white font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {selectedCombo.discount_percent}% OFF
                  </span>
                ) : null}

                <Image
                  src={
                    selectedCombo.images?.[selectedImageIndex]?.url ||
                    selectedCombo.images?.[0]?.url ||
                    getFallbackImage(selectedCombo._id || selectedCombo.combo_name)
                  }
                  alt={selectedCombo.combo_name}
                  fill
                  priority
                  className="object-cover transition-all duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/honneycart.png";
                  }}
                />
              </div>

              {/* Thumbnails list (if multiple images) */}
              {selectedCombo.images && selectedCombo.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto py-1 max-w-full">
                  {selectedCombo.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-[12px] overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                        selectedImageIndex === idx
                          ? "border-[#D97706] shadow-sm scale-105"
                          : "border-[#EADBCE] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img.url} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center pt-3 border-t border-[#EADBCE]/60">
                <div className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#593102]">
                  <ShieldCheck size={16} className="text-[#D97706]" />
                  <span>100% Pure & Organic</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#593102]">
                  <Truck size={16} className="text-[#D97706]" />
                  <span>Fast Pan India Shipping</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PRODUCT DETAILS & ACTIONS */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto overscroll-contain max-h-[60vh] lg:max-h-[92vh]">
              <div>
                {/* Brand & Subtitle Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11.5px] font-extrabold uppercase tracking-widest text-[#D97706] bg-[#FFF3E0] px-3 py-0.5 rounded-full border border-[#FDE68A]">
                    {selectedCombo.brand || "SudhVeda Honey"}
                  </span>
                  <span className="text-[12px] text-[#7A6859] font-medium">
                    {selectedCombo.combo_size || 2} Jars Box
                  </span>
                </div>

                {/* Combo Title */}
                <h3 className="font-libre-caslon text-[26px] sm:text-[32px] font-bold text-[#382618] leading-tight mb-2">
                  {selectedCombo.combo_name}
                </h3>

                {/* Rating Stars */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex text-[#F59E0B]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[12.5px] font-bold text-[#382618]">5.0</span>
                  <span className="text-[12px] text-[#7A6859]">(Curated Premium Combo)</span>
                </div>

                {/* Price Display */}
                <div className="bg-[#FAF4E8] p-4 rounded-[16px] border border-[#EADBCE]/70 mb-5 flex items-baseline gap-3">
                  <span className="text-[30px] font-black text-[#593102] font-sans">
                    ₹{selectedCombo.selling_price || 999}
                  </span>
                  {selectedCombo.mrp && selectedCombo.mrp > (selectedCombo.selling_price || 0) && (
                    <span className="line-through text-[#8C7564] text-[16px] font-medium font-sans">
                      ₹{selectedCombo.mrp}
                    </span>
                  )}
                  {selectedCombo.save && selectedCombo.save > 0 && (
                    <span className="ml-auto text-[12px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      Save ₹{selectedCombo.save}
                    </span>
                  )}
                </div>

                {/* Included Products List */}
                {selectedCombo.products && selectedCombo.products.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-[13px] font-bold text-[#382618] uppercase tracking-wider mb-2">
                      Included in this Combo Box:
                    </h4>
                    <div className="space-y-1.5">
                      {selectedCombo.products.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-[13.5px] text-[#593102] font-medium bg-[#FFFDF9] p-2.5 rounded-[10px] border border-[#EADBCE]/60"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#D97706]/15 text-[#D97706] flex items-center justify-center font-bold text-[11px]">
                            ✓
                          </span>
                          <span>{p.name}</span>
                          {p.weight && <span className="ml-auto text-[12px] text-[#7A6859]">({p.weight})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedCombo.description && (
                  <div className="mb-5">
                    <h4 className="text-[13px] font-bold text-[#382618] uppercase tracking-wider mb-1">
                      Description:
                    </h4>
                    <p className="font-cormorant italic text-[15px] sm:text-[16px] text-[#593102] leading-relaxed">
                      {selectedCombo.description}
                    </p>
                  </div>
                )}

                {/* Key Benefits */}
                {selectedCombo.key_benefits && (
                  <div className="mb-5">
                    <h4 className="text-[13px] font-bold text-[#382618] uppercase tracking-wider mb-1.5">
                      Key Benefits:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCombo.key_benefits.split(",").map((benefit, bIdx) => (
                        <span
                          key={bIdx}
                          className="bg-[#FAF4E8] text-[#593102] text-[12px] font-medium px-3 py-1 rounded-full border border-[#EADBCE]"
                        >
                          ✨ {benefit.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information Grid */}
                <div className="border-t border-[#EADBCE]/70 pt-4 space-y-2 text-[12px] text-[#7A6859]">
                  {selectedCombo.shelf_life && (
                    <div className="flex justify-between">
                      <span className="font-medium text-[#382618]">Shelf Life:</span>
                      <span>{selectedCombo.shelf_life}</span>
                    </div>
                  )}
                  {selectedCombo.storage_instructions && (
                    <div className="flex justify-between">
                      <span className="font-medium text-[#382618]">Storage:</span>
                      <span className="text-right max-w-[240px]">{selectedCombo.storage_instructions}</span>
                    </div>
                  )}
                  {selectedCombo.fssai_license_number && (
                    <div className="flex justify-between">
                      <span className="font-medium text-[#382618]">FSSAI Lic. No:</span>
                      <span>{selectedCombo.fssai_license_number}</span>
                    </div>
                  )}
                  {selectedCombo.country_of_origin && (
                    <div className="flex justify-between">
                      <span className="font-medium text-[#382618]">Country of Origin:</span>
                      <span>{selectedCombo.country_of_origin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QUANTITY & ACTIONS */}
              <div className="mt-6 pt-5 border-t border-[#EADBCE] space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-[#EADBCE] rounded-[16px] bg-[#FAF4E8] p-1 justify-between">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-[12px] bg-white text-[#382618] flex items-center justify-center hover:bg-[#D97706] hover:text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="font-bold text-[15px] text-[#382618] px-4 font-sans">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-[12px] bg-white text-[#382618] flex items-center justify-center hover:bg-[#D97706] hover:text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    disabled={addingToCart}
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 bg-[#D97706] hover:bg-[#B45309] text-white font-sans font-semibold text-[14px] sm:text-[15px] py-3 px-4 rounded-[16px] inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="animate-spin" size={17} /> Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={17} />
                        <span>Add Combo (₹{((selectedCombo.selling_price || 999) * quantity).toLocaleString("en-IN")})</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  disabled={addingToCart}
                  onClick={() => handleAddToCart(true)}
                  className="w-full bg-[#191919] hover:bg-[#333333] text-white font-sans font-semibold text-[14px] sm:text-[15px] py-3 px-4 rounded-[16px] inline-flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <span>Buy Combo Now ⚡</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}

// Default fallback images
const FALLBACK_IMAGES = ["/home 2.png", "/ajwainnew.png", "/dashboardm1.png", "/honneycart.png"];

function getFallbackImage(seed: string) {
  const hash = (seed || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

// ================= COMBO CARD COMPONENT =================
function ComboCard({ product, onClick }: { product: ComboProduct; onClick: () => void }) {
  let primaryImg = product.images?.find((img) => img.is_primary)?.url || product.images?.[0]?.url;
  if (!primaryImg || primaryImg.trim() === "") {
    primaryImg = getFallbackImage(product._id || product.combo_name);
  }

  const jarCount = product.combo_size || (product.products ? product.products.length : 2);

  const productListLine =
    product.products && product.products.length > 0
      ? product.products.map((p) => p.name).join(" + ")
      : "Two premium varieties, crafted for meaningful impressions";

  return (
    <div
      onClick={onClick}
      className="bg-[#FAF4E8] border border-[#EADBCE]/70 rounded-[20px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(89,49,2,0.12)] cursor-pointer group"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/80">
        {product.discount_percent && product.discount_percent > 0 ? (
          <span className="absolute top-2.5 right-2.5 z-10 bg-[#191919] text-white font-extrabold text-[10px] sm:text-[10.5px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
            {product.discount_percent}% OFF
          </span>
        ) : null}

        <Image
          src={primaryImg}
          alt={product.combo_name}
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/honneycart.png";
          }}
        />
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Card Title */}
          <h4 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#382618] leading-tight tracking-tight mb-1 group-hover:text-[#D97706] transition-colors">
            {product.combo_name}
          </h4>

          {/* Tagline / Subtitle */}
          <p className="font-cormorant italic text-[13px] sm:text-[14px] text-[#7A6859] leading-snug mb-2.5 line-clamp-1">
            {product.description || "Two premium varieties, crafted for meaningful impressions"}
          </p>

          {/* Product Names Line (e.g. Mustard Honey + Lychee Honey) */}
          <p className="font-poly text-[12px] sm:text-[12.5px] text-[#593102] leading-tight font-normal mb-3 line-clamp-2 min-h-[32px]">
            {productListLine}
          </p>
        </div>

        {/* Bottom Row: Jar Count & Price */}
        <div className="pt-2 border-t border-[#EADBCE]/50 flex items-center justify-between">
          {/* Jar Icon & Count */}
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#593102]">
            <Image
              src="/pote.svg"
              alt="Honey Pot Icon"
              width={22}
              height={22}
              className="object-contain shrink-0"
            />
            <span>{jarCount} Jars</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 font-sans">
            {product.mrp && product.mrp > (product.selling_price || 0) && (
              <span className="line-through text-[#8C7564] text-[12px] font-medium">
                ₹{product.mrp}
              </span>
            )}
            <span className="text-[#593102] text-[17px] font-black">
              ₹{product.selling_price || 999}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
