"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { API_BASE_URL } from "@/lib/auth";

type Recipe = {
  id: string; // API se _id aayega
  slug: string;
  image: string;
  title: string;
  description: string;
};

export default function HealthyIdeas({ category = "benefits" }: { category?: string }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/api/benefits/all-benefits/${category}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();
        // Assuming data is an array of benefits with fields: _id, title, description, image, slug
        const items = (data.data || data).map((item: any) => ({
          id: item._id,
          slug: item.slug || item._id,
          image: item.image || "/placeholder.png",
          title: item.title,
          description: item.description,
        }));
        setRecipes(items);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  if (loading) {
    return (
      <section className="bg-[#FAF6F0] pt-6 pb-14 md:pt-8 md:pb-20">
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16">
          <div className="text-center py-12 text-[#8D7F73]">Loading recipes...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#FAF6F0] pt-6 pb-14 md:pt-8 md:pb-20">
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16">
          <div className="text-center py-12 text-red-600">Error: {error}</div>
        </div>
      </section>
    );
  }

  // Show only first 4 on home page
  const displayedRecipes = recipes.slice(0, 4);

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
              Honey Tips & Benefits
            </h2>
          </div>

          <Link
            href={`/receipe?category=${category}`}
            className="text-[#2D3A1B] text-[13px] sm:text-[14px] font-semibold tracking-wide uppercase border-b-2 border-[#D49313] pb-1 hover:text-[#D49313] transition-colors flex-shrink-0"
          >
            View All
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-6 md:mt-8">
          {displayedRecipes.map((recipe) => {
            const isExpanded = expandedId === recipe.id;

            return (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#F2ECE4] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgb(0,0,0,0.07)] transition-shadow duration-300 group flex flex-col h-[340px] sm:h-[360px]"
              >
                {/* Image */}
                <div className="relative w-full h-[150px] sm:h-[170px] overflow-hidden flex-shrink-0">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 min-h-0">
                  <h3 className="font-semibold text-[16px] sm:text-[17px] text-[#2D3A1B] leading-tight flex-shrink-0">
                    {recipe.title}
                  </h3>

                  <p className="no-scrollbar mt-2 text-[13px] sm:text-[14px] text-[#8D7F73] leading-[1.6] overflow-y-auto flex-1 min-h-0 pr-1">
                    {recipe.description}
                  </p>

                  {!isExpanded && (
                    <button
                      type="button"
                      onClick={() => setExpandedId(recipe.id)}
                      className="mt-3 inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold tracking-[0.1em] uppercase text-[#2D3A1B] hover:text-[#D49313] transition-colors flex-shrink-0"
                    >
                      Read More
                      <FiChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}