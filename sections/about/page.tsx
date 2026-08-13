"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Leaf, ShoppingBag } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] overflow-hidden lg:min-h-[720px] border-b border-[#EADCC9]/50">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#D49313]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#593102]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto w-full px-6 lg:pl-8 lg:pr-16 pt-6 pb-12 lg:pb-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-4 lg:pt-8">
            
            {/* Subtitle Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2">
              <Sparkles size={14} className="text-[#D49313]" />
              <span>OUR STORY</span>
            </div>

            {/* Heading */}
            <h1 className="mt-2 text-[38px] sm:text-[52px] md:text-[60px] lg:text-[68px] leading-[1.15] font-serif text-[#593102] tracking-tight font-extrabold">
              Rooted in Nature.
              <br />
              <span className="italic bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
                Driven by Purpose.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 lg:mt-6 text-[15px] sm:text-[17px] leading-[1.7] text-[#6E5D4F] font-medium max-w-[480px]">
              At ShuddhaVeda, we believe honey is more than a sweetener—it&apos;s a
              gift from nature, crafted by hardworking bees and preserved with
              uncompromising care and respect.
            </p>

            {/* Features Bar */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-4 mt-8 lg:mt-10">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 bg-white/80 border border-[#EADCC9] px-3.5 py-2 rounded-2xl shadow-xs">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#D49313] bg-[#FAF0DC] flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-extrabold text-[14px] text-[#593102]">100% Pure</span>
                  <span className="text-[#8D7F73] text-[12px] font-medium">Natural Honey</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 bg-white/80 border border-[#EADCC9] px-3.5 py-2 rounded-2xl shadow-xs">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#D49313] bg-[#FAF0DC] flex-shrink-0">
                  <Leaf size={18} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-extrabold text-[14px] text-[#593102]">Ethically</span>
                  <span className="text-[#8D7F73] text-[12px] font-medium">Sourced</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 bg-white/80 border border-[#EADCC9] px-3.5 py-2 rounded-2xl shadow-xs">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#D49313] bg-[#FAF0DC] flex-shrink-0">
                  <Heart size={18} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-extrabold text-[14px] text-[#593102]">Sustainable</span>
                  <span className="text-[#8D7F73] text-[12px] font-medium">Beekeeping</span>
                </div>
              </div>
            </div>

            {/* CTA Button with Link */}
            <Link
              href="/shop"
              className="mt-8 lg:mt-10 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white h-[52px] w-full lg:w-auto px-8 rounded-2xl font-black text-[14px] tracking-wider uppercase inline-flex items-center justify-center gap-2.5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#FFD700]/30 active:scale-98 cursor-pointer"
            >
              <ShoppingBag size={18} />
              <span>EXPLORE OUR PRODUCTS</span>
            </Link>
          </div>

          {/* RIGHT – IMAGE */}
          <div className="relative flex justify-center lg:justify-end w-full mt-6 lg:mt-0">
            <div className="relative flex justify-center lg:justify-end items-center w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[650px]">
              <Image
                src="/hero.png"
                alt="ShuddhaVeda Natural Honey Jar"
                width={1800}
                height={1800}
                priority
                className="
                  relative lg:absolute
                  top-0 lg:top-12
                  right-0 lg:right-14
                  w-full lg:w-[110%]
                  max-w-full lg:max-w-none
                  h-full
                  object-contain
                  object-center lg:object-right-top
                  translate-x-0 lg:translate-x-22
                  scale-100 lg:scale-[1.2]
                "
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}