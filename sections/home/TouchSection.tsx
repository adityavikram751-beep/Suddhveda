"use client";

import Image from "next/image";
import { Mail } from "lucide-react";

export default function TouchSection() {
    return (
        <section className="relative overflow-hidden bg-[#FDF8F2] py-10 lg:py-14">
            <div className="w-full flex flex-col lg:flex-row items-center px-6 lg:pl-16 lg:pr-0">

                {/* ================= LEFT CONTENT ================= */}
                <div className="relative z-10 w-full lg:w-[52%] flex flex-col justify-center items-center px-4 lg:px-8">

                    {/* Top Badge */}
                    <div className="flex flex-col items-center w-full max-w-[620px]">
                        <div className="w-[64px] h-[64px] rounded-full border border-[#E3CFA8] bg-[#FFF9F2] flex items-center justify-center">
                            <Image src="/step1.png" alt="Bee" width={26} height={26} />
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-12 h-px bg-[#E8D5BA]" />
                            <span className="uppercase tracking-[2px] text-[#C88718] font-semibold text-[14px]">
                                Join The Hive
                            </span>
                            <div className="w-12 h-px bg-[#E8D5BA]" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="mt-6 font-serif text-[28px] sm:text-[34px] xl:text-[46px] leading-[1.15] text-[#1A1A1A]">
                        <div className="text-center">Stay close to</div>
                        <div className="text-center">
                            Nature&apos;s <span className="text-[#C88718]">Goodness</span>
                        </div>
                    </h2>

                    {/* Small Divider */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="w-12 h-px bg-[#E8D5BA]" />
                        <Image src="/vector 3.png" alt="" width={16} height={16} />
                        <div className="w-12 h-px bg-[#E8D5BA]" />
                    </div>

                    {/* Description */}
                    <p className="mt-7 max-w-[560px] text-center text-[18px] sm:text-[22px] leading-[32px] sm:leading-[38px] text-[#B59A78] mx-auto">
                        Get exclusive offers, wellness tips, and early access to new harvests.
                    </p>

                    {/* Subscribe Form */}
                    <div className="mt-10 max-w-[620px] w-full">
                        <div className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-[#E7D5BA] bg-white h-auto sm:h-[68px]">

                            {/* Input */}
                            <div className="flex flex-1 items-center gap-3 px-6 py-3 sm:py-0">
                                <Mail size={20} className="text-[#B59A78] flex-shrink-0" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full bg-transparent text-[15px] text-[#6B2E08] placeholder:text-[#B59A78] outline-none"
                                />
                            </div>

                            {/* Button */}
                            <button className="bg-[#C57A08] w-full sm:w-[230px] text-white text-[18px] sm:text-[20px] font-semibold py-3 sm:py-0 hover:bg-[#A76A05] transition-all">
                                Join The Hive
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT IMAGE ================= */}
                <div className="w-full lg:w-[48%] relative flex justify-center mt-10 lg:mt-0">
                    <div className="relative lg:left-[100px] flex justify-center">
                        <Image
                            src="/last.png"
                            alt="Honey Bottle"
                            width={600}
                            height={600}
                            className="w-[280px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-auto object-contain"
                            priority
                        />
                    </div>
                </div>

            </div>

            {/* Background Glow */}
            <div className="absolute left-1/2 bottom-[-180px] -translate-x-1/2 w-[900px] h-[320px] rounded-full bg-[#FFF2D8] blur-[150px] opacity-70 pointer-events-none" />

            {/* Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E7D5BA] to-transparent" />

        </section>
    );
}