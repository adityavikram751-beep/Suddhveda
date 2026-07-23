"use client";

import Image from "next/image";
import { Heart, Minus, Plus } from "lucide-react";

type Variant = {
  _id: string;
  weight: number;
  unit: string;
  price: number;
  mrp?: number;
};

export type ProductCardShopProps = {
  badge?: string;
  image: string;
  title: string;
  subtitle?: string;
  weight?: string;          // selected weight display string (e.g., "500g")
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  quantity: number;

  // Variant selection props
  variants?: Variant[];
  selectedVariantId?: string;
  onVariantSelect?: (variantId: string) => void;

  // Wishlist Status Prop
  isWishlisted?: boolean;   // 👈 Parent se control hoga

  // Actions
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onOpenDetails: () => void;
  onAddToWishlist?: () => void;
  onToggleWishlist?: () => void;
};

export default function ProductCardShop({
  badge,
  image,
  title,
  subtitle,
  weight,
  price,
  oldPrice,
  quantity,
  variants = [],
  selectedVariantId,
  onVariantSelect,
  isWishlisted = false,
  onAddToCart,
  onIncrement,
  onDecrement,
  onOpenDetails,
  onAddToWishlist,
  onToggleWishlist,
}: ProductCardShopProps) {

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist();
    } else if (onAddToWishlist) {
      onAddToWishlist();
    }
  };

  // Handle variant click
  const handleVariantClick = (variantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVariantSelect) onVariantSelect(variantId);
  };

  // Build weight label from variant
  const getVariantLabel = (v: Variant) => `${v.weight}${v.unit}`;

  // Determine if a variant is selected
  const isSelected = (variantId: string) => variantId === selectedVariantId;

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
        <Image src={image} alt={title} fill className="object-contain p-3" />
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
          {oldPrice ? (
            <>
              {" "}
              <span className="mx-0.5 font-normal text-[#9A9A9A]">—</span>{" "}
              ₹{oldPrice}
            </>
          ) : null}
        </div>

        {/* Interactive Weight Options */}
        {variants.length > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            {variants.map((variant) => {
              const selected = isSelected(variant._id);
              return (
                <button
                  key={variant._id}
                  type="button"
                  onClick={(e) => handleVariantClick(variant._id, e)}
                  className={`rounded border px-3 py-1.5 text-[12px] transition-colors ${
                    selected
                      ? "border-[#2D3A1B] bg-[#2D3A1B] text-white"
                      : "border-[#E4E8EE] text-[#4E4E4E] hover:border-[#2D3A1B] hover:bg-[#2D3A1B]/10"
                  }`}
                >
                  {getVariantLabel(variant)}
                </button>
              );
            })}
          </div>
        )}

        {/* Show selected weight text if no variants */}
        {variants.length === 0 && weight && (
          <div className="mt-3 text-[13px] text-[#4E4E4E]">{weight}</div>
        )}
      </div>

      {/* Add to cart & Wishlist row */}
      <div className="mt-4 flex items-center gap-2">
        {quantity > 0 ? (
          <div className="flex flex-1 items-center justify-between rounded bg-[#2D3A1B] px-4 py-3 text-white">
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
            className="flex-1 rounded bg-[#2D3A1B] py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-[#C98715] transition-colors"
          >
            Add to Cart
          </button>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Wishlist"
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded border border-[#2D3A1B] text-[#2D3A1B] hover:bg-[#2D3A1B]/10 transition-colors cursor-pointer"
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? "fill-[#FF6F3C] text-[#FF6F3C]" // Red heart when in wishlist
                : "text-[#2D3A1B]"
            }
          />
        </button>
      </div>
    </div>
  );
}