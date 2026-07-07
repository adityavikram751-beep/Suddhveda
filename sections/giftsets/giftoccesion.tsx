"use client";

import Image from "next/image";

const occasions = [
  {
    id: 1,
    image: "/occesion.png",
    label: "BIRTHDAY",
    highlight: true,
  },
  {
    id: 2,
    image: "/occession1.png",
    label: "WEDDING",
  },
  {
    id: 3,
    image: "/occession4.png",
    label: "ANNIVERSARY",
  },
  {
    id: 4,
    image: "/occession3.png",
    label: "FESTIVE",
  },
  {
    id: 5,
    image: "/occession5.png",
    label: "CORPORATE",
  },
  {
    id: 6,
    image: "/occession6.png",
    label: "JUST BECAUSE",
  },
];

export default function GiftsForEveryOccasion() {
  return (
    <section className="relative bg-[#FFF8EF] py-16 md:py-20">
      <div className="max-w-[1250px] mx-auto px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-serif text-[#2E1E16]">
            Gifts for{" "}
            <span className="text-[#7A3D08]">Every Occasion</span>
          </h2>
          <div className="w-14 h-[3px] bg-[#D89A1B] mx-auto mt-3 rounded-full" />
        </div>

        {/* Occasions Row */}
        <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-10 sm:gap-x-12 md:gap-x-14">
          {occasions.map((occasion) => (
            <div
              key={occasion.id}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circle Image */}
              <div
                className={`
                  relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[150px] md:h-[150px]
                  rounded-full overflow-hidden transition-transform duration-300
                  group-hover:scale-105
                  ${occasion.highlight ? "ring-4 ring-white shadow-lg" : "shadow-md"}
                `}
              >
                <Image
                  src={occasion.image}
                  alt={occasion.label}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Label */}
              <p className="mt-4 text-[12px] sm:text-[13px] font-medium tracking-[0.12em] text-[#2E1E16]">
                {occasion.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}