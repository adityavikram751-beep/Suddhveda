"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X, Sparkles, HelpCircle } from "lucide-react";
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
    description: "Sourced from the finest sustainable beekeepers.",
  },
  {
    id: 2,
    image: "/honneycart.png",
    title: "Crafted with Care",
    description: "Handled gently to preserve natural goodness.",
  },
  {
    id: 3,
    image: "/wishlist.png",
    title: "Packed Hygienically",
    description: "Sealed tight to retain supreme freshness.",
  },
  {
    id: 4,
    image: "/wishlist1.png",
    title: "Delivered Safely",
    description: "Secure packaging delivered to your doorstep.",
  },
];

const faqs: Faq[] = [
  {
    id: 1,
    question: "Is Shuddh Veda Honey 100% pure?",
    answer: "Yes, our honey is 100% pure, raw, and unprocessed with no artificial additives or preservatives.",
  },
  {
    id: 2,
    question: "Is the honey raw or processed?",
    answer: "Our honey is completely raw and minimally filtered to retain all natural pollen, enzymes, and nutrients.",
  },
  {
    id: 3,
    question: "Does this honey contain any added sugar?",
    answer: "No, ShuddhVeda honey contains zero added sugars, C4 syrups, or artificial sweeteners.",
  },
  {
    id: 4,
    question: "Which honey is best for boosting immunity?",
    answer: "Our Turmeric Honey infusion and raw wild forest honey are both exceptional for boosting natural immunity.",
  },
  {
    id: 5,
    question: "How should I store pure honey?",
    answer: "Store your honey jar in a cool, dry place away from direct sunlight. Ensure the lid is sealed tightly after use.",
  },
  {
    id: 6,
    question: "Can honey be given to children?",
    answer: "Pure honey is safe and healthy for children above 1 year of age. Avoid feeding honey to infants under 12 months.",
  },
  {
    id: 7,
    question: "Why does natural raw honey crystallize?",
    answer: "Crystallization is a natural hallmark of pure raw honey. It indicates raw quality and doesn't compromise taste or nutrition.",
  },
  {
    id: 8,
    question: "What is the shelf life of ShuddhVeda honey?",
    answer: "Pure unpasteurized honey has an almost indefinite shelf life when stored in an airtight container.",
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

  const getCategoryDisplayName = () => {
    return activeCategory === "benefits" ? "Benefits" : "Healthy";
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <main className="bg-[#FFFDF9]">
        <section className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2">
                <Sparkles size={13} className="text-[#D49313]" />
                <span>RECIPES &amp; WELLNESS</span>
              </div>
              <h1 className="text-[28px] sm:text-[34px] md:text-[42px] font-serif font-extrabold text-[#593102] leading-tight">
                Recipes &amp; <span className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent">Wellness</span>
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-10 md:mt-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <div
                key={index}
                className="bg-[#FAF5EC] rounded-2xl h-[280px] sm:h-[310px] lg:h-[330px] animate-pulse border border-[#EADCC9]"
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
      <main className="bg-[#FFFDF9]">
        <section className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-[28px] sm:text-[34px] md:text-[42px] font-serif font-extrabold text-[#593102] leading-tight">
                Recipes &amp; <span className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent">Wellness</span>
              </h1>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto shadow-xs">
              <p className="text-red-600 text-lg font-bold mb-2">⚠️ Unable to Load Recipes</p>
              <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#D49313] to-[#593102] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ================= MAIN RENDER =================
  return (
    <main className="bg-[#FFFDF9]">
      {/* ================= RECIPES HEADER + GRID ================= */}
      <section className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
        {/* Heading row */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2">
              <Sparkles size={13} className="text-[#D49313]" />
              <span>RECIPES &amp; WELLNESS</span>
            </div>
            <h1 className="text-[28px] sm:text-[34px] md:text-[42px] font-serif font-extrabold text-[#593102] leading-tight">
              Recipes &amp; <span className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent">Wellness</span>
            </h1>
            <p className="mt-1 text-sm sm:text-base text-[#6E5D4F] font-semibold">
              Showing {getCategoryDisplayName()} Recipes
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="text-[#8D7F73] font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#FAF0DC] border border-[#D49313]/30 px-3 py-1 rounded-full">
              Showing {recipes.length} results
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-12 mt-10 bg-white rounded-3xl border-2 border-[#EADCC9]/80 shadow-xs">
            <p className="text-[#6E5D4F] text-lg font-medium">
              No {activeCategory} recipes found at this time.
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
                  className="relative rounded-3xl overflow-hidden border-2 border-[#EADCC9]/80 shadow-xs hover:shadow-xl hover:border-[#D49313]/60 transition-all duration-300 group h-[280px] sm:h-[310px] lg:h-[330px] cursor-pointer"
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
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg border border-[#FFD700]/30">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-5 sm:p-6 pointer-events-none z-20">
                    <h3 className="font-serif font-extrabold text-[18px] sm:text-[20px] text-white leading-snug drop-shadow-md">
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
            className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
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
      <section className="border-t border-b border-[#EADCC9]/60 bg-[#FAF5EC]/50">
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center gap-4">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-[#EADCC9] shadow-2xs">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-[15px] sm:text-[16px] text-[#593102] leading-tight">
                    {feature.title}
                  </span>
                  <span className="text-[#6E5D4F] text-[12px] sm:text-[13px] font-medium mt-0.5">
                    {feature.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="bg-[#FFFDF9] py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto w-full px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-3">
              <HelpCircle size={13} className="text-[#D49313]" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-serif font-extrabold text-[#593102]">
              Frequently Asked <span className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent">Questions</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-12 md:w-16 h-0.5 bg-gradient-to-r from-transparent to-[#D49313]" />
              <span className="text-[#D49313] text-sm">✦</span>
              <div className="w-12 md:w-16 h-0.5 bg-gradient-to-l from-transparent to-[#D49313]" />
            </div>
          </div>

          {/* FAQ grid */}
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3 mt-12">
            {faqs.map((faq) => (
              <FaqItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

// ================= FAQ ITEM COMPONENT =================
function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#EADCC9]/70 py-4 transition-all">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
      >
        <span className="font-serif font-bold text-[14px] sm:text-[15px] text-[#593102] group-hover:text-[#D49313] transition-colors">
          {faq.question}
        </span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF0DC] text-[#D49313] flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180 bg-[#593102] text-white" : ""}`}>
          <FiChevronDown size={16} />
        </div>
      </button>

      {open && (
        <p className="mt-3 text-[13px] sm:text-[14px] text-[#6E5D4F] font-medium leading-[1.6] pl-1">
          {faq.answer}
        </p>
      )}
    </div>
  );
}