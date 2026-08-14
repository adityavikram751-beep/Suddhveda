"use client";

import { useEffect, useState } from "react";
import { Check, Crown, CreditCard, CalendarCheck, Sparkles, RotateCcw, ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "CHOOSE YOUR PLAN",
        description: "Select the perfect honey frequency & jar size that suits your lifestyle.",
        icon: Crown,
        badge: "STEP 1",
    },
    {
        number: "02",
        title: "PAY ONCE SECURELY",
        description: "One single prepaid payment unlocks 6 fresh harvests throughout the year.",
        icon: CreditCard,
        badge: "STEP 2",
    },
    {
        number: "03",
        title: "WE SCHEDULE DELIVERIES",
        description: "We handpick, test & prepare every shipment every two months.",
        icon: CalendarCheck,
        badge: "STEP 3",
    },
    {
        number: "04",
        title: "RECEIVE & UNBOX",
        description: "Unbox rare raw honey varieties delivered straight to your doorstep.",
        icon: Sparkles,
        badge: "STEP 4",
    },
    {
        number: "05",
        title: "RENEW & CONTINUE",
        description: "Enjoy effortless annual renewals & exclusive subscriber perks.",
        icon: RotateCcw,
        badge: "STEP 5",
    },
];

export default function HowItWorksSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // 3-Second Step Progress Animation
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % steps.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [isPaused]);

    return (
        <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#FFFDF9] relative overflow-hidden border-y border-[#EADCC9]/50">
            {/* Ambient Background Warm Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[900px] rounded-full bg-[#D49313]/5 blur-3xl pointer-events-none" />

            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 text-center relative z-10">

                {/* Section Subtitle Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 text-xs font-black tracking-widest uppercase text-[#593102] shadow-2xs mb-3">
                    <Sparkles size={14} className="text-[#D49313]" />
                    <span>SIMPLE 5-STEP EXPERIENCE</span>
                </div>

                {/* Section Heading */}
                <h2 className="text-[34px] sm:text-[44px] md:text-[48px] font-serif font-bold text-[#593102] leading-tight tracking-tight">
                    HOW IT WORKS
                </h2>

                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto my-3.5 rounded-full" />

                <p className="text-[#6E5D4F] text-base sm:text-lg font-medium max-w-xl mx-auto">
                    Sit back and relax while we bring nature&apos;s finest honey harvests to your table.
                </p>

                {/* 5-Step 3D Glassmorphic Cards Flow Container */}
                <div
                    className="mt-14 relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10 items-stretch">
                        {steps.map((step, index) => {
                            const isCurrent = index === activeIndex;
                            const isCompleted = index <= activeIndex;
                            const StepIcon = step.icon;

                            return (
                                <div
                                    key={step.number}
                                    onClick={() => setActiveIndex(index)}
                                    className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-500 cursor-pointer h-full border-2 ${isCurrent
                                        ? "bg-white border-[#D49313] shadow-[0_15px_35px_rgba(212,147,19,0.3)] -translate-y-3 ring-4 ring-[#D49313]/20"
                                        : isCompleted
                                            ? "bg-white/90 border-[#D49313]/50 shadow-md hover:-translate-y-1.5"
                                            : "bg-white/60 border-[#EADCC9] shadow-2xs hover:bg-white hover:border-[#D49313]/40 hover:-translate-y-1.5"
                                        }`}
                                >
                                    {/* Top Step Pill & Completed Badge */}
                                    <div className="flex items-center justify-between mb-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase transition-colors ${isCurrent
                                            ? "bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] text-white shadow-sm"
                                            : "bg-[#FAF0DC] text-[#593102] border border-[#EADCC9]"
                                            }`}>
                                            {step.badge}
                                        </span>

                                        {isCompleted ? (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D49313] text-white shadow-xs">
                                                <Check size={13} strokeWidth={3} />
                                            </div>
                                        ) : (
                                            <span className="font-serif text-sm font-black text-[#8D7F73]">
                                                {step.number}
                                            </span>
                                        )}
                                    </div>

                                    {/* Step Icon Box */}
                                    <div className="my-2 flex justify-center">
                                        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 ${isCurrent
                                            ? "bg-gradient-to-br from-[#FAF0DC] to-[#FFF8EF] border-[#D49313] text-[#D49313] shadow-md scale-110"
                                            : "bg-[#FAF6F0] border-[#EADCC9] text-[#593102]"
                                            }`}>
                                            <StepIcon size={28} />
                                        </div>
                                    </div>

                                    {/* Step Content */}
                                    <div className="mt-4 text-center">
                                        <h3 className={`font-serif text-base font-bold uppercase leading-snug transition-colors duration-300 ${isCurrent ? "text-[#D49313]" : "text-[#593102]"
                                            }`}>
                                            {step.title}
                                        </h3>

                                        <p className="mt-2 text-xs text-[#6E5D4F] leading-relaxed font-medium">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Animated Bottom Active Line */}
                                    <div className="mt-5 w-full h-1 bg-[#FAF0DC] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r from-[#D49313] to-[#593102] transition-all duration-500 ${isCurrent ? "w-full" : isCompleted ? "w-full opacity-60" : "w-0"
                                                }`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
