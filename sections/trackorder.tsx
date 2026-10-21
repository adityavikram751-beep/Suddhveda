"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  ArrowLeft,
} from "lucide-react";
import { API_BASE_URL, getStoredToken } from "@/lib/auth";

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

// Clean and normalize courier brand name strictly when a carrier is present in API
function getCourierBrand(rawCourier: string): string {
  if (!rawCourier) return "";
  const cleaned = String(rawCourier).trim();
  if (!cleaned) return "";

  const lower = cleaned.toLowerCase();
  if (lower.includes("delhivery")) return "Delhivery";
  if (lower.includes("bluedart") || lower.includes("blue dart")) return "Blue Dart";
  if (lower.includes("xpressbees") || lower.includes("xpress bees")) return "Xpressbees";
  if (lower.includes("dtdc")) return "DTDC";
  if (lower.includes("shadowfax")) return "Shadowfax";
  if (lower.includes("ecom")) return "Ecom Express";
  if (lower.includes("ekart")) return "Ekart Logistics";
  if (lower.includes("amazon")) return "Amazon Shipping";
  if (lower.includes("smartr")) return "Smartr Logistics";
  if (lower.includes("india post") || lower.includes("speed post")) return "India Post";

  const stripped = cleaned
    .replace(/\s*\d+\s*(?:kg|g|gm)\b/gi, "")
    .replace(/\s+standard\b/gi, "")
    .replace(/\s+surface\b/gi, "")
    .replace(/\s+air\b/gi, "")
    .trim();

  return stripped || cleaned;
}

