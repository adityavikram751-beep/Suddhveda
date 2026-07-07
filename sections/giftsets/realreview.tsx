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
        <Star key={i} size={18} className="fill-[#C9992E] text-[#C9992E]" />
      ))}
      {hasHalf && (
        <StarHalf size={18} className="fill-[#C9992E] text-[#C9992E]" />
      )}
    </div>
  );
}

export default function TestimonialsAndBulkGifting() {
  const [quantity, setQuantity] = useState("");

  return (
    <>
      {/* Testimonials Section */}
      <section className="relative bg-[#FDF3E7] py-16 md:py-20">
        <div className="max-w-[1300px] mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-[12px] font-semibold tracking-[0.15em] text-[#D89A1B]">
              CUSTOMER MOMENTS
            </p>
            <h2 className="text-[32px] md:text-[40px] font-serif text-[#2E1E16] mt-2">
              Real Stories, Real Happiness
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <StarRating rating={t.rating} />

                <p className="text-[15px] text-[#4A4038] leading-relaxed mt-5">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* This row always sticks to the bottom of the card */}
                <div className="flex items-center gap-3 mt-auto pt-8">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#2E1E16]">
                      {t.name}
                    </p>
                    <p className="text-[12px] text-[#B9791A]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Gifting / Custom Quote Section */}
      <section className="relative bg-[#FDF3E7] pb-16 md:pb-20">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="bg-[#3A2A1C]  px-8 py-12 md:px-14 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left - Text */}
            <div>
              <h2 className="text-[32px] md:text-[38px] font-serif text-[#F0C77E] leading-tight">
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
            <div className="bg-white/10 rounded-2xl p-7">
              <h3 className="text-[22px] font-serif text-white mb-5">
                Get a Custom Quote
              </h3>

              <div className="space-y-3.5">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#D89A1B]"
                />
                <input
                  type="email"
                  placeholder="Business Email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#D89A1B]"
                />
                <div className="relative">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[14px] text-white/50 focus:outline-none focus:border-[#D89A1B] cursor-pointer"
                  >
                    <option value="" className="text-[#2E1E16]">
                      Expected Quantity (e.g. 50-100)
                    </option>
                    <option value="50-100" className="text-[#2E1E16]">
                      50-100
                    </option>
                    <option value="100-250" className="text-[#2E1E16]">
                      100-250
                    </option>
                    <option value="250-500" className="text-[#2E1E16]">
                      250-500
                    </option>
                    <option value="500+" className="text-[#2E1E16]">
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

                <button className="w-full bg-[#F0C77E] hover:bg-[#E8B966] text-[#2E1E16] text-[13px] font-semibold tracking-[0.08em] py-3.5 rounded-xl transition-colors mt-1">
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