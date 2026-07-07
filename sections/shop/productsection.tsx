"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/Productcard";

// Product data
const allProducts = [
  {
    id: 1,
    badge: "Best Seller",
    image: "/honneycart.png",
    title: "Natural Honey",
    subtitle: "NATURAL HONEY",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.8,
    reviews: 120,
    category: "Natural Honey",
  },
  {
    id: 2,
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Mustard Honey",
    subtitle: "MUSTARD HONEY",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.7,
    reviews: 120,
    category: "Mustered Honey",
  },
  {
    id: 3,
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    subtitle: "MULTIFLORA HONEY",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.9,
    reviews: 120,
    category: "Multiflora Honey",
  },
  {
    id: 4,
    badge: "Litchi Honey",
    image: "/honneycart.png",
    title: "Litchi Honey",
    subtitle: "LITCHI HONEY",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.6,
    reviews: 120,
    category: "Litchi Honey",
  },
  {
    id: 5,
    badge: "Best Seller",
    image: "/honneycart.png",
    title: "Natural Honey",
    subtitle: "NATURAL HONEY",
    weight: "500g • Dark • Medium",
    price: 120,
    oldPrice: 0,
    discount: "",
    rating: 4.5,
    reviews: 210,
    category: "Natural Honey",
  },
  {
    id: 6,
    badge: "New",
    image: "/honneycart.png",
    title: "Mustard Honey",
    subtitle: "MUSTARD HONEY",
    weight: "500g • Dark • Medium",
    price: 120,
    oldPrice: 0,
    discount: "",
    rating: 4.4,
    reviews: 76,
    category: "Mustered Honey",
  },
  {
    id: 7,
    badge: "Popular",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    subtitle: "MULTIFLORA HONEY",
    weight: "500g • Dark • Medium",
    price: 120,
    oldPrice: 0,
    discount: "",
    rating: 4.3,
    reviews: 143,
    category: "Multiflora Honey",
  },
  {
    id: 8,
    badge: "Premium",
    image: "/honneycart.png",
    title: "Litchi Honey",
    subtitle: "LITCHI HONEY",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.8,
    reviews: 112,
    category: "Litchi Honey",
  },
];

const categories = [
  { name: "All Honey", icon: "" },
  { name: "Natural Honey", icon: "🍯" },
  { name: "Mustered Honey", icon: "🌼" },
  { name: "Multiflora Honey", icon: "🌸" },
  { name: "Litchi Honey", icon: "🍒" },
];

const VISIBLE_COUNT = 4; // cards visible at once on desktop
const SLIDE_INTERVAL = 3000; // ms

