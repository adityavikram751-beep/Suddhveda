"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import ProductCard from "@/components/Productcard";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts, categories, getCategoryHref } from "@/lib/shop-data";

const VISIBLE_COUNT = 4;
const SLIDE_INTERVAL = 3000;

const categoryIcons = {
  "All Honey": "",
  "Natural Honey": "🍯",
  "Mustered Honey": "🌼",
  "Multiflora Honey": "🌸",
  "Litchi Honey": "🍒",
};

export default function ProductSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Popularity");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { cartItems, addToCart, updateQuantity } = useCart();

  const sortedProducts = useMemo(() => {
    const filteredProducts = allProducts.filter((product) => {
      return (
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    const nextProducts = [...filteredProducts];

    if (sortBy === "Price: Low to High") {
      nextProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      nextProducts.sort((a, b) => b.price - a.price);
    }

    return nextProducts;
  }, [searchTerm, sortBy]);

  const total = sortedProducts.length;
  const extendedProducts =
    total > VISIBLE_COUNT
      ? [...sortedProducts, ...sortedProducts.slice(0, VISIBLE_COUNT)]
      : sortedProducts;

  useEffect(() => {
    if (total <= VISIBLE_COUNT || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  useEffect(() => {
    if (total <= VISIBLE_COUNT) return;

    if (currentIndex === total) {
      const resetTimeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
        window.setTimeout(() => setIsTransitioning(true), 20);
      }, 500);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, total]);

  const stopSliderAndAdd = (product: (typeof allProducts)[number]) => {
    setIsPaused(true);
    addToCart(product);
  };

  const goPrev = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev === 0 ? Math.max(total - 1, 0) : prev - 1));
  };

  const goNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <section className="relative overflow-hidden bg-[#FFF8EF] py-8 md:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1220px] items-center gap-7">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search the product here"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentIndex(0);
                setIsTransitioning(true);
              }}
              className="
                w-full
                rounded-[10px]
                border
                border-[#E8D5BA]
                bg-white
                py-3
                pl-11
                pr-4
                text-[13px]
                text-[#6B2E08]
                outline-none
                transition-all
                placeholder:text-[#B59A78]
                focus:ring-2
                focus:ring-[#D89A1B]
                sm:text-[14px]
              "
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8EA0B5]" />
          </div>

          <Link
            href={`/shop/products?search=${encodeURIComponent(searchTerm)}`}
            className="
              hidden
              shrink-0
              rounded-[14px]
              bg-[#D89A1B]
              px-12
              py-3
              text-[18px]
              font-semibold
              text-white
              transition-colors
              hover:bg-[#C98715]
              sm:block
            "
          >
            Search
          </Link>
        </div>

        <div className="mx-auto mt-9 flex max-w-[1220px] flex-nowrap items-center gap-7 overflow-x-auto">
          <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto">
            {categories.map((category, index) => {
              const icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <Link
                  key={category}
                  href={getCategoryHref(category)}
                  className={`
                    flex
                    items-center
                    gap-1.5
                    whitespace-nowrap
                    rounded-full
                    border
                    px-6
                    py-2
                    text-[14px]
                    font-medium
                    transition-all
                    sm:text-[16px]
                    ${
                      index === 0
                        ? "border-[#E8D5BA] bg-white text-[#4F2A15]"
                        : "border-[#E8D5BA] bg-white text-[#6B2E08] hover:border-[#D89A1B]"
                    }
                  `}
                >
                  {icon && <span className="text-[16px] leading-none">{icon}</span>}
                  {category}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 rounded-[10px] border border-[#E8D5BA] bg-white py-2.5 pl-4 pr-3">
            <span className="whitespace-nowrap text-[14px] font-medium text-[#6B2E08] sm:text-[16px]">
              Sort By:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentIndex(0);
                  setIsTransitioning(true);
                }}
                className="cursor-pointer appearance-none bg-transparent pr-6 text-[14px] font-medium text-[#6B2E08] outline-none sm:text-[15px]"
              >
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B59A78]" />
            </div>
          </div>
        </div>

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
                    className="w-1/2 shrink-0 px-2.5 sm:w-1/3 lg:w-1/4"
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
                      quantity={cartItems[product.id] ?? 0}
                      onAddToCart={() => stopSliderAndAdd(product)}
                      onIncrement={() => {
                        setIsPaused(true);
                        updateQuantity(product, 1);
                      }}
                      onDecrement={() => updateQuantity(product, -1)}
                      onOpenDetails={() =>
                        router.push(`/shop/products/${product.id}`)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {total > VISIBLE_COUNT && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous products"
                  className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8D5BA] bg-white shadow-md transition-colors hover:bg-[#FFF2D8] md:flex"
                >
                  <ChevronLeft size={18} className="text-[#6B2E08]" />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next products"
                  className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-[#E8D5BA] bg-white shadow-md transition-colors hover:bg-[#FFF2D8] md:flex"
                >
                  <ChevronRight size={18} className="text-[#6B2E08]" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-[18px] text-[#B59A78]">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-[-100px] left-1/2 h-[180px] w-[500px] -translate-x-1/2 rounded-full bg-[#FFF2D8] opacity-60 blur-[100px] sm:h-[210px] sm:w-[650px] sm:blur-[120px] md:h-[240px] md:w-[800px] md:blur-[130px]" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#E8D5BA] to-transparent" />
    </section>
  );
}
