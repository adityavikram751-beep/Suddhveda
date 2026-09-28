"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/auth";

interface DeliveryCard {
    month: string;
    title: string;
    season: string;
    description: string;
    deliveryLabel: string;
    image: string;
}

const DEFAULT_DELIVERIES: DeliveryCard[] = [
    {
        month: "JANUARY",
        title: "Mustard Honey + Natural Honey",
        season: "WINTER HARVEST",
        description:
            "A gentle beginning to the year — floral mustard honey paired with the pure, natural character of our Natural Honey",
        deliveryLabel: "Your First Delivery",
        image: "/Rectangle3.png",
    },
    {
        month: "MAY",
        title: "Litchi Honey + Multiflora Honey",
        season: "SPRING BLOSSOM",
        description:
            "A bright seasonal pairing — delicate litchi sweetness alongside the layered floral character of Multiflora Honey.",
        deliveryLabel: "Your Second Delivery",
        image: "/Rectangle1.png",
    },
    {
        month: "SEPTEMBER",
        title: "Fennel Honey + Ajwain Honey",
        season: "HERBAL WELLNESS",
        description:
            "Aromatic and distinctive — two expressive honeys inspired by India's rich herbal landscapes.",
        deliveryLabel: "Your Third Delivery",
        image: "/Rectangle2.png",
    },
];

