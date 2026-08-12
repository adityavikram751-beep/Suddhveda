import Image from "next/image";
import { FiGift, FiPackage } from "react-icons/fi";
import { TbLeaf } from "react-icons/tb";

export default function Hero() {
  return (
    <section className="bg-[#FAF6F0] overflow-hidden lg:min-h-[720px]">
      <div className="max-w-[1440px] -m-2 mx-auto w-full px-4 sm:px-6 lg:pl-8 lg:pr-16 pt-6 pb-12 lg:pb-0">

        {/* Mobile & Tablet Layout (< 1024px): Center aligned text and buttons, image at bottom */}
        <div className="flex flex-col lg:hidden items-center text-center space-y-6">

          {/* Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border border-[#E6D2B8] rounded-full px-4 py-1.5 text-[#B37B1B] text-[13px] font-medium bg-white/40 backdrop-blur-sm shadow-sm">
            <span>🍯</span>
            <span>100% Pure</span>
            <span className="text-[#D49313] font-bold">•</span>
            <span>Raw</span>
            <span className="text-[#D49313] font-bold">•</span>
            <span>Unprocessed</span>
          </div>

          {/* Heading */}
          <h1 className="text-[34px] sm:text-[42px] leading-[1.15] font-serif text-[#593102] tracking-tight font-normal">
            Experience Nature&apos;s Purest Honey,
            <br />
            <span className="text-[#D49313]">Straight From The Hive</span>
          </h1>

          {/* Description */}
          <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#8D7F73] max-w-[500px] px-2">
            Ethically sourced, raw and unprocessed honey crafted by nature and delivered fresh from trusted beekeepers to your home.
          </p>

          {/* Features Row - 4 Circles matching Desktop */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2 w-full max-w-[500px]">
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#593102] bg-white/60 text-[11px] sm:text-[13px] font-bold shadow-sm shrink-0">
                100%
              </div>
              <span className="text-[#593102] text-[11px] sm:text-[12px] font-medium leading-snug text-center">
                100% Pure<br />&amp; Raw
              </span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#593102] bg-white/60 text-[11px] sm:text-[13px] font-bold shadow-sm shrink-0">
                LAB
              </div>
              <span className="text-[#593102] text-[11px] sm:text-[12px] font-medium leading-snug text-center">
                Lab Tested<br />For Purity
              </span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#593102] bg-white/60 text-[11px] sm:text-[13px] font-bold shadow-sm shrink-0">
                NO
              </div>
              <span className="text-[#593102] text-[11px] sm:text-[12px] font-medium leading-snug text-center">
                No Added Sugar<br />Or Preservatives
              </span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#593102] bg-white/60 text-[11px] sm:text-[13px] font-bold shadow-sm shrink-0">
                SEC
              </div>
              <span className="text-[#593102] text-[11px] sm:text-[12px] font-medium leading-snug text-center">
                Secure &amp; Sustainable<br />Packaging
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3.5 w-full max-w-[420px] pt-2">
            <button className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-semibold text-[15px] shadow-sm cursor-pointer w-full">
              <FiGift size={18} />
              Buy Now
            </button>
            <button className="border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white transition-colors h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-semibold text-[15px] cursor-pointer w-full bg-white/60">
              <FiPackage size={18} />
              Explore Gift Sets
            </button>
          </div>

          {/* Image with Floating Cards */}
          <div className="relative w-full max-w-[500px] pt-4">
            <Image
              src="/hero.png"
              alt="ShudhVeda Natural Honey Jar"
              width={1200}
              height={1200}
              priority
              className="w-full h-auto object-contain rounded-2xl"
            />

            {/* Floating Cards (Top-Left Positioned) */}
            <div className="absolute left-2 sm:left-4 top-8 flex flex-col gap-3 z-20">
              
              {/* Card 1 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-[#F2ECE4] w-[155px] py-2.5 px-3.5 flex items-center gap-2.5 text-left">
                <div className="text-[#B37B1B] shrink-0">
                  <TbLeaf size={22} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-[#593102] text-[14px]">No Added</span>
                  <span className="text-[#8D7F73] text-[11px]">Sugar</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-[#F2ECE4] w-[155px] py-2.5 px-3.5 flex items-center gap-2.5 text-left">
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <Image src="/pinhead_honeycomb.png" alt="Raw & Filtered" width={28} height={28} className="object-contain" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-[#593102] text-[14px]">Raw &amp;</span>
                  <span className="text-[#8D7F73] text-[11px]">Filtered</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Desktop Layout (>= 1024px): 2-Column Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-4 items-center min-h-[650px]">

          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-x-2 border border-[#E6D2B8] rounded-full px-4 py-1.5 text-[#B37B1B] text-[14px] font-medium bg-white/40 backdrop-blur-sm shadow-sm">
              <span>🍯</span>
              <span>100% Pure</span>
              <span className="text-[#D49313] font-bold">•</span>
              <span>Raw</span>
              <span className="text-[#D49313] font-bold">•</span>
              <span>Unprocessed</span>
            </div>

            <h1 className="mt-6 text-[62px] leading-[1.12] font-serif text-[#593102] tracking-tight font-normal">
              Nature&apos;s Purity.
              <br />
              Delivered <span className="text-[#D49313]">Honestly.</span>
            </h1>

            <p className="mt-6 text-[18px] font-semibold text-[#593102]">
              Raw Natural, Unfiltered
            </p>

            <p className="mt-5 text-[17px] leading-[1.6] text-[#8D7F73] max-w-[540px]">
              Experience the true goodness of honey, just as nature intended.
            </p>

            <div className="grid grid-cols-4 gap-x-6 sm:gap-x-8 mt-14 w-full max-w-[540px]">
              <div className="flex flex-col items-center text-center gap-2.5">
                <div className="w-16 h-16 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#593102] bg-white/60 text-[13px] font-bold shadow-sm shrink-0">
                  100%
                </div>
                <span className="text-[#593102] text-[13px] font-medium leading-snug text-center">
                  100% Pure<br />& Raw
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2.5">
                <div className="w-16 h-16 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#593102] bg-white/60 text-[13px] font-bold shadow-sm shrink-0">
                  LAB
                </div>
                <span className="text-[#593102] text-[13px] font-medium leading-snug text-center">
                  Lab Tested<br />For Purity
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2.5">
                <div className="w-16 h-16 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#593102] bg-white/60 text-[13px] font-bold shadow-sm shrink-0">
                  NO
                </div>
                <span className="text-[#593102] text-[13px] font-medium leading-snug text-center">
                  No Added Sugar<br />Or Preservatives
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2.5">
                <div className="w-16 h-16 rounded-full border border-[#EADCC9] flex items-center justify-center text-[#593102] bg-white/60 text-[13px] font-bold shadow-sm shrink-0">
                  SEC
                </div>
                <span className="text-[#593102] text-[13px] font-medium leading-snug text-center">
                  Secure & Sustainable<br />Packaging
                </span>
              </div>
            </div>

            <div className="flex flex-row gap-6 mt-16">
              <button className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[52px] px-10 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[15px] shadow-sm tracking-wide cursor-pointer">
                <FiGift size={18} />
                Buy Now
              </button>
              <button className="border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white transition-colors h-[52px] px-8 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[15px] tracking-wide cursor-pointer">
                <FiPackage size={16} />
                Explore Gift Sets
              </button>
            </div>
          </div>

          {/* RIGHT – IMAGE + FLOATING CARDS */}
          <div className="relative flex justify-end w-full">
            <div className="relative flex justify-end items-center w-full h-[650px]">
              <Image
                src="/hero.png"
                alt="ShudhVeda Natural Honey Jar"
                width={1800}
                height={1800}
                priority
                className="absolute top-12 right-14 w-[110%] max-w-none h-full object-contain object-right-top translate-x-22 scale-[1.2]"
              />

              {/* Floating Cards Container */}
              <div className="absolute right-[-30px] top-[18%] -translate-y-1/2 flex flex-col gap-3.5 z-20">

                {/* Card 1 */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_10px_30px_rgba(89,49,2,0.06)] border border-[#F2ECE4] w-[175px] py-3.5 px-4 flex items-center gap-3.5">
                  <div className="text-[#B37B1B] shrink-0">
                    <TbLeaf size={28} className="stroke-[1.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#593102] text-[16px] leading-tight">No Added</span>
                    <span className="text-[#8D7F73] text-[13px]">Sugar</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-[0_10px_30px_rgba(89,49,2,0.06)] border border-[#F2ECE4] w-[175px] py-3.5 px-4 flex items-center gap-3.5">
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <Image src="/pinhead_honeycomb.png" alt="Raw & Filtered" width={36} height={36} className="object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#593102] text-[16px] leading-tight">Raw &amp;</span>
                    <span className="text-[#8D7F73] text-[13px]">Filtered</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}