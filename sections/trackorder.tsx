"use client";

import { useState } from "react";
import { Check, Truck, Home, Copy, ExternalLink, Package, Sparkles, MapPin, CheckCircle2 } from "lucide-react";

// ---- Sample data (replace with API data) ----
const order = {
  orderNumber: "SVN1256789",
  placedOn: "12 May, 2024 at 11:30 AM",
  status: "In Transit",
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
    line1: "415 Mission St",
    line2: "415 Mission St, San Francisco, CA 94105, USA",
  },
};

function StepIcon({ state }: { state: string }) {
  if (state === "done") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] text-white shadow-md">
        <Check className="h-5 w-5" strokeWidth={3} />
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#D49313] to-[#8F590A] text-white shadow-md ring-4 ring-[#FAF0DC] animate-pulse">
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

  const handleCopy = () => {
    navigator.clipboard.writeText(order.shipment.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] px-4 pb-16 pt-32 lg:pt-16 sm:px-8 border-b border-[#EADCC9]/50">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2">
            <Sparkles size={13} className="text-[#D49313]" />
            <span>LIVE SHIPMENT TRACKING</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#593102]">
            Track Your <span className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent">Order</span>
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
              <p className="font-serif text-2xl font-extrabold text-[#593102] mt-0.5">{order.orderNumber}</p>
              <p className="mt-1 text-xs text-[#6E5D4F] font-semibold">Placed on {order.placedOn}</p>
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
            {order.steps.map((step, i) => (
              <div key={step.label} className="relative flex flex-col items-center text-center px-1">
                {i < order.steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-5 h-0.5 w-full -z-0 ${
                      step.state === "done" ? "bg-gradient-to-r from-[#D49313] to-[#593102]" : "border-t-2 border-dashed border-[#EADCC9]"
                    }`}
                    style={{ transform: "translateX(20px)" }}
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
                <Truck size={18} className="text-[#D49313]" />
                <h2 className="font-serif text-lg font-bold text-[#593102]">Shipment Details</h2>
              </div>

              <div className="mt-4 space-y-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Courier Partner</span>
                  <span className="flex items-center gap-2 font-bold text-[#593102]">
                    {order.shipment.courier}
                    <span className="rounded-md bg-[#FAF0DC] border border-[#D49313]/30 px-2 py-0.5 text-[10px] font-extrabold text-[#593102]">
                      DELHIVERY
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Tracking ID</span>
                  <span className="flex items-center gap-2 font-bold text-[#593102]">
                    {order.shipment.trackingId}
                    <button onClick={handleCopy} className="p-1 rounded-md hover:bg-[#FAF0DC] text-[#D49313] transition cursor-pointer" title="Copy ID">
                      {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Tracking Link</span>
                  <a
                    href={order.shipment.trackingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[#D49313] hover:underline"
                  >
                    Track External
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#FAF0DC]/80 border border-[#D49313]/40 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#D49313] to-[#593102] text-white shadow-xs">
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
              <Sparkles size={18} className="text-[#D49313]" />
              <h2 className="font-serif text-lg font-bold text-[#593102]">Tracking Activity</h2>
            </div>
            <ul className="space-y-5">
              {order.timeline.map((item, i) => (
                <li key={i} className="relative flex gap-3 pl-1">
                  {i < order.timeline.length - 1 && (
                    <span className="absolute left-[7px] top-4 h-full w-0.5 bg-[#EADCC9]" />
                  )}
                  <span
                    className={`mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 ${
                      item.state === "done"
                        ? "border-[#D49313] bg-[#D49313]"
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
              <p className="font-serif text-sm font-bold text-[#593102]">{order.address.line1}</p>
              <p className="mt-0.5 text-xs text-[#6E5D4F] font-medium">{order.address.line2}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  order.address.line2
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