export default function ThreeDeliveriesSection() {
    const [deliveries, setDeliveries] = useState<DeliveryCard[]>(DEFAULT_DELIVERIES);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/subscripation/plan/all-plans`);
                if (!res.ok) return;
                const data = await res.json();
                const rawList = data.data || data.plans || data || [];

                if (Array.isArray(rawList) && rawList.length > 0) {
                    const activePlan = rawList.find((p: any) => p.isActive !== false) || rawList[0];
                    const comboSetData = activePlan?.comboSetId;
                    const combosets = Array.isArray(comboSetData?.combosets)
                        ? comboSetData.combosets
                        : (Array.isArray(comboSetData) ? comboSetData : (Array.isArray(activePlan?.combosets) ? activePlan.combosets : []));

                    if (Array.isArray(combosets) && combosets.length > 0) {
                        const formattedDeliveries: DeliveryCard[] = combosets.map((c: any, index: number) => {
                            const defaultRef = DEFAULT_DELIVERIES[index] || DEFAULT_DELIVERIES[0];

                            let displayTitle = c.title;
                            if (!displayTitle && Array.isArray(c.products) && c.products.length > 0) {
                                displayTitle = c.products.map((p: any) => p.name).join(" + ");
                            }
                            if (!displayTitle) displayTitle = defaultRef.title;

                            return {
                                month: (c.monthName || defaultRef.month).toUpperCase(),
                                title: displayTitle,
                                season: (c.season || defaultRef.season).toUpperCase(),
                                description: c.description || defaultRef.description,
                                deliveryLabel: index === 0 ? "Your First Delivery" : index === 1 ? "Your Second Delivery" : "Your Third Delivery",
                                image: c.image || defaultRef.image,
                            };
                        });
                        setDeliveries(formattedDeliveries);
                    }
                }
            } catch (err) {
                console.error("Error fetching delivery combosets:", err);
            }
        };

        fetchDeliveries();
    }, []);

    return (
        <section className="pt-0 sm:pt-2 pb-10 sm:pb-14 -mt-6 sm:-mt-10 bg-[#F9F0DF] relative overflow-hidden text-[#593102]">
            <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                {/* Top Pill Badge - Compact Width */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#FDF5E6]/90 border border-[#E6D7C3] px-3.5 sm:px-4 py-1.5 rounded-[14px] mb-4 sm:mb-5 shadow-2xs">
                    <div className="relative w-3.5 h-3.5 flex-shrink-0 opacity-80">
                        <Image
                            src="/group.svg"
                            alt="Leaf Icon"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-cormorant text-[14px] sm:text-[16.5px] font-normal tracking-wide text-[#593102]">
                        Your Anual Honey journey
                    </span>
                    <span className="font-cormorant text-[14px] sm:text-[16.5px] font-normal tracking-wide text-[#6E4413]">
                        with shuddhveda
                    </span>
                    <div className="relative w-3 h-3 flex-shrink-0 opacity-75">
                        <Image
                            src="/group.svg"
                            alt="Leaf Icon"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-[11px] text-[#593102] select-none font-light opacity-50 flex items-center ml-0.5">
                        ──➔
                    </span>
                </div>

                {/* Main Section Heading - Exact CSS Specs provided by User */}
                <div className="w-full overflow-x-auto no-scrollbar py-1">
                    <h2 
                        className="font-playfair font-normal not-italic text-[26px] sm:text-[35px] md:text-[38px] lg:text-[44px] leading-[100%] tracking-[0px] text-[#A86C06] text-center whitespace-nowrap"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            lineHeight: "100%",
                            letterSpacing: "0px"
                        }}
                    >
                        Three Deliveries. Six Distinctive Honeys..
                    </h2>
                </div>

                {/* Subtitle Line */}
                <p className="font-cormorant font-normal not-italic text-[17px] sm:text-[20px] lg:text-[22px] text-[#593102] max-w-4xl mx-auto mt-2 sm:mt-3 opacity-90 text-center">
                    A carefully curated selection of ShuddhVeda honeys, arriving with the changing seasons.
                </p>

                {/* 3 Delivery Cards Grid - Extra Wide Card Width */}
                <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-[1400px] mx-auto text-left items-stretch">
                    {deliveries.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-[#FDF5E6] border border-[#EBE1D0] rounded-[20px] sm:rounded-[24px] shadow-[0_6px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col overflow-hidden group"
                        >
                            {/* Card Top Image Container - Taller Image height (~75% of card) */}
                            <div className="relative w-full h-[285px] sm:h-[330px] bg-[#F4EADA]/40 overflow-hidden">
                                {/* Month Name Overlay at Top Left of Image */}
                                <span className="absolute top-4 left-5 z-20 font-playfair font-normal text-[22px] sm:text-[26px] tracking-[0.04em] text-[#4A2D0E] uppercase select-none pointer-events-none drop-shadow-xs">
                                    {item.month}
                                </span>

                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    priority={idx === 0}
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-103"
                                />
                            </div>

                            {/* Card Content Area (Bottom Half) - Ultra-Compact Text Section */}
                            <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between bg-[#FDF5E6]">
                                <div className="text-center pt-0">
                                    {/* Card Title */}
                                    <h3 className="font-cormorant font-normal text-[18px] sm:text-[21px] text-[#593102] text-center leading-tight">
                                        {item.title}
                                    </h3>

                                    {/* Season Subtitle - Italic uppercase */}
                                    <p className="font-cormorant italic tracking-[0.22em] text-[12px] sm:text-[13px] text-[#8C7561] text-center mt-0.5 uppercase font-light">
                                        {item.season}
                                    </p>

                                    {/* Description Text - Centered italic lines */}
                                    <p className="font-cormorant italic font-normal text-[13px] sm:text-[14px] text-[#705E4F] text-center mt-1.5 leading-[18px] sm:leading-[20px] max-w-[280px] mx-auto opacity-95">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Card Footer Bar - Matches Image 3 exact leaf icon + arrow */}
                                <div className="pt-2.5 mt-3 border-t border-[#EAE0D0] flex items-center justify-between">
                                    <span className="font-cormorant font-bold text-[14px] sm:text-[15.5px] text-[#331B02]">
                                        {item.deliveryLabel}
                                    </span>

                                    <div className="font-cormorant text-[12.5px] sm:text-[13.5px] text-[#8C7561] flex items-center gap-1.5 hover:text-[#C6900E] transition cursor-pointer group/link">
                                        <span>Know more</span>
                                        <Image
                                            src="/group.svg"
                                            alt="Leaf Icon"
                                            width={13}
                                            height={13}
                                            className="object-contain opacity-80"
                                        />
                                        <span className="text-[11px] transition-transform duration-200 group-hover/link:translate-x-1">─────➔</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}




