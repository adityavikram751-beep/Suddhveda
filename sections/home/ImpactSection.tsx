"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ImpactSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF4E8] py-8 sm:py-10 md:py-12 lg:py-16 border-t border-b border-[#EADCC9]/50">
      {/* Background Canvas Image - public.png */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/public.png"
          alt="Shuddh Veda Honey Background"
          fill
          priority
          className="object-cover object-center w-full h-full"
          sizes="100vw"
        />
      </div>

      {/* Main Grid Content Container */}
      <div className="relative z-10 w-full max-w-[1450px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-2 md:py-3 lg:py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 lg:gap-10 xl:gap-12 items-center">

          {/* Left Column: impactimage.png Overlay Graphic */}
          <div className="md:col-span-6 flex justify-center md:justify-center lg:justify-start items-center">
            <div className="relative w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[480px] md:max-w-[440px] lg:max-w-[580px] xl:max-w-[640px] transform hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/impact6.png"
                alt="Six Distinct Honey Flavours - Shuddh Veda"
                width={1471}
                height={1069}
                priority
                className="w-full h-auto object-contain drop-shadow-sm"
              />
            </div>
          </div>

          {/* Right Column: Clean Transparent Text Overlay */}
          <div className="md:col-span-6 md:pl-2 lg:pl-6 xl:pl-14 flex flex-col items-center md:items-start text-center md:text-left bg-transparent p-0 border-none shadow-none">

            {/* Tag / Pill */}
            <div className="inline-flex items-center px-4 sm:px-5 py-1.5 rounded-full border border-[#C69658] bg-transparent text-[#A4753B] text-[10px] sm:text-[11px] md:text-[11px] lg:text-[12px] font-bold tracking-[0.22em] uppercase">
              ONE NATURE
            </div>

            {/* Main Title - Playfair Display Serif */}
            <h2 className="mt-3.5 sm:mt-4 md:mt-4 lg:mt-5 text-[32px] sm:text-[40px] md:text-[42px] lg:text-[58px] xl:text-[68px] leading-[1.05] md:leading-[1.02] lg:leading-[0.98] tracking-tight font-bold">
              <span
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#2B1E17" }}
                className="block"
              >
                Six Distinct
              </span>
              <span
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#FA4B1B" }}
                className="block"
              >
                Flavours.
              </span>
            </h2>

            {/* Decorative Gold Accent Bar */}
            <div className="w-[60px] sm:w-[70px] md:w-[70px] lg:w-[75px] h-[3px] bg-gradient-to-r from-[#C69658] via-[#C84417] to-transparent my-3.5 sm:my-4 md:my-4 lg:my-5 rounded-full" />

            {/* Description Paragraph */}
            <p className="text-[#65564A] text-[13px] sm:text-[15px] md:text-[15px] lg:text-[17px] xl:text-[18px] leading-[1.65] font-medium max-w-[460px]">
              From the bold character of Mustard to the delicate floral sweetness of Lychee, every flower gives honey its own unique taste, aroma and personality.
            </p>

            {/* CTA Button */}
            <div className="mt-5 sm:mt-6 md:mt-6 lg:mt-7 w-full sm:w-auto flex justify-center md:justify-start">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-[#FA4B1B] hover:bg-[#E64216] text-white text-[11px] sm:text-[12px] md:text-[12px] lg:text-[13px] font-bold tracking-[0.16em] uppercase px-7 sm:px-8 md:px-7 lg:px-9 h-[44px] sm:h-[48px] md:h-[46px] lg:h-[50px] rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>DISCOVER YOUR HONEY</span>
                <ArrowRight size={17} className="stroke-[2.5]" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}





