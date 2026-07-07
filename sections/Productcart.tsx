"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ChevronRight, Lock } from "lucide-react";
import { useCart } from "@/components/context/page";
import ProductCard from "@/components/Productcard";

const FREE_DELIVERY_THRESHOLD = 2000;

const youMayAlsoLike = [
  {
    id: 3,
    slug: "multiflora-honey",
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.9,
    reviews: 120,
  },
  {
    id: 5,
    slug: "natural-honey-2",
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.9,
    reviews: 120,
  },
  {
    id: 6,
    slug: "natural-honey-3",
    badge: "Most Loved",
    image: "/honneycart.png",
    title: "Multiflora Honey",
    weight: "500g • Dark • Medium",
    price: 750,
    oldPrice: 900,
    discount: "20% Off",
    rating: 4.9,
    reviews: 120,
  },
];

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, totalItems } = useCart();

  const oldSubtotal = items.reduce((sum, i) => sum + i.price * 1.2 * i.quantity, 0);
  const saved = Math.round(oldSubtotal - subtotal);
  const remainingForFree = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const progressPct = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <section className="bg-[#FFF8EF] min-h-screen py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#B59A78]">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#D89A1B] font-medium">Cart</span>
        </div>

        <h1 className="mt-2 text-[26px] font-bold text-[#3C2015]">
          Your Cart ({totalItems})
        </h1>

        {items.length === 0 ? (
          <div className="mt-10 text-center py-16">
            <p className="text-[#B59A78] text-[16px]">Your cart is empty.</p>
            <Link
              href="/shop/all-honey"
              className="inline-block mt-4 bg-[#D89A1B] hover:bg-[#C98715] text-white px-6 py-3 rounded-xl font-semibold text-[14px] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

            {/* Left: items */}
            <div>
              {remainingForFree > 0 && (
                <div className="bg-[#FFF2D8] border border-[#F0DAAE] rounded-xl px-4 py-3 mb-5">
                  <p className="text-[13px] text-[#6B2E08]">
                    🎁 Yay! You are <span className="font-semibold text-[#D89A1B]">₹{remainingForFree}</span> away from FREE delivery!
                  </p>
                  <div className="mt-2 h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-[#D89A1B] rounded-full" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-[#F0E2CC] overflow-hidden">
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-3 text-[12px] font-semibold text-[#B59A78] border-b border-[#F0E2CC]">
                  <span>PRODUCT</span>
                  <span>PRICE</span>
                  <span>QUANTITY</span>
                  <span>TOTAL</span>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-[2fr_1fr_1fr_1fr]
                      items-center
                      gap-3
                      px-5
                      py-4
                      border-b
                      border-[#F0E2CC]
                      last:border-b-0
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl bg-[#FFF8EF] shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#3C2015]">{item.title}</p>
                        <p className="text-[12px] text-[#B59A78]">{item.weight} • Raw &amp; Unfiltered</p>
                        <div className="flex items-center gap-3 mt-1 text-[12px] text-[#B59A78]">
                          <span className="flex items-center gap-1 text-green-700">✓ 100% Raw &amp; Unfiltered</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[12px]">
                          <button className="text-[#B59A78] hover:text-[#D89A1B]">Move to Wishlist</button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-1 text-[#B59A78] hover:text-red-500"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <span className="text-[14px] font-semibold text-[#3C2015]">₹{item.price}</span>

                    <div className="flex items-center gap-2 border border-[#E8D5BA] rounded-full px-2 py-1 w-fit">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={13} className="text-[#6B2E08]" />
                      </button>
                      <span className="text-[13px] w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={13} className="text-[#6B2E08]" />
                      </button>
                    </div>

                    <span className="text-[15px] font-bold text-[#3C2015]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* You may also like */}
              <div className="mt-10">
                <h3 className="text-[18px] font-bold text-[#3C2015] mb-4">You May Also Like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {youMayAlsoLike.map((p) => (
                    <ProductCard key={p.id} {...p} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="bg-white rounded-2xl border border-[#F0E2CC] p-5 h-fit">
              <h3 className="text-[16px] font-bold text-[#3C2015] mb-4">Order Summary</h3>

              <div className="space-y-2 text-[14px]">
                <div className="flex justify-between text-[#6B2E08]">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#6B2E08]">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                {saved > 0 && (
                  <div className="flex justify-between text-[#6B2E08]">
                    <span>You Save</span>
                    <span className="text-green-600 font-medium">- ₹{saved}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#F0E2CC] mt-3 pt-3 flex justify-between items-center">
                <span className="text-[15px] font-bold text-[#3C2015]">Total</span>
                <span className="text-[18px] font-bold text-[#3C2015]">₹{subtotal}</span>
              </div>

              <Link
                href="/checkout/address"
                className="
                  mt-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  w-full
                  bg-[#D89A1B]
                  hover:bg-[#C98715]
                  text-white
                  font-semibold
                  text-[14px]
                  py-3
                  rounded-xl
                  transition-colors
                "
              >
                <Lock size={14} />
                Proceed to Checkout
              </Link>

              <div className="mt-4 bg-[#F5F8EE] border border-[#DCE9C8] rounded-xl px-3 py-2 text-[12px] text-[#3C6B2E]">
                🍯 ShudhVeda Promise — Pure honey, delivered with care.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}