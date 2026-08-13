"use client";

import Image from "next/image";
import { Sparkles, ShieldCheck, Award } from "lucide-react";

const features = [
  {
    icon: "/icon-raw.png",
    title: "100% RAW",
    subtitle: "Cold Extracted",
  },
  {
    icon: "/icon-gmo-free.png",
    title: "GMO FREE",
    subtitle: "Natural Flora",
  },
  {
    icon: "/icon-bpa-free.png",
    title: "BPA FREE",
    subtitle: "Glass Jar Packed",
  },
  {
    icon: "/icon-fssai.png",
    title: "FSSAI APPROVED",
    subtitle: "Safety Certified",
  },
  {
    icon: "/icon-lab-tested.png",
    title: "LAB TESTED",
    subtitle: "Multi-Parameter",
  },
  {
    icon: "/icon-no-sugar.png",
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
              <Sparkles size={14} className="text-[#D49313]" />
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
            <div className="grid grid-cols-3 gap-3.5 sm:gap-5">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-2 border-[#EADCC9]/80 rounded-[22px] p-4 sm:p-5 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:border-[#D49313] hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                >
                  {/* Top Hover Line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D49313] to-[#593102] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon Container */}
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF0DC] border border-[#D49313]/40 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-108 shadow-2xs p-2.5 mb-2.5">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h4 className="text-[11.5px] sm:text-[13px] font-extrabold text-[#593102] group-hover:text-[#D49313] transition-colors tracking-wide uppercase font-serif leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-bold text-[#8D7F73] mt-0.5">
                    {item.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SHOWCASE PHOTO */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end w-full h-full">
            <div className="relative w-full max-w-[540px] h-[360px] sm:h-[450px] lg:h-full min-h-[480px] lg:min-h-[540px] rounded-[32px] overflow-hidden border-4 border-white ring-1 ring-[#D49313]/30 shadow-2xl group cursor-pointer">
              <Image
                src="/hero.png"
                alt="Certified Quality ShudhVeda Honey"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D49313]/30 shadow-md flex items-center gap-1.5 text-[11px] font-black text-[#593102] uppercase tracking-wider">
                <ShieldCheck size={14} className="text-[#D49313]" />
                <span>100% Tested &amp; Verified</span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md border border-[#EADCC9] p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#D49313]">
                  <Award size={15} />
                  <span>FSSAI &amp; Lab Approved</span>
                </div>
                <p className="mt-1 font-serif text-[15px] sm:text-[16px] font-bold leading-snug text-[#593102]">
                  Every jar undergoes strict multi-parameter purity tests.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}