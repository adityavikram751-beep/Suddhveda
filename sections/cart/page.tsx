"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Lock,
  Minus,
  Plus,
  Trash2,
  Phone,
  Mail,
  Clock,
  Check,
  Loader2,
} from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";

const freeDeliveryTarget = 2000;

// ---------- Helper to get token from cookie ----------
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

// ---------- Helper for authenticated fetch ----------
async function authFetch(url: string, options: RequestInit = {}) {
  const token = getTokenFromCookie();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export default function Cart() {
  const router = useRouter();
  const {
    cartItems,
    addToCart,
    updateQuantity,
    updateCustomQuantity,
    removeItem,
    isLoading,
  } = useCart();

  const cartProducts = Object.values(cartItems);

  const subtotal = cartProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );
  const saved = cartProducts.reduce(
    (sum, product) =>
      sum +
      (product.type === "NORMAL"
        ? Math.max((product.oldPrice || 0) - product.price, 0) * product.quantity
        : 0),
    0,
  );

  // ---------- Recommendations ----------
  type ApiProduct = {
    _id: string;
    product_name: string;
    brand?: string;
    image?: { image_url?: string };
    imageDocumentId?: { image_url?: string; is_primary?: boolean }[];
    variantDocumentId?: { _id: string; weight: number; price: number; mrp?: number; unit?: string }[];
  };
  const [recommendations, setRecommendations] = useState<ApiProduct[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch recommendations
  useEffect(() => {
    (async () => {
      try {
        const data = await authFetch(`${API_BASE_URL}/api/products`);
        const list: ApiProduct[] =
          data.data || data.products || data.items || (Array.isArray(data) ? data : []);
        setRecommendations(list.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    })();
  }, []);

  // Fetch wishlist
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const products = data?.data?.products || [];
          const ids = products.map((item: any) =>
            item.productId?._id || item.productId || item._id
          );
          setWishlistIds(ids);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    })();
  }, []);

  // Toggle wishlist
  const handleToggleWishlist = async (productId: string) => {
    const isWishlisted = wishlistIds.includes(productId);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/wishlist/${isWishlisted ? "remove" : "add"}/${productId}`,
        {
          method: isWishlisted ? "DELETE" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        setWishlistIds((prev) =>
          isWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
        window.dispatchEvent(
          new CustomEvent("wishlist-count-update", {
            detail: { count: isWishlisted ? wishlistIds.length - 1 : wishlistIds.length + 1 },
          })
        );
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  // ---------- Handle Add to Cart for Recommendations ----------
  const handleRecommendationAddToCart = async (productId: string, variantId: string) => {
    try {
      setActionLoading(productId);
      // Popup won't trigger; loading state will show directly inside button
      await addToCart(productId, variantId);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="bg-[#FFF8EF] py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
        <nav className="mb-6 text-sm text-[#7B8493]">
          <span className="font-medium text-[#2F241C]">Home</span> &gt;{" "}
          <span className="font-semibold text-[#2D3A1B]">Cart</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
          {/* LEFT SECTION */}
          <section>
            <h1 className="text-[34px] font-bold">
              Your Cart <span className="text-[#2D3A1B]">({cartProducts.length})</span>
            </h1>

            <FreeDeliveryBar subtotal={subtotal} />

            <div className="mt-14 hidden grid-cols-[1fr_120px_160px_100px] px-5 text-[15px] font-semibold uppercase tracking-[0.08em] text-[#30303A] md:grid">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="mt-4 space-y-5">
              {isLoading ? (
                <div className="rounded bg-white px-5 py-10 text-center text-[#8E623A]">
                  Loading cart...
                </div>
              ) : cartProducts.length === 0 ? (
                <div className="rounded bg-white px-5 py-10 text-center text-[#8E623A]">
                  Your cart is empty.
                </div>
              ) : (
                cartProducts.map((product) => (
                  <div
                    key={product.cartItemId}
                    className="grid gap-4 rounded bg-white px-5 py-5 md:grid-cols-[1fr_120px_160px_100px] md:items-center"
                  >
                    <div className="flex gap-5">
                      <div className="relative h-24 w-24 overflow-hidden rounded bg-[#FFF8EF]">
                        <Image
                          src={product.image}
                          alt={product.productName}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <h2 className="text-[17px] font-bold">{product.productName}</h2>
                        <p className="mt-1 text-[12px] text-[#7B8493]">
                          {product.type === "NORMAL"
                            ? product.weight
                            : product.customMessage || "Gift box"}
                        </p>
                        <span className="mt-2 inline-flex rounded-full bg-[#E7F9EA] px-3 py-1 text-[10px] font-bold text-[#149447]">
                          100% Raw & Unfiltered
                        </span>
                        <div className="mt-2 flex gap-4 text-[11px] text-[#7B8493]">
                          <button
                            type="button"
                            onClick={() => removeItem(product.cartItemId)}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[20px] font-bold text-[#2D3A1B]">₹{product.price}</p>
                    <QuantityControl
                      quantity={product.quantity}
                      onMinus={() =>
                        product.type === "NORMAL"
                          ? updateQuantity(product.productId, product.variantId, -1)
                          : updateCustomQuantity(product.cartItemId, -1)
                      }
                      onPlus={() =>
                        product.type === "NORMAL"
                          ? updateQuantity(product.productId, product.variantId, 1)
                          : updateCustomQuantity(product.cartItemId, 1)
                      }
                    />
                    <p className="text-[20px] font-bold text-[#2D3A1B]">
                      ₹{product.price * product.quantity}
                    </p>
                  </div>
                ))
              )}
            </div>

            <h2 className="mt-8 text-[22px] font-semibold">You May Also Like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((item) => {
                const variants = item.variantDocumentId || [];
                const defaultVariant = variants[0];
                const primaryImage =
                  item.imageDocumentId?.find((img) => img.is_primary)?.image_url ||
                  item.image?.image_url ||
                  "/placeholder.png";

                return (
                  <div key={item._id} className="h-full">
                    <ProductCardShop
                      image={primaryImage}
                      title={item.product_name}
                      subtitle={item.brand || "SudhVeda Honey"}
                      weight={
                        defaultVariant
                          ? `${defaultVariant.weight}${defaultVariant.unit || "g"}`
                          : ""
                      }
                      price={defaultVariant?.price || 0}
                      oldPrice={defaultVariant?.mrp}
                      quantity={0}
                      isWishlisted={wishlistIds.includes(item._id)}
                      onToggleWishlist={() => handleToggleWishlist(item._id)}
                      onAddToCart={() =>
                        defaultVariant &&
                        handleRecommendationAddToCart(item._id, defaultVariant._id)
                      }
                      onIncrement={() => {}}
                      onDecrement={() => {}}
                      onOpenDetails={() => router.push(`/shop/products/${item._id}`)}
                      actionLoading={actionLoading === item._id}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="w-full space-y-8 box-border lg:max-w-[420px] lg:sticky lg:bottom-10 self-end">
            <OrderSummaryWithCoupons
              subtotal={subtotal}
              saved={saved}
              itemCount={cartProducts.length}
            />
            <HelpPanel />
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Free Delivery Bar ──────────────────────────────────────────────────

export function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  return (
    <div className="mt-5 rounded-[10px] border border-[#F0DDC4] bg-white px-6 py-5">
      <p className="text-[13px] text-[#4C5362]">
        Yay! You are ₹{remaining} away from FREE delivery!
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8EBEF]">
        <div
          className="h-full rounded-full bg-[#2D3A1B] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[#A2AAB7]">
        <span>₹0</span>
        <span>₹{freeDeliveryTarget}</span>
      </div>
    </div>
  );
}

// ─── Quantity Control ──────────────────────────────────────────────────

export function QuantityControl({
  quantity,
  onMinus,
  onPlus,
}: {
  quantity: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="inline-grid h-9 w-[94px] grid-cols-3 items-center rounded-md border border-[#DFE4EA] bg-[#FBFCFD] text-center">
      <button
        type="button"
        onClick={onMinus}
        className="flex h-full items-center justify-center rounded-l-md transition-colors hover:bg-gray-100"
      >
        <Minus size={14} />
      </button>
      <span className="font-bold text-[#2F241C]">{quantity}</span>
      <button
        type="button"
        onClick={onPlus}
        className="flex h-full items-center justify-center rounded-r-md transition-colors hover:bg-gray-100"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────

type ApiCoupon = {
  offerId: string;
  code: string;
  desc: string;
  minOrder: string;
  isAvailable: boolean;
  discountPercentage?: number;
  flatDiscount?: number;
};

type LocationData = {
  phone: string;
  phone_timing: string;
  email: string;
  email_reply_time: string;
  whatsapp: string;
  whatsapp_timing: string;
  map_embed_url: string;
};

// ─── Order Summary with Coupons ──────────────────────────────────────

export function OrderSummaryWithCoupons({
  subtotal,
  saved,
  itemCount,
}: {
  subtotal: number;
  saved: number;
  itemCount: number;
}) {
  const [couponCode, setCouponCode] = useState("");
  const [coupons, setCoupons] = useState<ApiCoupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<ApiCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Fetch available coupons
  useEffect(() => {
    (async () => {
      try {
        const data = await authFetch(`${API_BASE_URL}/api/coupon/all-coupons`);
        const list: ApiCoupon[] = (data.data || [])
          .filter((c: any) => c.isActive !== false)
          .map((c: any) => ({
            offerId: c._id,
            code: c.couponCode || c.code,
            desc: c.title || c.description || "",
            minOrder: c.minimumOrderAmount ? `₹${c.minimumOrderAmount}` : "",
            isAvailable: c.isAvailable !== false,
            discountPercentage: c.discountPercentage || c.percentage || 0,
            flatDiscount: c.discountAmount || c.amount || 0,
          }));
        setCoupons(list);
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
      }
    })();
  }, []);

  // Calculate & Apply Coupon (Supports % & Flat ₹)
  const applyCoupon = async (code: string) => {
    setCouponError(null);
    setCouponLoading(true);
    try {
      const data = await authFetch(`${API_BASE_URL}/api/coupon/apply`, {
        method: "POST",
        body: JSON.stringify({ code, couponCode: code }),
      });

      // Find selected coupon details
      const matched = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());

      let calculatedDiscount = 0;

      // 1. If Server provides explicit discount value
      let rawDiscount = data.discount ?? data.discountAmount ?? data.data?.discount;
      if (rawDiscount !== undefined && rawDiscount !== null) {
        calculatedDiscount = typeof rawDiscount === "string" ? parseFloat(rawDiscount) || 0 : rawDiscount;
      } 
      // 2. Fallback Percentage Calculation: (subtotal * percentage) / 100
      else if (matched?.discountPercentage && matched.discountPercentage > 0) {
        calculatedDiscount = (subtotal * matched.discountPercentage) / 100;
      } 
      // 3. Fallback Flat Amount
      else if (matched?.flatDiscount && matched.flatDiscount > 0) {
        calculatedDiscount = matched.flatDiscount;
      }

      setDiscount(Math.round(calculatedDiscount));

      setAppliedCoupon(
        matched || {
          offerId: data.offerId || data._id || code,
          code,
          desc: data.message || "Coupon applied",
          minOrder: "",
          isAvailable: true,
        }
      );

      setCouponCode("");
    } catch (err: any) {
      setCouponError(err.message || "Could not apply coupon");
      setDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = async () => {
    if (!appliedCoupon) return;
    try {
      await authFetch(`${API_BASE_URL}/api/coupon/remove/${appliedCoupon.offerId}`, {
        method: "DELETE",
      }).catch(() => null);

      setAppliedCoupon(null);
      setDiscount(0);
    } catch (err) {
      console.error("Remove coupon error:", err);
    }
  };

  // Total Calculation
  const total = Math.max(subtotal - discount, 0);

  return (
    <div className="w-full space-y-6 box-border">
      {/* Summary lines */}
      <div className="bg-transparent px-1 w-full box-border">
        <h2 className="text-[20px] font-bold text-[#2F241C]">Order Summary</h2>
        <div className="mt-4 space-y-3 text-[15px] text-[#6F7786]">
          <div className="flex justify-between">
            <span>Subtotal ({itemCount} items)</span>
            <strong className="font-semibold text-[#2F241C]">₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <strong className="font-bold text-[#0BA445]">FREE</strong>
          </div>
          <div className="flex justify-between">
            <span>You Save</span>
            <strong className="font-semibold text-[#0BA445]">- ₹{saved}</strong>
          </div>

          {/* 🟢 Dedicated Coupon Discount Line */}
          {discount > 0 && (
            <div className="flex justify-between text-[#0BA445] font-bold pt-1 border-t border-dashed border-[#E5E8ED]">
              <span>Coupon Discount ({appliedCoupon?.code})</span>
              <span>- ₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Coupon Section – Always Open */}
      <div className="rounded-[22px] border border-[#F2EFE9] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] w-full box-border">
        <p className="flex items-center gap-2 text-[15px] font-bold text-[#2F241C]">
          <span className="text-[16px] leading-none">🎟️</span>
          Apply Coupon
        </p>

        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2D3A1B] bg-[#FBFCFD]"
            />
            <button
              onClick={() => couponCode && applyCoupon(couponCode)}
              disabled={couponLoading}
              className="bg-[#B97B00] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#A06A00] transition-colors disabled:opacity-60 flex items-center gap-1.5"
            >
              {couponLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply"
              )}
            </button>
          </div>

          {couponError && (
            <p className="text-[12px] font-semibold text-red-500">{couponError}</p>
          )}

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-[#A2AAB7] uppercase tracking-wider">
              AVAILABLE COUPONS
            </p>

            {coupons.length === 0 ? (
              <p className="text-[12px] text-[#A2AAB7]">No coupons available.</p>
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon.offerId}
                  className={`flex items-center justify-between rounded-xl border border-dashed border-[#2D3A1B]/60 p-3 bg-white ${
                    !coupon.isAvailable ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="inline-block rounded border border-dashed border-[#2D3A1B] bg-[#FFF8EF] px-2 py-0.5 text-[12px] font-bold text-[#B97B00]">
                      {coupon.code}
                    </div>
                    <p className="text-[12px] font-medium text-[#2F241C] mt-1.5">
                      {coupon.desc}
                    </p>
                    {coupon.minOrder && (
                      <p className="text-[10px] text-[#A2AAB7] mt-0.5">
                        Min. order {coupon.minOrder}
                      </p>
                    )}
                  </div>

                  {appliedCoupon?.code === coupon.code ? (
                    <span className="flex items-center gap-1 text-[12px] font-bold text-[#0BA445]">
                      <Check size={14} className="stroke-[3]" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => applyCoupon(coupon.code)}
                      disabled={!coupon.isAvailable || couponLoading}
                      className="text-[12px] font-bold px-4 py-1.5 rounded-lg border border-[#2D3A1B] text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Apply
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {appliedCoupon && (
            <div className="flex items-center justify-between rounded-xl bg-[#E7F9EA] px-4 py-3 border border-[#B7E4C7]">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0BA445] text-white">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#2F241C]">
                    Coupon Applied{" "}
                    <span className="text-[#0BA445] ml-1">{appliedCoupon.code}</span>
                  </p>
                  <p className="text-[10px] text-[#0BA445] font-semibold">
                    Saved ₹{discount} on this order!
                  </p>
                </div>
              </div>
              <button
                onClick={removeCoupon}
                className="text-[11px] font-bold text-red-500 hover:underline tracking-wider"
              >
                REMOVE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Section */}
      <div className="px-1 space-y-4 w-full box-border">
        <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
          <div>
            <p className="text-[21px] font-bold">Total</p>
            <p className="text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
          </div>
          <p className="font-serif text-[28px] font-bold">₹{total.toLocaleString("en-IN")}</p>
        </div>

        <Link
          href="/checkout"
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#B97B00] text-[15px] font-bold text-white hover:bg-[#A06A00] transition-all shadow-md shadow-amber-900/10"
        >
          <Lock size={16} className="fill-white stroke-[2.5]" />
          PROCEED TO CHECKOUT
        </Link>

        <div className="flex items-center justify-between rounded-xl bg-[#FAFFF6] px-5 py-4 border border-[#D7F3D9] w-full box-border">
          <div>
            <h3 className="text-[14px] font-bold text-[#187A37]">ShudhVeda Promise</h3>
            <p className="text-[12px] text-[#3F3F3F] mt-0.5">Pure honey, delivered with care.</p>
          </div>
          <div className="relative h-10 w-10 shrink-0">
            <Image src="/need.png" alt="Honey jar" fill className="object-contain" />
          </div>
        </div>

        <TrustBadges />
      </div>
    </div>
  );
}

// ─── Trust Badges ─────────────────────────────────────────────────────

export function TrustBadges() {
  return null;
}

// ─── NEED HELP PANEL (with Location API) ────────────────────────────

function HelpPanel() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/location/all`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const loc = data.data || data;
          setLocation({
            phone: loc.phone || "+91 98765 43210",
            phone_timing: loc.phone_timing || "Mon - Sat : 9AM - 6PM",
            email: loc.email || "connect@honeyveda.in",
            email_reply_time: loc.email_reply_time || "We reply within 24 hrs",
            whatsapp: loc.whatsapp || "",
            whatsapp_timing: loc.whatsapp_timing || "",
            map_embed_url: loc.map_embed_url || "",
          });
        } else {
          // fallback
          setLocation({
            phone: "+91 98765 43210",
            phone_timing: "Mon - Sat : 9AM - 6PM",
            email: "connect@honeyveda.in",
            email_reply_time: "We reply within 24 hrs",
            whatsapp: "",
            whatsapp_timing: "",
            map_embed_url: "",
          });
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        setLocation({
          phone: "+91 98765 43210",
          phone_timing: "Mon - Sat : 9AM - 6PM",
          email: "connect@honeyveda.in",
          email_reply_time: "We reply within 24 hrs",
          whatsapp: "",
          whatsapp_timing: "",
          map_embed_url: "",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full box-border flex items-center justify-between gap-4 px-1 pb-2">
      <div className="flex-1 space-y-3">
        <h2 className="text-[18px] font-bold text-[#2F241C]">Need help?</h2>
        <div className="space-y-2 text-[14px] text-[#6F7786]">
          <p className="flex items-center gap-3">
            <Phone size={16} className="text-[#2D3A1B] shrink-0" />
            <span className="font-medium text-[#2F241C] whitespace-nowrap">
              {loading ? "Loading..." : location?.phone || "+91 98765 43210"}
            </span>
          </p>
          <p className="flex items-center gap-3">
            <Mail size={16} className="text-[#2D3A1B] shrink-0" />
            <span className="font-medium text-[#2F241C] break-all">
              {loading ? "Loading..." : location?.email || "connect@honeyveda.in"}
            </span>
          </p>
          <p className="flex items-center gap-3">
            <Clock size={16} className="text-[#2D3A1B] shrink-0" />
            <span className="font-medium text-[#2F241C] whitespace-nowrap">
              {loading ? "Loading..." : location?.phone_timing || "Mon - Sat : 9AM - 6PM"}
            </span>
          </p>
        </div>
      </div>
      <div className="relative w-[100px] h-[90px] shrink-0 hidden sm:block">
        <Image
          src="/need.png"
          alt="Honey illustration"
          fill
          className="object-contain object-right-bottom"
        />
      </div>
    </div>
  );
}