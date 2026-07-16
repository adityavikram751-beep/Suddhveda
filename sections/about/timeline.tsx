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
      <div className="max-w-[1350px] mx-auto px-6 lg:px-10">
        {/* ===== HEADER ===== */}
        <div className="text-center max-w-[720px] mx-auto">
          <span className="text-[#D49313] text-[13px] font-semibold tracking-[0.15em] uppercase">
            OUR STORY
          </span>
          <h2 className="mt-4 text-[30px] sm:text-[36px] md:text-[38px] font-serif text-[#2D3A1B] leading-tight">
            From a Simple Idea to a Promise of Purity
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.7] text-[#6B7280] max-w-[640px] mx-auto">
            What started as a deep love for nature and bees has grown into a
            mission to bring you the purest, most authentic honey—straight
            from the hive to your home.
          </p>
        </div>
        <div className="mt-14 overflow-x-auto">
  <div className="relative flex flex-nowrap justify-between min-w-[900px] lg:min-w-0">

    {/* Single Continuous Dashed Line */}
    <div className="absolute top-8 left-32 right-32 border-t-2 border-dashed border-[#D49313]" />

    {timeline.map((item) => {
      const Icon = item.icon;

      return (
        <div
          key={item.title}
          className="relative z-10 flex-1 flex flex-col items-center text-center"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-full border-2 border-[#D49313] bg-white flex items-center justify-center text-[#D49313]">
            <Icon size={22} strokeWidth={1.6} />
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
      </div>
    </section>
  );
}