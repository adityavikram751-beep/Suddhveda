"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: 1,
    badge: "BESTSELLER",
    badgeColor: "bg-[#2D3A1B] text-white",
    image: "/product1.png",
    name: "Classic Honey",
    subtitle: "Gift Box",
    price: "1,599",
    rating: "4.9",
    features: ["Pure Honey (2x250g)", "Wooden Honey Dipper", "Greeting Card"],
  },
  {
    id: 2,
    badge: "PREMIUM",
    badgeColor: "bg-[#1E2A4A] text-white",
    image: "/product2.png",
    name: "Luxury Honey",
    subtitle: "Hamper",
    price: "2,499",
    rating: "4.9",
    features: ["Premium Honey (3x250g)", "Wooden Spoon", "Greeting Card"],
  },
  {
    id: 3,
    badge: null,
    badgeColor: "",
    image: "/product3.png",
    name: "Festive Delight",
    subtitle: "Box",
    price: "1,999",
    rating: "4.8",
    features: ["Flavoured Honey (3x200g)", "Honeycomb", "Greeting Card"],
  },
  {
    id: 4,
    badge: "NEW ARRIVAL",
    badgeColor: "bg-[#2D3A1B] text-white",
    image: "/product2.png",
    name: "Minimal Luxe",
    subtitle: "Box",
    price: "1,299",
    rating: "4.8",
    features: ["Single Origin Honey (1kg)", "Wooden Dipper", "Greeting Card"],
  },
  {
    id: 5,
    badge: "BESTSELLER",
    badgeColor: "bg-[#2D3A1B] text-white",
    image: "/product1.png",
    name: "Wild Forest Honey",
    subtitle: "Premium",
    price: "1,899",
    rating: "4.7",
    features: ["Raw Honey (500g)", "Wooden Dipper", "Gift Box"],
  },
  {
    id: 6,
    badge: "MOST LOVED",
    badgeColor: "bg-[#D49313] text-white",
    image: "/product3.png",
    name: "Organic Honey Set",
    subtitle: "Combo Pack",
    price: "2,999",
    rating: "4.9",
    features: ["3 Flavours (250g each)", "Honeycomb", "Wooden Spoon"],
  },
];

export default function FeaturedCollection() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check scroll position for arrows
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
      container.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (container) {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
    }
  };

  const handleCardClick = (productId: number) => {
    router.push(`/gift`);
  };

  return (
    <section className="relative bg-[#FDF1E3] py-16 md:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.15em] text-[#D89A1B]">
              OUR FEATURED COLLECTION
            </p>
            <h2 className="text-[30px] md:text-[36px] font-serif text-[#1E392A] mt-2">
              Thoughtfully Curated Gift Boxes
            </h2>
          </div>
        </div>

        {/* Scroll Container with Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-[#E6D2B8]/30"
              style={{ transform: "translateY(-50%)" }}
            >
              <ChevronLeft size={24} className="text-[#2D3A1B]" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-[#E6D2B8]/30"
              style={{ transform: "translateY(-50%)" }}
            >
              <ChevronRight size={24} className="text-[#2D3A1B]" />
            </button>
          )}

          {/* Scrollable Products */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab"
            style={{ scrollBehavior: "smooth" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[280px] max-w-[280px] flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleCardClick(product.id)}
              >
                {/* Image with overlay */}
                <div className="relative w-full aspect-[4/3] bg-[#f5ede4]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=Honey";
                    }}
                  />
                  {/* Badge - top-left */}
                  {product.badge && (
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-semibold tracking-[0.08em] px-3 py-1 rounded-full ${product.badgeColor}`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[17px] font-medium text-[#1E392A] leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-[15px] text-[#2D3A1B] leading-tight">
                        {product.subtitle}
                      </p>
                    </div>
                    <span className="text-[16px] font-semibold text-[#D89A1B] whitespace-nowrap">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={14} className="fill-[#D89A1B] text-[#D89A1B]" />
                    <span className="text-[13px] font-medium text-[#2D3A1B]">
                      {product.rating}
                    </span>
                  </div>

                  <div className="h-px bg-[#F0E4D3] my-3" />

                  {/* Features */}
                  <ul className="space-y-1.5">
                    {product.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[13px] text-[#6F665F]"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#D89A1B]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-5">
                    <button
                      className="flex-1 border border-[#2D3A1B]/20 rounded-lg py-2.5 text-[13px] font-medium text-[#2D3A1B] hover:bg-[#2D3A1B] hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/gift`);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#D89A1B] hover:bg-[#C48912] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart logic
                      }}
                    >
                      <ShoppingBag size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
       
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}