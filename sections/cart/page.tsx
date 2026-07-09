"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  Lock,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";
import ProductCard from "@/components/Productcard";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";

const freeDeliveryTarget = 2000;

export default function Cart() {
  const router = useRouter();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartProducts = allProducts
    .filter((product) => cartItems[product.id] > 0)
    .map((product) => ({ ...product, quantity: cartItems[product.id] }));
  const visibleProducts =
    cartProducts.length > 0
      ? cartProducts
      : allProducts.slice(0, 2).map((product) => ({ ...product, quantity: 1 }));
  const subtotal = visibleProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );
  const saved = visibleProducts.reduce(
    (sum, product) =>
      sum + Math.max(product.oldPrice - product.price, 0) * product.quantity,
    0,
  );
  const recommendations = allProducts.slice(2, 5);

  return (
    <main className="bg-[#FFF8EF] py-10 text-[#2F241C]">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-5 lg:grid-cols-[1fr_390px]">
        <section>
          <h1 className="text-[34px] font-bold">
            Your Cart <span className="text-[#D89A1B]">({visibleProducts.length})</span>
          </h1>

          <FreeDeliveryBar subtotal={subtotal} />

          <div className="mt-14 hidden grid-cols-[1fr_120px_160px_100px] px-5 text-[15px] font-semibold uppercase tracking-[0.08em] text-[#30303A] md:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          <div className="mt-4 space-y-5">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="grid gap-4 rounded bg-white px-5 py-5 md:grid-cols-[1fr_120px_160px_100px] md:items-center"
              >
                <div className="flex gap-5">
                  <div className="relative h-24 w-24 overflow-hidden rounded bg-[#FFF8EF]">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold">{product.title}</h2>
                    <p className="mt-1 text-[12px] text-[#7B8493]">
                      {product.weight.split(" - ")[0]} - Raw & Unfiltered
                    </p>
                    <span className="mt-2 inline-flex rounded-full bg-[#E7F9EA] px-3 py-1 text-[10px] font-bold text-[#149447]">
                      100% Raw & Unfiltered
                    </span>
                    <div className="mt-2 flex gap-4 text-[11px] text-[#7B8493]">
                      <button type="button" className="flex items-center gap-1">
                        <Heart size={12} /> Move to Wishlist
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product, -product.quantity)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[20px] font-bold text-[#D89A1B]">
                  Rs.{product.price}
                </p>
                <QuantityControl
                  quantity={product.quantity}
                  onMinus={() => updateQuantity(product, -1)}
                  onPlus={() => updateQuantity(product, 1)}
                />
                <p className="text-[20px] font-bold text-[#D89A1B]">
                  Rs.{product.price * product.quantity}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mt-8 text-[22px] font-semibold">You May Also Like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recommendations.map((item) => (
              <ProductCard
                key={item.id}
                badge={item.badge}
                image={item.image}
                title={item.title}
                subtitle={item.subtitle}
                weight={item.weight}
                price={item.price}
                oldPrice={item.oldPrice}
                discount={item.discount}
                rating={item.rating}
                reviews={item.reviews}
                quantity={cartItems[item.id] ?? 0}
                onAddToCart={() => addToCart(item)}
                onIncrement={() => updateQuantity(item, 1)}
                onDecrement={() => updateQuantity(item, -1)}
                onOpenDetails={() => router.push(`/shop/products/${item.id}`)}
              />
            ))}
          </div>
        </section>

        <aside className="space-y-8">
          <OrderSummary subtotal={subtotal} saved={saved} checkoutHref="/checkout" />
          <PaymentPanel />
          <HelpPanel />
        </aside>
      </div>
    </main>
  );
}

export function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  return (
    <div className="mt-5 rounded-[10px] border border-[#F0DDC4] bg-white px-6 py-5">
      <p className="text-[13px] text-[#4C5362]">
        Yay! You are Rs.{remaining} away from FREE delivery!
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8EBEF]">
        <div
          className="h-full rounded-full bg-[#D89A1B]"
          style={{
            width: `${Math.min((subtotal / freeDeliveryTarget) * 100, 100)}%`,
          }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[#A2AAB7]">
        <span>Rs.0</span>
        <span>Rs.{freeDeliveryTarget}</span>
      </div>
    </div>
  );
}

