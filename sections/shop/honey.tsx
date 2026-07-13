"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Zap, BadgeCheck, Tag, Package } from "lucide-react";

export default function ShopHero() {
  return (
    <>
      {/* ================= Hero ================= */}
      <section className="bg-[#FAF6F0]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* LEFT CONTENT */}
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[14px] text-[#8D7F73]">
                <Link href="/" className="hover:text-[#2C241E] transition-colors">
                  Home
                </Link>
                <ChevronRight size={14} className="text-[#B37B1B]" />
                <span className="text-[#D49313] font-medium">Shop</span>
              </div>

              {/* Heading */}
              <h1 className="mt-4 font-serif text-[36px] sm:text-[44px] lg:text-[54px] leading-[1.15] text-[#1E1C19] tracking-tight">
                Shop Pure <span className="text-[#D49313]">Honey</span>
              </h1>

              {/* Description */}
              <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.6] text-[#8D7F73] max-w-[420px]">
                Discover our 100% pure, raw and unfiltered honey crafted by
                nature, packed with goodness.
              </p>
            </div>

            {/* RIGHT IMAGE CARD */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] h-[220px] sm:h-[280px] lg:h-[330px]">
              <Image
                src="/shopsection.png"
                alt="ShudhVeda Honey Jars"
                fill
                priority
                className="object-cover"
              />

              {/* Mock browser top bar overlay */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-black/25 to-transparent">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/70 flex items-center justify-center text-white/70 text-[8px]">
                    i
                  </span>
                  <span className="text-white text-[11px] font-medium tracking-wide">
                    SHUddHAVeda
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  </div>
                  <button className="bg-white/90 text-[#2C241E] text-[10px] font-medium px-2.5 py-1 rounded">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Feature Strip ================= */}
      <section className="bg-white border-t border-[#F2ECE4]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
            {/* Feature 1 */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#FBEED9] flex items-center justify-center shrink-0">
                <Zap size={20} className="text-[#D49313]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#2C241E]">
                  100% Pure & Raw
                </span>
                <span className="text-[12px] text-[#8D7F73]">
                  Unprocessed & Unfiltered
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#FBEED9] flex items-center justify-center shrink-0">
                <BadgeCheck size={20} className="text-[#D49313]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#2C241E]">
                  Lab Tested
                </span>
                <span className="text-[12px] text-[#8D7F73]">
                  For Purity & Safety
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#FBEED9] flex items-center justify-center shrink-0">
                <Tag size={20} className="text-[#D49313]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#2C241E]">
                  No Added Sugar
                </span>
                <span className="text-[12px] text-[#8D7F73]">
                  No Preservatives
                </span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#FBEED9] flex items-center justify-center shrink-0">
                <Package size={20} className="text-[#D49313]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#2C241E]">
                  Secure Packaging
                </span>
                <span className="text-[12px] text-[#8D7F73]">
                  Safe & Hygienic Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}