"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  category?: string;
  tasteProfile?: string;
  shortDescription?: string;
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
  category,
  tasteProfile,
  shortDescription,
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
  const fallbackImage = "/honneycart.png";
  const initialImageSrc = image && image.trim() !== "" ? image : fallbackImage;
  const [imageSrc, setImageSrc] = useState(initialImageSrc);

  useEffect(() => {
    setImageSrc(image && image.trim() !== "" ? image : fallbackImage);
  }, [image]);

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

  const displayTaste = tasteProfile || subtitle || "";
  const displayDesc = shortDescription && shortDescription !== subtitle ? shortDescription : "";

  return (
    <div
      onClick={onOpenDetails}
      className="flex flex-col h-full w-full max-w-[340px] mx-auto rounded-[22px] border border-[#F2ECE4] bg-[#FAF5EE] p-5 shadow-sm hover:shadow-xl hover:-translate-y-2.5 transition-all duration-300 relative group cursor-pointer"
    >
      {/* Wishlist Button (Top Left) */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label="Wishlist"
        className="absolute left-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-[#593102] hover:bg-white transition-colors cursor-pointer shadow-sm"
      >
        <Heart
          size={16}
          className={
            isWishlisted
              ? "fill-[#FF6F3C] text-[#FF6F3C]"
              : "text-[#7C6E63] hover:text-[#593102]"
          }
        />
      </button>

      {/* Dynamic Badge (Top Right) */}
      {badge && (
        <div className="absolute right-4 top-4 z-20">
          <span className="rounded-full bg-[#1E1E1E] px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold text-white shadow-sm uppercase tracking-wide">
            {badge}
          </span>
        </div>
      )}

      {/* Dynamic Product Image */}
      <div className="relative h-[200px] sm:h-[210px] w-full overflow-hidden rounded-xl bg-transparent shrink-0 pt-2">
        <Image
          src={imageSrc}
          alt={title || "Product"}
          fill
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageSrc(fallbackImage)}
        />
      </div>

      {/* Text Content & Details */}
      <div className="mt-4 flex flex-col flex-1 justify-between text-center">
        <div>
          {/* Dynamic Title */}
          <h3 className="font-serif text-[17px] sm:text-[18px] font-medium text-[#2C221E] group-hover:text-[#593102] transition-colors leading-snug">
            {title}
          </h3>

          {/* Dynamic Category Name */}
          {(category || subtitle) && (
            <div className="mt-1.5 text-[13px] font-medium text-[#9E826B]">
              {category || subtitle}
            </div>
          )}

          {/* Dynamic Price Row */}
          <div className="mt-2.5 text-[15px] sm:text-[16px] font-medium text-[#2C221E] flex items-center justify-center gap-1.5">
            {oldPrice && oldPrice > price ? (
              <span className="line-through text-[#9E826B] font-normal text-[14px]">
                ₹{oldPrice}
              </span>
            ) : null}
            <span>From ₹{price}</span>
          </div>

          {/* Dynamic Weight Variants */}
          {variants.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
              {variants.map((variant, index) => {
                const variantId = getVariantId(variant);
                const uniqueKey = variantId || `variant-${index}`;
                const selected = isSelected(variantId);
                return (
                  <button
                    key={uniqueKey}
                    type="button"
                    onClick={(e) => handleVariantClick(variantId, e)}
                    className={`rounded-md border px-3 py-0.5 text-[11px] font-medium transition-all cursor-pointer ${
                      selected
                        ? "border-[#4A2E12] bg-[#4A2E12] text-white shadow-sm"
                        : "border-[#E5DBCB] bg-white text-[#5C4033] hover:border-[#4A2E12]"
                    }`}
                  >
                    {getVariantLabel(variant)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Buy Now Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="w-full h-[44px] rounded-xl bg-[#F2542D] hover:bg-[#D9431E] text-white font-bold text-[14px] tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