export function QuantityControl({
  quantity,
  onMinus,
  onPlus,
}: {
  quantity: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="inline-grid h-9 w-[94px] grid-cols-3 items-center rounded-md border border-[#DFE4EA] bg-[#FBFCFD] text-center">
      <button type="button" onClick={onMinus} className="flex justify-center">
        <Minus size={14} />
      </button>
      <span className="font-bold">{quantity}</span>
      <button type="button" onClick={onPlus} className="flex justify-center">
        <Plus size={14} />
      </button>
    </div>
  );
}

export function OrderSummary({
  subtotal,
  saved,
  checkoutHref,
}: {
  subtotal: number;
  saved: number;
  checkoutHref?: string;
}) {
  const content = (
    <div className="rounded-lg bg-white p-7 shadow-sm">
      <h2 className="text-[20px] font-bold">Order Summary</h2>
      <div className="mt-6 space-y-4 text-[13px] text-[#6F7786]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <strong className="text-[#1F2937]">Rs.{subtotal.toLocaleString("en-IN")}</strong>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <strong className="text-[#0BA445]">FREE</strong>
        </div>
        <div className="flex justify-between">
          <span>You Save</span>
          <strong className="text-[#0BA445]">- Rs.{saved}</strong>
        </div>
      </div>
      <div className="mt-8 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
        <div>
          <p className="text-[21px] font-bold">Total</p>
          <p className="text-[10px] text-[#9AA3AF]">Inclusive of all taxes</p>
        </div>
        <p className="text-[26px] font-bold">Rs.{subtotal.toLocaleString("en-IN")}</p>
      </div>
      {checkoutHref && (
        <a
          href={checkoutHref}
          className="mt-8 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#D18500] text-[15px] font-bold text-white hover:bg-[#B97100]"
        >
          <Lock size={14} />
          Proceed to Checkout
        </a>
      )}
      <div className="mt-7 rounded-lg border border-[#D8F2DD] bg-[#F0FFF4] p-4 text-[13px] text-[#2E7D41]">
        <strong>ShudhVeda Promise</strong>
        <p className="mt-1 text-[#4C5362]">Pure honey, delivered with care.</p>
      </div>
      <TrustBadges />
    </div>
  );

  return content;
}

export function TrustBadges() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 text-center text-[10px] font-bold text-[#6B2E08]">
      <span className="rounded bg-white p-2">
        <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        Secure Checkout
      </span>
      <span className="rounded bg-white p-2">
        <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        Easy Returns
      </span>
      <span className="rounded bg-white p-2">
        <Truck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        Fast Delivery
      </span>
    </div>
  );
}

function PaymentPanel() {
  return (
    <div className="rounded-lg bg-white p-7">
      <h2 className="text-[20px] font-bold">We Accept</h2>
      <div className="mt-7 grid grid-cols-4 gap-4">
        {["VISA", "RuPay", "UPI", "Paytm", "G Pay", "PhonePe", "Master", "SBI"].map(
          (item) => (
            <span
              key={item}
              className="flex h-11 items-center justify-center rounded-md border border-[#EEF1F4] bg-[#FBFAF8] text-[16px] font-bold text-[#25416E]"
            >
              {item}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function HelpPanel() {
  return (
    <div className="relative rounded-lg bg-[#FFF8EF] p-7">
      <h2 className="text-[19px] font-bold">Need help ?</h2>
      <div className="mt-3 space-y-2 text-[17px] text-[#6F7786]">
        <p className="flex items-center gap-2">
          <Phone size={16} className="text-[#D89A1B]" /> +91 98765 43210
        </p>
        <p>connect@honeyveda.in</p>
        <p>Mon - Sat : 9AM - 7PM</p>
      </div>
      <Image
        src="/honey.png"
        alt=""
        width={120}
        height={90}
        className="absolute bottom-2 right-3 opacity-90"
      />
    </div>
  );
}
