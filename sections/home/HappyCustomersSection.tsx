"use client";

import Image from "next/image";
import { Play, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    image: "/customers/customer-1.jpg",
    name: "Priya Sharma",
  },
  {
    id: 2,
    image: "/customers/customer-2.jpg",
    name: "Rahul Singh",
  },
  {
    id: 3,
    image: "/customers/customer-3.jpg",
    name: "Neha Verma",
  },
  {
    id: 4,
    image: "/customers/customer-4.jpg",
    name: "Amit Kumar",
  },
];

export default function HappyCustomersSection() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8EF] py-8 sm:py-10 lg:py-12">

      {/* Left Decoration - Bee - Hidden on mobile/tablet */}
      <Image
        src="/customer2.png"
        alt=""
        width={60}
        height={60}
        className="absolute left-[64%] top-10 z-10 hidden lg:block"
      />

      {/* Right Decoration - Honeycomb - Hidden on mobile/tablet */}
      <Image
        src="/customer.png"
        alt=""
        width={220}
        height={200}
        className="absolute right-0 top-0 z-10 hidden lg:block"
      />

      <div className="relative max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 z-20">

        {/* Heading Section */}
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[42px] font-semibold text-[#6B2E08] leading-tight">
            Happy Customers
          </h2>

          <p className="mt-2 sm:mt-3 text-[14px] sm:text-[16px] md:text-[18px] text-[#A98F78] max-w-[700px] mx-auto">
            Trusted By thousand of families who choose Purity, taste, and quality everyday
          </p>

          {/* Rating Section - Responsive */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {/* Stars */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill="#F59E0B"
                  color="#F59E0B"
                  className="text-[#F59E0B] w-[18px] sm:w-[20px] md:w-[24px] h-auto"
                />
              ))}
            </div>
            
            {/* 4.9 */}
            <span className="text-[24px] sm:text-[28px] md:text-[34px] font-semibold text-[#6B2E08] ml-1 sm:ml-2">
              4.9
            </span>

            {/* loved by */}
            <span className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#6B2E08] ml-2 sm:ml-3">
              loved by
            </span>

            {/* 20,000+ Customers */}
            <span className="text-[#A98F78] text-[14px] sm:text-[16px] md:text-[18px] ml-1 sm:ml-2">
              20,000+ Customers
            </span>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="mt-8 sm:mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="
                group
                relative
                h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px]
                overflow-hidden
                rounded-[14px] sm:rounded-[16px]
                border
                border-[#E8D5BA]
                bg-[#FDF3E4]
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                cursor-pointer
                transition-all
                duration-300
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
              "
            >
              {/* Customer Image */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay - LIGHT */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/60
                  via-black/5
                  to-transparent
                "
              />

              {/* Play Button - CENTER */}
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  z-20
                "
              >
                <button
                  className="
                    w-[40px] sm:w-[44px] md:w-[50px]
                    h-[40px] sm:h-[44px] md:h-[50px]
                    rounded-full
                    bg-white/90
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:bg-white
                    shadow-lg
                  "
                >
                  <Play
                    size={16}
                    className="ml-0.5 text-[#D89A1B] fill-[#D89A1B] w-[14px] sm:w-[16px] md:w-[20px] h-auto"
                    fill="#D89A1B"
                  />
                </button>
              </div>

              {/* Bottom Content - Name */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  z-20
                  p-3 sm:p-4
                "
              >
                <h3 className="text-white text-[14px] sm:text-[16px] md:text-[18px] font-semibold leading-tight">
                  {item.name}
                </h3>
                <p className="text-white/80 text-[10px] sm:text-[11px] md:text-[12px] mt-0.5">⭐ Verified Buyer</p>
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Bottom Glow */}
      <div
        className="
          absolute
          left-1/2
          bottom-[-100px] sm:bottom-[-120px] md:bottom-[-140px]
          -translate-x-1/2
          w-[500px] sm:w-[650px] md:w-[800px]
          h-[180px] sm:h-[210px] md:h-[240px]
          rounded-full
          bg-[#FFF2D8]
          blur-[100px] sm:blur-[120px] md:blur-[130px]
          opacity-60
          pointer-events-none
        "
      />

      {/* Bottom Border */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#E8D5BA]
          to-transparent
        "
      />

    </section>
  );
}