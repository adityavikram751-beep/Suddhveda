"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Leaf,
  Lock,
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
  type ReactNode,
} from "react";
import { API_BASE_URL } from "@/lib/auth";

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
      image: string;
      price: number;
      oldPrice?: number;
      weight: string; // e.g., "250g"
      quantity: number;
    }
  | {
      type: "CUSTOM";
      cartItemId: string; // mapped from giftCartItemId
      productName: string; // giftBox.name
      image: string; // giftBox.image
      price: number; // totalAmount
      customMessage?: string;
      quantity: number;
    };

type CartContextValue = {
  cartItems: Record<string, CartItemDetail>; // keyed by cartItemId
  itemCount: number;
  addToCart: (productId: string, variantId: string) => Promise<void>;
  updateQuantity: (productId: string, variantId: string, change: number) => Promise<void>;
  updateCustomQuantity: (cartItemId: string, change: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  openCart: () => void;
  isLoading: boolean;
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
  const [cartItems, setCartItems] = useState<Record<string, CartItemDetail>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastProduct, setToastProduct] = useState<{ title: string; weight: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---------- Fetch cart from backend ----------
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await authFetch(`${API_BASE_URL}/api/cart`);
      const items = data.items || [];

      const newCartItems: Record<string, CartItemDetail> = {};

      items.forEach((item: any) => {
        if (item.type === "CUSTOM") {
          // Gift box item - different shape, no single product/variant
          const cartItemId = item.giftCartItemId;
          newCartItems[cartItemId] = {
            type: "CUSTOM",
            cartItemId,
            productName: item.giftBox?.name || "Gift Box",
            image: item.giftBox?.image || "/placeholder.png",
            price: item.totalAmount || 0,
            customMessage: item.customMessage,
            quantity: item.quantity,
          };
          return;
        }

        // NORMAL item
        const product = item.product;
        const variant = product?.variant;
        if (!product || !variant) return; // skip malformed items instead of crashing

        const cartItemId = item.cartItemId;

        newCartItems[cartItemId] = {
          type: "NORMAL",
          cartItemId,
          productId: product._id,
          variantId: variant._id,
          productName: product.product_name,
          image: product.image?.image_url || "/placeholder.png",
          price: variant.price || 0,
          oldPrice: variant.mrp || undefined,
          weight: `${variant.weight || 0}${variant.unit || "g"}`,
          quantity: item.quantity,
        };
      });

      setCartItems(newCartItems);
      return newCartItems;
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems({});
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ---------- Add to Cart ----------
  const addToCart = async (productId: string, variantId: string) => {
    try {
      await authFetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        body: JSON.stringify({
          productId,
          selectedWeight: variantId,
          quantity: 1,
        }),
      });
      const updatedCart = await fetchCart();

      // Find added item for toast (use the freshly fetched cart, not stale state)
      const added = Object.values(updatedCart).find(
        (item): item is Extract<CartItemDetail, { type: "NORMAL" }> =>
          item.type === "NORMAL" && item.productId === productId && item.variantId === variantId
      );
      if (added) {
        setToastProduct({ title: added.productName, weight: added.weight });
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // ---------- Update Quantity for NORMAL items (by productId + variantId) ----------
  const updateQuantity = async (productId: string, variantId: string, change: number) => {
    // Find the cart item with matching productId & variantId (NORMAL items only)
    const item = Object.values(cartItems).find(
      (i): i is Extract<CartItemDetail, { type: "NORMAL" }> =>
        i.type === "NORMAL" && i.productId === productId && i.variantId === variantId
    );

    if (!item) {
      console.error("Update quantity error: item not found in cart");
      return;
    }

    // Don't let quantity go below 1 on the client
    if (change < 0 && item.quantity <= 1) {
      return;
    }

    // ---------- Optimistic update: change number instantly on screen ----------
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
      // Sync with server truth in the background
      await fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err);
      // Roll back optimistic change if the request failed
      setCartItems(previousCartItems);
    }
  };

  // ---------- Update Quantity for CUSTOM / gift box items (by cartItemId) ----------
  // NOTE: endpoint names below are ASSUMED (/api/cart/gift/increase-quantity,
  // /api/cart/gift/decrease-quantity) with body { itemId: giftCartItemId }.
  // If your backend uses different route names or a different body field,
  // update ENDPOINT + body below to match.
  const updateCustomQuantity = async (cartItemId: string, change: number) => {
    const item = Object.values(cartItems).find(
      (i): i is Extract<CartItemDetail, { type: "CUSTOM" }> =>
        i.type === "CUSTOM" && i.cartItemId === cartItemId
    );

    if (!item) {
      console.error("Update custom quantity error: gift item not found in cart");
      return;
    }

    if (change < 0 && item.quantity <= 1) {
      return;
    }

    // ---------- Optimistic update ----------
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
    } catch (err) {
      console.error("Update custom quantity error:", err);
      setCartItems(previousCartItems);
    }
  };

  // ---------- Remove item (by cartItemId) ----------
  const removeItem = async (cartItemId: string) => {
    const previousCartItems = cartItems;

    // Optimistic removal
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
    } catch (err) {
      console.error("Remove item error:", err);
      setCartItems(previousCartItems);
    }
  };

  // ---------- Derived state ----------
  const cartProducts = useMemo(() => {
    return Object.values(cartItems);
  }, [cartItems]);

  const itemCount = cartProducts.reduce((sum, p) => sum + p.quantity, 0);
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
        openCart: () => setIsCartOpen(true),
        isLoading,
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
              <h3 className="text-[20px] font-bold text-[#2D3A1B]">
                {toastProduct.title} ({toastProduct.weight})
              </h3>
              <p className="mt-1 text-[16px] text-[#6D7280]">added to your cart!</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(true);
                    setToastProduct(null);
                  }}
                  className="rounded-lg border border-[#2D3A1B] px-5 py-2 text-[15px] font-bold text-[#2D3A1B] hover:bg-[#FFF2D8]"
                >
                  View Cart
                </button>
                <button
                  type="button"
                  onClick={() => setToastProduct(null)}
                  className="px-2 py-2 text-[15px] font-bold text-[#9AA1AF] hover:text-[#2D3A1B]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/35 transition-opacity ${
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart sidebar */}
      <aside
        className={`fixed right-0 top-[62px] z-[70] flex h-[calc(100dvh-62px)] w-full max-w-[392px] flex-col rounded-l-[18px] border border-r-0 border-[#D9B88D] bg-white shadow-[-18px_0_50px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#D9B88D] px-4">
          <h2 className="font-serif text-[16px] font-medium text-[#3C2015]">
            My Cart <span className="font-normal">({itemCount})</span>
          </h2>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="text-[#3C2015] hover:text-[#2D3A1B]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {isLoading ? (
            <div className="text-center text-[#8E623A]">Loading cart...</div>
          ) : cartProducts.length === 0 ? (
            <div className="rounded-xl bg-white p-5 text-center text-[#8E623A]">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-4">
              {cartProducts.map((product) => (
                <div
                  key={product.cartItemId}
                  className="grid grid-cols-[70px_1fr_72px] gap-3"
                >
                  <div className="relative h-[70px] w-[70px] overflow-hidden rounded-sm bg-[#FFF8EF]">
                    <Image
                      src={product.image}
                      alt={product.productName}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[14px] font-bold leading-5 text-[#1F1A16]">
                      {product.productName}
                    </h3>
                    <p className="text-[11px] text-[#6F6258]">
                      {product.type === "NORMAL"
                        ? product.weight || "Selected weight"
                        : product.customMessage || "Gift box"}
                    </p>
                    <p className="mt-4 text-[15px] font-bold text-[#111]">
                      ₹{product.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      type="button"
                      onClick={() => removeItem(product.cartItemId)}
                      className="text-[#5B3A20] hover:text-[#2D3A1B]"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid h-[24px] grid-cols-3 items-center rounded-full border border-[#D9B88D] bg-white text-[12px]">
                      <button
                        type="button"
                        onClick={() =>
                          product.type === "NORMAL"
                            ? updateQuantity(product.productId, product.variantId, -1)
                            : updateCustomQuantity(product.cartItemId, -1)
                        }
                        className="flex h-full items-center justify-center text-[#5B3A20]"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="min-w-5 text-center font-bold text-[#111]">
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          product.type === "NORMAL"
                            ? updateQuantity(product.productId, product.variantId, 1)
                            : updateCustomQuantity(product.cartItemId, 1)
                        }
                        className="flex h-full items-center justify-center text-[#5B3A20]"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded bg-[#FCEBDD] px-4 py-3">
                <p className="flex items-center gap-2 text-[12px] font-bold text-[#2D3A1B]">
                  <Tag size={14} className="text-[#9A5A05]" />
                  Yay! You saved ₹{saved} on this order
                </p>
                <p className="mt-3 text-[11px] text-[#7E6A56]">
                  Add items worth ₹{Math.max(1400 - subtotal, 0)} more to get
                  FREE delivery!
                </p>
                <div className="mt-3 h-[6px] overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[#2D3A1B]"
                    style={{ width: `${Math.min((subtotal / 1400) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-[#7E6A56]">
                  <span>₹0</span>
                  <span className="flex items-center gap-1">
                    <Truck size={11} /> ₹400
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-[#D9B88D] bg-[#FFF1E5] px-4 py-5">
          <div className="mb-4 flex items-center justify-between text-[#3C2015]">
            <div>
              <p className="text-[15px] font-bold">
                Subtotal <span className="font-normal text-[#7E6A56]">({itemCount} items)</span>
              </p>
              <p className="mt-1 text-[12px] text-[#7E6A56]">You save</p>
            </div>
            <div className="text-right">
              <p className="text-[17px] font-bold">
                ₹{subtotal.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[12px] font-bold text-[#B97800]">₹{saved}</p>
            </div>
          </div>
          <Link
            href="/checkout"
            onClick={() => setIsCartOpen(false)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded bg-[#2D3A1B] text-[16px] font-bold text-white hover:bg-[#C98715]"
          >
            <Lock size={14} />
            Checkout Securely
            <ArrowRight size={17} />
          </Link>
          <Link
            href="/cart"
            onClick={() => setIsCartOpen(false)}
            className="mt-3 block h-12 w-full rounded border border-[#9A5A05] bg-white py-3 text-center text-[16px] font-bold text-[#9A5A05] hover:bg-[#FFF8EF]"
          >
            View Cart
          </Link>
          <div className="mt-7 grid grid-cols-3 gap-2 border-t border-[#D9B88D] pt-5 text-center text-[#4A2B12]">
            <span className="flex flex-col items-center">
              <RotateCcw className="mb-1 h-5 w-5 text-[#9A5A05]" />
              <strong className="text-[10px]">Easy Returns</strong>
              <small className="text-[8px] text-[#7E6A56]">Hassle-Free</small>
            </span>
            <span className="flex flex-col items-center">
              <Leaf className="mb-1 h-5 w-5 text-[#9A5A05]" />
              <strong className="text-[10px]">100% Natural</strong>
              <small className="text-[8px] text-[#7E6A56]">
                Pure & Unadulterated
              </small>
            </span>
            <span className="flex flex-col items-center">
              <Truck className="mb-1 h-5 w-5 text-[#9A5A05]" />
              <strong className="text-[10px]">Fast Delivery</strong>
              <small className="text-[8px] text-[#7E6A56]">
                Quick & Reliable
              </small>
            </span>
          </div>
        </div>
      </aside>
    </CartContext.Provider>
  );
}