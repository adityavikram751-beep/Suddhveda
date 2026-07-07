"use client";

import Image from "next/image";
import { Star, ShoppingBag, ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    badge: "BESTSELLER",
    badgeColor: "bg-[#2E1E16] text-white",
    image: "/product1.png", // apni image daalo
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
    badgeColor: "bg-[#2E1E16] text-white",
    image: "/product2.png",
    name: "Minimal Luxe",
    subtitle: "Box",
    price: "1,299",
    rating: "4.8",
    features: ["Single Origin Honey (1kg)", "Wooden Dipper", "Greeting Card"],
  },
];

export default function FeaturedCollection() {
  return (
    <section className="relative bg-[#FDF1E3] py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.15em] text-[#D89A1B]">
              OUR FEATURED COLLECTION
            </p>
            <h2 className="text-[30px] md:text-[36px] font-serif text-[#2E1E16] mt-2">
              Thoughtfully Curated Gift Boxes
            </h2>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 text-[14px] font-medium tracking-[0.05em] text-[#2E1E16] hover:text-[#D89A1B] transition-colors"
          >
            <span>VIEW ALL</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Image with overlay */}
              <div className="relative w-full aspect-[4/3] bg-[#f5ede4]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover p--1 " // p-4 se image andar shift ho jaati hai, jaise image mein
                  onError={(e) => {
                    // Agar image load na ho to placeholder
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x300?text=Honey";
                  }}
                />
                {/* ShudhVeda watermark - bottom-right */}
                
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
                {/* Title: name + subtitle in two lines */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[17px] font-medium text-[#2E1E16] leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[17px] text-[#2E1E16] leading-tight">
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
                  <span className="text-[13px] font-medium text-[#2E1E16]">
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
                  <button className="flex-1 border border-[#2E1E16]/20 rounded-lg py-2.5 text-[13px] font-medium text-[#2E1E16] hover:bg-[#2E1E16] hover:text-white transition-colors">
                    View Details
                  </button>
                  <button className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#D89A1B] hover:bg-[#C48912] transition-colors">
                    <ShoppingBag size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}