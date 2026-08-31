"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Leaf,
  Minus,
  Plus,
  RotateCcw,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, getStoredSession } from "@/lib/auth";
import { getCategoryName } from "@/lib/api-products";

// ---------- Helper to get token from cookie ----------
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

// ---------- Helper for authenticated fetch ----------
async function authFetch(url: string, options: RequestInit = {}) {
  const token = getTokenFromCookie();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

// ---------- Types ----------
type CartItemDetail =
  | {
    type: "NORMAL";
    cartItemId: string;
    productId: string;
    variantId: string;
    productName: string;
    categoryName?: string;
    image: string;
    price: number;
    oldPrice?: number;
    weight: string;
    quantity: number;
  }
  | {
    type: "CUSTOM";
    cartItemId: string;
    productName: string;
    image: string;
    price: number;
    customMessage?: string;
    quantity: number;
  };

type CartContextValue = {
  cartItems: Record<string, CartItemDetail>;
  itemCount: number;
  addToCart: (productId: string, variantId: string, productDetails?: Partial<CartItemDetail>, quantityToAdd?: number) => Promise<void>;
  updateQuantity: (productId: string, variantId: string, change: number) => Promise<void>;
  updateCustomQuantity: (cartItemId: string, change: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  fetchCart: () => Promise<Record<string, CartItemDetail>>;
  openCart: () => void;
  closeCart: () => void;
  isLoading: boolean;
  isCartOpen: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<Record<string, CartItemDetail>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastProduct, setToastProduct] = useState<{ title: string; weight: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiCartCount, setApiCartCount] = useState<number | null>(null);

  // ---------- Guest Cart LocalStorage Helpers ----------
  const GUEST_CART_KEY = "sudhveda_guest_cart";

  const getGuestCart = useCallback((): Record<string, CartItemDetail> => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  const saveGuestCart = useCallback((items: Record<string, CartItemDetail>) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
      setCartItems(items);
      window.dispatchEvent(new CustomEvent("trigger-live-update"));
    } catch (err) {
      console.error("Failed to save guest cart:", err);
    }
  }, []);

  // ---------- Sync Guest Cart to Backend on Login ----------
  const syncGuestCartOnLogin = useCallback(async () => {
    const guestItems = getGuestCart();
    const keys = Object.keys(guestItems);
    if (keys.length === 0) return;

    console.log("🛒 Found guest cart items in localStorage! Syncing to backend cart API...", guestItems);

    let syncedCount = 0;

    for (const key of keys) {
      const item = guestItems[key];
      if (item.type === "NORMAL" && item.productId && item.variantId) {
        try {
          await authFetch(`${API_BASE_URL}/api/cart/add`, {
            method: "POST",
            body: JSON.stringify({
              productId: item.productId,
              selectedWeight: item.variantId,
              quantity: item.quantity || 1,
            }),
          });
          console.log(`✅ Successfully synced ${item.productName} (Qty: ${item.quantity}) to database!`);
          syncedCount++;
        } catch (err) {
          console.error(`Failed to sync guest cart item ${item.productName}:`, err);
        }
      } else if (item.type === "CUSTOM" && (item as any).giftBoxPayload) {
        try {
          await authFetch(`${API_BASE_URL}/api/cart/add-customize/giftbox`, {
            method: "POST",
            body: JSON.stringify((item as any).giftBoxPayload),
          });
          console.log(`✅ Successfully synced guest gift box ${(item as any).productName} to database!`);
          syncedCount++;
        } catch (err) {
          console.error(`Failed to sync guest gift box item ${(item as any).productName}:`, err);
        }
      }
    }

    // Clear local guest cart after successful database sync
    if (syncedCount > 0 && typeof window !== "undefined") {
      console.log("🧹 Clearing sudhveda_guest_cart from localStorage after database sync!");
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, [getGuestCart]);

  // ---------- Fetch Cart (Backend or Guest) ----------
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 1. Sync guest cart items to backend database FIRST if any exist
      await syncGuestCartOnLogin();

      // 2. NOW fetch the complete updated backend cart!
      const data = await authFetch(`${API_BASE_URL}/api/cart`);

      const items = Array.isArray(data)
        ? data
        : data.items || data.data || [];

      const newCartItems: Record<string, CartItemDetail> = {};

      items.forEach((item: any) => {
        if (item.type === "CUSTOM") {
          const cartItemId = item.giftCartItemId || item._id;
          const qty = item.quantity || 1;
          const totalAmt = item.totalAmount || 0;
          const unitPrice = item.price || item.unitPrice || (totalAmt > 0 ? totalAmt / qty : 0);
          newCartItems[cartItemId] = {
            type: "CUSTOM",
            cartItemId,
            productName: item.giftBox?.name || "Gift Box",
            image: item.giftBox?.image || "/placeholder.png",
            price: unitPrice,
            customMessage: item.customMessage,
            quantity: qty,
          };
          return;
        }

        const product = item.product || {};
        const variant = item.variant || product.variant || {};

        const cartItemId = item.cartItemId || item._id || String(Math.random());
        const productId = product._id || product.productId || product.id || "";
        const variantId = variant._id || variant.variantId || variant.id || "";
        const productName = product.product_name || product.productName || product.name || "Product";
        const categoryName = getCategoryName(product);
        const image = product.image?.image_url || product.image?.url || "/placeholder.png";
        const price = variant.price ?? variant.pricing ?? 0;
        const oldPrice = variant.mrp ?? variant.oldPrice ?? undefined;
        const weight = variant.weight ? `${variant.weight}${variant.unit || "g"}` : "";

        newCartItems[cartItemId] = {
          type: "NORMAL",
          cartItemId,
          productId,
          variantId,
          productName,
          categoryName,
          image,
          price,
          oldPrice,
          weight,
          quantity: item.quantity || 1,
        };
      });

      // Also fetch official backend cart count from GET /api/cart/count
      try {
        const countData = await authFetch(`${API_BASE_URL}/api/cart/count`).catch(() => null);
        if (countData) {
          let count = 0;
          if (typeof countData?.data?.totalCount === "number") {
            count = countData.data.totalCount;
          } else if (typeof countData?.totalCount === "number") {
            count = countData.totalCount;
          } else if (countData?.data?.cartCount !== undefined || countData?.data?.giftCartCount !== undefined) {
            count = (Number(countData.data?.cartCount) || 0) + (Number(countData.data?.giftCartCount) || 0);
          } else if (countData?.data?.count !== undefined) {
            count = countData.data.count;
          } else if (countData?.count !== undefined) {
            count = countData.count;
          } else if (countData?.data?.totalItems !== undefined) {
            count = countData.data.totalItems;
          } else if (countData?.totalItems !== undefined) {
            count = countData.totalItems;
          } else if (countData?.data?.total !== undefined) {
            count = countData.data.total;
          } else if (countData?.total !== undefined) {
            count = countData.total;
          }

          if (count > 0) {
            setApiCartCount(count);
          } else {
            setApiCartCount(null);
          }
        }
      } catch (e) {
        setApiCartCount(null);
      }

      setCartItems(newCartItems);
      return newCartItems;
    } catch (err) {
      // User is not logged in / Guest -> Return guest cart from localStorage
      const guestItems = getGuestCart();
      setCartItems(guestItems);
      setApiCartCount(null);
      return guestItems;
    } finally {
      setIsLoading(false);
    }
  }, [syncGuestCartOnLogin, getGuestCart]);

  useEffect(() => {
    fetchCart();

    const handleLiveCartUpdate = () => {
      fetchCart();
    };

    const handleAuthChanged = async () => {
      console.log("🔐 User Auth Changed! Triggering automatic cart & wishlist sync...");
      const { syncGuestWishlistOnLogin } = await import("@/lib/wishlist");
      await syncGuestWishlistOnLogin();
      await fetchCart();
    };

    window.addEventListener("trigger-live-update", handleLiveCartUpdate);
    window.addEventListener("sudhveda-auth-changed", handleAuthChanged);
    return () => {
      window.removeEventListener("trigger-live-update", handleLiveCartUpdate);
      window.removeEventListener("sudhveda-auth-changed", handleAuthChanged);
    };
  }, [fetchCart]);

  useEffect(() => {
    if (isCartOpen) {
      fetchCart();
    }
  }, [isCartOpen, fetchCart]);

  // Lock Body Scroll when Cart Drawer is Open
  useEffect(() => {
    if (isCartOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // ---------- Add to Cart (Handles both Logged-In & Guest users) ----------
  const addToCart = async (
    productId: string,
    variantId: string,
    productDetails?: Partial<CartItemDetail>,
    quantityToAdd?: number
  ) => {
    const qtyToAdd = quantityToAdd || (productDetails as any)?.quantity || 1;

    try {
      await authFetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        body: JSON.stringify({
          productId,
          selectedWeight: variantId,
          quantity: qtyToAdd,
        }),
      });
      const updatedCart = await fetchCart();
      window.dispatchEvent(new CustomEvent("trigger-live-update"));

      const added = Object.values(updatedCart).find(
        (item): item is Extract<CartItemDetail, { type: "NORMAL" }> =>
          item.type === "NORMAL" && item.productId === productId && item.variantId === variantId
      );
      if (added) {
        setToastProduct({ title: added.productName, weight: added.weight });
      } else if (productDetails) {
        setToastProduct({
          title: productDetails.productName || "Honey Product",
          weight: (productDetails as any).weight || "",
        });
      }
    } catch (err) {
      // User is guest -> Store item in guest cart localStorage
      console.log("🛒 User not logged in, saving item to guest cart in localStorage...");
      const guestItems = getGuestCart();
      const cartItemId = `guest_${productId}_${variantId}`;

      const existing = guestItems[cartItemId];
      if (existing && existing.type === "NORMAL") {
        guestItems[cartItemId] = {
          ...existing,
          quantity: existing.quantity + qtyToAdd,
        };
      } else {
        guestItems[cartItemId] = {
          type: "NORMAL",
          cartItemId,
          productId,
          variantId,
          productName: productDetails?.productName || "Honey Product",
          categoryName: productDetails?.type === "NORMAL" ? productDetails.categoryName : "Honey",
          image: productDetails?.image || "/placeholder.png",
          price: productDetails?.price || 0,
          weight: (productDetails?.type === "NORMAL" ? productDetails.weight : "") || "",
          quantity: qtyToAdd,
        };
      }

      saveGuestCart(guestItems);
      setToastProduct({
        title: guestItems[cartItemId].productName,
        weight: guestItems[cartItemId].type === "NORMAL" ? guestItems[cartItemId].weight : "",
      });
    }
  };

  // ---------- Update Quantity for NORMAL items ----------
  const updateQuantity = async (productId: string, variantId: string, change: number) => {
    const item = Object.values(cartItems).find(
      (i): i is Extract<CartItemDetail, { type: "NORMAL" }> =>
        i.type === "NORMAL" && i.productId === productId && i.variantId === variantId
    );

    if (!item) return;

    if (change < 0 && item.quantity <= 1) {
      return;
    }

    const previousCartItems = cartItems;
    setCartItems((prev) => ({
      ...prev,
      [item.cartItemId]: {
        ...prev[item.cartItemId],
        quantity: prev[item.cartItemId].quantity + change,
      },
    }));

    try {
      const endpoint =
        change > 0
          ? `${API_BASE_URL}/api/cart/increase-quantity`
          : `${API_BASE_URL}/api/cart/decrease-quantity`;
      await authFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          itemId: item.cartItemId,
          productId,
          variantId,
        }),
      });
      await fetchCart();
      window.dispatchEvent(new CustomEvent("trigger-live-update"));
    } catch (err) {
      // Guest update
      const guestItems = getGuestCart();
      if (guestItems[item.cartItemId]) {
        guestItems[item.cartItemId].quantity = Math.max(
          guestItems[item.cartItemId].quantity + change,
          1
        );
        saveGuestCart(guestItems);
      } else {
        setCartItems(previousCartItems);
      }
    }
  };

  // ---------- Update Quantity for CUSTOM items ----------
  const updateCustomQuantity = async (cartItemId: string, change: number) => {
    const item = Object.values(cartItems).find(
      (i): i is Extract<CartItemDetail, { type: "CUSTOM" }> =>
        i.type === "CUSTOM" && i.cartItemId === cartItemId
    );

    if (!item) return;

    if (change < 0 && item.quantity <= 1) {
      return;
    }

    const previousCartItems = cartItems;
    setCartItems((prev) => ({
      ...prev,
      [cartItemId]: {
        ...prev[cartItemId],
        quantity: prev[cartItemId].quantity + change,
      },
    }));

    try {
      const endpoint =
        change > 0
          ? `${API_BASE_URL}/api/cart/increase-quantity`
          : `${API_BASE_URL}/api/cart/decrease-quantity`;
      await authFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          itemId: cartItemId,
        }),
      });
      await fetchCart();
      window.dispatchEvent(new CustomEvent("trigger-live-update"));
    } catch (err) {
      const guestItems = getGuestCart();
      if (guestItems[cartItemId]) {
        guestItems[cartItemId].quantity = Math.max(guestItems[cartItemId].quantity + change, 1);
        saveGuestCart(guestItems);
      } else {
        setCartItems(previousCartItems);
      }
    }
  };

  // ---------- Remove item ----------
  const removeItem = async (cartItemId: string) => {
    const previousCartItems = cartItems;

    setCartItems((prev) => {
      const next = { ...prev };
      delete next[cartItemId];
      return next;
    });

    try {
      await authFetch(`${API_BASE_URL}/api/cart/remove`, {
        method: "POST",
        body: JSON.stringify({ itemId: cartItemId }),
      });
      await fetchCart();
      window.dispatchEvent(new CustomEvent("trigger-live-update"));
    } catch (err) {
      const guestItems = getGuestCart();
      if (guestItems[cartItemId]) {
        delete guestItems[cartItemId];
        saveGuestCart(guestItems);
      } else {
        setCartItems(previousCartItems);
      }
    }
  };

  // ---------- Open/Close Cart (No Forced Login Redirect) ----------
  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // ---------- Derived state ----------
  const cartProducts = useMemo(() => {
    return Object.values(cartItems);
  }, [cartItems]);

  const localItemCount = cartProducts.reduce((sum, p) => sum + p.quantity, 0);
  const itemCount = apiCartCount !== null && apiCartCount > 0 ? apiCartCount : localItemCount;
  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const saved = cartProducts.reduce(
    (sum, p) =>
      sum + (p.type === "NORMAL" ? Math.max((p.oldPrice || 0) - p.price, 0) * p.quantity : 0),
    0
  );

  // ---------- Toast auto-close ----------
  useEffect(() => {
    if (!toastProduct) return;
    const timer = setTimeout(() => setToastProduct(null), 3800);
    return () => clearTimeout(timer);
  }, [toastProduct]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        addToCart,
        updateQuantity,
        updateCustomQuantity,
        removeItem,
        fetchCart,
        openCart,
        closeCart,
        isLoading,
        isCartOpen,
      }}
    >
      {children}

      {/* Toast notification */}
      {toastProduct && (
        <div className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <button
            type="button"
            onClick={() => setToastProduct(null)}
            className="absolute right-5 top-5 text-[#9F8266]"
          >
            <X size={18} />
          </button>
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DFF8E7] text-[#18A752]">
              <Check size={22} />
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-[#593102]">
                {toastProduct.title} ({toastProduct.weight})
              </h3>
              <p className="mt-1 text-[16px] text-[#6D7280]">added to your cart!</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setToastProduct(null);
                    const session = getStoredSession();
                    if (!session || !session.user?.mobile) {
                      router.push("/login");
                    } else {
                      router.push("/cart");
                    }
                  }}
                  className="rounded-lg border border-[#593102] px-5 py-2 text-[15px] font-bold text-[#593102] hover:bg-[#FFF2D8]"
                >
                  View Cart
                </button>
                <button
                  type="button"
                  onClick={() => setToastProduct(null)}
                  className="px-2 py-2 text-[15px] font-bold text-[#9AA1AF] hover:text-[#593102]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glass morphism blur background */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsCartOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />
      </div>

      {/* Cart sidebar with glass effect */}
      <aside
        className={`fixed right-0 top-[62px] z-[70] flex h-[calc(100dvh-62px)] w-full max-w-[420px] flex-col rounded-l-[24px] overflow-hidden border border-r-0 border-[#EADCC9]/80 bg-[#FFFDF9]/95 backdrop-blur-xl shadow-[-20px_0_60px_rgba(0,0,0,0.15)] transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#EADCC9]/80 px-5 bg-white/80 rounded-tl-[24px]">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-extrabold text-[#593102]">
              My Cart
            </h2>
            <span className="inline-flex items-center justify-center rounded-full bg-[#FAF0DC] border border-[#D49313]/40 px-2.5 py-0.5 text-xs font-black text-[#593102] shadow-2xs">
              {itemCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF5EC] text-[#593102] hover:bg-[#FAF0DC] hover:text-[#D49313] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-[#D49313] animate-pulse" />
                <div className="h-3 w-3 rounded-full bg-[#8F590A] animate-pulse delay-150" />
                <div className="h-3 w-3 rounded-full bg-[#593102] animate-pulse delay-300" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Loading your cart...</p>
            </div>
          ) : cartProducts.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#EADCC9] bg-white/60 p-8 text-center text-[#6E5D4F] font-medium my-6">
              Your cart is currently empty.
            </div>
          ) : (
            <div className="space-y-3.5">
              {cartProducts.map((product) => (
                <div
                  key={product.cartItemId}
                  className="rounded-2xl border-2 border-[#EADCC9]/80 bg-white/90 p-3.5 shadow-xs hover:border-[#D49313]/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-[#FAF5EC] border border-[#EADCC9]/60 p-1.5">
                    <Image
                      src={product.image}
                      alt={product.productName}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-[14px] font-extrabold leading-tight text-[#593102]">
                      {product.productName}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6E5D4F] font-semibold">
                      {product.type === "NORMAL"
                        ? product.weight || "Selected weight"
                        : product.customMessage || "Gift box"}
                    </p>
                    <p className="mt-1.5 font-serif text-base font-extrabold text-[#593102]">
                      ₹{product.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between self-stretch py-0.5">
                    <button
                      type="button"
                      onClick={() => removeItem(product.cartItemId)}
                      className="p-1 text-[#8D7F73] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center rounded-full border border-[#D49313]/40 bg-[#FAF0DC] text-[#593102] px-2 py-0.5 text-xs font-extrabold shadow-2xs">
                      <button
                        type="button"
                        onClick={() =>
                          product.type === "NORMAL"
                            ? updateQuantity(product.productId, product.variantId, -1)
                            : updateCustomQuantity(product.cartItemId, -1)
                        }
                        className="flex h-5 w-5 items-center justify-center text-[#593102] hover:text-[#D49313] transition cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-5 text-center font-black text-[#593102] text-xs">
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          product.type === "NORMAL"
                            ? updateQuantity(product.productId, product.variantId, 1)
                            : updateCustomQuantity(product.cartItemId, 1)
                        }
                        className="flex h-5 w-5 items-center justify-center text-[#593102] hover:text-[#D49313] transition cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t-2 border-[#EADCC9]/80 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FAF0DC] p-5 shadow-inner">
          <div className="mb-4 flex items-start justify-between text-[#593102]">
            <div>
              <p className="font-serif text-base font-extrabold">
                Subtotal
              </p>
              <p className="text-xs font-bold text-[#8D7F73] uppercase tracking-wider mt-0.5">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
              {saved > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full mt-1.5 shadow-2xs">
                  You save ₹{saved}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl font-extrabold text-[#593102]">
                ₹{subtotal.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                const session = getStoredSession();
                if (!session || !session.user?.mobile) {
                  router.push("/login");
                } else {
                  router.push("/cart");
                }
              }}
              className="flex h-[42px] w-full max-w-[240px] items-center justify-center rounded-xl bg-[#F24E1E] hover:bg-[#D93F13] text-[12px] font-extrabold uppercase tracking-wider text-white shadow-md hover:shadow-lg hover:shadow-[#F24E1E]/35 hover:-translate-y-1 transition-all duration-300 cursor-pointer active:translate-y-0 active:scale-95"
            >
              VIEW FULL CART
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[#EADCC9]/60 pt-4 text-center text-[#593102]">
            <span className="flex flex-col items-center">
              <RotateCcw className="mb-1 h-4 w-4 text-[#D49313]" />
              <strong className="text-[10px] font-bold uppercase tracking-wider">Easy Returns</strong>
              <small className="text-[9px] text-[#6E5D4F] font-medium">Hassle-Free</small>
            </span>
            <span className="flex flex-col items-center">
              <Leaf className="mb-1 h-4 w-4 text-[#D49313]" />
              <strong className="text-[10px] font-bold uppercase tracking-wider">Raw &amp; Natural</strong>
              <small className="text-[9px] text-[#6E5D4F] font-medium">Pure Goodness</small>
            </span>
            <span className="flex flex-col items-center">
              <Truck className="mb-1 h-4 w-4 text-[#D49313]" />
              <strong className="text-[10px] font-bold uppercase tracking-wider">Fast Delivery</strong>
              <small className="text-[9px] text-[#6E5D4F] font-medium">Quick &amp; Safe</small>
            </span>
          </div>
        </div>
      </aside>
    </CartContext.Provider>
  );
}
