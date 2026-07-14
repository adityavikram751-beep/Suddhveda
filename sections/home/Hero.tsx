import Image from "next/image";
import { FiGift, FiPackage } from "react-icons/fi";
import { TbLeaf } from "react-icons/tb";

export default function Hero() {
  return (
    <section className="bg-[#FAF6F0] overflow-hidden lg:min-h-[720px]">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:pl-8 lg:pr-16 pt-4 pb-10 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center lg:min-h-[650px]">
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start pt-4 lg:pt-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-[#E6D2B8] rounded-full px-4 py-1.5 text-[#B37B1B] text-[13px] sm:text-[14px] font-medium bg-white/40 backdrop-blur-sm shadow-sm">
              <span className="text-base">🍯</span>
              <span>100% Pure</span>
              <span className="text-[#D49313] font-bold">•</span>
              <span>Raw</span>
              <span className="text-[#D49313] font-bold">•</span>
              <span>Unprocessed</span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-[32px] sm:text-[40px] md:text-[48px] lg:text-[62px] leading-[1.15] lg:leading-[1.12] font-serif text-[#2D3A1B] tracking-tight font-normal">
              Nature's Purity.
              <br />
              Delivered <span className="text-[#D49313]">Honestly.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 lg:mt-6 text-[16px] sm:text-[18px] font-semibold text-[#2D3A1B]">
              Raw Natural, Unfiltered
            </p>

            {/* Description */}
            <p className="mt-4 lg:mt-5 text-[15px] sm:text-[16px] md:text-[17px] leading-[1.6] text-[#8D7F73] max-w-[540px]">
              Experience the true goodness of honey, just as nature intended.
            </p>

            {/* Features */}
            <div className="grid grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-4 mt-10 lg:mt-16 w-full max-w-[480px]">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#2D3A1B] bg-white/40 flex-shrink-0 text-[11px] font-bold">
                  100%
                </div>
                <span className="text-[#2D3A1B] text-[11px] sm:text-[12px] leading-tight">
                  100% Pure
                  <br />& Raw
                </span>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#2D3A1B] bg-white/40 flex-shrink-0 text-[11px] font-bold">
                  LAB
                </div>
                <span className="text-[#2D3A1B] text-[11px] sm:text-[12px] leading-tight">
                  Lab Tested
                  <br />
                  For Purity
                </span>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12sm:w-12 sm:h-12 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#2D3A1B] bg-white/40 flex-shrink-0 text-[11px] font-bold">
                  NO
                </div>
                <span className="text-[#2D3A1B] text-[11px] sm:text-[12px] leading-tight">
                  No Added Sugar
                  <br />
                  Or Preservatives
                </span>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 sm:w-12 sm:h-12 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#2D3A1B] bg-white/40 flex-shrink-0 text-[11px] font-bold">
                  SEC
                </div>
                <span className="text-[#2D3A1B] text-[11px] sm:text-[12px] leading-tight">
                  Secure & Sustainable
                  <br />
                  Packaging
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mt-10 lg:mt-16 w-full sm:w-auto">
              <button className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[50px] sm:h-[52px] px-8 sm:px-10 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] shadow-sm tracking-wide w-full sm:w-auto">
                <FiGift size={18} />
                Buy Now
              </button>
              <button className="border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white transition-colors h-[50px] sm:h-[52px] px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] tracking-wide w-full sm:w-auto">
                <FiPackage size={16} />
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
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F2ECE4] w-[155px] py-3 px-4 flex items-center gap-3">
                <div className="text-[#B37B1B]">
                  <TbLeaf size={24} className="stroke-[1.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#2D3A1B] text-[14px] leading-tight">No Added</span>
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
                  <span className="font-semibold text-[#2D3A1B] text-[14px] leading-tight">Raw &</span>
                  <span className="text-[#8D7F73] text-[12px]">Unfiltered</span>
                </div>
              </div>

              {/* Card 3 - 4.9 Rating */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F2ECE4] w-[155px] py-3 px-4 flex items-center gap-3">
                <div className="text-[#D49313] text-lg">★</div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-[#2D3A1B] text-[14px] leading-none">4.9</span>
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