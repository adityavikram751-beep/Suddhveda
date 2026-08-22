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
  stock?: number;
  available_stock?: number;
  stock_status?: string;
  is_out_of_stock?: boolean;
  inStock?: boolean;
  inventory?: number;
  stock_quantity?: number;
  status?: string;
};

export type ApiProduct = Record<string, any>;

export function isVariantOutOfStock(variant?: ProductVariant | null): boolean {
  if (!variant) return false;
  let v = variant as any;
  if (v?.variantId && typeof v.variantId === "object") {
    v = v.variantId;
  } else if (v?.variant && typeof v.variant === "object") {
    v = v.variant;
  }

  // 1. Explicit boolean checks
  if (
    v.is_out_of_stock === true ||
    v.isOutOfStock === true ||
    String(v.is_out_of_stock) === "true" ||
    String(v.isOutOfStock) === "true" ||
    v.outOfStock === true ||
    String(v.outOfStock) === "true" ||
    v.inStock === false ||
    v.in_stock === false ||
    String(v.inStock) === "false" ||
    String(v.in_stock) === "false"
  ) {
    return true;
  }

  // 2. String status fields
  const statusStr = String(
    v.stock_status ||
    v.stockStatus ||
    v.status ||
    v.availability ||
    v.stock_type ||
    v.stockState ||
    ""
  ).toLowerCase().trim();

  if (
    statusStr === "out_of_stock" ||
    statusStr === "outofstock" ||
    statusStr === "out of stock" ||
    statusStr === "unavailable" ||
    statusStr === "sold_out" ||
    statusStr === "soldout" ||
    statusStr === "no_stock" ||
    statusStr === "nostock"
  ) {
    return true;
  }

  // 3. Numeric stock fields
  const stockValues = [
    v.available_stock,
    v.availableStock,
    v.stock,
    v.inventory,
    v.stock_quantity,
    v.stockQuantity,
    v.quantity,
    v.qty,
    v.count,
    v.countInStock,
    v.in_stock_count
  ];

  for (const val of stockValues) {
    if (val !== undefined && val !== null && val !== "") {
      const num = Number(val);
      if (!isNaN(num) && num <= 0 && !v.allow_backorders) {
        return true;
      }
    }
  }

  return false;
}

export function isProductOutOfStock(product?: ApiProduct | null): boolean {
  if (!product) return false;
  const p = product as any;
  if (p.is_out_of_stock === true || p.isOutOfStock === true) return true;
  if (p.inStock === false || p.in_stock === false) return true;
  const statusStr = String(p.stock_status || p.stockStatus || p.status || p.availability || "").toLowerCase().trim();
  if (
    statusStr === "out_of_stock" ||
    statusStr === "outofstock" ||
    statusStr === "out of stock" ||
    statusStr === "unavailable" ||
    statusStr === "sold_out" ||
    statusStr === "soldout"
  ) {
    return true;
  }
  if (p.available_stock !== undefined && p.available_stock !== null && p.available_stock !== "") {
    const num = Number(p.available_stock);
    if (!isNaN(num) && num <= 0) return true;
  }
  if (p.stock !== undefined && p.stock !== null && p.stock !== "") {
    const num = Number(p.stock);
    if (!isNaN(num) && num <= 0) return true;
  }
  const variants = getProductVariants(product);
  if (variants.length > 0) {
    return variants.every((v) => isVariantOutOfStock(v));
  }
  return false;
}

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
    ""
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
  const variantDoc = product?.variantDocumentId || product?.variants || product?.variant || product?.variantId;
  if (Array.isArray(variantDoc)) return variantDoc;
  if (Array.isArray(variantDoc?.variants)) return variantDoc.variants;
  if (variantDoc && typeof variantDoc === "object") return [variantDoc];
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
  const inStockVariant = variants.find((v) => !isVariantOutOfStock(v));
  const selectedVariant =
    variants.find((variant) => getVariantId(variant) === selectedVariantId) ||
    inStockVariant ||
    variants[0] ||
    {};

  const price = Number(selectedVariant.price ?? product?.price ?? 0);
  const oldPrice = Number(selectedVariant.mrp ?? product?.mrp ?? price);

  const tasteProfile =
    product?.taste_profile ||
    product?.taste ||
    product?.floral_source ||
    product?.flavor ||
    "";

  const shortDescription =
    product?.short_description ||
    product?.description ||
    product?.benefits ||
    product?.subtitle ||
    "";

  const badge =
    getCategoryName(product) || product?.badge || "Pure Honey";

  return {
    id: getProductId(product),
    badge,
    image: getPrimaryImage(product),
    title: getProductName(product),
    subtitle: getCategoryName(product),
    tasteProfile,
    shortDescription,
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

