"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    Video,
    Camera,
    Upload,
    Trash2,
    Loader2,
    X,
    AlertCircle,
    Phone,
    Mail,
    RefreshCw,
    Package,
    ShieldCheck,
    ShieldAlert,
    PackageX,
    ExternalLink,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { API_BASE_URL, getStoredSession } from "@/lib/auth";

interface LocationData {
    address: {
        line1: string;
        line2: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    phone: string;
    email: string;
    whatsapp: string;
    map_embed_url?: string;
}

interface OrderItem {
    title: string;
    sub: string;
    qty: number;
    price: string;
    image: string;
}

interface OrderSummary {
    orderId: string;
    orderedOn: string;
    totalAmount: string;
    items: OrderItem[];
    status: string;
}

const ISSUE_OPTIONS = [
    {
        id: "seal_broken",
        title: "Seal Broken",
        icon: ShieldAlert,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-100/90",
        desc: "Cap safety seal opened, broken, or missing",
    },
    {
        id: "missing_product",
        title: "Missing Product",
        icon: PackageX,
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100/90",
        desc: "Bottle or item missing from delivery package",
    },
];

const PHOTO_SLOTS = [
    { id: 0, title: "Photo 1", label: "Outer Box & Label" },
    { id: 1, title: "Photo 2", label: "Defect Proof" },
    { id: 2, title: "Photo 3", label: "Cap Seal / Batch" },
];

function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
    if (match) return decodeURIComponent(match[2]);
    const match2 = document.cookie.match(/(^| )token=([^;]+)/);
    if (match2) return decodeURIComponent(match2[2]);
    if (typeof window !== "undefined") {
        return localStorage.getItem("token") || localStorage.getItem("sudhveda_token") || null;
    }
    return null;
}

const isMongoId = (val: any) => typeof val === "string" && /^[0-9a-fA-F]{24}$/.test(val.trim());

