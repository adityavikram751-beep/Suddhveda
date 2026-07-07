"use client";

import { useState } from "react";
import Image from "next/image";

const features = [
  {
    icon: "/Vector.png",
    title: "Ethically Sourced",
    subtitle: "Supporting local beekeepers",
  },
  {
    icon: "/hugeicons_security-check.png",
    title: "Lab Tested Purity",
    subtitle: "Lab tested for every batch",
  },
  {
    icon: "/f7_leaf-arrow-circlepath.png",
    title: "Sustainable Beekeeping",
    subtitle: "For a better tomorrow",
  },
  {
    icon: "/homeicon1.png",
    title: "Secure Packaging",
    subtitle: "Delivered with care",
  },
];

export default function FeaturesBar() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#FBF8F3] border-t border-[#EEE5DA] border-b border-[#F1DEC7] border-b-[0.5px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                onTouchStart={() => setActiveIndex(index)}
                onTouchEnd={() => setActiveIndex(null)}
                onTouchCancel={() => setActiveIndex(null)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`
                  relative
                  flex
                  items-center
                  px-5
                  sm:px-7
                  lg:px-8
                  py-5
                  sm:py-6
                  lg:py-8
                  min-h-[110px]
                  transition-all
                  duration-300
                  rounded-xl
                  cursor-pointer
                  group
                  ${
                    isActive
                      ? "bg-white -translate-y-1 shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
                      : ""
                  }
                `}
              >
                {/* Divider */}
                {index !== features.length - 1 && (
                  <div
                    className={`
                      hidden
                      lg:block
                      absolute
                      right-0
                      top-1/2
                      -translate-y-1/2
                      h-[72px]
                      w-[2px]
                      transition-colors
                      duration-300
                      ${isActive ? "bg-[#D7C4AC]" : "bg-[#E4DBCF]"}
                    `}
                  />
                )}

                {/* Icon */}
                <div
                  className={`
                    w-[42px]
                    h-[42px]
                    sm:w-[50px]
                    sm:h-[50px]
                    lg:w-[54px]
                    lg:h-[54px]
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    transition-transform
                    duration-300
                    ${isActive ? "scale-110" : ""}
                  `}
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={44}
                    height={44}
                    className={`
                      object-contain
                      transition-transform
                      duration-300
                      ${isActive ? "rotate-3" : ""}
                    `}
                  />
                </div>

                {/* Text */}
                <div className="ml-5 lg:ml-6">
                  <h3
                    className={`
                      text-[16px]
                      lg:text-[18px]
                      font-semibold
                      leading-tight
                      transition-colors
                      duration-300
                      ${isActive ? "text-[#D49313]" : "text-[#6D3C09]"}
                    `}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`
                      mt-2
                      text-[14px]
                      lg:text-[15px]
                      transition-colors
                      duration-300
                      ${isActive ? "text-[#8B6A48]" : "text-[#B69B80]"}
                    `}
                  >
                    {item.subtitle}
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