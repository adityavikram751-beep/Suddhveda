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
                        .map((item: any) => {
                            const planImg =
                                item.image_url ||
                                (typeof item.image === "string" ? item.image : (item.image?.image_url || item.image?.url)) ||
                                item.imageUrl ||
                                "/subscribe2.0.png";

                            return {
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
                                image: planImg,
                            };
                        });

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
                    id: "",
                    name: "",
                    description: "",
                    tagline: "",
                    detail: "",
                    totalWeight: "",
                    price: 0,
                    mrp: 0,
                    image: "",
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
        id: "",
        name: "",
        description: "",
        price: 0,
        mrp: 0,
        image: "",
    };

    return (
        <section id="subscription-plans" className="pt-4 sm:pt-6 pb-6 sm:pb-10 bg-[#F9F0DF] relative overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12 relative z-10">

                {/* ==================== DESKTOP MODE (lg and up) ==================== */}
                <div className="hidden lg:grid grid-cols-12 gap-4 lg:gap-6 xl:gap-8 items-center">

                    {/* Left Column: Heading, Price, CTA Button */}
                    <div className="col-span-6 xl:col-span-5 flex flex-col items-start text-left z-10">

                        {/* Top Pill Badge */}
                        <div className="inline-flex items-center gap-2.5 bg-[#F9F0DF] border border-[#E6D5C3] px-4 lg:px-5 xl:px-6 py-1.5 lg:py-2 rounded-full mb-4 xl:mb-6 text-[#593102] shadow-2xs">
                            <span className="text-[13px] text-[#593102] select-none font-medium">←</span>
                            <div className="relative w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0">
                                <Image
                                    src="/leaf.svg"
                                    alt="Leaf Icon"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-cormorant text-[14px] lg:text-[15px] xl:text-[17px] font-normal tracking-wide text-[#593102]">
                                {'Let the season choose your Honey'}
                            </span>
                            <div className="relative w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0">
                                <Image
                                    src="/leaf.svg"
                                    alt="Leaf Icon"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-[13px] text-[#593102] select-none font-medium">→</span>
                        </div>

                        {/* Main Title */}
                        <h2 className="font-playfair font-medium not-italic text-[32px] lg:text-[38px] xl:text-[50px] leading-[40px] lg:leading-[48px] xl:leading-[64px] tracking-normal max-w-xl">
                            <span className="bg-gradient-to-r from-[#C6900E] to-[#4A2E0A] bg-clip-text text-transparent">
                                {activePlan.name || "A Year of Honey, Delivered to Your Door."}
                            </span>
                        </h2>

                        {/* Subtitle */}
                        <p className="font-cormorant font-semibold not-italic text-[19px] lg:text-[21px] xl:text-[25px] leading-[26px] lg:leading-[29px] xl:leading-[34px] text-[#593102] max-w-xl mt-3 xl:mt-4">
                            {activePlan.description || "Discover Six distinctive Shuddhveda Honey Varieties delivered throughout the Year"}
                        </p>

                        {/* Multiple Plans Selection Bar */}
                        {plans.length > 1 && (
                            <div className="flex flex-wrap gap-2.5 mt-3 mb-1">
                                {plans.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelectedPlanId(p.id)}
                                        className={`px-3.5 xl:px-4 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all cursor-pointer ${activePlan.id === p.id
                                            ? "bg-[#D97706] text-white shadow-sm"
                                            : "bg-[#FAF4E8] text-[#593102] border border-[#E6D5C3] hover:bg-[#EADBCA]"
                                            }`}
                                    >
                                        {p.name} — ₹{p.price.toLocaleString("en-IN")}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Price Display */}
                        <div className="flex items-center gap-4 xl:gap-6 my-4 xl:my-6">
                            <span className="font-sans font-bold text-[34px] lg:text-[38px] xl:text-[46px] text-[#331B02] tracking-tight">
                                ₹{activePlan.price.toLocaleString("en-IN")}
                            </span>
                            <span className="font-sans font-medium text-[20px] lg:text-[22px] xl:text-[26px] text-[#88725A] line-through">
                                ₹{activePlan.mrp.toLocaleString("en-IN")}
                            </span>
                        </div>

                        {/* Subscribe Now Button */}
                        <button
                            type="button"
                            onClick={() => handleOpenSubscribeModal(activePlan)}
                            className="bg-[#D97706] hover:bg-[#B45309] text-white font-sans font-medium text-[16px] xl:text-[18px] py-2.5 xl:py-3 px-8 lg:px-10 xl:px-14 min-w-[220px] lg:min-w-[240px] xl:min-w-[270px] justify-center rounded-[16px] inline-flex items-center gap-3 shadow-md hover:shadow-lg transition-all duration-300 active:scale-98 cursor-pointer mt-1"
                        >
                            <span>Subscribe Now</span>
                            <ArrowRight size={19} />
                        </button>

                    </div>

                    {/* Right Column: Hero Product Image */}
                    <div className="col-span-6 xl:col-span-7 flex justify-end mt-4 xl:mt-8 overflow-hidden lg:overflow-visible">
                        <div className="relative w-full max-w-[480px] lg:max-w-[540px] xl:max-w-[690px] h-[380px] lg:h-[440px] xl:h-[550px] translate-x-0 xl:translate-x-10">
                            <Image
                                src={activePlan.image || "/subscribe2.0.png"}
                                alt={activePlan.name || "Shuddhveda A Year of Honey Subscription"}
                                fill
                                unoptimized
                                priority
                                className="object-contain object-right"
                            />
                        </div>
                    </div>

                </div>

                {/* ==================== MOBILE MODE (< lg) ==================== */}
                <div className="flex lg:hidden flex-col items-center text-left py-4 w-full max-w-[540px] mx-auto">

                    {/* Top Pill Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#F9F0DF] border border-[#E6D5C3] px-4 py-1.5 rounded-full mb-5 text-[#593102] shadow-2xs self-center">
                        <span className="text-[12px] text-[#593102] select-none">←</span>
                        <div className="relative w-3.5 h-3.5 flex-shrink-0">
                            <Image
                                src="/leaf.svg"
                                alt="Leaf Icon"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-cormorant text-[13.5px] font-normal tracking-wide text-[#593102]">
                            {'Let the season choose your Honey'}
                        </span>
                        <div className="relative w-3.5 h-3.5 flex-shrink-0">
                            <Image
                                src="/leaf.svg"
                                alt="Leaf Icon"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-[12px] text-[#593102] select-none">→</span>
                    </div>

                    {/* Main Title */}
                    <h2 className="font-playfair font-normal not-italic text-[28px] xs:text-[32px] sm:text-[38px] leading-[1.18] tracking-normal w-full text-left">
                        <span className="bg-gradient-to-r from-[#C6900E] via-[#A8720A] to-[#4A2E0A] bg-clip-text text-transparent block">
                            A Year of Honey,
                        </span>
                        <span className="bg-gradient-to-r from-[#C6900E] via-[#A8720A] to-[#4A2E0A] bg-clip-text text-transparent block">
                            Delivered to Your Door.
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="font-cormorant font-normal not-italic text-[16px] xs:text-[18px] sm:text-[20px] leading-[22px] sm:leading-[26px] text-[#593102] opacity-90 mt-3 mb-4 w-full text-left">
                        {activePlan.description || "Discover Six distinctive Shuddhveda Honey Verieties delivered throughout the Year"}
                    </p>

                    {/* Multiple Plans Selection Bar (Mobile) */}
                    {plans.length > 1 && (
                        <div className="flex flex-wrap gap-2 my-2 w-full">
                            {plans.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setSelectedPlanId(p.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activePlan.id === p.id
                                        ? "bg-[#D97706] text-white shadow-sm"
                                        : "bg-[#FAF4E8] text-[#593102] border border-[#E6D5C3]"
                                        }`}
                                >
                                    {p.name} — ₹{p.price.toLocaleString("en-IN")}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Jars Showcase Image (Centered in mobile flow) */}
                    <div className="relative w-full max-w-[360px] xs:max-w-[400px] aspect-[4/3] mx-auto my-3 sm:my-5">
                        <Image
                            src={activePlan.image || "/subscribe2.0.png"}
                            alt={activePlan.name || "Shuddhveda Honey Subscription Jars"}
                            fill
                            unoptimized
                            priority
                            className="object-contain"
                        />
                    </div>

                    {/* Price Display */}
                    <div className="flex items-baseline justify-center gap-3.5 my-3 w-full text-center">
                        <span className="font-sans font-bold text-[36px] xs:text-[40px] text-[#331B02] tracking-tight">
                            ₹{activePlan.price.toLocaleString("en-IN")}
                        </span>
                        <span className="font-sans font-medium text-[20px] xs:text-[22px] text-[#88725A] line-through">
                            ₹{activePlan.mrp.toLocaleString("en-IN")}
                        </span>
                    </div>

                    {/* Subscribe Now Button */}
                    <div className="w-full mt-2">
                        <button
                            type="button"
                            onClick={() => handleOpenSubscribeModal(activePlan)}
                            className="bg-[#D97706] hover:bg-[#B45309] text-white font-sans font-medium text-[16px] sm:text-[17px] py-3.5 px-6 rounded-[16px] inline-flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer w-full"
                        >
                            <span>Subscribe Now</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                </div>

            </div>

            {/* Subscription Form Overlay Modal Popup */}
            {isCheckoutModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-in fade-in duration-200">
                    <div
                        className="fixed inset-0"
                        onClick={() => setIsCheckoutModalOpen(false)}
                    />

                    <div className="relative w-full max-w-[850px] max-h-[92vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#FAF4E8] rounded-[24px] sm:rounded-[32px] shadow-2xl p-4 sm:p-7 my-auto border border-[#EADBCA] z-10">
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
