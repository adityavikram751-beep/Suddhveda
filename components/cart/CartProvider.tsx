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
import { allProducts, type Product } from "@/lib/shop-data";

type CartContextValue = {
  cartItems: Record<number, number>;
  itemCount: number;
  addToCart: (product: Product) => void;
  updateQuantity: (product: Product, change: number) => void;
  openCart: () => void;
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
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastProduct, setToastProduct] = useState<Product | null>(null);

  const cartProducts = useMemo(() => {
    return allProducts
      .filter((product) => cartItems[product.id] > 0)
      .map((product) => ({ ...product, quantity: cartItems[product.id] }));
  }, [cartItems]);

  const itemCount = cartProducts.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const subtotal = cartProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const saved = cartProducts.reduce(
    (sum, product) =>
      sum + Math.max(product.oldPrice - product.price, 0) * product.quantity,
    0
  );

  useEffect(() => {
    if (!toastProduct) return;

    const timer = setTimeout(() => {
      setToastProduct(null);
    }, 3800);

    return () => clearTimeout(timer);
  }, [toastProduct]);

  const updateQuantity = (product: Product, change: number) => {
    setCartItems((prev) => {
      const nextQuantity = Math.max((prev[product.id] ?? 0) + change, 0);
      const next = { ...prev };

      if (nextQuantity === 0) {
        delete next[product.id];
      } else {
        next[product.id] = nextQuantity;
      }

      return next;
    });
  };

  const addToCart = (product: Product) => {
    updateQuantity(product, 1);
    setToastProduct(product);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        addToCart,
        updateQuantity,
        openCart: () => setIsCartOpen(true),
      }}
    >
      {children}

      {toastProduct && (
        <div className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <button
            type="button"
            aria-label="Close cart message"
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
                {toastProduct.title} ({toastProduct.weight.split(" - ")[0]})
              </h3>
              <p className="mt-1 text-[16px] text-[#6D7280]">
                added to your cart!
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(true);
                    setToastProduct(null);
                  }}
                  className="rounded-lg border border-[#D89A1B] px-5 py-2 text-[15px] font-bold text-[#D89A1B] hover:bg-[#FFF2D8]"
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

      <div
        className={`fixed inset-0 z-[60] bg-black/35 transition-opacity ${
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

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
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
            className="text-[#3C2015] hover:text-[#D89A1B]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {cartProducts.length === 0 ? (
            <div className="rounded-xl bg-white p-5 text-center text-[#8E623A]">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-4">
              {cartProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-[70px_1fr_72px] gap-3"
                >
                  <div className="relative h-[70px] w-[70px] overflow-hidden rounded-sm bg-[#FFF8EF]">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[14px] font-bold leading-5 text-[#1F1A16]">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-[#6F6258]">
                      {product.weight.split(" - ")[0]}
                    </p>
                    <p className="mt-4 text-[15px] font-bold text-[#111]">
                      ₹{product.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      type="button"
                      aria-label="Remove product"
                      onClick={() =>
                        setCartItems((prev) => {
                          const next = { ...prev };
                          delete next[product.id];
                          return next;
                        })
                      }
                      className="text-[#5B3A20] hover:text-[#D89A1B]"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid h-[24px] grid-cols-3 items-center rounded-full border border-[#D9B88D] bg-white text-[12px]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(product, -1)}
                        className="flex h-full items-center justify-center text-[#5B3A20]"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="min-w-5 text-center font-bold text-[#111]">
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(product, 1)}
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
                    className="h-full rounded-full bg-[#D89A1B]"
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
            className="flex h-12 w-full items-center justify-center gap-2 rounded bg-[#D89A1B] text-[16px] font-bold text-white hover:bg-[#C98715]"
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
