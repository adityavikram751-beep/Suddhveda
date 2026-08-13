"use client";

import { useState, useEffect } from "react";
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
    <section className="bg-[#FAF6F0] pt-6 pb-14 md:pt-8 md:pb-20">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16">
        {/* Heading row */}
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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-6 md:mt-8">
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
                    {/* Video Layer - Plays continuously */}
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
      </div>

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