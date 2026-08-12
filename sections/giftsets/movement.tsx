"use client";

import Image from "next/image";

export default function MomentsMadeSweeter() {
  return (
    <section className="relative bg-[#FDF1E3] py-16 md:py-16">
      <div className="max-w-[1250px] mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-[12px] font-semibold tracking-[0.15em] text-[#593102]">
            GIFTING INSPIRATION
          </p>
          <h2 className="text-[32px] md:text-[38px] font-serif text-[#593102] mt-2">
            Moments Made Sweeter
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[540px]">
          {/* Left - Big tall image (wedding table setting) */}
          <div className="relative rounded-2xl overflow-hidden h-[340px] md:h-full bg-[#F3E4D0]">
            <Image
              src="/move1.png"
              alt="Wedding table setting with honey jar"
              fill
              className="object-cover"
            />
          </div>

          {/* Right column - split into top row + bottom row */}
          <div className="grid grid-rows-2 gap-4 h-auto md:h-full">
            {/* Top row: 2 images side by side */}
            <div className="grid grid-cols-2 gap-4 h-[200px] md:h-full">
              <div className="relative rounded-2xl overflow-hidden h-full bg-[#F3E4D0]">
                <Image
                  src="/image1.png"
                  alt="Elderly couple unboxing a gift"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden h-full bg-[#F3E4D0]">
                <Image
                  src="/move3.png"
                  alt="Gift box on an office desk"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Bottom: wide image */}
            <div className="relative rounded-2xl overflow-hidden h-[200px] md:h-full bg-[#F3E4D0]">
              <Image
                src="/move2.png"
                alt="Flatlay of honey jars and ingredients"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}