"use client";

import React from "react";
import Image from "next/image";

export default function HoneyJourneySection() {
  return (
    <section className="pt-8 sm:pt-12 pb-8 sm:pb-12 bg-[#F9F0DF] relative overflow-hidden text-[#593102]">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-[#F9F0DF]/90 border border-[#EADBCA] px-5 sm:px-8 py-1.5 rounded-full shadow-2xs mb-4">
          <div className="relative w-4 h-4 flex-shrink-0">
            <Image
              src="/fluent_calendar-date-20-regular.svg"
              alt="Calendar Icon"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[12.5px] sm:text-[14px] font-medium text-[#593102] tracking-tight">
            Your Year with shuddhveda
          </span>
        </div>

        {/* Main Section Heading */}
        <h2 className="font-playfair font-normal not-italic text-[22px] xs:text-[25px] sm:text-[35px] text-[#593102] tracking-normal uppercase leading-[30px] sm:leading-[40px] text-center max-w-4xl mx-auto">
          A LITTLE NATURE, ALL YEAR LONG
        </h2>

        {/* Subtitle Line 1 */}
        <p className="font-playfair font-normal not-italic text-[16px] xs:text-[18px] sm:text-[24px] text-[#593102] tracking-normal mt-2 sm:mt-3.5 text-center max-w-3xl mx-auto leading-[23px] sm:leading-[28px]">
          Why settle for just one kind of honey when nature has so many flavours to offer?
        </p>

        {/* Subtitle Line 2 */}
        <p className="font-cormorant font-normal not-italic text-[13.5px] xs:text-[14.5px] sm:text-[17px] text-[#593102] tracking-normal max-w-[820px] mx-auto mt-2 sm:mt-2 leading-[19px] sm:leading-[20px] text-center opacity-90 px-2">
          Every flower, every season and every landscape gives honey its own character. With the Shuddh Veda Annual Honey Subscription, we bring six distinctive varieties together in a thoughtfully curated experience.
        </p>

        {/* ==================== DESKTOP MODE (5 Columns Row - lg and up) ==================== */}
        <div className="hidden lg:grid mt-12 grid-cols-5 gap-4 max-w-[1240px] mx-auto text-left items-start">

          {/* Card 1: 6 Jars Of Seasonal Honey */}
          <div className="bg-[#FFEDD0] rounded-[24px] p-4 flex flex-col justify-between h-[172px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-center ml-3">
                <div className="relative w-18 h-18">
                  <Image
                    src="/Group 33950 (1).svg"
                    alt="Honey Jar Icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-cormorant text-[14px] text-[#000000] font-normal tracking-wide -mt-1">
                  honey
                </span>
              </div>

              <div className="flex items-baseline gap-1 self-start pt-0.5 mr-3">
                <span className="font-cormorant italic text-[80px] font-normal text-[#000000] leading-none">
                  6
                </span>
                <span className="font-cormorant text-[18.5px] text-[#000000] font-medium tracking-wide">
                  Jars
                </span>
              </div>
            </div>

            <div className="ml-3">
              <span className="font-cormorant text-[20px] font-normal text-[#000000] leading-tight block">
                Of Seasonal Honey
              </span>
            </div>
          </div>

          {/* Card 2: 4 Months Between Deliveries */}
          <div className="bg-[#FFEDD0] rounded-[24px] p-4 flex flex-col justify-between h-[172px]">
            <div className="flex items-start justify-between">
              <div className="relative w-18 h-18 mt-0.5 ml-3">
                <Image
                  src="/Vector (4).svg"
                  alt="Calendar Icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-baseline gap-1 self-start pt-0.5 mr-3">
                <span className="font-cormorant italic text-[80px] font-normal text-[#000000] leading-none">
                  4
                </span>
                <span className="font-cormorant text-[18.5px] text-[#000000] font-medium tracking-wide">
                  Months
                </span>
              </div>
            </div>

            <div className="ml-3">
              <span className="font-cormorant text-[20px] font-normal text-[#000000] leading-tight block">
                Between Deliveries
              </span>
            </div>
          </div>

          {/* Card 3: 3 Delivery Seasonal Harvest */}
          <div className="bg-[#FFEDD0] rounded-[24px] p-4 flex flex-col justify-between h-[172px]">
            <div className="flex items-start justify-between">
              <div className="relative w-18 h-18 mt-0.5 ml-3">
                <Image
                  src="/griddy-icons_package-delivery-fast (1).svg"
                  alt="Delivery Icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-baseline gap-1 self-start pt-0.5 mr-3">
                <span className="font-cormorant italic text-[80px] font-normal text-[#000000] leading-none">
                  3
                </span>
                <span className="font-cormorant text-[18.5px] text-[#000000] font-medium tracking-wide">
                  Delivery
                </span>
              </div>
            </div>

            <div className="ml-3">
              <span className="font-cormorant text-[20px] font-normal text-[#000000] leading-tight block">
                Seasonal Harvest
              </span>
            </div>
          </div>

          {/* Card 4: 1 pay Annual Payment */}
          <div className="bg-[#FFEDD0] rounded-[24px] p-4 flex flex-col justify-between h-[172px]">
            <div className="flex items-start justify-between">
              <div className="relative w-18 h-18 mt-0.5 ml-3">
                <Image
                  src="/Vector (5).svg"
                  alt="Payment Card Icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-baseline gap-0.5 self-start pt-0.5 mr-3">
                <span className="font-cormorant italic text-[80px] font-normal text-[#000000] leading-none">
                  1
                </span>
                <span className="font-cormorant text-[18.5px] text-[#000000] font-medium tracking-wide">
                  pay
                </span>
              </div>
            </div>

            <div className="ml-3">
              <span className="font-cormorant text-[20px] font-normal text-[#000000] leading-tight block">
                Annual Payment
              </span>
            </div>
          </div>

          {/* Card 5: THE HONEY CLUB INCLUDES */}
          <div className="bg-[#F6DFBE] rounded-[24px] p-4 flex flex-col justify-start min-h-[172px] text-left">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="relative w-7 h-7 flex-shrink-0 mt-0.5">
                <Image
                  src="/Vector (6).svg"
                  alt="Honey Club Motif Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-cormorant text-[19px] font-medium uppercase tracking-[0.04em] text-[#8C4A1B] leading-[1.15]">
                THE HONEY<br />CLUB INCLUDES
              </h3>
            </div>

            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[17.5px] leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  6 distinctive honey varieties
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[17.5px] leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  3 seasonal deliveries
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[17.5px] leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  2 × 500 g jars per delivery
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[17.5px] leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  3 kg of honey per year
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[17.5px] leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  1 simple annual payment
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[17.5px] leading-[23px] tracking-normal text-[#000000]">
                  A new flavour every few<br />months
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* ==================== MOBILE MODE (Exact Centered Compact Cards matching Screenshot) ==================== */}
        <div className="flex lg:hidden flex-col items-center gap-4 mt-6 w-full mx-auto">

          {/* Card 1: 6 Jars Of Seasonal Honey */}
          <div className="bg-[#FFEDD0] rounded-[22px] p-3.5 w-[215px] xs:w-[235px] flex flex-col justify-between h-[135px] shadow-[0_2px_10px_rgba(89,49,2,0.03)]">
            <div className="flex items-center justify-between px-1">
              <div className="flex flex-col items-center">
                <div className="relative w-10 h-10">
                  <Image
                    src="/Group 33950 (1).svg"
                    alt="Honey Jar Icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-cormorant text-[11px] text-[#000000] font-normal -mt-0.5">
                  honey
                </span>
              </div>

              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="font-cormorant italic text-[46px] font-normal text-[#000000] leading-none">
                  6
                </span>
                <span className="font-cormorant text-[13px] text-[#000000] font-normal">
                  Jars
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="font-cormorant text-[17px] font-normal text-[#000000] leading-tight block">
                Of Seasonal Honey
              </span>
            </div>
          </div>

          {/* Card 2: 4 Months Between Deliveries */}
          <div className="bg-[#FFEDD0] rounded-[22px] p-3.5 w-[215px] xs:w-[235px] flex flex-col justify-between h-[135px] shadow-[0_2px_10px_rgba(89,49,2,0.03)]">
            <div className="flex items-center justify-between px-1">
              <div className="relative w-10 h-10">
                <Image
                  src="/Vector (4).svg"
                  alt="Calendar Icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="font-cormorant italic text-[46px] font-normal text-[#000000] leading-none">
                  4
                </span>
                <span className="font-cormorant text-[13px] text-[#000000] font-normal">
                  Months
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="font-cormorant text-[17px] font-normal text-[#000000] leading-tight block">
                Between Deliveries
              </span>
            </div>
          </div>

          {/* Card 3: 3 Delivery Seasonal Harvest */}
          <div className="bg-[#FFEDD0] rounded-[22px] p-3.5 w-[215px] xs:w-[235px] flex flex-col justify-between h-[135px] shadow-[0_2px_10px_rgba(89,49,2,0.03)]">
            <div className="flex items-center justify-between px-1">
              <div className="relative w-10 h-10">
                <Image
                  src="/griddy-icons_package-delivery-fast (1).svg"
                  alt="Delivery Icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="font-cormorant italic text-[46px] font-normal text-[#000000] leading-none">
                  3
                </span>
                <span className="font-cormorant text-[13px] text-[#000000] font-normal">
                  Delivery
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="font-cormorant text-[17px] font-normal text-[#000000] leading-tight block">
                Seasonal Harvest
              </span>
            </div>
          </div>

          {/* Card 4: 1 pay Annual Payment */}
          <div className="bg-[#FFEDD0] rounded-[22px] p-3.5 w-[215px] xs:w-[235px] flex flex-col justify-between h-[135px] shadow-[0_2px_10px_rgba(89,49,2,0.03)]">
            <div className="flex items-center justify-between px-1">
              <div className="relative w-10 h-10">
                <Image
                  src="/Vector (5).svg"
                  alt="Payment Card Icon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-baseline gap-0.5 pt-0.5">
                <span className="font-cormorant italic text-[46px] font-normal text-[#000000] leading-none">
                  1
                </span>
                <span className="font-cormorant text-[13px] text-[#000000] font-normal">
                  pay
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="font-cormorant text-[17px] font-normal text-[#000000] leading-tight block">
                Annual Payment
              </span>
            </div>
          </div>

          {/* Card 5: THE HONEY CLUB INCLUDES */}
          <div className="bg-[#F6DFBE] rounded-[22px] p-4.5 w-[215px] xs:w-[235px] flex flex-col justify-start text-left shadow-[0_8px_24px_rgba(89,49,2,0.1)]">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="relative w-4.5 h-4.5 flex-shrink-0">
                <Image
                  src="/Vector (6).svg"
                  alt="Honey Club Motif Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-cormorant text-[14.5px] font-medium uppercase tracking-[0.03em] text-[#8C4A1B] leading-tight">
                THE HONEY<br />CLUB INCLUDES
              </h3>
            </div>

            <ul className="space-y-1 pl-0.5">
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[6px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[13.5px] leading-snug text-[#000000]">
                  6 distinctive honey varieties
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[6px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[13.5px] leading-snug text-[#000000]">
                  3 seasonal deliveries
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[6px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[13.5px] leading-snug text-[#000000]">
                  2 × 500 g jars per delivery
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[6px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[13.5px] leading-snug text-[#000000]">
                  3 kg of honey per year
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[6px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[13.5px] leading-snug text-[#000000]">
                  1 simple annual payment
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[6px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[13.5px] leading-snug text-[#000000]">
                  A new flavour every few months
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}