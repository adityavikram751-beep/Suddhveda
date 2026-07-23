"use client";

import Image from "next/image";
import { Heart, Minus, Plus } from "lucide-react";

type Variant = {
  _id?: string;
  id?: string;
  weight?: number | string;
  unit?: string;
  price?: number;
  mrp?: number;
};

export type ProductCardShopProps = {
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

  variants?: Variant[];
  selectedVariantId?: string;
  onVariantSelect?: (variantId: string) => void;

  isWishlisted?: boolean;

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

  const handleVariantClick = (variantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVariantSelect) onVariantSelect(variantId);
  };

  const getVariantLabel = (v: Variant) => `${v.weight}${v.unit}`;
  const getVariantId = (v: Variant) => v._id || v.id || "";

  const isSelected = (variantId: string) => variantId === selectedVariantId;

  // ✅ FIX 1: Fallback image if `image` is empty
  const imageSrc = image && image.trim() !== "" ? image : "/placeholder.png";

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

        {/* ✅ FIX 2: alt text */}
        <Image
          src={imageSrc}
          alt={title || "Product"}
          fill
          className="object-contain p-3"
          onError={(e) => {
            // if fallback fails, show plain grey background
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* If image is empty, show fallback text */}
        {(!image || image.trim() === "") && (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 text-sm">
            No Image
          </div>
        )}
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
            {variants.map((variant, index) => {
              const variantId = getVariantId(variant);
              // ✅ FIX 3: Unique key – use id or fallback to index
              const uniqueKey = variantId || `variant-${index}`;
              const selected = isSelected(variantId);
              return (
                <button
                  key={uniqueKey}
                  type="button"
                  onClick={(e) => handleVariantClick(variantId, e)}
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
                ? "fill-[#FF6F3C] text-[#FF6F3C]"
                : "text-[#2D3A1B]"
            }
          />
        </button>
      </div>
    </div>
  );
}