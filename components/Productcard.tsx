"use client";

import Image from "next/image";
import { Heart, Minus, Plus, ShoppingCart, Star, Trash2 } from "lucide-react";

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
  quantity?: number;
  onAddToCart?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onOpenDetails?: () => void;
};

export default function ProductCard({
  badge,
  image,
  title,
  subtitle,
  weight,
  price,
  oldPrice,
  discount,
  rating,
  reviews,
  quantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement,
  onOpenDetails,
}: ProductCardProps) {
  const isClickable = Boolean(onOpenDetails);

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onOpenDetails}
      onKeyDown={(event) => {
        if (isClickable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpenDetails?.();
        }
      }}
      className={`
        relative
        flex
        h-full
        ${isClickable ? "cursor-pointer" : ""}
        flex-col
        overflow-hidden
        rounded-[22px]
        bg-white
        shadow-[0_4px_18px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_14px_32px_rgba(108,55,12,0.14)]
      `}
    >
      {/* Image area */}
      <div className="relative bg-[#FBEEDF] px-5 pt-5 pb-6">
        {badge && (
          <span
            className="
              absolute
              top-4
              left-4
              z-10
              rounded-full
              bg-[#F07B1D]
              px-3
              py-1
              text-[13px]
              font-medium
              text-white
            "
          >
            {badge}
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(event) => event.stopPropagation()}
          className="
            absolute
            top-4
            right-4
            z-10
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white/70
            transition-colors
            duration-200
            hover:bg-white
          "
        >
          <Heart
            size={18}
            strokeWidth={1.75}
            className="text-[#B0B0B0] transition-colors duration-200 hover:text-[#F07B1D]"
          />
        </button>

        <div className="relative aspect-square w-full">
          <Image src={image} alt={title} fill className="object-contain" />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <p className="text-[14px] text-[#8A8A8A]">
          {subtitle ?? "Raw • Unfiltered • Wilderness"}
        </p>

        <h3 className="mt-1 text-[20px] font-bold text-[#233821]">
          {title}
        </h3>

        <p className="mt-1 text-[14px] text-[#8A8A8A]">{weight}</p>

        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              strokeWidth={1.5}
              className={
                i < Math.round(rating)
                  ? "fill-[#F0A826] text-[#F0A826]"
                  : "fill-transparent text-[#C9C9C9]"
              }
            />
          ))}
          <span className="ml-1 text-[14px] text-[#8A8A8A]">({reviews})</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[20px] font-bold text-[#F07B1D]">
            ₹{price}
          </span>
          {!!oldPrice && (
            <span className="text-[16px] text-[#B0B0B0] line-through">
              ₹{oldPrice}
            </span>
          )}
          {discount && (
            <span
              className="
                rounded-full
                border
                border-[#3E8E4F]
                px-3
                py-[3px]
                text-[13px]
                font-medium
                text-[#3E8E4F]
                whitespace-nowrap
              "
            >
              {discount}
            </span>
          )}
        </div>

        {quantity > 0 ? (
          <div
            onClick={(event) => event.stopPropagation()}
            className="
              mt-3
              grid
              h-10
              grid-cols-[40px_1fr_40px]
              items-center
              rounded-xl
              border
              border-[#F07B1D]
              bg-white
              text-[#F07B1D]
            "
          >
            <button
              type="button"
              aria-label="Remove one item"
              onClick={onDecrement}
              className="flex h-full items-center justify-center rounded-l-xl transition-colors duration-200 hover:bg-[#FFF1E1]"
            >
              {quantity === 1 ? <Trash2 size={15} /> : <Minus size={15} />}
            </button>
            <span className="text-center text-[13px] font-semibold text-[#233821]">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Add one more item"
              onClick={onIncrement}
              className="flex h-full items-center justify-center rounded-r-xl transition-colors duration-200 hover:bg-[#FFF1E1]"
            >
              <Plus size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart?.();
            }}
            className="
              mt-3
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              whitespace-nowrap
              rounded-xl
              bg-[#F07B1D]
              py-2
              text-[13px]
              font-semibold
              text-white
              transition-colors
              duration-200
              hover:bg-[#D96A0F]
            "
          >
            <ShoppingCart size={14} className="shrink-0" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}