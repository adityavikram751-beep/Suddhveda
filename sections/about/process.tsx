"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Nectar Collection",
    desc: "Bees collect rich nectar from organic wildflowers & mountain blossoms.",
    icon: "/madhu.png",
  },
  {
    step: "02",
    title: "Ethical Beekeeping",
    desc: "We follow ethical practices that protect bees, hives, and natural habitat.",
    icon: "/occession1.png",
  },
  {
    step: "03",
    title: "Gentle Extraction",
    desc: "Honey is cold-extracted with utmost care to preserve raw enzymes.",
    icon: "/step1.png",
  },
  {
    step: "04",
    title: "Lab Tested",
    desc: "Every batch is lab tested for raw purity, quality, and zero additives.",
    icon: "/upcoming.png",
  },
  {
    step: "05",
    title: "Secure Packaging",
    desc: "Packed in food-grade glass jars to seal in freshness & aroma.",
    icon: "/yellow logo.png",
  },
  {
    step: "06",
    title: "Delivered with Love",
    desc: "From our hive directly to your home with care and responsibility.",
    icon: "/steps4.png",
  },
];

export default function BeekeepingProcess() {
  return (
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] border-y border-[#EADCC9]/50 py-16 lg:py-24 overflow-hidden mt-10 lg:mt-14">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[300px] bg-[#D49313]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1450px] mx-auto w-full px-5 sm:px-8 relative z-10">
        
        {/* Heading */}
        <div className="text-center max-w-[1050px] mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-3">
            <Sparkles size={14} className="text-[#D49313]" />
            <span>OUR BEEKEEPING PROCESS</span>
          </div>

          <h2 className="font-serif text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-extrabold text-[#593102] leading-tight tracking-tight flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
            <span>Crafted with Care,</span>{" "}
            <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
              From Hive to Home
            </span>
            <Image
              src="/MOVE TO VISIT.png"
              alt="Bee icon"
              width={38}
              height={38}
              className="inline-block object-contain relative -top-0.5 animate-bounce duration-1000"
            />
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto mt-3.5 rounded-full" />

          <p className="mt-3.5 text-[14.5px] sm:text-[16px] leading-[1.65] text-[#6E5D4F] font-medium max-w-[640px] mx-auto">
            From ethical honey harvesting to eco-conscious glass packaging, discover how we deliver raw &amp; natural honey to your family.
          </p>
        </div>

        {/* PROCESS CONTAINER */}
        <div className="mt-10">
          
          {/* DESKTOP CONTAINER */}
          <div className="hidden lg:block relative min-w-0 overflow-x-auto py-4">
            {/* ONE continuous dashed line running behind all icons - PERFECTLY CENTERED AT 87PX */}
            <div className="absolute top-[87px] left-[8.33%] right-[8.33%] border-t-2 border-dashed border-[#D49313]/70 -translate-y-1/2 pointer-events-none z-0" />

            <div className="grid grid-cols-6 gap-6 relative z-10">
              {steps.map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center group cursor-pointer">
                  {/* Step Number Badge */}
                  <span className="bg-gradient-to-r from-[#D49313] to-[#593102] text-white font-extrabold text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs mb-2.5">
                    STEP {item.step}
                  </span>

                  {/* Icon circle — sits on top of the line */}
                  <div className="relative z-10 w-[78px] h-[78px] rounded-full border-2 border-[#D49313] bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-md group-hover:shadow-2xl group-hover:scale-110 group-hover:border-[#593102] transition-all duration-500 p-4">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={38}
                      height={38}
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <h3 className="mt-4 font-serif font-bold text-[14px] sm:text-[15px] tracking-wide text-[#593102] group-hover:text-[#D49313] transition-colors uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-[1.6] text-[#6E5D4F] font-medium max-w-[190px]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE & TABLET CONTAINER */}
          <div className="lg:hidden flex flex-col items-center gap-10">
            {steps.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center w-full max-w-[320px] group cursor-pointer">
                
                {/* Step Pill */}
                <span className="bg-gradient-to-r from-[#D49313] to-[#593102] text-white font-extrabold text-[11px] tracking-wider uppercase px-3 py-0.5 rounded-full shadow-xs mb-2.5">
                  STEP {item.step}
                </span>

                {/* Icon wrapper with left and right dashed lines - PERFECTLY CENTERED */}
                <div className="relative flex items-center justify-center w-full">
                  {/* Left Dashed Line */}
                  <div className="absolute left-0 right-[calc(50%+39px)] top-1/2 border-t-2 border-dashed border-[#D49313]/70 -translate-y-1/2" />

                  {/* Icon Circle */}
                  <div className="relative z-10 w-[78px] h-[78px] rounded-full border-2 border-[#D49313] bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-md group-hover:scale-108 transition-all p-4">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={38}
                      height={38}
                      className="object-contain"
                    />
                  </div>

                  {/* Right Dashed Line */}
                  <div className="absolute left-[calc(50%+39px)] right-0 top-1/2 border-t-2 border-dashed border-[#D49313]/70 -translate-y-1/2" />
                </div>

                <h3 className="mt-4 font-serif font-bold text-[15px] tracking-wide text-[#593102] group-hover:text-[#D49313] transition-colors uppercase">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-[1.6] text-[#6E5D4F] font-medium px-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}