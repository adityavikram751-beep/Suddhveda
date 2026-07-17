"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Star,
  Leaf,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Info,
  Droplet,
  Box,
  Heart,
  ChevronDown,
  ChevronUp,
  Wind,
  Coffee,
  Snowflake,
  Share2,
} from "lucide-react";
import ProductCard from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts, type Product } from "@/lib/shop-data";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

const weightOptions = [
  { label: "500-gm", price: 649 },
  { label: "250-gm", price: 369 },
  { label: "1 KG", price: 1094 },
];

const accordionSections = [
  {
    key: "description",
    icon: Info,
    title: "Description",
    content:
      "Our honey is harvested straight from the hive and bottled without heat processing, preserving its natural enzymes, aroma, and nutrients.",
  },
  {
    key: "nutrition",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D08722" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>
    ),
    title: "Nutritional Info",
    content:
      "Per 100g: Energy ~304 kcal, Carbohydrates 82g, Sugars 82g, Protein 0.3g, Fat 0g. Values may vary slightly by batch.",
  },
  {
    key: "details",
    icon: Box,
    title: "Product Details",
    content:
      "100% raw and unfiltered honey, cold-extracted and packed in food-grade glass jars. No additives, no preservatives.",
  },
  {
    key: "benefits",
    icon: Heart,
    title: "Benefits Raw Honey",
    content:
      "Raw honey retains natural antioxidants, enzymes, and pollen that are typically lost in commercial processing, supporting immunity and gut health.",
  },
  {
    key: "ecosystem",
    icon: Heart,
    title: "Ecosystem Advantage",
    content:
      "Every jar supports local beekeepers and sustainable pollination practices, helping protect bee populations and local biodiversity.",
  },
];

