"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import ProductCard from "@/components/Productcard";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";

const honeyTypes = [
  "Natural Honey",
  "Mustard Honey",
  "Multiflora Honey",
  "Litchi Honey",
  "Fennel Honey",
  "Ajwain Honey",
];

const weightOptions = ["250g", "500g", "1kg"];

const MIN_PRICE = 249;
const MAX_PRICE = 799;

export default function ShopPage() {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const router = useRouter();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(MAX_PRICE);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleWeight = (weight: string) => {
    setSelectedWeights((prev) =>
      prev.includes(weight)
        ? prev.filter((w) => w !== weight)
        : [...prev, weight],
    );
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(product.title);
      const matchesPrice = product.price <= priceRange;
      return matchesType && matchesPrice;
    });
  }, [selectedTypes, priceRange]);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedWeights([]);
    setPriceRange(MAX_PRICE);
  };

  return (
    <main className="bg-[#FFF8EF] text-[#2F241C]">
      <div className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* ============ LEFT SIDEBAR ============ */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-[15px] font-bold uppercase tracking-wide text-[#D89A1B]">
                Filter By
              </h2>

              {/* Honey Types */}
              <div className="mt-5 border-t border-[#F0E4D0] pt-5">
                <p className="text-[14px] font-semibold text-[#2F241C]">
                  Honey Types
                </p>
                <div className="mt-3 space-y-2.5">
                  <label className="flex items-center gap-2.5 text-[13px] text-[#4E4E4E] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.length === 0}
                      onChange={clearFilters}
                      className="h-4 w-4 rounded border-[#D89A1B] text-[#D89A1B] focus:ring-[#D89A1B]"
                    />
                    All Honeys ({allProducts.length})
                  </label>
                  {honeyTypes.map((type) => {
                    const count = allProducts.filter(
                      (p) => p.title === type,
                    ).length;
                    return (
                      <label
                        key={type}
                        className="flex items-center gap-2.5 text-[13px] text-[#4E4E4E] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="h-4 w-4 rounded border-[#E4E8EE] text-[#D89A1B] focus:ring-[#D89A1B]"
                        />
                        {type} ({count})
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Net Weight */}
              <div className="mt-6 border-t border-[#F0E4D0] pt-5">
                <p className="text-[14px] font-semibold text-[#2F241C]">
                  Net Weight
                </p>
                <div className="mt-3 space-y-2.5">
                  {weightOptions.map((weight) => (
                    <label
                      key={weight}
                      className="flex items-center gap-2.5 text-[13px] text-[#4E4E4E] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWeights.includes(weight)}
                        onChange={() => toggleWeight(weight)}
                        className="h-4 w-4 rounded border-[#E4E8EE] text-[#D89A1B] focus:ring-[#D89A1B]"
                      />
                      {weight}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mt-6 border-t border-[#F0E4D0] pt-5">
                <p className="text-[14px] font-semibold text-[#2F241C]">
                  Price Range
                </p>
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="mt-4 w-full accent-[#D89A1B]"
                />
                <div className="mt-2 flex items-center justify-between text-[13px] font-semibold text-[#2F241C]">
                  <span>₹{MIN_PRICE}</span>
                  <span>₹{priceRange}</span>
                </div>
              </div>

              {/* Apply Filter */}
              <button
                type="button"
                onClick={() => {}}
                className="mt-6 w-full rounded bg-[#D89A1B] py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-[#C98715] transition-colors"
              >
                Apply Filter
              </button>
            </div>

            {/* Promo Card */}
            <div className="relative overflow-hidden rounded-lg bg-[#1F2B1B] px-6 pt-6 pb-0 text-white">
              <h3 className="font-serif text-[22px] leading-tight">
                Pure Honey.
                <br />
                Pure You.
              </h3>
              <p className="mt-2 text-[13px] text-white/70 max-w-[220px]">
                Boost your wellness with nature's sweetest gift.
              </p>
              <button
                type="button"
                className="mt-4 rounded border border-white/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-white/10 transition-colors"
              >
                Explore Benefits
              </button>

              <div className="relative mt-6 h-[160px] w-full">
                <Image
                  src="/promo-bee-flower.png"
                  alt="Bee on flower"
                  fill
                  className="object-cover object-bottom"
                />
              </div>
            </div>
          </aside>

          {/* ============ RIGHT: PRODUCT GRID ============ */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-[32px] font-bold text-[#3A342F]">
                  All Honeys
                </h1>
                <p className="mt-1 text-[14px] text-[#697386]">
                  Explore our range of natural honey variants.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[13px] text-[#A6ADB8]">
                  Showing 1-{filteredProducts.length} of {filteredProducts.length}{" "}
                  results
                </span>
                <select className="h-10 rounded border border-[#E4E8EE] bg-white px-3 text-[13px] text-[#2F241C] focus:outline-none focus:ring-1 focus:ring-[#D89A1B]">
                  <option>Sort by: Featured</option>
                  <option>Sort by: Price Low to High</option>
                  <option>Sort by: Price High to Low</option>
                </select>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  badge={item.badge}
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  weight={item.weight}
                  price={item.price}
                  oldPrice={item.oldPrice}
                  discount={item.discount}
                  rating={item.rating}
                  reviews={item.reviews}
                  quantity={cartItems[item.id] ?? 0}
                  onAddToCart={() => addToCart(item)}
                  onIncrement={() => updateQuantity(item, 1)}
                  onDecrement={() => updateQuantity(item, -1)}
                  onOpenDetails={() => router.push(`/shop/products/${item.id}`)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center text-[#697386]">
                <ShoppingCart size={32} className="text-[#D89A1B]" />
                <p>No honey matches your filters right now.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[13px] font-semibold text-[#D89A1B] underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}