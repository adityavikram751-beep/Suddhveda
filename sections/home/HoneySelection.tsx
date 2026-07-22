"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";

// ---------- Toast Component ----------
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = message.includes("✅") || message.includes("Added");
  const bgColor = isSuccess ? "bg-[#2D3A1B]" : "bg-red-600";

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl max-w-md w-full text-center animate-bounce-in`}
    >
      <p className="font-medium text-sm md:text-base">{message}</p>
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-white/60 hover:text-white text-lg"
      >
        ×
      </button>
    </div>
  );
}

// ---------- Main Component ----------
export default function HoneySelection() {
  const router = useRouter();
  const { cartItems, updateQuantity } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ---------- Fetch Products ----------
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const result = await res.json();
      setProducts(result.data || []);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Variant Selection ----------
  const handleVariantSelect = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantId,
    }));
  };

  const getSelectedVariant = (product: any) => {
    const variants = product.variantDocumentId || [];
    const variantId = selectedVariants[product._id];
    if (variantId) {
      return variants.find((v: any) => v._id === variantId);
    }
    return variants[0]; // default to first variant
  };

  // ---------- Add to Cart – with correct field `selectedWeight` ----------
  const handleAddToCart = async (product: any) => {
    const variant = getSelectedVariant(product);

    if (!variant) {
      setToastMessage("⚠️ Please select a weight variant first.");
      return;
    }

    try {
      setActionLoading(product._id);

      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          selectedWeight: variant._id,   // ✅ Backend expects this field name
          quantity: 1,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        console.log("Item added to cart:", result);
        updateQuantity(product, 1);

        const weightStr = `${variant.weight || ""}${variant.unit || ""}`;
        setToastMessage(
          `✅ Successfully added ${product.product_name} (${weightStr}) to your cart!`
        );
      } else {
        console.error("Failed to add to cart:", result.message);
        setToastMessage(`❌ ${result.message || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Error in Add to Cart API:", err);
      setToastMessage("❌ Network error. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // ---------- Increase / Decrease / Wishlist (unchanged) ----------
  const handleIncreaseQuantity = async (product: any, variant: any) => {
    if (!variant) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/increase-quantity`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          variantId: variant._id,
        }),
      });
      if (res.ok) updateQuantity(product, 1);
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  const handleDecreaseQuantity = async (product: any, variant: any) => {
    if (!variant) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/decrease-quantity`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          variantId: variant._id,
        }),
      });
      if (res.ok) updateQuantity(product, -1);
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/add/${productId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (res.ok) {
        console.log("Added to wishlist:", result);
        setToastMessage("❤️ Added to wishlist!");
      } else {
        console.error("Wishlist error:", result.message);
        if (res.status === 401) {
          router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
        }
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  // ---------- Render ----------
  return (
    <section className="relative mt-2 bg-[#FFF7ED] overflow-hidden pt-2 pb-14">
      <div className="max-w-[1450px] mx-auto px-6 lg:px-10 pt-10">
        <div className="text-center mb-8">
          <h2 className="text-[34px] md:text-[44px] lg:text-[56px] font-bold leading-tight text-[#2D3A1B]">
            Nature&apos;s Finest Honey Selection
          </h2>
          <p className="mt-2 max-w-[760px] mx-auto text-[#B09077] text-[16px] lg:text-[18px] leading-7">
            From wildflower meadows to mustard fields, experience honey in its purest
            and most authentic form.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#B09077] text-lg font-medium">
            Loading products...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-x-7 md:gap-y-9 mt-8 items-stretch">
            {products.slice(0, 8).map((product: any) => {
              const variants = product.variantDocumentId || [];
              const selectedVariant = getSelectedVariant(product);
              const primaryImage =
                product.imageDocumentId?.find((img: any) => img.is_primary)
                  ?.image_url || product.imageDocumentId?.[0]?.image_url || "";

              const price = selectedVariant?.price ?? 0;
              const oldPrice = selectedVariant?.mrp ?? 0;
              const weightStr = `${selectedVariant?.weight || ""}${selectedVariant?.unit || ""}`;

              return (
                <ProductCardShop
                  key={product._id}
                  badge={product.categoryId?.category_name || "Honey"}
                  image={primaryImage}
                  title={product.product_name}
                  subtitle={product.floral_source}
                  weight={weightStr}
                  price={price}
                  oldPrice={oldPrice}
                  rating={product.average_rating}
                  reviews={product.total_reviews}
                  quantity={cartItems[product._id] ?? 0}
                  variants={variants}
                  selectedVariantId={selectedVariants[product._id] || variants[0]?._id}
                  onVariantSelect={(variantId: string) =>
                    handleVariantSelect(product._id, variantId)
                  }
                  onAddToCart={() => handleAddToCart(product)}
                  onIncrement={() => handleIncreaseQuantity(product, selectedVariant)}
                  onDecrement={() => handleDecreaseQuantity(product, selectedVariant)}
                  onAddToWishlist={() => handleAddToWishlist(product._id)}
                  onOpenDetails={() => router.push(`/shop/products/${product._id}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </section>
  );
}