function StepIcon({ state }: { state: string }) {
  if (state === "cancelled") {
    return (
      <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-red-600 text-white shadow-md">
        <XCircle className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
      </div>
    );
  }
  if (state === "done") {
    return (
      <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md">
        <Check className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} />
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#D49313] to-[#593102] text-white shadow-md ring-2 sm:ring-4 ring-amber-100 animate-pulse">
        <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-[#EADCC9] bg-[#FAF5EC] text-[#8D7F73]">
      <Home className="h-4 w-4 sm:h-5 sm:w-5" />
    </div>
  );
}

// Normalizer to parse API responses dynamically without any hardcoded static courier or tracking data
function parseLiveTrackingData(apiResponse: any, orderMeta: any, fallbackId: string) {
  // Support nested: data.tracking.data (as in live response) or data.data or data directly
  const rootData = apiResponse?.data || apiResponse || {};
  const trackingObj = rootData?.tracking || apiResponse?.tracking || {};
  const tData = trackingObj?.data || trackingObj || {};

  // Flattened merge with precedence to tracking endpoint, followed by root, followed by orderMeta
  const t = {
    ...orderMeta,
    ...rootData,
    ...trackingObj,
    ...tData,
    new_tracking: tData?.new_tracking || trackingObj?.new_tracking || rootData?.new_tracking,
  };

  // Order Number / Display ID from API
  const orderId = String(
    t.order_display_id ||
    t.order_external_id ||
    t.order_id ||
    t.orderNumber ||
    t.orderId ||
    orderMeta?.order_id ||
    orderMeta?.orderId ||
    orderMeta?.order_group_id ||
    fallbackId ||
    ""
  ).trim();

  // Status parsing
  const rawStatus = String(
    t.tracking_status ||
    t.current_status ||
    t.order_status ||
    t.status ||
    orderMeta?.order_status ||
    orderMeta?.orderStatus ||
    orderMeta?.status ||
    "Processing"
  );
  const statusClean = formatStatus(rawStatus);
  const sLower = rawStatus.toLowerCase();
  const isCancelled = sLower.includes("cancel");
  const isDelivered = sLower.includes("deliver") || sLower.includes("complet");
  const isShipped = sLower.includes("ship") || sLower.includes("transit") || sLower.includes("out") || sLower.includes("pickup_complete");
  const isConfirmed = sLower.includes("confirm") || sLower.includes("pack") || sLower.includes("dispatch") || sLower.includes("ready");

  // Sub status
  const rawSubStatus = t.sub_status || t.subStatus || t.new_tracking?.sub_status || "";
  const subStatus = rawSubStatus ? formatStatus(rawSubStatus) : "";

  // Placed date from API
  const rawPlaced =
    t.placed_on ||
    t.placedOn ||
    t.order_date ||
    t.createdAt ||
    t.created_at ||
    t.date ||
    orderMeta?.order_date ||
    orderMeta?.createdAt ||
    orderMeta?.created_at;
  const parsedPlaced = rawPlaced ? new Date(rawPlaced) : null;
  const placedStr = parsedPlaced && !isNaN(parsedPlaced.getTime())
    ? `${parsedPlaced.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} at ${parsedPlaced.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`
    : rawPlaced
    ? String(rawPlaced)
    : "";
  const placedDateStr = parsedPlaced && !isNaN(parsedPlaced.getTime())
    ? parsedPlaced.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    : "Placed";
  const placedTimeStr = parsedPlaced && !isNaN(parsedPlaced.getTime())
    ? parsedPlaced.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "";

  // Expected delivery date - strictly from API
  const rawEdd =
    t.original_edd ||
    t.edd ||
    t.expected_delivery_date ||
    t.expectedDeliveryDate ||
    t.delivery_date ||
    t.deliveryDate ||
    orderMeta?.expected_delivery_date ||
    orderMeta?.delivery_date;

  let expectedDeliveryRange = "";
  if (rawEdd) {
    const eddDate = new Date(rawEdd);
    if (!isNaN(eddDate.getTime())) {
      expectedDeliveryRange = eddDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } else {
      expectedDeliveryRange = String(rawEdd);
    }
  } else if (isCancelled) {
    expectedDeliveryRange = "Cancelled";
  } else if (isDelivered) {
    expectedDeliveryRange = "Delivered";
  } else if (isShipped) {
    expectedDeliveryRange = "Estimated on dispatch";
  } else {
    expectedDeliveryRange = "Pending Schedule";
  }

  const expectedDeliveryNote = isCancelled
    ? "(Delivery Cancelled)"
    : isDelivered
    ? "(Delivered to Destination)"
    : rawEdd
    ? "(Estimated by Courier)"
    : isShipped
    ? "(Shipment In Transit)"
    : "(Will be updated after dispatch)";

  // Total amount from API
  const amountVal = Number(
    t.totalAmount ||
    t.total_amount ||
    t.finalAmount ||
    t.grandTotal ||
    t.grand_total ||
    t.total ||
    orderMeta?.total_amount ||
    orderMeta?.totalAmount ||
    orderMeta?.finalAmount ||
    orderMeta?.grand_total ||
    0
  );
  let totalAmount = "";
  if (amountVal > 0) {
    totalAmount = `₹${amountVal.toLocaleString("en-IN")}`;
  } else if (orderMeta && Array.isArray(orderMeta.items)) {
    const sum = orderMeta.items.reduce((acc: number, it: any) => {
      const p = Number(it.amount || it.finalAmount || it.price || it.totalAmount || 0);
      return acc + (isNaN(p) ? 0 : p);
    }, 0);
    if (sum > 0) totalAmount = `₹${sum.toLocaleString("en-IN")}`;
  }

  // Payment method from API
  const payRaw = String(
    t.payment_mode ||
    t.paymentMethod ||
    t.payment?.mode ||
    orderMeta?.payment?.mode ||
    orderMeta?.payment_mode ||
    orderMeta?.paymentMethod ||
    ""
  );
  const paymentMethod = payRaw
    ? payRaw.toLowerCase() === "cod"
      ? "Cash on Delivery"
      : payRaw.toUpperCase()
    : "";

  // Courier partner - strictly from API response
  const rawCourier = String(
    t.carrier_name ||
    t.carrier ||
    t.courier_name ||
    t.courierName ||
    t.courier_partner ||
    t.courierPartner ||
    t.courier ||
    t.shipping_carrier ||
    t.shippingCarrier ||
    t.shipping_provider ||
    t.shippingProvider ||
    t.logistic_partner ||
    t.delivery_partner ||
    t.new_tracking?.courier_name ||
    t.new_tracking?.carrier_name ||
    orderMeta?.courier_name ||
    orderMeta?.carrier_name ||
    orderMeta?.courier ||
    orderMeta?.carrier ||
    orderMeta?.shipping_carrier ||
    ""
  ).trim();
  const courier = rawCourier ? getCourierBrand(rawCourier) : "";

  // Tracking ID / AWB - strictly genuine AWB from API, NEVER fallback to order ID
  const rawTrackingId = String(
    t.awbCode ||
    t.awb_code ||
    t.awb_number ||
    t.awb ||
    t.waybill ||
    t.tracking_number ||
    t.trackingNumber ||
    t.tracking_id ||
    t.trackingId ||
    t.new_tracking?.tracking_id ||
    t.new_tracking?.awb ||
    orderMeta?.awbCode ||
    orderMeta?.awb_code ||
    orderMeta?.awb ||
    orderMeta?.tracking_id ||
    orderMeta?.tracking_number ||
    ""
  ).trim();
  const isJustOrderId = Boolean(rawTrackingId && (rawTrackingId === orderId || rawTrackingId === fallbackId));
  const trackingId = isJustOrderId ? "" : rawTrackingId;

  // External Tracking Link
  let trackingLink = String(
    t.tracking_url ||
    t.tracking_link ||
    t.trackingUrl ||
    t.new_tracking?.tracking_url ||
    orderMeta?.tracking_url ||
    orderMeta?.tracking_link ||
    ""
  ).trim();

  // If no direct URL in API, but we have genuine carrier + genuine AWB code
  if (!trackingLink && trackingId && courier) {
    const cLower = courier.toLowerCase();
    if (cLower.includes("delhivery")) {
      trackingLink = `https://www.delhivery.com/track/package/${encodeURIComponent(trackingId)}`;
    } else if (cLower.includes("bluedart") || cLower.includes("blue dart")) {
      trackingLink = `https://www.bluedart.com/tracking?handler=tnt&action=custorderresult&tracknumbers=${encodeURIComponent(trackingId)}`;
    } else if (cLower.includes("xpressbees")) {
      trackingLink = `https://www.xpressbees.com/shipment/tracking?awb=${encodeURIComponent(trackingId)}`;
    } else if (cLower.includes("dtdc")) {
      trackingLink = `https://www.dtdc.in/tracking/shipment-tracking.asp?trackingNo=${encodeURIComponent(trackingId)}`;
    } else if (cLower.includes("shadowfax")) {
      trackingLink = `https://tracker.shadowfax.in/#/track?awb=${encodeURIComponent(trackingId)}`;
    } else if (cLower.includes("ecom")) {
      trackingLink = `https://ecomexpress.in/tracking/?awb_full_detail=${encodeURIComponent(trackingId)}`;
    }
  }

  // Location and Remarks from latest tracking scan
  const newTracking = t.new_tracking || {};
  const remarks = newTracking.remarks || (isCancelled ? "Order was cancelled" : subStatus || (isShipped ? "In transit with courier" : "Order placed and confirmed"));
  const latestLocation = newTracking.location || "";
  const eventDateTime = newTracking.event_date_time;
  const eventDateStr = eventDateTime ? `${formatDate(eventDateTime)} - ${formatTime(eventDateTime)}` : "";

  // Address
  const addr =
    t.shipping_address ||
    t.shippingAddress ||
    t.address ||
    t.delivery_address ||
    orderMeta?.shipping_address ||
    orderMeta?.shippingAddress ||
    {};
  const line1 =
    addr.address_line1 ||
    addr.line1 ||
    addr.address ||
    addr.street ||
    "";
  const line2 =
    [addr.city, addr.state, addr.pincode].filter(Boolean).join(", ") ||
    addr.country ||
    "";

  // Visual Steps based on live status
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
        label: subStatus || "Processing",
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
        date: isConfirmed || isShipped || isDelivered ? placedDateStr : "Upcoming",
        time: isConfirmed || isShipped || isDelivered ? "Verified" : "Pending",
        state: isDelivered || isShipped ? "done" : isConfirmed ? "current" : "upcoming",
      },
      {
        label: "In Transit",
        date: isShipped || isDelivered ? (eventDateTime ? formatDate(eventDateTime) : "Dispatched") : "Upcoming",
        time: isShipped || isDelivered ? (eventDateTime ? formatTime(eventDateTime) : "Active") : "Pending",
        state: isDelivered ? "done" : isShipped ? "current" : "upcoming",
      },
      {
        label: "Delivered",
        date: isDelivered ? (eventDateTime ? formatDate(eventDateTime) : "Delivered") : (rawEdd ? expectedDeliveryRange : "Upcoming"),
        time: isDelivered ? "Completed" : "Expected",
        state: isDelivered ? "done" : "upcoming",
      },
    ];
  }

  // Timeline Activities
  const rawScans = Array.isArray(t.scans)
    ? t.scans
    : Array.isArray(t.tracking_history)
    ? t.tracking_history
    : Array.isArray(t.activities)
    ? t.activities
    : Array.isArray(t.new_tracking?.scans)
    ? t.new_tracking.scans
    : Array.isArray(t.timeline)
    ? t.timeline
    : [];

  let timeline: any[] = [];
  if (rawScans.length > 0) {
    timeline = rawScans.map((scan: any, idx: number) => {
      const scanDate = scan.event_date_time || scan.scan_datetime || scan.datetime || scan.date || scan.time;
      const formattedDate = scanDate ? `${formatDate(scanDate)} - ${formatTime(scanDate)}` : (scan.date || "Update");
      const title = scan.remarks || scan.status || scan.activity || scan.title || "Shipment Update";
      const place = scan.location || scan.hub || scan.city || scan.place || (courier ? `${courier} Hub` : "Fulfillment Facility");
      const isDone = idx < rawScans.length - 1 || isDelivered;
      return {
        date: formattedDate,
        title,
        place,
        state: isCancelled ? "cancelled" : isDone ? "done" : "current",
      };
    });
  } else {
    if (placedStr) {
      timeline.push({
        date: placedStr,
        title: "Order Placed & Confirmed",
        place: "ShuddhVeda Honey",
        state: "done",
      });
    }

    if (subStatus) {
      timeline.push({
        date: trackingObj.webhook_sent_at ? `${formatDate(trackingObj.webhook_sent_at)} - ${formatTime(trackingObj.webhook_sent_at)}` : "Dispatched",
        title: `Courier Status: ${subStatus}`,
        place: courier ? `${courier} Facility` : "Logistics Center",
        state: "done",
      });
    }

    if (newTracking.remarks || newTracking.location || eventDateTime) {
      timeline.push({
        date: eventDateStr || "Latest Update",
        title: newTracking.remarks || (isCancelled ? "Order Cancelled" : "Shipment Update"),
        place: newTracking.location || (courier ? `${courier} Facility` : "Logistics Center"),
        state: isCancelled ? "cancelled" : isDelivered ? "done" : "current",
      });
    }

    if (timeline.length === 0) {
      timeline.push({
        date: placedStr || "Recently Placed",
        title: isCancelled ? "Order Cancelled" : isDelivered ? "Delivered" : isShipped ? "In Transit" : "Order Placed & Processing",
        place: courier ? `${courier} Network` : "ShuddhVeda Facility",
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
      ).catch(() => null);

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

      if (trackingRes && trackingRes.ok) {
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

      // If live-tracking endpoint returns 404 or fails, but order was found in my-orders
      if (orderMeta) {
        const parsed = parseLiveTrackingData(orderMeta, null, ordergroupId);
        setActiveOrder(parsed);
        setCurrentTrackingId(ordergroupId);
        return;
      }

      const errorJson = trackingRes ? await trackingRes.json().catch(() => null) : null;
      const errorMsg = errorJson?.message || errorJson?.error || `Tracking details not found for order #${ordergroupId}`;
      setError(errorMsg);
      setActiveOrder(null);
    } catch (err: any) {
      console.error("Error fetching live tracking details:", err);
      setError(err?.message || "Unable to fetch live tracking details at the moment.");
      setActiveOrder(null);
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
          setActiveOrder(null);
        } catch {
          setActiveOrder(null);
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

  const order = activeOrder;
  const isCancelled = order?.statusRaw?.includes("cancel") || order?.status?.toLowerCase().includes("cancel");
  const isDelivered = order?.statusRaw?.includes("deliver") || order?.status?.toLowerCase().includes("deliver");
  const isShipped = order?.statusRaw?.includes("ship") || order?.statusRaw?.includes("transit") || order?.status?.toLowerCase().includes("ship") || order?.status?.toLowerCase().includes("transit");
  const steps = order?.steps || [];
  const shipment = order?.shipment || { courier: "", trackingId: "", trackingLink: "" };
  const timeline = order?.timeline || [];
  const address = order?.address || { line1: "", line2: "" };

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
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer"
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
            <p className="text-xs text-[#8D7F73]">Fetching courier and dispatch updates from network</p>
          </div>
        ) : !order ? (
          /* Empty / Not Found State (Strictly dynamic - NO static sample data) */
          <div className="mt-8 rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-10 sm:p-14 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-[#D49313] border border-amber-200/80 mb-4">
              <Package size={28} />
            </div>
            <h2 className="font-serif text-2xl font-extrabold text-[#593102]">No Order Tracking Found</h2>
            <p className="text-sm text-[#6E5D4F] font-medium mt-2 max-w-md mx-auto">
              Please check your Order ID or select an order from your account history to view real-time tracking details.
            </p>
            <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#593102] text-white text-xs font-extrabold hover:bg-[#7A4505] transition shadow-xs"
              >
                <ArrowLeft size={14} />
                Back to My Orders
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Main card */}
            <div className="mt-8 rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start pb-8 border-b border-[#EADCC9]/60">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">ORDER NUMBER</p>
                  <p className="font-serif text-2xl font-extrabold text-[#593102] mt-0.5">#{order.orderNumber}</p>
                  {order.placedOn && (
                    <p className="mt-1 text-xs text-[#6E5D4F] font-semibold">Placed on {order.placedOn}</p>
                  )}
                  {order.totalAmount && (
                    <p className="mt-1 text-xs text-[#593102] font-bold">
                      Order Total: <span className="text-emerald-700">{order.totalAmount}</span>
                      {order.paymentMethod ? ` • ${order.paymentMethod}` : ""}
                    </p>
                  )}
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
              <div className="mt-6 sm:mt-8 grid grid-cols-4 items-start relative">
                {steps.map((step: any, i: number) => (
                  <div key={step.label} className="relative flex flex-col items-center text-center px-0.5 sm:px-1">
                    {i < steps.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-[18px] sm:top-[26px] -translate-y-1/2 h-0.5 w-full z-0 ${
                          step.state === "done"
                            ? "bg-emerald-500"
                            : step.state === "cancelled"
                            ? "bg-red-400"
                            : "border-t-2 border-dashed border-[#EADCC9]"
                        }`}
                      />
                    )}
                    <div className="z-10 bg-white rounded-full p-0.5 sm:p-1">
                      <StepIcon state={step.state} />
                    </div>
                    <p
                      className={`mt-2 sm:mt-3 font-serif text-[11px] sm:text-sm md:text-base font-extrabold leading-tight ${
                        step.state === "cancelled"
                          ? "text-red-700"
                          : step.state === "current" || step.state === "done"
                          ? "text-[#593102]"
                          : "text-[#8D7F73]"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-[#6E5D4F] font-semibold">{step.date}</p>
                    <p className="text-[9px] sm:text-[11px] text-[#8D7F73] font-medium">{step.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom grid */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">

              {/* Shipment details - STRICTLY DYNAMIC FROM API */}
              <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b border-[#EADCC9]/60">
                    <Truck size={18} className="text-emerald-700" />
                    <h2 className="font-serif text-lg font-bold text-[#593102]">Shipment Details</h2>
                  </div>

                  <div className="mt-4 space-y-3.5">
                    {/* Courier Partner */}
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Courier Partner</span>
                      {shipment.courier ? (
                        <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-extrabold text-emerald-800 uppercase tracking-wider shadow-2xs">
                          {shipment.courier}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-800">
                          {isCancelled ? "Not Applicable" : "Pending Dispatch"}
                        </span>
                      )}
                    </div>

                    {/* AWB / Tracking ID */}
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">AWB / Tracking ID</span>
                      {shipment.trackingId ? (
                        <span className="flex items-center gap-2 font-bold text-[#593102]">
                          <span className="font-mono text-xs text-[#593102] font-extrabold">{shipment.trackingId}</span>
                          <button
                            onClick={handleCopy}
                            className="p-1 rounded-md hover:bg-emerald-50 text-emerald-700 transition cursor-pointer"
                            title="Copy AWB Tracking ID"
                          >
                            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-[#8D7F73] italic">
                          {isCancelled ? "Not Generated" : "Will be updated after dispatch"}
                        </span>
                      )}
                    </div>

                    {/* Courier Tracking */}
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">Courier Tracking</span>
                      {shipment.trackingLink ? (
                        <a
                          href={shipment.trackingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                        >
                          Track External
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-[#8D7F73] italic">
                          {isCancelled ? "Not Available" : "Available once shipped"}
                        </span>
                      )}
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
                        {order.remarks || "This order has been cancelled."}
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
                        {isDelivered
                          ? "Order Delivered Successfully!"
                          : isShipped
                          ? "Shipment in Transit"
                          : "Order Confirmed & Processing"}
                      </p>
                      <p className="text-xs text-[#6E5D4F] font-medium mt-0.5">
                        {order.remarks ||
                          (isDelivered
                            ? "Thank you for choosing pure artisanal honey from ShuddhVeda."
                            : isShipped
                            ? `Package is handled and dispatched with ${shipment.courier || "courier partner"}.`
                            : "Your order is confirmed and being prepared for dispatch.")}
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
              <div className="relative overflow-hidden rounded-3xl border-2 border-[#EADCC9]/80 bg-white shadow-xs h-[320px] sm:h-[340px] min-h-[300px] md:col-span-2 lg:col-span-1">
                <iframe
                  title="delivery-map"
                  className="w-full -mt-[140px] h-[calc(100%+140px)] min-h-[440px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    order.latestLocation || address.line2 || address.line1 || "India"
                  )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                />
                <div className="absolute left-4 top-4 z-10 max-w-[240px] rounded-2xl border border-[#EADCC9] bg-white/95 backdrop-blur-md p-4 shadow-md">
                  <div className="flex items-center gap-1.5 text-[#D49313] mb-1">
                    <MapPin size={15} />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#593102]">
                      {order.latestLocation ? "CURRENT LOCATION" : "DESTINATION"}
                    </span>
                  </div>
                  <p className="font-serif text-sm font-bold text-[#593102] line-clamp-2">
                    {order.latestLocation || address.line1 || address.line2 || "Delivery Address"}
                  </p>
                  {(order.latestLocation || address.line2 || address.line1) && (
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
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}