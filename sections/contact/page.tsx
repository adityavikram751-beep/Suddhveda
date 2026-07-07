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
          <div className="flex flex-col items-start pt-4 lg:pt-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-[#E6D2B8] rounded-full px-4 py-1.5 text-[#B37B1B] text-[13px] sm:text-[14px] font-medium bg-white/40 backdrop-blur-sm shadow-sm">
              
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-[32px] sm:text-[40px] md:text-[48px] lg:text-[62px] leading-[1.15] lg:leading-[1.12] font-serif text-[#2C241E] tracking-tight font-normal">
              Experience Nature's
              <br />
              Purest Honey,
              <br />
              <span className="text-[#D49313] text-[28px] sm:text-[34px] md:text-[40px] lg:text-[52px]">
                Straight From The Hive
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 lg:mt-6 text-[15px] sm:text-[16px] md:text-[17px] leading-[1.6] text-[#8D7F73] max-w-[540px]">
              Ethically sourced, raw and unprocessed honey crafted by nature and delivered fresh from trusted beekeepers to your home.
            </p>

            {/* Features */}
            <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-10 gap-y-4 mt-8 lg:mt-14">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#8D7F73] bg-white/20 flex-shrink-0">
                  <TbLeaf size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] sm:text-[15px] text-[#2C241E] leading-tight">100%</span>
                  <span className="text-[#8D7F73] text-[12px] sm:text-[13px]">Natural</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#8D7F73] bg-white/20 flex-shrink-0">
                  <PiFlask size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] sm:text-[15px] text-[#2C241E] leading-tight">Lab</span>
                  <span className="text-[#8D7F73] text-[12px] sm:text-[13px]">Tested</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#8D7F73] bg-white/20 flex-shrink-0">
                  <PiTruck size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] sm:text-[15px] text-[#2C241E] leading-tight">Free</span>
                  <span className="text-[#8D7F73] text-[12px] sm:text-[13px]">Shipping</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mt-10 lg:mt-22 w-full sm:w-auto">
              <button className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[50px] sm:h-[52px] px-8 sm:px-10 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] shadow-sm tracking-wide w-full sm:w-auto">
                <FiGift size={18} />
                Buy Now
              </button>
              <button className="border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white transition-colors h-[50px] sm:h-[52px] px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] tracking-wide w-full sm:w-auto">
                <FiGift size={16} />
                Explore Gift Sets
              </button>
            </div>
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
             

           
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}