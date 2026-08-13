"use client";

import Image from "next/image";
import { Star, Heart, Eye, Users, Globe, ShieldCheck, Sparkles } from "lucide-react";

const values = [
  {
    title: "Purity First",
    desc: "We never compromise on 100% raw quality, warmth, or natural authenticity.",
    icon: Star,
  },
  {
    title: "Respect for Nature",
    desc: "We work in harmony with bees and preserve local wildflower ecosystems.",
    icon: Heart,
  },
  {
    title: "Transparency",
    desc: "We believe in complete honesty, batch clarity, and open communication.",
    icon: Eye,
  },
  {
    title: "Ethical Partnership",
    desc: "We support local beekeeping families with fair trade, sustainable practices.",
    icon: Users,
  },
  {
    title: "Sustainability",
    desc: "From hive to home, every step is designed to protect our planet.",
    icon: Globe,
  },
  {
    title: "Wellness for All",
    desc: "Pure nutrient-rich honey for healthier homes and happier lives.",
    icon: ShieldCheck,
  },
];

export default function OurValues() {
  return (
    <section className="bg-[#FAF6F0] relative border-b border-[#EADCC9]/50 overflow-hidden py-16 lg:py-20">
      <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-10">
        {/* Decorative honeycomb corner */}
        <div className="hidden lg:block absolute top-20 right-4 w-48 h-48 opacity-80 pointer-events-none">
          <Image src="/customer.png" alt="" fill className="object-contain" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* LEFT IMAGE + QUOTE */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden min-h-[560px] shadow-lg group cursor-pointer border-2 border-white">
            <Image
              src="/honeyprocess.png"
              alt="Beekeeper pouring honey into jars"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 text-[#FFD700] text-[11px] font-black uppercase tracking-[0.18em] bg-black/40 px-3 py-1 rounded-full mb-3 border border-[#FFD700]/30">
                <Sparkles size={13} />
                <span>OUR MISSION</span>
              </div>
              <p className="text-white text-[15px] sm:text-[17px] leading-[1.65] italic font-serif">
                &ldquo;Our mission is simple: to protect bees, preserve nature,
                and promote healthier lives — one jar of honey at a time.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                <span className="text-[#FFD700] text-[12px] tracking-[0.18em] font-black uppercase">
                  — TEAM SHUDHVEDA
                </span>
                <span className="text-[11px] font-bold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  100% Pure Guarantee
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT VALUES */}
          <div className="flex flex-col justify-center h-full">
            {/* Subtitle Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2.5 self-start">
              <Sparkles size={13} className="text-[#D49313]" />
              <span>OUR VALUES</span>
            </div>

            {/* Heading */}
            <h2 className="text-[32px] sm:text-[38px] md:text-[42px] font-serif font-extrabold text-[#593102] leading-tight tracking-tight">
              What Drives{" "}
              <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
                Everything We Do
              </span>
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-[#D49313] to-transparent my-3 rounded-full" />

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7 mt-6 sm:mt-8">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4 group cursor-pointer">
                    {/* Icon circle */}
                    <div className="w-11 h-11 rounded-full border border-[#D49313] bg-white flex items-center justify-center text-[#D49313] group-hover:bg-[#D49313] group-hover:text-white transition-all shrink-0 mt-0.5 shadow-xs">
                      <Icon size={18} strokeWidth={1.7} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-[17px] text-[#593102] group-hover:text-[#D49313] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[13.5px] sm:text-[14px] text-[#6E5D4F] font-medium mt-1.5 leading-[1.6]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}