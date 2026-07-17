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
  MapPin,
  ArrowRight,
  ShoppingCart,
  CalendarDays,
  FileText,
  Wallet,
  Bell,
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

function formatOrderDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatOrderTime(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

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

  // Order meta info for the confirmation cards
  const orderDate = new Date();
  const deliveryStart = new Date(orderDate);
  deliveryStart.setDate(deliveryStart.getDate() + 3);
  const deliveryEnd = new Date(orderDate);
  deliveryEnd.setDate(deliveryEnd.getDate() + 5);

  const orderNumber = `SVN${Math.floor(1000000 + Math.random() * 8999999)}`;

  const orderInfoItems = [
    {
      icon: CalendarDays,
      label: "ORDER PLACED",
      value: formatOrderDate(orderDate),
      sub: formatOrderTime(orderDate),
    },
    {
      icon: FileText,
      label: "ORDER NUMBER",
      value: orderNumber,
      valueClass: "text-[#0BA445]",
    },
    {
      icon: Clock,
      label: "ESTIMATED DELIVERY",
      value: `${formatOrderDate(deliveryStart)} - ${formatOrderDate(deliveryEnd)}`,
      sub: "(3-5 business days)",
    },
    {
      icon: Wallet,
      label: "TOTAL PAID",
      value: `₹${total.toLocaleString("en-IN")}`,
      valueClass: "text-[#187A37]",
    },
  ];

  const handleTrackOrder = () => {
    router.push("/trackorder");
  };

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
        {/* Breadcrumb */}

        <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_420px]">
          {/* LEFT COLUMN */}
          <section className="flex h-full flex-col gap-6">
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
                We&apos;ve emailed the order details to{" "}
                <span className="font-medium text-[#187A37]">
                  rahulsharma123@gmail.com
                </span>
              </p>

              {/* Order Info Cards */}
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-[14px] bg-white p-6 sm:grid-cols-4">
                {orderInfoItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center gap-1">
                      <Icon size={20} className="text-[#0BA445]" />
                      <p className="text-[10px] tracking-wide text-[#9AA3AF]">
                        {item.label}
                      </p>
                      <p
                        className={`text-[15px] font-bold ${item.valueClass ?? "text-[#2F241C]"}`}
                      >
                        {item.value}
                      </p>
                      {item.sub && (
                        <p className="text-[11px] text-[#9AA3AF]">{item.sub}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Notification banner */}
              <div className="mt-5 flex items-center justify-center gap-2 rounded-[10px] bg-[#E4F7E7] py-3 text-[13px] font-medium text-[#187A37]">
                <Bell size={16} />
                We&apos;ll notify you at every step until your order reaches you.
              </div>
            </div>

            {/* What happens next? */}
            <div className="flex flex-1 flex-col rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <h2 className="font-serif text-[19px] font-bold">
                What happens next?
              </h2>
              <div className="relative mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
                {/* Dotted connector line (desktop only) */}
                <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 hidden border-t-2 border-dotted border-[#E3D9C8] sm:block" />

                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === 0;
                  return (
                    <div
                      key={step.id}
                      className="relative flex flex-col items-center gap-2 text-center"
                    >
                      <div
                        className={`z-10 flex h-12 w-12 items-center justify-center rounded-xl border-2 bg-white ${
                          isActive
                            ? "border-[#0BA445] text-[#0BA445]"
                            : "border-[#EEF1F4] text-[#9AA3AF]"
                        }`}
                      >
                        <Icon size={22} />
                      </div>
                      <p className="text-[14px] font-semibold">{step.label}</p>
                      <p className="text-[12px] leading-snug text-[#9AA3AF]">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping + Track Order Buttons */}
              <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:justify-between">
                <Link
                  href="/shop"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#2D3A1B] px-6 text-[14px] font-bold text-[#2D3A1B] hover:bg-[#FFF8EF] transition"
                >
                  <ShoppingCart size={16} />
                  Continue Shopping
                </Link>
                <button
                  type="button"
                  onClick={handleTrackOrder}
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#D18500] px-6 text-[14px] font-bold text-white hover:bg-[#B97100] transition"
                >
                  Track Your Order
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN – Order Summary */}
          <aside className="flex h-full flex-col">
            <div className="w-full h-full flex flex-col rounded-[22px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
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
                  <strong className="text-[#2D3A1B]">
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
                <div className="flex justify-between">
                  <span>Coupon Applied</span>
                  <strong className="text-[#0BA445]">- ₹{saved}</strong>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
                <div>
                  <p className="text-[21px] font-bold">Total</p>
                  <p className="text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
                </div>
                <p className="font-serif text-[28px] font-bold">₹{subtotal.toLocaleString("en-IN")}</p>
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

              {/* Bottom block: Trust Badges + Need Help together in one cream box */}
              <div className="mt-auto pt-8">
                <div className="rounded-[14px] bg-[#FFF8EF] p-5">
                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <span className="p-1">
                      <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
                      <p className="text-[10px] font-bold text-[#2F241C]">Secure Checkout</p>
                      <p className="text-[9px] text-[#9AA3AF]">100% safe payments</p>
                    </span>
                    <span className="p-1">
                      <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
                      <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
                      <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
                    </span>
                    <span className="p-1">
                      <Leaf className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
                      <p className="text-[10px] font-bold text-[#2F241C]">100% Natural</p>
                      <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
                    </span>
                  </div>

                  {/* Need Help */}
                  <div className="relative mt-6">
                    <h2 className="font-serif text-[19px] font-bold">Need help ?</h2>
                    <div className="mt-3 space-y-2 text-[15px] text-[#6F7786]">
                      <p className="flex items-center gap-2">
                        <Phone size={16} className="text-[#2D3A1B]" /> +91 98765 43210
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail size={16} className="text-[#2D3A1B]" /> connect@honeyveda.in
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock size={16} className="text-[#2D3A1B]" /> Mon - Sat : 9AM - 7PM
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
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}