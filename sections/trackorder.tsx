"use client";

import { Check, Truck, Home, Copy, ExternalLink, Package } from "lucide-react";

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

function StepIcon({ state, index }: { state: string; index: number }) {
  if (state === "done") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
        <Check className="h-5 w-5" strokeWidth={3} />
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
        <Truck className="h-5 w-5" />
      </div>
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-300">
      <Home className="h-5 w-5" />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <h1 className="text-3xl font-bold text-[#7A2E14]">Track Your Order</h1>
        <p className="mt-1 text-sm text-gray-500">Stay updated with your order status in real-time.</p>

        {/* Main card */}
        <div className="mt-6 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-medium tracking-wide text-gray-400">ORDER NUMBER</p>
              <p className="text-xl font-bold text-emerald-700">{order.orderNumber}</p>
              <p className="mt-1 text-sm text-gray-500">Placed on {order.placedOn}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {order.status}
              </span>
              <p className="mt-2 text-xs text-gray-400">Expected Delivery</p>
              <p className="text-base font-bold text-gray-900">{order.expectedDeliveryRange}</p>
              <p className="text-xs text-gray-400">{order.expectedDeliveryNote}</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-10 grid grid-cols-4 items-start">
            {order.steps.map((step, i) => (
              <div key={step.label} className="relative flex flex-col items-center text-center">
                {i < order.steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-5 h-0.5 w-full ${
                      step.state === "done" ? "bg-emerald-500" : "border-t-2 border-dashed border-gray-200 bg-transparent"
                    }`}
                    style={{ transform: "translateX(20px)" }}
                  />
                )}
                <StepIcon state={step.state} index={i} />
                <p
                  className={`mt-3 text-sm font-semibold sm:text-base ${
                    step.state === "current" ? "text-emerald-700" : "text-gray-900"
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">{step.date}</p>
                <p className="text-xs text-gray-400 sm:text-sm">{step.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Shipment details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900">Shipment Details</h2>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-400">Courier Partner</span>
              <span className="flex items-center gap-2 font-semibold text-gray-900">
                {order.shipment.courier}
                <span className="rounded bg-black px-1.5 py-0.5 text-[10px] font-bold text-white">
                  DELHIVERY
                </span>
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-400">Tracking ID</span>
              <span className="flex items-center gap-1.5 font-semibold text-gray-900">
                {order.shipment.trackingId}
                <Copy className="h-3.5 w-3.5 cursor-pointer text-gray-400 hover:text-gray-600" />
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-400">Tracking Link</span>
              <a
                href={order.shipment.trackingLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
              >
                {order.shipment.trackingLink}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Package className="h-4.5 w-4.5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Your order is on the way!</p>
                <p className="text-xs text-amber-700">
                  It is currently in transit and will be delivered soon.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <ul className="space-y-6">
              {order.timeline.map((item, i) => (
                <li key={i} className="relative flex gap-3 pl-1">
                  {i < order.timeline.length - 1 && (
                    <span className="absolute left-[7px] top-4 h-full w-px bg-gray-200" />
                  )}
                  <span
                    className={`mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 ${
                      item.state === "done"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs ${
                        item.state === "done" ? "text-gray-400" : "italic text-gray-400"
                      }`}
                    >
                      {item.date}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        item.state === "done" ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400">{item.place}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-blue-50 shadow-sm">
            <iframe
              title="delivery-map"
              className="h-full min-h-[280px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=415+Mission+St,San+Francisco,CA+94105&output=embed"
            />
            <div className="absolute left-3 top-3 max-w-[220px] rounded-lg bg-white p-3 shadow-md">
              <p className="text-sm font-bold text-gray-900">{order.address.line1}</p>
              <p className="mt-0.5 text-xs text-gray-500">{order.address.line2}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  order.address.line2
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline"
              >
                View larger map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}