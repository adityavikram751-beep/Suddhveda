"use client";

import { Circle, Search, Heart, Building2 } from "lucide-react";

const timeline = [
  {
    year: "2018",
    title: "The Beginning",
    desc: "Our journey began with a passion for bees and a desire to create something pure.",
    icon: Circle,
  },
  {
    year: "2019",
    title: "The Discovery",
    desc: "We discovered the magic of raw, unprocessed honey and its incredible benefits.",
    icon: Search,
  },
  {
    year: "2020",
    title: "The Commitment",
    desc: "We built relationships with ethical beekeepers who share our values and vision.",
    icon: Heart,
  },
  {
    year: "NOW & ALWAYS",
    title: "The Promise",
    desc: "Today, we deliver nature's purest honey to thousands of homes, continuing our journey.",
    icon: Building2,
  },
];

export default function Timeline() {
  return (
    <section className="bg-white py-16 lg:py-20 border-b border-[#EADCC9]/50">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-10">
        {/* ===== HEADER ===== */}
        <div className="text-center max-w-[720px] mx-auto">
          <span className="text-[#D49313] text-[13px] font-extrabold tracking-[0.18em] uppercase">
            OUR STORY
          </span>
          <h2 className="mt-3 text-[32px] sm:text-[38px] md:text-[44px] font-serif font-extrabold text-[#593102] leading-tight">
            From a Simple Idea to a{" "}
            <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
              Promise of Purity
            </span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.7] text-[#6E5D4F] font-medium max-w-[640px] mx-auto">
            What started as a deep love for nature and bees has grown into a
            mission to bring you the purest, most authentic honey—straight
            from the hive to your home.
          </p>
        </div>

        {/* ===== TIMELINE CONTAINER ===== */}
        <div className="mt-14 relative">
          
          {/* Desktop Horizontal Dashed Line */}
          <div className="hidden lg:block absolute top-8 left-32 right-32 border-t-2 border-dashed border-[#D49313]/60 z-0" />

          <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-0">
            {timeline.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="relative z-10 flex-1 flex flex-col items-center lg:items-center text-center px-4 group"
                >
                  {/* Icon Wrapper with Mobile Right Dashed Line */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-[#D49313] bg-white flex items-center justify-center text-[#D49313] group-hover:text-[#593102] group-hover:border-[#593102] shadow-sm transition-all duration-300 z-10">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>

                    {/* Mobile Right-Side Dashed Line */}
                    <div className="lg:hidden absolute left-full w-12 sm:w-20 border-t-2 border-dashed border-[#D49313]/60 ml-1" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-5 font-serif text-[20px] sm:text-[21px] font-bold text-[#593102] group-hover:text-[#D49313] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[14px] leading-[1.65] text-[#6E5D4F] font-medium max-w-[240px]">
                    {item.desc}
                  </p>

                  <span className="mt-3 text-[#D49313] font-black text-[13px] tracking-wider uppercase">
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}