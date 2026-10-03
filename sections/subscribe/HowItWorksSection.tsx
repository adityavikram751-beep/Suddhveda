"use client";

import Image from "next/image";

interface HarvestItem {
    icon: string;
    label: string;
    descLines: string[];
}

const HARVEST_BOX_ITEMS: HarvestItem[] = [
    {
        icon: "/botel2 (1).svg",
        label: "02 × 500 G JARS",
        descLines: ["Two distinctive", "honeys selected for", "the season."],
    },
    {
        icon: "/fluent_contact-card-generic-20-regular.svg",
        label: "HARVEST CARD",
        descLines: ["The story, origin and", "character behind", "your honey."],
    },
    {
        icon: "/lucide-lab_flower-lotus.svg",
        label: "FLORAL ORIGIN",
        descLines: ["Discover the flowers", "and landscapes that", "shape its flavour."],
    },
    {
        icon: "/gg_notes.svg",
        label: "SERVING NOTES",
        descLines: ["Simple ways to enjoy", "each honey in your", "everyday rituals."],
    },
    {
        icon: "/botel2 (2).svg",
        label: "STORAGE GUIDE",
        descLines: ["Easy guidance to", "preserve its natural", "character."],
    },
    {
        icon: "/lucide_qr-code.svg",
        label: "SCAN TO DISCOVER",
        descLines: ["Explore more about", "your honey, its harvest", "and its journey."],
    },
];

export default function HowItWorksSection() {
    return (
        <section className="py-10 sm:py-14 bg-[#F9F0DF] relative overflow-hidden text-[#593102]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

                    {/* Left 4-5 Columns: Large Open Harvest Box Photo spanning full height */}
                    <div className="lg:col-span-4 flex items-center justify-center">
                        <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] lg:min-h-[440px] flex items-center justify-center overflow-hidden">
                            <Image
                                src="/lycheesub.png"
                                alt="Inside Every Harvest Box - Shuddhveda Honey"
                                fill
                                className="object-contain object-center"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right 7-8 Columns: Badge, Heading, Subtitle + 6 Feature Items */}
                    <div className="lg:col-span-8 flex flex-col justify-between">

                        {/* Top: Badge, Heading, Subtitle */}
                        <div className="flex flex-col mb-6 sm:mb-8">
                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-2.5 bg-[#F9F0DF] border border-[#8D7F67]/35 px-4 py-1.5 rounded-[12px] mb-3 sm:mb-4 self-start shadow-2xs">
                                <span className="font-cormorant text-[13px] sm:text-[14px] font-semibold tracking-[0.14em] text-[#593102] uppercase">
                                    INSIDE EVERY HARVEST BOX
                                </span>
                                <div className="relative w-4 h-4 opacity-85 flex items-center justify-center">
                                    <Image src="/leaf.svg" alt="Leaf" width={14} height={14} className="object-contain" />
                                </div>
                                <span className="text-[12px] text-[#593102]/60 font-light">──→</span>
                            </div>

                            {/* Heading formatted per user specification:
                                font-family: Playfair Display;
                                font-weight: 400;
                                font-style: Regular;
                                font-size: 40px;
                                leading-trim: NONE;
                                line-height: 100%;
                                letter-spacing: 0px;
                                vertical-align: middle;
                            */}
                            <h2
                                className="font-playfair not-italic text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.1] tracking-[0px] align-middle"
                                style={{
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    lineHeight: "1.1",
                                    letterSpacing: "0px",
                                    verticalAlign: "middle",
                                }}
                            >
                                <span className="block font-playfair text-[#A27514]">
                                    Everything You Need to Know
                                </span>
                                <span className="block font-playfair text-[#4A2D0E]">
                                    About Your Honey.
                                </span>
                            </h2>

                            {/* Subtitle Paragraph (enlarged font size) */}
                            <p className="font-cormorant font-normal text-[17px] sm:text-[19.5px] lg:text-[21px] text-[#593102]/90 leading-relaxed mt-3 max-w-2xl">
                                Every delivery is thoughtfully packed with your seasonal honeys and a few details to help you understand, enjoy and make the most of each harvest.
                            </p>
                        </div>

                        {/* Bottom: 6 Feature Columns Grid in a row */}
                        <div className="grid grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-0 relative pt-2">
                            {HARVEST_BOX_ITEMS.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center text-center px-1 sm:px-2 relative"
                                >
                                    {/* Built-in Circle SVG Icon directly */}
                                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 mb-2 flex items-center justify-center">
                                        <Image
                                            src={item.icon}
                                            alt={item.label}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Title Label */}
                                    <h4 className="font-cormorant font-semibold text-[9.5px] sm:text-[11.5px] lg:text-[10px] xl:text-[11.5px] tracking-[0.05em] text-[#4A2D0E] uppercase leading-tight min-h-[26px] flex items-center justify-center">
                                        {item.label}
                                    </h4>

                                    {/* Brush Underline Vector 27 SVG */}
                                    <div className="my-1 sm:my-1.5 relative w-[60px] sm:w-[72px] h-[4px] sm:h-[5px] flex items-center justify-center">
                                        <Image
                                            src="/Vector 27.svg"
                                            alt="Underline"
                                            width={72}
                                            height={5}
                                            className="object-contain opacity-90"
                                        />
                                    </div>

                                    {/* Description Text (3 lines matching exact visual format) */}
                                    <p className="font-cormorant italic text-[10.5px] sm:text-[13px] lg:text-[11px] xl:text-[13px] text-[#6E5B4B] text-center leading-[1.25] sm:leading-[1.3] max-w-[110px] sm:max-w-[150px] lg:max-w-[100px] xl:max-w-[150px]">
                                        {item.descLines.map((line, lIdx) => (
                                            <span key={lIdx} className="block">
                                                {line}
                                            </span>
                                        ))}
                                    </p>

                                    {/* /Line 10.svg Vertical Divider from public folder on Desktop (lg) */}
                                    {idx < HARVEST_BOX_ITEMS.length - 1 && (
                                        <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 h-[120px] w-[2px] items-center justify-center pointer-events-none">
                                            <Image
                                                src="/Line 10.svg"
                                                alt="Divider"
                                                width={2}
                                                height={120}
                                                className="h-full w-auto opacity-90"
                                            />
                                        </div>
                                    )}

                                    {/* /Line 10.svg Vertical Divider on Mobile & Tablet (3 cols per row) */}
                                    {idx < HARVEST_BOX_ITEMS.length - 1 && (idx + 1) % 3 !== 0 && (
                                        <div className="flex lg:hidden absolute right-0 top-1/2 -translate-y-1/2 h-[100px] sm:h-[115px] w-[2px] items-center justify-center pointer-events-none">
                                            <Image
                                                src="/Line 10.svg"
                                                alt="Divider"
                                                width={2}
                                                height={115}
                                                className="h-full w-auto opacity-90"
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

