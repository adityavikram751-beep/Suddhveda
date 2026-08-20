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
      className="relative flex h-full min-h-[420px] sm:min-h-[450px] w-full max-w-[280px] sm:max-w-[300px] flex-col overflow-hidden rounded-[22px] border-0 bg-white p-4 sm:p-5 shadow-none transition-all duration-300 group cursor-pointer hover:-translate-y-1.5 mx-auto"
    >

      {/* Wishlist Button (Top Left) */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label="Wishlist"
        className="absolute left-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#593102] hover:bg-white transition-all cursor-pointer shadow-md border border-[#EADCC9]/60 hover:scale-110"
      >
        <Heart
          size={16}
          className={
            isWishlisted
              ? "fill-[#FA4B1B] text-[#FA4B1B]"
              : "text-[#7C6E63] hover:text-[#FA4B1B]"
          }
        />
      </button>

      {/* Dynamic Product Image */}
      <div className="relative mt-3 h-[185px] sm:h-[205px] w-full overflow-hidden shrink-0 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={title || "Product"}
          fill
          className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageSrc(fallbackImage)}
        />
      </div>

      {/* Text Content & Details */}
      <div className="mt-4 flex flex-col flex-1 justify-between text-center">
        <div>
          {/* Dynamic Title with Fixed Equal Height */}
          <div className="h-[44px] sm:h-[48px] flex items-center justify-center">
            <h3 className="font-serif text-[15px] sm:text-[17px] font-bold text-[#593102] group-hover:text-[#D49313] transition-colors leading-snug line-clamp-2 text-center">
              {title}
            </h3>
          </div>

          {/* Dynamic Category Name with Fixed Equal Height */}
          <div className="h-[18px] mt-0.5 flex items-center justify-center text-[12px] font-semibold text-[#8D7F73]">
            {category || subtitle || ""}
          </div>

          {/* Dynamic Price Row */}
          <div className="mt-3.5 mb-1 flex items-center justify-center gap-2">
            {oldPrice && oldPrice > price ? (
              <span className="line-through text-[#FA4B1B] font-normal text-[13px] sm:text-[14px]">
                ₹{oldPrice}
              </span>
            ) : null}
            <span className="font-extrabold text-[#593102] text-[17px] sm:text-[18px] tracking-tight">
              From ₹{price}
            </span>
          </div>

          {/* Dynamic Weight Variants */}
          {variants.length > 0 && (
            <div className="mt-3 mb-1 flex items-center justify-center gap-2 flex-wrap">
              {variants.map((variant, index) => {
                const variantId = getVariantId(variant);
                const uniqueKey = variantId || `variant-${index}`;
                const selected = isSelected(variantId);
                return (
                  <button
                    key={uniqueKey}
                    type="button"
                    onClick={(e) => handleVariantClick(variantId, e)}
                    className={`rounded-lg border px-3 py-1 text-[12px] sm:text-[13px] font-extrabold transition-all duration-200 cursor-pointer ${
                      selected
                        ? "border-[#FA4B1B] bg-[#FA4B1B] text-white shadow-md scale-105"
                        : "border-[#EADCC9] bg-white text-[#5C4033] hover:border-[#FA4B1B] hover:text-[#FA4B1B]"
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
        <div className="mt-4 pb-1 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="h-[46px] w-full max-w-[160px] rounded-xl bg-[#FA4B1B] hover:bg-[#E64216] text-white font-extrabold text-[16px] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer flex items-center justify-center active:scale-98 border border-white/20"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