export default function ProductSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Honey");
  const [sortBy, setSortBy] = useState("Popularity");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Honey" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts];
  if (sortBy === "Price: Low to High") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "Price: High to Low") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  const total = sortedProducts.length;

  // Duplicate first VISIBLE_COUNT items at the end for a seamless infinite loop
  const extendedProducts =
    total > VISIBLE_COUNT
      ? [...sortedProducts, ...sortedProducts.slice(0, VISIBLE_COUNT)]
      : sortedProducts;

  // Reset slider when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setIsTransitioning(true);
  }, [searchTerm, selectedCategory, sortBy]);

  // Auto slide
  useEffect(() => {
    if (total <= VISIBLE_COUNT) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [total]);

  // Seamless loop reset: when we've slid past the real items, snap back instantly
  useEffect(() => {
    if (total <= VISIBLE_COUNT) return;

    if (currentIndex === total) {
      const resetTimeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500); // matches transition duration
      return () => clearTimeout(resetTimeout);
    } else {
      setIsTransitioning(true);
    }
  }, [currentIndex, total]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <section className="relative overflow-hidden bg-[#FFF8EF] py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search Bar */}
        <div className="flex items-center gap-5 max-w-[1100px] mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search the product here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                pl-12 pr-4
                py-3 sm:py-4
                rounded-[10px]
                border border-[#E8D5BA]
                bg-white
                text-[#6B2E08]
                placeholder:text-[#B59A78]
                outline-none
                focus:ring-2 focus:ring-[#D89A1B]
                transition-all
                text-[14px] sm:text-[16px]
              "
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B59A78] w-5 h-5" />
          </div>

          <button
            className="
              shrink-0
              px-8 sm:px-18
              py-8 sm:py-3
              rounded-[20px]
              bg-[#D89A1B]
              hover:bg-[#C98715]
              text-white
              text-[18px] sm:text-[20px]
              font-semibold
              transition-colors
            "
          >
            Search
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 flex-wrap px-8 lg:px-28">
          {/* Category Filters */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                                    {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`
                  flex items-center gap-1.5
                  px-4 sm:px-5 py-1.5 sm:py-2
                  rounded-full
                  text-[13px] sm:text-[15px]
                  font-medium
                  transition-all
                  border
                  whitespace-nowrap
                  ${
                    selectedCategory === cat.name
                      ? "bg-[#D89A1B] text-white border-[#D89A1B]"
                      : "bg-white text-[#6B2E08] border-[#E8D5BA] hover:border-[#D89A1B]"
                  }
                `}
              >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div
  className="
    ml-auto
    flex
    items-center
    gap-2
    border
    border-[#E8D5BA]
    bg-white
    rounded-[10px]
    pl-4
    pr-3
    py-2
  "
>
            <span className="text-[#6B2E08] text-[14px] sm:text-[15px] font-medium whitespace-nowrap">
              Sort By:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
                  appearance-none
                  pr-6
                  bg-transparent
                  text-[#6B2E08]
                  text-[14px] sm:text-[15px]
                  font-medium
                  outline-none
                  cursor-pointer
                "
              >
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-[#B59A78] w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Slider */}
        {total > 0 ? (
          <div className="relative mt-8 md:mt-10">

            <div className="overflow-hidden">
              <div
                ref={trackRef}
                className="flex -mx-2.5"
                style={{
                  transform: `translateX(-${currentIndex * (100 / VISIBLE_COUNT)}%)`,
                  transition: isTransitioning ? "transform 0.5s ease" : "none",
                }}
              >
                {extendedProducts.map((product, idx) => (
                  <div
                    key={`${product.id}-${idx}`}
                    className="
                      shrink-0
                      w-1/2
                      sm:w-1/3
                      lg:w-1/4
                      px-2.5
                    "
                  >
                    <ProductCard
                      badge={product.badge}
                      image={product.image}
                      title={product.title}
                      subtitle={product.subtitle}
                      weight={product.weight}
                      price={product.price}
                      oldPrice={product.oldPrice}
                      discount={product.discount}
                      rating={product.rating}
                      reviews={product.reviews}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Nav Arrows */}
            {total > VISIBLE_COUNT && (
              <>
                <button
                  onClick={goPrev}
                  className="
                    absolute
                    left-0
                    top-1/2
                    -translate-y-1/2
                    -translate-x-1/2
                    w-10
                    h-10
                    rounded-full
                    bg-white
                    border
                    border-[#E8D5BA]
                    shadow-md
                    flex
                    items-center
                    justify-center
                    hover:bg-[#FFF2D8]
                    transition-colors
                    z-10
                    hidden
                    md:flex
                  "
                >
                  <ChevronLeft size={18} className="text-[#6B2E08]" />
                </button>

                <button
                  onClick={goNext}
                  className="
                    absolute
                    right-0
                    top-1/2
                    -translate-y-1/2
                    translate-x-1/2
                    w-10
                    h-10
                    rounded-full
                    bg-white
                    border
                    border-[#E8D5BA]
                    shadow-md
                    flex
                    items-center
                    justify-center
                    hover:bg-[#FFF2D8]
                    transition-colors
                    z-10
                    hidden
                    md:flex
                  "
                >
                  <ChevronRight size={18} className="text-[#6B2E08]" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#B59A78] text-[18px]">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Glow */}
      <div className="absolute left-1/2 bottom-[-100px] -translate-x-1/2 w-[500px] sm:w-[650px] md:w-[800px] h-[180px] sm:h-[210px] md:h-[240px] rounded-full bg-[#FFF2D8] blur-[100px] sm:blur-[120px] md:blur-[130px] opacity-60 pointer-events-none" />

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8D5BA] to-transparent" />
    </section>
  );
}