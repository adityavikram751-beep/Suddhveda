"use client";

import { useState, useEffect } from "react";
import { Check, Truck, Home, Copy, ExternalLink, Package, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

// ---- Fallback sample data ----
const sampleOrder = {
  orderNumber: "SVN1256789",
  placedOn: "12 May, 2024 at 11:30 AM",
  status: "In Transit",
  totalAmount: "₹1,549",
  paymentMethod: "UPI",
  expectedDeliveryRange: "16 - 18 May, 2024",
  expectedDeliveryNote: "(3-5 business days)",
  steps: [
    { label: "Order Placed", date: "12 May, 2024", time: "11:30 AM", state: "done" },
    { label: "Confirmed", date: "12 May, 2024", time: "11:30 AM", state: "done" },
    { label: "In Transit", date: "13 May, 2024", time: "09:30 AM", state: "current" },
    { label: "Delivered", date: "Expected", time: "16 - 18 May, 2024", state: "upcoming" },
  ],
  shipment: {
    courier: "Delhivery",
    trackingId: "1234567890123",
    trackingLink: "https://www.delhivery.com/track",
  },
  timeline: [
    { date: "13 May, 2024 - 09:40 AM", title: "Shipment picked up", place: "Bengaluru, Karnataka", state: "done" },
    { date: "13 May, 2024 - 06:20 PM", title: "In transit", place: "Hosur, Tamil Nadu", state: "done" },
    { date: "Expected - 16 - 18 May, 2024", title: "Out for delivery", place: "Your location", state: "upcoming" },
    { date: "Expected - 16 - 18 May, 2024", title: "Delivered", place: "Your location", state: "upcoming" },
  ],
  address: {
    line1: "Delivery Address",
    line2: "India",
  },
};

function StepIcon({ state }: { state: string }) {
  if (state === "done") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md">
        <Check className="h-5 w-5" strokeWidth={3} />
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md ring-4 ring-emerald-100 animate-pulse">
        <Truck className="h-5 w-5" />
      </div>
    );
  }
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#EADCC9] bg-[#FAF5EC] text-[#8D7F73]">
      <Home className="h-5 w-5" />
    </div>
  );
}

