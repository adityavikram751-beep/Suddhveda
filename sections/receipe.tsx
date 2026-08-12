"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { API_BASE_URL } from "@/lib/auth";

// ================= TYPES =================
type Recipe = {
  _id: string;
  title: string;
  description?: string;
  image: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  slug?: string;
};

type Feature = {
  id: number;
  image: string;
  title: string;
  description: string;
};

type Faq = {
  id: number;
  question: string;
  answer: string;
};

// ================= STATIC DATA =================
const features: Feature[] = [
  {
    id: 1,
    image: "/process1.png",
    title: "From Nature To Your Home",
    description: "Sourced from the best beekeepers.",
  },
  {
    id: 2,
    image: "/honneycart.png",
    title: "Crafted with Care",
    description: "Handled with care to preserve purity.",
  },
  {
    id: 3,
    image: "/wishlist.png",
    title: "Packed Hygienically",
    description: "Sealed to retain freshness and nutrients.",
  },
  {
    id: 4,
    image: "/wishlist1.png",
    title: "Delivered Safely",
    description: "Secure delivery to your doorstep.",
  },
];

const faqs: Faq[] = [
  {
    id: 1,
    question: "Is Shuddh Veda Honey 100% pure?",
    answer: "Yes, our honey is 100% pure, raw, and unprocessed with no additives.",
  },
  {
    id: 2,
    question: "Is the honey raw or processed?",
    answer: "Our honey is completely raw and minimally filtered to retain its natural goodness.",
  },
  {
    id: 3,
    question: "Does this honey contain any added sugar?",
    answer: "No, our honey contains no added sugar or syrups whatsoever.",
  },
  {
    id: 4,
    question: "Which honey is best for immunity?",
    answer: "Our Turmeric Honey Shot and raw natural honey are both excellent for boosting immunity.",
  },
  {
    id: 5,
    question: "How should I store honey?",
    answer: "Store honey in a cool, dry place away from direct sunlight, tightly sealed.",
  },
  {
    id: 6,
    question: "Can honey be given to kids?",
    answer: "Honey is safe for children above 1 year of age; avoid giving it to infants under 12 months.",
  },
  {
    id: 7,
    question: "Why does natural honey crystalize?",
    answer: "Crystallization is a natural process for raw honey and doesn't affect its quality.",
  },
  {
    id: 8,
    question: "How long does honey last?",
    answer: "Pure honey has an almost indefinite shelf life when stored properly.",
  },
];

