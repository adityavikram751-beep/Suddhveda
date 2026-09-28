"use client";

import Image from "next/image";

interface FeatureItem {
    icon: string;
    label: string;
    desc: string;
}

const PRIVILEGES_ITEMS: FeatureItem[] = [
    {
        icon: "/ph_seal-percent-light.svg",
        label: "13% SAVINGS",
        desc: "Enjoy preferred pricing across your annual subscription.",
    },
    {
        icon: "/carbon_delivery-parcel (1).svg",
        label: "COMPLIMENTARY DELIVERY",
        desc: "Every seasonal delivery arrives at your doorstep, at no extra cost.",
    },
    {
        icon: "/akar-icons_plant.svg",
        label: "EARLY HARVEST ACCESS",
        desc: "Every seasonal delivery arrives at your doorstep, at no extra cost.",
    },
    {
        icon: "/mingcute_coupon-line.svg",
        label: "EXCLUSIVE OFFERS",
        desc: "Thoughtful privileges reserved for our annual subscribers.",
    },
    {
        icon: "/mage_stars-b.svg",
        label: "SEASONAL DISCOVERIES",
        desc: "Experience honey as the landscape changes — one harvest at a time.",
    },
    {
        icon: "/bx_hive.svg",
        label: "A YEAR OF GOODNESS",
        desc: "Experience honey as the landscape changes — one harvest at a time.",
    },
];

export default function WhatsInsideSection() {
    return (
        <section className="py-10 sm:py-14 bg-[#F9F0DF] relative overflow-hidden text-[#593102]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Left 8 Columns: Top (Badge + Heading) and Bottom (6 Feature Items Row) */}
                    <div className="lg:col-span-8 flex flex-col justify-between">
                        
                        {/* Top Area: Badge & Heading */}
                        <div className="flex flex-col">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-[#FAF3E8]/90 border border-[#8D7F67]/40 px-4 py-1.5 rounded-[12px] mb-4 shadow-2xs self-start">
                                <span className="font-cormorant text-[13px] sm:text-[14px] font-semibold tracking-[0.14em] text-[#593102] uppercase">
                                    SUBSCRIBER PRIVILEGES
                                </span>
                                <div className="relative w-3.5 h-3.5 opacity-80">
                                    <Image src="/group.svg" alt="Leaf" fill className="object-contain" />
                                </div>
                                <span className="text-[12px] text-[#593102]/60 font-light">──</span>
                            </div>

                            {/* Heading */}
                            <h2 className="font-playfair font-normal not-italic text-[36px] sm:text-[48px] lg:text-[52px] leading-[1.12] tracking-tight text-[#A86C06]">
                                <span className="block">A Little More Honey.</span>
                                <span className="block mt-1">A Lot More to Discover.</span>
                            </h2>
                        </div>

                        {/* Bottom Area: 6 Feature Columns Row */}
                        <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-0 relative">
                            {PRIVILEGES_ITEMS.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center text-center px-1.5 sm:px-2 relative"
                                >
                                    {/* Built-in Circle SVG Icon directly without extra outer circle */}
                                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 mb-3 flex items-center justify-center">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Title Label */}
                                    <h4 className="font-cormorant font-semibold text-[10.5px] sm:text-[11.5px] tracking-[0.06em] text-[#4A2D0E] uppercase leading-tight min-h-[26px] flex items-center justify-center">
                                        {item.label}
                                    </h4>

                                    {/* Brush Underline Vector 27 SVG */}
                                    <div className="my-2 relative w-[70px] h-[5px] flex items-center justify-center">
                                        <Image
                                            src="/Vector 27.svg"
                                            alt="Underline"
                                            width={70}
                                            height={5}
                                            className="object-contain opacity-90"
                                        />
                                    </div>

                                    {/* Description Text */}
                                    <p className="font-cormorant italic text-[11.5px] sm:text-[12.5px] text-[#6E5B4B] leading-snug max-w-[125px]">
                                        {item.desc}
                                    </p>

                                    {/* Line 10 SVG Vertical Divider between columns (except last column) */}
                                    {idx < PRIVILEGES_ITEMS.length - 1 && (
                                        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-[100px] w-[2px] pointer-events-none">
                                            <Image
                                                src="/Line 10.svg"
                                                alt="Divider"
                                                fill
                                                className="object-contain opacity-80"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Right 4 Columns: Big Honey Jar Photo Spanning Vertically on Right */}
                    <div className="lg:col-span-4 flex justify-center lg:justify-end items-center mt-6 lg:mt-0">
                        <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-[0.92/1]">
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