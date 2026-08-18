"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Zap, BadgeCheck, Tag, Package, Sparkles } from "lucide-react";

export default function ShopHero() {
  return (
    <>
      {/* ================= Hero ================= */}
      <section className="relative bg-gradient-to-b from-[#FDF9F3] via-[#FAF6F0] to-[#FDF9F3] py-12 lg:py-18 border-b border-[#EADCC9]/60 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D49313]/6 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* LEFT CONTENT */}
            <div className="lg:col-span-6 flex flex-col items-start">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[14px] text-[#7A6A5C]">
                <Link href="/" className="hover:text-[#593102] transition-colors font-medium">
                  Home
                </Link>
                <ChevronRight size={14} className="text-[#D49313]" />
                <span className="text-[#593102] font-bold">Shop</span>
              </div>

              {/* Heading */}
              <h1 className="mt-3.5 font-serif text-[40px] sm:text-[50px] lg:text-[58px] font-extrabold leading-[1.12] text-[#593102] tracking-tight">
                Shop Pure{" "}
                <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent font-serif italic pr-2">
                  Honey
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 text-[16px] sm:text-[17px] leading-[1.7] text-[#6E5D4F] font-medium max-w-[520px]">
                Discover our raw, natural and filtered honey crafted by nature, packed with goodness.
              </p>
            </div>

            {/* RIGHT IMAGE CARD - EDGE-TO-EDGE FULL IMAGE (NO WHITE BANDS / NO CUTTING) */}
            <div className="lg:col-span-6 relative w-full flex justify-center">
              <div className="relative w-full max-w-[640px] xl:max-w-[660px] aspect-[16/9.5] lg:h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#D49313]/60 shadow-xl group bg-white">

                {/* Product Image - Edge to Edge 100% Full Fit */}
                <Image
                  src="/shop.png"
                  alt="ShudhVeda Honey Jars"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Badge (Bottom Right Pill) */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] text-white rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2.5 shadow-xl flex items-center gap-1.5 sm:gap-2 z-20 border border-[#FFD700]/30">
                  <span className="font-black text-[10px] sm:text-[13px] uppercase tracking-wider">SIGNATURE COLLECTION</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= Feature Strip ================= */}
      <section className="bg-white border-b border-[#EADCC9]/60 py-8 lg:py-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Feature 1 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F7ECE0] border border-[#D49313]/30 shadow-2xs hover:shadow-md hover:border-[#D49313]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0DC] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                <Zap size={22} className="text-[#D49313]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-[#593102]">
                  Raw &amp; Natural
                </span>
                <span className="text-[13px] font-medium text-[#7A6A5C]">
                  Unprocessed &amp; Filtered
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F7ECE0] border border-[#D49313]/30 shadow-2xs hover:shadow-md hover:border-[#D49313]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0DC] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                <BadgeCheck size={22} className="text-[#D49313]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-[#593102]">
                  Lab Tested
                </span>
                <span className="text-[13px] font-medium text-[#7A6A5C]">
                  For Purity &amp; Safety
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F7ECE0] border border-[#D49313]/30 shadow-2xs hover:shadow-md hover:border-[#D49313]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0DC] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                <Tag size={22} className="text-[#D49313]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-[#593102]">
                  No Added Sugar
                </span>
                <span className="text-[13px] font-medium text-[#7A6A5C]">
                  No Preservatives
                </span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F7ECE0] border border-[#D49313]/30 shadow-2xs hover:shadow-md hover:border-[#D49313]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FAF0DC] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                <Package size={22} className="text-[#D49313]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-[#593102]">
                  Secure Packaging
                </span>
                <span className="text-[13px] font-medium text-[#7A6A5C]">
                  Safe &amp; Hygienic Delivery
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}