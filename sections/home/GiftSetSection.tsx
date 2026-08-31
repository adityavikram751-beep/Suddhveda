"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, ChevronRight, ShieldCheck, Heart, Truck, Award } from "lucide-react";

export default function GiftSetSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF9F3] via-[#FAF6F0] to-[#FDF9F3] py-16 md:py-24 border-b border-[#EADCC9]/50">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#D49313]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#593102]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* LEFT COLUMN - Text & Highlights */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* VIP Pill Badge */}
            <span className="inline-flex items-center gap-2.5 text-[#593102] bg-gradient-to-r from-[#FAF0DC] via-[#FFE3AA] to-[#FAF0DC] border-2 border-[#D49313]/60 px-5 py-2 rounded-full text-[12px] sm:text-[13px] font-extrabold tracking-[0.2em] uppercase mb-5 shadow-md backdrop-blur-md">
              <Gift size={16} className="text-[#D49313]" />
              ROYAL GIFTING EXPERIENCE
            </span>

            {/* Heading */}
            <h2 className="text-[36px] sm:text-[46px] md:text-[54px] font-serif font-bold leading-[1.12] text-[#593102] tracking-tight">
              Create Your Personalized
              <br />
              <span className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent font-serif italic pr-2">
                Royal Honey Gift Box
              </span>
            </h2>

            <div className="w-28 h-1 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-transparent my-4 rounded-full" />

            {/* Sub-description */}
            <p className="text-[16px] sm:text-[18px] leading-[1.7] text-[#6E5D4F] font-medium max-w-[620px] mt-2">
              Choose your signature gift box and handpick your favorite raw &amp; organic honey flavors to create a personalized royal gift for your loved ones.
            </p>

            {/* Feature Grid - 4 Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-[640px]">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 border border-[#EADCC9] shadow-xs hover:shadow-md transition-all min-h-[88px] sm:min-h-[82px] h-full">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#593102] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                  <Gift size={20} className="text-[#D49313]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[15px] text-[#593102]">Signature Gift Box</h4>
                  <p className="text-[13px] text-[#7A6A5C] font-medium leading-snug">Gold-embossed luxury box packaging</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 border border-[#EADCC9] shadow-xs hover:shadow-md transition-all min-h-[88px] sm:min-h-[82px] h-full">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#593102] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                  <Heart size={20} className="text-[#D49313]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[15px] text-[#593102]">Handpicked Flavors</h4>
                  <p className="text-[13px] text-[#7A6A5C] font-medium leading-snug">Handpick raw &amp; organic honey flavors</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 border border-[#EADCC9] shadow-xs hover:shadow-md transition-all min-h-[88px] sm:min-h-[82px] h-full">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#593102] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                  <Award size={20} className="text-[#D49313]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[15px] text-[#593102]">Personalized Note</h4>
                  <p className="text-[13px] text-[#7A6A5C] font-medium leading-snug">Add your custom greeting card message</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/80 border border-[#EADCC9] shadow-xs hover:shadow-md transition-all min-h-[88px] sm:min-h-[82px] h-full">
                <div className="w-10 h-10 rounded-xl bg-[#FAF0DC] text-[#593102] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                  <Truck size={20} className="text-[#D49313]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[15px] text-[#593102]">Pan-India Express</h4>
                  <p className="text-[13px] text-[#7A6A5C] font-medium leading-snug">Safely delivered to your doorstep</p>
                </div>
              </div>
            </div>

            {/* Mobile Image Showcase - Placed right above the CTA Button on Mobile */}
            <div className="mt-8 block lg:hidden w-full max-w-[560px] mx-auto rounded-3xl overflow-hidden border-2 border-[#D49313]/40 bg-[#FFFDF9] shadow-xl group">
              <Image
                src="/home 2.png"
                alt="ShudhVeda Royal Gift Set"
                width={800}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 block"
                priority
              />
            </div>

            {/* Action CTA */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="/giftsets"
                className="inline-flex items-center justify-center gap-2 bg-[#FA4B1B] hover:bg-[#E64216] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-7 h-[42px] rounded-2xl shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <span>BUILD CUSTOM GIFT BOX</span>
                <ChevronRight size={16} className="stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN - Heroic Image Showcase (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-5 relative justify-center items-center w-full">
            <div className="relative w-full max-w-[560px] lg:max-w-[580px] rounded-3xl overflow-hidden border-2 border-[#D49313]/40 bg-[#FFFDF9] shadow-xl group">

              {/* Product Image - Exact Image Dimensions (No Empty Space & No Cut) */}
              <Image
                src="/home 2.png"
                alt="ShudhVeda Royal Gift Set"
                width={800}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 block"
                priority
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}