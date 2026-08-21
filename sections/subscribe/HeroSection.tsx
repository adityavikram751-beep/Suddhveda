"use client";

export default function HeroSection({ onScrollToPlans }: { onScrollToPlans: () => void }) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#FFFDF8] to-[#FAF6F0] pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-[#EADCC9]/60 text-[#2F241C] min-h-[540px] lg:min-h-[640px] flex items-center">
            {/* Ambient Background Warm Glows */}
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#D49313]/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#593102]/10 blur-3xl pointer-events-none" />

            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 relative z-10 w-full">
                <div className="grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center">

                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">

                        {/* Subtitle Pill Badge - Without Icon */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF0DC] border border-[#D49313]/50 px-4 sm:px-5 py-1.5 text-[10px] sm:text-xs font-black tracking-widest uppercase text-[#593102] shadow-2xs max-w-full truncate">
                            <span className="truncate">SHUDDHVEDA ANNUAL SUBSCRIPTION</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[32px] sm:text-[50px] lg:text-[62px] leading-[1.15] sm:leading-[1.12] font-serif font-bold text-[#593102] tracking-tight">
                            ANNUAL HONEY <br className="hidden sm:inline" />
                            <span className="inline-block bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent font-serif italic ml-1 sm:ml-0">
                                SUBSCRIPTION
                            </span>
                        </h1>

                        <div className="w-20 sm:w-28 h-1 bg-gradient-to-r from-[#D49313] to-transparent my-2 rounded-full" />

                        <p className="font-serif italic text-xl sm:text-3xl font-semibold text-[#593102] leading-snug">
                            One Year. Six Honey Experiences.
                        </p>

                        <p className="text-sm sm:text-lg leading-relaxed text-[#6E5D4F] max-w-[620px] font-medium">
                            Discover six premium honey varieties, carefully sourced from different floral origins, delivered to your doorstep throughout the year.
                        </p>

                        {/* CTA Button - Compact & Sleek (No Icon) */}
                        <div className="pt-3 sm:pt-4 flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={onScrollToPlans}
                                className="bg-[#FA4B1B] hover:bg-[#E64216] text-white h-[46px] px-8 sm:px-9 rounded-xl flex items-center justify-center font-extrabold text-[13.5px] sm:text-[14.5px] shadow-md cursor-pointer uppercase tracking-wider transition-colors active:scale-98"
                            >
                                <span>SUBSCRIBE NOW</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Full Image in Single Golden Border */}
                    <div className="lg:col-span-5 relative flex justify-center items-center mt-2 sm:mt-0">
                        <div className="relative w-full max-w-[500px] rounded-[24px] overflow-hidden border-2 border-[#D49313]/70 shadow-lg">
                            <img
                                src="/home 1.png"
                                alt="ShuddhVeda Honey Jar"
                                className="w-full h-auto block rounded-[22px]"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
