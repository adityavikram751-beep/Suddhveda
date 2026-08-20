"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, ShoppingBag } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-white overflow-hidden border-b border-[#EADCC9]/50">
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-28 items-center">

          {/* LEFT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Gift Collection Subtitle Tag */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-[#D49313] hidden lg:inline-block"></span>
              <span className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.2em] text-[#593102]">
                GIFT COLLECTION
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-serif font-bold text-[#593102]"
              style={{
                fontSize: "clamp(36px, 5vw, 48px)",
                lineHeight: "1.2",
                letterSpacing: "-0.96px",
              }}
            >
              Celebrate Every Moment
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
                {" "}with Nature&apos;s Sweetest Gift
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 text-[15px] sm:text-[16px] leading-[1.75] text-[#6E5D4F] font-medium max-w-[500px]">
              Beautifully curated premium honey gift boxes, crafted to make every occasion memorable with organic purity and artisanal essence.
            </p>


          </div>

          {/* RIGHT – IMAGE CARD (EXACT BORDER FIT & ZERO CROPPING) */}
          <div className="relative flex justify-center items-center w-full mt-6 lg:mt-0">
            <div className="relative w-full max-w-[640px] aspect-[16/10.4] overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(212,147,19,0.22)] border-2 border-[#D49313] bg-white group">
              <Image
                src="/home 2.png"
                alt="ShudhVeda Himalayan Forest Bloom Gift Set"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 rounded-[26px]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}