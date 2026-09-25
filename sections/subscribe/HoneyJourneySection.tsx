"use client";

import Image from "next/image";

export default function HoneyJourneySection() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF3E6] border-b border-[#EADCC9]/60 relative overflow-hidden text-[#2F241C]">
      {/* Background Decorative Glow Blobs for Glass Effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D49313]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#593102]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-5 sm:px-10 lg:px-16 relative z-10 text-center">

        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FFFDF9]/85 backdrop-blur-md border border-[#E5D8C2] px-4 py-1.5 rounded-xl text-[13px] font-semibold text-[#6E5D4F] shadow-sm mb-5">
          <div className="relative w-[15px] h-[15px] flex-shrink-0">
            <Image
              src="/Vector (15).png"
              alt="Calendar Icon"
              fill
              className="object-contain"
            />
          </div>
          <span>Your Year with shuddhveda</span>
        </div>

        {/* Main Section Heading */}
        <h2 className="font-serif text-[26px] sm:text-[38px] lg:text-[44px] font-medium text-[#2D1F14] tracking-wide uppercase leading-tight">
          A Little Nature, All Year Long
        </h2>

        {/* Subtitle Line 1 */}
        <p className="font-serif italic text-[17px] sm:text-[22px] text-[#4A3423] font-semibold mt-3 max-w-3xl mx-auto leading-snug">
          Why settle for just one kind of honey when nature has so many flavours to offer?
        </p>

        {/* Subtitle Line 2 */}
        <p className="text-[13.5px] sm:text-[15px] text-[#8A7A6A] font-normal max-w-[760px] mx-auto mt-2.5 leading-relaxed">
          Every flower, every season and every landscape gives honey its own character. With the Shuddh Veda Annual Honey Subscription, we bring six distinctive varieties together in a thoughtfully curated experience.
        </p>

        {/* 5 Feature Cards Grid / Row */}
        <div className="mt-12 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-4.5 max-w-[1160px] mx-auto text-left">

          {/* Card 1: 6 Jars Of Seasonal Honey */}
          <div className="bg-[#FCEBC9] border border-[#F3DFB8] rounded-[20px] p-5 sm:p-5.5 flex flex-col justify-between h-[180px] sm:h-[190px] transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="relative w-9 h-9">
                <Image src="/Vector (14).png" alt="Jar Icon" fill className="object-contain" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif italic text-[40px] sm:text-[48px] font-semibold text-[#2D1F14] leading-none">6</span>
                <span className="text-[13px] text-[#2D1F14] font-semibold">Jars</span>
              </div>
            </div>
            <div>
              <span className="text-[11.5px] text-[#8A7A6A] block mb-0.5">honey</span>
              <span className="font-serif text-[16px] font-bold text-[#2D1F14] leading-tight block">
                Of Seasonal Honey
              </span>
            </div>
          </div>

          {/* Card 2: 4 Months Between Deliveries */}
          <div className="bg-[#FCEBC9] border border-[#F3DFB8] rounded-[20px] p-5 sm:p-5.5 flex flex-col justify-between h-[180px] sm:h-[190px] transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="relative w-9 h-9">
                <Image src="/Vector (15).png" alt="Calendar Icon" fill className="object-contain" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif italic text-[40px] sm:text-[48px] font-semibold text-[#2D1F14] leading-none">4</span>
                <span className="text-[13px] text-[#2D1F14] font-semibold">Months</span>
              </div>
            </div>
            <div>
              <span className="font-serif text-[16px] font-bold text-[#2D1F14] leading-tight block">
                Between Deliveries
              </span>
            </div>
          </div>

          {/* Card 3: 3 Delivery Seasonal Harvest */}
          <div className="bg-[#FCEBC9] border border-[#F3DFB8] rounded-[20px] p-5 sm:p-5.5 flex flex-col justify-between h-[180px] sm:h-[190px] transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="relative w-9 h-9">
                <Image src="/griddy-icons_package-delivery-fast.png" alt="Delivery Icon" fill className="object-contain" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif italic text-[40px] sm:text-[48px] font-semibold text-[#2D1F14] leading-none">3</span>
                <span className="text-[13px] text-[#2D1F14] font-semibold">Delivery</span>
              </div>
            </div>
            <div>
              <span className="font-serif text-[16px] font-bold text-[#2D1F14] leading-tight block">
                Seasonal Harvest
              </span>
            </div>
          </div>

          {/* Card 4: 1 pay Annual Payment */}
          <div className="bg-[#FCEBC9] border border-[#F3DFB8] rounded-[20px] p-5 sm:p-5.5 flex flex-col justify-between h-[180px] sm:h-[190px] transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="relative w-9 h-9">
                <Image src="/Vector (16).png" alt="Card Icon" fill className="object-contain" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif italic text-[40px] sm:text-[48px] font-semibold text-[#2D1F14] leading-none">1</span>
                <span className="text-[13px] text-[#2D1F14] font-semibold">pay</span>
              </div>
            </div>
            <div>
              <span className="font-serif text-[16px] font-bold text-[#2D1F14] leading-tight block">
                Annual Payment
              </span>
            </div>
          </div>

          {/* Card 5: THE HONEY CLUB INCLUDES */}
          <div className="bg-[#EEDDB6] border border-[#DFC79A] rounded-[20px] p-5 sm:p-5.5 text-left shadow-[0_12px_30px_rgba(212,147,19,0.16)] flex flex-col justify-between min-h-[180px] sm:min-h-[190px] transition-all hover:shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="relative w-4 h-4 flex-shrink-0">
                  <Image src="/mingcute_polkadot-dot-line.png" alt="Polkadot Icon" fill className="object-contain" />
                </div>
                <h4 className="font-serif text-[13px] sm:text-[13.5px] font-extrabold text-[#5B3E1F] uppercase tracking-wider leading-tight">
                  The Honey Club Includes
                </h4>
              </div>

              <ul className="text-[12px] sm:text-[12.5px] text-[#54381C] space-y-1.5 leading-snug font-medium">
                <li>• 6 distinctive honey varieties</li>
                <li>• 3 seasonal deliveries</li>
                <li>• 2 × 500 g jars per delivery</li>
                <li>• 3 kg of honey per year</li>
                <li>• 1 simple annual payment</li>
                <li>• A new flavour every few months</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}