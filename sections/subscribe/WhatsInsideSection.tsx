"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/auth";

interface FeatureItem {
    icon: string;
    label: string;
    descLines: string[];
}

export default function WhatsInsideSection() {
    const [savingsPercent, setSavingsPercent] = useState<number>(16);

    useEffect(() => {
        const fetchPlanSavings = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/subscripation/plan/all-plans`);
                if (!res.ok) return;

                const data = await res.json();
                const rawList = data.data || data.plans || data || [];

                if (Array.isArray(rawList) && rawList.length > 0) {
                    const plan = rawList[0];
                    let disc: number | null = null;

                    if (typeof plan.discountPercentage === "number") {
                        disc = plan.discountPercentage;
                    } else if (typeof plan.discountPercentage === "string") {
                        disc = parseFloat(plan.discountPercentage);
                    } else if (typeof plan.discount_percentage === "number") {
                        disc = plan.discount_percentage;
                    }

                    if (disc !== null && !isNaN(disc) && disc > 0) {
                        setSavingsPercent(Math.round(disc));
                    } else {
                        const price = typeof plan.price === "number" ? plan.price : null;
                        const mrp = typeof plan.originalPrice === "number" ? plan.originalPrice : (typeof plan.mrp === "number" ? plan.mrp : null);

                        if (price && mrp && mrp > price) {
                            const computed = Math.round(((mrp - price) / mrp) * 100);
                            if (computed > 0) {
                                setSavingsPercent(computed);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching plan savings in WhatsInsideSection:", error);
            }
        };

        fetchPlanSavings();
    }, []);

    const privilegeItems: FeatureItem[] = [
        {
            icon: "/ph_seal-percent-light.svg",
            label: `${savingsPercent}% SAVINGS`,
            descLines: [
                "Enjoy preferred",
                "pricing across your",
                "annual subscription.",
            ],
        },
        {
            icon: "/carbon_delivery-parcel (1).svg",
            label: "COMPLIMENTARY DELIVERY",
            descLines: [
                "Every seasonal",
                "delivery arrives at",
                "your doorstep, at no",
                "extra cost.",
            ],
        },
        {
            icon: "/akar-icons_plant.svg",
            label: "EARLY HARVEST ACCESS",
            descLines: [
                "Every seasonal",
                "delivery arrives at",
                "your doorstep, at no",
                "extra cost.",
            ],
        },
        {
            icon: "/mingcute_coupon-line.svg",
            label: "EXCLUSIVE OFFERS",
            descLines: [
                "Thoughtful privileges",
                "reserved for our",
                "annual subscribers.",
            ],
        },
        {
            icon: "/mage_stars-b.svg",
            label: "SEASONAL DISCOVERIES",
            descLines: [
                "Experience honey as",
                "the landscape changes",
                "── one harvest at a",
                "time.",
            ],
        },
        {
            icon: "/bx_hive.svg",
            label: "A YEAR OF GOODNESS",
            descLines: [
                "Experience honey as",
                "the landscape changes",
                "── one harvest at a",
                "time.",
            ],
        },
    ];

    return (
        <section className="py-10 sm:py-14 bg-[#F9F0DF] relative overflow-hidden text-[#593102]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                    {/* Left 8 Columns: Badge, Heading, and 6 Feature Columns Row */}
                    <div className="lg:col-span-8 flex flex-col justify-between">

                        {/* Top Area: Badge & Heading */}
                        <div className="flex flex-col mb-7 lg:mb-10 pl-1 sm:pl-6 lg:pl-10">
                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-2.5 bg-[#F9F0DF] border border-[#8D7F67]/35 px-3.5 sm:px-4 py-1.5 rounded-[12px] mb-3.5 sm:mb-5 self-start shadow-2xs">
                                <span className="font-cormorant text-[12px] sm:text-[14px] font-semibold tracking-[0.14em] text-[#593102] uppercase">
                                    SUBSCRIBER PRIVILEGES
                                </span>
                                <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-85 flex items-center justify-center">
                                    <Image src="/leaf.svg" alt="Leaf" width={14} height={14} className="object-contain" />
                                </div>
                                <span className="text-[11px] sm:text-[12px] text-[#593102]/60 font-light">──→</span>
                            </div>

                            <h2
                                className="font-playfair not-italic text-[30px] xs:text-[34px] sm:text-[44px] lg:text-[53px] leading-[1.15] lg:leading-[64px] tracking-[0px] align-middle text-[#A27514]"
                                style={{
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    letterSpacing: "0px",
                                    color: "#A27514",
                                }}
                            >
                                <span className="block font-playfair">A Little More Honey.</span>
                                <span className="block font-playfair">A Lot More to Discover.</span>
                            </h2>
                        </div>

                        {/* Bottom Area: 6 Feature Columns Row with /Line 10.svg Vertical Dividers */}
                        <div className="grid grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-0 relative w-full">
                            {privilegeItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center text-center px-1 sm:px-2 relative"
                                >
                                    {/* Circle Icon */}
                                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 mb-2 flex items-center justify-center">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Title Label */}
                                    <h4 className="font-cormorant font-semibold text-[9.5px] sm:text-[11.5px] tracking-[0.05em] text-[#4A2D0E] uppercase leading-tight min-h-[26px] flex items-center justify-center">
                                        {item.label}
                                    </h4>

                                    {/* Wavy Underline Vector 27 SVG */}
                                    <div className="my-1 sm:my-1.5 relative w-[60px] sm:w-[72px] h-[4px] sm:h-[5px] flex items-center justify-center">
                                        <Image
                                            src="/Vector 27.svg"
                                            alt="Underline"
                                            width={72}
                                            height={5}
                                            className="object-contain opacity-90"
                                        />
                                    </div>

                                    {/* Description Text (Formatted with exact line breaks from screenshot) */}
                                    <p className="font-cormorant italic text-[10.5px] sm:text-[13px] text-[#6E5B4B] text-center leading-[1.25] sm:leading-[1.3] max-w-[110px] sm:max-w-[145px]">
                                        {item.descLines.map((line, lIdx) => (
                                            <span key={lIdx} className="block">
                                                {line}
                                            </span>
                                        ))}
                                    </p>

                                    {/* /Line 10.svg Vertical Divider from public folder on Desktop (lg) */}
                                    {idx < privilegeItems.length - 1 && (
                                        <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 h-[120px] w-[2px] items-center justify-center pointer-events-none">
                                            <Image
                                                src="/Line 10.svg"
                                                alt="Divider"
                                                width={2}
                                                height={120}
                                                className="h-full w-auto opacity-85"
                                            />
                                        </div>
                                    )}

                                    {/* /Line 10.svg Vertical Divider on Mobile & Tablet (3 cols per row) */}
                                    {idx < privilegeItems.length - 1 && (idx + 1) % 3 !== 0 && (
                                        <div className="flex lg:hidden absolute right-0 top-1/2 -translate-y-1/2 h-[100px] sm:h-[115px] w-[2px] items-center justify-center pointer-events-none">
                                            <Image
                                                src="/Line 10.svg"
                                                alt="Divider"
                                                width={2}
                                                height={115}
                                                className="h-full w-auto opacity-85"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Right 4 Columns: Honey Jar Image (Nudged slightly right) */}
                    <div className="lg:col-span-4 flex justify-center lg:justify-end items-center mt-6 lg:mt-0 lg:-mr-12 xl:-mr-18">
                        <div className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[500px] xl:max-w-[550px] h-[330px] sm:h-[390px] lg:h-[430px] xl:h-[470px] flex items-center justify-end">
                            <Image
                                src="/image 1861 (3).png"
                                alt="Shuddhveda Natural Honey Jar"
                                fill
                                className="object-contain object-right"
                                priority
                            />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}