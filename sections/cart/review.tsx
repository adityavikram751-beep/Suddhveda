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
  Home,
  Truck,
  CreditCard,
  Edit3,
  ShoppingBag,
  LockKeyhole,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";

const freeDeliveryTarget = 2000;

const steps = [
  { id: 1, title: "Address", subtitle: "Add delivery address" },
  { id: 2, title: "Shipping", subtitle: "Choose shipping method" },
  { id: 3, title: "Review", subtitle: "Review & place order" },
  { id: 4, title: "Payment", subtitle: "Select payment option" },
] as const;

type Address = {
  id: string;
  label: string;
  isDefault: boolean;
  name: string;
  line: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
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

const mapApiAddress = (item: any): Address => ({
  id: item._id,
  label: item.address_type === "home" ? "Home" : item.address_type === "work" ? "Office" : "Other",
  isDefault: item.is_default || false,
  name: item.full_name || "",
  line: `${item.address_line1 || ""} ${item.address_line2 || ""}`.trim(),
  city: item.city || "",
  state: item.state || "",
  pincode: item.pincode || "",
  phone: item.phone || "",
});

export default function ReviewPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  const [address, setAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);

  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [deliveryLabel, setDeliveryLabel] = useState<string>("Standard Shipping");
  const [deliveryDescription, setDeliveryDescription] = useState<string>("Delivery in 3-5 business days");

  const [paymentLabel, setPaymentLabel] = useState<string>("Cash on Delivery (COD)");
  const [codCharge, setCodCharge] = useState<number>(0);

  const [location, setLocation] = useState<LocationData | null>(null);

  const mapCartItemsToProducts = (items: any) => {
    const rawItems = Array.isArray(items) ? items : Object.values(items || {});
    return rawItems.map((item: any) => {
      if (item.type === "CUSTOM") {
        const giftBox = item.giftBox || {};
        return {
          id: item.giftCartItemId || item._id,
          cartItemId: item.giftCartItemId || item._id,
          title: `🎁 ${giftBox.name || "Gift Box"}`,
          weight: `${item.totalWeight || 0}g`,
          price: item.totalAmount || 0,
          quantity: item.quantity || 1,
          image: giftBox.image || "/placeholder.png",
          oldPrice: 0,
          type: "CUSTOM",
        };
      }

      const product = item.product || {};
      const variant = item.variant || product.variant || {};
      return {
        id: product._id || item.cartItemId || item._id,
        cartItemId: item.cartItemId || item._id,
        title: product.product_name || item.productName || item.title || "Honey",
        weight: variant.weight ? `${variant.weight}${variant.unit || 'g'}` : item.weight || "",
        price: variant.price || item.price || 0,
        quantity: item.quantity || 1,
        image: product.image?.image_url || product.image?.url || item.image || "/placeholder.png",
        oldPrice: variant.mrp || variant.oldPrice || item.oldPrice || 0,
        type: "NORMAL",
      };
    });
  };

  useEffect(() => {
    if (cartItems && Object.keys(cartItems).length > 0) {
      const mapped = mapCartItemsToProducts(cartItems);
      if (mapped.length > 0) {
        setCartProducts(mapped);
        setCartLoading(false);
      }
    }
  }, [cartItems]);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      const storedCoupon = localStorage.getItem("applied_coupon");
      if (storedCoupon) {
        try {
          const parsed = JSON.parse(storedCoupon);
          if (parsed?.discount) setCouponDiscount(parsed.discount);
          if (parsed?.coupon?.code) setAppliedCouponCode(parsed.coupon.code);
        } catch (e) {
          console.error("Error parsing saved coupon", e);
        }
      }

      const storedShipping = localStorage.getItem("selected_shipping");
      if (storedShipping) {
        try {
          const parsed = JSON.parse(storedShipping);
          setDeliveryCharge(Number(parsed?.price) || 0);
          setDeliveryLabel(parsed?.label || "Standard Shipping");
          setDeliveryDescription(
            parsed?.id === "express"
              ? "Delivery in 1-2 business days"
              : parsed?.id === "priority"
              ? "Delivery by tomorrow"
              : "Delivery in 3-5 business days"
          );
        } catch (e) {
          console.error("Error parsing saved shipping method", e);
        }
      }

      const storedPayment = localStorage.getItem("selected_payment");
      if (storedPayment) {
        try {
          if (storedPayment === "cod") {
            setPaymentLabel("Cash on Delivery (COD)");
          } else if (storedPayment === "upi") {
            setPaymentLabel("Online Payment");
          } else {
            setPaymentLabel(storedPayment);
          }
        } catch (e) {
          console.error("Error parsing saved payment method", e);
        }
      }
    }
  }, [isMounted]);

  const fetchCart = async () => {
    try {
      if (cartProducts.length === 0) {
        setCartLoading(true);
      }
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

      if (isMounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("applied_coupon");
        if (!stored && apiDiscount > 0) {
          setCouponDiscount(apiDiscount);
          setAppliedCouponCode(apiCode);
        }
      }

      const items = data.items || data.data?.items || (Array.isArray(data.data) ? data.data : []) || [];
      const mapped = mapCartItemsToProducts(items);
      if (mapped.length > 0) {
        setCartProducts(mapped);
      }
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      if (cartProducts.length === 0) {
        setCartError(err.message || "Failed to load cart");
      }
    } finally {
      setCartLoading(false);
    }
  };

  const fetchAddress = async () => {
    try {
      setAddressLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/addresses/all`, {
        credentials: "include",
      });
      if (!res.ok) {
        setAddress(null);
        return;
      }
      const data = await res.json();
      const items = data.data || [];
      const list: Address[] = items.map((item: any): Address => mapApiAddress(item));

      const storedId =
        isMounted && typeof window !== "undefined" ? localStorage.getItem("selected_address_id") : null;
      const selected = storedId ? list.find((a) => a.id === storedId) : null;

      if (selected) {
        setAddress(selected);
      } else if (list.length > 0) {
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setAddress(defaultAddr);
      } else {
        setAddress(null);
      }
    } catch (err) {
      console.error("Error fetching address:", err);
      setAddress(null);
    } finally {
      setAddressLoading(false);
    }
  };

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

  useEffect(() => {
    if (isMounted) {
      fetchCart();
      fetchAddress();
      fetchLocation();
    }
  }, [isMounted]);

  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const saved = cartProducts.reduce((sum, p) => {
    const perUnitSaving = Math.max((p.oldPrice || 0) - p.price, 0);
    const cappedPerUnit = Math.min(perUnitSaving, p.price || perUnitSaving);
    return sum + cappedPerUnit * p.quantity;
  }, 0);

  const computedCodCharge = paymentLabel.toLowerCase().includes("cash on delivery") || paymentLabel.toLowerCase().includes("cod") ? Math.round(subtotal * 0.25) : 0;
  const total = Math.max(subtotal + deliveryCharge - couponDiscount + computedCodCharge, 0);
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const handleBack = () => {
    router.push("/shipping");
  };

  const handlePlaceOrder = () => {
    router.push("/order-confirmation");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFF8EF] py-8 text-[#2F241C] md:py-10">
      <div className="mx-auto max-w-[1410px] px-4 md:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">
          
          {/* Left Column - Scrollable */}
          <section className="flex flex-col gap-7">
            {/* Header */}
            <header className="relative pr-28">
              <h1 className="font-serif text-[42px] font-bold leading-none text-[#593102] md:text-[48px]">
                Review &amp; Place Order
              </h1>
              <p className="mt-4 text-[16px] text-[#5D6778]">
                Please review your order details and confirm your purchase.
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

           
                       {/* Stepper */}
                       <div className="rounded-lg border border-[#F4D7B8] bg-white/55 px-2 sm:px-4 py-3 sm:py-4 shadow-sm">
                         <div className="flex items-center justify-between gap-1 sm:gap-2">
                           {steps.map((step) => {
                             const isDone = step.id < 3;
                             const isActive = step.id === 3;
                             return (
                               <div key={step.id} className="flex min-w-0 flex-1 items-center">
                                 <div className="flex min-w-0 items-center gap-1 sm:gap-3">
                                   <span
                                     className={`hidden sm:flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border text-[14px] sm:text-[16px] font-bold ${
                                       isDone
                                         ? "border-[#77AE61] bg-white text-[#77AE61]"
                                         : isActive
                                         ? "border-[#D18500] bg-[#D18500] text-white"
                                         : "border-[#F0DDC8] bg-white text-[#2F241C]"
                                     }`}
                                   >
                                     {isDone ? <CheckCircle2 size={22} className="sm:w-[28px] sm:h-[28px]" strokeWidth={1.8} /> : step.id}
                                   </span>
                                   <span
                                     className={`sm:hidden h-3 w-3 rounded-full shrink-0 ${
                                       isDone ? "bg-[#77AE61]" : isActive ? "bg-[#D18500]" : "bg-[#F0DDC8]"
                                     }`}
                                   />
                                   <div className="min-w-0">
                                     <p
                                       className={`text-[11px] sm:text-[15px] font-semibold leading-tight truncate ${
                                         isActive ? "text-[#D18500]" : "text-[#2F241C]"
                                       }`}
                                     >
                                       {step.title}
                                     </p>
                                     <p className="hidden sm:block mt-0.5 sm:mt-1 truncate text-[10px] sm:text-[12px] leading-tight text-[#596273]">
                                       {step.subtitle}
                                     </p>
                                   </div>
                                 </div>
                                 {step.id < steps.length && (
                                   <span className="mx-1 sm:mx-3 hidden sm:block shrink-0 text-[20px] sm:text-[26px] leading-none text-[#F0A33A]">
                                     &rsaquo;
                                   </span>
                                 )}
                               </div>
                             );
                           })}
                         </div>
                       </div>
           

            {/* Delivery Details */}
            <section className="rounded-xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#593102]">Delivery Details</h2>
                <button
                  onClick={() => router.push("/checkout")}
                  className="flex items-center gap-1 text-[13px] text-[#D18500]"
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>

              <div className="mt-7 grid gap-7 md:grid-cols-3">
                <div className="flex items-start gap-4">
                  <Home size={20} className="mt-1 text-[#3A2418]" />
                  <div>
                    {addressLoading ? (
                      <p className="text-[14px] text-[#B59A78]">Loading address...</p>
                    ) : address ? (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-[16px] font-bold text-[#3A2418]">{address.label}</p>
                          {address.isDefault && (
                            <span className="rounded bg-[#F2F4F7] px-2 py-1 text-[10px] text-[#8A94A6]">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-[15px] leading-7 text-[#686F7C]">
                          {address.name}
                          <br />
                          {address.line}
                          <br />
                          {address.city} - {address.pincode}
                          <br />
                          {address.state}
                          <br />
                          {address.phone}
                        </p>
                      </>
                    ) : (
                      <p className="text-[14px] text-[#B59A78]">No address found.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Truck size={20} className="mt-1 text-[#3A2418]" />
                  <div>
                    <p className="text-[16px] font-bold text-[#3A2418]">Shipping Method</p>
                    <p className="mt-3 text-[15px] text-[#3A2418]">
                      {deliveryLabel}
                      {deliveryCharge === 0 ? " (FREE)" : ` (₹${deliveryCharge})`}
                    </p>
                    <p className="mt-1 text-[15px] text-[#686F7C]">{deliveryDescription}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CreditCard size={20} className="mt-1 text-[#3A2418]" />
                  <div>
                    <p className="text-[16px] font-bold text-[#3A2418]">Payment Method</p>
                    <p className="mt-3 text-[15px] font-semibold text-[#3A2418]">{paymentLabel}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 🔥 "Items in Your Order" section REMOVED completely */}

            {/* Secure Checkout Badge */}
            <div className="flex flex-col gap-3 rounded-md border border-[#BFDDB4] bg-[#EDF8E7] px-5 py-3 text-[12px] font-semibold text-[#0F6B33] sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-3">
                <ShieldCheck size={16} fill="#0F6B33" className="text-white" />
                Your order is 100% safe and secure. We never share your information.
              </span>
              <span className="flex items-center gap-5 text-[#5D6778]">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck size={14} /> Secure Checkout
                </span>
                <span className="inline-flex items-center gap-1">
                  <LockKeyhole size={14} /> SSL Encrypted
                </span>
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
                onClick={handlePlaceOrder}
                className="flex h-14 w-full items-center justify-center gap-3 whitespace-nowrap rounded-md bg-[#E17C00] px-8 text-[20px] font-bold text-white shadow-[0_12px_22px_rgba(201,123,0,0.18)] transition hover:bg-[#C96F00] sm:w-[340px]"
              >
                <ShoppingBag size={20} />
                Place Order
                <span>₹{total.toLocaleString("en-IN")}</span>
              </button>
            </div>
          </section>

          {/* Right Column - Order Summary */}
          <aside className="lg:sticky lg:top-6 flex flex-col">
            <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[18px] sm:text-[20px] font-bold">Order Summary</h2>
                <span className="text-[11px] sm:text-[12px] text-[#9AA3AF]">{cartProducts.length} Items</span>
              </div>

              {/* Product List - 2 items visible, scroll for more */}
              <div className="mt-4 max-h-[150px] space-y-4 overflow-y-auto pr-1 scrollbar-hide">
                {cartLoading ? (
                  <p className="text-center text-[#9AA3AF] py-4">Loading cart...</p>
                ) : cartError ? (
                  <p className="text-center text-red-600 py-4">{cartError}</p>
                ) : cartProducts.length === 0 ? (
                  <p className="text-center text-[#9AA3AF]">Your cart is empty.</p>
                ) : (
                  cartProducts.map((product: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                        <Image src={product.image} alt={product.title} fill className="object-contain p-1.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] font-semibold truncate">{product.title}</p>
                        <p className="text-[10px] sm:text-[11px] text-[#9AA3AF]">{product.weight || "Weight"}</p>
                        <p className="text-[10px] sm:text-[11px] text-[#9AA3AF]">Qty: {product.quantity}</p>
                      </div>
                      <p className="text-[13px] sm:text-[14px] font-bold shrink-0">₹{product.price * product.quantity}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-3 border-t border-[#EEF1F4] pt-4 text-[12px] sm:text-[13px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#593102]">₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong className="text-[#0BA445]">{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</strong>
                </div>
                <div className="flex justify-between">
                  <span>You Save</span>
                  <strong className="text-[#0BA445]">- ₹{saved.toLocaleString("en-IN")}</strong>
                </div>
                {couponDiscount > 0 && (
                  <div className="mt-2 rounded-xl border border-dashed border-[#0BA445]/40 bg-[#F0FFF4] p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0BA445] text-white text-[10px] font-bold">✓</span>
                        <span className="text-[12px] font-bold text-[#187A37]">Coupon Applied</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#0BA445]">- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                    {appliedCouponCode && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {appliedCouponCode.split(',').map((code: string, i: number) => (
                          <span key={i} className="inline-block rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-[#187A37] border border-[#D7F3D9]">
                            {code.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {computedCodCharge > 0 && (
                  <div className="flex justify-between text-[#D18500] font-bold pt-1 border-t border-dashed border-[#E5E8ED]">
                    <span>COD Charge</span>
                    <span>+ ₹{computedCodCharge.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-4 flex items-end justify-between border-t border-[#EEF1F4] pt-4">
                <div>
                  <p className="text-[18px] sm:text-[21px] font-bold">Total</p>
                  <p className="text-[9px] sm:text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
                </div>
                <p className="font-serif text-[24px] sm:text-[28px] font-bold">₹{total.toLocaleString("en-IN")}</p>
              </div>

              {/* Savings box */}
              <div className="mt-4 rounded-[14px] border border-[#D7F3D9] bg-[#F0FFF4] p-3 sm:p-4">
                <p className="flex items-center gap-2 text-[12px] sm:text-[13px] font-semibold text-[#187A37]">
                  <ShieldCheck size={14} /> You&apos;re saving ₹{(saved + couponDiscount).toLocaleString("en-IN")} on this order!
                </p>
                {remaining > 0 && (
                  <p className="mt-1.5 text-[11px] text-[#4C5362]">
                    Add items worth ₹{remaining} more to get FREE delivery!
                  </p>
                )}
              </div>

              {/* Need help */}
              <div className="relative mt-6 pt-4 border-t border-[#EEF1F4]">
                <h2 className="font-serif text-[17px] sm:text-[19px] font-bold">Need help ?</h2>
                <div className="mt-2 space-y-1.5 text-[14px] text-[#6F7786]">
                  <p className="flex items-center gap-2"><Phone size={14} /> {location?.phone || "+91 98765 43210"}</p>
                  <p className="flex items-center gap-2"><Mail size={14} /> {location?.email || "connect@honeyveda.in"}</p>
                  <p className="flex items-center gap-2"><Clock size={14} /> {location?.phone_timing || "Mon - Sat : 9AM - 6PM"}</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}