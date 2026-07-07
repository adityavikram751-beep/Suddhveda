import Image from "next/image";
import { FiGift } from "react-icons/fi";

export default function Hero() {
    return (
        <section className="bg-[#FAF6F0] overflow-hidden lg:min-h-[720px]">
            <div className="max-w-[1440px] mx-auto w-full px-6 lg:pl-8 lg:pr-16 pt-4 pb-10 lg:pb-0">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-start">
                    {/* LEFT CONTENT */}
                    <div className="flex flex-col items-start pt-4 lg:pt-8">
                        {/* Badge - no emoji, just text */}
                        <div className="inline-flex items-center gap-2 border border-[#E6D2B8] rounded-full px-4 py-1.5 text-[#B37B1B] text-[13px] sm:text-[14px] font-medium bg-white/40 backdrop-blur-sm shadow-sm">
                            <span>GIFT COLLECTION</span>
                        </div>

                        {/* Heading - each word on its own line */}
                        <h1 className="mt-6 text-[42px] sm:text-[44px] md:text-[54px] lg:text-[82px] leading-[1.15] lg:leading-[1.12] font-serif text-[#2C241E] tracking-tight font-normal">
                            Celebrate
                            <br />
                           
                           
                            Every Moment
                            <br />
                            <span className="text-[#D49313] text-[28px] sm:text-[34px] md:text-[40px] lg:text-[72px]">
                                with Nature's
                                <br />
                                Sweetest Gift
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-5 lg:mt-6 text-[15px] sm:text-[16px] md:text-[17px] leading-[1.6] text-[#8D7F73] max-w-[540px]">
                            Beautifully curated premium honey gift boxes, crafted to
                            make every occasion memorable with organic purity and
                            timeless elegance.
                        </p>

                        {/* Buttons - with spaces and full roundness */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mt-10 lg:mt-14 w-full sm:w-auto">
                            <button className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[50px] sm:h-[52px] px-8 sm:px-10 rounded-full flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] shadow-sm tracking-wide w-full sm:w-auto">
                                <FiGift size={18} />
                                SHOP GIFT SETS
                            </button>
                            <button className="border border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white transition-colors h-[50px] sm:h-[52px] px-6 sm:px-8 rounded-full flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] tracking-wide w-full sm:w-auto">
                                <FiGift size={16} />
                                CUSTOMIZE YOUR GIFT
                            </button>
                        </div>
                    </div>

                    {/* RIGHT – IMAGE */}
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
                    </div>
                </div>
            </div>
        </section>
    );
}