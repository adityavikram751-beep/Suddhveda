"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { API_BASE_URL } from "@/lib/auth";

type Recipe = {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug?: string;
};

export default function HealthyIdeas() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = "healthy"; // or dynamic if needed

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `${API_BASE_URL}/api/benefits/all-benefits/${category}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Map API response to our Recipe type
          const mappedRecipes = data.data.map((item: any) => ({
            _id: item._id,
            title: item.title,
            description: item.description,
            image: item.image,
            slug: item.title.toLowerCase().replace(/\s+/g, "-"),
          }));
          setRecipes(mappedRecipes);
        } else {
          throw new Error(data.message || "Failed to fetch benefits");
        }
      } catch (err) {
        console.error("Error fetching benefits:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, [category]);

  // Loading state
  if (loading) {
    return (
      <section className="bg-[#FAF6F0] pt-6 pb-14 md:pt-8 md:pb-20">
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="text-[#D49313] text-[12px] sm:text-[13px] font-semibold tracking-[0.15em] uppercase">
                Recipes &amp; Wellness
              </span>
              <h2 className="mt-2 text-[28px] sm:text-[34px] md:text-[40px] font-serif text-[#2D3A1B] leading-tight">
                Healthy Ideas with Honey
              </h2>
            </div>
            <Link
              href="/receipe"
              className="text-[#2D3A1B] text-[13px] sm:text-[14px] font-semibold tracking-wide uppercase border-b-2 border-[#D49313] pb-1 hover:text-[#D49313] transition-colors flex-shrink-0"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-6 md:mt-8">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-[#F2ECE4] h-[340px] sm:h-[360px] animate-pulse"
              >
                <div className="w-full h-[150px] sm:h-[170px] bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
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
              <span className="text-[#D49313] text-[12px] sm:text-[13px] font-semibold tracking-[0.15em] uppercase">
                Recipes &amp; Wellness
              </span>
              <h2 className="mt-2 text-[28px] sm:text-[34px] md:text-[40px] font-serif text-[#2D3A1B] leading-tight">
                Healthy Ideas with Honey
              </h2>
            </div>
            <Link
              href="/receipe"
              className="text-[#2D3A1B] text-[13px] sm:text-[14px] font-semibold tracking-wide uppercase border-b-2 border-[#D49313] pb-1 hover:text-[#D49313] transition-colors flex-shrink-0"
            >
              View All
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No benefits found</p>
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
            <span className="text-[#D49313] text-[12px] sm:text-[13px] font-semibold tracking-[0.15em] uppercase">
              Recipes &amp; Wellness
            </span>
            <h2 className="mt-2 text-[28px] sm:text-[34px] md:text-[40px] font-serif text-[#2D3A1B] leading-tight">
              Healthy Ideas with Honey
            </h2>
          </div>

          <Link
            href="/receipe"
            className="text-[#2D3A1B] text-[13px] sm:text-[14px] font-semibold tracking-wide uppercase border-b-2 border-[#D49313] pb-1 hover:text-[#D49313] transition-colors flex-shrink-0"
          >
            View All
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-6 md:mt-8">
          {recipes.map((recipe) => {
            const isExpanded = expandedId === recipe._id;
            const truncatedDescription =
              recipe.description.length > 120
                ? recipe.description.slice(0, 120) + "..."
                : recipe.description;

            return (
              <div
                key={recipe._id}
                className="bg-white rounded-2xl overflow-hidden border border-[#F2ECE4] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgb(0,0,0,0.07)] transition-shadow duration-300 group flex flex-col h-[340px] sm:h-[360px]"
              >
                {/* Image */}
                <div className="relative w-full h-[150px] sm:h-[170px] overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback image if API image fails
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.png";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 min-h-0">
                  <h3 className="font-semibold text-[16px] sm:text-[17px] text-[#2D3A1B] leading-tight flex-shrink-0 line-clamp-2">
                    {recipe.title}
                  </h3>

                  <p
                    className={`no-scrollbar mt-2 text-[13px] sm:text-[14px] text-[#8D7F73] leading-[1.6] overflow-y-auto flex-1 min-h-0 pr-1 ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                  >
                    {isExpanded ? recipe.description : truncatedDescription}
                  </p>

                  {recipe.description.length > 120 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : recipe._id)
                      }
                      className="mt-3 inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold tracking-[0.1em] uppercase text-[#2D3A1B] hover:text-[#D49313] transition-colors flex-shrink-0"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                      <FiChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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