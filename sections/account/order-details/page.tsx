"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Copy,
  AlertCircle,
  Loader2,
  RefreshCw,
  HelpCircle,
  MapPin,
  CreditCard,
  ExternalLink,
  FileText,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { API_BASE_URL, getStoredToken } from "@/lib/auth";

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)(sudhveda_token|token|accessToken|jwt)=([^;]+)/);
  if (match && match[2]) return decodeURIComponent(match[2]);
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || localStorage.getItem("sudhveda_token") || null;
  }
  return null;
}

function formatDate(dateVal: any): string {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatStatus(raw: string): string {
  if (!raw) return "Processing";
  const cleaned = String(raw).trim().replace(/[_]/g, " ");
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatTimelineDate(dateVal: any): string {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function formatTimelineTime(dateVal: any): string {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function OrderDetailsSection() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryId = searchParams?.get("id") || searchParams?.get("orderId") || "";
  const queryRef = searchParams?.get("ref") || "";
  const queryGroupId = searchParams?.get("groupId") || "";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!queryId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = getStoredToken() || getTokenFromCookie();

        // 1. Setup headers
        const headers = {
          "Content-Type": "application/json",
          "X-Tunnel-Skip-Anti-Phishing-Page": "true",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // 2. Fetch single order details: GET {{baseUrl}}/api/order/details/{{orderId}}
        const detailsPromise = fetch(
          `${API_BASE_URL}/api/order/details/${encodeURIComponent(queryId)}`,
          {
            method: "GET",
            credentials: "include",
            headers,
          }
        ).catch(() => null);

        // 3. Fetch my-orders in parallel as a fallback/complement for address or extra metadata
        const myOrdersPromise = fetch(`${API_BASE_URL}/api/order/my-orders`, {
          method: "GET",
          credentials: "include",
          headers,
        }).catch(() => null);

        let [detailsRes, myOrdersRes] = await Promise.all([detailsPromise, myOrdersPromise]);

        let metaOrder: any = null;
        if (myOrdersRes && myOrdersRes.ok) {
          const myOrdersJson = await myOrdersRes.json().catch(() => null);
          const rawList = Array.isArray(myOrdersJson?.data)
            ? myOrdersJson.data
            : Array.isArray(myOrdersJson?.orders)
            ? myOrdersJson.orders
            : Array.isArray(myOrdersJson?.groups)
            ? myOrdersJson.groups
            : [];

          metaOrder = rawList.find((g: any) => {
            const gRaw = String(g._id || g.id || "");
            const gOrder = String(g.order_id || g.orderId || "");
            const gGroup = String(g.order_group_id || g.orderGroupId || g.group_id || "");
            const subOrders = Array.isArray(g.orders) ? g.orders : [];
            const subFound = subOrders.some((s: any) => String(s._id || s.id || s.order_id) === queryId);
            return (
              gRaw === queryId ||
              gOrder === queryId ||
              gOrder.replace(/\s+/g, "") === queryId.replace(/\s+/g, "") ||
              gGroup === queryId ||
              subFound
            );
          });
        }

        // 4. If direct details fetch failed, try resolving with 24-character MongoDB _id from metaOrder
        const isMongoId = (val: any) => typeof val === "string" && /^[0-9a-fA-F]{24}$/.test(val.trim());
        if ((!detailsRes || !detailsRes.ok) && metaOrder) {
          const altId = [
            metaOrder._id,
            metaOrder.orders?.[0]?._id,
            metaOrder.id,
            metaOrder.order_group_id,
          ].find(isMongoId);

          if (altId && altId !== queryId) {
            const retryRes = await fetch(
              `${API_BASE_URL}/api/order/details/${encodeURIComponent(altId)}`,
              {
                method: "GET",
                credentials: "include",
                headers,
              }
            ).catch(() => null);
            if (retryRes && retryRes.ok) {
              detailsRes = retryRes;
            }
          }
        }

        if (detailsRes && detailsRes.ok) {
          const json = await detailsRes.json();
          if (json?.data) {
            const merged = {
              ...metaOrder,
              ...json.data,
              // Preserves nested returnRequest and items
              items: json.data.items || metaOrder?.items || [],
              returnRequest: json.data.returnRequest || metaOrder?.returnRequest || null,
              shipping_address: json.data.shipping_address || metaOrder?.shipping_address || metaOrder?.address,
            };
            setOrder(merged);
            return;
          }
        }

        // If details endpoint returned 404 or specific error, check if order exists in metaOrder
        if (metaOrder) {
          setOrder(metaOrder);
          return;
        }

        const errJson = detailsRes ? await detailsRes.json().catch(() => null) : null;
        setError(errJson?.message || errJson?.error || "Unable to fetch order details. Please check order ID.");
      } catch (err: any) {
        console.error("Error fetching order details:", err);
        setError(err?.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [queryId, queryRef, queryGroupId]);

  const handleCopyId = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status computation
  const rawStatus = String(order?.order_status || order?.status || "processing").toLowerCase();
  const isDelivered = rawStatus.includes("deliver") || rawStatus.includes("complet");
  const isShipped = rawStatus.includes("ship") || rawStatus.includes("transit") || rawStatus.includes("out");
  const isConfirmed = rawStatus.includes("confirm") || rawStatus.includes("pack") || rawStatus.includes("dispatch") || rawStatus.includes("ready");
  const isCancelled = rawStatus.includes("cancel");
  const statusDisplay = formatStatus(rawStatus);

  // Address parsing
  const addr = order?.shipping_address || order?.address || order?.delivery_address || {};
  const addrName = addr.full_name || addr.name || order?.name || "Customer";
  const addrPhone = addr.phone_number || addr.phone || order?.phone || "";
  const addrLines = [
    addr.address_line1 || addr.line1 || addr.address || "",
    addr.address_line2 || addr.line2 || "",
    [addr.city, addr.state].filter(Boolean).join(", "),
    [addr.pincode, addr.country].filter(Boolean).join(" - "),
  ].filter(Boolean).join(", ");

  // Order identifiers
  const displayOrderId = order?.order_id || queryRef || order?.orderId || "SV-ORDER";
  const mongoId = order?._id || queryId;
  const orderGroupId = order?.order_group_id || order?.orderGroupId || queryGroupId || "";

  // Payment info
  const payModeRaw = String(order?.payment_mode || order?.paymentMethod || "cod").toLowerCase();
  const payModeFormatted = payModeRaw === "cod" ? "Cash on Delivery (COD)" : payModeRaw.toUpperCase();
  const payStatusRaw = String(order?.payment_status || order?.paymentStatus || (payModeRaw === "cod" ? "Pending (COD)" : "Paid")).toLowerCase();
  const isPaid = payStatusRaw.includes("paid") || payStatusRaw.includes("success") || payStatusRaw.includes("complete");

  // Items list
  const items: any[] = Array.isArray(order?.items) ? order.items : [];

  // Check for local storage ticket if available
  const [localTicket, setLocalTicket] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("sudhveda_support_tickets");
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const match = list.find((t: any) => {
            const tOrder = String(t.orderId || "").trim().toLowerCase();
            const tMongo = String(t.mongoId || "").trim().toLowerCase();
            const dId = String(displayOrderId || "").trim().toLowerCase();
            const mId = String(mongoId || "").trim().toLowerCase();
            const qId = String(queryId || "").trim().toLowerCase();
            const qRef = String(queryRef || "").trim().toLowerCase();
            return (
              (tOrder && (tOrder === dId || tOrder === qRef || tOrder === mId || tOrder === qId)) ||
              (tMongo && (tMongo === mId || tMongo === qId || tMongo === dId))
            );
          });
          if (match) setLocalTicket(match);
        }
      }
    } catch {}
  }, [displayOrderId, mongoId, queryId, queryRef]);

  // Return Request presence check
  const backendReturnReq = order?.returnRequest;
  const rawReturnReq = (backendReturnReq && typeof backendReturnReq === "object") ? backendReturnReq : null;

  // Determine if a real return request was actually sent
  const returnStatusRaw = String(rawReturnReq?.status || localTicket?.status || "").trim().toLowerCase();
  const hasValidStatus = Boolean(
    returnStatusRaw &&
    !["none", "null", "undefined", "false", ""].includes(returnStatusRaw)
  );
  const hasReason = Boolean(
    (rawReturnReq?.reason && String(rawReturnReq.reason).trim() !== "") ||
    (localTicket?.issue && String(localTicket.issue).trim() !== "")
  );
  const hasHistory = Boolean(Array.isArray(rawReturnReq?.reviewHistory) && rawReturnReq.reviewHistory.length > 0);
  const isOrderStatusReturn = rawStatus.includes("return") || rawStatus.includes("exchange");

  // Only consider returnReq active if someone actually SENT a request!
  const hasReturnRequest = Boolean(
    hasValidStatus ||
    hasReason ||
    hasHistory ||
    isOrderStatusReturn ||
    (localTicket && (localTicket.orderId || localTicket.ticketId))
  );

  const returnReq = hasReturnRequest ? (rawReturnReq || {
    status: localTicket?.status || "requested",
    reason: localTicket?.issue || "",
    ticketId: localTicket?.ticketId,
    createdAt: localTicket?.date,
    reviewHistory: [
      {
        status: localTicket?.status || "Requested",
        reviewedAt: localTicket?.date,
        comment: "Return & Exchange request submitted by customer",
      }
    ]
  }) : null;

  const returnStatus = String(returnReq?.status || (isOrderStatusReturn ? rawStatus : "requested")).toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFF8EF] pb-12 sm:pb-16 pt-4 sm:pt-8 md:pt-10 overflow-x-hidden">
      <div className="mx-auto max-w-[1380px] px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">

        {/* Top Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-[#EADCC9]/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-[#8D7F73] flex-wrap">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#EADCC9] bg-white hover:bg-[#FAF0DC] text-xs font-extrabold text-[#593102] transition shadow-2xs cursor-pointer active:scale-95 shrink-0"
            >
              <ArrowLeft size={13} />
              Back to My Orders
            </Link>
            <span className="text-[#C5B4A1]">/</span>
            <span className="text-[#593102] font-extrabold text-xs sm:text-sm">
              Order Details
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isDelivered && !returnReq && (
              <Link
                href={`/account/help?orderId=${encodeURIComponent(mongoId)}&ref=${encodeURIComponent(displayOrderId)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF0DC] hover:bg-[#F5E3BD] border border-[#D49313]/50 text-xs font-extrabold text-[#593102] transition shadow-2xs cursor-pointer active:scale-95"
              >
                <HelpCircle size={13} className="text-[#D49313]" />
                Return &amp; Exchange
              </Link>
            )}
            {(isConfirmed || isShipped) && (
              <Link
                href={`/trackorder?ordergroupId=${encodeURIComponent(orderGroupId || mongoId)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F24E1E] hover:bg-[#D93F13] text-white text-xs font-extrabold transition shadow-2xs cursor-pointer active:scale-95"
              >
                <Truck size={13} />
                Track Order
              </Link>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="rounded-3xl border-2 border-[#EADCC9]/90 bg-white p-12 text-center shadow-sm min-h-[360px] flex flex-col items-center justify-center gap-3">
            <Loader2 size={36} className="animate-spin text-[#D49313]" />
            <h2 className="font-serif text-lg font-bold text-[#593102]">Fetching order details...</h2>
            <p className="text-xs text-[#8D7F73]">Connecting to ShuddhVeda secure server</p>
          </div>
        ) : error ? (
          /* Error state */
          <div className="rounded-3xl border-2 border-red-200 bg-red-50/80 p-8 sm:p-12 text-center shadow-sm space-y-4 max-w-xl mx-auto">
            <AlertCircle size={40} className="mx-auto text-red-600" />
            <h2 className="font-serif text-xl font-bold text-red-900">Order Details Not Found</h2>
            <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">{error}</p>
            <div className="pt-2">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#593102] text-white text-xs font-bold hover:bg-[#7A4505] transition"
              >
                <ArrowLeft size={14} />
                Return to My Orders
              </Link>
            </div>
          </div>
        ) : !order ? null : (
          /* Main Order Details View */
          <div className="space-y-4 sm:space-y-6">

            {/* Header Hero Card */}
            <div className="rounded-2xl sm:rounded-3xl border-2 border-[#EADCC9]/90 bg-white/95 backdrop-blur-sm p-4 sm:p-7 md:p-8 shadow-xs space-y-2 sm:space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">
                    ORDER ID
                  </span>
                  <button
                    onClick={() => handleCopyId(displayOrderId)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#D49313] hover:underline font-bold cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copied ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy size={11} /> Copy ID
                      </span>
                    )}
                  </button>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-extrabold shadow-2xs shrink-0 ${
                    isCancelled
                      ? "bg-red-50 border border-red-300 text-red-700"
                      : isDelivered
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                      : isShipped
                      ? "bg-blue-50 border border-blue-300 text-blue-800"
                      : "bg-[#FFF6DB] border border-[#F5C768] text-[#7A3E00]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isCancelled
                        ? "bg-red-500"
                        : isDelivered
                        ? "bg-emerald-500"
                        : isShipped
                        ? "bg-blue-500"
                        : "bg-[#D49313] animate-ping"
                    }`}
                  />
                  {statusDisplay}
                </span>
              </div>

              <h1 className="font-serif text-lg sm:text-2xl md:text-3xl font-extrabold text-[#593102] break-all leading-tight">
                #{displayOrderId}
              </h1>
              <p className="text-[11px] sm:text-xs text-[#6E5D4F] font-semibold">
                Placed on: {formatDate(order.createdAt || order.order_date || order.date) || "Recent Order"}
              </p>
            </div>


            {/* Separate Return / Replacement Request Status Card */}
            {returnReq && (
              <div
                className={`rounded-2xl border p-3.5 sm:p-5 shadow-2xs space-y-3.5 animate-in fade-in duration-200 ${
                  returnStatus.includes("reject")
                    ? "border-red-200 bg-[#FFFDFD]"
                    : returnStatus.includes("approv")
                    ? "border-emerald-200 bg-[#FAFFFA]"
                    : "border-amber-200 bg-[#FFFDF9]"
                }`}
              >
                {/* Header: Title + Status Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] pb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        returnStatus.includes("reject")
                          ? "bg-red-100 text-red-600"
                          : returnStatus.includes("approv")
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {returnStatus.includes("reject") ? (
                        <XCircle size={15} />
                      ) : returnStatus.includes("approv") ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <RefreshCw size={14} className="animate-spin" />
                      )}
                    </div>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#593102] leading-none">
                      Return / Exchange Request
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${
                      returnStatus.includes("reject")
                        ? "bg-red-600 text-white"
                        : returnStatus.includes("approv")
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {formatStatus(returnStatus || "Under Verification")}
                  </span>
                </div>

                {/* Reason for Request */}
                {returnReq.reason && (
                  <div className="rounded-xl border border-black/[0.06] bg-white p-2.5 text-xs space-y-0.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-[#8D7F73] flex items-center gap-1">
                      <FileText size={11} className="text-[#D49313]" /> Reason for Request
                    </span>
                    <p className="font-bold text-[#593102] leading-snug">
                      &ldquo;{returnReq.reason}&rdquo;
                    </p>
                  </div>
                )}

                {/* Vertical Stepper Timeline (Image 1 Style) */}
                {Array.isArray(returnReq.reviewHistory) && returnReq.reviewHistory.length > 0 && (
                  <div className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8D7F73] flex items-center gap-1.5 pb-2.5 border-b border-black/[0.05]">
                      <Clock size={13} className="text-[#D49313]" /> Verification Timeline
                    </p>

                    <div className="pt-2 space-y-0">
                      {returnReq.reviewHistory.map((h: any, hIdx: number) => {
                        const hStatus = String(h.status || "").toLowerCase();
                        const isRejectedStep = hStatus.includes("reject");
                        const isApprovedStep = hStatus.includes("approv");
                        const isLast = hIdx === returnReq.reviewHistory.length - 1;

                        const dotColor = isRejectedStep
                          ? "bg-red-600 ring-red-100"
                          : isApprovedStep
                          ? "bg-emerald-600 ring-emerald-100"
                          : "bg-emerald-600 ring-emerald-100";
                        const lineColor = isRejectedStep
                          ? "bg-red-300"
                          : isApprovedStep
                          ? "bg-emerald-400"
                          : "bg-emerald-500";

                        const eventDate = h.reviewedAt || h.createdAt || returnReq.updatedAt || returnReq.createdAt;
                        const noteMsg = h.comment || h.adminNote || returnReq.adminNote;

                        return (
                          <div key={h._id || hIdx} className={`relative pl-7 sm:pl-8 ${isLast ? "" : "pb-5 sm:pb-6"}`}>
                            {/* Connected vertical line */}
                            {!isLast && (
                              <div className={`absolute left-[7px] top-[14px] bottom-0 w-[2px] ${lineColor}`} />
                            )}

                            {/* Solid node circle */}
                            <span className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full ${dotColor} ring-4 ring-opacity-60 shrink-0`} />

                            <div className="space-y-1 text-xs sm:text-sm">
                              {/* Milestone Title + Date */}
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className={`font-bold text-sm sm:text-base ${isRejectedStep ? "text-red-700" : isApprovedStep ? "text-emerald-800" : "text-[#1F1813]"}`}>
                                  {formatStatus(h.status)}
                                </span>
                                {eventDate && (
                                  <span className="text-xs sm:text-sm text-[#7A6A5C] font-normal">
                                    {formatTimelineDate(eventDate)}
                                  </span>
                                )}
                              </div>

                              {/* Description / Comment */}
                              {noteMsg && (
                                <p className="text-[#4A3B32] font-semibold text-xs sm:text-sm">
                                  {noteMsg}
                                </p>
                              )}

                              {/* Timestamp */}
                              {eventDate && (
                                <p className="text-[11px] sm:text-xs text-[#8D7F73]">
                                  {formatTimelineDate(eventDate)} - {formatTimelineTime(eventDate)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Unified Order Details Container */}
            <div className="rounded-3xl border-2 border-[#EADCC9]/90 bg-white/95 backdrop-blur-sm shadow-xs overflow-hidden">
              <div className="p-4 sm:p-6 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#EADCC9]/70 pb-3">
                    <div className="flex items-center gap-2">
                      <Package size={18} className="text-[#D49313]" />
                      <h2 className="font-serif text-lg font-bold text-[#593102]">
                        Items in this Order ({items.length})
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {items.map((item: any, idx: number) => {
                      const pd = item.product_details || {};
                      const prod = pd.product || item.product || {};
                      const variant = prod.variant || pd.variant || {};

                      const title = prod.product_name || item.title || item.name || "ShuddhVeda Artisanal Honey";
                      const brand = prod.brand || "SudhVeda Honey";
                      const floral = prod.floral_source || "";
                      const description = prod.description || "";

                      let imgUrl =
                        prod.image?.image_url ||
                        prod.image_url ||
                        item.image ||
                        (typeof prod.image === "string" ? prod.image : "") ||
                        "/giftset.png";

                      const qty = item.quantity || item.qty || 1;
                      const unitPrice = variant.price || pd.totalAmount || item.price || 0;
                      const mrp = variant.mrp || 0;
                      const weight = variant.weight || pd.totalWeight || "";
                      const weightUnit = variant.unit || pd.totalWeightUnit || "g";
                      const savings = variant.save || pd.totalsave || 0;
                      const lineTotal = pd.totalAmount || (unitPrice * qty);

                      return (
                        <div
                          key={item._id || idx}
                          className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#FAF5EC]/60 border border-[#EADCC9]/80 shadow-2xs hover:border-[#D49313]/60 transition-all"
                        >
                          {/* Product Image */}
                          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl bg-white border border-[#EADCC9] shadow-xs self-center sm:self-start">
                            <Image
                              src={imgUrl}
                              alt={title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 w-full space-y-1.5 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#D49313]">
                                  {brand}
                                </p>
                                <h3 className="font-serif text-base sm:text-lg font-bold text-[#593102] leading-snug break-words">
                                  {title}
                                </h3>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-serif text-base sm:text-lg font-extrabold text-[#593102]">
                                  ₹{Number(lineTotal).toLocaleString("en-IN")}
                                </p>
                                {mrp > unitPrice && (
                                  <p className="text-xs text-[#8D7F73] line-through">
                                    ₹{Number(mrp * qty).toLocaleString("en-IN")}
                                  </p>
                                )}
                              </div>
                            </div>


                            {description && (
                              <p className="text-xs text-[#8D7F73] line-clamp-2 leading-relaxed">
                                {description}
                              </p>
                            )}

                            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                              {weight && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-[#EADCC9] font-bold text-[#593102]">
                                  Weight: {weight} {weightUnit}
                                </span>
                              )}
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-[#EADCC9] font-bold text-[#593102]">
                                Quantity: {qty}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              {/* 2 & 3: Delivery Address & Payment Details (2-Column Fully Responsive Grid) */}
              <div className="border-t border-[#EADCC9] bg-[#FAF7F2]/60 p-3.5 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">

                {/* 1. Delivery Address */}
                <div className="rounded-2xl border border-[#EADCC9]/80 bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 border-b border-[#EADCC9]/60 pb-2">
                      <MapPin size={15} className="text-[#D49313]" />
                      <h3 className="font-serif text-sm font-bold text-[#593102]">
                        Delivery Address
                      </h3>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="font-extrabold text-[#593102] text-sm">
                        {addrName}
                      </p>
                      <p className="text-[#6E5D4F] leading-relaxed line-clamp-3">
                        {addrLines || "Customer delivery address registered at order placement."}
                      </p>
                    </div>
                  </div>

                  {addrPhone && (
                    <p className="text-[11px] text-[#8D7F73] font-bold pt-2 border-t border-[#EADCC9]/40">
                      📞 Phone: <span className="text-[#593102] font-semibold">{addrPhone}</span>
                    </p>
                  )}
                </div>

                {/* 2. Payment Details (Adjusted with Total Amount & Status) */}
                <div className="rounded-2xl border border-[#EADCC9]/80 bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-[#EADCC9]/60 pb-2">
                      <CreditCard size={15} className="text-[#D49313]" />
                      <h3 className="font-serif text-sm font-bold text-[#593102]">
                        Payment Details
                      </h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#8D7F73] font-bold">Method:</span>
                        <span className="font-extrabold text-[#593102]">{payModeFormatted}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8D7F73] font-bold">Status:</span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {formatStatus(payStatusRaw)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {order.transactionId && (
                    <div className="flex justify-between items-center pt-1.5 border-t border-[#EADCC9]/40 text-xs">
                      <span className="text-[#8D7F73] font-bold">Txn ID:</span>
                      <span className="font-mono text-[11px] text-[#593102] font-bold break-all">
                        {order.transactionId}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
