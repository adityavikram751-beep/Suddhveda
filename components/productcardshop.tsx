"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { isVariantOutOfStock } from "@/lib/api-products";

type Variant = {
  _id?: string;
  id?: string;
  weight?: number | string;
  unit?: string;
  price?: number;
  mrp?: number;
  stock?: number;
  available_stock?: number;
  stock_status?: string;
  is_out_of_stock?: boolean;
  inStock?: boolean;
  inventory?: number;
  stock_quantity?: number;
  status?: string;
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
  onBuyNow?: () => void;
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
  onBuyNow,
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

  const getVariantLabel = (v: Variant) => `${v.weight}${v.unit || "g"}`;
  const getVariantId = (v: Variant) => v._id || v.id || "";
  const isSelected = (variantId: string) => variantId === selectedVariantId;

  const selectedVariant = variants.find((v) => getVariantId(v) === selectedVariantId) || variants[0];
  const isSelectedOutOfStock = selectedVariant ? isVariantOutOfStock(selectedVariant) : false;

  const currentPrice = selectedVariant?.price ?? price;
  const currentOldPrice = selectedVariant?.mrp ?? oldPrice;

  return (
    <div
      onClick={onOpenDetails}
      className="relative flex h-full min-h-[440px] sm:min-h-[470px] w-full max-w-[280px] sm:max-w-[300px] flex-col overflow-hidden rounded-[22px] border-0 bg-white p-4 sm:p-5 shadow-none transition-all duration-300 group cursor-pointer hover:-translate-y-1.5 mx-auto"
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
      <div className="relative mt-3 h-[175px] sm:h-[195px] w-full overflow-hidden shrink-0 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={title || "Product"}
          fill
          className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageSrc(fallbackImage)}
        />
      </div>

      {/* Text Content & Details */}
      <div className="mt-3 flex flex-col flex-1 justify-between text-center">
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
          <div className="mt-2.5 mb-1 flex items-center justify-center gap-2">
            {currentOldPrice && currentOldPrice > currentPrice ? (
              <span className="line-through text-[#FA4B1B] font-normal text-[13px] sm:text-[14px]">
                ₹{currentOldPrice}
              </span>
            ) : null}
            <span className="font-extrabold text-[#593102] text-[17px] sm:text-[18px] tracking-tight">
              ₹{currentPrice}
            </span>
          </div>
        </div>

        {/* Variant Selection & Action Area */}
        <div className="mt-2">
          {/* Variant Selection Buttons */}
          {variants && variants.length > 0 && (
            <div className="mb-2.5 flex items-center justify-center gap-1.5 flex-wrap min-h-[30px]">
              {variants.map((v) => {
                const vId = getVariantId(v);
                const selected = isSelected(vId);
                const outOfStock = isVariantOutOfStock(v);
                const label = getVariantLabel(v);

                return (
                  <button
                    key={vId}
                    type="button"
                    disabled={outOfStock}
                    onClick={(e) => handleVariantClick(vId, e)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer border ${
                      selected
                        ? "bg-[#593102] text-white border-[#593102] shadow-2xs scale-105"
                        : outOfStock
                        ? "bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed opacity-60"
                        : "bg-[#FAF0DC]/80 hover:bg-[#FAF0DC] text-[#593102] border-[#D49313]/40 hover:border-[#D49313]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Buy Now Button */}
          <div className="pb-1 flex justify-center">
            <button
              type="button"
              disabled={isSelectedOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelectedOutOfStock) return;
                if (onBuyNow) {
                  onBuyNow();
                } else {
                  onOpenDetails();
                }
              }}
              className={`h-[44px] w-full max-w-[170px] rounded-xl font-extrabold text-[15px] sm:text-[16px] transition-all duration-300 flex items-center justify-center border ${
                isSelectedOutOfStock
                  ? "bg-gray-200 text-gray-500 border-gray-300 shadow-none cursor-not-allowed opacity-80"
                  : "bg-[#FA4B1B] hover:bg-[#E64216] text-white shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer active:scale-98 border-white/20"
              }`}
            >
              {isSelectedOutOfStock ? "Out of Stock" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

