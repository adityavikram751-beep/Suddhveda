"use client";

import Image from "next/image";
import {
  Check,
  Zap,
  Package,
  BadgeCheck,
  Activity,
  X,
} from "lucide-react";

const features = [
  {
    icon: <Check size={24} />,
    title: "100% RAW",
  },
  {
    icon: <Zap size={24} />,
    title: "GMO FREE",
  },
  {
    icon: <Package size={24} />,
    title: "BPA FREE",
  },
  {
    icon: <BadgeCheck size={24} />,
    title: "FSSAI CERTIFIED",
  },
  {
    icon: <Activity size={24} />,
    title: "LAB TESTED",
  },
  {
    icon: <X size={24} />,
    title: "NO ADDED SUGAR",
  },
];

export default function CertifiedQualitySection() {
  return (
    <section className="bg-[#FDF8F1] py-24">
      <div className="max-w-[1350px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT */}
          <div>
            <div className="text-center mb-12">
              <span className="text-[#D89A1B] uppercase tracking-[4px] text-[15px] font-semibold">
                Certified Purity. Trusted Quality.
              </span>
            </div>
            {/* Feature Grid */}
            <div className="grid grid-cols-3 gap-x-12 gap-y-12 mt-14">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-[48px] h-[48px] rounded-full border border-[#E7C890] bg-white flex items-center justify-center text-[#D89A1B] shadow-sm transition-all duration-300 group-hover:bg-[#D89A1B] group-hover:text-white group-hover:scale-110">
                    {item.icon}
                  </div>
                  {/* Title — added whitespace-nowrap */}
                  <h4 className="mt-5 text-[18px] font-Poppins text-[#34251C] tracking-wide whitespace-nowrap">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px] h-[320px] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.05)]">
              <Image
                src="/hero.png"
                alt="Certified Quality"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}