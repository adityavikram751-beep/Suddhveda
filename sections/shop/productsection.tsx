"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ChevronDown, X } from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
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

  const [openSections, setOpenSections] = useState({
    types: true,
    weight: true,
    price: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleWeight = (weight: string) => {
    setSelectedWeights((prev) =>
      prev.includes(weight) ? prev.filter((w) => w !== weight) : [...prev, weight]
    );
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(product.title);
      const matchesWeight =
        selectedWeights.length === 0 || selectedWeights.includes(product.weight);
      const matchesPrice = product.price <= priceRange;
      return matchesType && matchesWeight && matchesPrice;
    });
  }, [selectedTypes, selectedWeights, priceRange]);

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedWeights([]);
    setPriceRange(MAX_PRICE);
  };

  const getHeading = () => {
    if (selectedTypes.length === 0) return "All Honeys";
    if (selectedTypes.length === 1) return selectedTypes[0];
    return "All Honeys";
  };

  const removeTypeFilter = (type: string) => {
    setSelectedTypes((prev) => prev.filter((t) => t !== type));
  };

  return (
    <main className="min-h-screen bg-white text-[#2F241C]">
      <div className="border-t border-[#E8E0D8]" />

      <div className="mx-auto max-w-[1490px] px-4 py-8 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* ============ LEFT SIDEBAR ============ */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              {/* ===== FILTER HEADING – Playfair Display ===== */}
              <h2 className="font-['Playfair_Display'] text-[15px] font-bold uppercase tracking-wide text-[#2D3A1B]">
                Filter By
              </h2>

              {/* Honey Types */}
              <div className="mt-5 border-t border-[#F0E4D0] pt-5">
                <button
                  type="button"
                  onClick={() => toggleSection("types")}
                  className="flex w-full items-center justify-between"
                >
                  <p className="text-[14px] font-semibold text-[#2F241C]">
                    Honey Types
                  </p>
                  <ChevronDown
                    size={16}
                    className={`text-[#697386] transition-transform ${
                      openSections.types ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.types && (
                  <div className="mt-3 space-y-2.5">
                    <label className="flex items-center gap-2.5 text-[13px] text-[#4E4E4E] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.length === 0}
                        onChange={clearFilters}
                        className="h-4 w-4 rounded border-[#2D3A1B] text-red-500 focus:ring-[#2D3A1B]"
                      />
                      All Honeys ({allProducts.length})
                    </label>
                    {honeyTypes.map((type) => {
                      const count = allProducts.filter(
                        (p) => p.title === type
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
                            className="h-4 w-4 rounded border-[#E4E8EE] text-[#2D3A1B] focus:ring-[#2D3A1B]"
                          />
                          {type} ({count})
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Net Weight */}
              <div className="mt-6 border-t border-[#F0E4D0] pt-5">
                <button
                  type="button"
                  onClick={() => toggleSection("weight")}
                  className="flex w-full items-center justify-between"
                >
                  <p className="text-[14px] font-semibold text-[#2F241C]">
                    Net Weight
                  </p>
                  <ChevronDown
                    size={16}
                    className={`text-[#697386] transition-transform ${
                      openSections.weight ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.weight && (
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
                          className="h-4 w-4 rounded border-[#E4E8EE] text-[#2D3A1B] focus:ring-[#2D3A1B]"
                        />
                        {weight}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mt-6 border-t border-[#F0E4D0] pt-5">
                <button
                  type="button"
                  onClick={() => toggleSection("price")}
                  className="flex w-full items-center justify-between"
                >
                  <p className="text-[14px] font-semibold text-[#2F241C]">
                    Price Range
                  </p>
                  <ChevronDown
                    size={16}
                    className={`text-[#697386] transition-transform ${
                      openSections.price ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.price && (
                  <>
                    <div className="mt-4 flex items-center justify-between text-[13px] font-semibold text-[#2F241C]">
                      <span>₹{MIN_PRICE}</span>
                      <span>₹{priceRange}</span>
                    </div>
                    <input
                      type="range"
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="mt-2 w-full accent-[#2D3A1B]"
                    />
                  </>
                )}
              </div>

              {/* Apply Filter */}
              <button
                type="button"
                onClick={() => {}}
                className="mt-6 w-full rounded bg-[#2D3A1B] py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-[#C98715] transition-colors"
              >
                Apply Filter
              </button>
            </div>

            {/* ====== PROMO CARD ====== */}
            <div className="mt-6 overflow-hidden rounded-[14px] bg-[#1F3A2A] px-5 pt-6 pb-5 text-center text-white">
              <h3 className="font-serif text-[22px] leading-tight font-medium">
                Pure Honey.
                <br />
                <span className="text-white/80">Pure You.</span>
              </h3>
              <p className="mx-auto mt-3 max-w-[210px] text-[12px] leading-5 text-white/70">
                Boost your wellness with nature&apos;s sweetest gift.
              </p>
              <button
                type="button"
                className="mt-8 border border-white/40 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
              >
                Explore Benefits
              </button>

              <div className="relative mt-6 h-[280px] w-full overflow-hidden rounded-[12px]">
                <Image
                  src="/Promo.png"
                  alt="Bee on flower"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </aside>

          {/* ============ RIGHT: PRODUCT GRID ============ */}
          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                {/* ===== MAIN HEADING – Playfair Display ===== */}
                <h1 className="font-['Playfair_Display'] text-[30px] font-normal leading-[36px] tracking-normal text-[#1E392A]">
                  {getHeading()}
                </h1>
                <p className="mt-1 text-[14px] text-[#697386]">
                  Explore our range of natural honey variants.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[13px] text-[#A6ADB8]">
                  Showing {filteredProducts.length} of {filteredProducts.length}{" "}
                  results
                </span>
                <select className="h-10 rounded border border-[#E4E8EE] bg-white px-3 text-[13px] text-[#2F241C] focus:outline-none focus:ring-1 focus:ring-[#2D3A1B]">
                  <option>Sort by: Featured</option>
                  <option>Sort by: Price Low to High</option>
                  <option>Sort by: Price High to Low</option>
                </select>
              </div>
            </div>

            {/* ====== SELECTED FILTERS CHIPS ====== */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {selectedTypes.length === 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF3E4] px-3 py-1 text-[12px] font-medium text-[#1E392A]">
                  All Honeys
                </span>
              ) : (
                selectedTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#FBF3E4] px-3 py-1 text-[12px] font-medium text-[#1E392A]"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeTypeFilter(type)}
                      className="rounded-full p-0.5 hover:bg-[#2D3A1B]/10"
                    >
                      <X size={14} className="text-[#2D3A1B]" />
                    </button>
                  </span>
                ))
              )}

              {selectedWeights.map((weight) => (
                <span
                  key={weight}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F0E4D0] px-3 py-1 text-[12px] font-medium text-[#2F241C]"
                >
                  {weight}
                  <button
                    type="button"
                    onClick={() => toggleWeight(weight)}
                    className="rounded-full p-0.5 hover:bg-[#2F241C]/10"
                  >
                    <X size={14} className="text-[#2F241C]" />
                  </button>
                </span>
              ))}

              {priceRange < MAX_PRICE && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E0D8] px-3 py-1 text-[12px] font-medium text-[#2F241C]">
                  ₹{priceRange}
                  <button
                    type="button"
                    onClick={() => setPriceRange(MAX_PRICE)}
                    className="rounded-full p-0.5 hover:bg-[#2F241C]/10"
                  >
                    <X size={14} className="text-[#2F241C]" />
                  </button>
                </span>
              )}

              {(selectedTypes.length > 0 || selectedWeights.length > 0 || priceRange < MAX_PRICE) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[12px] font-medium text-[#697386] underline hover:text-[#2D3A1B]"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Product Grid */}
            <div className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <ProductCardShop
                      badge={item.badge}
                      image={item.image}
                      title={item.title}
                      subtitle={item.subtitle}
                      weight={item.weight}
                      price={item.price}
                      oldPrice={item.oldPrice}
                      rating={item.rating}
                      reviews={item.reviews}
                      quantity={cartItems[item.id] ?? 0}
                      onAddToCart={() => addToCart(item)}
                      onIncrement={() => updateQuantity(item, 1)}
                      onDecrement={() => updateQuantity(item, -1)}
                      onOpenDetails={() => router.push(`/shop/products/${item.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center text-[#697386]">
                <ShoppingCart size={32} className="text-[#2D3A1B]" />
                <p>No honey matches your filters right now.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[13px] font-semibold text-[#2D3A1B] underline"
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