export default function OrderHelpReturnExchangeSection() {
    const searchParams = useSearchParams();
    const orderIdParam = searchParams?.get("orderId") || "";
    const refParam = searchParams?.get("ref") || "";

    // If orderIdParam is an exact 24-char hex MongoDB ID, initialize backendOrderId with it
    const initialBackendId = isMongoId(orderIdParam) ? orderIdParam.trim() : "";
    const initialDisplayId = refParam || (!isMongoId(orderIdParam) && orderIdParam ? orderIdParam : "SV-ORDER");

    const [orderId, setOrderId] = useState<string>(initialDisplayId);
    const [backendOrderId, setBackendOrderId] = useState<string>(initialBackendId || orderIdParam || "");
    const [existingReturnDetails, setExistingReturnDetails] = useState<any>(null);
    const [orderDetails, setOrderDetails] = useState<OrderSummary | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

    // Dynamic API Location data for "Get in Touch"
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [locationLoading, setLocationLoading] = useState<boolean>(true);

    // Media states
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);

    const [photos, setPhotos] = useState<(File | null)[]>([null, null, null]);
    const [photoPreviewUrls, setPhotoPreviewUrls] = useState<(string | null)[]>([null, null, null]);
    const [photoErrors, setPhotoErrors] = useState<(string | null)[]>([null, null, null]);

    const [contactMobile, setContactMobile] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submittedTicket, setSubmittedTicket] = useState<{
        ticketId: string;
        orderId: string;
        issueName: string;
    } | null>(null);

    const videoInputRef = useRef<HTMLInputElement>(null);
    const photoInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
            photoPreviewUrls.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    // Fetch Get in Touch location from API
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/location/all`);
                const data = await res.json();
                if (data.success && data.data) {
                    setLocationData(data.data);
                }
            } catch (err) {
                console.error("Error fetching location data for Get in Touch:", err);
            } finally {
                setLocationLoading(false);
            }
        };

        fetchLocation();
    }, []);

    // Note: /api/order/return-request-details/:orderId is strictly a POST API (for form submission)
    // Check locally stored tickets if user already submitted for this order
    const loadStoredReturnDetails = (targetId: string) => {
        if (!targetId || typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem("sudhveda_support_tickets");
            if (raw) {
                const list = JSON.parse(raw);
                const found = Array.isArray(list) ? list.find((t: any) =>
                    (t.orderId && String(t.orderId).toLowerCase() === targetId.toLowerCase()) ||
                    (t.mongoId && String(t.mongoId).toLowerCase() === targetId.toLowerCase())
                ) : null;
                if (found) {
                    setExistingReturnDetails({
                        status: found.status || "Requested",
                        reason: found.issue,
                        phoneNumber: found.contactMobile,
                        ticketId: found.ticketId,
                    });
                }
            }
        } catch { }
    };

    // Fetch user order details & session phone
    useEffect(() => {
        const session = getStoredSession();
        if (session?.user?.mobile) {
            setContactMobile(session.user.mobile);
        }

        if (refParam) {
            setOrderId(refParam);
        } else if (orderIdParam && !isMongoId(orderIdParam)) {
            setOrderId(orderIdParam);
        }

        if (initialBackendId) {
            loadStoredReturnDetails(initialBackendId);
        }

        const token = getTokenFromCookie();
        fetch(`${API_BASE_URL}/api/order/my-orders`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const rawList = Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.orders)
                        ? data.orders
                        : Array.isArray(data?.groups)
                            ? data.groups
                            : Array.isArray(data?.result)
                                ? data.result
                                : Array.isArray(data)
                                    ? data
                                    : [];

                if (rawList.length > 0) {
                    let matchedGroup: any = null;
                    let matchedSubOrder: any = null;

                    for (const group of rawList) {
                        const gId = String(group.order_id || group.orderId || "");
                        const gRaw = String(group._id || group.id || "");
                        const gGroup = String(group.order_group_id || group.orderGroupId || "");

                        // 1. Check top-level group match
                        if (
                            (orderIdParam && (gRaw.toLowerCase() === orderIdParam.toLowerCase() || gId.toLowerCase() === orderIdParam.toLowerCase() || gGroup.toLowerCase() === orderIdParam.toLowerCase())) ||
                            (refParam && (gId.toLowerCase() === refParam.toLowerCase() || gRaw.toLowerCase() === refParam.toLowerCase()))
                        ) {
                            matchedGroup = group;
                            break;
                        }

                        // 2. Check nested orders inside group.orders
                        const subOrders = Array.isArray(group.orders) ? group.orders : [];
                        const foundSub = subOrders.find((s: any) => {
                            const sRaw = String(s._id || s.id || "");
                            const sId = String(s.order_id || s.orderId || "");
                            return (
                                (orderIdParam && (sRaw.toLowerCase() === orderIdParam.toLowerCase() || sId.toLowerCase() === orderIdParam.toLowerCase())) ||
                                (refParam && sId.toLowerCase() === refParam.toLowerCase())
                            );
                        });
                        if (foundSub) {
                            matchedGroup = group;
                            matchedSubOrder = foundSub;
                            break;
                        }

                        // 3. Check nested items inside group.items
                        const subItems = Array.isArray(group.items) ? group.items : [];
                        const foundItem = subItems.find((it: any) => {
                            const itRaw = String(it._id || it.id || it.order_id || "");
                            return orderIdParam && itRaw.toLowerCase() === orderIdParam.toLowerCase();
                        });
                        if (foundItem) {
                            matchedGroup = group;
                            matchedSubOrder = foundItem;
                            break;
                        }
                    }

                    if (!matchedGroup) {
                        matchedGroup = rawList[0];
                    }

                    // Prioritize exact 24-character hexadecimal MongoDB ObjectId
                    let targetMongoId = "";
                    if (isMongoId(orderIdParam)) {
                        targetMongoId = orderIdParam.trim();
                    } else if (matchedSubOrder && isMongoId(matchedSubOrder._id)) {
                        targetMongoId = String(matchedSubOrder._id);
                    } else if (matchedSubOrder && isMongoId(matchedSubOrder.id)) {
                        targetMongoId = String(matchedSubOrder.id);
                    } else if (isMongoId(matchedGroup._id)) {
                        targetMongoId = String(matchedGroup._id);
                    } else if (isMongoId(matchedGroup.id)) {
                        targetMongoId = String(matchedGroup.id);
                    } else if (Array.isArray(matchedGroup.orders) && matchedGroup.orders.length > 0 && isMongoId(matchedGroup.orders[0]._id)) {
                        targetMongoId = String(matchedGroup.orders[0]._id);
                    } else {
                        targetMongoId = String(matchedGroup._id || matchedGroup.id || orderIdParam || "");
                    }

                    const targetHumanId = String(
                        refParam ||
                        (matchedSubOrder && (matchedSubOrder.order_id || matchedSubOrder.orderId)) ||
                        matchedGroup.order_id ||
                        matchedGroup.orderId ||
                        (!isMongoId(orderIdParam) && orderIdParam) ||
                        "SV-ORDER"
                    );

                    setBackendOrderId(targetMongoId);
                    setOrderId(targetHumanId);

                    if (targetMongoId && targetMongoId !== initialBackendId) {
                        loadStoredReturnDetails(targetMongoId);
                    }

                    const phoneFromOrder =
                        (matchedSubOrder && (matchedSubOrder.shipping_address?.phone || matchedSubOrder.shippingAddress?.phone || matchedSubOrder.phone)) ||
                        matchedGroup.shipping_address?.phone ||
                        matchedGroup.shippingAddress?.phone ||
                        matchedGroup.phone ||
                        matchedGroup.phoneNumber ||
                        "";

                    if (phoneFromOrder && !contactMobile) {
                        setContactMobile(String(phoneFromOrder).replace(/\D/g, ""));
                    }

                    const items: OrderItem[] = [];
                    const rawItems = matchedGroup.items || matchedGroup.products || matchedGroup.orders || [];
                    if (Array.isArray(rawItems)) {
                        rawItems.forEach((it: any) => {
                            const pd = it.product_details || it.productDetails || it.product || {};
                            const title = it.product_name || it.title || pd.product_name || pd.name || "Pure Honey";
                            const sub = it.weight ? `${it.weight}${it.unit || "g"}` : (pd.weight ? `${pd.weight}${pd.unit || "g"}` : "Honey Jar");
                            const qty = Number(it.quantity || it.qty || 1);
                            const price = it.price ? `₹${Number(it.price).toLocaleString("en-IN")}` : "";
                            const img = it.box_image || it.image_url || it.image || pd.image_url || pd.image || "/images/honey-default.png";

                            items.push({
                                title,
                                sub,
                                qty,
                                price,
                                image: typeof img === "string" ? img : "",
                            });
                        });
                    }

                    if (items.length === 0) {
                        items.push({
                            title: "Multi Flora Honey",
                            sub: "250g Jar",
                            qty: 1,
                            price: "₹299",
                            image: "/images/honey-default.png",
                        });
                    }

                    setOrderDetails({
                        orderId: targetHumanId,
                        orderedOn: matchedGroup.createdAt ? new Date(matchedGroup.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recent",
                        totalAmount: `₹${Number(matchedGroup.total_amount || matchedGroup.totalAmount || 299).toLocaleString("en-IN")}`,
                        items,
                        status: matchedGroup.order_status || matchedGroup.status || "Processing",
                    });
                }
            })
            .catch(() => { });
    }, [orderIdParam, refParam]);

    // Handle video change (Max 10MB limit)
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setVideoError(null);
        if (!file) return;

        // MAX 10 MB
        if (file.size > 10 * 1024 * 1024) {
            const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
            setVideoError(`Video size (${sizeMb} MB) exceeds 10MB limit. Please upload a video under 10MB.`);
            if (videoInputRef.current) videoInputRef.current.value = "";
            return;
        }

        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        setVideoFile(file);
        setVideoPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveVideo = () => {
        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setVideoError(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
    };

    // Handle single photo slot (Max 5MB limit)
    const handlePhotoSlotChange = (slotIndex: number, file: File | null) => {
        setPhotoErrors((prev) => {
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });

        if (!file) return;

        // MAX 5 MB
        if (file.size > 5 * 1024 * 1024) {
            const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
            setPhotoErrors((prev) => {
                const next = [...prev];
                next[slotIndex] = `Photo exceeds 5MB (${sizeMb} MB). Max allowed is 5MB.`;
                return next;
            });
            const ref = photoInputRefs[slotIndex];
            if (ref?.current) ref.current.value = "";
            return;
        }

        const currentUrl = photoPreviewUrls[slotIndex];
        if (currentUrl) URL.revokeObjectURL(currentUrl);

        const newUrl = URL.createObjectURL(file);
        setPhotos((prev) => {
            const next = [...prev];
            next[slotIndex] = file;
            return next;
        });
        setPhotoPreviewUrls((prev) => {
            const next = [...prev];
            next[slotIndex] = newUrl;
            return next;
        });
    };

    const handleRemovePhoto = (slotIndex: number) => {
        setPhotoErrors((prev) => {
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });
        const currentUrl = photoPreviewUrls[slotIndex];
        if (currentUrl) URL.revokeObjectURL(currentUrl);

        setPhotos((prev) => {
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });
        setPhotoPreviewUrls((prev) => {
            const next = [...prev];
            next[slotIndex] = null;
            return next;
        });
        const ref = photoInputRefs[slotIndex];
        if (ref?.current) ref.current.value = "";
    };

    // Form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!selectedIssue) {
            setFormError("Please select an issue (Seal Broken or Missing Product).");
            return;
        }

        if (!videoFile) {
            setFormError("Please upload 1 short unboxing or defect video clip (Max 10MB).");
            return;
        }

        if (videoFile.size > 10 * 1024 * 1024) {
            setFormError("Video size exceeds 10MB limit. Please upload a video clip under 10MB.");
            return;
        }

        const uploadedPhotos = photos.filter(Boolean);
        if (uploadedPhotos.length === 0) {
            setFormError("Please upload at least 1-3 photographs showing the defect (Max 5MB per photo).");
            return;
        }

        const hasOverSizedPhoto = photos.some((p) => p && p.size > 5 * 1024 * 1024);
        if (hasOverSizedPhoto) {
            setFormError("One or more photos exceed 5MB. Please upload images under 5MB each.");
            return;
        }

        const cleanPhone = contactMobile.trim().replace(/\D/g, "");
        if (!cleanPhone || cleanPhone.length < 10) {
            setFormError("Please enter your 10-digit mobile number for replacement dispatch updates.");
            return;
        }

        setIsSubmitting(true);

        try {
            const matched = ISSUE_OPTIONS.find((o) => o.id === selectedIssue);
            const reasonText = matched?.title || selectedIssue;

            // Prepare FormData (multipart/form-data) matching Postman exactly
            const formData = new FormData();

            // 1. packagingImages (File[])
            uploadedPhotos.forEach((photo) => {
                if (photo) {
                    formData.append("packagingImages", photo);
                }
            });

            // 2. unboxingVideo (File)
            formData.append("unboxingVideo", videoFile);

            // 3. phoneNumber (Text)
            formData.append("phoneNumber", cleanPhone);

            // 4. reason (Text)
            formData.append("reason", reasonText);

            // Target order ID for URL (use exact MongoDB _id: e.g. 6ad3316b0d7302ed33a7dda6)
            const targetOrderId =
                (isMongoId(backendOrderId) ? backendOrderId : "") ||
                (isMongoId(orderIdParam) ? orderIdParam : "") ||
                backendOrderId ||
                orderIdParam ||
                orderId;
            formData.append("orderId", targetOrderId);

            // Headers - do not set Content-Type manually so browser sets boundary
            const token = getTokenFromCookie();
            const headers: HeadersInit = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE_URL}/api/order/return-request-details/${encodeURIComponent(targetOrderId)}`, {
                method: "POST",
                headers,
                credentials: "include",
                body: formData,
            });

            const data = await res.json().catch(() => null);

            if (res.ok && data?.success) {
                const returnData = data.data || {};
                const createdTicketId = returnData._id
                    ? `#${returnData._id.slice(-8).toUpperCase()}`
                    : `EXCH-${orderId.slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

                setSubmittedTicket({
                    ticketId: createdTicketId,
                    orderId: returnData.orderId || orderId,
                    issueName: returnData.reason || reasonText,
                });

                // Persist ticket in localStorage for account history
                if (typeof window !== "undefined") {
                    try {
                        const existing = localStorage.getItem("sudhveda_support_tickets");
                        const list = existing ? JSON.parse(existing) : [];
                        list.unshift({
                            ticketId: createdTicketId,
                            orderId: returnData.orderId || orderId,
                            date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
                            issue: returnData.reason || reasonText,
                            resolution: "Return & Exchange Verification",
                            contactMobile: cleanPhone,
                            mongoId: returnData._id,
                            status: returnData.status || "requested",
                        });
                        localStorage.setItem("sudhveda_support_tickets", JSON.stringify(list.slice(0, 20)));
                    } catch { }
                }

                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                const errMsg = data?.message || "Failed to submit return request. Please try again or reach out on WhatsApp.";
                setFormError(errMsg);
            }
        } catch (err: any) {
            console.error("Return request submission error:", err);
            setFormError(err?.message || "Network error submitting request. Please try again or reach out on WhatsApp.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayPhone = locationData?.phone || "8796632478";
    const displayWhatsApp = locationData?.whatsapp || "8796632478";
    const displayEmail = locationData?.email || "shuddhvedahoney@gmail.com";

    // Direct Email Open (Opens Gmail Compose in browser or triggers mail client)
    const handleOpenEmail = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const subject = encodeURIComponent(`Support & Exchange Request - Order #${orderId}`);
        const body = encodeURIComponent(
            `Hello ShuddhVeda Team,\n\nI need support regarding Order #${orderId}.\n\nIssue: ${selectedIssue ? ISSUE_OPTIONS.find((o) => o.id === selectedIssue)?.title : "Return & Exchange"
            }\nContact Mobile: ${contactMobile || ""}\n\nPlease assist me with my free replacement jar.\n\nThank you!`
        );

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
            displayEmail
        )}&su=${subject}&body=${body}`;

        const opened = window.open(gmailUrl, "_blank", "noopener,noreferrer");

        if (!opened || opened.closed || typeof opened.closed === "undefined") {
            window.location.href = `mailto:${displayEmail}?subject=${subject}&body=${body}`;
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFF8EF] pb-12 pt-6 sm:pt-7 lg:pt-8">
            <div className="mx-auto max-w-[1380px] px-3.5 sm:px-5 md:px-6 lg:px-8 space-y-4">

                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between border-b border-[#EADCC9]/80 pb-3 sm:pb-3.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#8D7F73]">
                        <Link
                            href="/account"
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border border-[#EADCC9] bg-white hover:bg-[#FAF0DC] text-xs font-extrabold text-[#593102] transition shadow-2xs cursor-pointer active:scale-95 shrink-0"
                        >
                            <ArrowLeft size={14} />
                            Back to My Orders
                        </Link>
                        <span className="text-[#C5B4A1]">/</span>
                        <span className="text-[#593102] font-extrabold text-xs sm:text-sm whitespace-nowrap">Return &amp; Exchange</span>
                    </div>

                    {/* Order Reference Pill (Hidden on mobile, clean on tablet & desktop) */}
                    <div className="hidden sm:flex items-center shrink-0">
                        <span className="text-xs font-extrabold text-[#593102] bg-white px-3 py-1.5 rounded-xl border border-[#EADCC9] shadow-2xs">
                            Order Reference: <strong className="font-mono text-[#D49313]">#{orderId.replace(/\s+-\s+/g, "-")}</strong>
                        </span>
                    </div>
                </div>

                {submittedTicket ? (
                    /* SUCCESS SCREEN - FULLY RESPONSIVE ACROSS MOBILE, TABLET & DESKTOP */
                    <div className="w-full max-w-xl md:max-w-2xl mx-auto rounded-3xl border-2 border-[#EADCC9] bg-white p-5 sm:p-8 md:p-10 lg:p-12 shadow-[0_12px_40px_rgb(89,49,2,0.08)] text-center space-y-5 sm:space-y-6 animate-in fade-in duration-200">
                        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 shadow-sm">
                            <CheckCircle2 className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={2.5} />
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                            <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-2xs">
                                Request Approved
                            </span>
                            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[#593102] leading-tight px-1">
                                Replacement Request Submitted!
                            </h2>
                            <p className="text-xs sm:text-sm text-[#6E5D4F] max-w-lg mx-auto leading-relaxed px-1 sm:px-2">
                                Your exchange request for <strong className="text-[#593102]">{submittedTicket.issueName}</strong> has been received with your uploaded video and photos.
                            </p>
                        </div>

                        <div className="w-full max-w-lg mx-auto rounded-2xl border border-[#EADCC9] bg-[#FAF5EC] p-4 sm:p-5 text-xs text-left space-y-2.5 sm:space-y-3 shadow-2xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 pb-2.5 border-b border-[#EADCC9]/70">
                                <span className="text-[#8D7F73] font-bold text-xs shrink-0">Exchange Ticket ID:</span>
                                <span className="font-mono font-extrabold text-xs sm:text-sm text-[#593102] bg-white px-2.5 py-1 rounded-lg border border-[#EADCC9] shadow-2xs self-start sm:self-auto">
                                    #{submittedTicket.ticketId}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 pb-2.5 border-b border-[#EADCC9]/50">
                                <span className="text-[#8D7F73] font-bold text-xs shrink-0">Order ID:</span>
                                <span className="font-mono font-bold text-[#593102] text-xs sm:text-sm break-all sm:text-right">
                                    #{submittedTicket.orderId}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2 pb-2.5 border-b border-[#EADCC9]/50">
                                <span className="text-[#8D7F73] font-bold text-xs shrink-0">Status:</span>
                                <span className="font-extrabold text-[#593102] flex items-center gap-1.5 text-xs sm:text-right leading-snug">
                                    <RefreshCw size={13} className="text-[#D49313] shrink-0" />
                                    <span>Return &amp; Exchange Under Verification</span>
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 pt-0.5">
                                <span className="text-[#8D7F73] font-bold text-xs shrink-0">Dispatch Updates:</span>
                                <span className="font-mono font-bold text-[#593102] text-xs sm:text-sm sm:text-right">
                                    +91 {contactMobile}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 justify-center w-full max-w-lg mx-auto pt-2">
                            <a
                                href={`https://wa.me/${displayWhatsApp.replace(/\D/g, "")}?text=${encodeURIComponent(
                                    `Hello ShuddhVeda! I have submitted Return & Exchange request #${submittedTicket.ticketId} for Order #${submittedTicket.orderId}. Please assist me with my replacement.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-4 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition shadow-sm active:scale-95 cursor-pointer"
                            >
                                <FaWhatsapp size={18} className="shrink-0" />
                                <span>Chat on WhatsApp</span>
                            </a>
                            <Link
                                href="/account"
                                className="w-full sm:flex-1 inline-flex items-center justify-center h-11 sm:h-12 px-4 rounded-xl sm:rounded-2xl border-2 border-[#593102] text-[#593102] hover:bg-[#FAF0DC] font-extrabold text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-2xs"
                            >
                                Back to My Orders
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* MAIN INTERACTIVE FORM - ALL ON ONE SINGLE UNIFIED PAGE */
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Optional Order Details Strip */}
                        {orderDetails && (
                            <div className="rounded-2xl border border-[#EADCC9]/80 bg-white/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    {orderDetails.items[0]?.image ? (
                                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white border border-[#EADCC9] shadow-2xs">
                                            <Image
                                                src={orderDetails.items[0].image}
                                                alt={orderDetails.items[0].title}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF0DC] text-[#D49313]">
                                            <Package size={20} />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-serif text-sm font-bold text-[#593102] truncate">
                                            {orderDetails.items[0]?.title || "ShuddhVeda Pure Honey"}
                                            {orderDetails.items.length > 1 && ` (+${orderDetails.items.length - 1} more items)`}
                                        </p>
                                        <p className="text-xs text-[#8D7F73]">
                                            Ordered on: <strong className="text-[#593102]">{orderDetails.orderedOn}</strong> • Total: <strong className="text-[#D49313]">{orderDetails.totalAmount}</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF0DC] text-[#593102] text-xs font-extrabold border border-[#D49313]/30">
                                        Return &amp; Exchange
                                    </span>
                                </div>
                            </div>
                        )}


                        {/* 2-COLUMN BALANCED LAYOUT - RESPONSIVE ON MOBILE, TABLET & DESKTOP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">

                            {/* LEFT COLUMN: ISSUE SELECTION + PROOF UPLOAD (INTEGRATED IN ONE CARD) */}
                            <div className="rounded-3xl border-2 border-[#EADCC9]/90 bg-white/95 backdrop-blur-sm p-4 sm:p-5 lg:p-6 shadow-[0_8px_30px_rgb(89,49,2,0.06)] space-y-4">

                                {/* Mobile Only: Order Reference */}
                                <div className="sm:hidden flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-[#FAF5EC] to-[#FFFDF9] border border-[#EADCC9]/90 shadow-2xs">
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8D7F73]">
                                        Order Reference
                                    </p>
                                    <p className="font-mono text-xs font-extrabold text-[#D49313]">
                                        #{orderId.replace(/\s+-\s+/g, "-")}
                                    </p>
                                </div>

                                {/* 1. SELECT ISSUE */}
                                <div className="space-y-3">
                                    <div className="border-b border-[#EADCC9]/60 pb-2.5">
                                        <h1 className="font-serif text-lg sm:text-xl font-extrabold text-[#593102] tracking-tight">
                                            Select Your Issue / Problem
                                        </h1>
                                        <p className="text-xs text-[#8D7F73] mt-0.5">
                                            Choose an option below to proceed with your request.
                                        </p>
                                    </div>

                                    {/* 2 Options Cards - Fully Responsive */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-2.5 sm:gap-3">
                                        {ISSUE_OPTIONS.map((opt) => {
                                            const isSelected = selectedIssue === opt.id;
                                            const IconComponent = opt.icon;
                                            return (
                                                <div
                                                    key={opt.id}
                                                    onClick={() => setSelectedIssue(opt.id)}
                                                    className={`relative p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 ${isSelected
                                                        ? "border-[#593102] bg-gradient-to-br from-[#FAF0DC] to-[#F5E6CA]/60 shadow-[0_8px_20px_-4px_rgba(212,147,19,0.25)] scale-[1.01] opacity-100"
                                                        : selectedIssue
                                                            ? "border-[#EADCC9]/60 bg-white/50 opacity-40 hover:opacity-75"
                                                            : "border-[#EADCC9]/80 bg-white/70 opacity-60 hover:opacity-100 hover:border-[#D49313]/70"
                                                        }`}
                                                >
                                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${opt.iconBg} shadow-2xs`}>
                                                        <IconComponent size={20} className={opt.iconColor} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-serif text-sm sm:text-base font-extrabold text-[#593102]">
                                                            {opt.title}
                                                        </p>
                                                        <p className="text-[11.5px] text-[#6E5D4F] mt-0.5 leading-snug font-medium">
                                                            {opt.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2. PROOF UPLOAD (INTEGRATED ON THE SAME PAGE RIGHT HERE) */}
                                {selectedIssue && (
                                    <div className="space-y-3.5 pt-3 border-t border-[#EADCC9]/70 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="border-b border-[#EADCC9]/60 pb-2">
                                            <h2 className="font-serif text-base sm:text-lg font-extrabold text-[#593102] tracking-tight">
                                                Upload Video &amp; Images Proof
                                            </h2>
                                        </div>

                                        {/* Video Upload Box */}
                                        <div className={`rounded-xl border-2 border-dashed p-3 sm:p-3.5 space-y-2 shadow-2xs transition-all duration-200 ${videoFile
                                            ? "border-[#593102] bg-gradient-to-br from-[#FAF5EC]/80 to-[#FAF0DC]/60 opacity-100"
                                            : "border-[#EADCC9]/90 bg-white/60 opacity-60 hover:opacity-100 hover:border-[#D49313]/70"
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#593102] text-[#D49313] shadow-2xs">
                                                        <Video size={16} />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-extrabold text-[#593102]">
                                                        1 Video Clip (Max 10MB) <span className="text-red-500">*</span>
                                                    </span>
                                                </div>
                                                {videoFile && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveVideo}
                                                        className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer inline-flex items-center gap-1 hover:underline"
                                                    >
                                                        <Trash2 size={13} />
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <input
                                                ref={videoInputRef}
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoChange}
                                                className="hidden"
                                            />

                                            {videoPreviewUrl && videoFile ? (
                                                <div className="space-y-1.5">
                                                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-40 flex items-center justify-center border border-[#EADCC9]">
                                                        <video
                                                            src={videoPreviewUrl}
                                                            controls
                                                            className="w-full h-full max-h-40 object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between px-1 text-xs text-[#593102] font-semibold">
                                                        <span className="truncate max-w-[280px]">🎬 {videoFile.name}</span>
                                                        <span className="font-mono text-[#D49313]">
                                                            {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => videoInputRef.current?.click()}
                                                    className="group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border-2 border-dashed border-[#EADCC9] bg-white hover:bg-[#FAF0DC]/40 hover:border-[#D49313] transition cursor-pointer text-center"
                                                >
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF5EC] group-hover:bg-[#FAF0DC] text-[#D49313] mb-1 transition-transform group-hover:scale-110 shadow-2xs">
                                                        <Upload size={17} />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-extrabold text-[#593102]">
                                                        Click to Upload Video (Max 10MB)
                                                    </span>
                                                </div>
                                            )}

                                            {videoError && (
                                                <p className="text-xs text-red-600 font-bold flex items-center gap-1.5 pt-0.5">
                                                    <AlertCircle size={14} className="shrink-0" />
                                                    {videoError}
                                                </p>
                                            )}
                                        </div>

                                        {/* 3 Photos Upload */}
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-xs font-extrabold uppercase tracking-wider text-[#593102] flex items-center gap-1.5">
                                                    <Camera size={14} className="text-[#D49313]" />
                                                    Photographs Proof (Max 5MB each) <span className="text-red-500">*</span>
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                                                {PHOTO_SLOTS.map((slot, idx) => {
                                                    const file = photos[idx];
                                                    const preview = photoPreviewUrls[idx];
                                                    const error = photoErrors[idx];
                                                    return (
                                                        <div
                                                            key={slot.id}
                                                            className={`relative flex flex-col rounded-xl border-2 p-2 text-center transition shadow-2xs ${error
                                                                ? "border-red-300 bg-red-50/50 opacity-100"
                                                                : file
                                                                    ? "border-[#593102] bg-gradient-to-br from-[#FAF0DC]/80 to-[#F5E6CA]/40 opacity-100 shadow-xs"
                                                                    : "border-[#EADCC9]/80 bg-white/60 opacity-60 hover:opacity-100 hover:border-[#D49313]/70"
                                                                }`}
                                                        >
                                                            <input
                                                                ref={photoInputRefs[idx]}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) =>
                                                                    handlePhotoSlotChange(idx, e.target.files?.[0] || null)
                                                                }
                                                                className="hidden"
                                                            />

                                                            {preview && file ? (
                                                                <div className="space-y-1">
                                                                    <div className="relative h-22 w-full rounded-lg overflow-hidden bg-[#FAF5EC] border border-[#EADCC9]/60">
                                                                        <Image
                                                                            src={preview}
                                                                            alt={`Photo ${idx + 1}`}
                                                                            fill
                                                                            unoptimized
                                                                            className="object-cover"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemovePhoto(idx)}
                                                                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 cursor-pointer transition active:scale-95"
                                                                            title="Remove photo"
                                                                        >
                                                                            <X size={11} strokeWidth={3} />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex items-center justify-between text-[10px] font-semibold text-[#593102] px-0.5">
                                                                        <span className="truncate max-w-[90px]">✓ {slot.title}</span>
                                                                        <span className="font-mono text-[#D49313]">
                                                                            {file.size > 1024 * 1024
                                                                                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                                                                                : `${Math.round(file.size / 1024)} KB`}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    onClick={() => photoInputRefs[idx].current?.click()}
                                                                    className="flex flex-col items-center justify-center h-22 rounded-lg border-2 border-dashed border-[#EADCC9] bg-[#FAF5EC]/40 hover:bg-[#FAF0DC]/50 hover:border-[#D49313] transition cursor-pointer p-1.5 text-center"
                                                                >
                                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF0DC] text-[#D49313] mb-1 shadow-2xs">
                                                                        <Camera size={14} />
                                                                    </div>
                                                                    <span className="text-xs font-extrabold text-[#593102]">
                                                                        {slot.title}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold text-[#D49313]">
                                                                        {slot.label}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {error && (
                                                                <p className="text-[9.5px] text-red-600 font-bold mt-1 leading-tight">
                                                                    {error}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Contact Phone */}
                                        <div className="space-y-1 pt-0.5">
                                            <label className="text-xs font-extrabold text-[#593102] flex items-center gap-1.5">
                                                <Phone size={13} className="text-[#D49313]" />
                                                WhatsApp / Mobile Number for Replacement Updates <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8D7F73]">
                                                    +91
                                                </span>
                                                <input
                                                    type="tel"
                                                    placeholder="10-digit mobile number"
                                                    value={contactMobile}
                                                    maxLength={10}
                                                    onChange={(e) => setContactMobile(e.target.value.replace(/\D/g, ""))}
                                                    className="w-full h-10 rounded-xl border border-[#EADCC9] bg-white pl-12 pr-4 text-xs font-semibold text-[#593102] focus:outline-none focus:border-[#D49313] transition shadow-2xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Error Display */}
                                        {formError && (
                                            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-2.5 text-xs font-bold text-red-700 flex items-center gap-2 animate-in fade-in">
                                                <AlertCircle size={15} className="shrink-0 text-red-600" />
                                                <span>{formError}</span>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="pt-1 flex justify-start">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="inline-flex items-center justify-center px-8 h-10 rounded-xl bg-[#593102] hover:bg-[#D49313] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer active:scale-95 disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <span className="inline-flex items-center gap-2">
                                                        <Loader2 size={15} className="animate-spin text-white" />
                                                        Submitting...
                                                    </span>
                                                ) : (
                                                    "Submit"
                                                )}
                                            </button>
                                        </div>

                                    </div>
                                )}

                            </div>

                            {/* RIGHT COLUMN: GET IN TOUCH SUPPORT (RESPONSIVE STICKY WITH HEADER GAP) */}
                            <div className="md:sticky md:top-28 lg:top-32 self-start">
                                <div className="rounded-3xl border-2 border-[#EADCC9]/90 bg-white/95 backdrop-blur-sm p-4 sm:p-5 lg:p-6 shadow-[0_8px_30px_rgb(89,49,2,0.06)] space-y-4">
                                    <div className="border-b border-[#EADCC9]/60 pb-2.5">
                                        <h2 className="font-serif text-lg sm:text-xl font-extrabold text-[#593102] tracking-tight">
                                            Get in Touch
                                        </h2>
                                        <p className="text-xs text-[#8D7F73] mt-0.5 leading-relaxed">
                                            Our customer support team is here to assist you anytime.
                                        </p>
                                    </div>

                                    <div className="space-y-2.5">

                                        {/* 1. Phone Call */}
                                        <a
                                            href={`tel:${displayPhone.replace(/[^0-9+]/g, "")}`}
                                            className="group flex items-center justify-between p-3 rounded-xl bg-[#FAF5EC]/80 hover:bg-[#FAF0DC] border border-[#EADCC9] hover:border-[#D49313]/60 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
                                            title="Click to Call"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9] text-[#D49313] group-hover:scale-105 transition-transform shadow-2xs">
                                                    <Phone size={17} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#8D7F73]">
                                                        Phone Call
                                                    </p>
                                                    <p className="text-xs sm:text-sm font-extrabold text-[#593102] group-hover:text-[#D49313] transition-colors">
                                                        {locationLoading ? "Loading..." : displayPhone}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 pl-2">
                                                <span className="text-[11px] font-bold text-[#8D7F73] group-hover:text-[#593102] transition hidden sm:inline">
                                                    Call Now
                                                </span>
                                                <ExternalLink size={13} className="text-[#8D7F73] group-hover:text-[#593102] transition" />
                                            </div>
                                        </a>

                                        {/* 2. WhatsApp Chat */}
                                        <a
                                            href={`https://wa.me/${displayWhatsApp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                                `Hello ShuddhVeda Team! I need support regarding Order #${orderId}.`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between p-3 rounded-xl bg-[#FAF5EC]/80 hover:bg-emerald-50/70 border border-[#EADCC9] hover:border-emerald-300 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
                                            title="Click to Chat on WhatsApp"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EADCC9] text-[#25D366] group-hover:scale-105 transition-transform shadow-2xs">
                                                    <FaWhatsapp size={19} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#8D7F73]">
                                                        WhatsApp Chat
                                                    </p>
                                                    <p className="text-xs sm:text-sm font-extrabold text-[#593102] group-hover:text-emerald-700 transition-colors">
                                                        {locationLoading ? "Loading..." : displayWhatsApp}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 pl-2">
                                                <span className="text-[11px] font-bold text-[#8D7F73] group-hover:text-emerald-700 transition hidden sm:inline">
                                                    Chat
                                                </span>
                                                <ExternalLink size={13} className="text-[#8D7F73] group-hover:text-emerald-700 transition" />
                                            </div>
                                        </a>

                                        {/* 3. EMAIL ADDRESS */}
                                        <div
                                            onClick={(e) => handleOpenEmail(e)}
                                            className="group flex items-center justify-between p-3 rounded-xl bg-[#FAF5EC]/80 hover:bg-[#FAF0DC] border border-[#EADCC9] hover:border-[#D49313]/60 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
                                            title="Click to send Email (opens Gmail composer directly)"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white border border-[#EADCC9] text-[#D49313] group-hover:scale-105 transition-transform shadow-2xs">
                                                    <Mail size={17} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#8D7F73]">
                                                        Email Address
                                                    </p>
                                                    <p className="text-xs sm:text-sm font-extrabold text-[#593102] group-hover:text-[#D49313] transition-colors truncate">
                                                        {locationLoading ? "Loading..." : displayEmail}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 pl-2">
                                                <span className="text-[11px] font-bold text-[#8D7F73] group-hover:text-[#593102] transition hidden sm:inline">
                                                    Email
                                                </span>
                                                <ExternalLink size={13} className="text-[#8D7F73] group-hover:text-[#593102] transition" />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </form>
                )}
            </div>
        </section>
    );
}
