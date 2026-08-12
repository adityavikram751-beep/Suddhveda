"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiUser, FiBox, FiDroplet } from "react-icons/fi";
import { GiBee } from "react-icons/gi";

export default function ImpactSection() {
  const router = useRouter();

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
      py-10
      sm:py-14
      lg:py-16
      "
    >
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-10">
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
          <div className="relative w-full max-w-[520px] mx-auto lg:mx-0 aspect-[458/460] rounded-2xl overflow-hidden shadow-sm">
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
                w-[56px]
                h-[56px]
                sm:w-[64px]
                sm:h-[64px]
                rounded-full
                bg-white
                flex
                items-center
                justify-center
                shadow-lg
                cursor-pointer
              "
            >
              <div
                className="
                  w-0
                  h-0
                  border-t-[8px]
                  sm:border-t-[10px]
                  border-t-transparent
                  border-b-[8px]
                  sm:border-b-[10px]
                  border-b-transparent
                  border-l-[14px]
                  sm:border-l-[16px]
                  border-l-[#593102]
                  ml-1
                "
              />
            </button>
          </div>

          {/* RIGHT - Content */}
          <div className="xl:-ml-4 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p
              className="
              text-[12px]
              sm:text-[13px]
              font-semibold
              tracking-[0.08em]
              text-[#593102]
              uppercase
              "
            >
              Why Choose Shuddh Veda Honey?
            </p>

            <h2
              className="
              mt-2
              sm:mt-3
              text-[28px]
              sm:text-[38px]
              lg:text-[42px]
              font-serif
              leading-[1.15]
              text-[#593102]
              "
            >
              Rooted in Tradition.
              <br className="hidden sm:inline" />
              Committed to Purity.
            </h2>

            <p
              className="
              mt-4
              sm:mt-5
              text-[15px]
              sm:text-[16px]
              leading-6
              sm:leading-7
              text-[#8A8A8A]
              max-w-[520px]
              px-2
              lg:px-0
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
              mt-6
              sm:mt-8
              grid
              grid-cols-2
              gap-x-6
              sm:gap-x-10
              gap-y-5
              sm:gap-y-6
              max-w-[520px]
              w-full
              px-2
              sm:px-0
              "
            >
              <div className="flex items-center justify-start gap-3">
                <FiUser size={22} className="text-[#593102] shrink-0" />
                <div className="text-left">
                  <h3 className="text-[20px] sm:text-[24px] font-bold text-[#593102] leading-none">
                    20,000+
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-[12px] tracking-[0.05em] text-[#8A8A8A] uppercase">
                    Happy Customers
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <GiBee size={22} className="text-[#593102] shrink-0" />
                <div className="text-left">
                  <h3 className="text-[20px] sm:text-[24px] font-bold text-[#593102] leading-none">
                    7M+
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-[12px] tracking-[0.05em] text-[#8A8A8A] uppercase">
                    Bees Protected
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <FiBox size={22} className="text-[#593102] shrink-0" />
                <div className="text-left">
                  <h3 className="text-[20px] sm:text-[24px] font-bold text-[#593102] leading-none">
                    1,250+
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-[12px] tracking-[0.05em] text-[#8A8A8A] uppercase">
                    Healthy Bee Colonies
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <FiDroplet size={22} className="text-[#593102] shrink-0" />
                <div className="text-left">
                  <h3 className="text-[20px] sm:text-[24px] font-bold text-[#593102] leading-none">
                    99.9%
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-[12px] tracking-[0.05em] text-[#8A8A8A] uppercase">
                    Pure &amp; Natural
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button with Router Push to /about */}
            <button
              type="button"
              onClick={() => router.push("/about")}
              className="
              mt-7
              sm:mt-9
              bg-[#593102]
              hover:bg-[#593102]
              transition-colors
              text-white
              text-[13px]
              font-semibold
              tracking-[0.05em]
              uppercase
              px-7
              py-3.5
              rounded-md
              cursor-pointer
              shadow-sm
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