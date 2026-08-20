"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Heart, Leaf, ShoppingBag } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] overflow-hidden py-10 lg:py-16 border-b border-[#EADCC9]/50">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#D49313]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#593102]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Subtitle Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-3">
              <span>OUR STORY</span>
            </div>

            {/* Heading - Exact 2 lines split */}
            <h1 className="text-[28px] sm:text-[42px] md:text-[50px] lg:text-[58px] leading-[1.18] font-serif text-[#593102] tracking-tight font-extrabold">
              Rooted in Nature.
              <br />
              <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent block">
                Driven by Purpose.
              </span>
            </h1>

            {/* MOBILE IMAGE: Placed DIRECTLY below heading on mobile */}
            <div className="block lg:hidden w-full my-5">
              <div className="relative w-full max-w-[480px] mx-auto rounded-[24px] overflow-hidden border-2 border-[#D49313]/70 shadow-lg">
                <img
                  src="/home 1.png"
                  alt="ShuddhaVeda Natural Honey Jar"
                  className="w-full h-auto block rounded-[22px]"
                />
              </div>
            </div>

            {/* Description */}
            <p className="mt-2 lg:mt-4 text-[14.5px] sm:text-[16.5px] leading-[1.7] text-[#6E5D4F] font-medium max-w-[540px]">
              At ShuddhaVeda, we believe honey is more than a sweetener—it&apos;s a
              gift from nature, crafted by hardworking bees and preserved with
              uncompromising care and respect.
            </p>

            {/* Features Bar - Hidden on mobile, visible on sm+ */}
            <div className="hidden sm:flex flex-wrap justify-center lg:justify-start items-center gap-3 sm:gap-4 mt-2 lg:mt-8">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 bg-white/80 border border-[#EADCC9] px-3.5 py-2 rounded-2xl shadow-xs">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#D49313] bg-[#FAF0DC] flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-extrabold text-[13px] sm:text-[14px] text-[#593102]">Raw &amp; Organic</span>
                  <span className="text-[#8D7F73] text-[11px] sm:text-[12px] font-medium">Natural Honey</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 bg-white/80 border border-[#EADCC9] px-3.5 py-2 rounded-2xl shadow-xs">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#D49313] bg-[#FAF0DC] flex-shrink-0">
                  <Leaf size={18} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-extrabold text-[13px] sm:text-[14px] text-[#593102]">Ethically</span>
                  <span className="text-[#8D7F73] text-[11px] sm:text-[12px] font-medium">Sourced</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 bg-white/80 border border-[#EADCC9] px-3.5 py-2 rounded-2xl shadow-xs">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#D49313] bg-[#FAF0DC] flex-shrink-0">
                  <Heart size={18} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-extrabold text-[13px] sm:text-[14px] text-[#593102]">Sustainable</span>
                  <span className="text-[#8D7F73] text-[11px] sm:text-[12px] font-medium">Beekeeping</span>
                </div>
              </div>
            </div>

            {/* CTA Button - Compact & Sleek */}
            <Link
              href="/shop"
              className="mt-6 bg-[#FA4B1B] hover:bg-[#E64216] text-white text-[12px] sm:text-[13px] font-extrabold tracking-wide uppercase px-5 sm:px-6 h-[40px] rounded-xl cursor-pointer shadow-xs transition-colors inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag size={15} />
              <span>EXPLORE OUR PRODUCTS</span>
            </Link>
          </div>

          {/* DESKTOP IMAGE: Single golden border wrapped directly around image */}
          <div className="hidden lg:flex lg:col-span-5 relative justify-end w-full">
            <div className="relative w-full max-w-[540px] rounded-[24px] overflow-hidden border-2 border-[#D49313]/70 shadow-[0_20px_50px_rgba(89,49,2,0.15)]">
              <img
                src="/home 1.png"
                alt="ShuddhaVeda Natural Honey Jar"
                className="w-full h-auto block rounded-[22px]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}