"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  Truck,
  Home,
  Copy,
  ExternalLink,
  Package,
  MapPin,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { API_BASE_URL, getStoredToken } from "@/lib/auth";

// ---- Fallback sample data ----
const sampleOrder = {
  orderNumber: "SG-20260916-CEC97AE6",
  placedOn: "16 Sep, 2026 at 11:30 AM",
  status: "In Transit",
  statusRaw: "in_transit",
  subStatus: "ready_for_pickup",
  totalAmount: "₹1,549",
  paymentMethod: "UPI",
  expectedDeliveryRange: "21 Sep, 2026",
  expectedDeliveryNote: "(Standard Delivery)",
  remarks: "Shipment in transit",
  latestLocation: "Delhi Airport Hub",
  steps: [
    { label: "Order Placed", date: "16 Sep, 2026", time: "11:30 AM", state: "done" },
    { label: "Confirmed", date: "16 Sep, 2026", time: "01:00 PM", state: "done" },
    { label: "In Transit", date: "16 Sep, 2026", time: "05:02 PM", state: "current" },
    { label: "Delivered", date: "21 Sep, 2026", time: "Expected", state: "upcoming" },
  ],
  shipment: {
    courier: "Delhivery",
    trackingId: "34812017721910",
    trackingLink: "https://www.velocityshipping.in/track/34812017721910",
  },
  timeline: [
    { date: "16 Sep, 2026 - 11:30 AM", title: "Order Placed & Confirmed", place: "ShuddhVeda Honey", state: "done" },
    { date: "16 Sep, 2026 - 01:00 PM", title: "Order Ready for Pickup", place: "Warehouse Facility", state: "done" },
    { date: "16 Sep, 2026 - 05:02 PM", title: "In transit", place: "Delhi_Airport_GW (Delhi)", state: "current" },
  ],
  address: {
    line1: "Delivery Address",
    line2: "India",
  },
};

