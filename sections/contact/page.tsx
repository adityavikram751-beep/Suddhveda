import Image from "next/image";
import { FiSend, FiPlay, FiEye, FiClock } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="bg-[#FAF6F0] overflow-hidden lg:min-h-[720px]">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:pl-8 lg:pr-16 pt-4 pb-10 lg:pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-start">
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start pt-4 lg:pt-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mt-10 text-[#D49313] text-[13px] sm:text-[14px] font-bold tracking-widest uppercase">
              Get In Touch
            </div>

            {/* Heading */}
            <h1 className="mt-10 text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-[1.15] lg:leading-[1.12] font-serif text-[#2D3A1B] tracking-tight font-normal">
              Let's Start a
              <br />
              <span className="text-[#D49313] italic">Sweet Conversation.</span>
            </h1>

            {/* Description */}
          <p className="mt-5 lg:mt-7 text-[15px] sm:text-[18px] md:text-[17px] leading-[1.6] text-[#8D7F73] max-w-[380px]">
  We are here to answer your questions, support your journey towards natural living, and help you experience the goodness of pure honey.
</p>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 mt-10 lg:mt-12 w-full sm:w-auto">
              <button className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[50px] sm:h-[52px] px-8 sm:px-10 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] shadow-sm tracking-wide w-full sm:w-auto">
                Send Us a Message
                <FiSend size={16} />
              </button>

              <button className="flex items-center gap-3 group">
                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#D49313] flex items-center justify-center text-[#D49313] flex-shrink-0 group-hover:bg-[#D49313] group-hover:text-white transition-colors">
                  <FiPlay size={16} />
                </span>
                <span className="flex flex-col text-left leading-tight">
                  <span className="font-bold text-[14px] sm:text-[15px] text-[#2D3A1B]">How We Can Help You</span>
                  <span className="text-[#8D7F73] text-[12px] sm:text-[13px]">Watch Video</span>
                </span>
              </button>
            </div>

            {/* Stats - single line, no wrap */}
            <div className="flex flex-nowrap items-center gap-x-4 sm:gap-x-8 mt-8 lg:mt-18 overflow-x-auto">
              {/* Stat 1 */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="flex -space-x-3 flex-shrink-0">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-[#EADCC9]" />
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-[#D9C4A3]" />
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-[#C9B08A]" />
                </div>
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-bold text-[13px] sm:text-[15px] text-[#2D3A1B] leading-tight">20,000+</span>
                  <span className="text-[#8D7F73] text-[11px] sm:text-[13px]">Happy Customers</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <span className="text-[#D49313] flex-shrink-0">
                  <FiEye size={16} />
                </span>
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-bold text-[13px] sm:text-[15px] text-[#2D3A1B] leading-tight">4.9 ★★★★★</span>
                  <span className="text-[#8D7F73] text-[11px] sm:text-[13px]">Average Rating</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <span className="text-[#D49313] flex-shrink-0">
                  <FiClock size={16} />
                </span>
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-bold text-[13px] sm:text-[15px] text-[#2D3A1B] leading-tight">Quick</span>
                  <span className="text-[#8D7F73] text-[11px] sm:text-[13px]">24h Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT – IMAGE (position unchanged, height reduced) */}
          <div className="relative flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
            <div className="relative flex justify-center lg:justify-end items-start w-full h-[280px] sm:h-[380px] md:h-[460px] lg:h-[536px]">
              <Image
                src="/hero.png"
                alt="ShudhVeda Natural Honey Jar"
                width={1800}
                height={1800}
                priority
                className="
                  relative lg:absolute
                  top-0 lg:top-10
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