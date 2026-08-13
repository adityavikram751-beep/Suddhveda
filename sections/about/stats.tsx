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
    <section className="bg-[#FAF6F0] border-t border-b border-[#EADCC9]/80">
      <div className="max-w-[1300px] mx-auto px-6 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8 lg:gap-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex flex-col lg:flex-row items-center lg:items-center text-center lg:text-left gap-4 lg:gap-4 px-2 group cursor-pointer"
              >
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-full border-2 border-[#D49313] bg-white flex items-center justify-center text-[#D49313] group-hover:bg-[#D49313] group-hover:text-white transition-all shrink-0 shadow-xs">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="flex flex-col items-center lg:items-start">
                  <h3 className="font-serif font-extrabold text-[26px] sm:text-[28px] leading-none text-[#593102] group-hover:text-[#D49313] transition-colors">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-[12px] font-extrabold tracking-[0.12em] uppercase text-[#6E5D4F] whitespace-nowrap">
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