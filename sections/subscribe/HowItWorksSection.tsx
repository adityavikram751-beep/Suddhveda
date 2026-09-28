"use client";

import Image from "next/image";

interface HarvestItem {
    icon: string;
    label: string;
    desc: string;
}

const HARVEST_BOX_ITEMS: HarvestItem[] = [
    {
        icon: "/game-icons_honey-jar.svg",
        label: "02 × 500 G JARS",
        desc: "Two distinctive honeys selected for the season.",
    },
    {
        icon: "/fluent_contact-card-generic-20-regular.svg",
        label: "HARVEST CARD",
        desc: "The story, origin and character behind your honey.",
    },
    {
        icon: "/lucide-lab_flower-lotus.svg",
        label: "FLORAL ORIGIN",
        desc: "Discover the flowers and landscapes that shape its flavour.",
    },
    {
        icon: "/gg_notes.svg",
        label: "SERVING NOTES",
        desc: "Simple ways to enjoy each honey in your everyday rituals.",
    },
    {
        icon: "/botelsub.svg",
        label: "STORAGE GUIDE",
        desc: "Easy guidance to preserve its natural character.",
    },
    {
        icon: "/lucide_qr-code.svg",
        label: "SCAN TO DISCOVER",
        desc: "Explore more about your honey, its harvest and its journey.",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="py-10 sm:py-14 bg-[#F9F0DF] relative overflow-hidden text-[#593102]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                    
                    {/* Left 4-5 Columns: Large Open Harvest Box Photo spanning full height */}
                    <div className="lg:col-span-4 flex items-center justify-center">
                        <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] rounded-[18px] overflow-hidden shadow-sm border border-[#8D7F67]/20">
                            <Image
                                src="/subscribe plan.png"
                                alt="Inside Every Harvest Box - Shuddhveda Honey"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right 7-8 Columns: Badge, Heading, Subtitle + 6 Feature Items */}
                    <div className="lg:col-span-8 flex flex-col justify-between">
                        
                        {/* Top: Badge, Heading, Subtitle */}
                        <div className="flex flex-col mb-6 sm:mb-8">
                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-2 bg-[#FAF3E8]/90 border border-[#8D7F67]/40 px-4 py-1.5 rounded-[12px] mb-3 shadow-2xs self-start">
                                <span className="font-cormorant text-[13px] sm:text-[14px] font-semibold tracking-[0.14em] text-[#593102] uppercase">
                                    INSIDE EVERY HARVEST BOX
                                </span>
                                <div className="relative w-3.5 h-3.5 opacity-80">
                                    <Image src="/group.svg" alt="Leaf" fill className="object-contain" />
                                </div>
                                <span className="text-[12px] text-[#593102]/60 font-light">──</span>
                            </div>

                            {/* Heading */}
                            <h2 className="font-playfair font-normal not-italic text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.12] tracking-tight">
                                <span className="text-[#A86C06] block">Everything You Need to Know</span>
                                <span className="text-[#4A2D0E] block mt-1">About Your Honey.</span>
                            </h2>

                            {/* Subtitle Paragraph */}
                            <p className="font-cormorant font-normal text-[15px] sm:text-[17.5px] text-[#6E5B4B] leading-relaxed mt-2.5 max-w-2xl">
                                Every delivery is thoughtfully packed with your seasonal honeys and a few details to help you understand, enjoy and make the most of each harvest.
                            </p>
                        </div>

                        {/* Bottom: 6 Feature Columns Grid in a row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-0 relative pt-2">
                            {HARVEST_BOX_ITEMS.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center text-center px-1.5 sm:px-2 relative"
                                >
                                    {/* Built-in Circle SVG Icon directly without extra outer circle */}
                                    <div className="relative w-11 h-11 sm:w-12 sm:h-12 mb-2 flex items-center justify-center">
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
                                    <div className="my-1.5 relative w-[70px] h-[5px] flex items-center justify-center">
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
                                    {idx < HARVEST_BOX_ITEMS.length - 1 && (
                                        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-[95px] w-[2px] pointer-events-none">
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

                </div>
            </div>
        </section>
    );
}
