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
  ArrowRight,
  Truck,
  HeartHandshake,
  LockKeyhole,
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
    icon: <Truck size={20} strokeWidth={2.4} />,
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "Delivery in 1-2 business days",
    price: 99,
    icon: <Truck size={20} strokeWidth={2.4} />,
  },
  {
    id: "priority",
    label: "Priority Shipping",
    description: "Delivery by tomorrow",
    price: 149,
    icon: <HeartHandshake size={20} strokeWidth={2.4} />,
  },
];

export default function ShippingPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string>("standard");

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

  const selected = shippingMethods.find((method) => method.id === selectedMethod);
  const shippingCost = selected?.price || 0;
  const total = subtotal + shippingCost;
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const handleContinue = () => {
    router.push("/review");
  };

  const handleBack = () => {
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#FFF8EF] py-8 text-[#2F241C] md:py-10">
      <div className="mx-auto max-w-[1410px] px-4 md:px-6">
       

        <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_420px]">
          <section className="flex h-full flex-col gap-8">
            <header className="relative pr-28">
              <h1 className="font-serif text-[42px] font-bold leading-none text-[#1F2937] md:text-[48px]">
                Shipping
              </h1>
              <p className="mt-4 text-[16px] text-[#5D6778] md:text-[18px]">
                Almost there! Just a few more details to get your pure honey.
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
                Choose Shipping Method
              </h2>

              <div className="space-y-5">
                {shippingMethods.map((method) => {
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
                          <span className="block text-[16px] font-bold text-[#1F2937]">
                            {method.label}
                            {method.price === 0 && " (FREE)"}
                          </span>
                          <span className="mt-1 block text-[14px] text-[#6F7786]">
                            {method.description}
                          </span>
                        </span>
                      </div>

                      <span className="ml-4 shrink-0 text-right">
                        {method.price === 0 ? (
                          <>
                            <span className="block text-[16px] font-bold text-[#0BA445]">
                              FREE
                            </span>
                            <span className="mt-1 block text-[12px] text-[#0BA445]">
                              <span className="text-[#9AA3AF] line-through">₹40</span>{" "}
                              You save ₹{method.savings}
                            </span>
                          </>
                        ) : (
                          <span className="text-[22px] font-bold text-[#D18500]">
                            ₹{method.price}
                          </span>
                        )}
                      </span>
                      <input
                        type="radio"
                        name="shipping"
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
                <p>
                  All orders are carefully packed and shipped with love. We ensure
                  100% safe delivery.
                </p>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#E08600] bg-white px-8 text-[15px] font-medium text-[#D18500] transition hover:bg-[#FFF5E8] sm:w-[200px]"
              >
                <ArrowLeft size={18} />
                Back to Address
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#C97B00] px-8 text-[15px] font-medium text-white shadow-[0_12px_22px_rgba(201,123,0,0.18)] transition hover:bg-[#B97100] sm:w-[260px]"
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
                  {visibleProducts.length} Items
                </span>
              </div>

              <div className="mt-7 max-h-[280px] space-y-7 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
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
                      <p className="mt-2 text-[11px] text-[#9AA3AF]">
                        {product.weight.split(" - ")[0]} • Raw & Unfiltered
                      </p>
                      <p className="mt-2 text-[12px] text-[#6F7786]">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <p className="text-[16px] font-bold text-[#1F2937]">
                      ₹{product.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4 border-t border-[#EEF1F4] pt-5 text-[14px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#1F2937]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong className={shippingCost === 0 ? "text-[#0BA445]" : "text-[#1F2937]"}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>You Save</span>
                  <strong className="text-[#0BA445]">- ₹{saved}</strong>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
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

              <div className="mt-6 rounded-md border border-[#D7F3D9] bg-[#F0FFF4] p-4">
                <p className="flex items-center gap-2 text-[13px] font-bold text-[#187A37]">
                  <ShieldCheck size={16} /> You&apos;re saving ₹{saved} on this order!
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

              <div className="mt-14 grid grid-cols-3 gap-3 text-center">
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

            <div className="relative min-h-[152px] bg-white px-8 pb-8 pt-6">
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
