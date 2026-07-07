"use client";

import Image from "next/image";
import { Heart, Star, ShoppingCart } from "lucide-react";

type ProductCardProps = {
  badge?: string;
  image: string;
  title: string;
  subtitle?: string;
  weight: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
};

export default function ProductCard({
  badge,
  image,
  title,
  weight,
  price,
  oldPrice,
  discount,
  rating,
  reviews,
}: ProductCardProps) {
  return (
    <div
      className="
        relative
        flex
        flex-col
        bg-white
        rounded-2xl
        border
        border-[#F3E4CC]
        overflow-hidden
        shadow-[0_2px_10px_rgba(0,0,0,0.04)]
        h-full
      "
    >
      {/* Badge */}
      {badge && (
        <span
          className="
            absolute
            top-3
            left-3
            z-10
            bg-[#D89A1B]
            text-white
            text-[11px]
            font-semibold
            px-3
            py-1
            rounded-full
          "
        >
          {badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        className="
          absolute
          top-3
          right-3
          z-10
          w-8
          h-8
          rounded-full
          bg-white/90
          flex
          items-center
          justify-center
          shadow-sm
          hover:bg-white
          transition-colors
        "
      >
        <Heart size={15} className="text-[#B59A78]" />
      </button>

      {/* Image */}
      <div className="relative w-full aspect-square bg-[#FFF8EF]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-3"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-3.5 pb-3.5">

        <p className="text-[11px] text-[#B59A78]">
          Raw • Unfiltered • Wilderness
        </p>

        <h3 className="mt-0.5 text-[15px] font-semibold text-[#3C2015]">
          {title}
        </h3>

        <p className="text-[12px] text-[#B59A78]">
          {weight}
        </p>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < Math.round(rating)
                  ? "text-[#D89A1B] fill-[#D89A1B]"
                  : "text-[#E8D5BA] fill-[#E8D5BA]"
              }
            />
          ))}
          <span className="text-[11px] text-[#B59A78] ml-1">
            ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-[16px] font-bold text-[#3C2015]">
            ₹{price}
          </span>
          {!!oldPrice && (
            <span className="text-[13px] text-[#B59A78] line-through">
              ₹{oldPrice}
            </span>
          )}
          {discount && (
            <span className="text-[11px] font-medium text-[#D89A1B]">
              {discount}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          className="
            mt-2.5
            w-full
            flex
            items-center
            justify-center
            gap-1.5
            bg-[#D89A1B]
            hover:bg-[#C98715]
            text-white
            text-[13px]
            font-semibold
            py-2
            rounded-xl
            transition-colors
            whitespace-nowrap
          "
        >
          <ShoppingCart size={14} className="shrink-0" />
          Add to Cart
        </button>

      </div>
    </div>
  );
}