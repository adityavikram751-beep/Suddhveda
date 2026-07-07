import Image from "next/image";
import { FiGift } from "react-icons/fi";
import { PiFlask, PiTruck } from "react-icons/pi";
import { TbLeaf } from "react-icons/tb";

export default function Hero() {
  return (
    <section className="bg-[#FAF6F0] overflow-hidden lg:min-h-[720px]">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:pl-8 lg:pr-16 pt-4 pb-10 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-start">
          {/* LEFT CONTENT */}
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start">
            <span className="text-[#D49313] text-[13px] sm:text-[14px] font-semibold tracking-[0.15em] uppercase">
              Our Story
            </span>

            <h2 className="mt-3 text-[32px] sm:text-[40px] md:text-[48px] leading-[1.15] font-serif text-[#2C241E] tracking-tight">
              Rooted in Nature.
              <br />
              <span className="text-[#D49313] italic">Driven by</span>
              <br />
              <span className="text-[#D49313] italic">Purpose.</span>
            </h2>

            <p className="mt-6 text-[15px] sm:text-[16px] leading-[1.7] text-[#8D7F73] max-w-[480px]">
              At ShudhVeda, we believe honey is more than a sweetener — it's a
              gift from nature, crafted by hardworking bees and preserved with
              care and respect.
            </p>

            {/* Feature bullets */}
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6 mt-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#F4E9D8] flex items-center justify-center text-[#B37B1B] flex-shrink-0">
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[14px] text-[#2C241E] leading-tight">
                    100% Pure
                  </span>
                  <span className="text-[#8D7F73] text-[12px]">&amp; Natural</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#F4E9D8] flex items-center justify-center text-[#B37B1B] flex-shrink-0">
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[14px] text-[#2C241E] leading-tight">
                    Ethically
                  </span>
                  <span className="text-[#8D7F73] text-[12px]">Sourced</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#F4E9D8] flex items-center justify-center text-[#B37B1B] flex-shrink-0">
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[14px] text-[#2C241E] leading-tight">
                    Sustainable
                  </span>
                  <span className="text-[#8D7F73] text-[12px]">Beekeeping</span>
                </div>
              </div>
            </div>

            <button className="mt-10 bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[50px] px-8 rounded-xl flex items-center justify-center font-medium text-[14px] sm:text-[15px] shadow-sm tracking-wide">
              Our Promise
            </button>
          </div>

          {/* RIGHT – IMAGE + FLOATING CARDS */}
          <div className="relative flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
            <div className="relative flex justify-center lg:justify-end items-start w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[650px]">
              <Image
                src="/hero.png"
                alt="ShudhVeda Natural Honey Jar"
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

            {/* Floating Cards Container - desktop only, layout matches 2-col grid */}
            <div className="hidden lg:flex flex-col gap-3 absolute right-[-40px] top-[18%] -translate-y-1/2 z-20">
              {/* Card 1 - No Added Sugar */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F2ECE4] w-[155px] py-3 px-4 flex items-center gap-3">
                <div className="text-[#B37B1B]">
                  <TbLeaf size={24} className="stroke-[1.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#2C241E] text-[14px] leading-tight">No Added</span>
                  <span className="text-[#8D7F73] text-[12px]">Sugar</span>
                </div>
              </div>

              {/* Card 2 - Raw & Unfiltered */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F2ECE4] w-[155px] py-3 px-4 flex items-center gap-3">
                <div className="text-[#B37B1B] text-xl">
                  <div className="flex items-center justify-center w-8 h-8">
                    <Image
                      src="/pinhead_honeycomb.png"
                      alt="Raw & Unfiltered"
                      width={34}
                      height={34}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#2C241E] text-[14px] leading-tight">Raw &</span>
                  <span className="text-[#8D7F73] text-[12px]">Unfiltered</span>
                </div>
              </div>

              {/* Card 3 - 4.9 Rating */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F2ECE4] w-[155px] py-3 px-4 flex items-center gap-3">
                <div className="text-[#D49313] text-lg">★</div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-[#2C241E] text-[14px] leading-none">4.9</span>
                    <span className="text-[#D49313] text-[10px]">★</span>
                  </div>
                  <span className="text-[#8D7F73] text-[12px] mt-0.5">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}