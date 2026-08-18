"use client";

import Image from "next/image";

const timeline = [
  {
    year: "2018",
    title: "The Beginning",
    desc: "Our journey began with a passion for bees and a desire to create something pure.",
    image: "/bigin 2.png",
  },
  {
    year: "2019",
    title: "The Discovery",
    desc: "We discovered the magic of raw, unprocessed honey and its incredible benefits.",
    image: "/discovered.png",
  },
  {
    year: "2020",
    title: "The Commitment",
    desc: "We built relationships with ethical beekeepers who share our values and vision.",
    image: "/commit.png",
  },
  {
    year: "NOW & ALWAYS",
    title: "The Promise",
    desc: "Today, we deliver nature's purest honey to thousands of homes, continuing our journey.",
    image: "/trusted.png",
  },
];

export default function Timeline() {
  return (
    <section className="bg-[#FAF6F0] py-16 lg:py-24 border-b border-[#EADCC9]/50">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* ===== HEADER ===== */}
        <div className="text-center max-w-[760px] mx-auto">
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
        <div className="mt-16 relative">

          {/* Desktop Horizontal Dashed Line */}
          <div className="hidden lg:block absolute top-[2.1rem] left-[10%] right-[10%] border-t border-dashed border-[#D49313]/70 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
            {timeline.map((item) => (
              <div
                key={item.title}
                className="relative z-10 flex flex-col items-center text-center px-2 sm:px-4 group cursor-pointer"
              >
                {/* Icon Wrapper with Mobile Right Dashed Line */}
                <div className="relative flex items-center justify-center">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border border-[#D49313]/70 bg-white flex items-center justify-center shadow-2xs transition-all duration-300 z-10 overflow-hidden relative group-hover:border-[#D49313] group-hover:scale-105 p-3.5 sm:p-4">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-3.5 sm:p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Mobile Right-Side Dashed Line */}
                  <div className="lg:hidden absolute left-full w-12 sm:w-20 border-t border-dashed border-[#D49313]/70 ml-1" />
                </div>

                {/* Content */}
                <h3 className="mt-5 font-serif text-[19px] sm:text-[21px] font-extrabold text-[#593102] group-hover:text-[#D49313] transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-[13.5px] sm:text-[14.5px] leading-[1.65] text-[#7A6A5C] font-medium max-w-[280px]">
                  {item.desc}
                </p>

                <span className="mt-4 text-[#D49313] font-black text-[13px] tracking-wider uppercase">
                  {item.year}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}