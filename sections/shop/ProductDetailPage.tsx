"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Star,
  ShoppingCart,
  MapPin,
  Plus,
  Minus,
  Leaf,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import ProductCard from "@/components/Productcard";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts, type Product } from "@/lib/shop-data";

export default function ProductDetailPage({ product }: { product: Product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const router = useRouter();
  const quantity = cartItems[product.id] ?? 1;

  const [selectedWeight, setSelectedWeight] = useState("500-gm");
  const [pincode, setPincode] = useState("");

  const weightOptions = [
    { label: "500-gm", price: 649 },
    { label: "250-gm", price: 369 },
    { label: "1 KG", price: 1094 },
  ];

  const recommendations = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const compareTabs = [
    "Description",
    "Nutritional Info",
    "Product Details",
    "Benefits Raw Honey",
    "Ecosystem Advantage",
  ];

  return (
    <main className="bg-[#FFF8F0] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* MAIN GRID: IMAGE + DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT - Image */}
          <div className="bg-[#FFF5E6] rounded-2xl p-8 flex items-center justify-center relative min-h-[400px]">
            <Image
              src={product.image}
              alt={product.title}
              width={400}
              height={400}
              className="object-contain w-full max-h-[450px]"
            />
          </div>

          {/* RIGHT - Product Details */}
          <div className="space-y-5">
            {/* Title */}
            <h1 className="text-3xl font-bold text-[#2F241C]">Lychee Honey</h1>
            
            {/* Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} size={16} className="fill-[#B8860B] text-[#B8860B]" />
                ))}
              </div>
              <span className="text-sm text-gray-600">Reviews: 30</span>
            </div>

            {/* Price */}
            <div>
              <p className="text-sm text-gray-400 line-through">M-8-8-8-820</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#2F241C]">£649</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  You Save £71
                </span>
              </div>
              <p className="text-xs text-gray-500">Taxes included. Shipping calculated at checkout.</p>
            </div>

            <hr className="border-[#E8D5BA]" />

            {/* Delivery Details */}
            <div>
              <h3 className="text-sm font-bold text-[#2F241C] mb-2">Delivery Details</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8860B] bg-white"
                />
                <button className="bg-[#B8860B] text-white px-8 py-2 rounded text-sm font-bold hover:bg-[#A0750A] transition-colors">
                  CHECK
                </button>
              </div>
            </div>

            <hr className="border-[#E8D5BA]" />

            {/* Weight Selection */}
            <div>
              <h3 className="text-sm font-bold text-[#2F241C] mb-2">Weight</h3>
              <div className="space-y-2">
                {weightOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setSelectedWeight(option.label)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded border transition-all ${
                      selectedWeight === option.label
                        ? "border-[#B8860B] bg-[#FFF8F0]"
                        : "border-gray-200 hover:border-[#B8860B]"
                    }`}
                  >
                    <span className="text-sm font-medium text-[#2F241C]">{option.label}</span>
                    <span className="text-sm font-bold text-[#2F241C]">£{option.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-[#E8D5BA]" />

            {/* Quantity + ADD TO CART */}
            <div>
              <h3 className="text-sm font-bold text-[#2F241C] mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product, -1)}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600 font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-medium text-sm min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product, 1)}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-gray-600 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-[#B8860B] text-white py-2.5 px-6 rounded-lg font-bold hover:bg-[#A0750A] transition-colors text-sm tracking-wide"
                >
                  ADD TO CART
                </button>
              </div>
            </div>

            {/* BUY IT NOW */}
            <button
              onClick={() => {
                addToCart(product);
                router.push("/cart");
              }}
              className="w-full bg-[#2F241C] text-white py-3 rounded-lg font-bold hover:bg-[#1a130f] transition-colors text-sm tracking-wide"
            >
              BUY IT NOW
            </button>

            <hr className="border-[#E8D5BA]" />

            {/* Weather Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                <strong>Weather Alert:</strong> Due to heavy rainfall, please expect slight delays in deliveries. Thank you for your patience!
              </p>
            </div>

            {/* Source Info */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 bg-white rounded-lg px-4 py-2.5 border border-gray-100">
              <Leaf size={14} className="text-[#B8860B]" />
              <span>Sourced from Bihar Orchards</span>
              <span className="text-gray-300">|</span>
              <Droplets size={14} className="text-[#B8860B]" />
              <span>Raw & Pure</span>
              <span className="text-gray-300">|</span>
              <Thermometer size={14} className="text-[#B8860B]" />
              <span>No Heat</span>
              <span className="text-gray-300">|</span>
              <ShieldCheck size={14} className="text-[#B8860B]" />
              <span>No chemicals</span>
            </div>

            <hr className="border-[#E8D5BA]" />

            {/* Tasting Notes Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">AROMA</p>
                <p className="text-sm font-medium text-[#2F241C]">Tropical, fruity</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">TASTE NOTE</p>
                <p className="text-sm font-medium text-[#2F241C]">Fruity, sweet, tropical</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">SWEETNESS</p>
                <p className="text-sm font-medium text-[#2F241C]">Sweetest, rich aftertaste</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wider">CRYSTALLIZATION</p>
                <p className="text-sm font-medium text-[#2F241C]">Might crystallize</p>
              </div>
            </div>
          </div>
        </div>

        {/* COMPARE HONEY FLORA */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#2F241C] mb-4">Compare honey Flora</h2>
          
          <div className="flex flex-wrap gap-1 mb-6">
            {compareTabs.map((tab) => (
              <button
                key={tab}
                className="px-4 py-2 text-sm text-[#2F241C] hover:bg-gray-100 rounded transition-colors"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#2F241C] mb-3">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sourced from the deep wild forests, our Wild Forest Honey is 100% raw, unfiltered and unprocessed.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#2F241C] mb-3">Nutritional Info</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Calories:</span> <span className="font-medium">305 kcal</span></p>
                <p><span className="text-gray-500">Carbohydrates:</span> <span className="font-medium">82g</span></p>
                <p><span className="text-gray-500">Sugars:</span> <span className="font-medium">82g</span></p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#2F241C] mb-3">Product Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Brand:</span> <span className="font-medium">ShuddhiVeda</span></p>
                <p><span className="text-gray-500">Form:</span> <span className="font-medium">Raw Honey</span></p>
                <p><span className="text-gray-500">Organic:</span> <span className="font-medium text-green-600">Yes</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <section className="mt-16">
          <h2 className="mb-9 text-[42px] font-bold text-[#2D3A1B]">Recommendation</h2>
          <div className="bg-white/45 p-5">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </section>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(product, -1)}
              className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold"
            >
              −
            </button>
            <span className="px-3 py-2 text-sm font-medium min-w-[30px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product, 1)}
              className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold"
            >
              +
            </button>
          </div>
          <button
            onClick={() => {
              addToCart(product);
              router.push("/cart");
            }}
            className="flex-1 bg-[#B8860B] text-white py-2.5 rounded-lg font-bold text-sm"
          >
            Add to Cart · £{product.price}
          </button>
        </div>
      </div>
    </main>
  );
}