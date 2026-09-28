"use client";

import React from "react";
import Image from "next/image";

export default function HoneyJourneySection() {
  return (
    <section className="pt-8 sm:pt-12 pb-4 sm:pb-6 bg-[#F9F0DF] relative overflow-hidden text-[#593102]">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-[#F9F0DF]/90 border border-[#EADBCA] px-8 py-1.5 rounded-full shadow-xs mb-4">
          <div className="relative w-4 h-4 flex-shrink-0">
            <Image
              src="/fluent_calendar-date-20-regular.svg"
              alt="Calendar Icon"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[13px] sm:text-[14px] font-medium text-[#593102] tracking-tight">
            Your Year with shuddhveda
          </span>
        </div>

        {/* Main Section Heading */}
        <h2 className="font-playfair font-normal not-italic text-[28px] sm:text-[35px] text-[#593102] tracking-normal uppercase leading-[36px] sm:leading-[40px] text-center max-w-4xl mx-auto">
          A LITTLE NATURE, ALL YEAR LONG
        </h2>

        {/* Subtitle Line 1 */}
        <p className="font-playfair font-normal not-italic text-[20px] sm:text-[24px] text-[#593102] tracking-normal mt-2.5 sm:mt-3.5 text-center max-w-3xl mx-auto leading-[26px] sm:leading-[28px]">
          Why settle for just one kind of honey when nature has so many flavours to offer?
        </p>

        {/* Subtitle Line 2 */}
        <p className="font-cormorant font-normal not-italic text-[15px] sm:text-[17px] text-[#593102] tracking-normal max-w-[820px] mx-auto mt-2.5 sm:mt-2 leading-[22px] sm:leading-[20px] text-center opacity-90">
          Every flower, every season and every landscape gives honey its own character. With the Shuddh Veda Annual Honey Subscription, we bring six distinctive varieties together in a thoughtfully curated experience.
        </p>

        {/* 5 Feature Cards Row in 1 Single Grid Layout */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 max-w-[1240px] mx-auto text-left items-start">

          {/* Card 1: 6 Jars Of Seasonal Honey */}
          <div className="bg-[#FFEDD0] rounded-[24px] p-3.5 sm:p-4 flex flex-col justify-between h-[160px] sm:h-[172px]">
            <div className="flex items-start justify-between">
              {/* Left Jar Icon */}
              <div className="flex flex-col items-center ml-2 sm:ml-3">
                <div className="relative w-16 h-16 sm:w-18 sm:h-18">
                  <Image
                    src="/Group 33950 (1).svg"
                    alt="Honey Jar Icon"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-cormorant text-[13px] sm:text-[14px] text-[#000000] font-normal tracking-wide -mt-1">
                  honey
                </span>
              </div>

              {/* Number & Unit */}
              <div className="flex items-baseline gap-1 self-start pt-0.5 mr-2 sm:mr-3">
                <span className="font-cormorant italic text-[72px] sm:text-[80px] font-normal text-[#000000] leading-none">
                  6
                </span>
                <span className="font-cormorant text-[17px] sm:text-[18.5px] text-[#000000] font-medium tracking-wide">
                  Jars
                </span>
              </div>
            </div>

            {/* Bottom Title */}
            <div className="ml-2 sm:ml-3">
              <span className="font-cormorant text-[18.5px] sm:text-[20px] font-normal text-[#000000] leading-tight block">
                Of Seasonal Honey
              </span>
            </div>
          </div>

          {/* Card 2: 4 Months Between Deliveries */}
          <div className="bg-[#FFEDD0] rounded-[24px] p-3.5 sm:p-4 flex flex-col justify-between h-[160px] sm:h-[172px]">
            <div className="flex items-start justify-between">
              {/* Left Calendar Icon */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 mt-0.5 ml-2 sm:ml-3">
                <Image
                  src="/Vector (4).svg"
                  alt="Calendar Icon"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Number & Unit */}
              <div className="flex items-baseline gap-1 self-start pt-0.5 mr-2 sm:mr-3">
                <span className="font-cormorant italic text-[72px] sm:text-[80px] font-normal text-[#000000] leading-none">
                  4
                </span>
                <span className="font-cormorant text-[17px] sm:text-[18.5px] text-[#000000] font-medium tracking-wide">
                  Months
                </span>
              </div>
            </div>

            {/* Bottom Title */}
            <div className="ml-2 sm:ml-3">
              <span className="font-cormorant text-[18.5px] sm:text-[20px] font-normal text-[#000000] leading-tight block">
                Between Deliveries
              </span>
            </div>
          </div>

          {/* Card 3: 3 Delivery Seasonal Harvest */}
          <div className="bg-[#FFEDD0] rounded-[24px] p-3.5 sm:p-4 flex flex-col justify-between h-[160px] sm:h-[172px]">
            <div className="flex items-start justify-between">
              {/* Left Delivery Parcel Icon */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 mt-0.5 ml-2 sm:ml-3">
                <Image
                  src="/griddy-icons_package-delivery-fast (1).svg"
                  alt="Delivery Icon"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Number & Unit */}
              <div className="flex items-baseline gap-1 self-start pt-0.5 mr-2 sm:mr-3">
                <span className="font-cormorant italic text-[72px] sm:text-[80px] font-normal text-[#000000] leading-none">
                  3
                </span>
                <span className="font-cormorant text-[17px] sm:text-[18.5px] text-[#000000] font-medium tracking-wide">
                  Delivery
                </span>
              </div>
            </div>

            {/* Bottom Title */}
            <div className="ml-2 sm:ml-3">
              <span className="font-cormorant text-[18.5px] sm:text-[20px] font-normal text-[#000000] leading-tight block">
                Seasonal Harvest
              </span>
            </div>
          </div>

          {/* Card 4: 1 pay Annual Payment */}
          <div className="bg-[#FFEDD0] rounded-[24px] p-3.5 sm:p-4 flex flex-col justify-between h-[160px] sm:h-[172px]">
            <div className="flex items-start justify-between">
              {/* Left Payment Card Icon */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 mt-0.5 ml-2 sm:ml-3">
                <Image
                  src="/Vector (5).svg"
                  alt="Payment Card Icon"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Number/Symbol & Unit */}
              <div className="flex items-baseline gap-0.5 self-start pt-0.5 mr-2 sm:mr-3">
                <span className="font-cormorant italic text-[72px] sm:text-[80px] font-normal text-[#000000] leading-none">
                  1
                </span>
                <span className="font-cormorant text-[17px] sm:text-[18.5px] text-[#000000] font-medium tracking-wide">
                  pay
                </span>
              </div>
            </div>

            {/* Bottom Title */}
            <div className="ml-2 sm:ml-3">
              <span className="font-cormorant text-[18.5px] sm:text-[20px] font-normal text-[#000000] leading-tight block">
                Annual Payment
              </span>
            </div>
          </div>

          {/* Card 5: THE HONEY CLUB INCLUDES */}
          <div className="bg-[#F6DFBE] rounded-[24px] p-3.5 sm:p-4 flex flex-col justify-start min-h-[160px] sm:min-h-[172px] text-left">
            {/* Header */}
            <div className="flex items-start gap-2.5 mb-2">
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 mt-0.5">
                <Image
                  src="/Vector (6).svg"
                  alt="Honey Club Motif Icon"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-cormorant text-[17.5px] sm:text-[19px] font-medium uppercase tracking-[0.04em] text-[#8C4A1B] leading-[1.15]">
                THE HONEY<br />CLUB INCLUDES
              </h3>
            </div>

            {/* Bullet Points List */}
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[16.5px] sm:text-[17.5px] leading-[22px] sm:leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  6 distinctive honey varieties
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[16.5px] sm:text-[17.5px] leading-[22px] sm:leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  3 seasonal deliveries
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[16.5px] sm:text-[17.5px] leading-[22px] sm:leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  2 × 500 g jars per delivery
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[16.5px] sm:text-[17.5px] leading-[22px] sm:leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  3 kg of honey per year
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[16.5px] sm:text-[17.5px] leading-[22px] sm:leading-[23px] tracking-normal text-[#000000] whitespace-nowrap">
                  1 simple annual payment
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#000000] mt-[7px] shrink-0"></span>
                <span className="font-cormorant font-normal not-italic text-[16.5px] sm:text-[17.5px] leading-[22px] sm:leading-[23px] tracking-normal text-[#000000]">
                  A new flavour every few<br />months
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}