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
  CreditCard,
  Building,
  Wallet,
  QrCode,
  Copy,
  Check,
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

type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const paymentMethods: PaymentMethod[] = [
  {
    id: "upi",
    label: "UPI",
    description: "Pay using any UPI method",
    icon: <QrCode size={18} className="text-[#D89A1B]" />,
  },
  {
    id: "card",
    label: "Credit/Debit Card",
    description: "Pay using any card",
    icon: <CreditCard size={18} className="text-[#D89A1B]" />,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    description: "Pay using your Bank",
    icon: <Building size={18} className="text-[#D89A1B]" />,
  },
  {
    id: "wallets",
    label: "Wallets",
    description: "Pay using wallets",
    icon: <Wallet size={18} className="text-[#D89A1B]" />,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string>("upi");
  const [copied, setCopied] = useState(false);

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

  const total = subtotal;
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const handleBack = () => {
    router.push("/shipping");
  };

  const handlePayNow = () => {
    router.push("/review");
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText("shudhveda@icici");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
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
          &gt;{" "}
          <Link
            href="/checkout/shipping"
            className="font-medium text-[#2F241C] hover:text-[#D89A1B]"
          >
            Shipping
          </Link>{" "}
          &gt; <span className="font-semibold text-[#D89A1B]">Payment</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
          {/* LEFT COLUMN */}
          <section className="flex flex-col gap-6">
            {/* Header */}
            <div className="relative">
              <h1 className="font-serif text-[34px] font-bold">Payment</h1>
              <p className="mt-1 text-[14px] text-[#7B8493]">
                Almost there! Just a few more details to get your pure honey.
              </p>
              <Image
                src="/honey.png"
                alt="Honey illustration"
                width={110}
                height={80}
                className="absolute right-0 top-0 hidden object-contain sm:block"
              />
            </div>

            {/* Stepper */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white px-6 py-5">
              <div className="flex justify-between items-start">
                {steps.map((step) => {
                  const isActive = step.id === 3;
                  const isDone = step.id < 3;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                          isActive || isDone
                            ? "bg-[#D89A1B] text-white"
                            : "bg-[#F1F2F4] text-[#8A94A6]"
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : step.id}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isActive ? "text-[#D89A1B]" : "text-[#2F241C]"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[10px] text-[#9AA3AF] text-center hidden sm:block">
                        {step.subtitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Choose Payment Method */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <h2 className="font-serif text-[19px] font-bold">
                Choose a payment method
              </h2>
              <div className="mt-5 space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                      selectedMethod === method.id
                        ? "border-[#D89A1B] bg-[#FFF8EF]"
                        : "border-[#EEF1F4] hover:border-[#E3D3B4]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={() => setSelectedMethod(method.id)}
                        className="h-4 w-4 border-[#D3D8DF] text-[#D89A1B] focus:ring-[#D89A1B]"
                      />
                      <div className="flex items-center gap-2">
                        {method.icon}
                        <div>
                          <span className="font-semibold text-[15px]">
                            {method.label}
                          </span>
                          <p className="text-[13px] text-[#6F7786]">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Scan & Pay */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <h2 className="font-serif text-[19px] font-bold">
                Scan & Pay with any UPI app
              </h2>
              <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-white border-2 border-[#E3E6EB] rounded-xl flex items-center justify-center">
                    <Image
                      src="/qr-code.png"
                      alt="QR Code"
                      width={180}
                      height={180}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="rounded-lg border border-[#EEF1F4] p-4 bg-[#FBFCFD]">
                    <p className="text-[13px] text-[#6F7786] mb-2">
                      Pay using UPI ID / VPA
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-[16px] font-mono font-semibold text-[#2F241C] bg-white px-3 py-2 rounded-lg border border-[#EEF1F4] flex-1">
                        shudhveda@icici
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUPI}
                        className="flex h-10 items-center gap-2 rounded-lg bg-[#D18500] px-4 text-[13px] font-bold text-white hover:bg-[#B97100] transition whitespace-nowrap"
                      >
                        {copied ? (
                          <>
                            <Check size={16} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-[#EEF1F4] p-4 bg-[#FBFCFD]">
                    <p className="text-[13px] font-semibold text-[#2F241C]">
                      How to pay?
                    </p>
                    <ol className="mt-2 space-y-1 text-[13px] text-[#6F7786] list-decimal pl-4">
                      <li>Open any UPI app (PhonePe, GPay, Paytm, etc.)</li>
                      <li>Scan the QR code or enter the UPI ID</li>
                      <li>Verify the amount and make the payment</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex h-12 items-center gap-2 rounded-lg border border-[#D3D8DF] px-6 text-[14px] font-semibold text-[#2F241C] hover:bg-[#F5F0EB] transition w-full sm:w-auto justify-center"
                >
                  <ArrowLeft size={16} />
                  Back to Shipping
                </button>
                <button
                  type="button"
                  onClick={handlePayNow}
                  className="flex h-12 items-center gap-2 rounded-lg bg-[#D18500] px-6 text-[14px] font-bold text-white hover:bg-[#B97100] transition w-full sm:w-auto justify-center"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN – Order Summary */}
          <aside className="flex flex-col h-full">
            <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
                <span className="text-[12px] text-[#9AA3AF]">
                  {visibleProducts.length} Items
                </span>
              </div>

              <div className="mt-5 max-h-[280px] space-y-4 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold">{product.title}</p>
                      <p className="text-[11px] text-[#9AA3AF]">
                        {product.weight.split(" - ")[0]} - Raw & Unfiltered
                      </p>
                      <p className="text-[11px] text-[#9AA3AF]">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <p className="text-[14px] font-bold">₹{product.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-[#EEF1F4] pt-5 text-[13px] text-[#6F7786]">
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

              <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
                <div>
                  <p className="text-[21px] font-bold">Total</p>
                  <p className="text-[10px] text-[#9AA3AF]">
                    (Inclusive of all taxes)
                  </p>
                </div>
                <p className="text-[26px] font-bold">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Savings and free delivery progress */}
              <div className="mt-6 rounded-[14px] border border-[#D7F3D9] bg-[#F0FFF4] p-4">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-[#187A37]">
                  <ShieldCheck size={16} /> You&apos;re saving ₹{saved} on this order!
                </p>
                {remaining > 0 && (
                  <>
                    <p className="mt-2 text-[12px] text-[#4C5362]">
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
                      <span>₹{freeDeliveryTarget}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Secure Checkout</p>
                  <p className="text-[9px] text-[#9AA3AF]">100% safe payments</p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
                  <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <Leaf className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">100% Natural</p>
                  <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
                </div>
              </div>

              {/* Need Help – at bottom */}
              <div className="mt-auto pt-6 border-t border-[#EEF1F4]">
                <div className="relative">
                  <h2 className="font-serif text-[19px] font-bold">Need help ?</h2>
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
                  <div className="absolute bottom-0 right-0 opacity-100">
                    <Image
                      src="/need.png"
                      alt="Honey illustration"
                      width={200}
                      height={90}
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