"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Percent, Truck, Sparkles, Box, Gift, Heart, Crown, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

const subscriptionPlans = [
    {
        id: "sub-discovery",
        name: "DISCOVERY PLAN",
        tagline: "Perfect for first-time explorers",
        detail: "250 g x 6 Jars",
        totalWeight: "Total: 1.5 KG Honey",
        idealFor: "Ideal for individuals and gifting",
        price: 2099,
        mrp: 2394,
        isPopular: false,
        btnColor: "bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white",
        borderColor: "border-[#EADCC9]",
        cardBg: "bg-white",
        image: "/giftset.png",
    },
    {
        id: "sub-family",
        name: "FAMILY PLAN",
        tagline: "Our most popular plan",
        detail: "500 g x 6 Jars",
        totalWeight: "Total: 3 KG Honey",
        idealFor: "Perfect for everyday family use",
        price: 4299,
        mrp: 4794,
        isPopular: true,
        btnColor: "bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white",
        borderColor: "border-[#D49313]",
        cardBg: "bg-[#FFFDF7]",
        image: "/fourtsection.png",
    },
    {
        id: "sub-wellness",
        name: "WELLNESS PLAN",
        tagline: "Best value for regular honey lovers",
        detail: "1 KG x 6 Jars",
        totalWeight: "Total: 6 KG Honey",
        idealFor: "Ideal for large families and daily wellness",
        price: 7999,
        mrp: 8994,
        isPopular: false,
        btnColor: "bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white",
        borderColor: "border-[#EADCC9]",
        cardBg: "bg-white",
        image: "/shopsection.png",
    },
];

export default function SubscriptionPlansSection() {
    const { addToCart } = useCart();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [addedPlan, setAddedPlan] = useState<string | null>(null);

    const handleSelectPlan = async (plan: typeof subscriptionPlans[0]) => {
        try {
            setLoadingPlan(plan.id);
            await addToCart(plan.id, "sub-var-default");
            setAddedPlan(plan.id);
            setTimeout(() => setAddedPlan(null), 3000);
        } catch (err) {
            console.error("Error subscribing:", err);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <section id="subscription-plans" className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF6F0] via-[#FFFDF8] to-[#FAF6F0] relative overflow-hidden">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 text-center relative z-10">

                {/* Section Heading */}
                <h2 className="text-[34px] sm:text-[44px] md:text-[48px] font-serif font-bold text-[#593102] leading-tight tracking-tight">
                    CHOOSE YOUR SUBSCRIPTION PLAN
                </h2>

                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto my-3.5 rounded-full" />

                <p className="text-[#6E5D4F] text-base sm:text-lg font-medium">
                    Select the perfect honey quantity for your household or gifting needs.
                </p>

                {/* Plans Grid - All 4 Cards Side-By-Side (bagal bagal mai) */}
                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch">
                    {subscriptionPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col justify-between rounded-3xl border-2 ${plan.borderColor} ${plan.cardBg} p-6 sm:p-7 shadow-sm hover:border-[#D49313] hover:ring-4 hover:ring-[#D49313]/20 hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 group cursor-pointer h-full`}
                        >
                            {/* Most Popular Ribbon */}
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#593102] px-4 py-1 text-[11px] font-black uppercase tracking-widest text-[#FFD700] shadow-md border border-[#D49313]/50">
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

                    {/* 4th Card: Subscriber Benefits - Same Side-By-Side Height & Alignment */}
                    <div className="relative flex flex-col justify-between rounded-3xl border-2 border-[#EADCC9] bg-white p-6 sm:p-7 shadow-sm hover:border-[#D49313] hover:ring-4 hover:ring-[#D49313]/20 hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 group cursor-pointer h-full">
                        <div>
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#593102] tracking-wider uppercase border-b border-[#EADCC9] pb-3 text-center">
                                SUBSCRIBER BENEFITS
                            </h3>

                            <ul className="mt-5 space-y-3.5 text-left text-xs sm:text-sm">
                                <li className="flex items-start gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#D49313]">
                                        <Percent size={14} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#593102]">Save Up to 10-15%</p>
                                        <p className="text-[11px] text-[#8D7F73]">Exclusive prepaid savings</p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#D49313]">
                                        <Truck size={14} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#593102]">Free Shipping</p>
                                        <p className="text-[11px] text-[#8D7F73]">On all six deliveries</p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#D49313]">
                                        <Sparkles size={14} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#593102]">Priority Access</p>
                                        <p className="text-[11px] text-[#8D7F73]">Get new harvests first</p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#D49313]">
                                        <Box size={14} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#593102]">Reserved Stock</p>
                                        <p className="text-[11px] text-[#8D7F73]">Your honey is reserved</p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#D49313]">
                                        <Gift size={14} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#593102]">Premium Packaging</p>
                                        <p className="text-[11px] text-[#8D7F73]">Beautifully packed every time</p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#D49313]">
                                        <Heart size={14} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#593102]">Exclusive Rewards</p>
                                        <p className="text-[11px] text-[#8D7F73]">Special offers, gifts &amp; more</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
