"use client";

import Link from "next/link";
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
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";

const freeDeliveryTarget = 2000;

// Steps: Address → Shipping → Payment → Review
const steps = [
  { id: 1, title: "Address", subtitle: "Add delivery address" },
  { id: 2, title: "Shipping", subtitle: "Choose shipping method" },
  { id: 3, title: "Payment", subtitle: "Select payment option" },
  { id: 4, title: "Review", subtitle: "Review & place order" },
] as const;

const address = {
  label: "Home",
  name: "Rahul Sharma",
  line: "123, Green Avenue, Near City Park Koramangala, Bengaluru",
  pincode: "560034",
  state: "Karnataka, India",
  phone: "+91 98765 43210",
};

export default function ReviewPage() {
  const router = useRouter();
  const { cartItems } = useCart();

  const cartProducts = allProducts
    .filter((product) => cartItems[product.id] > 0)
    .map((product) => ({ ...product, quantity: cartItems[product.id] }));
  const visibleProducts =
    cartProducts.length > 0
      ? cartProducts
      : allProducts.slice(0, 2).map((product) => ({ ...product, quantity: 1 }));

  const subtotal = visibleProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const saved = visibleProducts.reduce(
    (sum, product) =>
      sum + Math.max(product.oldPrice - product.price, 0) * product.quantity,
    0
  );
  const total = subtotal;
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const handleBack = () => {
    router.push("/shipping");
  };

  const handlePlaceOrder = () => {
    router.push("/payment");
  };

  return (
    <main className="min-h-screen bg-[#FFF8EF] py-8 text-[#2F241C] md:py-10">
      <div className="mx-auto max-w-[1410px] px-4 md:px-6">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_420px]">
          {/* Left Column */}
          <section className="flex h-full flex-col gap-7">
            {/* Header */}
            <header className="relative pr-28">
              <h1 className="font-serif text-[42px] font-bold leading-none text-[#1F2937] md:text-[48px]">
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

            {/* Progress Steps */}
            <div className="rounded-lg border border-[#F4D7B8] bg-white/55 px-3 py-4 shadow-sm md:px-4">
              <div className="flex items-center justify-between gap-2">
                {steps.map((step, index) => {
                  const isDone = step.id < 4;
                  const isActive = step.id === 4;

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

            {/* Delivery Details */}
            <section className="rounded-xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#1F2937]">Delivery Details</h2>
                <button className="flex items-center gap-1 text-[13px] text-[#D18500]">
                  <Edit3 size={14} /> Edit
                </button>
              </div>

              <div className="mt-7 grid gap-7 md:grid-cols-3">
                <div className="flex items-start gap-4">
                  <Home size={20} className="mt-1 text-[#3A2418]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[16px] font-bold text-[#3A2418]">{address.label}</p>
                      <span className="rounded bg-[#F2F4F7] px-2 py-1 text-[10px] text-[#8A94A6]">
                        DEFAULT
                      </span>
                    </div>
                    <p className="mt-3 text-[15px] leading-7 text-[#686F7C]">
                      {address.name}
                      <br />
                      {address.line}
                      <br />- {address.pincode}
                      <br />
                      {address.state}
                      <br />
                      {address.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Truck size={20} className="mt-1 text-[#3A2418]" />
                  <div>
                    <p className="text-[16px] font-bold text-[#3A2418]">Shipping Method</p>
                    <p className="mt-3 text-[15px] text-[#3A2418]">Standard Shipping (FREE)</p>
                    <p className="mt-1 text-[15px] text-[#686F7C]">
                      Delivery in 3-5 business days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CreditCard size={20} className="mt-1 text-[#3A2418]" />
                  <div>
                    <p className="text-[16px] font-bold text-[#3A2418]">Payment Method</p>
                    <p className="mt-3 text-[15px] font-semibold text-[#3A2418]">UPI ▪</p>
                    <p className="mt-1 text-[15px] text-[#686F7C]">shudhveda@icici</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Items in Order */}
            <section className="rounded-xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#1F2937]">
                  Items in Your Order ({visibleProducts.length})
                </h2>
                <button className="flex items-center gap-1 text-[13px] text-[#D18500]">
                  <Edit3 size={14} /> Add Product
                </button>
              </div>

              <div className="mt-8 space-y-8">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="grid items-center gap-4 border-b border-[#F4F1ED] pb-8 last:border-b-0 md:grid-cols-[112px_1fr_120px_120px_120px]"
                  >
                    <div className="relative h-[86px] w-[86px] overflow-hidden rounded-md bg-[#FFF3D5]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <p className="text-[18px] font-bold text-[#1F2937]">{product.title}</p>
                      <p className="mt-1 text-[15px] font-medium text-[#7B8493]">
                        {product.weight.split(" - ")[0]} • Raw &amp; Unfiltered
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#E5F9EA] px-3 py-1 text-[11px] font-bold text-[#149447]">
                        <CheckCircle2 size={12} fill="#149447" className="text-white" />
                        100% Raw &amp; Unfiltered
                      </span>
                    </div>
                    <p className="text-[20px] font-bold text-[#1F2937]">₹{product.price}</p>
                    <span className="flex h-8 w-[96px] items-center justify-center rounded bg-[#FBFCFD] text-[15px] font-semibold text-[#2F3033] shadow-sm">
                      Qty: {product.quantity}
                    </span>
                    <p className="text-right text-[20px] font-bold text-[#1F2937]">
                      ₹{product.price * product.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-md border border-[#BFDDB4] bg-[#EDF8E7] px-5 py-3 text-[12px] font-semibold text-[#0F6B33] sm:flex-row sm:items-center sm:justify-between">
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
            </section>

            {/* Navigation Buttons */}
            <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#E08600] bg-white px-8 text-[15px] font-medium text-[#D18500] transition hover:bg-[#FFF5E8] sm:w-[220px]"
              >
                <ArrowLeft size={18} />
                Back to Shipping
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-md bg-[#E17C00] px-8 text-[20px] font-bold text-white shadow-[0_12px_22px_rgba(201,123,0,0.18)] transition hover:bg-[#C96F00] sm:w-[340px]"
              >
                <ShoppingBag size={20} />
                Place Order
                <span>₹{total.toLocaleString("en-IN")}</span>
              </button>
            </div>
          </section>

          {/* Right Column - Order Summary */}
          <aside className="flex h-full flex-col">
            {/* Order Summary Card */}
            <div className="w-full rounded-[4px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
                <span className="text-[12px] text-[#7B8493]">
                  {visibleProducts.length} Items
                </span>
              </div>

              {/* Product List - reduced spacing */}
              <div className="mt-10 max-h-[280px] space-y-5 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="flex items-start gap-4">
                    <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden bg-[#FFF8EF]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-[#1F2937]">
                        {product.title}
                      </p>
                      <p className="mt-1 text-[11px] text-[#9AA3AF]">
                        {product.weight.split(" - ")[0]} • Raw &amp; Unfiltered
                      </p>
                      <p className="mt-1 text-[12px] text-[#6F7786]">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <p className="text-[16px] font-bold text-[#1F2937]">
                      ₹{product.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals - reduced spacing */}
              <div className="mt-10 space-y-3 border-t border-[#EEF1F4] pt-4 text-[14px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#1F2937]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong className="text-[#0BA445]">FREE</strong>
                </div>
                <div className="flex justify-between">
                  <span>You Save</span>
                  <strong className="text-[#0BA445]">- ₹{saved}</strong>
                </div>
              </div>

              {/* Total */}
              <div className="mt-8 flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                  <p className="text-[19px] font-bold text-[#1F2937]">Total</p>
                  <p className="text-[10px] text-[#9AA3AF]">
                    (Inclusive of all taxes)
                  </p>
                </div>
                <p className="font-serif text-[26px] font-bold text-[#1F2937]">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Free Delivery Progress */}
              <div className="mt-10 rounded-md border border-[#D7F3D9] bg-[#F0FFF4] p-4">
                <p className="flex items-center gap-2 text-[13px] font-bold text-[#187A37]">
                  <ShieldCheck size={16} /> You&apos;re saving ₹{saved} on this order!
                </p>
                {remaining > 0 && (
                  <>
                    <p className="mt-3 text-[12px] text-[#4C5362]">
                      Add items worth ₹{remaining} more to get FREE delivery!
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DDEFE0]">
                      <div
                        className="h-full rounded-full bg-[#0BA445]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-[#9AA3AF]">
                      <span>₹0</span>
                      <span>₹{freeDeliveryTarget.toLocaleString("en-IN")}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Trust Badges - 3 columns */}
              <div className="mt-12 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">
                    Secure Checkout
                  </p>
                  <p className="text-[9px] text-[#9AA3AF]">100% safe payments</p>
                </div>
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
                  <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
                </div>
                <div className="rounded-md bg-white p-3 shadow-sm">
                  <Leaf className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">100% Natural</p>
                  <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
                </div>
              </div>
            </div>

            {/* Need help - directly below, no gap, with top border */}
            <div className="relative min-h-[152px] mt-8 border-t border-[#F2EFE9] bg-white px-8 pt-6 pb-8">
                <h2 className="text-[18px] font-bold text-black">Need help ?</h2>
              <div className="mt-3 space-y-2 text-[15px] text-[#6F7786]">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-[#D89A1B]" /> +91 98765 43210
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-[#D89A1B]" /> connect@honeyveda.in
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-[#D89A1B]" /> Mon - Sat : 9AM - 7PM
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