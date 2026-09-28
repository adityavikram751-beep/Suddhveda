"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { API_BASE_URL, getStoredSession } from "@/lib/auth";
import SubscriptionCheckoutForm from "@/components/subscribe/SubscriptionCheckoutForm";

interface PlanItem {
    id: string;
    name: string;
    description: string;
    tagline: string;
    detail: string;
    totalWeight: string;
    price: number;
    mrp: number;
    badge?: string;
    isPopular?: boolean;
    image: string;
}

export default function SubscriptionPlansSection() {
    const router = useRouter();
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/subscripation/plan/all-plans`);
                if (!res.ok) throw new Error("Failed to fetch subscriptions plans");

                const data = await res.json();
                const rawList = data.data || data.plans || data || [];

                if (Array.isArray(rawList) && rawList.length > 0) {
                    const formattedPlans: PlanItem[] = rawList
                        .filter((item: any) => item.isActive !== false)
                        .map((item: any) => ({
                            id: item._id || item.id,
                            name: item.name || "Good Plan",
                            description: item.description || "Our most popular plan",
                            tagline: item.description || item.badge || "Discover Six distinctive Shuddhveda Honey Varieties",
                            detail: item.packageLabel || `${item.quantityPerJar || 500}g × ${item.numberOfJars || 6} Jars`,
                            totalWeight: `Total: ${item.totalQuantity || 3} ${(item.totalQuantityUnit || 'kg').toUpperCase()} Honey`,
                            price: typeof item.price === "number" ? item.price : 2099,
                            mrp: typeof item.originalPrice === "number" ? item.originalPrice : (typeof item.mrp === "number" ? item.mrp : 2394),
                            badge: item.badge,
                            isPopular: Boolean(item.isPopular || item.badge === "MOST POPULAR"),
                            image: item.image || "/subscribe2.0.png",
                        }));

                    setPlans(formattedPlans);
                } else {
                    const defaultPlan: PlanItem = {
                        id: "default-annual-plan",
                        name: "Good Plan",
                        description: "Our most popular plan",
                        tagline: "Discover Six distinctive Shuddhveda Honey Varieties",
                        detail: "500g × 6 Jars",
                        totalWeight: "Total: 3 KG Honey",
                        price: 2099,
                        mrp: 2394,
                        image: "/subscribe2.0.png",
                    };
                    setPlans([defaultPlan]);
                }
            } catch (err) {
                console.error("Error fetching subscription plans:", err);
                const defaultPlan: PlanItem = {
                    id: "default-annual-plan",
                    name: "Good Plan",
                    description: "Our most popular plan",
                    tagline: "Discover Six distinctive Shuddhveda Honey Varieties",
                    detail: "500g × 6 Jars",
                    totalWeight: "Total: 3 KG Honey",
                    price: 2099,
                    mrp: 2394,
                    image: "/subscribe2.0.png",
                };
                setPlans([defaultPlan]);
            }
        };

        fetchPlans();
    }, []);

    // Lock body & document scrolling when overlay modal is open
    useEffect(() => {
        if (isCheckoutModalOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            document.documentElement.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            document.documentElement.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            document.documentElement.style.overflow = "";
        };
    }, [isCheckoutModalOpen]);

    const handleOpenSubscribeModal = (planToBuy?: PlanItem) => {
        const session = getStoredSession();
        if (!session || !session.user?.mobile) {
            router.push("/login");
            return;
        }

        const targetPlan = planToBuy || plans[0] || {
            id: "default-annual-plan",
        };

        setSelectedPlanId(targetPlan.id);
        setIsCheckoutModalOpen(true);
    };

    const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0] || {
        id: "default-annual-plan",
        name: "Good Plan",
        description: "Our most popular plan",
        price: 2099,
        mrp: 2394,
        image: "/subscribe2.0.png",
    };

    return (
        <section id="subscription-plans" className="pt-0 sm:pt-1 pb-4 sm:pb-6 bg-[#F9F0DF] relative overflow-hidden -mt-4 sm:-mt-6">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 items-center">

                    {/* Left Column: Heading, Price, CTA Button */}
                    <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-start text-left z-10">

                        {/* Top Pill Badge - Matching Reference Screenshot 4 */}
                        <div className="inline-flex items-center gap-2.5 bg-[#F9F0DF] border border-[#E6D5C3] px-5 sm:px-6 py-2 rounded-full mb-6 text-[#593102] shadow-2xs">
                            <span className="text-[13px] text-[#593102] select-none font-medium">←</span>
                            <div className="relative w-4 h-4 flex-shrink-0">
                                <Image
                                    src="/group.svg"
                                    alt="Leaf Icon"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-cormorant text-[15px] sm:text-[17px] font-normal tracking-wide text-[#593102]">
                                {'Let the season choose your Honey'}
                            </span>
                            <div className="relative w-4 h-4 flex-shrink-0">
                                <Image
                                    src="/group.svg"
                                    alt="Leaf Icon"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-[13px] text-[#593102] select-none font-medium">→</span>
                        </div>

                        {/* Main Title - Dynamic API Plan Name */}
                        <h2 className="-mt-2 font-playfair font-medium not-italic text-[32px] sm:text-[42px] lg:text-[50px] leading-[44px] sm:leading-[56px] lg:leading-[64px] tracking-normal max-w-xl">
                            <span className="bg-gradient-to-r from-[#C6900E] to-[#4A2E0A] bg-clip-text text-transparent">
                                {activePlan.name || "A Year of Honey, Delivered to Your Door."}
                            </span>
                        </h2>

                        {/* Subtitle - Dynamic API Plan Description */}
                        <p className="-mt-2 font-cormorant font-semibold not-italic text-[19px] sm:text-[23px] lg:text-[25px] leading-[26px] sm:leading-[32px] lg:leading-[34px] text-[#593102] max-w-xl mt-4 sm:mt-5">
                            {activePlan.description || "Discover Six distinctive Shuddhveda Honey Varieties delivered throughout the Year"}
                        </p>

                        {/* Multiple Plans Selection Bar (if API returns more than 1 plan) */}
                        {plans.length > 1 && (
                            <div className="flex flex-wrap gap-2.5 mt-3 mb-1">
                                {plans.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelectedPlanId(p.id)}
                                        className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${activePlan.id === p.id
                                            ? "bg-[#D97706] text-white shadow-sm"
                                            : "bg-[#FAF4E8] text-[#593102] border border-[#E6D5C3] hover:bg-[#EADBCA]"
                                            }`}
                                    >
                                        {p.name} — ₹{p.price.toLocaleString("en-IN")}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Price Display - Vertically centered with wider spacing to the right */}
                        <div className="flex items-center gap-5 sm:gap-6 my-5 sm:my-6">
                            <span className="font-sans font-bold text-[38px] sm:text-[46px] text-[#331B02] tracking-tight">
                                ₹{activePlan.price.toLocaleString("en-IN")}
                            </span>
                            <span className="font-sans font-medium text-[22px] sm:text-[26px] text-[#88725A] line-through">
                                ₹{activePlan.mrp.toLocaleString("en-IN")}
                            </span>
                        </div>

                        {/* Subscribe Now Button - Passes planId (_id) directly */}
                        <button
                            type="button"
                            onClick={() => handleOpenSubscribeModal(activePlan)}
                            className=" -mt-5 bg-[#D97706] hover:bg-[#B45309] text-white font-sans font-medium text-[16px] sm:text-[18px] py-2.5 sm:py-3 px-10 sm:px-14 min-w-[240px] sm:min-w-[270px] justify-center rounded-[16px] inline-flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 active:scale-98 cursor-pointer"
                        >
                            <span>Subscribe Now</span>
                            <ArrowRight size={19} />
                        </button>

                    </div>

                    {/* Right Column: Hero Product Image (subscribe2.0.png) - Shifted slightly down */}
                    <div className="lg:col-span-7 xl:col-span-7 flex justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-8 lg:-mr-12 xl:-mr-17">
                        <div className="relative w-full max-w-[690px] h-[380px] sm:h-[480px] lg:h-[550px] translate-x-4 sm:translate-x-6 lg:translate-x-10">
                            <Image
                                src="/subscribe2.0.png"
                                alt="Shuddhveda A Year of Honey Subscription"
                                fill
                                priority
                                className="object-contain object-right"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Subscription Form Overlay Modal Popup */}
            {isCheckoutModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-in fade-in duration-200">
                    {/* Backdrop overlay click to close */}
                    <div
                        className="fixed inset-0"
                        onClick={() => setIsCheckoutModalOpen(false)}
                    />

                    {/* Modal Popup Box with hidden scrollbar and wider width (1150px) */}
                    <div className="relative w-full max-w-[1150px] max-h-[92vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#FAF4E8] rounded-[24px] sm:rounded-[32px] shadow-2xl p-4 sm:p-8 my-auto border border-[#EADBCA] z-10">
                        <button
                            type="button"
                            onClick={() => setIsCheckoutModalOpen(false)}
                            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 bg-[#FAF5EC]/95 hover:bg-[#EADBCA] text-[#593102] p-1.5 sm:p-2 rounded-full transition-all duration-200 border border-[#EADBCA] shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                            aria-label="Close form"
                        >
                            <X size={18} />
                        </button>

                        <SubscriptionCheckoutForm
                            planId={selectedPlanId || activePlan.id}
                            onClose={() => setIsCheckoutModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
