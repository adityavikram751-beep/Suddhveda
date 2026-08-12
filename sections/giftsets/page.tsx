"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-28 items-center">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Gift Collection Subtitle Tag */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-[#1E1B16]/40 hidden lg:inline-block"></span>
              <span className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[2px] text-[#1E1B16]">
                GIFT COLLECTION
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-['Playfair_Display'] font-bold text-[#1E1B16]"
              style={{
                fontSize: "clamp(36px, 5vw, 48px)",
                lineHeight: "1.2",
                letterSpacing: "-0.96px",
              }}
            >
              Celebrate Every Moment
              <br className="hidden sm:inline" />
              <span className="text-[#593102]">
                {" "}with Nature&apos;s Sweetest Gift
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 text-[15px] sm:text-[16px] leading-[1.7] text-[#6B6259] max-w-[500px]">
              Beautifully curated premium honey gift boxes, crafted to make every occasion memorable with organic purity and artisanal essence.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
              <Link
                href="/shop"
                className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[48px] w-full sm:w-auto px-8 rounded-xl font-semibold text-[13px] tracking-wide flex items-center justify-center shadow-md"
              >
                SHOP THE COLLECTION
              </Link>
              <Link
                href="/customize"
                className="border border-[#795900] text-[#795900] hover:bg-[#D49313] hover:text-white transition-colors h-[48px] w-full sm:w-auto px-8 rounded-xl font-semibold text-[13px] tracking-wide flex items-center justify-center"
              >
                PERSONALIZE YOUR BOX
              </Link>
            </div>
          </div>

          {/* RIGHT – IMAGE CARD */}
          <div className="relative flex justify-center lg:justify-start w-full mt-6 lg:mt-0">
            <div className="relative w-full max-w-[440px]">
              {/* Photo card */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[24px] shadow-xl lg:rotate-2">
                <Image
                  src="/hero.png"
                  alt="ShudhVeda Himalayan Forest Bloom Gift Set"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Floating badge card */}
              <div className="absolute -bottom-6 left-4 sm:-left-10 max-w-[240px] rounded-xl bg-[#F3ECE0] px-5 py-4 shadow-lg hidden sm:block">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#593102]">
                  Limited Edition
                </p>
                <p className="mt-1 font-serif text-[17px] font-semibold leading-snug text-[#1E1B16]">
                  The Himalayan Forest Bloom Gift Set
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}