// app/shop/products/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Star, Minus, Plus, ShoppingBag, Truck, Shield, Leaf } from "lucide-react";

// Sample product data - replace with your actual data
const productData = {
  1: {
    id: 1,
    name: "Lychee Honey",
    price: 649,
    originalPrice: 720,
    rating: 4.8,
    reviews: 30,
    description: "Delicate & fruity with natural sweetness. Sourced from Bihar Orchards.",
    badge: "BESTSELLER",
    image: "/product1.png",
    weight: ["250g", "500g", "1kg"],
    weightPrices: {
      "250g": 243,
      "500g": 380,
      "1kg": 1084,
    },
    features: ["Sourced from Bihar Orchards", "Raw & Pure", "No Heat", "No Chemicals"],
    tasteNote: "Fruity, sweet, tropical",
    sweetness: "Sweetest, rich aftertaste",
    crystallization: "Might crystallize",
    delivery: "Enter your pincode for delivery details",
  },
  2: {
    id: 2,
    name: "Luxury Honey",
    price: 2499,
    originalPrice: 2799,
    rating: 4.9,
    reviews: 45,
    description: "Premium honey with rich flavor and aroma.",
    badge: "PREMIUM",
    image: "/product2.png",
    weight: ["500g", "1kg"],
    weightPrices: {
      "500g": 999,
      "1kg": 2499,
    },
    features: ["Pure & Natural", "No Additives", "Rich Flavor"],
    tasteNote: "Rich, bold, complex",
    sweetness: "Medium sweet",
    crystallization: "Slow crystallization",
    delivery: "Free delivery on orders above ₹500",
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const product = productData[productId as keyof typeof productData];

  const [selectedWeight, setSelectedWeight] = useState("500g");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8EF]">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-[#2D3A1B]">Product not found</h2>
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-[#2D3A1B] underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8EF] py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="text-sm text-[#8D7F73] mb-6">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-[#2D3A1B]">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Product Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f5ede4]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#2D3A1B] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Features below image */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {product.features.map((feature, i) => (
                <div key={i} className="text-center p-3 bg-white rounded-xl shadow-sm">
                  <div className="text-[11px] text-[#8D7F73] leading-tight">
                    {feature}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div>
            {/* Title & Price */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[32px] font-serif text-[#2D3A1B]">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={18} className="fill-[#2D3A1B] text-[#2D3A1B]" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <span className="text-[#8D7F73] text-sm">
                    Reviews: {product.reviews}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[28px] font-bold text-[#2D3A1B]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <div className="text-[16px] text-[#8D7F73] line-through">
                    M.R.P: ₹{product.originalPrice}
                  </div>
                )}
                {product.originalPrice && (
                  <div className="text-[14px] text-green-600 font-medium">
                    You Save ₹{product.originalPrice - product.price}
                  </div>
                )}
              </div>
            </div>

            <p className="mt-4 text-[15px] text-[#6F665F] leading-relaxed">
              {product.description}
            </p>

            {/* Delivery Details */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-[#E6D2B8]/30">
              <div className="flex items-center gap-2 text-[14px] font-medium text-[#2D3A1B]">
                <Truck size={18} />
                Delivery Details
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Enter your pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[#E6D2B8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3A1B]"
                />
                <button className="px-6 py-2 bg-[#2D3A1B] text-white rounded-lg text-sm font-semibold hover:bg-[#C48912] transition-colors">
                  Check
                </button>
              </div>
            </div>

            {/* Weight Options */}
            <div className="mt-6">
              <h3 className="text-[14px] font-semibold text-[#2D3A1B] mb-3">Weight</h3>
              <div className="flex flex-wrap gap-3">
                {product.weight.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedWeight === w
                        ? "border-[#2D3A1B] bg-[#2D3A1B]/10 text-[#2D3A1B] font-semibold"
                        : "border-[#E6D2B8] hover:border-[#2D3A1B]"
                    }`}
                  >
                    <div className="text-[14px]">{w}</div>
                    <div className="text-[12px] text-[#8D7F73]">
                      ₹{product.weightPrices[w as keyof typeof product.weightPrices]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-[#E6D2B8] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-[#F5EDE2] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 min-w-[40px] text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-[#F5EDE2] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button className="flex-1 bg-[#2D3A1B] text-white py-3 rounded-lg font-semibold hover:bg-[#C48912] transition-colors flex items-center justify-center gap-2">
                <ShoppingBag size={18} />
                Add to Cart
              </button>
            </div>

            {/* Buy It Now */}
            <button className="w-full mt-3 py-3 rounded-lg border-2 border-[#2D3A1B] text-[#2D3A1B] font-semibold hover:bg-[#2D3A1B] hover:text-white transition-colors">
              Buy It Now
            </button>

            {/* Weather Alert */}
            <div className="mt-4 p-3 bg-[#FEF3C7] rounded-lg border border-[#F59E0B]/30">
              <p className="text-[13px] text-[#92400E]">
                ⚠️ Weather Alert: Due to heavy rainfall, please expect slight delays in deliveries. Thank you for your patience!
              </p>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-8">
              <div className="border-b border-[#E6D2B8]">
                <div className="flex gap-6">
                  {["Description", "Nutritional Info", "Product Details", "Benefits", "Ecosystem"].map((tab) => (
                    <button
                      key={tab}
                      className="pb-3 text-[13px] font-medium text-[#6F665F] hover:text-[#2D3A1B] border-b-2 border-transparent hover:border-[#2D3A1B] transition-colors"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-[14px] text-[#6F665F] leading-relaxed">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}