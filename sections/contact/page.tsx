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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9]">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 right-10 w-72 h-72 sm:w-96 sm:h-96 bg-[#D49313]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="grid min-h-0 lg:min-h-[540px] xl:min-h-[660px] items-center lg:grid-cols-2 gap-6 lg:gap-6 xl:gap-0">

          {/* LEFT CONTENT */}
          <div className="relative z-10 w-full max-w-full md:max-w-[680px] lg:max-w-[480px] xl:max-w-[610px] mx-auto lg:mx-0 pt-6 pb-2 sm:pt-8 sm:pb-4 lg:py-0 lg:mt-1 flex flex-col items-center sm:items-center lg:items-start text-center sm:text-center lg:text-left">

            {/* Subtitle Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-3 sm:mb-4 self-center sm:self-center lg:self-start">
              <span>GET IN TOUCH</span>
            </div>

            {/* Heading - Balanced & Responsive */}
            <h1 className="mt-1 sm:mt-2 font-serif text-[#593102] leading-[1.15] text-[28px] xs:text-[32px] sm:text-[44px] md:text-[48px] lg:text-[42px] xl:text-[62px] font-extrabold tracking-tight">
              Let&apos;s Start a{" "}
              <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent block sm:inline">
                Sweet Conversation.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-3 sm:mt-4 lg:mt-5 xl:mt-7 max-w-[440px] sm:max-w-[540px] lg:max-w-[440px] xl:max-w-[520px] text-[14px] sm:text-[16px] lg:text-[15.5px] xl:text-[18px] leading-[1.65] xl:leading-[1.75] text-[#6E5D4F] font-medium">
              We&apos;re here to answer your questions, support your journey
              towards natural living, and help you experience the goodness of
              pure honey.
            </p>

            {/* IMAGE ON MOBILE & TABLET ONLY (Directly below description text) */}
            <div className="block lg:hidden relative my-6 sm:my-8 w-full max-w-[320px] sm:max-w-[440px] md:max-w-[480px]">
              <div
                className="absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2
                w-[260px] sm:w-[400px] md:w-[450px] h-[260px] sm:h-[400px] md:h-[450px]
                rounded-full
                bg-[radial-gradient(circle,rgba(212,147,19,0.18)_0%,rgba(255,255,255,0)_70%)]"
              />
              <Image
                src="/contact.o.png"
                alt="ShuddhaVeda Natural Honey Jar"
                width={1800}
                height={1800}
                priority
                className="
                  relative
                  w-full max-w-[280px] sm:max-w-[380px] md:max-w-[420px]
                  h-auto
                  object-contain
                  mx-auto
                "
              />
            </div>

            {/* Feature Cards Grid */}
            <div className="mt-2 lg:mt-6 xl:mt-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-3 xl:gap-4 w-full max-w-full lg:max-w-[640px]">
              {cards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="flex flex-row sm:flex-col items-center sm:items-center justify-start sm:justify-center p-3.5 sm:p-3 xl:p-4 h-auto sm:h-[135px] md:h-[145px] lg:h-[150px] xl:h-[160px] rounded-2xl border border-[#EADCC9] bg-white/90 backdrop-blur-sm gap-3.5 sm:gap-2 lg:gap-2.5 shadow-xs"
                  >
                    <div className="w-10 h-10 sm:w-10 sm:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-xl bg-[#FAF0DC] border border-[#D49313]/30 flex items-center justify-center text-[#D49313] shrink-0 shadow-2xs">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>

                    <p className="text-left sm:text-center text-[13px] sm:text-[12px] lg:text-[13px] xl:text-[14px] leading-[1.35] font-serif font-bold text-[#593102]">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT IMAGE FOR DESKTOP ONLY */}
          <div className="hidden lg:flex relative items-center justify-end h-[480px] xl:h-[660px] mt-1">

            <div
              className="absolute right-[-60px] xl:right-[-140px] top-1/2 -translate-y-1/2
              w-[550px] xl:w-[780px] h-[550px] xl:h-[780px]
              rounded-full
              bg-[radial-gradient(circle,rgba(212,147,19,0.18)_0%,rgba(255,255,255,0)_70%)] pointer-events-none"
            />

            <Image
              src="/contact.o.png"
              alt="ShuddhaVeda Natural Honey Jar"
              width={1800}
              height={1800}
              priority
              className="
                relative
                xl:absolute
                xl:top-36
                xl:right-32
                w-full
                xl:w-[70%]
                max-w-[240px]
                xl:max-w-none
                h-full
                object-contain
                object-right
                xl:object-right-top
                translate-x-0
                xl:translate-x-22
                scale-100
                xl:scale-[1.2]
              "
            />

          </div>

        </div>
      </div>
    </section>
  );
}