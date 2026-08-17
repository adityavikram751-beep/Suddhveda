"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

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

export default function HealthyIdeas() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; video_url: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const category = "healthy"; // or dynamic if needed

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch benefits category first
        let response = await fetch(`${API_BASE_URL}/api/benefits/all-benefits/benefits`);
        let data = response.ok ? await response.json() : null;

        let allData = (data && data.success && Array.isArray(data.data)) ? data.data : [];

        // Also fetch healthy category to get all video items
        try {
          const healthyRes = await fetch(`${API_BASE_URL}/api/benefits/all-benefits/healthy`);
          if (healthyRes.ok) {
            const healthyData = await healthyRes.json();
            if (healthyData.success && Array.isArray(healthyData.data)) {
              allData = [...allData, ...healthyData.data];
            }
          }
        } catch (e) {
          console.warn("Healthy category fetch fallback warning", e);
        }

        if (allData.length > 0) {
          const mappedRecipes = allData.map((item: any) => ({
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
        console.error("Error fetching benefits:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  // Automatic Smooth Side-Scroll Timer
  useEffect(() => {
    if (recipes.length <= 1) return;

    const timer = window.setInterval(() => {
      const scroller = scrollRef.current;
      if (!scroller || scroller.offsetParent === null) return;

      const firstCard = scroller.querySelector<HTMLElement>("[data-recipe-card]");
      const gap = 24;
      const step = firstCard ? firstCard.offsetWidth + gap : scroller.clientWidth;
      const isAtEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 12;

      scroller.scrollTo({
        left: isAtEnd ? 0 : scroller.scrollLeft + step,
        behavior: "smooth",
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, [recipes.length]);

  // Loading state
  if (loading) {
    return (
      <section className="bg-[#FAF6F0] pt-6 pb-14 md:pt-8 md:pb-20">
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-serif font-bold text-[#593102] leading-tight">
                Recipes &amp; Wellness
              </h2>
            </div>
            <Link
              href="/receipe"
              className="text-[#593102] text-[13px] sm:text-[14px] font-semibold tracking-wide uppercase border-b-2 border-[#D49313] pb-1 hover:text-[#D49313] transition-colors flex-shrink-0"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-6 md:mt-8">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl h-[280px] sm:h-[310px] lg:h-[330px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-[#FAF6F0] pt-6 pb-14 md:pt-8 md:pb-20">
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#D49313] text-white rounded-lg hover:bg-[#b87d10] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (recipes.length === 0) {
    return (
      <section className="bg-[#FAF6F0] pt-6 pb-14 md:pt-8 md:pb-20">
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-serif font-bold text-[#593102] leading-tight">
                Recipes &amp; Wellness
              </h2>
            </div>
            <Link
              href="/receipe"
              className="text-[#593102] text-[13px] sm:text-[14px] font-semibold tracking-wide uppercase border-b-2 border-[#D49313] pb-1 hover:text-[#D49313] transition-colors flex-shrink-0"
            >
              View All
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#FDF9F3] via-[#FAF6F0] to-[#FDF9F3] py-12 md:py-20 border-t border-b border-[#EADCC9]/60">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16">
        
        {/* Heading row */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="flex flex-col items-start">
            <span className="uppercase tracking-[0.18em] text-[#593102] text-[12px] font-extrabold bg-[#FAF0DC] border border-[#D49313]/50 px-4 py-1.5 rounded-full shadow-2xs">
              RECIPES &amp; WELLNESS
            </span>
            <h2 className="mt-3 text-[32px] sm:text-[40px] md:text-[46px] font-serif font-extrabold text-[#593102] leading-tight tracking-tight">
              Pure Honey Recipes &amp; Wellness
            </h2>
          </div>

          <Link
            href="/receipe"
            className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white font-extrabold px-6 py-3 rounded-full text-[13px] uppercase tracking-wider shadow-md hover:shadow-xl transition-all duration-300 border border-[#FFD700]/30 cursor-pointer"
          >
            View All Recipes →
          </Link>
        </div>

        {/* Cards Carousel Container */}
        <div
          ref={scrollRef}
          className="flex w-full max-w-full gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-2 mt-8 md:mt-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {recipes.map((recipe) => {
            const hasVideo = Boolean(recipe.video_url);

            return (
              <div
                key={recipe._id}
                data-recipe-card
                onClick={() => {
                  if (hasVideo && recipe.video_url) {
                    setSelectedVideo({ title: recipe.title, video_url: recipe.video_url });
                  }
                }}
                className="w-full min-w-full md:min-w-0 md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] shrink-0 snap-center relative rounded-3xl overflow-hidden border-2 border-[#D49313]/30 shadow-lg hover:shadow-2xl hover:border-[#D49313]/70 transition-all duration-500 group h-[300px] sm:h-[330px] lg:h-[360px] cursor-pointer bg-black"
              >
                {hasVideo ? (
                  <div className="relative w-full h-full">
                    {/* Video Layer - Plays continuously when modal is not open */}
                    <video
                      src={recipe.video_url}
                      poster={recipe.thumbnail_url || recipe.image}
                      autoPlay={!selectedVideo}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      ref={(el) => {
                        if (el) {
                          if (selectedVideo) {
                            el.pause();
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none opacity-90"
                    />

                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] border-2 border-[#FFD700]/60 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-xl">
                        <Play size={22} className="ml-0.5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={recipe.image || "/placeholder-image.png"}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.png";
                    }}
                  />
                )}

                {/* Title Overlay On Top of Image/Video */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6 pointer-events-none z-20">
                  <h3 className="font-serif font-extrabold text-[19px] sm:text-[21px] text-white leading-snug drop-shadow-lg group-hover:text-[#FFD700] transition-colors">
                    {recipe.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer border border-white/20"
            >
              <X size={20} />
            </button>
            <div className="relative aspect-video w-full max-h-[75vh] bg-black flex items-center justify-center">
              <video
                src={selectedVideo.video_url}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-5 bg-[#1A1A1A] text-white flex items-center justify-between border-t border-white/10">
              <h3 className="font-bold text-lg font-serif">{selectedVideo.title}</h3>
            </div>
          </div>
        </div>
      )}

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
    </section>
  );
}