function formatStatus(raw: string): string {
  if (!raw) return "Processing";
  const cleaned = String(raw).trim().replace(/[_]/g, " ");
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(dateVal: any): string {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(dateVal: any): string {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getCourierBrand(rawCourier: string): string {
  if (!rawCourier) return "Delhivery";
  const cleaned = String(rawCourier).trim();
  const lower = cleaned.toLowerCase();
  if (lower.includes("delhivery")) return "Delhivery";
  if (lower.includes("bluedart") || lower.includes("blue dart")) return "Blue Dart";
  if (lower.includes("xpressbees")) return "Xpressbees";
  if (lower.includes("dtdc")) return "DTDC";
  if (lower.includes("shadowfax")) return "Shadowfax";
  if (lower.includes("ecom")) return "Ecom Express";
  if (lower.includes("india post") || lower.includes("speed post")) return "India Post";
  const stripped = cleaned
    .replace(/\s*\d+\s*(?:kg|g|gm)\b/gi, "")
    .replace(/\s+standard\b/gi, "")
    .replace(/\s+surface\b/gi, "")
    .replace(/\s+air\b/gi, "")
    .trim();
  return stripped || cleaned.split(" ")[0] || "Delhivery";
}

function StepIcon({ state }: { state: string }) {
  if (state === "cancelled") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
        <XCircle className="h-5 w-5" strokeWidth={2.5} />
      </div>
    );
  }
  if (state === "done") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md">
        <Check className="h-5 w-5" strokeWidth={3} />
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#D49313] to-[#593102] text-white shadow-md ring-4 ring-amber-100 animate-pulse">
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

// Normalizer to parse live-tracking-details response into the UI shape
function parseLiveTrackingData(apiResponse: any, orderMeta: any, fallbackId: string) {
  // Support nested: data.tracking.data (as in live response) or data.data or data directly
  const rootData = apiResponse?.data || apiResponse || {};
  const trackingObj = rootData?.tracking || apiResponse?.tracking || {};
  const tData = trackingObj?.data || trackingObj || {};

  // Flattened merge
  const t = {
    ...orderMeta,
    ...rootData,
    ...trackingObj,
    ...tData,
    new_tracking: tData?.new_tracking || trackingObj?.new_tracking || rootData?.new_tracking,
  };

  // Order Number / Display ID
  const orderId = String(
    t.order_display_id ||
    t.order_external_id ||
    t.order_id ||
    t.orderNumber ||
    t.orderId ||
    t.shipment_id ||
    t.shipmentId ||
    fallbackId ||
    "ORD-TRACK"
  );

  // Status parsing
  const rawStatus = String(
    t.status ||
    t.order_status ||
    t.tracking_status ||
    t.current_status ||
    orderMeta?.status ||
    "Processing"
  );
  const statusClean = formatStatus(rawStatus);
  const sLower = rawStatus.toLowerCase();
  const isCancelled = sLower.includes("cancel");
  const isDelivered = sLower.includes("deliver") || sLower.includes("complet");
  const isShipped = sLower.includes("ship") || sLower.includes("transit") || sLower.includes("out");
  const isConfirmed = sLower.includes("confirm") || sLower.includes("pack") || sLower.includes("dispatch") || sLower.includes("ready");

  // Sub status
  const subStatus = t.sub_status ? formatStatus(t.sub_status) : "";

  // Placed date
  const rawPlaced = t.placed_on || t.placedOn || t.order_date || t.createdAt || t.created_at || t.date || orderMeta?.createdAt;
  const parsedPlaced = rawPlaced ? new Date(rawPlaced) : new Date();
  const placedStr = !isNaN(parsedPlaced.getTime())
    ? `${parsedPlaced.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} at ${parsedPlaced.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`
    : "Recently Placed";
  const placedDateStr = !isNaN(parsedPlaced.getTime())
    ? parsedPlaced.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    : "Placed";
  const placedTimeStr = !isNaN(parsedPlaced.getTime())
    ? parsedPlaced.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "";

  // Expected delivery date (original_edd / edd)
  let expectedDeliveryRange = "3 - 5 business days";
  if (t.original_edd || t.edd || t.delivery_date) {
    const eddDate = new Date(t.original_edd || t.edd || t.delivery_date);
    if (!isNaN(eddDate.getTime())) {
      expectedDeliveryRange = eddDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    }
  } else if (t.expectedDeliveryRange) {
    expectedDeliveryRange = t.expectedDeliveryRange;
  }
  const expectedDeliveryNote = isCancelled
    ? "(Delivery Cancelled)"
    : isDelivered
    ? "(Delivered to Destination)"
    : t.expectedDeliveryNote || "(Estimated by Courier)";

  // Total amount
  const amountVal = Number(
    t.totalAmount ||
    t.total_amount ||
    t.finalAmount ||
    t.grandTotal ||
    t.total ||
    orderMeta?.finalAmount ||
    orderMeta?.total_amount ||
    0
  );
  const totalAmount = amountVal > 0 ? `₹${amountVal.toLocaleString("en-IN")}` : (t.totalAmount || "₹1,549");

  // Payment method
  const payRaw = String(t.payment_mode || t.paymentMethod || t.payment?.mode || orderMeta?.payment_mode || "Prepaid");
  const paymentMethod = payRaw.toLowerCase() === "cod" ? "Cash on Delivery" : payRaw.toUpperCase();

  // Courier & Tracking details
  const rawCourier = String(
    t.carrier_name ||
    t.courierName ||
    t.courier ||
    "Delhivery Standard"
  );
  const courier = getCourierBrand(rawCourier);
  const trackingId = String(
    t.awbCode ||
    t.tracking_number ||
    t.new_tracking?.tracking_id ||
    t.shipment_id ||
    t.shipmentId ||
    orderId
  );
  const trackingLink = t.tracking_url || `https://www.velocityshipping.in/track/${encodeURIComponent(trackingId)}`;

  // Location and Remarks from latest tracking scan
  const newTracking = t.new_tracking || {};
  const remarks = newTracking.remarks || (isCancelled ? "Order was cancelled" : subStatus || "In transit with courier");
  const latestLocation = newTracking.location || "";
  const eventDateTime = newTracking.event_date_time;
  const eventDateStr = eventDateTime ? `${formatDate(eventDateTime)} - ${formatTime(eventDateTime)}` : "";

  // Address
  const addr = t.shipping_address || t.shippingAddress || t.address || t.delivery_address || orderMeta?.shipping_address || {};
  const line1 = addr.address_line1 || addr.line1 || addr.address || addr.street || "Delivery Address";
  const line2 = [addr.city, addr.state, addr.pincode].filter(Boolean).join(", ") || "India";

  // Visual Steps
  let steps: any[] = [];
  if (isCancelled) {
    steps = [
      {
        label: "Order Placed",
        date: placedDateStr,
        time: placedTimeStr || "Confirmed",
        state: "done",
      },
      {
        label: subStatus || "Ready for Pickup",
        date: eventDateTime ? formatDate(eventDateTime) : placedDateStr,
        time: "Processed",
        state: "done",
      },
      {
        label: "Cancelled",
        date: eventDateTime ? formatDate(eventDateTime) : "Recent",
        time: eventDateTime ? formatTime(eventDateTime) : "Cancelled",
        state: "cancelled",
      },
      {
        label: "Delivery Stopped",
        date: "Voided",
        time: "Cancelled",
        state: "upcoming",
      },
    ];
  } else if (Array.isArray(t.steps) && t.steps.length > 0) {
    steps = t.steps;
  } else {
    steps = [
      {
        label: "Order Placed",
        date: placedDateStr,
        time: placedTimeStr || "Received",
        state: isDelivered || isShipped || isConfirmed ? "done" : "current",
      },
      {
        label: isConfirmed || isShipped || isDelivered ? (subStatus || "Confirmed") : "Confirmation",
        date: isConfirmed || isShipped || isDelivered ? placedDateStr : "Expected",
        time: isConfirmed || isShipped || isDelivered ? "Verified" : "1-2 days",
        state: isDelivered || isShipped ? "done" : isConfirmed ? "current" : "upcoming",
      },
      {
        label: "In Transit",
        date: isShipped || isDelivered ? (eventDateTime ? formatDate(eventDateTime) : "On Way") : "Expected",
        time: isShipped || isDelivered ? (eventDateTime ? formatTime(eventDateTime) : "Active") : "2-3 days",
        state: isDelivered ? "done" : isShipped ? "current" : "upcoming",
      },
      {
        label: "Delivered",
        date: isDelivered ? (eventDateTime ? formatDate(eventDateTime) : "Delivered") : expectedDeliveryRange,
        time: isDelivered ? "Success" : "Expected",
        state: isDelivered ? "done" : "upcoming",
      },
    ];
  }

  // Timeline Activities
  let timeline: any[] = [];
  if (Array.isArray(t.timeline) && t.timeline.length > 0) {
    timeline = t.timeline;
  } else if (Array.isArray(t.activities) && t.activities.length > 0) {
    timeline = t.activities;
  } else if (Array.isArray(t.tracking_history) && t.tracking_history.length > 0) {
    timeline = t.tracking_history;
  } else {
    // 1. Order Placed & Verified (Top)
    timeline.push({
      date: placedStr,
      title: "Order Placed & Verified",
      place: "ShuddhVeda Honey",
      state: "done",
    });

    // 2. Courier Status / Dispatched (Middle)
    if (subStatus) {
      timeline.push({
        date: trackingObj.webhook_sent_at ? `${formatDate(trackingObj.webhook_sent_at)} - ${formatTime(trackingObj.webhook_sent_at)}` : "Dispatched",
        title: `Courier Status: ${subStatus}`,
        place: `${courier} Facility`,
        state: "done",
      });
    }

    // 3. Latest Tracking Scan / Pickup (Bottom / Current)
    if (newTracking.remarks || newTracking.location || eventDateTime) {
      timeline.push({
        date: eventDateStr || "Latest Update",
        title: newTracking.remarks || (isCancelled ? "Order Cancelled" : "Shipment Update"),
        place: newTracking.location || `${courier} Facility`,
        state: isCancelled ? "cancelled" : isDelivered ? "done" : "current",
      });
    }
  }

  return {
    orderNumber: orderId,
    placedOn: placedStr,
    status: statusClean,
    statusRaw: sLower,
    subStatus,
    totalAmount,
    paymentMethod,
    expectedDeliveryRange,
    expectedDeliveryNote,
    remarks,
    latestLocation,
    steps,
    shipment: {
      courier,
      trackingId,
      trackingLink,
    },
    timeline,
    address: {
      line1,
      line2,
    },
  };
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlOrderGroupId =
    searchParams?.get("ordergroupId") ||
    searchParams?.get("orderGroupId") ||
    searchParams?.get("id") ||
    searchParams?.get("orderId") ||
    "";

  const [copied, setCopied] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(urlOrderGroupId);
  const [currentTrackingId, setCurrentTrackingId] = useState<string>(urlOrderGroupId);

  // Core API fetch function: {{baseUrl}}/api/order/live-tracking-details/{{ordergroupId}}
  const fetchLiveTracking = useCallback(async (ordergroupId: string) => {
    if (!ordergroupId) return;
    try {
      setLoading(true);
      setError(null);
      const token = getStoredToken();

      // 1. Fetch live tracking details from courier integration endpoint
      const trackingPromise = fetch(
        `${API_BASE_URL}/api/order/live-tracking-details/${encodeURIComponent(ordergroupId)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      // 2. Fetch order metadata from my-orders in parallel for financial/address completeness
      const myOrdersPromise = fetch(`${API_BASE_URL}/api/order/my-orders`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }).catch(() => null);

      const [trackingRes, myOrdersRes] = await Promise.all([trackingPromise, myOrdersPromise]);

      let orderMeta: any = null;
      let myOrdersList: any[] = [];
      if (myOrdersRes && myOrdersRes.ok) {
        const myOrdersJson = await myOrdersRes.json().catch(() => null);
        myOrdersList = myOrdersJson?.data || myOrdersJson?.orders || myOrdersJson?.groups || [];
        orderMeta = myOrdersList.find(
          (o: any) =>
            String(o.order_group_id || o.orderGroupId || o._id || o.id || o.group_id || o.order_id || o.orderId) === String(ordergroupId)
        );
      }

      if (trackingRes.ok) {
        const json = await trackingRes.json();
        const rootData = json?.data || json || {};
        const trackingObj = rootData?.tracking || json?.tracking || {};
        const tData = trackingObj?.data || trackingObj || {};

        // If orderMeta wasn't found by ordergroupId, also search by order_id or order_display_id from tracking response
        if (!orderMeta && myOrdersList.length > 0) {
          const apiOrderId = tData.order_id || tData.order_display_id || tData.order_external_id;
          if (apiOrderId) {
            orderMeta = myOrdersList.find(
              (o: any) =>
                String(o.order_id || o.orderId || o.order_group_id || o._id || o.id) === String(apiOrderId)
            );
          }
        }

        const parsed = parseLiveTrackingData(json, orderMeta, ordergroupId);
        setActiveOrder(parsed);
        setCurrentTrackingId(ordergroupId);
        return;
      }

      // If live-tracking endpoint fails with 404 or specific error, check if order exists in my-orders
      if (orderMeta) {
        const parsed = parseLiveTrackingData(orderMeta, null, ordergroupId);
        setActiveOrder(parsed);
        setCurrentTrackingId(ordergroupId);
        return;
      }

      const errorJson = await trackingRes.json().catch(() => null);
      const errorMsg = errorJson?.message || errorJson?.error || `Tracking details not found for order #${ordergroupId}`;
      setError(errorMsg);
    } catch (err: any) {
      console.error("Error fetching live tracking details:", err);
      setError(err?.message || "Unable to fetch live tracking details at the moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: either from URL query param, or fetch user's latest order
  useEffect(() => {
    async function initTracking() {
      if (urlOrderGroupId) {
        setSearchInput(urlOrderGroupId);
        await fetchLiveTracking(urlOrderGroupId);
      } else {
        try {
          setLoading(true);
          const token = getStoredToken();
          const res = await fetch(`${API_BASE_URL}/api/order/my-orders`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          if (res.ok) {
            const data = await res.json();
            const list = data.data || data.orders || data.groups || (Array.isArray(data) ? data : []) || [];
            if (list.length > 0) {
              const latest = list[0];
              const latestId = String(
                latest.order_group_id ||
                latest.orderGroupId ||
                latest.group_id ||
                latest._id ||
                latest.id ||
                latest.order_id ||
                latest.orderId ||
                ""
              );
              if (latestId) {
                setSearchInput(latestId);
                await fetchLiveTracking(latestId);
                return;
              }
            }
          }
          setActiveOrder(sampleOrder);
        } catch {
          setActiveOrder(sampleOrder);
        } finally {
          setLoading(false);
        }
      }
    }

    initTracking();
  }, [urlOrderGroupId, fetchLiveTracking]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (!clean) return;
    router.replace(`/trackorder?ordergroupId=${encodeURIComponent(clean)}`);
    fetchLiveTracking(clean);
  };

  const order = activeOrder || sampleOrder;
  const isCancelled = order?.statusRaw?.includes("cancel") || order?.status?.toLowerCase().includes("cancel");
  const isDelivered = order?.statusRaw?.includes("deliver") || order?.status?.toLowerCase().includes("deliver");
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-emerald-800 tracking-[0.18em] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE SHIPMENT TRACKING</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#593102]">
              Track Your <span className="text-emerald-700">Order</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6E5D4F] font-medium">
              Real-time dispatch and delivery updates straight from courier network.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs sm:text-sm text-red-700 animate-in fade-in duration-200">
            <AlertCircle size={20} className="shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="font-bold">Tracking Notice</p>
              <p className="text-red-600/90 text-xs mt-0.5">{error}</p>
            </div>
            {currentTrackingId && (
              <button
                onClick={() => fetchLiveTracking(currentTrackingId)}
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Loading Skeleton / Indicator */}
        {loading ? (
          <div className="mt-8 rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 p-12 flex flex-col items-center justify-center gap-3 min-h-[360px]">
            <Loader2 size={36} className="animate-spin text-[#D49313]" />
            <p className="font-serif text-base font-bold text-[#593102]">Fetching live tracking details...</p>
            <p className="text-xs text-[#8D7F73]">Connecting to Delhivery / Courier tracking network</p>
          </div>
        ) : (
          <>
            {/* Main card */}
            <div className="mt-8 rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start pb-8 border-b border-[#EADCC9]/60">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">ORDER NUMBER</p>
                  <p className="font-serif text-2xl font-extrabold text-[#593102] mt-0.5">#{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-[#6E5D4F] font-semibold">Placed on {order.placedOn}</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold shadow-2xs ${
                    isCancelled
                      ? "bg-red-50 border border-red-300 text-red-700"
                      : isDelivered
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                      : "bg-[#FFF6DB] border border-[#F5C768] text-[#7A3E00]"
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${
                      isCancelled ? "bg-red-500" : isDelivered ? "bg-emerald-500" : "bg-[#D49313] animate-ping"
                    }`} />
                    {order.status}
                  </span>
                  <p className="mt-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">
                    {isCancelled ? "Status Note" : "Expected Delivery"}
                  </p>
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
                            : step.state === "cancelled"
                            ? "bg-red-400"
                            : "border-t-2 border-dashed border-[#EADCC9]"
                        }`}
                      />
                    )}
                    <div className="z-10 bg-white rounded-full p-1">
                      <StepIcon state={step.state} />
                    </div>
                    <p
                      className={`mt-3 font-serif text-sm sm:text-base font-extrabold ${
                        step.state === "cancelled"
                          ? "text-red-700"
                          : step.state === "current" || step.state === "done"
                          ? "text-[#593102]"
                          : "text-[#8D7F73]"
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
                      <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-extrabold text-emerald-800 uppercase tracking-wider shadow-2xs">
                        {shipment.courier}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">AWB / Tracking ID</span>
                      <span className="flex items-center gap-2 font-bold text-[#593102]">
                        <span className="font-mono text-xs text-[#593102] font-extrabold">{shipment.trackingId}</span>
                        <button
                          onClick={handleCopy}
                          className="p-1 rounded-md hover:bg-emerald-50 text-emerald-700 transition cursor-pointer"
                          title="Copy ID"
                        >
                          {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Courier Tracking</span>
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

                {/* Status Notice Card */}
                {isCancelled ? (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-300 p-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
                      <AlertCircle className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-red-900">Order Cancelled</p>
                      <p className="text-xs text-red-700 font-medium mt-0.5">
                        {order.remarks || "This order has been cancelled by the seller."}
                      </p>
                      {order.latestLocation && (
                        <p className="text-[11px] text-red-700/80 font-bold mt-1">
                          📍 Last location: {order.latestLocation}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-300 p-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                      <Package className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#593102]">
                        {isDelivered ? "Order Delivered Successfully!" : "Shipment in Transit"}
                      </p>
                      <p className="text-xs text-[#6E5D4F] font-medium mt-0.5">
                        {order.remarks || (isDelivered
                          ? "Thank you for choosing pure artisanal honey from ShuddhVeda."
                          : "Package is securely handled and dispatched with courier network.")}
                      </p>
                      {order.latestLocation && (
                        <p className="text-[11px] text-[#593102] font-bold mt-1">
                          📍 Current location: {order.latestLocation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-4 border-b border-[#EADCC9]/60 mb-4">
                  <Clock size={18} className="text-[#D49313]" />
                  <h2 className="font-serif text-lg font-bold text-[#593102]">Tracking Activity</h2>
                </div>
                <ul className="space-y-5">
                  {timeline.map((item: any, i: number) => {
                    const isItemCancelled = item.state === "cancelled";
                    const isItemDone = item.state === "done";
                    const isItemCurrent = item.state === "current";

                    return (
                      <li key={i} className="relative flex gap-3 pl-1">
                        {i < timeline.length - 1 && (
                          <div className="absolute left-[11px] -translate-x-1/2 top-[20px] bottom-1 w-0.5 bg-[#EADCC9] flex flex-col items-center justify-end">
                            <span className="w-1.5 h-1.5 border-b-2 border-r-2 border-emerald-600 rotate-45 translate-y-[2px]" />
                          </div>
                        )}
                        <span
                          className={`relative z-10 mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 ${
                            isItemCancelled
                              ? "border-red-600 bg-red-600"
                              : isItemDone
                              ? "border-emerald-600 bg-emerald-600"
                              : isItemCurrent
                              ? "border-[#D49313] bg-[#D49313] ring-2 ring-amber-300"
                              : "border-[#EADCC9] bg-white"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              isItemCancelled ? "text-red-700" : isItemDone ? "text-[#8D7F73]" : "text-[#A69C8F]"
                            }`}
                          >
                            {item.date}
                          </p>
                          <p
                            className={`font-serif text-sm font-bold ${
                              isItemCancelled ? "text-red-800 font-extrabold" : isItemDone ? "text-[#593102]" : "text-[#8D7F73]"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="text-xs text-[#6E5D4F] font-medium">{item.place}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Map */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#EADCC9]/80 bg-white shadow-xs h-[340px] min-h-[300px]">
                <iframe
                  title="delivery-map"
                  className="w-full -mt-[140px] h-[calc(100%+140px)] min-h-[440px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    order.latestLocation || address.line2 || address.line1 || "New Delhi, India"
                  )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                />
                <div className="absolute left-4 top-4 z-10 max-w-[240px] rounded-2xl border border-[#EADCC9] bg-white/95 backdrop-blur-md p-4 shadow-md">
                  <div className="flex items-center gap-1.5 text-[#D49313] mb-1">
                    <MapPin size={15} />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#593102]">
                      {order.latestLocation ? "LAST LOCATION" : "DESTINATION"}
                    </span>
                  </div>
                  <p className="font-serif text-sm font-bold text-[#593102] line-clamp-2">
                    {order.latestLocation || address.line1}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      order.latestLocation || address.line2 || address.line1
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
          </>
        )}
      </div>
    </div>
  );
}