"use client";

import Image from "next/image";

const steps = [
  {
    title: "Nectar Collection",
    desc: "Bees collect nectar from wildflowers and blossoms.",
    icon: "/process-nectar.png",
  },
  {
    title: "Ethical Beekeeping",
    desc: "We follow ethical practices that protect bees and habitat.",
    icon: "/process-beekeeping.png",
  },
  {
    title: "Gentle Extraction",
    desc: "Honey is extracted with care to preserve natural goodness.",
    icon: "/process-extraction.png",
  },
  {
    title: "Lab Tested",
    desc: "Every batch is lab tested for purity, quality, and safety.",
    icon: "/process-labtested.png",
  },
  {
    title: "Secure Packaging",
    desc: "Packed in eco-friendly glass jars to lock in freshness.",
    icon: "/process-packaging.png",
  },
  {
    title: "Delivered with Love",
    desc: "From our hive to your home—with love and responsibility.",
    icon: "/process-delivered.png",
  },
];

export default function BeekeepingProcess() {
  return (
    <section className="bg-white border-t border-[#F2E6D3] relative overflow-hidden mt-10 lg:mt-14">
      <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-10 pt-20 lg:pt-24 pb-16 lg:pb-20">
        {/* Heading */}
        <div className="text-center max-w-[700px] mx-auto">
          <span className="text-[#D49313] text-[13px] font-semibold tracking-[0.15em] uppercase">
            Our Beekeeping Process
          </span>
          <h2 className="mt-3 text-[30px] sm:text-[36px] md:text-[38px] font-serif text-[#2D3A1B] leading-tight inline-flex items-center justify-center gap-2 flex-wrap">
            Crafted with Care, From Hive to Home
            <Image
              src="/MOVE TO VISIT.png"
              alt=""
              width={40}
              height={40}
              className="inline-block object-contain relative -top-0.5"
            />
          </h2>
        </div>

        {/* Steps row — single continuous dashed line */}
        <div className="mt-14 overflow-x-auto">
          <div className="relative min-w-[820px] lg:min-w-0">
            {/* ONE continuous dashed line running behind all icons */}
            <div className="absolute top-9 left-[8.33%] right-[8.33%] border-t border-dashed border-[#D49313] -translate-y-1/2 pointer-events-none" />

            <div className="grid grid-cols-6 gap-4 lg:gap-6">
              {steps.map((step) => (
                <div key={step.title} className="flex flex-col items-center text-center">
                  {/* Icon circle — sits on top of the line */}
                  <div className="relative z-10 w-[72px] h-[72px] rounded-full border border-[#D49313] bg-[#FDF3E4] flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>

                  <h3 className="mt-4 font-semibold text-[13px] tracking-wide text-[#2D3A1B] uppercase">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-[1.5] text-[#8D7F73]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}