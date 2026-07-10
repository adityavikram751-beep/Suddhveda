"use client";

import { useState } from "react";
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
  Truck,
  Zap,
  Clock8,
  AlertTriangle,
  Circle,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";

const freeDeliveryTarget = 2000;

const steps = [
  { id: 1, title: "Address", subtitle: "Add delivery address" },
  { id: 2, title: "Shipping", subtitle: "Choose shipping method" },
  { id: 3, title: "Payment", subtitle: "Select payment option" },
  { id: 4, title: "Review", subtitle: "Review & place order" },
] as const;

type ShippingMethod = {
  id: string;
  label: string;
  description: string;
  price: number;
  savings?: number;
  icon: React.ReactNode;
};

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "Delivery in 3-5 business days",
    price: 0,
    savings: 40,
    icon: <Truck size={20} className="text-[#D89A1B]" strokeWidth={2} />,
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "Delivery in 1-2 business days",
    price: 99,
    icon: <Zap size={20} className="text-[#D89A1B]" strokeWidth={2} />,
  },
  {
    id: "priority",
    label: "Priority Shipping",
    description: "Delivery by tomorrow",
    price: 149,
    icon: <Clock8 size={20} className="text-[#D89A1B]" strokeWidth={2} />,
  },
];

export default function ShippingPage() {
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
    0,
  );
  const saved = visibleProducts.reduce(
    (sum, product) =>
      sum + Math.max(product.oldPrice - product.price, 0) * product.quantity,
    0,
  );

  const [selectedMethod, setSelectedMethod] = useState<string>("standard");
  const selected = shippingMethods.find((m) => m.id === selectedMethod);
  const shippingCost = selected?.price || 0;
  const total = subtotal + shippingCost;

  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const handleContinue = () => {
    router.push("/payment");
  };

  const handleBack = () => {
    router.push("/checkout");
  };

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-8 md:py-12 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#7B8493]">
          <Link href="/" className="font-medium text-[#2F241C] hover:text-[#D89A1B]">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/cart" className="font-medium text-[#2F241C] hover:text-[#D89A1B]">
            Cart
          </Link>{" "}
          &gt;{" "}
          <Link
            href="/checkout"
            className="font-medium text-[#2F241C] hover:text-[#D89A1B]"
          >
            Checkout
          </Link>{" "}
          &gt; <span className="font-semibold text-[#D89A1B]">Shipping</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-stretch">
          {/* LEFT COLUMN */}
          <section className="flex flex-col h-full">
            {/* Header */}
            <div className="relative">
              <h1 className="font-serif text-[32px] md:text-[34px] font-bold text-[#2F241C]">
                Shipping
              </h1>
              <p className="mt-1 text-[14px] text-[#7B8493]">
                Almost there! Just a few more details to get your pure honey.
              </p>
              <Image
                src="/honey.png"
                alt="Honey illustration"
                width={110}
                height={80}
                className="absolute right-0 top-0 hidden object-contain md:block"
              />
            </div>

            {/* Stepper — as per screenshot */}
            <div className="mt-8 rounded-[16px] border border-[#F2EFE9] bg-white px-4 py-5 md:px-6">
              <div className="flex items-center gap-2 md:gap-0">
                {steps.map((step, index) => {
                  const isActive = step.id === 2;
                  const isDone = step.id < 2;
                  return (
                    <div key={step.id} className="flex flex-1 items-center last:flex-none">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        {/* Circle with number or check */}
                        <span
                          className={`flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full text-[12px] md:text-[14px] font-bold transition-all ${
                            isDone
                              ? "bg-[#E7F9EA] text-[#0BA445]"
                              : isActive
                              ? "bg-[#D89A1B] text-white shadow-sm shadow-[#D89A1B]/20"
                              : "bg-[#F1F2F4] text-[#8A94A6]"
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={isActive ? 18 : 16} /> : step.id}
                        </span>
                        <div className="hidden sm:block">
                          <p
                            className={`text-[13px] md:text-[14px] font-semibold leading-tight ${
                              isActive ? "text-[#D89A1B]" : "text-[#2F241C]"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[10px] md:text-[11px] text-[#9AA3AF] leading-tight">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <span className="mx-2 md:mx-4 h-px flex-1 bg-[#EEF1F4]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="mt-6 flex-1 rounded-[16px] border border-[#F2EFE9] bg-white p-5 md:p-7 flex flex-col">
              <h2 className="font-serif text-[18px] md:text-[19px] font-bold text-[#2F241C]">
                Choose Shipping Method
              </h2>

              <div className="mt-4 md:mt-5 space-y-3 flex-1">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      selectedMethod === method.id
                        ? "border-[#D89A1B] bg-[#FFF8EF] shadow-sm"
                        : "border-[#EEF1F4] hover:border-[#E3D3B4]"
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={() => setSelectedMethod(method.id)}
                        className="h-4 w-4 md:h-[18px] md:w-[18px] border-[#D3D8DF] text-[#D89A1B] focus:ring-[#D89A1B] focus:ring-2 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[#2F241C]">{method.icon}</span>
                          <span className="font-semibold text-[14px] md:text-[15px] text-[#2F241C]">
                            {method.label}
                            {method.price === 0 && (
                              <span className="ml-1 text-[11px] md:text-[12px] font-bold text-[#0BA445]">
                                (FREE)
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-[12px] md:text-[13px] text-[#6F7786] mt-0.5">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      {method.price === 0 ? (
                        <span className="text-[14px] md:text-[15px] font-bold text-[#0BA445]">
                          FREE
                        </span>
                      ) : (
                        <span className="text-[14px] md:text-[15px] font-bold text-[#2F241C]">
                          ₹{method.price}
                        </span>
                      )}
                      {method.savings && method.price === 0 && (
                        <p className="text-[10px] md:text-[11px] text-[#0BA445] font-medium">
                          You save ₹{method.savings}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Delivery assurance alert — exactly like screenshot */}
              <div className="mt-5 md:mt-6 flex items-start gap-2 rounded-xl bg-[#FFF8EF] p-3 md:p-4 text-[12px] md:text-[13px] text-[#6F7786] border border-[#F0DDC4]">
                <AlertTriangle size={16} className="text-[#D89A1B] shrink-0 mt-0.5" />
                <p>
                  All orders are carefully packed and shipped with love. We ensure 100% safe delivery.
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-auto pt-5 md:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex h-11 md:h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#D3D8DF] px-5 md:px-6 text-[13px] md:text-[14px] font-semibold text-[#2F241C] hover:bg-[#F5F0EB] transition-all"
                >
                  <ArrowLeft size={16} />
                  Back to Address
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex h-11 md:h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#D18500] px-5 md:px-6 text-[13px] md:text-[14px] font-bold text-white hover:bg-[#B97100] transition-all shadow-sm"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN — Order Summary */}
          <aside className="flex flex-col h-full">
            <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-5 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[18px] md:text-[20px] font-bold text-[#2F241C]">
                  Order Summary
                </h2>
                <span className="text-[11px] md:text-[12px] text-[#9AA3AF]">
                  {visibleProducts.length} Items
                </span>
              </div>

              {/* Product list with scroll */}
              <div className="mt-4 md:mt-5 max-h-[220px] md:max-h-[280px] space-y-3 md:space-y-4 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-2 md:gap-3">
                    <div className="relative h-12 w-12 md:h-14 md:w-14 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] md:text-[14px] font-semibold text-[#2F241C] truncate">
                        {product.title}
                      </p>
                      <p className="text-[10px] md:text-[11px] text-[#9AA3AF] truncate">
                        {product.weight.split(" - ")[0]} - Raw & Unfiltered
                      </p>
                      <p className="text-[10px] md:text-[11px] text-[#9AA3AF]">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <p className="text-[13px] md:text-[14px] font-bold text-[#2F241C] shrink-0">
                      ₹{product.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-5 md:mt-6 space-y-2 md:space-y-3 border-t border-[#EEF1F4] pt-4 md:pt-5 text-[12px] md:text-[13px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#1F2937]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong className="text-[#0BA445]">
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>You Save</span>
                  <strong className="text-[#0BA445]">- ₹{saved}</strong>
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 md:mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-4 md:pt-6">
                <div>
                  <p className="text-[18px] md:text-[21px] font-bold text-[#2F241C]">
                    Total
                  </p>
                  <p className="text-[9px] md:text-[10px] text-[#9AA3AF]">
                    (Inclusive of all taxes)
                  </p>
                </div>
                <p className="text-[22px] md:text-[26px] font-bold text-[#2F241C]">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Free delivery progress */}
              <div className="mt-5 md:mt-6 rounded-[14px] border border-[#D7F3D9] bg-[#F0FFF4] p-3 md:p-4">
                <p className="flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-[#187A37]">
                  <ShieldCheck size={16} /> You&apos;re saving ₹{saved} on this
                  order!
                </p>
                {remaining > 0 && (
                  <>
                    <p className="mt-1.5 text-[11px] md:text-[12px] text-[#4C5362]">
                      Add items worth ₹{remaining} more to get FREE delivery!
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DDEFE0]">
                      <div
                        className="h-full rounded-full bg-[#0BA445] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] md:text-[10px] text-[#9AA3AF]">
                      <span>₹0</span>
                      <span>₹{freeDeliveryTarget}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-5 md:mt-6 grid grid-cols-3 gap-2 md:gap-3 text-center">
                <div className="rounded-xl bg-white p-2 md:p-3 shadow-sm border border-[#F2EFE9]">
                  <ShieldCheck className="mx-auto mb-1 h-4 w-4 md:h-5 md:w-5 text-[#D89A1B]" />
                  <p className="text-[9px] md:text-[10px] font-bold text-[#2F241C]">
                    Secure Checkout
                  </p>
                  <p className="text-[8px] md:text-[9px] text-[#9AA3AF]">
                    100% safe payments
                  </p>
                </div>
                <div className="rounded-xl bg-white p-2 md:p-3 shadow-sm border border-[#F2EFE9]">
                  <RotateCcw className="mx-auto mb-1 h-4 w-4 md:h-5 md:w-5 text-[#D89A1B]" />
                  <p className="text-[9px] md:text-[10px] font-bold text-[#2F241C]">
                    Easy Returns
                  </p>
                  <p className="text-[8px] md:text-[9px] text-[#9AA3AF]">
                    Hassle-free returns
                  </p>
                </div>
                <div className="rounded-xl bg-white p-2 md:p-3 shadow-sm border border-[#F2EFE9]">
                  <Leaf className="mx-auto mb-1 h-4 w-4 md:h-5 md:w-5 text-[#D89A1B]" />
                  <p className="text-[9px] md:text-[10px] font-bold text-[#2F241C]">
                    100% Natural
                  </p>
                  <p className="text-[8px] md:text-[9px] text-[#9AA3AF]">
                    Pure & unadulterated
                  </p>
                </div>
              </div>

              {/* Need Help */}
              <div className="mt-auto pt-5 md:pt-6 border-t border-[#EEF1F4]">
                <div className="relative">
                  <h2 className="font-serif text-[17px] md:text-[19px] font-bold text-[#2F241C]">
                    Need help ?
                  </h2>
                  <div className="mt-2 md:mt-3 space-y-1.5 md:space-y-2 text-[13px] md:text-[15px] text-[#6F7786]">
                    <p className="flex items-center gap-2">
                      <Phone size={15} className="text-[#D89A1B]" /> +91 98765
                      43210
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={15} className="text-[#D89A1B]" />{" "}
                      connect@honeyveda.in
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={15} className="text-[#D89A1B]" /> Mon - Sat :
                      9AM - 7PM
                    </p>
                  </div>
                  <div className="absolute bottom-0 right-0 opacity-90 hidden sm:block">
                    <Image
                      src="/need.png"
                      alt="Honey illustration"
                      width={180}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}