"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, StarHalf, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "The packaging was so premium, my parents thought it was high-end jewelry! The honey is incredibly rich and authentic.",
    name: "Ananya Sharma",
    role: "Verified Buyer",
    image: "/female.png",
  },
  {
    id: 2,
    rating: 4.5,
    text: "Ordered 50 boxes for our corporate event. The team was super helpful with the customization and the delivery was on time.",
    name: "Vikram Mehta",
    role: "HR Lead, TechCorp",
    image: "/male.png",
  },
  {
    id: 3,
    rating: 5,
    text: "Best wedding favors ever. My guests are still asking me where I got these from! Truly organic and luxurious.",
    name: "Priya Rai",
    role: "Verified Buyer",
    image: "/female.png",
  },
  {
    id: 4,
    rating: 5,
    text: "The wildflower honey is my favorite. I gift these boxes to all my clients and the feedback is always amazing.",
    name: "Siddharth K.",
    role: "Creative Director",
    image: "/male.png",
  },
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={i}
          size={22}
          className="fill-[#A87400] text-[#A87400]"
        />
      ))}
  
      {hasHalf && (
        <StarHalf
          size={22}
          className="fill-[#A87400] text-[#A87400]"
        />
      )}
    </div>
  );
}

export default function TestimonialsAndBulkGifting() {
  const [quantity, setQuantity] = useState("");

  return (
    <>
      {/* Testimonials Section */}
      <section className="relative bg-white py-16 md:py-20">
        <div className="max-w-[1300px] mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold tracking-[0.15em] text-[#D89A1B]">
              CUSTOMER MOMENTS
            </p>
            <h2 className="text-[32px] md:text-[40px] font-serif text-[#2D3A1B] mt-2">
              Real Stories, Real Happiness
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-6">
  {testimonials.map((t) => (
    <div
      key={t.id}
      className="w-[266px] h-[323px] bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
    >
      {/* Stars */}
      <div className="mb-5">
        <StarRating rating={t.rating} />
      </div>

      {/* Review */}
      <p className="font-serif italic text-[#14361E] text-[16px] leading-[1.6] flex-1">
        &ldquo;{t.text}&rdquo;
      </p>

      {/* User */}
      <div className="flex items-center gap-3 mt-6">
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
          <Image
            src={t.image}
            alt={t.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h4 className="text-[16px] font-bold text-[#2D2016] leading-none">
            {t.name}
          </h4>

          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] font-medium text-[#8A6A52]">
            {t.role}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Bulk Gifting / Custom Quote Section */}
      <section className="relative bg-white pb-16 md:pb-20">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="bg-[#011D02]  px-8 py-12 md:px-14 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left - Text */}
            <div>
              <h2 className="text-[
48px] md:text-[38px] font-serif text-[#F0C77E] leading-tight">
                Build Strong <br />
                Relationships with <br />
                Meaningful Gifts
              </h2>

              <ul className="mt-7 space-y-3.5">
                <li className="flex items-center gap-2.5 text-[14px] text-[#EDE3D3]">
                  <CheckCircle2 size={17} className="text-[#D89A1B] shrink-0" />
                  Bulk Orders &amp; Custom Branding
                </li>
                <li className="flex items-center gap-2.5 text-[14px] text-[#EDE3D3]">
                  <CheckCircle2 size={17} className="text-[#D89A1B] shrink-0" />
                  Personalized Handwritten Messages
                </li>
                <li className="flex items-center gap-2.5 text-[14px] text-[#EDE3D3]">
                  <CheckCircle2 size={17} className="text-[#D89A1B] shrink-0" />
                  Tiered Pricing for Large Quantities
                </li>
              </ul>
            </div>

            {/* Right - Form */}
            <div className="bg-[#2D3A1B] rounded-2xl p-7">
              <h3 className="text-[22px] font-serif text-white mb-5">
                Get a Custom Quote
              </h3>

              <div className="space-y-3.5">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-[14px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#D89A1B]"
                />
                <input
                  type="email"
                  placeholder="Business Email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-[14px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#D89A1B]"
                />
                <div className="relative">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-[14px] text-white/50 focus:outline-none focus:border-[#D89A1B] cursor-pointer"
                  >
                    <option value="" className="text-[#2D3A1B]">
                      Expected Quantity (e.g. 50-100)
                    </option>
                    <option value="50-100" className="text-[#2D3A1B]">
                      50-100
                    </option>
                    <option value="100-250" className="text-[#2D3A1B]">
                      100-250
                    </option>
                    <option value="250-500" className="text-[#2D3A1B]">
                      250-500
                    </option>
                    <option value="500+" className="text-[#2D3A1B]">
                      500+
                    </option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/50"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                <button className="w-full bg-[#F0C77E] hover:bg-[#E8B966] text-[#2D3A1B] text-[13px] font-semibold tracking-[0.08em] py-3.5 rounded-xl transition-colors mt-1">
                  REQUEST QUOTE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}