"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  RotateCcw,
  Leaf,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Wallet,
  Smartphone,
  LockKeyhole,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

const freeDeliveryTarget = 2000;

const steps = [
  { id: 1, title: "Address", subtitle: "Add delivery address" },
  { id: 2, title: "Shipping", subtitle: "Choose shipping method" },
  { id: 3, title: "Review", subtitle: "Review & place order" },
  { id: 4, title: "Payment", subtitle: "Select payment option" },

] as const;

type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
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

// 🔥 Shipping methods hata ke COD + UPI payment options
const paymentMethods: PaymentMethod[] = [
  {
    id: "cod",
    label: "Cash on Delivery (COD)",
    description: "Pay with cash when your order is delivered",
    icon: <Wallet size={20} strokeWidth={2.4} />,
  },
  {
    id: "upi",
    label: "Online Payment",
    description: "Pay instantly using Google Pay, PhonePe, Paytm,Debit Card,Credit Card etc.",
    icon: <Smartphone size={20} strokeWidth={2.4} />,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("cod");

  // ---------- Delivery charge carried forward from Shipping page ----------
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [deliveryLabel, setDeliveryLabel] = useState<string>("Standard Shipping");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selected_shipping");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDeliveryCharge(Number(parsed?.price) || 0);
          setDeliveryLabel(parsed?.label || "Standard Shipping");
        } catch (e) {
          console.error("Error parsing saved shipping method", e);
        }
      }
    }
  }, []);

  // ---------- Location (for Need Help) ----------
  const [location, setLocation] = useState<LocationData | null>(null);

  const fetchLocation = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/location/all`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const loc = data.data || data;
        setLocation({
          phone: loc.phone || "+91 98765 43210",
          phone_timing: loc.phone_timing || "Mon - Sat : 9AM - 7PM",
          email: loc.email || "connect@honeyveda.in",
          email_reply_time: loc.email_reply_time || "We reply within 24 hrs",
          whatsapp: loc.whatsapp || "",
          whatsapp_timing: loc.whatsapp_timing || "",
          map_embed_url: loc.map_embed_url || "",
        });
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  // ---------- Real cart data (same source as Checkout) ----------
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("applied_coupon");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.discount) setCouponDiscount(parsed.discount);
          if (parsed?.coupon?.code) setAppliedCouponCode(parsed.coupon.code);
        } catch (e) {
          console.error("Error parsing saved coupon", e);
        }
      }
    }
  }, []);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      setCartError(null);
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        credentials: "include",
      });
      if (res.status === 401) {
        setCartError("Please log in to view your cart.");
        setCartProducts([]);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const rawDiscount =
        data.couponDiscount ?? data.discountAmount ?? data.discount ?? data.data?.discountAmount ?? 0;
      const apiDiscount = typeof rawDiscount === "string" ? parseFloat(rawDiscount) || 0 : rawDiscount;
      const apiCode = data.appliedCoupon?.code || data.couponCode || "";

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("applied_coupon");
        if (!stored && apiDiscount > 0) {
          setCouponDiscount(apiDiscount);
          setAppliedCouponCode(apiCode);
        }
      }

      const items = data.items || [];
      const products: any[] = [];
      items.forEach((item: any) => {
        if (item.type === "NORMAL" && item.product) {
          const product = item.product;
          const variant = product.variant || {};
          products.push({
            id: product._id || item.cartItemId,
            cartItemId: item.cartItemId || item._id,
            title: product.product_name || "Honey",
            weight: variant.weight ? `${variant.weight}g` : "",
            price: variant.price || 0,
            quantity: item.quantity || 1,
            image: product.image?.image_url || "/placeholder.png",
            oldPrice: variant.mrp || 0,
          });
        } else if (item.type === "CUSTOM") {
          const giftBox = item.giftBox || {};
          products.push({
            id: item.giftCartItemId || item._id,
            cartItemId: item.giftCartItemId || item._id,
            title: `🎁 ${giftBox.name || "Gift Box"}`,
            weight: `${item.totalWeight || 0}g`,
            price: item.totalAmount || 0,
            quantity: item.quantity || 1,
            image: giftBox.image || "/placeholder.png",
            oldPrice: 0,
          });
        }
      });
      setCartProducts(products);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setCartError(err.message || "Failed to load cart");
      setCartProducts([]);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchLocation();
  }, []);

  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // 🔥 Safety guard: if a product's mrp/oldPrice from the API is bad data
  // (e.g. mrp far larger than price, or mrp missing/0 for the sale price),
  // don't let one bad record inflate "You Save" past the subtotal itself.
  const saved = cartProducts.reduce((sum, p) => {
    const perUnitSaving = Math.max((p.oldPrice || 0) - p.price, 0);
    // A single item can never "save" more than its own listed price.
    const cappedPerUnit = Math.min(perUnitSaving, p.price || perUnitSaving);
    return sum + cappedPerUnit * p.quantity;
  }, 0);

  // Real total = items + delivery charge - coupon discount + COD charge (if COD selected)
  const codChargePercent = 0.25;
  const codCharge = selectedMethod === "cod" ? Math.round(subtotal * codChargePercent) : 0;
  const total = Math.max(subtotal + deliveryCharge - couponDiscount + codCharge, 0);
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const handleContinue = () => {
    router.push("/review");
  };

  const handleBack = () => {
    router.push("/shipping");
  };

  return (
    <main className="min-h-screen bg-[#FFF8EF] py-8 text-[#2F241C] md:py-10">
      <div className="mx-auto max-w-[1410px] px-4 md:px-6">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_420px]">
          <section className="flex h-full flex-col gap-8">
            <header className="relative pr-28">
              <h1 className="font-serif text-[42px] font-bold leading-none text-[#2D3A1B] md:text-[48px]">
                Payment
              </h1>
              <p className="mt-4 text-[16px] text-[#5D6778] md:text-[18px]">
                Almost there! Just choose how you&apos;d like to pay.
              </p>
              <Image
                src="/bee with honey bottle.png"
                alt="Honey jar with bee"
                width={110}
                height={92}
                className="absolute right-0 top-0 hidden object-contain sm:block"
                priority
              />
            </header>

            <div className="rounded-lg border border-[#F4D7B8] bg-white/55 px-3 py-4 shadow-sm md:px-4">
              <div className="flex items-center justify-between gap-2">
                {steps.map((step, index) => {
                  const isDone = step.id < 2;
                  const isActive = step.id === 2;

                  return (
                    <div key={step.id} className="flex min-w-0 flex-1 items-center">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-[16px] font-bold ${
                            isDone
                              ? "border-[#77AE61] bg-white text-[#77AE61]"
                              : isActive
                              ? "border-[#D18500] bg-[#D18500] text-white"
                              : "border-[#F0DDC8] bg-white text-[#2F241C]"
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={28} strokeWidth={1.8} /> : step.id}
                        </span>
                        <div className="hidden min-w-0 sm:block">
                          <p
                            className={`text-[15px] font-semibold leading-tight ${
                              isActive ? "text-[#D18500]" : "text-[#2F241C]"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="mt-1 truncate text-[12px] leading-tight text-[#596273]">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <span className="mx-3 hidden shrink-0 text-[26px] leading-none text-[#F0A33A] md:block">
                          &rsaquo;
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 md:pt-10">
              <h2 className="mb-6 text-[20px] font-semibold text-[#2F3033] md:text-[22px]">
                Choose Payment Method
              </h2>

              <div className="space-y-5">
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod === method.id;

                  return (
                    <label
                      key={method.id}
                      className={`flex min-h-[112px] cursor-pointer items-center justify-between rounded-lg border bg-white px-5 py-5 transition ${
                        isSelected
                          ? "border-[#E08600] shadow-[0_0_0_1px_rgba(224,134,0,0.08)]"
                          : "border-[#E8E4DE] hover:border-[#F0B761]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-5">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-[#D98200] bg-[#D98200]"
                              : "border-[#8D99A8] bg-white"
                          }`}
                        >
                          {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                        </span>
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FFF5E8] text-[#DF8500]">
                          {method.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[16px] font-bold text-[#2D3A1B]">
                            {method.label}
                          </span>
                          <span className="mt-1 block text-[14px] text-[#6F7786]">
                            {method.description}
                          </span>
                          {method.id === "cod" && subtotal > 0 && (
                            <span className="mt-1 block text-[12px] font-semibold text-[#D18500]">
                              + ₹{Math.round(subtotal * 0.25).toLocaleString("en-IN")} COD charge
                            </span>
                          )}
                        </span>
                      </div>

                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setSelectedMethod(method.id)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3 bg-white/30 px-4 py-3 text-[14px] text-[#586274]">
                <LockKeyhole size={16} className="shrink-0 text-[#D18500]" />
                <p>Your payment information is safe and encrypted with us.</p>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#E08600] bg-white px-8 text-[15px] font-medium text-[#D18500] transition hover:bg-[#FFF5E8] sm:w-auto sm:min-w-[220px]"
              >
                <ArrowLeft size={18} />
                Back to Shipping
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#C97B00] px-8 text-[15px] font-medium text-white shadow-[0_12px_22px_rgba(201,123,0,0.18)] transition hover:bg-[#B97100] sm:w-auto sm:min-w-[260px]"
              >
                Continue to Review
                <ArrowRight size={18} />
              </button>
            </div>
          </section>

          <aside className="flex h-full flex-col">
            <div className="flex w-full flex-1 flex-col rounded-[4px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
                <span className="text-[12px] text-[#7B8493]">
                  {cartProducts.length} Items
                </span>
              </div>

              {cartLoading ? (
                <p className="mt-7 text-center text-[#B59A78]">Loading cart...</p>
              ) : cartError ? (
                <p className="mt-7 text-center text-red-600">{cartError}</p>
              ) : (
                <>
                  <div className="mt-7 max-h-[280px] space-y-7 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
                    {cartProducts.length === 0 ? (
                      <p className="text-center text-[#9AA3AF]">Your cart is empty.</p>
                    ) : (
                      cartProducts.map((product) => (
                        <div key={product.cartItemId || product.id} className="flex items-start gap-4">
                          <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden bg-[#FFF8EF]">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-contain p-1.5"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-bold text-[#2D3A1B]">
                              {product.title}
                            </p>
                            <p className="mt-2 text-[11px] text-[#9AA3AF]">
                              {product.weight || "Selected weight"} • Raw & Unfiltered
                            </p>
                            <p className="mt-2 text-[12px] text-[#6F7786]">
                              Qty: {product.quantity}
                            </p>
                          </div>
                          <p className="text-[16px] font-bold text-[#2D3A1B]">
                            ₹{product.price * product.quantity}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-8 space-y-4 border-t border-[#EEF1F4] pt-5 text-[14px] text-[#6F7786]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <strong className="text-[#2D3A1B]">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>You Save</span>
                      <strong className="text-[#0BA445]">- ₹{saved.toLocaleString("en-IN")}</strong>
                    </div>
                  
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-[#0BA445] font-bold pt-1 border-t border-dashed border-[#E5E8ED]">
                        <span>Coupon Discount {appliedCouponCode ? `(${appliedCouponCode})` : ""}</span>
                        <span>- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {selectedMethod === "cod" && codCharge > 0 && (
                      <div className="flex justify-between text-[#D18500] font-bold pt-1 border-t border-dashed border-[#E5E8ED]">
                        <span>COD Charge</span>
                        <span>+ ₹{codCharge.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div className="flex items-baseline gap-1">
                      <p className="text-[19px] font-bold text-[#2D3A1B]">Total</p>
                      <p className="text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
                    </div>
                    <p className="font-serif text-[26px] font-bold text-[#2D3A1B]">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="mt-6 rounded-md border border-[#D7F3D9] bg-[#F0FFF4] p-4">
                    <p className="flex items-center gap-2 text-[13px] font-bold text-[#187A37]">
                      <ShieldCheck size={16} /> You&apos;re saving ₹{(saved + couponDiscount).toLocaleString("en-IN")} on this order!
                    </p>
                    {remaining > 0 && (
                      <>
                        <p className="mt-4 text-[12px] text-[#4C5362]">
                          Add items worth ₹{remaining} more to get FREE delivery!
                        </p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#DDEFE0]">
                          <div
                            className="h-full rounded-full bg-[#0BA445]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-[10px] text-[#9AA3AF]">
                          <span>₹0</span>
                          <span>₹{freeDeliveryTarget.toLocaleString("en-IN")}</span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              <div className="mt-14 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Secure Checkout</p>
                  <p className="text-[9px] text-[#9AA3AF]">100% safe payments</p>
                </div>
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
                  <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
                </div>
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <Leaf className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">100% Natural</p>
                  <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[152px] bg-white px-8 pb-8 pt-6">
              <h2 className="text-[18px] font-bold text-black">Need help ?</h2>
              <div className="mt-3 space-y-2 text-[15px] text-[#6F7786]">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-[#2D3A1B]" />
                  {location?.phone || "+91 98765 43210"}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-[#2D3A1B]" />
                  {location?.email || "connect@honeyveda.in"}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-[#2D3A1B]" />
                  {location?.phone_timing || "Mon - Sat : 9AM - 7PM"}
                </p>
              </div>
              <Image
                src="/need.png"
                alt="Honey dipper and honeycomb"
                width={185}
                height={92}
                className="absolute bottom-0 right-0 hidden object-contain sm:block"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}