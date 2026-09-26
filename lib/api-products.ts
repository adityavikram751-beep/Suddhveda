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
  const product =
    data?.data?.comboProduct ||
    data?.data?.product ||
    data?.data?.combo ||
    data?.data?.combo_product ||
    data?.data ||
    data?.comboProduct ||
    data?.product ||
    data?.combo ||
    data?.combo_product ||
    data;

  if (!product || typeof product !== "object" || Array.isArray(product)) {
    return null;
  }

  const normalized: ApiProduct = { ...product };

  // Normalize product name
  if (!normalized.product_name) {
    normalized.product_name =
      product.combo_name ||
      product.comboName ||
      product.name ||
      product.title ||
      "Honey Combo Box";
  }

  // Normalize description
  if (!normalized.description) {
    normalized.description =
      product.combo_description ||
      product.comboDescription ||
      product.description ||
      product.desc ||
      "";
  }

  // Handle setPacks variants mapping for prices
  if (Array.isArray(product.setPacks) && product.setPacks.length > 0) {
    const primaryPack = product.setPacks[0];
    if (!normalized.price) {
      normalized.price = Number(primaryPack.selling_price || primaryPack.price || 0);
    }
    if (!normalized.mrp) {
      normalized.mrp = Number(primaryPack.mrp || (normalized.price ? Math.round(normalized.price * 1.25) : 0));
    }
  } else {
    normalized.price =
      Number(product.selling_price || product.combo_price || product.comboPrice || product.salePrice || product.price) || 0;
    normalized.mrp =
      Number(product.mrp || product.originalPrice || product.combo_mrp) ||
      (normalized.price ? Math.round(normalized.price * 1.25) : 0);
  }

  if (product.save !== undefined && product.save !== null) {
    normalized.you_save = Number(product.save);
  } else {
    normalized.you_save = Math.max(0, (normalized.mrp || 0) - (normalized.price || 0));
  }

  if (product.discount_percent !== undefined && product.discount_percent !== null) {
    normalized.discount_value = Number(product.discount_percent);
  }

  // Handle images normalization
  const existingImages = getProductImages(normalized);
  if (existingImages.length > 0) {
    normalized.imageDocumentId = existingImages;
  } else {
    const rawImg =
      product.image_url ||
      product.imageUrl ||
      product.image ||
      (Array.isArray(product.images) && product.images[0]?.url) ||
      (Array.isArray(product.images) && product.images[0]?.image_url) ||
      (Array.isArray(product.images) && product.images[0]) ||
      "/honneycart.png";

    const finalUrl = typeof rawImg === "string" ? rawImg : rawImg?.url || rawImg?.image_url || "/honneycart.png";

    normalized.imageDocumentId = [
      {
        _id: "img-1",
        image_url: finalUrl,
        is_primary: true,
      },
    ];
  }

  // Handle variants normalization
  const existingVariants = getProductVariants(normalized);
  if (existingVariants.length > 0) {
    normalized.variantDocumentId = existingVariants;
  } else {
    const weightLabel = product.combo_size ? `${product.combo_size} Jars Set` : product.jar_count ? `${product.jar_count} Jars` : "1 Box";
    normalized.variantDocumentId = [
      {
        _id: product._id || product.id || "v-combo-1",
        weight: weightLabel,
        unit: "",
        price: normalized.price,
        mrp: normalized.mrp,
        you_save: normalized.you_save,
        discount_value: normalized.discount_value,
        is_out_of_stock: false,
      },
    ];
  }

  return normalized;
}

export function getProductId(product: ApiProduct): string {
  return String(product?._id || product?.id || product?.productId?._id || product?.productId || "");
}

export function getProductName(product: ApiProduct): string {
  return product?.product_name || product?.combo_name || product?.name || product?.title || "Honey";
}

export function getCategoryName(product: ApiProduct): string {
  if (product?.combo_name || product?.combo_size || (Array.isArray(product?.products) && product.products.length > 0)) {
    return "CURATED GIFT COLLECTION";
  }
  return (
    product?.categoryId?.category_name ||
    product?.category?.category_name ||
    product?.category_name ||
    product?.category ||
    (product?.setPacks ? "Combo Gift Pack" : "")
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
  if (Array.isArray(imageDoc)) {
    return imageDoc.map((img: any, idx: number) => {
      if (typeof img === "string") {
        return { _id: `img-${idx}`, image_url: img, is_primary: idx === 0 };
      }
      return {
        _id: img._id || img.id || `img-${idx}`,
        image_url: img.image_url || img.url || img.src || "/honneycart.png",
        is_primary: img.is_primary ?? idx === 0,
        thumbnail: img.thumbnail || img.thumbnail_url || img.image_url || img.url || "/honneycart.png",
      };
    });
  }
  return [];
}

export function getPrimaryImage(product: ApiProduct): string {
  const images = getProductImages(product);
  return (
    images.find((img: any) => img?.is_primary)?.image_url ||
    images[0]?.image_url ||
    product?.image_url ||
    product?.imageUrl ||
    product?.image ||
    "/honneycart.png"
  );
}

export function getProductVariants(product: ApiProduct): ProductVariant[] {
  const setPacks = product?.setPacks || product?.packs || product?.comboPacks;
  if (Array.isArray(setPacks) && setPacks.length > 0) {
    return setPacks.map((p: any) => {
      const price = Number(p.selling_price || p.price || p.salePrice || 0);
      const mrp = Number(p.mrp || p.originalPrice || price);
      const you_save = Math.max(0, mrp - price);
      const discount_value = Number(p.discount_percent || p.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0));

      const imgUrl = p.image || p.image_url || p.imageUrl || "";

      return {
        _id: p._id || p.id,
        weight: p.pack_name || (p.pack_size ? `Set of ${p.pack_size}` : "Pack"),
        unit: "",
        price,
        mrp,
        you_save,
        discount_value,
        image: typeof imgUrl === "string" ? imgUrl : "",
        image_url: typeof imgUrl === "string" ? imgUrl : "",
        is_out_of_stock: p.is_active === false || p.status === "out_of_stock",
      };
    });
  }

  const variantDoc = product?.variantDocumentId || product?.variants || product?.variant || product?.variantId;
  if (Array.isArray(variantDoc)) {
    return variantDoc.map((v: any, idx: number) => {
      const price = Number(v.price || v.selling_price || v.salePrice || 0);
      const mrp = Number(v.mrp || v.originalPrice || price);
      return {
        ...v,
        _id: v._id || v.id || `var-${idx}`,
        price,
        mrp,
        you_save: Number(v.you_save || (mrp > price ? mrp - price : 0)),
      };
    });
  }
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

