"use client";

import { useState, useEffect } from "react";
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
import { API_BASE_URL, getStoredSession } from "@/lib/auth";

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

interface LocationData {
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  _id?: string;
  phone?: string;
  phone_timing?: string;
  email?: string;
  email_reply_time?: string;
  whatsapp?: string;
  whatsapp_timing?: string;
  map_embed_url?: string;
  isActive?: boolean;
}

export default function OrderConfirmation() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/location/all`);
        if (res.ok) {
          const data = await res.json();
          const loc = data.data || data.location || (Array.isArray(data) ? data[0] : null);
          if (loc) setLocation(loc);
        }
      } catch (err) {
        console.error("Error fetching location in thank page:", err);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const session = getStoredSession();
    if (!session || !session.user?.mobile) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrder = localStorage.getItem("latest_order");
      if (savedOrder) {
        try {
          const parsed = JSON.parse(savedOrder);
          setOrder(parsed);

          const pendingPayload = localStorage.getItem("pending_cod_payload");
          if (pendingPayload) {
            localStorage.removeItem("pending_cod_payload");
            fetch(`${API_BASE_URL}/api/order/create`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: pendingPayload,
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success || data.orders || data.group) {
                  const realId = data.group?.group_id || data.orders?.[0]?.order_id;
                  if (realId) {
                    const updatedOrder = { ...parsed, orderId: realId };
                    setOrder(updatedOrder);
                    localStorage.setItem("latest_order", JSON.stringify(updatedOrder));
                  }
                }
              })
              .catch((err) => console.error("Error creating COD order on thank page:", err));
          }
        } catch (e) {
          console.error("Error parsing latest_order", e);
        }
      }
    }
  }, []);

  // ----- FIX: Safely extract quantity from cartItems -----
  const cartProducts = allProducts
    .filter((product) => {
      const item = cartItems[product.id];
      return item && item.quantity > 0;
    })
    .map((product) => {
      const item = cartItems[product.id];
      return { ...product, quantity: item ? item.quantity : 0 };
    });

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

  const isSubscriptionOrder = Boolean(
    order?.planName || order?.purchase?.plan || order?.purchase_id || order?.purchase
  );

  const subscriptionItems = isSubscriptionOrder
    ? [
        {
          title: order?.planName || order?.purchase?.plan?.name || "Subscription Plan",
          weight: order?.purchase?.plan?.packageLabel || `${order?.purchase?.plan?.numberOfJars || 6} Jars Delivery`,
          quantity: 1,
          price: order?.pricing?.total || order?.purchase?.finalAmount || order?.finalAmount || 4299,
          image: order?.purchase?.plan?.image || "/giftset.png",
        },
      ]
    : [];

  const orderItems =
    order?.items && order.items.length > 0
      ? order.items
      : isSubscriptionOrder
      ? subscriptionItems
      : visibleProducts;

  const subscriptionTotal =
    order?.pricing?.total || order?.purchase?.finalAmount || order?.finalAmount || (isSubscriptionOrder ? 4299 : 0);

  const displaySubtotal = isSubscriptionOrder
    ? subscriptionTotal
    : (order?.pricing?.subtotal ?? subtotal);

  const displaySaved = isSubscriptionOrder ? 0 : (order?.pricing?.saved ?? saved);
  const displayCodFee = isSubscriptionOrder ? 0 : (order?.pricing?.codFee ?? 0);
  const displayCouponDiscount = isSubscriptionOrder ? 0 : (order?.pricing?.couponDiscount ?? order?.couponDiscount ?? 0);
  const displayTotal = isSubscriptionOrder
    ? subscriptionTotal
    : (order?.pricing?.total ?? (displaySubtotal + displayCodFee - displayCouponDiscount));

  // Order meta info for the confirmation cards
  const orderDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  const deliveryStart = new Date(orderDate);
  deliveryStart.setDate(deliveryStart.getDate() + 3);
  const deliveryEnd = new Date(orderDate);
  deliveryEnd.setDate(deliveryEnd.getDate() + 5);

  const orderNumber = order?.orderId || `SVN${Math.floor(1000000 + Math.random() * 8999999)}`;

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
      label: "TOTAL AMOUNT",
      value: `₹${displayTotal.toLocaleString("en-IN")}`,
      valueClass: "text-[#187A37]",
    },
  ];

  const handleTrackOrder = () => {
    router.push("/trackorder");
  };

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">
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
                We&apos;ve emailed the order details to{" "}
                <span className="font-medium text-[#187A37]">
                  {order?.customer?.email || order?.shippingAddress?.email || (getStoredSession()?.user as any)?.email || "your email address"}
                </span>
              </p>

              {/* Order Info Cards */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 rounded-[14px] bg-white p-3.5 sm:p-6 sm:grid-cols-4">
                {orderInfoItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center gap-1 min-w-0">
                      <Icon size={18} className="text-[#0BA445]" />
                      <p className="text-[10px] tracking-wide text-[#9AA3AF] truncate">
                        {item.label}
                      </p>
                      <p
                        className={`text-[13px] sm:text-[15px] font-bold truncate max-w-full ${item.valueClass ?? "text-[#2F241C]"}`}
                      >
                        {item.value}
                      </p>
                      {item.sub && (
                        <p className="text-[10px] sm:text-[11px] text-[#9AA3AF] truncate">{item.sub}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Notification banner */}
              <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 rounded-[10px] bg-[#E4F7E7] p-3 text-[12px] sm:text-[13px] font-medium text-[#187A37] text-center leading-snug">
                <Bell size={16} className="shrink-0" />
                We&apos;ll notify you at every step until your order reaches you.
              </div>
            </div>

            {/* Delivery & Payment Details */}
            {order?.shippingAddress && (
              <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-3.5 sm:p-6 shadow-sm">
                <h2 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#593102] mb-4">Delivery &amp; Payment Details</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="mt-1 text-[#F24E1E] shrink-0" />
                    <div>
                      <p className="text-[14px] font-bold text-[#2F241C]">Delivery Address</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[#596273]">
                        <strong className="text-[#2F241C]">{order.shippingAddress.name}</strong><br />
                        {order.shippingAddress.addressLine}<br />
                        {order.shippingAddress.city} - {order.shippingAddress.pincode}, {order.shippingAddress.state}<br />
                        <span className="font-medium text-[#2F241C]">Phone:</span> {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wallet size={20} className="mt-1 text-[#F24E1E] shrink-0" />
                    <div>
                      <p className="text-[14px] font-bold text-[#2F241C]">Payment Method</p>
                      <p className="mt-1.5 text-[13px] font-semibold text-[#187A37]">
                        {(order.paymentMethod || "Cash on Delivery (COD)").replace(/\s*\(\s*Razorpay\s*\)/gi, "").trim()}
                      </p>
                      <p className="mt-1 text-[12px] text-[#6F7786]">
                        Status: <span className="font-medium text-[#187A37]">{order.paymentStatus || "Pay on Delivery"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Shopping + Track Order Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between sm:items-center">
              <Link
                href="/shop"
                className="flex h-[42px] px-6 items-center justify-center gap-2 rounded-xl border border-[#F24E1E] bg-white text-[12px] font-extrabold uppercase tracking-wider text-[#F24E1E] hover:bg-[#FFF0EB] transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <ShoppingCart size={16} />
                Continue Shopping
              </Link>
              <button
                type="button"
                onClick={handleTrackOrder}
                className="flex h-[42px] px-6 items-center justify-center gap-2 rounded-xl bg-[#F24E1E] hover:bg-[#D93F13] text-[12.5px] font-bold text-white shadow-md hover:shadow-lg hover:shadow-[#F24E1E]/35 hover:-translate-y-1 transition-all duration-300 cursor-pointer active:translate-y-0 active:scale-95 whitespace-nowrap"
              >
                Track Your Order
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* RIGHT COLUMN – Order Summary */}
          <aside className="lg:sticky lg:top-[112px] self-start">
            <div className="w-full h-full flex flex-col rounded-[22px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
                <span className="text-[12px] text-[#9AA3AF]">
                  {orderItems.length} Items
                </span>
              </div>

              <div className="mt-5 max-h-[280px] space-y-4 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
                {orderItems.map((product: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.title || "Product"}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold">{product.title}</p>
                      <p className="text-[11px] text-[#9AA3AF]">
                        {product.weight || "Raw & Filtered"}
                      </p>
                      <p className="text-[11px] text-[#9AA3AF]">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <p className="text-[14px] font-bold">₹{product.price * product.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-[#EEF1F4] pt-5 text-[13px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#593102]">
                    ₹{typeof displaySubtotal === "number" && displaySubtotal % 1 !== 0 ? displaySubtotal.toFixed(2) : displaySubtotal.toLocaleString("en-IN")}
                  </strong>
                </div>
                {displaySaved > 0 && (
                  <div className="flex justify-between">
                    <span>You Save</span>
                    <strong className="text-[#0BA445]">- ₹{typeof displaySaved === "number" && displaySaved % 1 !== 0 ? displaySaved.toFixed(2) : displaySaved.toLocaleString("en-IN")}</strong>
                  </div>
                )}
                {displayCouponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>- ₹{typeof displayCouponDiscount === "number" && displayCouponDiscount % 1 !== 0 ? displayCouponDiscount.toFixed(2) : displayCouponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {displayCodFee > 0 && (
                  <div className="flex justify-between text-[#F24E1E] font-bold">
                    <span>COD Charge</span>
                    <span>+ ₹{typeof displayCodFee === "number" && displayCodFee % 1 !== 0 ? displayCodFee.toFixed(2) : displayCodFee.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
                <div>
                  <p className="text-[21px] font-bold">Total</p>
                  <p className="text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
                </div>
                <p className="font-serif text-[28px] font-bold">₹{typeof displayTotal === "number" && displayTotal % 1 !== 0 ? displayTotal.toFixed(2) : displayTotal.toLocaleString("en-IN")}</p>
              </div>

              {/* Bottom block: Trust Badges + Need Help together in one cream box */}
              <div className="mt-auto pt-8">
                <div className="rounded-[14px] bg-[#FFF8EF] p-5">
                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <span className="p-1">
                      <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#593102]" />
                      <p className="text-[10px] font-bold text-[#2F241C]">Secure Checkout</p>
                      <p className="text-[9px] text-[#9AA3AF]">Safe &amp; secure payments</p>
                    </span>
                    <span className="p-1">
                      <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#593102]" />
                      <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
                      <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
                    </span>
                    <span className="p-1">
                      <Leaf className="mx-auto mb-1 h-5 w-5 text-[#593102]" />
                      <p className="text-[10px] font-bold text-[#2F241C]">Raw &amp; Natural</p>
                      <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
                    </span>
                  </div>

                  {/* Need Help */}
                  <div className="mt-6 w-full box-border flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFDF9] border border-[#EADCC9]/80 shadow-2xs">
                    <div className="flex-1 space-y-2">
                      <h2 className="font-serif text-[17px] font-extrabold text-[#593102]">Need help?</h2>
                      <div className="space-y-1.5 text-[12.5px] font-semibold text-[#6E5D4F]">
                        <p className="flex items-center gap-2">
                          <Phone size={14} className="text-[#D49313] shrink-0" />
                          <a href={`tel:${location?.phone || "+91 98765 43210"}`} className="text-[#593102] hover:underline">
                            {location?.phone || "+91 98765 43210"}
                          </a>
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail size={14} className="text-[#D49313] shrink-0" />
                          <a href={`mailto:${location?.email || "connect@shuddhveda.in"}`} className="text-[#593102] break-all hover:underline">
                            {location?.email || "connect@shuddhveda.in"}
                          </a>
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock size={14} className="text-[#D49313] shrink-0" />
                          <span className="text-[#593102]">{location?.phone_timing || "Mon - Sat: 9AM - 7PM"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="relative w-[80px] h-[70px] shrink-0 hidden sm:block">
                      <Image
                        src="/need.png"
                        alt="Honey dipper illustration"
                        fill
                        className="object-contain object-right-bottom"
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