// ================= MAIN COMPONENT =================
export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; video_url: string } | null>(null);
  
  // Category from URL params or default
  const [activeCategory, setActiveCategory] = useState<"benefits" | "healthy">("benefits");

  // Get category from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category === "benefits" || category === "healthy") {
      setActiveCategory(category);
    }
  }, []);

  // Fetch data when category changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch active category data
        let response = await fetch(
          `${API_BASE_URL}/api/benefits/all-benefits/${activeCategory}`
        );

        let data = response.ok ? await response.json() : null;

        // If empty or 404, fallback to healthy or benefits
        if (!data || !data.success || !data.data || data.data.length === 0) {
          const fallbackCategory = activeCategory === "benefits" ? "healthy" : "benefits";
          const fallbackRes = await fetch(
            `${API_BASE_URL}/api/benefits/all-benefits/${fallbackCategory}`
          );
          if (fallbackRes.ok) {
            data = await fallbackRes.json();
          }
        }

        if (data && data.success && data.data && data.data.length > 0) {
          const mappedRecipes = data.data.map((item: any) => ({
            _id: item._id,
            title: item.title,
            description: item.description || "",
            video_url: item.video_url || item.videoUrl || item.video || "",
            thumbnail_url: item.thumbnail_url || item.thumbnailUrl || item.image || "",
            image: item.thumbnail_url || item.thumbnailUrl || item.image || "/placeholder-image.png",
            duration: item.duration,
            slug: item.title.toLowerCase().replace(/\s+/g, "-"),
          }));
          setRecipes(mappedRecipes);
        } else {
          setRecipes([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]);

  // Get display name for category
  const getCategoryDisplayName = () => {
    return activeCategory === "benefits" ? "Benefits" : "Healthy";
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <main className="bg-white">
        <section className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-serif font-bold text-[#593102] leading-tight">
                Recipes &amp; Wellness
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-10 md:mt-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl h-[280px] sm:h-[310px] lg:h-[330px] animate-pulse"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  // ================= ERROR STATE =================
  if (error) {
    return (
      <main className="bg-white">
        <section className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-serif font-bold text-[#593102] leading-tight">
                Recipes &amp; Wellness
              </h1>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 text-lg font-semibold mb-2">⚠️ Error</p>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-6 py-2 bg-[#D49313] text-white rounded-lg hover:bg-[#b87d10] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ================= MAIN RENDER =================
  return (
    <main className="bg-white">
      {/* ================= RECIPES HEADER + GRID ================= */}
      <section className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
        {/* Heading row */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-serif font-bold text-[#593102] leading-tight">
              Recipes &amp; Wellness
            </h1>
            {/* Dynamic Category Name */}
            <p className="mt-1 text-[14px] sm:text-[16px] text-[#8D7F73]">
              Showing {getCategoryDisplayName()} Recipes
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="text-[#8D7F73] text-[13px] sm:text-[14px]">
              Showing {recipes.length} results
            </span>
          </div>
        </div>

        {/* Cards */}
        {recipes.length === 0 ? (
          <div className="text-center py-12 mt-10">
            <p className="text-gray-500 text-lg">
              No {activeCategory} recipes found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-10 md:mt-12">
            {recipes.map((recipe) => {
              const hasVideo = Boolean(recipe.video_url);

              return (
                <div
                  key={recipe._id}
                  onClick={() => {
                    if (hasVideo && recipe.video_url) {
                      setSelectedVideo({ title: recipe.title, video_url: recipe.video_url });
                    }
                  }}
                  className="relative rounded-2xl overflow-hidden border border-[#F2ECE4] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgb(0,0,0,0.12)] transition-all duration-300 group h-[280px] sm:h-[310px] lg:h-[330px] cursor-pointer"
                >
                  {hasVideo ? (
                    <div className="relative w-full h-full">
                      {/* Video Layer - Continuous Autoplay */}
                      <video
                        src={recipe.video_url}
                        poster={recipe.thumbnail_url || recipe.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                      />

                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                          <Play size={20} className="ml-0.5 text-[#593102] fill-[#593102]" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={recipe.image || "/placeholder-image.png"}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.png";
                      }}
                    />
                  )}

                  {/* Title Overlay On Top of Image/Video */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-5 sm:p-6 pointer-events-none z-20">
                    <h3 className="font-bold text-[18px] sm:text-[20px] text-white leading-snug drop-shadow-md">
                      {recipe.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="relative aspect-video w-full">
              <video
                src={selectedVideo.video_url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-[#1A1A1A] text-white flex items-center justify-between">
              <h3 className="font-bold text-lg font-serif">{selectedVideo.title}</h3>
            </div>
          </div>
        </div>
      )}

      {/* ================= FEATURES STRIP ================= */}
      <section className="border-t border-b border-[#00000033]">
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center gap-4">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[14px] sm:text-[15px] text-[#593102] leading-tight">
                    {feature.title}
                  </span>
                  <span className="text-[#8D7F73] text-[12px] sm:text-[13px] mt-0.5">
                    {feature.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="bg-[#FFFFFF] py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto w-full px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-serif text-[#593102]">
              FAQs
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-12 md:w-16 h-px bg-[#593102]" />
              <span className="text-[#593102]">✦</span>
              <div className="w-12 md:w-16 h-px bg-[#E6D2B8]" />
            </div>
          </div>

          {/* FAQ grid */}
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2 mt-12">
            {faqs.map((faq) => (
              <FaqItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Hide scrollbar cross-browser while keeping it scrollable */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}

// ================= FAQ ITEM COMPONENT =================
function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#E6D2B8]/60 py-4">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <span className="font-semibold text-[14px] sm:text-[15px] text-[#593102]">
          {faq.question}
        </span>
        <FiChevronDown
          size={18}
          className={`text-[#D49313] flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <p className="mt-3 text-[13px] sm:text-[14px] text-[#8D7F73] leading-[1.6]">
          {faq.answer}
        </p>
      )}
    </div>
  );
}