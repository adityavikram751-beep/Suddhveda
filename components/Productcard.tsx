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
        rounded-2xl
        border
        border-[#F3E4CC]
        bg-white
        shadow-[0_2px_10px_rgba(0,0,0,0.04)]
        transition-all
        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(108,55,12,0.12)]
      `}
    >
      {badge && (
        <span
          className="
            absolute
            left-3
            top-3
            z-10
            rounded-full
            bg-[#D89A1B]
            px-3
            py-1
            text-[11px]
            font-semibold
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
          right-3
          top-3
          z-10
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-white/90
          shadow-sm
          transition-colors
          hover:bg-white
        "
      >
        <Heart size={15} className="text-[#B59A78]" />
      </button>

      <div className="relative aspect-square w-full bg-[#FFF8EF]">
        <Image src={image} alt={title} fill className="object-contain p-3" />
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5">
        <p className="text-[11px] text-[#B59A78]">
          Raw - Unfiltered - Wilderness
        </p>

        <h3 className="mt-0.5 text-[15px] font-semibold text-[#3C2015]">
          {title}
        </h3>

        <p className="text-[12px] text-[#B59A78]">{weight}</p>

        <div className="mt-1.5 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < Math.round(rating)
                  ? "fill-[#D89A1B] text-[#D89A1B]"
                  : "fill-[#E8D5BA] text-[#E8D5BA]"
              }
            />
          ))}
          <span className="ml-1 text-[11px] text-[#B59A78]">({reviews})</span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-[16px] font-bold text-[#3C2015]">
            Rs.{price}
          </span>
          {!!oldPrice && (
            <span className="text-[13px] text-[#B59A78] line-through">
              Rs.{oldPrice}
            </span>
          )}
          {discount && (
            <span className="text-[11px] font-medium text-[#D89A1B]">
              {discount}
            </span>
          )}
        </div>

        {quantity > 0 ? (
          <div
            onClick={(event) => event.stopPropagation()}
            className="
              mt-2.5
              grid
              h-10
              grid-cols-[40px_1fr_40px]
              items-center
              rounded-xl
              border
              border-[#D89A1B]
              bg-white
              text-[#D89A1B]
            "
          >
            <button
              type="button"
              aria-label="Remove one item"
              onClick={onDecrement}
              className="flex h-full items-center justify-center rounded-l-xl hover:bg-[#FFF2D8]"
            >
              {quantity === 1 ? <Trash2 size={15} /> : <Minus size={15} />}
            </button>
            <span className="text-center text-[13px] font-semibold text-[#9A5A05]">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Add one more item"
              onClick={onIncrement}
              className="flex h-full items-center justify-center rounded-r-xl hover:bg-[#FFF2D8]"
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
              mt-2.5
              flex
              w-full
              items-center
              justify-center
              gap-1.5
              whitespace-nowrap
              rounded-xl
              bg-[#D89A1B]
              py-2
              text-[13px]
              font-semibold
              text-white
              transition-colors
              hover:bg-[#C98715]
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
