"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, StarHalf, Sparkles, Quote } from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

type Review = {
  _id: string;
  rating: number;
  text: string;
  name: string;
  role?: string;
  image?: string;
};

const FALLBACK_REVIEWS: Review[] = [
  {
    _id: "rev-1",
    rating: 5,
    text: "The Himalayan Forest Bloom Gift Set was the star of our anniversary dinner! The packaging is royal and the honey taste is exceptionally pure.",
    name: "Ananya Sharma",
    role: "Verified Buyer",
    image: "/female.png",
  },
  {
    _id: "rev-2",
    rating: 5,
    text: "Ordered 50 custom gift boxes for our corporate Diwali gifting. Exceptional quality, fast delivery, and every client loved the artisanal jars!",
    name: "Vikram Malhotra",
    role: "Corporate Client",
    image: "/female.png",
  },
  {
    _id: "rev-3",
    rating: 5,
    text: "100% authentic raw honey! You can taste the nectar of wild flowers. Beautiful glass jar and elegant presentation. Highly recommended!",
    name: "Pooja Verma",
    role: "Verified Buyer",
    image: "/female.png",
  },
  {
    _id: "rev-4",
    rating: 5,
    text: "Customized 3-jar duo set as wedding favors. Our guests were mesmerized by the taste and personalized message tags. Thank you ShudhVeda!",
    name: "Rohan & Sneha",
    role: "Wedding Customer",
    image: "/female.png",
  },
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} size={18} className="fill-[#D49313] text-[#D49313]" />
      ))}
      {hasHalf && (
        <StarHalf size={18} className="fill-[#D49313] text-[#D49313]" />
      )}
    </div>
  );
}

export default function RealReview() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/all`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();

        const items = (data.data || data || []).map((item: any) => ({
          _id: item._id || item.id,
          rating: item.rating || 5,
          text: item.review || item.text || item.comment || "",
          name: item.fullname || item.name || item.userName || "Anonymous",
          role: item.role || "Verified Buyer",
          image: item.profile_url || item.image || item.userImage || "/female.png",
        }));

        if (items.length > 0) {
          setReviews(items);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const getVisibleCount = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => {
    const updateVisible = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", updateVisible);
    updateVisible();
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCount]);

  const totalPages = Math.max(1, Math.ceil(reviews.length / visibleCount));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    reviews.slice(i * visibleCount, i * visibleCount + visibleCount)
  );

  const nextSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  useEffect(() => {
    if (reviews.length === 0) return;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (!isPaused) {
      autoPlayRef.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [reviews.length, isPaused, currentIndex, visibleCount]);

  return (
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] py-16 sm:py-24 border-b border-[#EADCC9]/50 overflow-hidden">
      {/* Glow Blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D49313]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#593102]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1350px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-wider mb-3 shadow-2xs">
            <Sparkles size={14} className="text-[#D49313]" />
            <span>REAL TESTIMONIALS</span>
          </div>

          <h2 className="font-serif text-[34px] sm:text-[44px] md:text-[50px] font-extrabold text-[#593102] leading-tight tracking-tight">
            Real Stories,{" "}
            <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
              Real Happiness
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto mt-3 rounded-full" />

          <p className="text-[#6E5D4F] text-[14px] sm:text-[16px] mt-3 font-medium leading-relaxed">
            Hear what our wonderful customers and corporate partners have to say about ShudhVeda gift sets.
          </p>
        </div>

        {/* Carousel Slider */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="overflow-hidden py-2"
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {pages.map((pageItems, pageIdx) => (
              <div
                key={pageIdx}
                className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 px-1"
                style={{
                  gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
                }}
              >
                {pageItems.map((review) => (
                  <div
                    key={review._id}
                    className="w-full h-[330px] sm:h-[350px] bg-white border-2 border-[#EADCC9]/80 rounded-[32px] p-6 sm:p-7 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group"
                  >
                    {/* Background Decorative Quote Mark */}
                    <Quote className="absolute top-4 right-5 w-12 h-12 text-[#D49313]/10 stroke-1 pointer-events-none group-hover:text-[#D49313]/20 transition-colors" />

                    <div>
                      <div className="mb-4">
                        <StarRating rating={review.rating || 5} />
                      </div>
                      <p className="font-serif italic text-[#593102] text-[15px] sm:text-[16px] leading-[1.65] line-clamp-4 relative z-10">
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3.5 pt-4 border-t border-[#EADCC9]/60 relative z-10">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#D49313]/40 shadow-xs">
                        <Image
                          src={review.image || "/female.png"}
                          alt={review.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/female.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-[15px] sm:text-[16px] font-bold text-[#593102] leading-tight truncate">
                          {review.name}
                        </h4>
                        <span className="mt-1 inline-block text-[10px] font-black uppercase tracking-[0.14em] text-[#D49313] bg-[#FAF0DC] border border-[#D49313]/30 px-2 py-0.5 rounded-full">
                          {review.role || "Verified Buyer"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Indicator Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-[#D49313]"
                    : "w-2.5 bg-[#EADCC9] hover:bg-[#D49313]/60"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}