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
      className="relative flex h-full min-h-[470px] w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] border border-[#EADCC9] bg-white p-5 shadow-sm transition-all duration-300 group cursor-pointer hover:-translate-y-2 hover:border-[#D49313]/60 hover:shadow-lg"
    >
      {/* Wishlist Button (Top Left) */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label="Wishlist"
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#593102] hover:bg-white transition-all cursor-pointer shadow-md border border-[#EADCC9]/60 hover:scale-110"
      >
        <Heart
          size={18}
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
          <span className="rounded-full bg-gradient-to-r from-[#D49313] to-[#8F590A] px-3.5 py-1 text-[11px] font-black text-white shadow-md uppercase tracking-wider">
            {badge}
          </span>
        </div>
      )}

      {/* Dynamic Product Image */}
      <div className="relative h-[220px] sm:h-[240px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF6F0] border border-[#F2ECE4] shrink-0 pt-2 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={title || "Product"}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
          onError={() => setImageSrc(fallbackImage)}
        />
      </div>

      {/* Text Content & Details */}
      <div className="mt-5 flex flex-col flex-1 justify-between text-center">
        <div>
          {/* Dynamic Title */}
          <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#593102] group-hover:text-[#D49313] transition-colors leading-snug">
            {title}
          </h3>

          {/* Dynamic Category Name */}
          {(category || subtitle) && (
            <div className="mt-1.5 text-[13px] font-semibold text-[#8D7F73]">
              {category || subtitle}
            </div>
          )}

          {/* Dynamic Price Row */}
          <div className="mt-3 text-[16px] sm:text-[17px] font-bold text-[#593102] flex items-center justify-center gap-2">
            {oldPrice && oldPrice > price ? (
              <span className="line-through text-[#B09077] font-normal text-[14px]">
                ₹{oldPrice}
              </span>
            ) : null}
            <span className="font-black text-[#593102] text-[18px]">From ₹{price}</span>
          </div>

          {/* Dynamic Weight Variants */}
          {variants.length > 0 && (
            <div className="mt-3.5 flex items-center justify-center gap-2 flex-wrap">
              {variants.map((variant, index) => {
                const variantId = getVariantId(variant);
                const uniqueKey = variantId || `variant-${index}`;
                const selected = isSelected(variantId);
                return (
                  <button
                    key={uniqueKey}
                    type="button"
                    onClick={(e) => handleVariantClick(variantId, e)}
                    className={`rounded-lg border-2 px-3.5 py-1 text-[12px] font-bold transition-all cursor-pointer ${selected
                        ? "border-[#593102] bg-[#593102] text-white shadow-sm scale-105"
                        : "border-[#E5DBCB] bg-white text-[#5C4033] hover:border-[#593102]"
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
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="h-[54px] w-[176px] rounded-md bg-[#FA4B1B] text-white font-bold text-[20px] shadow-sm transition-colors hover:bg-[#E64216] cursor-pointer flex items-center justify-center active:scale-98"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
