"use client";

import Image from "next/image";
import Link from "next/link";
import { FiBox, FiDollarSign, FiHeart } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="bg-[#FEF8F4] overflow-hidden lg:min-h-[720px]">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:pl-8 lg:pr-16 pt-4 pb-12 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-4 lg:pt-8">
            {/* Badge */}
            <span className="mt-4 lg:mt-8 text-[#D49313] text-[13px] font-semibold tracking-[0.08em] uppercase">
              Our Story
            </span>

            {/* Heading */}
            <h1 className="mt-2 text-[38px] sm:text-[52px] md:text-[60px] lg:text-[68px] leading-[1.18] font-serif text-[#593102] tracking-tight font-normal">
              Rooted in Nature.
              <br />
              <span className="italic text-[#D49313]">Driven by Purpose.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 lg:mt-8 text-[15px] sm:text-[16px] leading-[1.65] text-[#8D7F73] max-w-[460px]">
              At ShuddhaVeda, we believe honey is more than a sweetener—it's a
              gift from nature, crafted by hardworking bees and preserved with
              care and respect.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-8 gap-y-4 mt-8 lg:mt-10">
              {/* Feature 1 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#B37B1B] bg-[#F3E3C8] flex-shrink-0">
                  <FiBox size={16} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-bold text-[14px] text-[#593102]">100%</span>
                  <span className="text-[#8D7F73] text-[12.5px]">Pure &amp; Natural</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#B37B1B] bg-[#F3E3C8] flex-shrink-0">
                  <FiDollarSign size={16} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-bold text-[14px] text-[#593102]">Ethically</span>
                  <span className="text-[#8D7F73] text-[12.5px]">Sourced</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#B37B1B] bg-[#F3E3C8] flex-shrink-0">
                  <FiHeart size={16} />
                </div>
                <div className="flex flex-col leading-tight text-left">
                  <span className="font-bold text-[14px] text-[#593102]">Sustainable</span>
                  <span className="text-[#8D7F73] text-[12.5px]">Beekeeping</span>
                </div>
              </div>
            </div>

            {/* Button with Link (Full width on mobile, auto on desktop) */}
            <Link
              href="/promise"
              className="mt-8 lg:mt-9 bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[48px] w-full lg:w-auto px-8 rounded-lg font-medium text-[14px] tracking-wide inline-flex items-center justify-center shadow-md"
            >
              Our Promise
            </Link>
          </div>

          {/* RIGHT – IMAGE */}
          <div className="relative flex justify-center lg:justify-end w-full mt-6 lg:mt-0">
            <div className="relative flex justify-center lg:justify-end items-center w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[650px]">
              <Image
                src="/hero.png"
                alt="ShuddhaVeda Natural Honey Jar"
                width={1800}
                height={1800}
                priority
                className="
                  relative lg:absolute
                  top-0 lg:top-12
                  right-0 lg:right-14
                  w-full lg:w-[110%]
                  max-w-full lg:max-w-none
                  h-full
                  object-contain
                  object-center lg:object-right-top
                  translate-x-0 lg:translate-x-22
                  scale-100 lg:scale-[1.2]
                "
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}