export default function ProductDetailPage({ product }: { product: Product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const router = useRouter();
  const quantity = cartItems[product.id] ?? 1;

  const [selectedWeight, setSelectedWeight] = useState("500-gm");
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [openSection, setOpenSection] = useState<string | null>(null);

  const selected =
    weightOptions.find((w) => w.label === selectedWeight) ?? weightOptions[0];

  const recommendations = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const handleCheckPincode = () => {
    if (!pincode.trim()) {
      setPincodeStatus({
        type: "error",
        message: "Please enter a valid pincode.",
      });
      return;
    }
    const isPincodeValid = /^[1-9][0-9]{5}$/.test(pincode.trim());
    if (!isPincodeValid) {
      setPincodeStatus({
        type: "error",
        message: "Invalid pincode structure. Enter 6 digits.",
      });
      return;
    }
    setPincodeStatus({
      type: "success",
      message: "Standard delivery available at this location.",
    });
  };

  return (
    <main className={`bg-white min-h-screen text-[#2F241C] ${inter.className}`}>
      <div className="max-w-[1350px] mx-auto px-4 py-6">
        {/* MAIN GRID: THUMBNAILS + IMAGE + DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_1fr] gap-8">
          {/* THUMBNAILS */}
          <div className="hidden lg:flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                className={`h-[68px] w-[68px] overflow-hidden rounded border bg-white transition-colors ${
                  i === 0
                    ? "border-[#F1592B]"
                    : "border-[#EEE7DA] hover:border-[#B8860B]"
                }`}
              >
                <Image
                  src={product.image}
                  alt={`${product.title} thumbnail ${i + 1}`}
                  width={68}
                  height={68}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="bg-[#FFF5E6] rounded-2xl p-8 flex items-center justify-center relative h-[630px]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          {/* PRODUCT DETAILS */}
          <div className="space-y-6 relative bg-white">
            {/* Title Row */}
            <div className="flex justify-between items-start w-full">
              <h1 className={`${playfair.className} text-[42px] font-medium text-[#1E1E1E] leading-tight tracking-normal`}>
                Lychee Honey
              </h1>
              <button
                type="button"
                aria-label="Share product"
                className="text-gray-400 hover:text-[#B8860B] transition-colors mt-3 mr-1"
              >
                <Share2 size={22} className="stroke-[1.5]" />
              </button>
            </div>

            {/* Reviews & 10% OFF Badge */}
            <div className="flex justify-between items-center w-full">
              <span className="text-[14px] text-[#7A7A7A] font-normal tracking-wide">
                Reviews: 30
              </span>
              <span className="bg-[#FF6F3C] text-white text-[11px] font-bold px-3 py-1.5 rounded tracking-wide uppercase">
                10% OFF
              </span>
            </div>

            {/* M.R.P & Price block */}
            <div className="space-y-1">
              <div className="relative inline-flex items-center text-[13px] text-[#9E9E9E] font-normal">
                <span>M.R.P ₹720</span>
                <span className="absolute left-0 right-[-45px] top-1/2 h-[1px] bg-[#9E9E9E]"></span>
              </div>
              <div className="text-[44px] font-bold text-[#2A2420] leading-none tracking-tight pt-1">
                ₹649
              </div>
              <div className="text-[14px] font-bold text-[#FF6F3C] tracking-wide">
                You Save ₹71
              </div>
              <p className="text-[13px] text-[#909090] font-normal mt-1">
                Taxes included. <span className="underline cursor-pointer decoration-gray-400">Shipping</span> calculated at checkout.
              </p>
            </div>

            {/* Delivery Details Container */}
            <div className="space-y-2">
              <h3 className="text-[14px] font-bold text-[#3F3F3F] tracking-normal">
                Delivery Details
              </h3>
              <div className="flex border border-[#E3DCCE] rounded overflow-hidden bg-white max-w-xl">
                <input
                  type="text"
                  placeholder="Enter your pincode"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    if (pincodeStatus.type) setPincodeStatus({ type: null, message: "" });
                  }}
                  className="flex-1 px-4 py-3 text-[15px] placeholder-gray-400 font-normal focus:outline-none bg-white text-gray-800"
                />
                <button 
                  onClick={handleCheckPincode}
                  className="bg-[#241A14] text-white px-9 py-3 text-[13px] font-bold hover:bg-black transition-colors tracking-widest uppercase flex-shrink-0"
                >
                  CHECK
                </button>
              </div>
              {pincodeStatus.type && (
                <p className={`text-[12px] mt-1 ${
                  pincodeStatus.type === "success" ? "text-green-600" : "text-red-500"
                }`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Weight Selection Section */}
            <div className="space-y-3 pt-1">
              <h3 className="text-[15px] font-medium text-[#3F3F3F] tracking-normal">Weight</h3>
              <div className="flex gap-4">
                {weightOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setSelectedWeight(option.label)}
                    className={`flex flex-col items-center rounded-md border w-[105px] py-3.5 bg-white transition-all ${
                      selectedWeight === option.label
                        ? "border-[#FF6F3C] ring-[1px] ring-[#FF6F3C]"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-[13px] font-normal text-gray-600">
                      {option.label}
                    </span>
                    <div className="relative my-2 h-[38px] w-[38px] overflow-hidden rounded">
                      <Image
                        src={product.image}
                        alt={option.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[13px] font-normal text-gray-600">
                      ₹{option.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Primary Buttons Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[15px] font-medium text-[#3F3F3F] tracking-normal">Quantity</h3>
              
              {/* Row: Box + ADD TO CART */}
              <div className="flex gap-4 max-w-xl">
                <div className="flex items-center border border-gray-200 rounded bg-white w-[180px] h-[56px] px-2">
                  <button
                    onClick={() => updateQuantity(product, -1)}
                    className="p-2 text-gray-400 hover:text-gray-600 text-xl font-light"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-normal text-[15px] text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product, 1)}
                    className="p-2 text-gray-400 hover:text-gray-600 text-xl font-light"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-[#FF6F3C] text-white h-[56px] rounded font-semibold hover:bg-[#D64A20] transition-colors text-[14px] tracking-wider uppercase"
                >
                  ADD TO CART
                </button>
              </div>

              {/* Full Width Buy It Now */}
              <button
                onClick={() => {
                  addToCart(product);
                  router.push("/cart");
                }}
                className="w-full max-w-xl border border-[#FF6F3C] text-[#FF6F3C] h-[54px] rounded font-semibold hover:bg-[#FFF3EE] transition-colors text-[14px] tracking-wider uppercase bg-white block text-center mt-3"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Weather Alert */}
            <div className="bg-[#FFF8F5] border-l-[3px] border-[#FF6F3C] p-5 flex items-start gap-3 max-w-xl rounded-r">
              <p className="text-[13px] text-[#555555] font-normal leading-relaxed">
                <strong>Weather Alert:</strong> Due to heavy rainfall, please expect
                slight delays in deliveries. Thank you for your patience!
              </p>
            </div>

            {/* Source Info metadata string */}
            <p className="text-[13px] text-[#6F6F6F] font-normal italic pt-1 max-w-xl">
              Sourced from Bihar Orchards | Raw & Pure | No Heat | No chemicals
            </p>

            {/* Tasting Notes Block Grid - Exact Border Layout */}
            <div className="grid grid-cols-2 border border-[#E8E2D5] bg-white overflow-hidden max-w-xl rounded-sm">
              <div className="p-5 border-r border-b border-[#E8E2D5]">
                <TastingItem
                  icon={
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-700 fill-none stroke-current stroke-2"><circle cx="12" cy="12" r="9" strokeDasharray="3 3"/></svg>
                  }
                  label="AROMA"
                  value="Tropical, fruity"
                />
              </div>
              <div className="p-5 border-b border-[#E8E2D5]">
                <TastingItem
                  icon={
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-700 fill-none stroke-current stroke-2"><line x1="5" y1="9" x2="19" y2="9"/><line x1="5" y1="15" x2="19" y2="15"/></svg>
                  }
                  label="TASTE NOTE"
                  value="Fruity, sweet, tropical"
                />
              </div>
              <div className="p-5 border-r border-[#E8E2D5]">
                <TastingItem
                  icon={
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-700 fill-none stroke-current stroke-2"><circle cx="12" cy="12" r="8"/></svg>
                  }
                  label="SWEETNESS"
                  value="Sweetest, rich aftertaste"
                />
              </div>
              <div className="p-5">
                <TastingItem
                  icon={
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gray-700 fill-none stroke-current stroke-2"><path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
                  }
                  label="CRYSTALLIZATION"
                  value="Might crystallize"
                />
              </div>
            </div>

            {/* Compare Honey Section Links & Accordions */}
            <div className="pt-6 max-w-xl">
              <div className="w-full text-center mb-6">
                <a
                  href="#compare"
                  className="text-[24px] font-normal text-black underline underline-offset-8 tracking-wide inline-block"
                >
                  Compare honey Flora
                </a>
              </div>
              
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {accordionSections.map((section) => {
                  const Icon = section.icon;
                  const isOpen = openSection === section.key;
                  return (
                    <div key={section.key} className="py-0.5">
                      <button
                        onClick={() => setOpenSection(isOpen ? null : section.key)}
                        className="flex w-full items-center justify-between py-4 text-left"
                      >
                        <span className="flex items-center gap-3.5 text-gray-800">
                          <Icon size={20} className="text-[#D08722] stroke-[1.5]" />
                          <span className={`${playfair.className} text-[24px] tracking-wide text-gray-700`}>
                            {section.title}
                          </span>
                        </span>
                        {isOpen ? (
                          <ChevronUp size={18} className="text-gray-800" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="pb-4 pl-9 text-[14px] leading-relaxed text-gray-600 font-normal">
                          {section.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* USES OF HONEY BANNER */}
        <div className="mt-14 w-full overflow-hidden rounded-xl">
          <Image
            src="/idcard.png"
            alt="Uses of Honey"
            width={1400}
            height={500}
            className="w-full object-cover"
          />
        </div>

        {/* RECOMMENDATIONS */}
        <section className="mt-16">
          <h2 className={`mb-9 text-[32px] font-bold text-[#2F241C] ${playfair.className}`}>
            Recommendation
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((item) => (
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
        </section>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden shadow-lg z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
            <button
              onClick={() => updateQuantity(product, -1)}
              className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-medium"
            >
              −
            </button>
            <span className="px-3 py-2 text-sm font-normal min-w-[30px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product, 1)}
              className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-medium"
            >
              +
            </button>
          </div>
          <button
            onClick={() => {
              addToCart(product);
              router.push("/cart");
            }}
            className="flex-1 bg-[#FF6F3C] text-white py-3 rounded font-bold text-sm tracking-wide"
          >
            Add to Cart · ₹{selected.price}
          </button>
        </div>
      </div>
    </main>
  );
}

function TastingItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#3F3F3F]">
          {label}
        </p>
        <p className="text-[14px] font-medium text-gray-600 mt-1">{value}</p>
      </div>
    </div>
  );
}