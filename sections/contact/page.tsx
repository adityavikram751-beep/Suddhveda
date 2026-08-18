"use client";

import Image from "next/image";
import { HandHeart, ShieldCheck } from "lucide-react";

// Custom headset-support icon
const HeadsetIcon = ({ size = 28, strokeWidth = 1.8, className = "" }) => (
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
          Quick &amp; Friendly
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] border-b border-[#EADCC9]/50">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#D49313]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 relative z-10">
        <div className="grid min-h-[720px] items-center lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="relative z-10 max-w-[610px] py-16 lg:py-0">

            {/* Subtitle Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-4">
              <span>GET IN TOUCH</span>
            </div>

            {/* Heading */}
            <h1 className="mt-2 font-serif text-[#593102] leading-[1.08] text-[38px] sm:text-[50px] lg:text-[72px] font-extrabold tracking-tight">
              Let&apos;s Start a{" "}
              <span className="italic bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
                Sweet
              </span>
              <br />
              Conversation.
            </h1>

            {/* Description */}
            <p className="mt-5 lg:mt-7 max-w-[520px] text-[16px] lg:text-[18px] leading-[1.75] text-[#6E5D4F] font-medium">
              We&apos;re here to answer your questions, support your journey
              towards natural living, and help you experience the goodness of
              pure honey.
            </p>

            {/* Feature Cards Grid */}
            <div className="mt-8 lg:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[640px]">
              {cards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group flex flex-row lg:flex-col items-center lg:items-center justify-start lg:justify-center p-4 lg:p-4 h-auto lg:h-[160px] rounded-2xl border border-[#EADCC9] bg-white/90 backdrop-blur-sm gap-4 lg:gap-2.5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#D49313] cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#FAF0DC] border border-[#D49313]/30 flex items-center justify-center text-[#D49313] group-hover:bg-gradient-to-r group-hover:from-[#D49313] group-hover:to-[#593102] group-hover:text-white transition-all shrink-0 shadow-2xs">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    <p className="text-left lg:text-center text-[13.5px] lg:text-[14px] leading-[1.4] font-serif font-bold text-[#593102] group-hover:text-[#D49313] transition-colors">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex items-center justify-end h-[400px] sm:h-[500px] lg:h-[720px] -mt-2 lg:mt-0">

            <div
              className="absolute right-[-100px] sm:right-[-140px] top-1/2 -translate-y-1/2
              w-[400px] sm:w-[600px] lg:w-[780px] h-[400px] sm:h-[600px] lg:h-[780px]
              rounded-full
              bg-[radial-gradient(circle,rgba(212,147,19,0.18)_0%,rgba(255,255,255,0)_70%)]"
            />

            <Image
              src="/hero.png"
              alt="ShuddhaVeda Natural Honey Jar"
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