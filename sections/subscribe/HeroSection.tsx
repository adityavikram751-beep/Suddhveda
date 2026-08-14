"use client";

import Image from "next/image";
import { FiGift, FiTruck, FiShield, FiPackage, FiPercent, FiAward } from "react-icons/fi";
import { Sparkles, Calendar, ArrowRight, Crown } from "lucide-react";

export default function HeroSection({ onScrollToPlans }: { onScrollToPlans: () => void }) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#FFFDF8] to-[#FAF6F0] pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-12 border-b border-[#EADCC9]/60 text-[#2F241C]">
            {/* Ambient Background Warm Glows */}
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#D49313]/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#593102]/10 blur-3xl pointer-events-none" />

            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 relative z-10">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

                    {/* Left Column: Text Content & Features */}
                    <div className="lg:col-span-7 space-y-6 text-left">

                        {/* Royalty VIP Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF0DC] border border-[#D49313]/50 px-4 py-1.5 text-xs font-black tracking-widest uppercase text-[#593102] shadow-2xs">
                            <Crown size={15} className="text-[#D49313]" />
                            <span>SHUDDHVEDA ANNUAL SUBSCRIPTION</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[36px] sm:text-[48px] lg:text-[58px] leading-[1.12] font-serif font-bold text-[#593102] tracking-tight">
                            ANNUAL HONEY <br />
                            <span className="inline-block bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent font-serif italic">
                                SUBSCRIPTION
                            </span>
                        </h1>

                        <div className="w-28 h-1 bg-gradient-to-r from-[#D49313] to-transparent my-2 rounded-full" />

                        <p className="font-serif italic text-2xl sm:text-3xl font-semibold text-[#593102]">
                            One Year. Six Honey Experiences.
                        </p>

                        <p className="text-base sm:text-lg leading-relaxed text-[#6E5D4F] max-w-[620px] font-medium">
                            Discover six premium honey varieties, carefully sourced from different floral origins, delivered to your doorstep throughout the year.
                        </p>

                        {/* 5 Feature Badges Grid */}
                        <div className="pt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                            <div className="group flex flex-col items-center text-center gap-2 p-3.5 rounded-2xl bg-white border border-[#EADCC9] shadow-2xs hover:border-[#D49313] hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-full border border-[#D49313]/30 flex items-center justify-center text-[#593102] bg-[#FAF0DC] text-xs font-black shrink-0">
                                    <FiAward size={18} className="text-[#D49313]" />
                                </div>
                                <span className="text-[#593102] text-[11px] font-bold leading-tight">
                                    One Payment for the Year
                                </span>
                            </div>

                            <div className="group flex flex-col items-center text-center gap-2 p-3.5 rounded-2xl bg-white border border-[#EADCC9] shadow-2xs hover:border-[#D49313] hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-full border border-[#D49313]/30 flex items-center justify-center text-[#593102] bg-[#FAF0DC] text-xs font-black shrink-0">
                                    <FiTruck size={18} className="text-[#D49313]" />
                                </div>
                                <span className="text-[#593102] text-[11px] font-bold leading-tight">
                                    Six Premium Deliveries
                                </span>
                            </div>

                            <div className="group flex flex-col items-center text-center gap-2 p-3.5 rounded-2xl bg-white border border-[#EADCC9] shadow-2xs hover:border-[#D49313] hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-full border border-[#D49313]/30 flex items-center justify-center text-[#593102] bg-[#FAF0DC] text-xs font-black shrink-0">
                                    <FiPackage size={18} className="text-[#D49313]" />
                                </div>
                                <span className="text-[#593102] text-[11px] font-bold leading-tight">
                                    Free Shipping
                                </span>
                            </div>

                            <div className="group flex flex-col items-center text-center gap-2 p-3.5 rounded-2xl bg-white border border-[#EADCC9] shadow-2xs hover:border-[#D49313] hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-full border border-[#D49313]/30 flex items-center justify-center text-[#593102] bg-[#FAF0DC] text-xs font-black shrink-0">
                                    <FiPercent size={18} className="text-[#D49313]" />
                                </div>
                                <span className="text-[#593102] text-[11px] font-bold leading-tight">
                                    Save More with Prepaid Discount
                                </span>
                            </div>

                            <div className="col-span-2 sm:col-span-1 group flex flex-col items-center text-center gap-2 p-3.5 rounded-2xl bg-white border border-[#EADCC9] shadow-2xs hover:border-[#D49313] hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-full border border-[#D49313]/30 flex items-center justify-center text-[#593102] bg-[#FAF0DC] text-xs font-black shrink-0">
                                    <FiShield size={18} className="text-[#D49313]" />
                                </div>
                                <span className="text-[#593102] text-[11px] font-bold leading-tight">
                                    Exclusive Member Benefits
                                </span>
                            </div>
                        </div>

                        {/* CTA Button & Subtag */}
                        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <button
                                onClick={onScrollToPlans}
                                className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white h-[54px] px-9 rounded-xl flex items-center justify-center gap-3 font-extrabold text-[15px] shadow-lg hover:shadow-xl cursor-pointer uppercase tracking-wider border border-[#FFD700]/30 transition-all duration-500 transform hover:-translate-y-0.5 active:scale-98 group"
                            >
                                <FiGift size={18} className="text-[#FFD700]" />
                                <span>SUBSCRIBE NOW</span>
                                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </button>

                            <span className="text-sm font-semibold text-[#6E5D4F] flex items-center gap-1.5 bg-white/90 border border-[#EADCC9] px-4 py-2 rounded-xl">
                                🎁 Perfect for you or your loved ones!
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Royal Honey Box Image Frame */}
                    <div className="lg:col-span-5 relative flex justify-center items-center">
                        <div className="relative w-full max-w-[480px] h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-tr from-[#FAF0DC] via-white to-[#FAF6F0] p-6 shadow-2xl border-2 border-[#D49313]/40 flex items-center justify-center group overflow-hidden">
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <Image
                                    src="/honneycart.png"
                                    alt="ShuddhVeda Honey Subscription Box & Jar"
                                    width={380}
                                    height={380}
                                    className="object-contain max-h-full transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            </div>

                            {/* Floating Glass Badge Top Right */}
                            <div className="absolute top-4 right-4 z-20 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EADCC9] px-3.5 py-2 shadow-lg flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#593102] text-white">
                                    <Calendar size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-[#8D7F73]">Frequency</p>
                                    <p className="text-xs font-extrabold text-[#593102]">6 Deliveries / Year</p>
                                </div>
                            </div>

                            {/* Floating Glass Badge Bottom Left */}
                            <div className="absolute bottom-4 left-4 z-20 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EADCC9] px-3.5 py-2 shadow-lg flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D49313] text-white">
                                    <FiShield size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-[#8D7F73]">100% Pure</p>
                                    <p className="text-xs font-extrabold text-[#593102]">Raw &amp; Unfiltered</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
