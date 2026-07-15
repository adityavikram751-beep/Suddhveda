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
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* ===== HEADER ===== */}
        <div className="text-center max-w-[720px] mx-auto">
          <span className="text-[#D49313] text-[13px] font-semibold tracking-[0.15em] uppercase">
            OUR STORY
          </span>
          <h2 className="mt-3 text-[30px] sm:text-[36px] md:text-[42px] font-serif text-[#2D3A1B] leading-tight">
            From a Simple Idea to a Promise of Purity
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.7] text-[#6B7280] max-w-[640px] mx-auto">
            What started as a deep love for nature and bees has grown into a
            mission to bring you the purest, most authentic honey—straight
            from the hive to your home.
          </p>
        </div>

        {/* ===== TIMELINE CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mt-14">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === timeline.length - 1;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center relative"
              >
                {/* Icon with dashed connector */}
                <div className="relative flex items-center justify-center w-full">
                  {/* Dashed line - left side (except first) */}
                  {index > 0 && (
                    <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#D49313]/40 hidden lg:block" />
                  )}
                  
                  {/* Icon Circle */}
                  <div className="relative z-10 w-16 h-16 rounded-full border-2 border-[#D49313] flex items-center justify-center text-[#D49313] bg-white shrink-0">
                    <Icon size={22} strokeWidth={1.6} />
                  </div>

                  {/* Dashed line - right side (except last) */}
                  {!isLast && (
                    <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#D49313]/40 hidden lg:block" />
                  )}
                </div>

                {/* Content */}
                <h3 className="mt-5 font-serif text-[20px] font-bold text-[#2D3A1B]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#6B7280] max-w-[220px]">
                  {item.desc}
                </p>
                <span className="mt-3 text-[#D49313] font-bold text-[14px] tracking-wide uppercase">
                  {item.year}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}