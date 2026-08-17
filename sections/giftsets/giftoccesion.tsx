"use client";

import Image from "next/image";
import { Sparkles, Gift } from "lucide-react";

const occasions = [
  {
    id: 1,
    image: "/occesion.png",
    label: "BIRTHDAY",
    subtitle: "Sweet Celebrations",
    highlight: true,
  },
  {
    id: 2,
    image: "/occession1.png",
    label: "WEDDING",
    subtitle: "Royal Favors",
  },
  {
    id: 3,
    image: "/occession4.png",
    label: "ANNIVERSARY",
    subtitle: "Eternal Bonds",
  },
  {
    id: 4,
    image: "/occession3.png",
    label: "FESTIVE",
    subtitle: "Joy & Traditions",
  },
  {
    id: 5,
    image: "/occession5.png",
    label: "CORPORATE",
    subtitle: "Luxury Gifting",
  },
  {
    id: 6,
    image: "/occession6.png",
    label: "JUST BECAUSE",
    subtitle: "Pure Happiness",
  },
];

export default function GiftsForEveryOccasion() {
  return (
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] py-16 sm:py-24 border-b border-[#EADCC9]/50 overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D49313]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-wider mb-4 shadow-2xs">
            <Sparkles size={14} className="text-[#D49313]" />
            <span>CELEBRATE IN STYLE</span>
          </div>

          <h2 className="font-serif text-[34px] sm:text-[44px] md:text-[50px] font-extrabold text-[#593102] leading-tight tracking-tight">
            Gifts for{" "}
            <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
              Every Occasion
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto mt-4 rounded-full" />

          <p className="text-[#6E5D4F] text-[14px] sm:text-[16px] mt-4 font-medium leading-relaxed">
            Whether it&apos;s a grand celebration or a quiet gesture of love, explore our curated honey sets for every milestone.
          </p>
        </div>

        {/* Occasions Row */}
        <div className="mt-14 sm:mt-18 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
          {occasions.map((occasion) => (
            <a
              key={occasion.id}
              href="#curated-gift-boxes"
              className="flex flex-col items-center group cursor-pointer text-center w-full max-w-[180px]"
            >
              {/* Circle Image Wrapper with Luxury Ring */}
              <div
                className={`
                  relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[150px] md:h-[150px]
                  rounded-full overflow-hidden transition-all duration-500
                  border-4 border-white ring-2 ring-[#D49313]/40 group-hover:ring-[#D49313]
                  shadow-md group-hover:shadow-2xl group-hover:-translate-y-2
                  ${occasion.highlight ? "ring-4 ring-[#D49313] shadow-lg" : ""}
                `}
              >
                <Image
                  src={occasion.image}
                  alt={occasion.label}
                  fill
                  sizes="(max-width: 768px) 150px, 200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                  <Gift size={20} className="text-white drop-shadow-md" />
                </div>
              </div>

              {/* Label */}
              <p className="mt-4 text-[13px] sm:text-[14px] font-extrabold tracking-[0.14em] text-[#593102] group-hover:text-[#D49313] transition-colors uppercase font-serif">
                {occasion.label}
              </p>
              
              <span className="text-[11px] font-medium text-[#8D7F73] mt-0.5 group-hover:text-[#593102] transition-colors">
                {occasion.subtitle}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}