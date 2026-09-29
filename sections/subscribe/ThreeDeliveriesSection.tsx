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

                            return {
                                month: (c.monthName || defaultRef.month).toUpperCase(),
                                title: c.title || (Array.isArray(c.products) && c.products.length > 0 ? c.products.map((p: any) => p.name).join(" + ") : defaultRef.title),
                                season: (c.season || c.harvestTitle || defaultRef.season).toUpperCase(),
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
        <section className="pt-2 sm:pt-4 pb-10 sm:pb-14 bg-[#F9F0DF] relative overflow-hidden text-[#593102]">
            <div className="mx-auto max-w-[1340px] px-3 sm:px-6 lg:px-8 relative z-10 text-center">

                {/* Top Pill Badge - Single Line Always, No Scrollbar */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap bg-[#FDF5E6]/90 border border-[#E6D7C3] px-3 sm:px-4 py-1.5 rounded-[14px] mb-4 sm:mb-5 shadow-2xs max-w-full overflow-hidden select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="relative w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 opacity-80">
                        <Image
                            src="/leaf.svg"
                            alt="Leaf Icon"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-cormorant text-[10.5px] xs:text-[12.5px] sm:text-[16.5px] font-normal tracking-wide text-[#593102]">
                        Your Anual Honey journey
                    </span>
                    <span className="font-cormorant text-[10.5px] xs:text-[12.5px] sm:text-[16.5px] font-normal tracking-wide text-[#6E4413]">
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
                    <span className="text-[10px] sm:text-[11px] text-[#593102] select-none font-light opacity-50 flex items-center ml-0.5">
                        ──➔
                    </span>
                </div>

                {/* Main Section Heading - Single Line on Desktop */}
                <div className="w-full max-w-5xl mx-auto py-1">
                    <h2
                        className="font-playfair font-normal not-italic text-[24px] xs:text-[27px] sm:text-[36px] md:text-[40px] lg:text-[44px] leading-[1.15] tracking-[0px] text-[#A86C06] text-center sm:whitespace-nowrap"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            letterSpacing: "0px"
                        }}
                    >
                        Three Deliveries. Six Distinctive Honeys..
                    </h2>
                </div>

                {/* Subtitle Line */}
                <p className="font-cormorant font-normal not-italic text-[16px] sm:text-[20px] lg:text-[22px] text-[#593102] max-w-4xl mx-auto mt-2 sm:mt-3 opacity-90 text-center px-2">
                    A carefully curated selection of ShuddhVeda honeys, arriving with the changing seasons.
                </p>

                {/* ==================== DESKTOP MODE (3 Columns Grid - md and up) ==================== */}
                <div className="hidden md:grid mt-8 sm:mt-12 grid-cols-3 gap-6 sm:gap-8 max-w-[1400px] mx-auto text-left items-stretch">
                    {deliveries.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => document.getElementById("subscription-plans")?.scrollIntoView({ behavior: "smooth" })}
                            className="bg-[#FDF5E6] border border-[#EBE1D0] rounded-[20px] sm:rounded-[24px] shadow-[0_6px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                        >
                            {/* Card Top Image Container */}
                            <div className="relative w-full h-[285px] sm:h-[330px] bg-[#F4EADA]/40 overflow-hidden">
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

                            {/* Card Content Area */}
                            <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between bg-[#FDF5E6]">
                                <div className="text-center pt-0">
                                    <h3 className="font-cormorant font-normal text-[18px] sm:text-[21px] text-[#593102] text-center leading-tight">
                                        {item.title}
                                    </h3>

                                    <p className="font-cormorant italic tracking-[0.22em] text-[12px] sm:text-[13px] text-[#8C7561] text-center mt-0.5 uppercase font-light">
                                        {item.season}
                                    </p>

                                    <p className="font-cormorant italic font-normal text-[13px] sm:text-[14px] text-[#705E4F] text-center mt-1.5 leading-[18px] sm:leading-[20px] max-w-[280px] mx-auto opacity-95">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-2.5 mt-3 border-t border-[#EAE0D0] flex items-center justify-between">
                                    <span className="font-cormorant font-bold text-[14px] sm:text-[15.5px] text-[#331B02] whitespace-nowrap">
                                        {item.deliveryLabel}
                                    </span>

                                    <div className="font-cormorant text-[12.5px] sm:text-[13.5px] text-[#8C7561] flex items-center gap-1.5 hover:text-[#C6900E] transition cursor-pointer group/link whitespace-nowrap">
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

                {/* ==================== MOBILE MODE (1 Column Cards Stack - < md) ==================== */}
                <div className="flex md:hidden flex-col items-center gap-6 sm:gap-7 mt-7 sm:mt-8 w-full max-w-[335px] xs:max-w-[365px] mx-auto text-left px-1">
                    {deliveries.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => document.getElementById("subscription-plans")?.scrollIntoView({ behavior: "smooth" })}
                            className="bg-[#FDF5E6] border border-[#EBE1D0] rounded-[22px] shadow-[0_4px_20px_rgba(89,49,2,0.05)] transition-all duration-300 flex flex-col overflow-hidden w-full cursor-pointer"
                        >
                            {/* Card Top Image Container */}
                            <div className="relative w-full h-[275px] xs:h-[300px] bg-[#F4EADA]/40 overflow-hidden">
                                <span className="absolute top-4 left-5 z-20 font-playfair font-normal text-[22px] xs:text-[24px] tracking-[0.04em] text-[#4A2D0E] uppercase select-none pointer-events-none drop-shadow-xs">
                                    {item.month}
                                </span>

                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    priority={idx === 0}
                                    className="object-cover object-center"
                                />
                            </div>

                            {/* Card Content Area */}
                            <div className="p-4 xs:p-5 flex flex-col flex-grow justify-between bg-[#FDF5E6]">
                                <div className="text-center pt-0">
                                    <h3 className="font-cormorant font-normal text-[18px] xs:text-[20px] text-[#593102] text-center leading-tight">
                                        {item.title}
                                    </h3>

                                    <p className="font-cormorant italic tracking-[0.2em] text-[12px] xs:text-[13px] text-[#8C7561] text-center mt-1 uppercase font-light">
                                        {item.season}
                                    </p>

                                    <p className="font-cormorant italic font-normal text-[13.5px] xs:text-[14px] text-[#705E4F] text-center mt-2 leading-[19px] xs:leading-[20px] max-w-[285px] mx-auto opacity-95">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-2.5 mt-3.5 border-t border-[#EAE0D0] flex items-center justify-between">
                                    <span className="font-cormorant font-bold text-[14px] xs:text-[15px] text-[#331B02] whitespace-nowrap">
                                        {item.deliveryLabel}
                                    </span>

                                    <div className="font-cormorant text-[12px] xs:text-[13px] text-[#8C7561] flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                                        <span>Know more</span>
                                        <Image
                                            src="/group.svg"
                                            alt="Leaf Icon"
                                            width={12}
                                            height={12}
                                            className="object-contain opacity-80"
                                        />
                                        <span className="text-[10px]">─────➔</span>
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
