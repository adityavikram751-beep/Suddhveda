"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function ImpactSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF4E8] py-8 lg:py-14 border-t border-b border-[#EADCC9]/50">
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
      <div className="relative z-10 w-full max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-12 py-2 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: impactimage.png Overlay Graphic */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start items-center">
            <div className="relative w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[500px] lg:max-w-[580px] xl:max-w-[640px] transform hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/impactimage.png"
                alt="Six Distinct Honey Flavours - Shuddh Veda"
                width={1471}
                height={1069}
                priority
                className="w-full h-auto object-contain drop-shadow-sm"
              />
            </div>
          </div>

          {/* Right Column: Clean Transparent Text Overlay (No Card Box / No Border) */}
          <div className="lg:col-span-6 lg:pl-6 xl:pl-14 flex flex-col items-center sm:items-start text-center sm:text-left bg-transparent p-0 border-none shadow-none">
            
            {/* Tag / Pill */}
            <div className="inline-flex items-center px-5 py-1.5 rounded-full border border-[#C69658] bg-transparent text-[#A4753B] text-[11px] sm:text-[12px] font-bold tracking-[0.22em] uppercase">
              ONE NATURE
            </div>

            {/* Main Title - Playfair Display Serif */}
            <h2 className="mt-4 sm:mt-5 text-[34px] sm:text-[48px] md:text-[56px] lg:text-[62px] xl:text-[68px] leading-[1.0] sm:leading-[0.98] tracking-tight font-bold">
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
            <div className="w-[65px] sm:w-[75px] h-[3px] bg-gradient-to-r from-[#C69658] via-[#C84417] to-transparent my-4 sm:my-5 rounded-full" />

            {/* Description Paragraph */}
            <p className="text-[#65564A] text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-[1.65] font-medium max-w-[460px]">
              From the bold character of Mustard to the delicate floral sweetness of Lychee, every flower gives honey its own unique taste, aroma and personality.
            </p>

            {/* CTA Button */}
            <div className="mt-6 sm:mt-7 w-full sm:w-auto flex justify-center sm:justify-start">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#FA4B1B] hover:bg-[#E64216] text-white text-[11px] sm:text-[12px] md:text-[13px] font-bold tracking-[0.16em] uppercase px-8 sm:px-9 h-[46px] sm:h-[50px] rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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





