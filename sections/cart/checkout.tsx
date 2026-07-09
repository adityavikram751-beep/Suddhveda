"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  PackageCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";
import { FreeDeliveryBar, HelpPanel, OrderSummary, TrustBadges } from "./page";

const steps = ["Address", "Shipping", "Payment", "Review"];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const { cartItems } = useCart();
  const products = useMemo(() => {
    const items = allProducts
      .filter((product) => cartItems[product.id] > 0)
      .map((product) => ({ ...product, quantity: cartItems[product.id] }));
    return items.length > 0
      ? items
      : allProducts.slice(0, 2).map((product) => ({ ...product, quantity: 1 }));
  }, [cartItems]);
  const subtotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );
  const saved = products.reduce(
    (sum, product) =>
      sum + Math.max(product.oldPrice - product.price, 0) * product.quantity,
    0,
  );

  if (step === 4) {
    return <ThankYou products={products} subtotal={subtotal} saved={saved} />;
  }

  return (
    <main className="bg-[#FFF8EF] py-8 text-[#1F2937]">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-5 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="text-[13px] text-[#768193]">
            Home &gt; Cart &gt; Checkout &gt;{" "}
            <span className="font-bold text-[#D18500]">{steps[step]}</span>
          </p>
          <div className="mt-3 flex items-start justify-between">
            <div>
              <h1 className="font-serif text-[42px] font-bold">{steps[step]}</h1>
              <p className="text-[16px] text-[#5F6674]">
                Almost there! Just a few more details to get your pure honey.
              </p>
            </div>
            <Image src="/honey.png" alt="" width={120} height={90} />
          </div>

          <StepBar step={step} />

          {step === 0 && <AddressStep />}
          {step === 1 && <ShippingStep />}
          {step === 2 && <PaymentStep />}
          {step === 3 && <ReviewStep products={products} />}

          <div className="mt-10 flex justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              className="flex h-12 min-w-[210px] items-center justify-center gap-2 rounded border border-[#D18500] bg-white text-[15px] font-semibold text-[#D18500]"
            >
              <ArrowLeft size={16} />
              Back to {step === 0 ? "Cart" : steps[step - 1]}
            </button>
            <button
              type="button"
              onClick={() => setStep((current) => current + 1)}
              className="flex h-12 min-w-[240px] items-center justify-center gap-2 rounded bg-[#D18500] text-[15px] font-bold text-white shadow-lg shadow-[#D18500]/20"
            >
              {step === 3 ? "Place Order" : `Continue to ${steps[step + 1]}`}
              {step === 3 ? ` Rs.${subtotal.toLocaleString("en-IN")}` : <ArrowRight size={16} />}
            </button>
          </div>
        </section>

        <aside className="space-y-8">
          <CheckoutSummary products={products} subtotal={subtotal} saved={saved} />
          <HelpPanel />
        </aside>
      </div>
    </main>
  );
}

