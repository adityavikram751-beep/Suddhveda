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
    Copy,
    Check,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";

const freeDeliveryTarget = 2000;

const steps = [
    { id: 1, title: "Address", subtitle: "Add delivery address" },
    { id: 2, title: "Shipping", subtitle: "Choose shipping method" },
    { id: 3, title: "Review", subtitle: "Review & place order" },
    { id: 4, title: "Payment", subtitle: "Select payment option" },
] as const;

const paymentMethods = [
    { id: "upi", label: "UPI", description: "Pay using any UPI method" },
    { id: "card", label: "Credit/Debit Card", description: "Pay using any card" },
    { id: "netbanking", label: "Net Banking", description: "Pay using your Bank" },
    { id: "wallets", label: "wallets", description: "Pay using wallets" },
] as const;

const qrBlocks = [
    "111111100101011111111",
    "100000101111010000001",
    "101110100010010111101",
    "101110101101010111101",
    "101110100111010111101",
    "100000101010010000001",
    "111111101010111111111",
    "000000001111000000000",
    "101101111001110101101",
    "011010001110001011010",
    "110111101011101110111",
    "001001011100100100100",
    "111010111001111010011",
    "000000001101000101010",
    "111111101001011101101",
    "100000101110000101001",
    "101110101001111111011",
    "101110100111000010100",
    "101110101100111101111",
    "100000100010010000101",
    "111111101111011101111",
];

