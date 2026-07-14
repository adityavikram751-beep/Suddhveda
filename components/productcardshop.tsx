"use client";

import Image from "next/image";
import { ShoppingCart, Minus, Plus } from "lucide-react";

type ProductCardShopProps = {
  badge?: string;
  image: string;
  title: string;
  subtitle?: string;
  weight?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  quantity: number;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onOpenDetails: () => void;
};

const weightOptions = ["250g", "500g", "1kg"];

export default function ProductCardShop({
  badge,
  image,
  title,
  subtitle,
  price,
  oldPrice,
  quantity,
  onAddToCart,
  onIncrement,
  onDecrement,
  onOpenDetails,
}: ProductCardShopProps) {
  return (
    <div className="flex flex-col rounded-lg border border-[#F0E4D0] bg-white p-4 shadow-sm">
      {/* Image */}
      <button
        type="button"
        onClick={onOpenDetails}
        className="relative h-[200px] w-full overflow-hidden rounded-lg bg-[#FBF3E3]"
      >
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded bg-[#1F2B1B] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {badge}
          </span>
        )}
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-3"
        />
      </button>

      {/* Text */}
      <div className="mt-4 text-center">
        <button type="button" onClick={onOpenDetails}>
          <h3 className="font-serif text-[19px] text-[#1E392A] hover:underline">
            {title}
          </h3>
        </button>
        {subtitle && (
          <p className="mt-1 text-[13px] text-[#9A9A9A]">{subtitle}</p>
        )}

        <div className="mt-2 text-[16px] font-bold text-[#1E392A]">
          ₹{price}
          {oldPrice && (
            <>
              {" "}
              <span className="mx-0.5 font-normal text-[#9A9A9A]">—</span>{" "}
              ₹{oldPrice}
            </>
          )}
        </div>

        {/* Weight options */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {weightOptions.map((w) => (
            <span
              key={w}
              className="rounded border border-[#E4E8EE] px-3 py-1.5 text-[12px] text-[#4E4E4E]"
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Add to cart row */}
      <div className="mt-4 flex items-center gap-2">
        {quantity > 0 ? (
          <div className="flex flex-1 items-center justify-between rounded bg-[#D89A1B] px-4 py-3 text-white">
            <button type="button" onClick={onDecrement} aria-label="Decrease quantity">
              <Minus size={16} />
            </button>
            <span className="text-[13px] font-bold">{quantity}</span>
            <button type="button" onClick={onIncrement} aria-label="Increase quantity">
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAddToCart}
            className="flex-1 rounded bg-[#D89A1B] py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-[#C98715] transition-colors"
          >
            Add to Cart
          </button>
        )}
        <button
          type="button"
          onClick={onAddToCart}
          aria-label="Add to cart"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded border border-[#D89A1B] text-[#D89A1B] hover:bg-[#D89A1B]/10 transition-colors"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </div>
  );
}