function StepBar({ step }: { step: number }) {
  return (
    <div className="mt-7 grid gap-2 rounded-lg border border-[#F0DDC4] bg-white p-4 md:grid-cols-4">
      {steps.map((label, index) => (
        <div key={label} className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-[15px] font-bold ${
              index < step
                ? "border-[#78B35F] text-[#78B35F]"
                : index === step
                  ? "border-[#D18500] bg-[#D18500] text-white"
                  : "border-[#F0DDC4] bg-[#FFF8EF] text-[#1F2937]"
            }`}
          >
            {index < step ? <Check size={20} /> : index + 1}
          </span>
          <span>
            <strong className={index === step ? "text-[#D18500]" : ""}>
              {label}
            </strong>
            <small className="block text-[#5F6674]">
              {index === 0 && "Add delivery address"}
              {index === 1 && "Choose shipping method"}
              {index === 2 && "Select payment option"}
              {index === 3 && "Review & place order"}
            </small>
          </span>
        </div>
      ))}
    </div>
  );
}

function AddressStep() {
  return (
    <>
      <div className="mt-8 rounded-lg bg-white p-6">
        <h2 className="font-serif text-[24px] font-bold">Delivery Address</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            "Enter your full name",
            "Enter 10 digit mobile number",
            "Enter pincode",
            "Enter locality or area",
            "Enter complete address",
            "Enter city or town",
            "Select state",
            "Any special instructions for delivery",
          ].map((placeholder, index) => (
            <input
              key={placeholder}
              placeholder={placeholder}
              className={`h-11 rounded border border-[#E9DED0] bg-white px-4 outline-none focus:border-[#D18500] ${
                index === 4 ? "md:col-span-2" : ""
              }`}
            />
          ))}
        </div>
      </div>
      <SavedAddresses />
    </>
  );
}

function SavedAddresses() {
  return (
    <div className="mt-8">
      <div className="flex justify-between">
        <h2 className="font-serif text-[24px] font-bold">Saved Addresses</h2>
        <button type="button" className="text-[#D18500]">+ Add New</button>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {["Home (Default)", "Office"].map((label, index) => (
          <div
            key={label}
            className={`rounded border bg-white p-5 ${
              index === 0 ? "border-[#D18500]" : "border-[#E9DED0]"
            }`}
          >
            <h3 className="flex items-center gap-2 font-bold text-[#D18500]">
              <Home size={16} /> {label}
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#5F6674]">
              Rahul Sharma<br />
              123, Green Avenue, Near City Park<br />
              Koramangala, Bengaluru - 560034<br />
              Karnataka, India<br />
              +91 98765 43210
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShippingStep() {
  return (
    <div className="mt-12">
      <h2 className="text-[22px] font-semibold">Choose Shipping Method</h2>
      <div className="mt-6 space-y-5">
        {[
          ["Standard Shipping (FREE)", "Delivery in 3-5 business days", "FREE"],
          ["Express Shipping", "Delivery in 1-2 business days", "Rs.99"],
          ["Priority Shipping", "Delivery by tomorrow", "Rs.149"],
        ].map(([title, desc, price], index) => (
          <div
            key={title}
            className={`flex items-center justify-between rounded-lg border bg-white p-6 ${
              index === 0 ? "border-[#D18500]" : "border-[#E9DED0]"
            }`}
          >
            <div className="flex items-center gap-5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#8B95A5]">
                {index === 0 && <span className="h-2.5 w-2.5 rounded-full bg-[#D18500]" />}
              </span>
              <Truck className="text-[#D18500]" />
              <span>
                <strong>{title}</strong>
                <p className="text-[#5F6674]">{desc}</p>
              </span>
            </div>
            <strong className={index === 0 ? "text-[#0BA445]" : "text-[#D18500]"}>
              {price}
            </strong>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded bg-white/50 p-4 text-[#5F6674]">
        All orders are carefully packed and shipped with love.
      </p>
    </div>
  );
}

function PaymentStep() {
  return (
    <div className="mt-12 grid gap-4 bg-white p-4 md:grid-cols-[330px_1fr]">
      <div>
        <h2 className="text-[22px] font-semibold">Choose a payment method</h2>
        {["UPI", "Credit/Debit Card", "Net Banking", "Wallets"].map((item, index) => (
          <button
            type="button"
            key={item}
            className={`mt-4 flex w-full items-center justify-between rounded border p-4 text-left ${
              index === 0 ? "border-[#D18500] bg-[#FFF8EF]" : "border-[#E9DED0]"
            }`}
          >
            <span className="font-bold">{item}<small className="block font-normal">Pay using {item}</small></span>
            <span className="font-bold italic">UPI</span>
          </button>
        ))}
      </div>
      <div className="grid gap-8 p-4 md:grid-cols-2">
        <div>
          <h3 className="font-bold">Scan & Pay with any UPI app</h3>
          <div className="mt-4 grid h-56 w-56 grid-cols-5 gap-1 bg-white p-3 shadow-inner">
            {Array.from({ length: 75 }).map((_, index) => (
              <span
                key={index}
                className={index % 3 === 0 || index % 7 === 0 ? "bg-black" : "bg-[#F1F1F1]"}
              />
            ))}
          </div>
          <p className="mt-3 text-center font-semibold">UPI ID: shudhveda@icici</p>
        </div>
        <div>
          <h3 className="font-bold">Pay using UPI ID / VPA</h3>
          <input
            value="shudhveda@icici"
            readOnly
            className="mt-5 h-12 w-full rounded border border-[#D6DDE6] px-4"
          />
          <div className="mt-6 rounded border border-[#D8F2DD] bg-[#F0FFF4] p-3 text-[13px] font-semibold text-[#2E7D41]">
            Your payment information is 100% secure and encrypted.
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ products }: { products: Array<(typeof allProducts)[number] & { quantity: number }> }) {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-lg bg-white p-6">
        <h2 className="font-bold">Delivery Details</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <p><strong>Home</strong><br />Rahul Sharma<br />Koramangala, Bengaluru</p>
          <p><strong>Shipping Method</strong><br />Standard Shipping (FREE)</p>
          <p><strong>Payment Method</strong><br />UPI<br />shudhveda@icici</p>
        </div>
      </div>
      <div className="rounded-lg bg-white p-6">
        <h2 className="font-bold">Items In Your Order ({products.length})</h2>
        <div className="mt-4 divide-y divide-[#EEF1F4]">
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-[82px_1fr_100px_100px] items-center py-5">
              <Image src={product.image} alt={product.title} width={70} height={70} className="bg-[#FFF8EF] object-contain" />
              <div><strong>{product.title}</strong><p className="text-[#5F6674]">250g - Raw & Unfiltered</p></div>
              <span className="rounded bg-[#F7F8FA] px-4 py-2 text-center">Qty: {product.quantity}</span>
              <strong>Rs.{product.price * product.quantity}</strong>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded bg-[#F0FFF4] p-3 text-[13px] text-[#2E7D41]">
          Your order is 100% safe and secure.
        </div>
      </div>
    </div>
  );
}

function CheckoutSummary({
  products,
  subtotal,
  saved,
}: {
  products: Array<(typeof allProducts)[number] & { quantity: number }>;
  subtotal: number;
  saved: number;
}) {
  return (
    <div className="rounded-lg bg-white p-6">
      <div className="flex justify-between">
        <h2 className="font-serif text-[22px] font-bold">Order Summary</h2>
        <span className="text-[#5F6674]">{products.length} Items</span>
      </div>
      <div className="mt-6 space-y-5">
        {products.map((product) => (
          <div key={product.id} className="grid grid-cols-[70px_1fr_auto] gap-4">
            <Image src={product.image} alt={product.title} width={64} height={64} className="bg-[#FFF8EF] object-contain" />
            <div><strong>{product.title}</strong><p className="text-[12px] text-[#8B95A5]">250g - Raw & Unfiltered</p><p className="text-[12px]">Qty: {product.quantity}</p></div>
            <strong>Rs.{product.price}</strong>
          </div>
        ))}
      </div>
      <div className="mt-7 border-t border-[#EEF1F4] pt-4">
        <OrderSummary subtotal={subtotal} saved={saved} />
        <FreeDeliveryBar subtotal={subtotal} />
        <TrustBadges />
      </div>
    </div>
  );
}

function ThankYou({
  products,
  subtotal,
  saved,
}: {
  products: Array<(typeof allProducts)[number] & { quantity: number }>;
  subtotal: number;
  saved: number;
}) {
  return (
    <main className="bg-[#FFF8EF] py-12">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 lg:grid-cols-[1fr_390px]">
        <section className="space-y-8">
          <div className="rounded-xl bg-white p-12 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#147D18] text-white">
              <Check size={34} />
            </span>
            <h1 className="mt-6 font-serif text-[38px] font-bold">Thank You for Your Order!</h1>
            <p className="mt-3 text-[#5F6674]">Your order has been placed successfully.</p>
            <div className="mt-8 grid gap-4 rounded-lg border border-[#EEF1F4] p-6 md:grid-cols-4">
              <span>Order Placed<br /><strong>12 May, 2024</strong></span>
              <span>Order Number<br /><strong>SVN1256789</strong></span>
              <span>Estimated Delivery<br /><strong>16 - 18 May, 2024</strong></span>
              <span>Total Paid<br /><strong>Rs.{subtotal.toLocaleString("en-IN")}</strong></span>
            </div>
          </div>
          <div className="rounded-xl bg-white p-10">
            <h2 className="font-serif text-[28px] font-bold">What happens next?</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              {["Order Confirmed", "Packed with Care", "Shipped", "Delivered"].map((item, index) => (
                <span key={item} className="text-center">
                  <PackageCheck className={`mx-auto mb-3 h-10 w-10 rounded border p-2 ${index === 0 ? "text-[#147D18]" : "text-[#A7B0BE]"}`} />
                  <strong>{item}</strong>
                </span>
              ))}
            </div>
          </div>
        </section>
        <aside>
          <CheckoutSummary products={products} subtotal={subtotal} saved={saved} />
          <HelpPanel />
        </aside>
      </div>
    </main>
  );
}
