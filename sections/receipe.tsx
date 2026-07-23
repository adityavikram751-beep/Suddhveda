"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { API_BASE_URL } from "@/lib/auth";

type Recipe = {
  id: string;
  slug: string;
  image: string;
  title: string;
  description: string;
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
    answer:
      "Yes, our honey is 100% pure, raw, and unprocessed with no additives.",
  },
  {
    id: 2,
    question: "Is the honey raw or processed?",
    answer:
      "Our honey is completely raw and minimally filtered to retain its natural goodness.",
  },
  {
    id: 3,
    question: "Does this honey contain any added sugar?",
    answer: "No, our honey contains no added sugar or syrups whatsoever.",
  },
  {
    id: 4,
    question: "Which honey is best for immunity?",
    answer:
      "Our Turmeric Honey Shot and raw natural honey are both excellent for boosting immunity.",
  },
  {
    id: 5,
    question: "How should I store honey?",
    answer:
      "Store honey in a cool, dry place away from direct sunlight, tightly sealed.",
  },
  {
    id: 6,
    question: "Can honey be given to kids?",
    answer:
      "Honey is safe for children above 1 year of age; avoid giving it to infants under 12 months.",
  },
  {
    id: 7,
    question: "Why does natural honey crystalize?",
    answer:
      "Crystallization is a natural process for raw honey and doesn't affect its quality.",
  },
  {
    id: 8,
    question: "How long does honey last?",
    answer:
      "Pure honey has an almost indefinite shelf life when stored properly.",
  },
];

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "healthy";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isBenefits = category === "benefits";
  const pageTitle = isBenefits ? "Benefits of Honey" : "Healthy Ideas with Honey";
  const pageSubtitle = isBenefits ? "Explore the Benefits" : "Recipes & Wellness";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${API_BASE_URL}/api/benefits/all-benefits/${category}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        const itemsArray = result.data || [];
        const mappedItems = itemsArray.map((item: any) => ({
          id: item._id,
          slug: item._id,
          image: item.image || "/placeholder.png",
          title: item.title || "Untitled",
          description: item.description || "",
        }));

        setRecipes(mappedItems);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  // ----- Loading State (min-height to keep footer down) -----
  if (loading) {
    return (
      <main className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-12 text-[#8D7F73]">Loading...</div>
      </main>
    );
  }

  // ----- Error State -----
  if (error) {
    return (
      <main className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-12 text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-[#D49313] underline"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ----- Empty State -----
  if (recipes.length === 0) {
    return (
      <main className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="text-center py-12 text-[#8D7F73]">
          No items found for category: <strong>{category}</strong>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <section className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-[#D49313] text-[12px] sm:text-[13px] font-semibold tracking-[0.15em] uppercase">
              {pageSubtitle}
            </span>
            <h1 className="mt-2 text-[28px] sm:text-[34px] md:text-[40px] font-serif text-[#2D3A1B] leading-tight">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="text-[#8D7F73] text-[13px] sm:text-[14px]">
              Showing {recipes.length} results
            </span>
            <select className="border border-[#E6D2B8] rounded-lg text-[13px] sm:text-[14px] text-[#2D3A1B] px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-[#D49313]">
              <option>Sort by: Featured</option>
              <option>Sort by: Newest</option>
              <option>Sort by: A-Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-10 md:mt-12">
          {recipes.map((recipe) => {
            const isExpanded = expandedId === recipe.id;
            return (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#F2ECE4] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgb(0,0,0,0.07)] transition-shadow duration-300 group flex flex-col h-[340px] sm:h-[360px]"
              >
                <div className="relative w-full h-[150px] sm:h-[170px] overflow-hidden flex-shrink-0">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
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
      </section>

      {/* Features & FAQs */}
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
                  <span className="font-semibold text-[14px] sm:text-[15px] text-[#2D3A1B] leading-tight">
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

      <section className="bg-[#FFFFFF] py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto w-full px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-serif text-[#2D3A1B]">
              FAQs
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-12 md:w-16 h-px bg-[#2D3A1B]" />
              <span className="text-[#2D3A1B]">✦</span>
              <div className="w-12 md:w-16 h-px bg-[#E6D2B8]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2 mt-12">
            {faqs.map((faq) => (
              <FaqItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </section>

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

function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E6D2B8]/60 py-4">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <span className="font-semibold text-[14px] sm:text-[15px] text-[#2D3A1B]">
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