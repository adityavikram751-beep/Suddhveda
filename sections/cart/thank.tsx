"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  RotateCcw,
  Leaf,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  Heart,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";

const freeDeliveryTarget = 2000;

const orderSteps = [
  { id: 1, label: "Order Confirmed", description: "We've received your order.", icon: CheckCircle2 },
  { id: 2, label: "Packed with Care", description: "Your items are being packed carefully.", icon: Package },
  { id: 3, label: "Shipped", description: "Your order is on the way.", icon: Truck },
  { id: 4, label: "Delivered", description: "Your order will be delivered soon.", icon: MapPin },
];

export default function OrderConfirmation() {
  const router = useRouter();
  const { cartItems } = useCart();

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

  const total = subtotal;
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const handleTrackOrder = () => {
    router.push("/orders");
  };

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#7B8493]">
          <Link href="/" className="font-medium text-[#2F241C] hover:text-[#D89A1B]">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/cart" className="font-medium text-[#2F241C] hover:text-[#D89A1B]">
            Cart
          </Link>{" "}
          &gt;{" "}
          <Link
            href="/checkout"
            className="font-medium text-[#2F241C] hover:text-[#D89A1B]"
          >
            Checkout
          </Link>{" "}
          &gt;{" "}
          <Link
            href="/review"
            className="font-medium text-[#2F241C] hover:text-[#D89A1B]"
          >
            Review
          </Link>{" "}
          &gt; <span className="font-semibold text-[#D89A1B]">Confirmation</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
          {/* LEFT COLUMN */}
          <section className="flex flex-col gap-6">
            {/* Success Header */}
            <div className="rounded-[16px] border border-[#D7F3D9] bg-[#F0FFF4] p-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#0BA445] text-white">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="font-serif text-[34px] font-bold text-[#187A37]">
                Thank You for Your Order!
              </h1>
              <p className="mt-2 text-[16px] text-[#4C5362]">
                Your order has been placed successfully.
              </p>
              <p className="mt-1 text-[14px] text-[#6F7786]">
                We've emailed the order details to{" "}
                <span className="font-medium text-[#2F241C]">
                  rahulsharma123@gmail.com
                </span>
              </p>
            </div>

            {/* Order Summary inside the main flow - but we'll use the same component below */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <h2 className="font-serif text-[19px] font-bold">Order Summary</h2>

              <div className="mt-5 space-y-4">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-lg border border-[#EEF1F4] p-4 bg-[#FBFCFD]"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold">{product.title}</p>
                      <p className="text-[12px] text-[#9AA3AF]">
                        {product.weight.split(" - ")[0]} - Raw & Unfiltered
                      </p>
                      <p className="text-[12px] text-[#6F7786]">Qty: {product.quantity}</p>
                    </div>
                    <p className="text-[15px] font-bold text-[#D89A1B]">
                      ₹{product.price * product.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-[#EEF1F4] pt-5 text-[13px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#1F2937]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong className="text-[#0BA445]">FREE</strong>
                </div>
                <div className="flex justify-between">
                  <span>You Save</span>
                  <strong className="text-[#0BA445]">- ₹{saved}</strong>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
                <div>
                  <p className="text-[21px] font-bold">Total Paid</p>
                  <p className="text-[10px] text-[#9AA3AF]">
                    (Inclusive of all taxes)
                  </p>
                </div>
                <p className="text-[26px] font-bold text-[#187A37]">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* What happens next? */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <h2 className="font-serif text-[19px] font-bold">
                What happens next?
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 rounded-lg border border-[#EEF1F4] p-4 bg-[#FBFCFD]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF8EF] text-[#D89A1B]">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold">{step.label}</p>
                        <p className="text-[12px] text-[#6F7786]">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track Order Button */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <button
                type="button"
                onClick={handleTrackOrder}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#D18500] text-[14px] font-bold text-white hover:bg-[#B97100] transition"
              >
                Track Your Order
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* RIGHT COLUMN – Order Summary (same as previous pages) */}
          <aside className="flex flex-col h-full">
            <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
                <span className="text-[12px] text-[#9AA3AF]">
                  {visibleProducts.length} Items
                </span>
              </div>

              <div className="mt-5 max-h-[280px] space-y-4 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold">{product.title}</p>
                      <p className="text-[11px] text-[#9AA3AF]">
                        {product.weight.split(" - ")[0]} - Raw & Unfiltered
                      </p>
                      <p className="text-[11px] text-[#9AA3AF]">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <p className="text-[14px] font-bold">₹{product.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-[#EEF1F4] pt-5 text-[13px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#1F2937]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <strong className="text-[#0BA445]">FREE</strong>
                </div>
                <div className="flex justify-between">
                  <span>You Save</span>
                  <strong className="text-[#0BA445]">- ₹{saved}</strong>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
                <div>
                  <p className="text-[21px] font-bold">Total Paid</p>
                  <p className="text-[10px] text-[#9AA3AF]">
                    (Inclusive of all taxes)
                  </p>
                </div>
                <p className="text-[26px] font-bold text-[#187A37]">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Savings and free delivery progress */}
              <div className="mt-6 rounded-[14px] border border-[#D7F3D9] bg-[#F0FFF4] p-4">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-[#187A37]">
                  <ShieldCheck size={16} /> You&apos;re saving ₹{saved} on this order!
                </p>
                {remaining > 0 && (
                  <>
                    <p className="mt-2 text-[12px] text-[#4C5362]">
                      Add items worth ₹{remaining} more to get FREE delivery!
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DDEFE0]">
                      <div
                        className="h-full rounded-full bg-[#0BA445]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-[#9AA3AF]">
                      <span>₹0</span>
                      <span>₹{freeDeliveryTarget}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Secure Checkout</p>
                  <p className="text-[9px] text-[#9AA3AF]">100% safe payments</p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
                  <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <Leaf className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">100% Natural</p>
                  <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
                </div>
              </div>

              {/* Need Help – at bottom */}
              <div className="mt-auto pt-6 border-t border-[#EEF1F4]">
                <div className="relative">
                  <h2 className="font-serif text-[19px] font-bold">Need help ?</h2>
                  <div className="mt-3 space-y-2 text-[15px] text-[#6F7786]">
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-[#D89A1B]" /> +91 98765 43210
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={16} className="text-[#D89A1B]" /> connect@honeyveda.in
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={16} className="text-[#D89A1B]" /> Mon - Sat : 9AM - 7PM
                    </p>
                  </div>
                  <div className="absolute bottom-0 right-0 opacity-100">
                    <Image
                      src="/need.png"
                      alt="Honey illustration"
                      width={200}
                      height={90}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}