"use client";

import Image from "next/image";

export default function HeroSection({ onScrollToPlans }: { onScrollToPlans?: () => void }) {
  const handleScroll = () => {
    if (onScrollToPlans) {
      onScrollToPlans();
    } else {
      document.getElementById("subscription-plans")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden w-full bg-[#FAF4E8] border-b border-[#EADCC9]/60 min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
      
      {/* ==================== DESKTOP MODE (lg and up) ==================== */}
      {/* Background Hero Image - Positioned on Right Side for Desktop */}
      <div className="hidden lg:flex absolute inset-y-0 right-0 w-[48%] z-0 items-center justify-end pointer-events-none opacity-100 transition-opacity">
        <Image
          src="/backfoung.png"
          alt="Shuddhveda Honey Subscription"
          fill
          priority
          className="object-contain object-right pointer-events-none"
        />
      </div>

      <div className="hidden lg:block mx-auto max-w-[1440px] px-10 lg:px-16 relative z-10 w-full py-14 lg:py-16">
        <div className="max-w-[680px]">

          {/* Top Pill Badge with Calendar Icon */}
          <div className="inline-flex items-center gap-2 bg-[#FAF4E8]/80 backdrop-blur-xs border border-[#F3DAB6] px-6 py-1.5 rounded-[14px] text-[13.5px] font-medium text-[#F29D00] shadow-none mb-4">
            <div className="relative w-4 h-4 flex-shrink-0">
              <Image
                src="/fluent_calendar-date-20-regular.svg"
                alt="Calendar Icon"
                fill
                className="object-contain"
              />
            </div>
            <span>Shuddhveda honey Subscription</span>
          </div>

          {/* Main Title */}
          <h1 className="font-libre-caslon text-[48px] lg:text-[64px] text-[#1A1410] leading-[1.12] tracking-normal">
            A Year of Honey.<br />
            A Journey of <span className="text-[#E08A00]">Flavours.</span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="font-cormorant italic text-[18px] lg:text-[19.5px] text-[#593102] leading-relaxed max-w-[560px] mt-6 mb-8">
            Discover six distinctive honey varieties, thoughtfully delivered to your doorstep throughout the year.
          </p>

          {/* Feature Cards Row */}
          <div className="flex items-center justify-start gap-3 my-6 w-full max-w-[540px]">
            {/* Card 1: 6 Honey variety */}
            <div className="bg-[#FAF4E8] backdrop-blur-md border border-[#E9DAC3]/70 rounded-[22px] px-4 py-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] w-[145px] h-[114px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md cursor-pointer">
              <div className="relative w-7 h-7 mb-1.5">
                <Image
                  src="/boxicons_honey.svg"
                  alt="Honey variety"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[15px] text-[#593102] text-center leading-[100%] font-normal">
                6 Honey<br />variety
              </span>
            </div>

            {/* Divider 1 */}
            <Image
              src="/divider.svg"
              alt="divider"
              width={2}
              height={54}
              className="block h-12 w-auto object-contain mx-1.5 flex-shrink-0"
            />

            {/* Card 2: 3 Deliveries */}
            <div className="bg-[#FAF4E8] backdrop-blur-md border border-[#E9DAC3]/70 rounded-[22px] px-4 py-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] w-[145px] h-[114px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md cursor-pointer">
              <div className="relative w-7 h-7 mb-1.5">
                <Image
                  src="/carbon_delivery-parcel.svg"
                  alt="Deliveries"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[15px] text-[#593102] text-center leading-[100%] font-normal">
                3<br />Deliveries
              </span>
            </div>

            {/* Divider 2 */}
            <Image
              src="/divider.svg"
              alt="divider"
              width={2}
              height={54}
              className="block h-12 w-auto object-contain mx-1.5 flex-shrink-0"
            />

            {/* Card 3: 500g Jars */}
            <div className="bg-[#FAF4E8] backdrop-blur-md border border-[#E9DAC3]/70 rounded-[22px] px-4 py-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] w-[145px] h-[114px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md cursor-pointer">
              <div className="relative w-7 h-7 mb-1.5">
                <Image
                  src="/game-icons_honey-jar.svg"
                  alt="500g Jars"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[15px] text-[#593102] text-center leading-[100%] font-normal">
                500g<br />Jars
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div>
            <button
              type="button"
              onClick={handleScroll}
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-sans font-semibold text-[16px] py-3 px-7 rounded-[16px] inline-flex items-center gap-2.5 shadow-sm hover:shadow-md transition-all duration-300 active:scale-98 cursor-pointer w-auto mt-6"
            >
              <span>Explore the Annual Plan</span>
              <span className="text-[17px] leading-none">↗</span>
            </button>
          </div>

        </div>
      </div>


      {/* ==================== MOBILE & TABLET MODE (< lg) ==================== */}
      <div className="block lg:hidden mx-auto max-w-[1440px] px-4 sm:px-8 relative z-10 w-full py-8 sm:py-12">
        <div className="w-full max-w-[680px] mx-auto">

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FAF2E6] border border-[#F0DFCA] px-3.5 py-1.5 rounded-full text-[12.5px] sm:text-[14px] font-medium text-[#6B4725] mb-4 shadow-2xs">
            <span className="text-[14px] sm:text-[15px]">🍯</span>
            <span>Shuddhveda honey Subscription</span>
          </div>

          {/* Main Title */}
          <h1 className="font-libre-caslon text-[30px] xs:text-[35px] sm:text-[44px] text-[#1A1410] leading-[1.12] tracking-tight">
            A Year of Honey.<br />
            A Journey of Flavours.
          </h1>

          {/* Subtitle */}
          <p className="font-cormorant italic text-[15px] sm:text-[18px] text-[#593102] leading-snug sm:leading-relaxed max-w-[560px] mt-3 sm:mt-4 mb-5">
            Discover six distinctive honey varieties, thoughtfully delivered to your doorstep throughout the year.
          </p>

          {/* 3 Feature Cards Row (1-row layout) */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-3 my-5 w-full">
            {/* Card 1: 6 Honey variety */}
            <div className="bg-[#FAF4E8] border border-[#E9DAC3] rounded-[16px] sm:rounded-[22px] px-2 sm:px-4 py-2.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] flex-1 min-w-0 h-[96px] sm:h-[114px]">
              <div className="relative w-5 h-5 sm:w-7 sm:h-7 mb-1.5">
                <Image
                  src="/boxicons_honey.svg"
                  alt="Honey variety"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[12px] sm:text-[14.5px] text-[#593102] text-center leading-[115%] font-normal">
                6 Honey<br />variety
              </span>
            </div>

            {/* Vertical Divider 1 */}
            <div className="w-[1px] h-9 sm:h-12 bg-[#E2D2BE] flex-shrink-0 mx-0.5 sm:mx-1 self-center" />

            {/* Card 2: 3 Deliveries */}
            <div className="bg-[#FAF4E8] border border-[#E9DAC3] rounded-[16px] sm:rounded-[22px] px-2 sm:px-4 py-2.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] flex-1 min-w-0 h-[96px] sm:h-[114px]">
              <div className="relative w-5 h-5 sm:w-7 sm:h-7 mb-1.5">
                <Image
                  src="/carbon_delivery-parcel.svg"
                  alt="Deliveries"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[12px] sm:text-[14.5px] text-[#593102] text-center leading-[115%] font-normal">
                3<br />Deliveries
              </span>
            </div>

            {/* Vertical Divider 2 */}
            <div className="w-[1px] h-9 sm:h-12 bg-[#E2D2BE] flex-shrink-0 mx-0.5 sm:mx-1 self-center" />

            {/* Card 3: 500g Jars */}
            <div className="bg-[#FAF4E8] border border-[#E9DAC3] rounded-[16px] sm:rounded-[22px] px-2 sm:px-4 py-2.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] flex-1 min-w-0 h-[96px] sm:h-[114px]">
              <div className="relative w-5 h-5 sm:w-7 sm:h-7 mb-1.5">
                <Image
                  src="/game-icons_honey-jar.svg"
                  alt="500g Jars"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[12px] sm:text-[14.5px] text-[#593102] text-center leading-[115%] font-normal">
                500g<br />Jars
              </span>
            </div>
          </div>

          {/* Honey Jars Showcase Image (Shown after feature cards & before CTA on Mobile) */}
          <div className="relative w-full max-w-[360px] aspect-[4/3] mx-auto my-4">
            <Image
              src="/backfoung.png"
              alt="Shuddhveda Honey Subscription Jars"
              fill
              priority
              className="object-contain pointer-events-none"
            />
          </div>

          {/* CTA Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleScroll}
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-sans font-semibold text-[15px] sm:text-[16px] py-3.5 px-6 rounded-[16px] inline-flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer w-full"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
                <line x1="12" y1="14" x2="12" y2="18" />
                <line x1="10" y1="16" x2="14" y2="16" />
              </svg>
              <span>Shop honey</span>
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}



