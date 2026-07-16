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
    <section className="bg-[#FDF8F1] py-24">
      <div className="max-w-[1350px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT */}
          <div>
            <div className="mb-12 w-full text-center">
              <span className="text-[#D89A1B] uppercase tracking-[3px] text-[13px] font-semibold">
                Certified Purity. Trusted Quality.
              </span>
            </div>
            {/* Feature Grid */}
            <div className="grid grid-cols-3 gap-x-10 gap-y-10">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-[52px] h-[52px] rounded-full border border-[#D89A1B] bg-[#FDF3E4] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:bg-[#D89A1B]">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  </div>
                  {/* Title */}
                  <h4 className="mt-4 text-[13px] font-semibold text-[#34251C] tracking-wide whitespace-nowrap">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[580px] h-[380px] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.05)]">
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