function QrPattern() {
    return (
        <div className="grid h-[190px] w-[190px] grid-cols-[repeat(21,1fr)] grid-rows-[repeat(21,1fr)] bg-white p-2 sm:h-[210px] sm:w-[210px] xl:h-[230px] xl:w-[230px]">
            {qrBlocks.flatMap((row, rowIndex) =>
                row.split("").map((cell, colIndex) => (
                    <span
                        key={`${rowIndex}-${colIndex}`}
                        className={cell === "1" ? "bg-[#20242A]" : "bg-white"}
                    />
                ))
            )}
        </div>
    );
}

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
        router.push("/review");
    };

    const handleContinue = () => {
        router.push("thank");
    };

    const handleCopyUPI = () => {
        navigator.clipboard.writeText("shudhveda@icici");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-[#FFF8EF] py-8 text-[#2F241C] md:py-10">
            <div className="mx-auto max-w-[1410px] px-4 md:px-6">
              
                <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_390px] xl:gap-8 xl:grid-cols-[1fr_410px]">
                    {/* Left Column */}
                    <section className="flex h-full flex-col gap-8">
                        {/* Header */}
                        <header className="relative pr-28">
                            <h1 className="font-serif text-[42px] font-bold leading-none text-[#2D3A1B] md:text-[48px]">
                                Payment
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

                        {/* Payment Methods + QR Section */}
                        <div className="grid gap-3 pt-6 md:grid-cols-[390px_1fr] lg:grid-cols-[350px_1fr] xl:grid-cols-[430px_1fr] md:pt-8">
                            {/* Payment Methods */}
                            <div className="bg-white px-4 py-3 sm:px-5">
                                <h2 className="mb-8 text-[22px] font-medium leading-tight text-[#2F3033]">
                                    Choose a payment method
                                </h2>
                                <div className="border border-[#F1E3D2]">
                                    {paymentMethods.map((method) => {
                                        const isSelected = selectedMethod === method.id;

                                        return (
                                            <label
                                                key={method.id}
                                                className={`flex min-h-[76px] cursor-pointer items-center gap-4 border-b border-[#F1E3D2] px-3 py-3 last:border-b-0 ${
                                                    isSelected
                                                        ? "rounded-md border border-[#E9A760] bg-[#FFF8EF]"
                                                        : "bg-white"
                                                }`}
                                            >
                                                <span
                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                                        isSelected
                                                            ? "border-[#D98200] bg-[#D98200]"
                                                            : "border-[#8D99A8] bg-white"
                                                    }`}
                                                >
                                                    {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-[18px] font-semibold text-[#3A2418]">
                                                        {method.label}
                                                    </span>
                                                    <span className="mt-1 block text-[14px] text-[#3A2418]">
                                                        {method.description}
                                                    </span>
                                                </span>
                                                <Image
                                                    src="/upi.png"
                                                    alt="UPI"
                                                    width={58}
                                                    height={32}
                                                    className="shrink-0 rounded-lg bg-[#FBFAF8] object-contain px-2 py-1"
                                                />
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
                            </div>

                            {/* QR & UPI Section */}
                            <div className="bg-white px-5 py-5 sm:px-6 lg:px-7">
                                <div className="grid gap-7 md:grid-cols-[minmax(210px,1fr)_1px_minmax(180px,1fr)] xl:gap-8">
                                    {/* Scan & Pay */}
                                    <div className="min-w-0">
                                        <h2 className="text-[14px] font-bold text-[#2F3033]">
                                            Scan &amp; Pay with any UPI app
                                        </h2>
                                        <div className="mt-2 flex flex-col items-center">
                                            <div className="bg-[#F6F6F4] p-2">
                                                <QrPattern />
                                            </div>
                                            <p className="mt-1 text-center text-[14px] text-[#2F241C]">
                                                UPI ID:shudhveda@icici
                                            </p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="relative hidden bg-[#F0C99C] md:block">
                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[12px] text-[#2F241C]">
                                            or
                                        </span>
                                    </div>

                                    {/* Pay using UPI ID */}
                                    <div className="min-w-0">
                                        <h2 className="text-[16px] font-bold text-[#2F3033]">
                                            Pay using UPI ID / VPA
                                        </h2>
                                        <div className="mt-8 flex h-12 items-center rounded-lg border border-[#CDD3DD] px-4 shadow-sm">
                                            <span className="flex-1 text-[14px] text-[#424A57]">
                                                shudhveda@icici
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleCopyUPI}
                                                className="text-[#9AA3AF] transition hover:text-[#D18500]"
                                                aria-label="Copy UPI ID"
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>

                                        <h3 className="mt-6 text-[13px] font-bold text-[#2F3033]">
                                            How to pay?
                                        </h3>
                                        <ol className="mt-4 space-y-5 text-[12px] leading-snug text-[#6F7786]">
                                            {[
                                                "Open any UPI app (PhonePe, GPay, Paytm, etc.)",
                                                "Scan the QR code or enter the UPI ID",
                                                "Verify the amount and make the payment",
                                            ].map((instruction, index) => (
                                                <li key={instruction} className="flex items-start gap-3">
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF1D8] text-[10px] font-bold text-[#D18500]">
                                                        {index + 1}
                                                    </span>
                                                    <span>{instruction}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="rounded-md border border-[#BFDDB4] bg-[#EDF8E7] px-4 py-3 text-[12px] font-bold text-[#45A651] md:col-start-2">
                                <span className="inline-flex items-center gap-3">
                                    <CheckCircle2 size={16} fill="#45A651" className="text-white" />
                                    Your payment information is 100% secure and encrypted.
                                </span>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <button
                type="button"
                onClick={handleBack}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#E08600] bg-white px-8 text-[15px] font-medium text-[#D18500] transition hover:bg-[#FFF5E8] sm:w-[220px]"
              >
                <ArrowLeft size={18} />
                Back to Review
              </button>
                            <button
                                type="button"
                                onClick={handleContinue}
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#C97B00] px-8 text-[15px] font-medium text-white shadow-[0_12px_22px_rgba(201,123,0,0.18)] transition hover:bg-[#B97100] sm:w-[260px]"
                            >
                                Continue to Thanks
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </section>

                    {/* Right Column - Order Summary */}
                    <aside className="flex h-full flex-col">
                        <div className="flex w-full flex-1 flex-col rounded-[4px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                            {/* Order Summary Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
                                <span className="text-[12px] text-[#7B8493]">
                                    {visibleProducts.length} Items
                                </span>
                            </div>

                            {/* Product List */}
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
                                            <p className="text-[14px] font-bold text-[#2D3A1B]">
                                                {product.title}
                                            </p>
                                            <p className="mt-2 text-[11px] text-[#9AA3AF]">
                                                {product.weight.split(" - ")[0]} • Raw & Unfiltered
                                            </p>
                                            <p className="mt-2 text-[12px] text-[#6F7786]">
                                                Qty: {product.quantity}
                                            </p>
                                        </div>
                                        <p className="text-[16px] font-bold text-[#2D3A1B]">
                                            ₹{product.price}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-8 space-y-4 border-t border-[#EEF1F4] pt-5 text-[14px] text-[#6F7786]">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <strong className="text-[#2D3A1B]">
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
                            <div className="mt-6 flex items-end justify-between">
                                <div className="flex items-baseline gap-1">
                                    <p className="text-[19px] font-bold text-[#2D3A1B]">Total</p>
                                    <p className="text-[10px] text-[#9AA3AF]">
                                        (Inclusive of all taxes)
                                    </p>
                                </div>
                                <p className="font-serif text-[26px] font-bold text-[#2D3A1B]">
                                    ₹{total.toLocaleString("en-IN")}
                                </p>
                            </div>

                            {/* Free Delivery Progress */}
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

                            {/* Trust Badges */}
                            <div className="mt-14 grid grid-cols-3 gap-3 text-center">
                                <div className="rounded-md bg-white p-3 shadow-sm">
                                    <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
                                    <p className="text-[10px] font-bold text-[#2F241C]">
                                        Secure Checkout
                                    </p>
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

                        {/* Need Help */}
                        <div className="relative min-h-[152px] bg-white px-8 pb-8 pt-6">
                            <h2 className="text-[18px] font-bold text-black">Need help ?</h2>
                            <div className="mt-3 space-y-2 text-[15px] text-[#6F7786]">
                                <p className="flex items-center gap-2">
                                    <Phone size={16} className="text-[#2D3A1B]" /> +91 98765 43210
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail size={16} className="text-[#2D3A1B]" /> connect@honeyveda.in
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock size={16} className="text-[#2D3A1B]" /> Mon - Sat : 9AM - 7PM
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