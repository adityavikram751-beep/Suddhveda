"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStoredSession, getStoredToken } from "@/lib/auth";
import { isVariantOutOfStock } from "@/lib/api-products";
import { optimizeCloudinaryUrl } from "@/lib/cache-utils";

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
  className?: string;
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

  compactOnMobile?: boolean;
  fullImage?: boolean;
  includedProducts?: Array<{
    name: string;
    weight?: number | string;
    unit?: string;
  }>;

  onAddToCart: () => void;
  onBuyNow?: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onOpenDetails: () => void;
  onAddToWishlist?: () => void;
  onToggleWishlist?: () => void;
};

export default function ProductCardShop({
  className,
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
  compactOnMobile = false,
  fullImage = false,
  includedProducts,
  onAddToCart,
  onBuyNow,
  onIncrement,
  onDecrement,
  onOpenDetails,
  onAddToWishlist,
  onToggleWishlist,
}: ProductCardShopProps) {
  const router = useRouter();
  const fallbackImage = "/honneycart.png";
  const initialImageSrc =
    image && image.trim() !== "" ? optimizeCloudinaryUrl(image, 1000) : fallbackImage;
  const [imageSrc, setImageSrc] = useState(initialImageSrc);

  useEffect(() => {
    setImageSrc(
      image && image.trim() !== "" ? optimizeCloudinaryUrl(image, 1000) : fallbackImage
    );
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

  const inStockVariant = variants.find((v) => !isVariantOutOfStock(v));
  const fallbackVariant = inStockVariant || variants[0];
  const selectedVariant = variants.find((v) => getVariantId(v) === selectedVariantId) || fallbackVariant;
  const isSelectedOutOfStock = selectedVariant ? isVariantOutOfStock(selectedVariant) : false;

  const currentPrice = selectedVariant?.price ?? price;
  const currentOldPrice = selectedVariant?.mrp ?? oldPrice;

  return (
    <div
      onClick={onOpenDetails}
      className={`relative flex h-full ${
        fullImage
          ? "p-0 min-h-[300px] sm:min-h-[460px] rounded-[18px] sm:rounded-[22px]"
          : compactOnMobile
          ? "min-h-[295px] sm:min-h-[470px] p-2.5 sm:p-5 rounded-[18px] sm:rounded-[22px]"
          : "min-h-[440px] sm:min-h-[470px] p-4 sm:p-5 rounded-[22px]"
      } w-full max-w-[280px] sm:max-w-[300px] flex-col overflow-hidden border border-[#EADCC9]/60 bg-[#FCF9F3] shadow-xs transition-all duration-300 group cursor-pointer hover:-translate-y-1.5 hover:shadow-md hover:border-[#D49313]/40 mx-auto ${className || ""}`}
    >

      {/* Wishlist Button (Top Left) */}
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label="Wishlist"
        className={`absolute ${
          compactOnMobile
            ? "left-2.5 top-2.5 sm:left-3.5 sm:top-3.5 h-7 w-7 sm:h-8 sm:w-8"
            : "left-3.5 top-3.5 h-8 w-8"
        } z-20 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#593102] hover:bg-white transition-all cursor-pointer shadow-md border border-[#EADCC9]/60 hover:scale-110`}
      >
        <Heart
          size={16}
          className={`${compactOnMobile ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-4 h-4"} ${
            isWishlisted
              ? "fill-[#FA4B1B] text-[#FA4B1B]"
              : "text-[#7C6E63] hover:text-[#FA4B1B]"
          }`}
        />
      </button>

      {/* Badge (Top Right) - Only for combo / fullImage cards */}
      {badge && fullImage && (
        <div
          className={`absolute ${
            compactOnMobile ? "right-2 top-2 sm:right-3.5 sm:top-3.5" : "right-3.5 top-3.5"
          } z-20`}
        >
          <span
            className={`${
              compactOnMobile ? "px-2 py-0.5 text-[9.5px] sm:text-[10.5px]" : "px-2.5 py-0.5 text-[10.5px]"
            } font-extrabold rounded-full bg-[#191919]/90 text-white shadow-sm border border-white/20 uppercase tracking-wider backdrop-blur-xs`}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Dynamic Product Image */}
      <div
        className={`relative ${
          fullImage
            ? "w-full aspect-square overflow-hidden shrink-0 bg-white"
            : compactOnMobile
            ? "mt-0.5 sm:mt-1.5 h-[118px] sm:h-[210px] p-1 sm:p-2 w-full overflow-hidden shrink-0 flex items-center justify-center"
            : "mt-1 sm:mt-1.5 h-[190px] sm:h-[210px] p-2 w-full overflow-hidden shrink-0 flex items-center justify-center"
        }`}
      >
        <Image
          src={imageSrc}
          alt={title || "Product"}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
          className={`${
            fullImage
              ? "object-cover object-center"
              : `object-contain ${compactOnMobile ? "p-1 sm:p-1.5" : "p-1.5"}`
          } transition-transform duration-500 group-hover:scale-105`}
          onError={() => setImageSrc(fallbackImage)}
        />
      </div>

      {/* Text Content & Details */}
      <div
        className={`${
          fullImage
            ? compactOnMobile
              ? "p-2 sm:p-4 mt-0.5 sm:mt-1"
              : "p-3 sm:p-4 mt-1 sm:mt-2"
            : compactOnMobile
            ? "mt-1 sm:mt-3"
            : "mt-3"
        } flex flex-col flex-1 justify-between text-center`}
      >
        <div>
          {/* Dynamic Title with Fixed Equal Height */}
          <div className={`${compactOnMobile ? "h-[34px] sm:h-[48px] px-1" : "h-[44px] sm:h-[48px]"} flex items-center justify-center`}>
            <h3
              className={`font-serif ${
                compactOnMobile ? "text-[13px] sm:text-[17px]" : "text-[15px] sm:text-[17px]"
              } font-bold text-[#593102] group-hover:text-[#D49313] transition-colors leading-snug line-clamp-2 text-center`}
            >
              {title}
            </h3>
          </div>

          {/* Dynamic Category Name with Fixed Equal Height */}
          <div
            className={`${
              compactOnMobile ? "h-[15px] sm:h-[18px] text-[10.5px] sm:text-[12px]" : "h-[18px] text-[12px]"
            } mt-0.5 flex items-center justify-center font-semibold text-[#8D7F73]`}
          >
            {category || subtitle || ""}
          </div>

          {/* Dynamic Price Row */}
          <div className={`${compactOnMobile ? "mt-1 sm:mt-2.5 mb-1 gap-1.5 sm:gap-2" : "mt-2.5 mb-1 gap-2"} flex items-center justify-center`}>
            <span
              className={`font-extrabold text-[#593102] ${
                compactOnMobile ? "text-[14.5px] sm:text-[18px]" : "text-[17px] sm:text-[18px]"
              } tracking-tight`}
            >
              ₹{currentPrice}
            </span>
            {currentOldPrice && currentOldPrice > currentPrice ? (
              <span
                className={`line-through text-[#8D7F73] font-normal ${
                  compactOnMobile ? "text-[11px] sm:text-[14px]" : "text-[13px] sm:text-[14px]"
                }`}
              >
                ₹{currentOldPrice}
              </span>
            ) : null}
          </div>
        </div>

        {/* Variant Selection & Action Area */}
        <div className={`${compactOnMobile ? "mt-1 sm:mt-2" : "mt-2"}`}>
          {/* If Combo Products list is provided, show the included varieties as clean normal text */}
          {includedProducts && includedProducts.length > 0 ? (
            <div
              className={`${
                compactOnMobile
                  ? "mb-1.5 sm:mb-2.5 min-h-[24px] sm:min-h-[28px] px-1"
                  : "mb-2.5 min-h-[28px] px-2"
              } flex items-center justify-center`}
            >
              <p
                className={`${
                  compactOnMobile
                    ? "text-[10.5px] sm:text-[11.5px] leading-tight"
                    : "text-[11.5px] sm:text-[12.5px] leading-snug"
                } text-[#6E5D4F] font-medium text-center line-clamp-2`}
              >
                {includedProducts
                  .map((p) => {
                    const cleanName =
                      (p.name || "").replace(/\s*Honey\s*/gi, "").trim() || p.name || "Honey";
                    return cleanName;
                  })
                  .join(" + ")}
              </p>
            </div>
          ) : variants && variants.length > 0 ? (
            <div
              className={`${
                compactOnMobile
                  ? "mb-1.5 sm:mb-2.5 gap-1 sm:gap-1.5 min-h-[24px] sm:min-h-[30px]"
                  : "mb-2.5 gap-1.5 min-h-[30px]"
              } flex items-center justify-center flex-wrap`}
            >
              {variants.map((v) => {
                const vId = getVariantId(v);
                const selected = isSelected(vId);
                const outOfStock = isVariantOutOfStock(v);
                const label = getVariantLabel(v);

                return (
                  <button
                    key={vId}
                    type="button"
                    onClick={(e) => handleVariantClick(vId, e)}
                    className={`${
                      compactOnMobile
                        ? "px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] rounded-md sm:rounded-lg"
                        : "px-2.5 py-1 text-[11px] rounded-lg"
                    } font-bold transition-all cursor-pointer border ${
                      selected
                        ? "bg-[#593102] text-white border-[#593102] shadow-2xs scale-105"
                        : outOfStock
                        ? "bg-gray-100 text-gray-400 border-gray-200 line-through cursor-pointer opacity-70 hover:border-gray-400"
                        : "bg-white/90 hover:bg-white text-[#593102] border-[#EADCC9] hover:border-[#D49313]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Buy Now Button */}
          <div className={`${compactOnMobile ? "pb-0.5 sm:pb-1" : "pb-1"} flex justify-center`}>
            <button
              type="button"
              disabled={isSelectedOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelectedOutOfStock) return;
                const token = getStoredToken();
                const session = getStoredSession();
                if (!token || !session || !session.user?.mobile) {
                  router.push("/login");
                  return;
                }
                if (onBuyNow) {
                  onBuyNow();
                } else {
                  onOpenDetails();
                }
              }}
              className={`${
                compactOnMobile
                  ? "h-[33px] sm:h-[44px] max-w-[125px] sm:max-w-[170px] text-[12.5px] sm:text-[16px] rounded-lg sm:rounded-xl"
                  : "h-[44px] max-w-[170px] text-[15px] sm:text-[16px] rounded-xl"
              } w-full font-extrabold transition-all duration-300 flex items-center justify-center border ${
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