export default function TrackOrderPage() {
  const [copied, setCopied] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(sampleOrder);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMyOrders() {
      try {
        setLoading(true);
        const token = typeof document !== "undefined" ? (document.cookie.match(/(^| )sudhveda_token=([^;]+)/)?.[2] || "") : "";
        const res = await fetch(`${API_BASE_URL}/api/order/my-orders`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          const list = data.data || data.orders || data.groups || (Array.isArray(data) ? data : []) || [];
          if (list.length > 0) {
            const rawOrder = list[0];
            const orderId = rawOrder.group_id || rawOrder.order_id || rawOrder._id || rawOrder.orderId || "SVN1256789";
            const createdAt = rawOrder.createdAt || rawOrder.created_at ? new Date(rawOrder.createdAt || rawOrder.created_at) : new Date();
            const placedStr = `${createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} at ${createdAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
            const addr = rawOrder.shipping_address || rawOrder.shippingAddress || {};
            const totalVal = Number(rawOrder.finalAmount || rawOrder.totalAmount || rawOrder.total_amount || rawOrder.price || 0);
            const paymentMethodRaw = String(rawOrder.payment_mode || rawOrder.paymentMethod || rawOrder.payment_type || "COD");
            const paymentMethod = paymentMethodRaw.toLowerCase() === "cod" ? "Cash on Delivery" : paymentMethodRaw.toUpperCase();

            const dynamicOrder = {
              orderNumber: orderId,
              placedOn: placedStr,
              status: rawOrder.status || "Processing",
              totalAmount: totalVal > 0 ? `₹${totalVal.toLocaleString("en-IN")}` : "₹1,549",
              paymentMethod: paymentMethod,
              expectedDeliveryRange: "3 - 5 business days",
              expectedDeliveryNote: "(Standard Delivery)",
              steps: [
                { label: "Order Placed", date: createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), time: createdAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }), state: "done" },
                { label: "Confirmed", date: createdAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), time: createdAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }), state: "done" },
                { label: "In Transit", date: "Expected", time: "3-5 days", state: "current" },
                { label: "Delivered", date: "Expected", time: "3-5 days", state: "upcoming" },
              ],
              shipment: {
                courier: rawOrder.shipment?.courier || "Delhivery",
                trackingId: rawOrder.shipment?.trackingId || orderId,
                trackingLink: rawOrder.shipment?.trackingLink || "https://www.delhivery.com/track",
              },
              timeline: [
                { date: placedStr, title: "Order received", place: "SudhVeda Honey", state: "done" },
                { date: "In Progress", title: "Shipment in transit", place: "Courier Hub", state: "done" },
                { date: "Expected Soon", title: "Out for delivery", place: addr.city || "Your location", state: "upcoming" },
                { date: "Expected Soon", title: "Delivered", place: addr.city || "Your location", state: "upcoming" },
              ],
              address: {
                line1: addr.address_line1 || addr.line1 || addr.addressLine || "Delivery Address",
                line2: `${addr.city || ""} ${addr.state || ""} ${addr.pincode || ""}`.trim() || "India",
              },
            };
            setActiveOrder(dynamicOrder);
          }
        }
      } catch (err) {
        console.error("Error fetching my-orders in track order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyOrders();
  }, []);

  const order = activeOrder || sampleOrder;
  const steps = order?.steps || sampleOrder.steps;
  const shipment = order?.shipment || sampleOrder.shipment;
  const timeline = order?.timeline || sampleOrder.timeline;
  const address = order?.address || sampleOrder.address;

  const handleCopy = () => {
    if (shipment?.trackingId) {
      navigator.clipboard.writeText(shipment.trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] px-4 pb-16 pt-8 sm:pt-28 lg:pt-16 sm:px-8 border-b border-[#EADCC9]/50">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-emerald-800 tracking-[0.18em] shadow-2xs mb-2">
            <span>LIVE SHIPMENT TRACKING</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#593102]">
            Track Your <span className="text-emerald-700">Order</span>
          </h1>
          <p className="text-base text-[#6E5D4F] font-medium">
            Stay updated with your package delivery status in real-time.
          </p>
        </div>

        {/* Main card */}
        <div className="mt-8 rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start pb-8 border-b border-[#EADCC9]/60">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">ORDER NUMBER</p>
              <p className="font-serif text-2xl font-extrabold text-emerald-700 mt-0.5">{order.orderNumber}</p>
              <p className="mt-1 text-xs text-[#6E5D4F] font-semibold">Placed on {order.placedOn}</p>
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">TOTAL AMOUNT</p>
              <p className="font-serif text-2xl font-extrabold text-[#593102] mt-0.5">{order.totalAmount || "₹1,549"}</p>
              <p className="mt-1 text-xs text-emerald-700 font-extrabold">
                {order.paymentMethod ? `Payment: ${order.paymentMethod}` : "Payment Confirmed"}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3.5 py-1 text-xs font-extrabold text-emerald-800 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                {order.status}
              </span>
              <p className="mt-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">Expected Delivery</p>
              <p className="font-serif text-lg font-extrabold text-[#593102] mt-0.5">{order.expectedDeliveryRange}</p>
              <p className="text-xs text-[#6E5D4F] font-medium">{order.expectedDeliveryNote}</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-8 grid grid-cols-4 items-start relative">
            {steps.map((step: any, i: number) => (
              <div key={step.label} className="relative flex flex-col items-center text-center px-1">
                {i < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-[26px] -translate-y-1/2 h-0.5 w-full z-0 ${
                      step.state === "done"
                        ? "bg-emerald-500"
                        : "border-t-2 border-dashed border-[#EADCC9]"
                    }`}
                  />
                )}
                <div className="z-10 bg-white rounded-full p-1">
                  <StepIcon state={step.state} />
                </div>
                <p
                  className={`mt-3 font-serif text-sm sm:text-base font-extrabold ${
                    step.state === "current" || step.state === "done" ? "text-[#593102]" : "text-[#8D7F73]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs text-[#6E5D4F] font-semibold">{step.date}</p>
                <p className="text-[11px] text-[#8D7F73] font-medium">{step.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Shipment details */}
          <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-[#EADCC9]/60">
                <Truck size={18} className="text-emerald-700" />
                <h2 className="font-serif text-lg font-bold text-[#593102]">Shipment Details</h2>
              </div>

              <div className="mt-4 space-y-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Courier Partner</span>
                  <span className="flex items-center gap-2 font-bold text-[#593102]">
                    {shipment.courier}
                    <span className="rounded-md bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
                      DELHIVERY
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Tracking ID</span>
                  <span className="flex items-center gap-2 font-bold text-[#593102]">
                    {shipment.trackingId}
                    <button onClick={handleCopy} className="p-1 rounded-md hover:bg-emerald-50 text-emerald-700 transition cursor-pointer" title="Copy ID">
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Tracking Link</span>
                  <a
                    href={shipment.trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Track External
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-300 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Package className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#593102]">Your order is on the way!</p>
                <p className="text-xs text-[#6E5D4F] font-medium mt-0.5">
                  It is currently in transit and will be delivered soon.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-[#EADCC9]/60 mb-4">
              <h2 className="font-serif text-lg font-bold text-[#593102]">Tracking Activity</h2>
            </div>
            <ul className="space-y-5">
              {timeline.map((item: any, i: number) => (
                <li key={i} className="relative flex gap-3 pl-1">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[11px] -translate-x-1/2 top-[20px] bottom-1 w-0.5 bg-[#EADCC9] flex flex-col items-center justify-end">
                      <span className="w-1.5 h-1.5 border-b-2 border-r-2 border-emerald-600 rotate-45 translate-y-[2px]" />
                    </div>
                  )}
                  <span
                    className={`relative z-10 mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 ${
                      item.state === "done"
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-[#EADCC9] bg-white"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        item.state === "done" ? "text-[#8D7F73]" : "text-[#A69C8F]"
                      }`}
                    >
                      {item.date}
                    </p>
                    <p
                      className={`font-serif text-sm font-bold ${
                        item.state === "done" ? "text-[#593102]" : "text-[#8D7F73]"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-[#6E5D4F] font-medium">{item.place}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-[#EADCC9]/80 bg-white shadow-xs min-h-[300px]">
            <iframe
              title="delivery-map"
              className="h-full min-h-[300px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=415+Mission+St,San+Francisco,CA+94105&output=embed"
            />
            <div className="absolute left-4 top-4 max-w-[240px] rounded-2xl border border-[#EADCC9] bg-white/95 backdrop-blur-md p-4 shadow-md">
              <div className="flex items-center gap-1.5 text-[#D49313] mb-1">
                <MapPin size={15} />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#593102]">DESTINATION</span>
              </div>
              <p className="font-serif text-sm font-bold text-[#593102]">{address.line1}</p>
              <p className="mt-0.5 text-xs text-[#6E5D4F] font-medium">{address.line2}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  address.line2
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#D49313] hover:underline"
              >
                View Larger Map ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}