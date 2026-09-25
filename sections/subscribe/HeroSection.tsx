"use client";

import Image from "next/image";

export default function HeroSection({ onScrollToPlans }: { onScrollToPlans: () => void }) {
  return (
    <section className="relative overflow-hidden w-full bg-[#FAF4E8] border-b border-[#EADCC9]/60 min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Background Hero Image - Positioned on Right Side (Responsive opacity & sizing) */}
      <div className="absolute inset-y-0 right-0 w-full sm:w-[50%] lg:w-[48%] z-0 flex items-center justify-end pointer-events-none opacity-20 sm:opacity-100 transition-opacity">
        <Image
          src="/backfoung.png"
          alt="Shuddhveda Honey Subscription"
          fill
          priority
          className="object-contain object-right pointer-events-none"
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-16 relative z-10 w-full py-8 sm:py-14 lg:py-16">
        <div className="max-w-[680px]">

          {/* Top Pill Badge with Calendar Icon */}
          <div className="inline-flex items-center gap-2 bg-[#FAF4E8]/80 backdrop-blur-xs border border-[#F3DAB6] px-3.5 sm:px-6 py-1.5 rounded-[14px] text-[12px] sm:text-[13.5px] font-medium text-[#F29D00] shadow-none mb-4">
            <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0">
              <Image
                src="/fluent_calendar-date-20-regular.svg"
                alt="Calendar Icon"
                fill
                className="object-contain"
              />
            </div>
            <span>Shuddhveda honey Subscription</span>
          </div>

          {/* Main Title (Responsive size: 30px on mobile, 48px on tablet, 64px on desktop) */}
          <h1 className="font-libre-caslon text-[30px] xs:text-[36px] sm:text-[48px] lg:text-[64px] text-[#1A1410] leading-[1.12] tracking-normal">
            A Year of Honey.<br />
            A Journey of <span className="text-[#E08A00] font-normal">Flavours.</span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="font-cormorant italic text-[15px] sm:text-[18px] lg:text-[19.5px] text-[#593102] leading-snug sm:leading-relaxed max-w-[560px] mt-4 sm:mt-6 mb-6 sm:mb-8">
            Discover six distinctive honey varieties, thoughtfully delivered to your doorstep throughout the year.
          </p>

          {/* Feature Cards Row (1-row responsive flex layout for mobile, tablet & desktop) */}
          <div className="flex items-center justify-between sm:justify-start gap-1 xs:gap-2 sm:gap-3 my-5 sm:my-6 w-full max-w-[540px]">
            {/* Card 1: 6 Honey variety */}
            <div className="bg-[#FAF4E8] backdrop-blur-md border border-[#E9DAC3]/70 rounded-[16px] sm:rounded-[22px] px-2 sm:px-4 py-2.5 sm:py-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] flex-1 sm:flex-none sm:w-[145px] h-[92px] sm:h-[114px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md cursor-pointer">
              <div className="relative w-5 h-5 sm:w-7 sm:h-7 mb-1 sm:mb-1.5">
                <Image
                  src="/boxicons_honey.svg"
                  alt="Honey variety"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[12px] sm:text-[15px] text-[#593102] text-center leading-[100%] font-normal">
                6 Honey<br />variety
              </span>
            </div>

            {/* Divider 1 - SVG Divider */}
            <Image
              src="/divider.svg"
              alt="divider"
              width={2}
              height={54}
              className="block h-8 sm:h-12 w-auto object-contain mx-0.5 sm:mx-1.5 flex-shrink-0"
            />

            {/* Card 2: 3 Deliveries */}
            <div className="bg-[#FAF4E8] backdrop-blur-md border border-[#E9DAC3]/70 rounded-[16px] sm:rounded-[22px] px-2 sm:px-4 py-2.5 sm:py-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] flex-1 sm:flex-none sm:w-[145px] h-[92px] sm:h-[114px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md cursor-pointer">
              <div className="relative w-5 h-5 sm:w-7 sm:h-7 mb-1 sm:mb-1.5">
                <Image
                  src="/carbon_delivery-parcel.svg"
                  alt="Deliveries"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[12px] sm:text-[15px] text-[#593102] text-center leading-[100%] font-normal">
                3<br />Deliveries
              </span>
            </div>

            {/* Divider 2 - SVG Divider */}
            <Image
              src="/divider.svg"
              alt="divider"
              width={2}
              height={54}
              className="block h-8 sm:h-12 w-auto object-contain mx-0.5 sm:mx-1.5 flex-shrink-0"
            />

            {/* Card 3: 500g Jars */}
            <div className="bg-[#FAF4E8] backdrop-blur-md border border-[#E9DAC3]/70 rounded-[16px] sm:rounded-[22px] px-2 sm:px-4 py-2.5 sm:py-3.5 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(89,49,2,0.06)] flex-1 sm:flex-none sm:w-[145px] h-[92px] sm:h-[114px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md cursor-pointer">
              <div className="relative w-5 h-5 sm:w-7 sm:h-7 mb-1 sm:mb-1.5">
                <Image
                  src="/game-icons_honey-jar.svg"
                  alt="500g Jars"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-poly text-[12px] sm:text-[15px] text-[#593102] text-center leading-[100%] font-normal">
                500g<br />Jars
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div>
            <button
              type="button"
              onClick={onScrollToPlans}
              className="bg-[#D97706] hover:bg-[#B45309] text-white font-sans font-semibold text-[14px] sm:text-[16px] py-2.5 sm:py-3 px-5 sm:px-7 rounded-[16px] inline-flex items-center gap-2 sm:gap-2.5 shadow-sm hover:shadow-md transition-all duration-300 active:scale-98 cursor-pointer w-auto mt-4 sm:mt-6"
            >
              <span>Explore the Annual Plan</span>
              <span className="text-[16px] sm:text-[17px] leading-none">↗</span>
            </button>
          </div>

        </div>
      </div>

      {/* Faint Bottom Watermark */}

    </section>
  );
}


