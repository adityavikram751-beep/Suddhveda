"use client";

import { Smile, ShoppingBag, Zap, RotateCw, Heart } from "lucide-react";

const stats = [
  {
    icon: Smile,
    value: "20,000+",
    label: "Happy Customers",
  },
  {
    icon: ShoppingBag,
    value: "1,250+",
    label: "Bee Colonies",
  },
  {
    icon: Zap,
    value: "7M+",
    label: "Bees Protected",
  },
  {
    icon: RotateCw,
    value: "99.9%",
    label: "Pure & Natural Honey",
  },
  {
    icon: Heart,
    value: "100%",
    label: "Love & Trust",
  },
];

export default function Stats() {
  return (
    <section className="bg-[#FAF6F0] border-t border-b border-[#3F2B1D]">
      <div className="max-w-[1300px] mx-auto px-6 py-12 lg:py-12">
        {/* 
          Mobile / Tablet (default): Flex column centered (ek ke niche ek)
          Desktop (lg): Flex row spreading evenly across space 
        */}
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-10 lg:gap-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex flex-col lg:flex-row items-center lg:items-center text-center lg:text-left gap-4 lg:gap-4 px-2"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-full border-[1.5px] border-[#D49313] flex items-center justify-center text-[#D49313] shrink-0">
                  <Icon size={24} strokeWidth={1.6} />
                </div>

                {/* Text */}
                <div className="flex flex-col items-center lg:items-start">
                  <h3 className="font-serif text-[24px] sm:text-[24px] leading-none text-[#593102]">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-[12px] tracking-[0.08em] uppercase text-[#8E8277] whitespace-nowrap">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}