"use client";

import Image from "next/image";

export default function GiftSetSection() {
  return (
    <>
      <div className="w-full h-px " />
      <div className="w-full h-12" />
      <section
        className="
          relative
          overflow-hidden
          bg-orange-100
          border-t
          border-[#F2DFC9]
          border-b
          border-b-[#EAD7BE]
        "
      >
      <div
        className="
          max-w-[1518px]
          mx-auto
          grid
          lg:grid-cols-[40%_60%]
          items-stretch
          min-h-[420px]
        "
      >
        {/* ================= LEFT CONTENT ================= */}

        <div
          className="
            relative
            z-20
            flex
            flex-col
            justify-center
            ml-6
            lg:ml-12
            px-18
            lg:px-12
            py-12
            bg-orange-100
          "
        >
          {/* Top Label */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <Image
                src="/gifticon.png"
                alt=""
                width={22}
                height={22}
                className="w-[22px] h-[22px]"
              />
              <span
                className="
                  text-[18px]
                  font-medium
                  uppercase
                  tracking-[1px]
                  text-[#C98A16]
                "
              >
                Gift Sets
              </span>
            </div>

            <div className="w-28 h-px bg-[#DDBE92]" />
          </div>

          {/* Heading */}

          <h2
            className="
              mt-4
              text-[60px]
              leading-[1.12]
              font-semibold
              tracking-[-1px]
              text-[#35261B]
            "
          >
            <span className="whitespace-nowrap">Thoughtful Gifts,</span>
            <br />
            <span className="text-[#D89A1B]">Pure Happiness</span>
          </h2>

          {/* Divider */}

          <div className="flex items-center mt-6">
            <div className="w-[170px] h-px bg-[#E8D6BC]" />
            <Image
              src="/Vector 3.png"
              alt=""
              width={18}
              height={18}
              className="mx-5"
            />
            <div className="w-[170px] h-px bg-[#E8D6BC]" />
          </div>

          {/* Description */}

          <p
            className="
              mt-10
              max-w-[470px]
              text-[21px]
              leading-[1.65]
              text-[#B49781]
            "
          >
            Curated honey gift sets for every celebration. Beautifully packed.
            Naturally wholesome.
          </p>

          {/* Button */}

          <button
            className="
              mt-12
              inline-flex
              w-fit
              items-center
              gap-3
              rounded-xl
              bg-[#D89A1B]
              hover:bg-[#C98715]
              px-8
              py-4
              text-[17px]
              font-medium
              text-white
              transition-all
              duration-300
            "
          >
            <Image
              src="/gifticon.png"
              alt=""
              width={16}
              height={16}
            />
            Explore the Gift Sets
          </button>
        </div>

        {/* ================= RIGHT SIDE – single big image, full bleed ================= */}
        <div className="relative w-280 min-h-[400px] lg:min-h-[500px]">
          <Image
            src="/giftset.png"
            alt="ShudhVeda Honey Gift Set"
            fill
            priority
            className="object-contain object-center"
            sizes="(max-width: 1024px) 100vw, 86vw"
          />
        </div>
      </div>
      </section>
    </>
  );
}