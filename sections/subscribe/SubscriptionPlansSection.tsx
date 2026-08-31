"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Percent, Truck, Box, Gift, Heart, Crown, ArrowRight, Loader2, Calendar, ShieldCheck, Award, Clock, Headphones, Star, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL, getStoredSession } from "@/lib/auth";

function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
    if (match) return decodeURIComponent(match[2]);
    const match2 = document.cookie.match(/(^| )token=([^;]+)/);
    if (match2) return decodeURIComponent(match2[2]);
    if (typeof window !== "undefined") {
        return localStorage.getItem("token") || localStorage.getItem("sudhveda_token") || null;
    }
    return null;
}

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
            return resolve(true);
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

interface PlanItem {
    id: string;
    name: string;
    tagline: string;
    detail: string;
    totalWeight: string;
    idealFor: string;
    price: number;
    mrp: number;
    isPopular?: boolean;
    badge?: string;
    btnColor: string;
    borderColor: string;
    cardBg: string;
    image: string;
}

const subscriberBenefits6 = [
    { title: "Seasonal Fresh Harvests", subtitle: "6 bi-monthly doorstep deliveries", icon: Calendar },
    { title: "Lab Tested Purity", subtitle: "Zero added sugar or preservatives", icon: Award },
    { title: "Free Pan-India Delivery", subtitle: "Zero shipping fee on every shipment", icon: Truck },
    { title: "Prepaid Member Savings", subtitle: "Save up to 15% on annual plans", icon: Percent },
    { title: "Priority Harvest Access", subtitle: "Get rare & limited floral honey first", icon: Star },
    { title: "Free Royal Samples", subtitle: "Surprise gift samples in every box", icon: Gift },
];

