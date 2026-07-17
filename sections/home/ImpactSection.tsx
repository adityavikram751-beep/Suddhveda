"use client";

import Image from "next/image";
import { FiUser, FiBox, FiDroplet } from "react-icons/fi";
import { GiBee } from "react-icons/gi";

export default function ImpactSection() {
  return (
    <section
      className="
      relative
      overflow-hidden
      bg-[#FFF8EF]
      border-t
      border-[#F2DFC9]
      border-b
      border-b-[#F2DFC9]
      py-16
      "
    >
      <div className="max-w-[1450px] mx-auto px-6 lg:px-10">
        <div
          className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
          lg:gap-6
          xl:gap-0
          items-center
          "
        >
          {/* LEFT - Image / Video */}
          <div className="relative w-full max-w-[520px] mx-auto lg:mx-0 aspect-[458/460] rounded-2xl overflow-hidden">
            <Image
              src="/move1.png"
              alt="Rooted in Tradition"
              fill
              className="object-cover"
            />

            {/* Play button */}
            <button
              type="button"
              aria-label="Play video"
              className="
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[64px]
                h-[64px]
                rounded-full
                bg-white
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <div
                className="
                  w-0
                  h-0
                  border-t-[10px]
                  border-t-transparent
                  border-b-[10px]
                  border-b-transparent
                  border-l-[16px]
                  border-l-[#2D3A1B]
                  ml-1
                "
              />
            </button>
          </div>

          {/* RIGHT - Content */}
          <div className="xl:-ml-4">
            <p
              className="
              text-[13px]
              font-semibold
              tracking-[0.08em]
              text-[#2D3A1B]
              uppercase
              "
            >
              Why Choose Shuddh Veda Honey?
            </p>

            <h2
              className="
              mt-3
              text-[32px]
              md:text-[38px]
              lg:text-[42px]
              font-serif
              leading-[1.15]
              text-[#233821]
              "
            >
              Rooted in Tradition.
              <br />
              Committed to Purity.
            </h2>

            <p
              className="
              mt-5
              text-[16px]
              leading-7
              text-[#8A8A8A]
              max-w-[520px]
              "
            >
              At Shuddh Veda Honey, we follow traditional beekeeping practices
              and modern purity standards to bring you honey that is{" "}
              <span className="font-semibold text-[#4A4A4A]">
                raw, natural and unfiltered.
              </span>
            </p>

            {/* Stats grid */}
            <div
              className="
              mt-8
              grid
              grid-cols-2
              gap-x-10
              gap-y-6
              max-w-[520px]
              "
            >
              <div className="flex items-center gap-3">
                <FiUser size={22} className="text-[#2D3A1B]" />
                <div>
                  <h3 className="text-[24px] font-bold text-[#233821] leading-none">
                    20,000+
                  </h3>
                  <p className="mt-1 text-[12px] tracking-[0.05em] text-[#8A8A8A] uppercase">
                    Happy Customers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GiBee size={22} className="text-[#2D3A1B]" />
                <div>
                  <h3 className="text-[24px] font-bold text-[#233821] leading-none">
                    7M+
                  </h3>
                  <p className="mt-1 text-[12px] tracking-[0.05em] text-[#8A8A8A] uppercase">
                    Bees Protected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiBox size={22} className="text-[#2D3A1B]" />
                <div>
                  <h3 className="text-[24px] font-bold text-[#233821] leading-none">
                    1,250+
                  </h3>
                  <p className="mt-1 text-[12px] tracking-[0.05em] text-[#8A8A8A] uppercase">
                    Healthy Bee Colonies
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiDroplet size={22} className="text-[#2D3A1B]" />
                <div>
                  <h3 className="text-[24px] font-bold text-[#233821] leading-none">
                    99.9%
                  </h3>
                  <p className="mt-1 text-[12px] tracking-[0.05em] text-[#8A8A8A] uppercase">
                    Pure &amp; Natural
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              className="
              mt-9
              bg-[#233821]
              text-white
              text-[13px]
              font-semibold
              tracking-[0.05em]
              uppercase
              px-7
              py-3.5
              rounded-md
              "
            >
              Know More About Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}