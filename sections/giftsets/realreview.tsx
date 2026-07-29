"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, StarHalf, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

type Review = {
  _id: string;
  rating: number;
  text: string;
  name: string;
  role?: string;
  image?: string;
};

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} size={22} className="fill-[#A87400] text-[#A87400]" />
      ))}
      {hasHalf && (
        <StarHalf size={22} className="fill-[#A87400] text-[#A87400]" />
      )}
    </div>
  );
}

export default function TestimonialsAndBulkGifting() {
  // ---- Bulk Enquiry States ----
  const [fullname, setFullname] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- Reviews States ----
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // ----- Fetch Reviews (NO credentials) -----
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
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
        setReviews(items);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // ----- Responsive visible count -----
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

  // Reset to first page whenever the layout (cards-per-page) changes,
  // so we never land on an out-of-range page on resize.
  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCount]);

  // ----- Group reviews into responsive "pages" (no fixed pixel widths) -----
  const totalPages = Math.max(1, Math.ceil(reviews.length / visibleCount));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    reviews.slice(i * visibleCount, i * visibleCount + visibleCount)
  );

  // ----- Page Sliding Logic -----
  const nextSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  // ----- Auto-Play Timer -----
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

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // ----- Submit Bulk Enquiry (NO credentials, payload as per your requirement) -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname || !businessEmail || !expectedQuantity) {
      alert("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bulkorder/enquiry/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ❌ credentials: "include" — hataya, kyunki cookies ki zaroorat nahi
        body: JSON.stringify({
          fullname, // ✅ exact field name
          businessEmail, // ✅ exact field name
          expectedQuantity, // ✅ exact field name
        }),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      alert("Enquiry sent! We'll get back to you soon.");
      // Reset form
      setFullname("");
      setBusinessEmail("");
      setExpectedQuantity("");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const gap = 10;

  return (
    <>
      {/* ========== TESTIMONIALS SECTION (Conditional — only if reviews exist) ========== */}
      {!loading && reviews.length > 0 && (
        <section className="relative bg-white py-12 sm:py-16 md:py-20 ">
          <div className="w-full max-w-[1300px] mx-auto px-3 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-[11px] sm:text-[12px] font-semibold tracking-[0.15em] text-[#2D3A1B]">
                CUSTOMER MOMENTS
              </p>
              <h2 className="text-[26px] sm:text-[32px] md:text-[40px] font-serif text-[#2D3A1B] mt-2">
                Real Stories, Real Happiness
              </h2>
            </div>

            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              {/* Viewport — clips the sliding pages, always 100% of its parent */}
              <div ref={containerRef} className="">
                {/* Sliding track — one "page" per slide, no fixed pixel widths */}
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {pages.map((pageItems, pageIdx) => (
                    <div
                      key={pageIdx}
                      className="w-full flex-shrink-0"
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
                        gap: `${gap}px`,
                      }}
                    >
                      {pageItems.map((review) => (
                        <div
                          key={review._id}
                          className="w-full h-[300px] sm:h-[323px] bg-orange-50 rounded-[22px] sm:rounded-[28px] p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                        >
                          <div className="mb-4 sm:mb-5">
                            <StarRating rating={review.rating || 5} />
                          </div>
                          <p className="font-serif italic text-[#14361E] text-[15px] sm:text-[16px] leading-[1.6] flex-1 line-clamp-5 overflow-hidden">
                            &ldquo;{review.text}&rdquo;
                          </p>
                          <div className="flex items-center gap-3 mt-5 sm:mt-6">
                            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0">
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
                              <h4 className="text-[15px] sm:text-[16px] font-bold text-[#2D2016] leading-none truncate">
                                {review.name}
                              </h4>
                              <p className="mt-1 text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] font-medium text-[#8A6A52]">
                                {review.role || "Verified Buyer"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== BULK GIFTING SECTION (Always Visible — even with zero reviews) ========== */}
      <section className="relative bg-white pb-12 sm:pb-16 md:pb-20 overflow-x-hidden">
        <div className="w-full max-w-[1300px] mx-auto px-3 sm:px-6">
          <div className="bg-[#011D02] px-4 py-8 sm:px-8 sm:py-12 md:px-14 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
            <div>
              <h2 className="text-[28px] sm:text-[34px] md:text-[42px] font-serif text-[#F0C77E] leading-tight">
                Build Strong
                <br className="hidden sm:block" /> Relationships with
                <br className="hidden sm:block" /> Meaningful Gifts
              </h2>
              <ul className="mt-6 sm:mt-7 space-y-3 sm:space-y-3.5">
                <li className="flex items-center gap-2.5 text-[13.5px] sm:text-[14px] text-[#EDE3D3]">
                  <CheckCircle2 size={17} className="text-[#F0C77E] shrink-0" />
                  Bulk Orders &amp; Custom Branding
                </li>
                <li className="flex items-center gap-2.5 text-[13.5px] sm:text-[14px] text-[#EDE3D3]">
                  <CheckCircle2 size={17} className="text-[#F0C77E] shrink-0" />
                  Personalized Handwritten Messages
                </li>
                <li className="flex items-center gap-2.5 text-[13.5px] sm:text-[14px] text-[#EDE3D3]">
                  <CheckCircle2 size={17} className="text-[#F0C77E] shrink-0" />
                  Tiered Pricing for Large Quantities
                </li>
              </ul>
            </div>

            <div className="bg-[#2D3A1B] rounded-2xl p-5 sm:p-6 md:p-7">
              <h3 className="text-[20px] sm:text-[22px] font-serif text-white mb-4 sm:mb-5">
                Get a Custom Quote
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-[14px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#F0C77E]"
                  required
                />
                <input
                  type="email"
                  placeholder="Business Email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-[14px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#F0C77E]"
                  required
                />
                <div className="relative">
                  <select
                    value={expectedQuantity}
                    onChange={(e) => setExpectedQuantity(e.target.value)}
                    className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-3 sm:px-6 sm:py-4 text-[14px] text-white focus:outline-none focus:border-[#F0C77E] cursor-pointer [&>option]:text-[#2D3A1B]"
                    required
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F0C77E] hover:bg-[#E8B966] text-[#2D3A1B] text-[13px] font-semibold tracking-[0.08em] py-3.5 rounded-xl transition-colors mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "SENDING..." : "REQUEST QUOTE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}