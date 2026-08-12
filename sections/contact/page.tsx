"use client";

import Image from "next/image";
import { HandHeart, ShieldCheck } from "lucide-react";

// Custom headset-support icon (exact match to design)
const HeadsetIcon = ({ size = 32, strokeWidth = 1.6, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 13a9 9 0 0 1 18 0" />
    <path d="M3 13v3a2 2 0 0 0 2 2h1v-6H4a1 1 0 0 0-1 1z" />
    <path d="M21 13v3a2 2 0 0 1-2 2h-1v-6h2a1 1 0 0 1 1 1z" />
    <circle cx="12" cy="14.5" r="2.5" />
    <path d="M10.5 13.2c.4-.5 1.1-.5 1.5 0" />
    <circle cx="11" cy="14.3" r="0.3" fill="currentColor" />
    <circle cx="13" cy="14.3" r="0.3" fill="currentColor" />
  </svg>
);

export default function Hero() {
  const cards = [
    {
      icon: HeadsetIcon,
      title: (
        <>
          We&apos;re Here To
          <br />
          Help
        </>
      ),
    },
    {
      icon: HandHeart,
      title: (
        <>
          Quick & Friendly
          <br />
          Support
        </>
      ),
    },
    {
      icon: ShieldCheck,
      title: (
        <>
          Your Satisfaction
          <br />
          Matters
        </>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAF6F0]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid min-h-[760px] items-center lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="relative z-10 max-w-[610px] py-16 lg:py-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 uppercase tracking-[0.28em] text-[#D49313] text-[14px] font-medium">
              <span>Get In Touch</span>
              <span className="text-[12px]">🍃</span>
            </div>

            {/* Heading */}
            <h1 className="mt-8 lg:mt-12 font-serif text-[#3A2C24] leading-[1.05] text-[36px] sm:text-[48px] lg:text-[76px] tracking-[-0.03em]">
              Let&apos;s Start a{" "}
              <span className="italic text-[#593102]">
                Sweet
              </span>
              <br />
              Conversation.
            </h1>

            {/* Description */}
            <p className="mt-6 lg:mt-8 max-w-[520px] text-[16px] lg:text-[18px] leading-[1.8] text-[#6E6258]">
              We&apos;re here to answer your questions, support your journey
              towards natural living, and help you experience the goodness of
              pure honey.
            </p>

            {/* Cards 
                - Mobile: Stacked vertical layout (1 column)
                - Desktop (lg): Exact original 3 columns grid 
            */}
            <div className="mt-8 lg:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[640px]">

              {cards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group flex flex-row lg:flex-col items-center lg:items-center justify-start lg:justify-center p-4 lg:p-3 h-auto lg:h-[160px] rounded-[18px] border border-[#E8DED3] bg-white gap-4 lg:gap-0 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                  >
                    <div className="w-12 h-12 lg:w-auto lg:h-auto rounded-xl lg:rounded-none bg-[#FDF3E4] lg:bg-transparent flex items-center justify-center text-[#D49313] lg:mb-2 shrink-0">
                      <Icon size={28} strokeWidth={1.6} />
                    </div>

                    <p className="text-left lg:text-center text-[13px] lg:text-[14px] leading-[18px] font-semibold text-[#453B34]">
                      {item.title}
                    </p>
                  </div>
                );
              })}

            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex items-center justify-end h-[400px] sm:h-[500px] lg:h-[760px] -mt-2 lg:mt-0">

            <div
              className="absolute right-[-100px] sm:right-[-140px] top-1/2 -translate-y-1/2
              w-[400px] sm:w-[600px] lg:w-[780px] h-[400px] sm:h-[600px] lg:h-[780px]
              rounded-full
              bg-[radial-gradient(circle,rgba(255,214,120,0.35)_0%,rgba(255,255,255,0)_70%)]"
            />

            <Image
              src="/hero.png"
              alt="ShudhVeda Natural Honey Jar"
              width={1800}
              height={1800}
              priority
              className="
                relative lg:absolute
                top-0 lg:top-43
                right-0 lg:right-32
                w-full lg:w-[90%]
                max-w-full lg:max-w-none
                h-full
                object-contain
                object-center lg:object-right-top
                -translate-y-6 sm:-translate-y-8 lg:translate-y-0
                translate-x-0 lg:translate-x-22
                scale-100 lg:scale-[1.2]
              "
            />

          </div>

        </div>
      </div>
    </section>
  );
}