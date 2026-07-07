"use client";

import Image from "next/image";
import { Leaf, FlaskConical, Truck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">

      <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] w-full">

        {/* ================= Background Image (full bleed) ================= */}
        <Image
          src="/shopsection.png"
          alt="ShudhVeda Honey Jars"
          fill
          priority
          className="object-cover object-right"
        />

        {/* ================= Dark gradient overlay for text readability ================= */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            
            to-transparent
          "
        />

        {/* ================= Content ================= */}
        <div
          className="
            relative
            z-10
            flex
            h-full
            min-h-[280px]
            sm:min-h-[340px]
            lg:min-h-[420px]
            flex-col
            justify-center
            px-10
            sm:px-8
            lg:px-32
            max-w-[640px]
          "
        >

          {/* Heading */}
          <h1
            className="
              font-serif
              text-white
              text-[30px]
              sm:text-[40px]
              lg:text-[48px]
              leading-[1.2]
            "
          >
            Discover Nature&apos;s
            <br />
            Finest Honey
          </h1>

          {/* Feature Badges */}
          <div
            className="
              mt-6
              lg:mt-8
              flex
              flex-wrap
              items-center
              gap-6
              lg:gap-8
            "
          >

            <div className="flex items-center gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-white/40
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <Leaf size={16} className="text-white" />
              </div>
              <span className="text-[13px] sm:text-[14px] leading-tight text-white">
                100%
                <br />
                Natural
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-white/40
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <FlaskConical size={16} className="text-white" />
              </div>
              <span className="text-[13px] sm:text-[14px] leading-tight text-white">
                Lab
                <br />
                Tested
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-white/40
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <Truck size={16} className="text-white" />
              </div>
              <span className="text-[13px] sm:text-[14px] leading-tight text-white">
                Free
                <br />
                Shipping
              </span>
            </div>

          </div>

          {/* Button */}
          <button
            className="
              mt-8
              lg:mt-10
              w-fit
              rounded-lg
              bg-[#D89A1B]
              hover:bg-[#C98715]
              px-9
              py-3.5
              text-[15px]
              font-semibold
              text-white
              transition-all
              duration-300
            "
          >
            Buy Now
          </button>

        </div>

      </div>

    </section>
  );
}