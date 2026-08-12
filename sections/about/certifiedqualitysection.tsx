"use client";

import Image from "next/image";

const features = [
  {
    icon: "/icon-raw.png",
    title: "100% RAW",
  },
  {
    icon: "/icon-gmo-free.png",
    title: "GMO FREE",
  },
  {
    icon: "/icon-bpa-free.png",
    title: "BPA FREE",
  },
  {
    icon: "/icon-fssai.png",
    title: "FSSAI CERTIFIED",
  },
  {
    icon: "/icon-lab-tested.png",
    title: "LAB TESTED",
  },
  {
    icon: "/icon-no-sugar.png",
    title: "NO ADDED SUGAR",
  },
];

export default function CertifiedQualitySection() {
  return (
    <section className="bg-[#FDF8F1] py-16 lg:py-24">
      <div className="max-w-[1350px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT */}
          <div>
            <div className="mb-10 lg:mb-12 w-full text-center">
              <span className="text-[#593102] uppercase tracking-[2px] lg:tracking-[3px] text-[12px] lg:text-[13px] font-semibold">
                Certified Purity. Trusted Quality.
              </span>
            </div>
            {/* Feature Grid (3 columns on both mobile and desktop) */}
            <div className="grid grid-cols-3 gap-x-4 sm:gap-x-8 lg:gap-x-10 gap-y-8 lg:gap-y-10">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-[48px] h-[48px] lg:w-[52px] lg:h-[52px] rounded-full border border-[#593102] bg-[#FDF3E4] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:bg-[#593102]">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  {/* Title */}
                  <h4 className="mt-3 lg:mt-4 text-[11px] sm:text-[12px] lg:text-[13px] font-semibold text-[#34251C] tracking-wide leading-tight">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[580px] h-[300px] sm:h-[360px] lg:h-[380px] rounded-2xl lg:rounded-none overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.05)]">
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