import Image from "next/image";
import { FiBox, FiDollarSign, FiHeart } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="bg-[#FEF8F4] overflow-hidden lg:min-h-[720px]">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:pl-8 lg:pr-16 pt-4 pb-10 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-start">
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start pt-4 lg:pt-8">
            {/* Badge */}
            <span className=" mt-8 text-[#D49313] text-[13px] font-semibold tracking-[0.08em] uppercase">
              Our Story
            </span>

            {/* Heading */}
            <h1 className="mt-2 text-[44px] sm:text-[52px] md:text-[60px] lg:text-[68px] leading-[1.18] font-serif text-[#2D3A1B] tracking-tight font-normal">
              Rooted in Nature.
              <br />
              <span className="italic text-[#D49313]">Driven by Purpose.</span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-[18px] sm:text-[16px] leading-[1.65] text-[#8D7F73] max-w-[460px]">
              At ShuddhaVeda, we believe honey is more than a sweetener—it's a
              gift from nature, crafted by hardworking bees and preserved with
              care and respect.
            </p>

            {/* Features */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10">
              {/* Feature 1 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#B37B1B] bg-[#F3E3C8] flex-shrink-0">
                  <FiBox size={16} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-[14px] text-[#2D3A1B]">100%</span>
                  <span className="text-[#8D7F73] text-[12.5px]">Pure &amp; Natural</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#B37B1B] bg-[#F3E3C8] flex-shrink-0">
                  <FiDollarSign size={16} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-[14px] text-[#2D3A1B]">Ethically</span>
                  <span className="text-[#8D7F73] text-[12.5px]">Sourced</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#B37B1B] bg-[#F3E3C8] flex-shrink-0">
                  <FiHeart size={16} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-[14px] text-[#2D3A1B]">Sustainable</span>
                  <span className="text-[#8D7F73] text-[12.5px]">Beekeeping</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button className="mt-9 bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[48px] px-8 rounded-lg font-medium text-[14px] tracking-wide">
              Our Promise
            </button>
          </div>

          {/* RIGHT – IMAGE (unchanged) */}
          <div className="relative flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
            <div className="relative flex justify-center lg:justify-end items-start w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[650px]">
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