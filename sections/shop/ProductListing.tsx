"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Heart,
  Leaf,
  PackageCheck,
  Search,
} from "lucide-react";
import ProductCard from "@/components/Productcard";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts, categories } from "@/lib/shop-data";

const categoryIcons = {
  "All Honey": Leaf,
  "Natural Honey": Leaf,
  "Mustered Honey": FlaskConical,
  "Multiflora Honey": PackageCheck,
  "Litchi Honey": Heart,
};

export default function ProductListing({
  initialCategory,
  initialSearch,
}: {
  initialCategory: string;
  initialSearch: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const { cartItems, addToCart, updateQuantity } = useCart();
  const router = useRouter();

  // Price range state (min=0, max=2000)
  const [priceMax, setPriceMax] = useState(2000);

  // Rating filters state (array of selected rating values)
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  // Filter block collapse states
  const [filterStates, setFilterStates] = useState({
    category: true,
    price: true,
    ratings: true,
    weight: true,
    availability: true,
  });

  const toggleFilterBlock = (key: keyof typeof filterStates) => {
    setFilterStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle rating checkbox toggle
  const toggleRating = (rating: string) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  // Filter products based on category, search, price, and ratings
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Honey" || product.category === selectedCategory;

      const matchesPrice = product.price <= priceMax;

      // Rating: product.rating is a number (e.g., 4.5), we compare with selected ratings
      const matchesRating =
        selectedRatings.length === 0 ||
        selectedRatings.some((r) => {
          if (r === "4 ★ & above") return product.rating >= 4;
          if (r === "3 ★ & above") return product.rating >= 3;
          return false;
        });

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [searchTerm, selectedCategory, priceMax, selectedRatings]);

  return (
    <main className="bg-[#FFFBF6] py-8 text-[#3C2015]">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 lg:grid-cols-[280px_1fr]">
        {/* SIDEBAR – sticky, scrollable, hidden scrollbar */}
        <aside className="hidden lg:block">
          <div
            className="sticky top-[86px] max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Header */}
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-[13px] font-bold uppercase tracking-[0.14em]">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All Honey");
                  setSearchTerm("");
                  setPriceMax(2000);
                  setSelectedRatings([]);
                }}
                className="text-[12px] font-semibold text-[#D89A1B] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Category */}
            <FilterBlock
              title="Category"
              isOpen={filterStates.category}
              onToggle={() => toggleFilterBlock("category")}
            >
              {categories.slice(0, 5).map((category, index) => (
                <label
                  key={category}
                  className="flex items-center gap-3 text-[14px] text-[#6B4A31]"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="h-4 w-4 accent-[#D89A1B]"
                  />
                  {category}
                  <span className="text-[11px] text-[#9F8266]">
                    ({index === 0 ? allProducts.length : 6 + index * 2})
                  </span>
                </label>
              ))}
            </FilterBlock>

            {/* Price Range – now functional */}
            <FilterBlock
              title="Price Range"
              isOpen={filterStates.price}
              onToggle={() => toggleFilterBlock("price")}
            >
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#D89A1B]"
              />
              <div className="mt-2 flex justify-between text-[12px] font-semibold">
                <span>₹0</span>
                <span>₹{priceMax}</span>
              </div>
            </FilterBlock>

            {/* Customer Ratings – now functional */}
            <FilterBlock
              title="Customer Ratings"
              isOpen={filterStates.ratings}
              onToggle={() => toggleFilterBlock("ratings")}
            >
              {["4 ★ & above", "3 ★ & above"].map((label) => (
                <label
                  key={label}
                  className="flex items-center gap-3 text-[14px] text-[#6B4A31]"
                >
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(label)}
                    onChange={() => toggleRating(label)}
                    className="h-4 w-4 accent-[#D89A1B]"
                  />
                  {label}
                </label>
              ))}
            </FilterBlock>

            {/* Weight */}
            <FilterBlock
              title="Weight"
              isOpen={filterStates.weight}
              onToggle={() => toggleFilterBlock("weight")}
            >
              {["100g (18)", "250g (18)", "500g (16)", "1kg (16)"].map((label) => (
                <label
                  key={label}
                  className="flex items-center gap-3 text-[14px] text-[#6B4A31]"
                >
                  <input type="checkbox" className="h-4 w-4 accent-[#D89A1B]" />
                  {label}
                </label>
              ))}
            </FilterBlock>

            {/* Availability */}
            <FilterBlock
              title="Availability"
              isOpen={filterStates.availability}
              onToggle={() => toggleFilterBlock("availability")}
            >
              <label className="flex items-center gap-3 text-[14px] text-[#6B4A31]">
                <input type="checkbox" className="h-4 w-4 accent-[#D89A1B]" />
                Include out of stock (18)
              </label>
            </FilterBlock>

            {/* Apply Button – for now just resets filters (or you can add more logic) */}
            <button
              type="button"
              onClick={() => {
                // If you want to apply filters, you can trigger a refetch, but here we just keep it.
                // Optionally, you could close the sidebar on mobile, etc.
              }}
              className="w-full rounded bg-[#D89A1B] py-4 text-[14px] font-bold uppercase tracking-[0.08em] text-white hover:bg-[#C98715]"
            >
              Apply
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section>
          {/* Breadcrumb */}
          <div className="mb-5 flex items-center gap-2 text-[13px] text-[#8E623A]">
            <Link href="/" className="hover:text-[#D89A1B]">Home</Link>
            <ChevronRight size={14} />
            <Link href="/shop" className="hover:text-[#D89A1B]">Shop</Link>
            <ChevronRight size={14} />
            <span className="font-semibold text-[#D89A1B]">{selectedCategory}</span>
          </div>

          <h1 className="font-serif text-[42px] font-bold leading-tight text-[#5B260E]">
            {selectedCategory}
          </h1>

          {/* Search */}
          <div className="mt-7 flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search the product here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-[8px] border border-[#D9B88D] bg-white py-4 pl-12 pr-4 text-[15px] text-[#2D3A1B] outline-none placeholder:text-[#B59A78] focus:ring-2 focus:ring-[#D89A1B]"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B59A78]" />
            </div>
            <button className="hidden rounded bg-[#D89A1B] px-12 py-4 text-[14px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#C98715] sm:block">
              Search
            </button>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex gap-3 overflow-x-auto">
            {categories.map((category) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-[10px] border px-5 py-3 text-[14px] font-semibold transition-all ${
                    selectedCategory === category
                      ? "border-[#D89A1B] bg-[#D89A1B] text-white"
                      : "border-[#D9B88D] bg-white text-[#2D3A1B] hover:border-[#D89A1B]"
                  }`}
                >
                  <Icon size={15} />
                  {category}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
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
                onAddToCart={() => addToCart(product)}
                onIncrement={() => updateQuantity(product, 1)}
                onDecrement={() => updateQuantity(product, -1)}
                onOpenDetails={() => router.push(`/shop/products/${product.id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-center gap-3">
            {["1", "2", "3", "4"].map((page) => (
              <button
                key={page}
                className={`h-9 w-9 rounded-[10px] border text-[14px] font-semibold ${
                  page === "1"
                    ? "border-[#D89A1B] bg-[#D89A1B] text-white"
                    : "border-[#D9B88D] bg-white text-[#2D3A1B]"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-[#8E623A]">...</span>
            <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#D9B88D] bg-white text-[#2D3A1B]">
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

// Collapsible Filter Block with arrow toggle
function FilterBlock({
  title,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-7 border-b border-[#E8D5BA] pb-5">
      <div
        className="mb-4 flex cursor-pointer items-center justify-between"
        onClick={onToggle}
      >
        <h3 className="text-[13px] font-bold uppercase text-[#3C2015]">
          {title}
        </h3>
        <ChevronDown
          size={16}
          className={`text-[#3C2015] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && <div className="space-y-3">{children}</div>}
    </div>
  );
}