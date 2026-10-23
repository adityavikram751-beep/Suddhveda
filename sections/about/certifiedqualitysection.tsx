"use client";

import Image from "next/image";
import { ShieldCheck, Award } from "lucide-react";

const features = [
  {
    icon: "/raw.webp",
    title: "RAW HONEY",
    subtitle: "Cold Extracted",
  },
  {
    icon: "/gmo.webp",
    title: "GMO FREE",
    subtitle: "Natural Flora",
  },
  {
    icon: "/bpa.webp",
    title: "BPA FREE",
    subtitle: "Glass Jar Packed",
  },
  {
    icon: "/fssai.png",
    title: "FSSAI APPROVED",
    subtitle: "Safety Certified",
  },
  {
    icon: "/labtest.webp",
    title: "LAB TESTED",
    subtitle: "Multi-Parameter",
  },
  {
    icon: "/nosugar.webp",
    title: "NO ADDED SUGAR",
    subtitle: "Pure Unfiltered",
  },
];

export default function CertifiedQualitySection() {
  return (
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] py-16 lg:py-24 border-y border-[#EADCC9]/50 overflow-hidden">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-[#D49313]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

          {/* LEFT CONTENT & FEATURES GRID */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Subtitle Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-3 self-start">
              <span>CERTIFIED PURITY</span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-[32px] sm:text-[42px] md:text-[46px] font-extrabold text-[#593102] leading-tight tracking-tight">
              Certified Purity.{" "}
              <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
                Trusted Quality.
              </span>
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-[#D49313] to-transparent my-3.5 rounded-full" />

            <p className="text-[#6E5D4F] text-[14.5px] sm:text-[16px] leading-[1.65] font-medium max-w-[620px] mb-8">
              We adhere to strict multi-parameter purity tests and ethical harvesting guidelines to ensure every jar reaches your table with uncompromised natural goodness.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-5">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/85 backdrop-blur-sm border sm:border-2 border-[#EADCC9]/80 rounded-xl sm:rounded-[22px] py-2.5 px-1.5 sm:p-5 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  {/* Icon Box Container - Optimized for mobile & desktop */}
                  <div className="relative w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl border border-[#D49313]/40 overflow-hidden shadow-2xs mb-1.5 sm:mb-2.5 shrink-0 bg-white">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 40px, 64px"
                      className="object-cover rounded-xl sm:rounded-2xl"
                    />
                  </div>

                  {/* Title */}
                  <h4 className="text-[10px] sm:text-[13px] font-extrabold text-[#593102] tracking-tight sm:tracking-wide uppercase font-serif leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[8.5px] sm:text-[10px] font-medium text-[#8D7F73] mt-0.5 leading-tight line-clamp-1 sm:line-clamp-none">
                    {item.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SHOWCASE PHOTO */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-end w-full pt-6 lg:pt-10">
            <div className="relative w-full max-w-[620px] rounded-[24px] overflow-hidden border-2 border-[#D49313]/70 shadow-[0_20px_50px_rgba(89,49,2,0.15)]">
              <img
                src="/about2.webp"
                alt="Certified Quality ShudhVeda Honey"
                className="w-full h-auto block rounded-[22px]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}