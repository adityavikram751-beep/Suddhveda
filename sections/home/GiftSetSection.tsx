"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { FiStar, FiHome, FiWind, FiClipboard, FiBox } from "react-icons/fi";

// ✅ Text ko exactly 1 line mein rakha hai, jaise screenshot mein hai
const steps = [
  {
    icon: FiStar,
    title: "Nectar Collection",
    description: "Bees collect nectar from pure flowers.",
  },
  {
    icon: FiHome,
    title: "Ethical Beekeeping",
    description: "We follow ethical & sustainable practices.",
  },
  {
    icon: FiWind,
    title: "Gentle Extraction",
    description: "Honey is extracted with care to retain nutrients.",
  },
  {
    icon: FiClipboard,
    title: "Lab Tested",
    description: "Every batch is tested for purity.",
  },
  {
    icon: FiBox,
    title: "Careful Packaging",
    description: "Packed with care to preserve freshness.",
  },
];

export default function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20 lg:py-16">
      <div className="max-w-[1443px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-center">
          
          {/* LEFT - Steps */}
          <div>
            {/* Label */}
            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#2D3A1B] uppercase">
              From Hive to Bottle
            </p>

            {/* Heading - always one line, bigger */}
            <h2 className="mt-3 text-[34px] md:text-[36px] lg:text-[36px] font-
Playfair Display leading-[1.1] text-[#233821] tracking-[-0.02em] whitespace-nowrap">
              Pure Honey, Thoughtfully Crafted
            </h2>

            {/* Steps - Horizontal Scroll on mobile, flex on desktop */}
            <div className="mt-10 md:mt-12 flex items-start overflow-x-auto pb-4 md:pb-0 gap-2 md:gap-0 scrollbar-hide">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;

                return (
                  <div key={index} className="flex items-start flex-shrink-0">
                    {/* Step Card */}
                    <div className="flex flex-col items-center text-center w-[120px] sm:w-[130px] md:w-[140px] group transition-all duration-300">
                      {/* Icon Circle */}
                      <div
                        className="
                          w-[64px] h-[64px] md:w-[72px] md:h-[72px]
                          rounded-full
                          bg-[#FBEEDF]
                          flex items-center justify-center
                          transition-all duration-300
                          group-hover:bg-[#2D3A1B]/10
                          group-hover:scale-105
                          group-hover:shadow-lg
                        "
                      >
                        <Icon 
                          size={28} 
                          className="text-[#2D3A1B] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
                        />
                      </div>

                      {/* ✅ Title - Ab 1 line mein */}
                      <h4 className="mt-3 text-[15px] md:text-[16px] font-semibold text-[#233821] leading-tight transition-colors duration-300 group-hover:text-[#2D3A1B]">
                        {step.title}
                      </h4>

                      {/* ✅ Description - Ab 1 line mein */}
                      <p className="mt-2 text-[12px] md:text-[13px] leading-[1.5] text-[#9A9A9A] transition-colors duration-300 group-hover:text-[#6B6B6B]">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow between steps */}
                    {!isLast && (
                      <ChevronRight
                        size={18}
                        className="text-[#D7CBBB] mt-6 mx-2 md:mx-3 shrink-0 transition-colors duration-300 hover:text-[#2D3A1B]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT - Illustration */}
          <div className="relative w-full h-[260px] md:h-[300px] lg:h-[340px] flex items-center justify-center">
            <div className="relative w-full h-full max-w-[400px] mx-auto">
              <Image
                src="/process2.png"
                alt="Pure Honey, Thoughtfully Crafted"
                fill
                className="object-contain object-center drop-shadow-xl"
                sizes="(max-width: 1024px) 90vw, 420px"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2D3A1B]/20 to-transparent" />
    </section>
  );
}