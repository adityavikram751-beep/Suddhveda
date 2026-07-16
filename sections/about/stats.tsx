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
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between gap-y-8 py-10">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 px-5 lg:px-3"
              >
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-full border-[1.5px] border-[#D49313] flex items-center justify-center text-[#D49313] shrink-0">
                  <Icon size={22} strokeWidth={1.6} />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-serif text-[24px] leading-none text-[#2D3A1B]">
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