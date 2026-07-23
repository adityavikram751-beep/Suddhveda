import type { Product } from "@/lib/shop-data";

export type ProductVariant = {
  _id?: string;
  id?: string;
  weight?: number | string;
  unit?: string;
  price?: number;
  mrp?: number;
  you_save?: number;
  discount_value?: number;
};

export type ApiProduct = Record<string, any>;

export function getProductsFromResponse(data: any): ApiProduct[] {
  const possibleLists = [
    data?.data?.products,
    data?.data?.product,
    data?.data?.results,
    data?.data,
    data?.products,
    data?.result,
    data,
  ];

  for (const list of possibleLists) {
    if (Array.isArray(list)) return list;
  }

  return [];
}

export function getSingleProductFromResponse(data: any): ApiProduct | null {
  const product = data?.data?.product || data?.data || data?.product || data;
  return product && typeof product === "object" && !Array.isArray(product)
    ? product
    : null;
}

export function getProductId(product: ApiProduct): string {
  return String(product?._id || product?.id || product?.productId?._id || product?.productId || "");
}

export function getProductName(product: ApiProduct): string {
  return product?.product_name || product?.name || product?.title || "Honey";
}

export function getCategoryName(product: ApiProduct): string {
  return (
    product?.categoryId?.category_name ||
    product?.category?.category_name ||
    product?.category_name ||
    product?.category ||
    "Honey"
  );
}

export function getCategorySlug(product: ApiProduct): string {
  const source =
    product?.categoryId?.slug ||
    product?.categoryId?.category_slug ||
    product?.category?.slug ||
    product?.category_slug ||
    getCategoryName(product);

  return String(source)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductImages(product: ApiProduct): any[] {
  const imageDoc = product?.imageDocumentId || product?.images || product?.image;
  if (Array.isArray(imageDoc)) return imageDoc;
  if (Array.isArray(imageDoc?.images)) return imageDoc.images;
  return [];
}

export function getPrimaryImage(product: ApiProduct): string {
  const images = getProductImages(product);
  return (
    images.find((img: any) => img?.is_primary)?.image_url ||
    images[0]?.image_url ||
    product?.image_url ||
    product?.image ||
    "/honneycart.png"
  );
}

export function getProductVariants(product: ApiProduct): ProductVariant[] {
  const variantDoc = product?.variantDocumentId || product?.variants || product?.variant;
  if (Array.isArray(variantDoc)) return variantDoc;
  if (Array.isArray(variantDoc?.variants)) return variantDoc.variants;
  return [];
}

export function getVariantId(variant?: ProductVariant | null): string {
  return String(variant?._id || variant?.id || "");
}

export function getVariantLabel(variant?: ProductVariant | null): string {
  if (!variant) return "";
  return `${variant.weight ?? ""}${variant.unit ?? ""}`;
}

export function parseWeightLabel(label: string): { weight: string; unit: string } {
  const match = label.trim().match(/^([\d.]+)\s*([a-zA-Z]+)$/);
  return {
    weight: match?.[1] || label.replace(/[^0-9.]/g, "") || label,
    unit: match?.[2] || (label.toLowerCase().includes("kg") ? "kg" : "g"),
  };
}

export function normalizeProduct(
  product: ApiProduct,
  selectedVariantId?: string
): Product {
  const variants = getProductVariants(product);
  const selectedVariant =
    variants.find((variant) => getVariantId(variant) === selectedVariantId) ||
    variants[0] ||
    {};

  const price = Number(selectedVariant.price ?? product?.price ?? 0);
  const oldPrice = Number(selectedVariant.mrp ?? product?.mrp ?? price);

  return {
    id: getProductId(product),
    badge: getCategoryName(product),
    image: getPrimaryImage(product),
    title: getProductName(product),
    subtitle: product?.floral_source || product?.subtitle || product?.description || "",
    weight: getVariantLabel(selectedVariant),
    price,
    oldPrice,
    discount:
      selectedVariant.discount_value || oldPrice > price
        ? `${Math.round(Number(selectedVariant.discount_value) || ((oldPrice - price) / oldPrice) * 100)}% Off`
        : "",
    rating: Number(product?.average_rating ?? product?.rating ?? 0),
    reviews: Number(product?.total_reviews ?? product?.reviews ?? 0),
    category: getCategoryName(product),
    flavor: product?.floral_source || product?.flavor || "",
  };
}
