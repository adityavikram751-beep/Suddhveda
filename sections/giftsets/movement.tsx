"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

export default function MomentsMadeSweeter() {
  return (
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E8] to-[#FFFDF9] py-16 sm:py-24 border-b border-[#EADCC9]/50 overflow-hidden">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D49313]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#593102]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1350px] mx-auto px-5 sm:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-wider mb-3 shadow-2xs">
            <Camera size={14} className="text-[#D49313]" />
            <span>GIFTING INSPIRATION</span>
          </div>

          <h2 className="font-serif text-[34px] sm:text-[44px] md:text-[50px] font-extrabold text-[#593102] leading-tight tracking-tight">
            Moments Made{" "}
            <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
              Sweeter
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto mt-3 rounded-full" />

          <p className="text-[#6E5D4F] text-[14px] sm:text-[16px] mt-3 font-medium leading-relaxed">
            Real celebrations, heartwarming smiles, and cherished gifting memories crafted with pure organic sweetness.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:gap-6 lg:h-[580px]">

          {/* Left - Big Tall Featured Image (6 cols on lg) */}
          <div className="w-full lg:col-span-6 relative rounded-[28px] overflow-hidden h-[340px] sm:h-[450px] lg:h-full border-2 border-white ring-1 ring-[#D49313]/30 shadow-xl group cursor-pointer">
            <Image
              src="/family2.webp"
              alt="Wedding table setting with honey jar"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>

          {/* Right Column - 3 Images Split (6 cols on lg) */}
          <div className="w-full lg:col-span-6 flex flex-col gap-5 lg:grid lg:grid-rows-12 lg:gap-6 lg:h-full">

            {/* Top Row: 2 Images Side-by-Side (7 rows height on lg) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 lg:row-span-7 lg:gap-6 lg:h-full">

              {/* Card 1 */}
              <div className="relative rounded-[24px] overflow-hidden h-[240px] sm:h-[280px] lg:h-full border-2 border-white ring-1 ring-[#D49313]/30 shadow-lg group cursor-pointer">
                <Image
                  src="/image1.png"
                  alt="Elderly couple unboxing a gift"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Card 2 */}
              <div className="relative rounded-[24px] overflow-hidden h-[240px] sm:h-[280px] lg:h-full border-2 border-white ring-1 ring-[#D49313]/30 shadow-lg group cursor-pointer">
                <Image
                  src="/family2.png"
                  alt="Family celebrating with gift box"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-[center_20%] sm:object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

            </div>

            {/* Bottom Row: Wide Image (5 rows height on lg) */}
            <div className="w-full lg:row-span-5 relative rounded-[24px] overflow-hidden h-[220px] sm:h-[260px] lg:h-full border-2 border-white ring-1 ring-[#D49313]/30 shadow-lg group cursor-pointer">
              <Image
                src="/family.png"
                alt="Family sweet moments with pure honey gift"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_30%] sm:object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}