export default function SubscriptionPlansSection() {
    const router = useRouter();
    const { addToCart, openCart } = useCart();
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [loadingApi, setLoadingApi] = useState<boolean>(true);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    // Modal & Form State
    const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanItem | null>(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [submittingCheckout, setSubmittingCheckout] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);

    const [checkoutForm, setCheckoutForm] = useState({
        name: "",
        mobile: "",
        email: "",
        shipping_full_name: "",
        shipping_phone: "",
        shipping_address_line1: "",
        shipping_address_line2: "",
        shipping_city: "",
        shipping_state: "",
        shipping_pincode: "",
        shipping_country: "India",
        billing_full_name: "",
        billing_phone: "",
        billing_address_line1: "",
        billing_address_line2: "",
        billing_city: "",
        billing_state: "",
        billing_pincode: "",
        billing_country: "India",
    });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoadingApi(true);
                const res = await fetch(`${API_BASE_URL}/api/subscripation/plan/all-plans`);
                if (!res.ok) throw new Error("Failed to fetch subscription plans");

                const data = await res.json();
                const rawList = data.data || data.plans || data || [];

                if (Array.isArray(rawList)) {
                    const formattedPlans: PlanItem[] = rawList
                        .filter((item: any) => item.isActive !== false)
                        .map((item: any) => ({
                            id: item._id || item.id,
                            name: item.name || "HONEY PLAN",
                            tagline: item.description || item.badge || "Subscription Plan",
                            detail: item.packageLabel || `${item.quantityPerJar || 250} ${item.quantityUnit || 'g'} × ${item.numberOfJars || 6} Jars`,
                            totalWeight: `Total: ${item.totalQuantity || 1.5} ${(item.totalQuantityUnit || 'kg').toUpperCase()} Honey`,
                            idealFor: item.idealFor || "Perfect for everyday honey use",
                            price: item.price || 0,
                            mrp: item.originalPrice || item.mrp || item.price || 0,
                            badge: item.badge,
                            isPopular: Boolean(item.isPopular || item.badge === "MOST POPULAR"),
                            btnColor: "bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white",
                            borderColor: Boolean(item.isPopular || item.badge === "MOST POPULAR") ? "border-[#D49313]" : "border-[#EADCC9]",
                            cardBg: Boolean(item.isPopular || item.badge === "MOST POPULAR") ? "bg-[#FFFDF7]" : "bg-white",
                            image: item.image || "/giftset.png",
                        }));

                    setPlans(formattedPlans);
                } else {
                    setPlans([]);
                }
            } catch (err) {
                console.error("Error fetching subscription plans:", err);
                setPlans([]);
            } finally {
                setLoadingApi(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSelectPlan = (plan: PlanItem) => {
        const session = getStoredSession();
        if (!session || !session.user?.mobile) {
            router.push("/login");
            return;
        }

        setSelectedPlanForCheckout(plan);
        setCheckoutForm({
            name: "",
            mobile: "",
            email: "",
            shipping_full_name: "",
            shipping_phone: "",
            shipping_address_line1: "",
            shipping_address_line2: "",
            shipping_city: "",
            shipping_state: "",
            shipping_pincode: "",
            shipping_country: "India",
            billing_full_name: "",
            billing_phone: "",
            billing_address_line1: "",
            billing_address_line2: "",
            billing_city: "",
            billing_state: "",
            billing_pincode: "",
            billing_country: "India",
        });

        setIsCheckoutModalOpen(true);
    };

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlanForCheckout) return;

        try {
            setSubmittingCheckout(true);
            const token = getTokenFromCookie();

            const payload = {
                planId: selectedPlanForCheckout.id,
                customer: {
                    name: checkoutForm.name,
                    mobile: checkoutForm.mobile,
                    email: checkoutForm.email,
                },
                shipping_address: {
                    full_name: checkoutForm.shipping_full_name || checkoutForm.name,
                    phone: checkoutForm.shipping_phone || checkoutForm.mobile,
                    address_line1: checkoutForm.shipping_address_line1,
                    address_line2: checkoutForm.shipping_address_line2,
                    city: checkoutForm.shipping_city,
                    state: checkoutForm.shipping_state,
                    pincode: checkoutForm.shipping_pincode,
                    country: checkoutForm.shipping_country || "India",
                },
                billing_address: sameAsShipping
                    ? {
                        full_name: checkoutForm.shipping_full_name || checkoutForm.name,
                        phone: checkoutForm.shipping_phone || checkoutForm.mobile,
                        address_line1: checkoutForm.shipping_address_line1,
                        address_line2: checkoutForm.shipping_address_line2,
                        city: checkoutForm.shipping_city,
                        state: checkoutForm.shipping_state,
                        pincode: checkoutForm.shipping_pincode,
                        country: checkoutForm.shipping_country || "India",
                    }
                    : {
                        full_name: checkoutForm.billing_full_name || checkoutForm.name,
                        phone: checkoutForm.billing_phone || checkoutForm.mobile,
                        address_line1: checkoutForm.billing_address_line1,
                        address_line2: checkoutForm.billing_address_line2,
                        city: checkoutForm.billing_city,
                        state: checkoutForm.billing_state,
                        pincode: checkoutForm.billing_pincode,
                        country: checkoutForm.billing_country || "India",
                    },
            };

            const res = await fetch(`${API_BASE_URL}/api/checkout/plan`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            const resData = await res.json().catch(() => ({}));

            if (res.ok && (resData.success !== false)) {
                if (resData.payment_required && resData.razorpay) {
                    await loadRazorpayScript();
                    if (typeof window !== "undefined" && (window as any).Razorpay) {
                        const options = {
                            key: resData.razorpay.key_id,
                            amount: resData.razorpay.amount,
                            currency: resData.razorpay.currency || "INR",
                            name: "ShuddhVeda Honey",
                            description: `${resData.purchase?.plan?.name || selectedPlanForCheckout.name} Subscription`,
                            order_id: resData.razorpay.order_id,
                            handler: function (response: any) {
                                const finalOrder = {
                                    orderId: resData.purchase?.purchase_id || resData.purchase?._id || `PP-${Date.now().toString().slice(-6)}`,
                                    createdAt: new Date().toISOString(),
                                    paymentMethod: "Online Payment",
                                    paymentStatus: "Paid",
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpaySignature: response.razorpay_signature,
                                    planName: resData.purchase?.plan?.name || selectedPlanForCheckout.name,
                                    purchase: resData.purchase,
                                    shippingAddress: {
                                        name: payload.shipping_address.full_name,
                                        phone: payload.shipping_address.phone,
                                        addressLine: payload.shipping_address.address_line1,
                                        city: payload.shipping_address.city,
                                        state: payload.shipping_address.state,
                                        pincode: payload.shipping_address.pincode,
                                    },
                                    pricing: { total: resData.purchase?.finalAmount || selectedPlanForCheckout.price },
                                };
                                if (typeof window !== "undefined") {
                                    localStorage.setItem("latest_order", JSON.stringify(finalOrder));
                                }
                                setIsCheckoutModalOpen(false);
                                router.push("/thank");
                            },
                            prefill: {
                                name: payload.customer.name,
                                email: payload.customer.email,
                                contact: payload.customer.mobile,
                            },
                            theme: { color: "#FA4B1B" },
                        };
                        const rzp = new (window as any).Razorpay(options);
                        rzp.open();
                        setSubmittingCheckout(false);
                        return;
                    }
                }

                setIsCheckoutModalOpen(false);
                const createdOrder = resData.purchase || resData.data || resData.order || resData;
                if (typeof window !== "undefined") {
                    localStorage.setItem("latest_order", JSON.stringify(createdOrder));
                }
                router.push("/thank");
            } else {
                alert(resData.message || "Failed to process plan checkout. Please try again.");
            }
        } catch (err: any) {
            console.error("Plan checkout error:", err);
            alert(err.message || "Something went wrong while processing your subscription order.");
        } finally {
            setSubmittingCheckout(false);
        }
    };

    const totalCards = plans.length + 1;
    const gridColsClass =
        totalCards === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-[840px] mx-auto gap-6"
            : totalCards === 3
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1160px] mx-auto gap-6"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7";

    return (
        <section id="subscription-plans" className="py-14 sm:py-24 bg-gradient-to-b from-[#FAF6F0] via-[#FFFDF8] to-[#FAF6F0] relative overflow-hidden">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 text-center relative z-10">

                {/* Section Heading */}
                <h2 className="text-[28px] sm:text-[44px] md:text-[48px] font-serif font-bold text-[#593102] leading-tight tracking-tight">
                    CHOOSE YOUR SUBSCRIPTION PLAN
                </h2>

                <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto my-3 sm:my-3.5 rounded-full" />

                <p className="text-[#6E5D4F] text-sm sm:text-lg font-medium max-w-xl mx-auto">
                    Select the perfect honey quantity for your household or gifting needs.
                </p>

                {/* Plans Grid */}
                {loadingApi ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 size={36} className="text-[#D49313] animate-spin" />
                        <p className="text-sm font-semibold text-[#6E5D4F]">Loading subscription plans...</p>
                    </div>
                ) : (
                    <div className={`mt-10 sm:mt-14 grid ${gridColsClass} items-stretch`}>
                        {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col justify-between rounded-3xl border-2 ${plan.borderColor} ${plan.cardBg} p-5 sm:p-7 shadow-sm hover:border-[#D49313] hover:ring-4 hover:ring-[#D49313]/20 hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 group cursor-pointer h-full`}
                        >
                            {/* Most Popular Ribbon */}
                            {plan.isPopular && (
                                <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 z-20">
                                    <span className="inline-block rounded-full bg-[#FA4B1B] px-4 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white shadow-md border border-white/20">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div>
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#593102] tracking-wide uppercase">
                                    {plan.name}
                                </h3>
                                <p className="text-xs font-semibold text-[#8D7F73] mt-1 h-8 flex items-center justify-center text-center">
                                    {plan.tagline}
                                </p>

                                {/* Full Edge-to-Edge Image Card Container matching Reference Screenshot */}
                                <div className="relative my-4 h-40 sm:h-44 w-full rounded-2xl bg-white border border-[#EADCC9] overflow-hidden flex items-center justify-center p-1 shadow-2xs">
                                    <Image
                                        src={plan.image}
                                        alt={plan.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Plan Specs */}
                                <div className="space-y-1 text-center">
                                    <p className="font-serif text-lg font-extrabold text-[#593102]">
                                        {plan.detail}
                                    </p>
                                    <p className="text-xs font-bold text-[#8D7F73]">
                                        {plan.totalWeight}
                                    </p>
                                </div>

                                <div className="my-4 border-t border-[#EADCC9]/60" />

                                <p className="text-xs font-semibold text-[#6E5D4F] min-h-[32px] flex items-center justify-center text-center">
                                    {plan.idealFor}
                                </p>

                                {/* Pricing */}
                                <div className="mt-5 flex items-baseline justify-center gap-2">
                                    <span className="font-serif text-3xl font-extrabold text-[#593102]">
                                        ₹{plan.price.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-sm text-[#8D7F73] line-through">
                                        ₹{plan.mrp.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            {/* Choose Plan Button */}
                            <div className="mt-5">
                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={loadingPlan === plan.id}
                                    className="w-full h-[40px] rounded-xl text-[13px] font-extrabold uppercase tracking-wider text-white bg-[#FA4B1B] hover:bg-[#E64216] transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center"
                                >
                                    {loadingPlan === plan.id ? "Processing..." : "CHOOSE PLAN"}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Subscriber Benefits Card - Clean No-Icon Styling */}
                    <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#D49313]/50 bg-[#FFFDF7] p-5 sm:p-6 shadow-sm h-full">
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <h3 className="font-serif text-lg sm:text-xl font-extrabold text-[#593102] tracking-wider uppercase text-center pb-3 border-b border-[#EADCC9]">
                                    SUBSCRIBER BENEFITS
                                </h3>
                            </div>

                            <ul className="mt-4 flex-1 flex flex-col justify-between gap-2.5 py-1 text-left">
                                {subscriberBenefits6.map((b, idx) => (
                                    <li
                                        key={idx}
                                        className="rounded-2xl border border-[#EADCC9] bg-[#FAF5EC] p-3 pl-4 shadow-2xs"
                                    >
                                        <div className="leading-tight min-w-0">
                                            <p className="font-bold text-[#593102] text-[13px] sm:text-[14px]">
                                                {b.title}
                                            </p>
                                            <p className="text-[11px] sm:text-xs text-[#7A6A59] font-medium leading-snug mt-0.5">
                                                {b.subtitle}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

        {/* Checkout Modal Popup */}
        {isCheckoutModalOpen && selectedPlanForCheckout && (
            <div className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex items-center justify-center pt-24 sm:pt-28 pb-10">
                <div className="relative w-full max-w-2xl max-h-[78vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl border-2 border-[#D49313]/40 text-left space-y-6 my-auto">

                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-[#EADCC9] pb-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#D49313]">
                                COMPLETE SUBSCRIPTION
                            </span>
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#593102]">
                                {selectedPlanForCheckout.name}
                            </h3>
                            <p className="text-xs text-[#6E5D4F] font-semibold mt-0.5">
                                {selectedPlanForCheckout.detail} • ₹{selectedPlanForCheckout.price.toLocaleString("en-IN")}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsCheckoutModalOpen(false)}
                            className="rounded-full p-2 text-[#6E5D4F] hover:bg-[#FAF0DC] hover:text-[#593102] transition cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleCheckoutSubmit} className="space-y-6">

                        {/* Customer Information */}
                        <div>
                            <h4 className="font-serif text-base font-bold text-[#593102] pb-2 border-b border-[#EADCC9]/60">
                                1. Customer Details
                            </h4>
                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="text-xs font-bold text-[#593102]">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={checkoutForm.name}
                                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                                        placeholder="Rahul Kumar"
                                        className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#593102]">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        maxLength={10}
                                        value={checkoutForm.mobile}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                            setCheckoutForm({ ...checkoutForm, mobile: val });
                                        }}
                                        placeholder="9876543210"
                                        className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#593102]">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={checkoutForm.email}
                                        onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                                        placeholder="rahul@gmail.com"
                                        className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h4 className="font-serif text-base font-bold text-[#593102] pb-2 border-b border-[#EADCC9]/60">
                                2. Shipping Address
                            </h4>
                            <div className="mt-3 space-y-3">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-bold text-[#593102]">Recipient Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={checkoutForm.shipping_full_name}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_full_name: e.target.value })}
                                            placeholder="Rahul Kumar"
                                            className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#593102]">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            maxLength={10}
                                            value={checkoutForm.shipping_phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                setCheckoutForm({ ...checkoutForm, shipping_phone: val });
                                            }}
                                            placeholder="9876543210"
                                            className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#593102]">Address Line 1 *</label>
                                    <input
                                        type="text"
                                        required
                                        value={checkoutForm.shipping_address_line1}
                                        onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_address_line1: e.target.value })}
                                        placeholder="House No. 123, Shalimar Bagh"
                                        className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#593102]">Address Line 2 (Landmark / Area)</label>
                                    <input
                                        type="text"
                                        value={checkoutForm.shipping_address_line2}
                                        onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_address_line2: e.target.value })}
                                        placeholder="Near Main Market"
                                        className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#593102]">City *</label>
                                        <input
                                            type="text"
                                            required
                                            value={checkoutForm.shipping_city}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_city: e.target.value })}
                                            placeholder="Delhi"
                                            className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#593102]">State *</label>
                                        <input
                                            type="text"
                                            required
                                            value={checkoutForm.shipping_state}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_state: e.target.value })}
                                            placeholder="Delhi"
                                            className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#593102]">Pincode *</label>
                                        <input
                                            type="text"
                                            required
                                            value={checkoutForm.shipping_pincode}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_pincode: e.target.value })}
                                            placeholder="110088"
                                            className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#593102]">Country *</label>
                                        <input
                                            type="text"
                                            required
                                            value={checkoutForm.shipping_country}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_country: e.target.value })}
                                            placeholder="India"
                                            className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Billing Address Checkbox */}
                        <div className="pt-2 border-t border-[#EADCC9]/60">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-[#593102]">
                                <input
                                    type="checkbox"
                                    checked={sameAsShipping}
                                    onChange={(e) => setSameAsShipping(e.target.checked)}
                                    className="h-4 w-4 rounded border-[#D49313] text-[#D49313] focus:ring-[#D49313]"
                                />
                                Billing address same as shipping address
                            </label>

                            {!sameAsShipping && (
                                <div className="mt-4 space-y-3">
                                    <h4 className="font-serif text-sm font-bold text-[#593102]">Billing Address</h4>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs font-bold text-[#593102]">Billing Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={checkoutForm.billing_full_name}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, billing_full_name: e.target.value })}
                                                placeholder="Rahul Kumar"
                                                className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-[#593102]">Billing Phone *</label>
                                            <input
                                                type="tel"
                                                required
                                                maxLength={10}
                                                value={checkoutForm.billing_phone}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                    setCheckoutForm({ ...checkoutForm, billing_phone: val });
                                                }}
                                                placeholder="9876543210"
                                                className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#593102]">Address Line 1 *</label>
                                        <input
                                            type="text"
                                            required
                                            value={checkoutForm.billing_address_line1}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, billing_address_line1: e.target.value })}
                                            placeholder="House No. 123"
                                            className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <div>
                                            <label className="text-xs font-bold text-[#593102]">City *</label>
                                            <input
                                                type="text"
                                                required
                                                value={checkoutForm.billing_city}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, billing_city: e.target.value })}
                                                placeholder="Delhi"
                                                className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-[#593102]">State *</label>
                                            <input
                                                type="text"
                                                required
                                                value={checkoutForm.billing_state}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, billing_state: e.target.value })}
                                                placeholder="Delhi"
                                                className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-[#593102]">Pincode *</label>
                                            <input
                                                type="text"
                                                required
                                                value={checkoutForm.billing_pincode}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, billing_pincode: e.target.value })}
                                                placeholder="110088"
                                                className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-[#593102]">Country *</label>
                                            <input
                                                type="text"
                                                required
                                                value={checkoutForm.billing_country}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, billing_country: e.target.value })}
                                                placeholder="India"
                                                className="mt-1 h-10 w-full rounded-xl border border-[#EADCC9] px-3 text-xs font-medium text-[#593102] focus:border-[#D49313] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EADCC9]">
                            <button
                                type="button"
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="rounded-xl border border-[#EADCC9] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#593102] hover:bg-[#FAF0DC] transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submittingCheckout}
                                className="flex h-10 items-center gap-2 rounded-xl bg-[#FA4B1B] hover:bg-[#E64216] px-6 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition cursor-pointer disabled:opacity-60"
                            >
                                {submittingCheckout ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    `PAY ₹${selectedPlanForCheckout.price.toLocaleString("en-IN")}`
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        )}

        </div>
    </section>
);
}
