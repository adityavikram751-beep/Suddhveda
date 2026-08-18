"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, Percent, Truck, Box, Gift, Heart, Crown, ArrowRight, Loader2, Calendar, ShieldCheck, Award, Clock, Headphones, Star } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";

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

const subscriberBenefits8 = [
    { title: "Seasonal Fresh Harvests", subtitle: "6 bi-monthly doorstep deliveries", icon: Calendar },
    { title: "Lab Tested Purity", subtitle: "Zero added sugar or preservatives", icon: Award },
    { title: "Free Pan-India Delivery", subtitle: "Zero shipping fee on every shipment", icon: Truck },
    { title: "Prepaid Member Savings", subtitle: "Save up to 15% on annual plans", icon: Percent },
    { title: "Priority Harvest Access", subtitle: "Get rare & limited floral honey first", icon: Star },
    { title: "Free Royal Samples", subtitle: "Surprise gift samples in every box", icon: Gift },
    { title: "Flexible Schedule", subtitle: "Pause, skip or modify dates anytime", icon: Clock },
    { title: "Eco Glass Packaging", subtitle: "Airtight luxury glass jar protection", icon: Box },
];

export default function SubscriptionPlansSection() {
    const { addToCart, openCart } = useCart();
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [loadingApi, setLoadingApi] = useState<boolean>(true);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [addedPlan, setAddedPlan] = useState<string | null>(null);

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

    const handleSelectPlan = async (plan: PlanItem) => {
        try {
            setLoadingPlan(plan.id);
            try {
                await addToCart(plan.id, "sub-var-default");
            } catch (err) {
                console.log("Cart notice for subscription plan:", err);
            }
            setAddedPlan(plan.id);
            if (openCart) openCart();
            setTimeout(() => setAddedPlan(null), 3000);
        } catch (err) {
            console.error("Error subscribing:", err);
        } finally {
            setLoadingPlan(null);
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
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#593102] px-3.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#FFD700] shadow-md border border-[#D49313]/50">
                                        <Crown size={12} /> MOST POPULAR
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
                            <div className="mt-6">
                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={loadingPlan === plan.id}
                                    className={`w-full h-12 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${plan.btnColor}`}
                                >
                                    {loadingPlan === plan.id ? (
                                        "Adding..."
                                    ) : addedPlan === plan.id ? (
                                        <>
                                            <Check size={16} /> Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <span>CHOOSE PLAN</span>
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Subscriber Benefits Card - Spreads evenly to fill full card height */}
                    <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#EADCC9] bg-white p-5 sm:p-7 shadow-sm hover:border-[#D49313] hover:ring-4 hover:ring-[#D49313]/20 hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 group cursor-pointer h-full">
                        <div className="flex flex-col h-full justify-between">
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#593102] tracking-wider uppercase border-b border-[#EADCC9] pb-3 text-center flex items-center justify-center gap-2">
                                <Crown size={18} className="text-[#D49313]" />
                                SUBSCRIBER BENEFITS
                            </h3>

                            <ul className="mt-4 sm:mt-5 space-y-4 sm:space-y-4.5 text-left text-xs sm:text-sm flex-1 flex flex-col justify-between">
                                {subscriberBenefits8.map((b, idx) => {
                                    const BIcon = b.icon;
                                    return (
                                        <li key={idx} className="flex items-center gap-3">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#D49313]">
                                                <BIcon size={14} />
                                            </div>
                                            <div className="leading-tight">
                                                <p className="font-bold text-[#593102] text-[13px] sm:text-[14px]">{b.title}</p>
                                                <p className="text-[11px] sm:text-xs text-[#8D7F73] font-medium">{b.subtitle}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

        </div>
    </section>
);
}
