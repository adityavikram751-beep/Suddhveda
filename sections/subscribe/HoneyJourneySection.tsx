"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Play, Pause, ChevronLeft, ChevronRight, Calendar, Award } from "lucide-react";

const journeyItems = [
    {
        month: "JANUARY",
        stepNumber: "01",
        title: "Mustard Honey",
        collection: "Winter Harvest Collection",
        image: "/occession1.png",
        bgColor: "bg-[#FEF9C3]",
        textColor: "text-[#854D0E]",
        borderColor: "border-[#FDE047]",
        origin: "Rajasthan Mustard Fields",
        notes: "Light golden texture with warm floral aroma & natural digestive benefits.",
    },
    {
        month: "MARCH",
        stepNumber: "02",
        title: "Litchi Honey",
        collection: "Spring Blossom Collection",
        image: "/occession2.png",
        bgColor: "bg-[#FCE7F3]",
        textColor: "text-[#9D174D]",
        borderColor: "border-[#F472B6]",
        origin: "Muzaffarpur Orchards",
        notes: "Fruity, delicate sweetness crafted from spring litchi blossoms.",
    },
    {
        month: "MAY",
        stepNumber: "03",
        title: "Multiflora Honey",
        collection: "Nature's Bouquet Collection",
        image: "/occession3.png",
        bgColor: "bg-[#F3E8FF]",
        textColor: "text-[#6B21A8]",
        borderColor: "border-[#C084FC]",
        origin: "Himalayan Foothills",
        notes: "Rich multi-flower nectar with complex wild flora honey profile.",
    },
    {
        month: "JULY",
        stepNumber: "04",
        title: "Natural Honey",
        collection: "Pure Origins Collection",
        image: "/occession4.png",
        bgColor: "bg-[#D1FAE5]",
        textColor: "text-[#065F46]",
        borderColor: "border-[#34D399]",
        origin: "Central Forest Reserve",
        notes: "100% raw unprocessed wildflower honey packed with enzymes.",
    },
    {
        month: "SEPTEMBER",
        stepNumber: "05",
        title: "Fennel Honey",
        collection: "Herbal Wellness Collection",
        image: "/occession5.png",
        bgColor: "bg-[#DCFCE7]",
        textColor: "text-[#166534]",
        borderColor: "border-[#4ADE80]",
        origin: "Gujarat Herbal Farms",
        notes: "Aromatic herbal infusion with subtle fennel & cooling notes.",
    },
    {
        month: "NOVEMBER",
        stepNumber: "06",
        title: "Ajwain Honey",
        collection: "Ayurvedic Heritage Collection",
        image: "/occession6.png",
        bgColor: "bg-[#FFEDD5]",
        textColor: "text-[#9A3412]",
        borderColor: "border-[#FB923C]",
        origin: "Malwa Plateau",
        notes: "Deep amber medicinal honey with authentic carom seed warmth.",
    },
];

export default function HoneyJourneySection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    // Smooth Auto-Play Sequential Step Animation
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % journeyItems.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [isPlaying]);

    const activeItem = journeyItems[activeIndex];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? journeyItems.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % journeyItems.length);
    };

    return (
        <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-[#FFFDF8] to-white border-b border-[#EADCC9]/60 relative overflow-hidden">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 text-center relative z-10">

                {/* Section Heading */}
                <h2 className="text-[34px] sm:text-[44px] md:text-[48px] font-serif font-bold text-[#593102] leading-tight tracking-tight">
                    YOUR ANNUAL HONEY JOURNEY
                </h2>

                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto my-3.5 rounded-full" />

                <p className="text-[#6E5D4F] text-base sm:text-lg font-medium">
                    Six unique seasonal harvests delivered directly to your doorstep throughout the year.
                </p>

                {/* Timeline Container with Hover Pause */}
                <div
                    className="mt-12 relative"
                    onMouseEnter={() => setIsPlaying(false)}
                    onMouseLeave={() => setIsPlaying(true)}
                >
                    {/* Horizontal Gold Progress Line */}
                    <div className="hidden lg:block absolute top-[92px] left-[8%] right-[8%] h-1.5 bg-[#FAF0DC] rounded-full z-0 overflow-hidden border border-[#EADCC9]/70 shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-[#D49313] via-[#F59E0B] to-[#593102] transition-all duration-700 ease-out rounded-full"
                            style={{ width: `${(activeIndex / (journeyItems.length - 1)) * 100}%` }}
                        />
                    </div>

                    {/* Timeline 6 Step Nodes */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8 relative z-10">
                        {journeyItems.map((item, index) => {
                            const isCurrent = index === activeIndex;
                            const isCompleted = index <= activeIndex;

                            return (
                                <div
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className="flex flex-col items-center group cursor-pointer"
                                >
                                    {/* Month Header with Animated Gold Highlight */}
                                    <div className="mb-2 sm:mb-3.5 flex items-center gap-1.5">
                                        <span className={`font-serif text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 ${isCurrent
                                            ? "text-[#D49313] scale-105 sm:scale-110 font-black"
                                            : isCompleted
                                                ? "text-[#593102]"
                                                : "text-[#8D7F73]"
                                            }`}>
                                            {item.month}
                                        </span>
                                    </div>

                                    {/* Thumbnail Circle Frame with Glowing Ring */}
                                    <div
                                        className={`relative h-24 w-24 sm:h-32 sm:w-32 rounded-full border-3 sm:border-4 transition-all duration-500 flex items-center justify-center overflow-hidden ${isCurrent
                                            ? "border-[#D49313] scale-108 sm:scale-112 shadow-[0_8px_24px_rgba(212,147,19,0.4)] ring-4 ring-[#D49313]/30 bg-white"
                                            : isCompleted
                                                ? "border-[#D49313]/80 shadow-md ring-2 ring-[#D49313]/20 bg-white"
                                                : "border-white shadow-sm bg-white/70 opacity-65 group-hover:opacity-100 group-hover:scale-105"
                                            }`}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover w-full h-full rounded-full transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Completed Checkmark Badge */}
                                        {isCompleted && (
                                            <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-20 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#D49313] text-white shadow-md border-2 border-white">
                                                <Check size={11} strokeWidth={3} className="sm:w-3 sm:h-3" />
                                            </div>
                                        )}

                                        {/* Active Pulsing Halo */}
                                        {isCurrent && (
                                            <div className="absolute inset-0 rounded-full border-2 border-[#FFD700] animate-ping pointer-events-none opacity-50" />
                                        )}
                                    </div>

                                    {/* Honey Variety Title */}
                                    <h3 className={`mt-2.5 sm:mt-4 font-serif text-sm sm:text-lg font-bold leading-snug transition-colors duration-300 ${isCurrent ? "text-[#D49313]" : "text-[#593102]"
                                        }`}>
                                        {item.title}
                                    </h3>

                                    {/* Collection Badge */}
                                    <span className={`mt-1.5 sm:mt-2 inline-block rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold ${item.bgColor} ${item.textColor} border ${item.borderColor} transition-all duration-300 ${isCurrent ? "scale-105 shadow-sm ring-2 ring-[#D49313]/30" : ""
                                        }`}>
                                        {item.collection}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
