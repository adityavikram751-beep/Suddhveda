"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
    AUTH_CHANGED_EVENT,
    AuthSession,
    clearSession,
    getInitials,
    getStoredSession,
    API_BASE_URL,
} from "@/lib/auth";
import {
    Package,
    MapPin,
    Heart,
    Settings,
    LogOut,
    Pencil,
    Search,
    Clock,
    Ship,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Crown,
    CheckCircle2,
    Calendar,
    Sparkles,
    ShieldCheck,
    Truck,
    Check,
    Home,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: Crown, label: "Subscription Plans", href: "/account/subscriptions" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Settings, label: "Policy Center", href: "/account/privacy" },
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

interface DeliveryStep {
    jarNumber: number;
    deliveryNumber: number;
    monthName: string;
    title: string;
    season: string;
    description: string;
    image: string;
    scheduledDate?: string;
    orderStatus?: string;
    status: "Delivered" | "In Transit" | "Upcoming" | "Cancelled";
    date?: string;
}

interface SubscriptionPurchase {
    id: string;
    purchaseId: string;
    planName: string;
    customerName: string;
    planImage?: string;
    tagline?: string;
    purchasedOn: string;
    purchasedDateShort?: string;
    purchasedTime?: string;
    paymentMethod: string;
    paymentStatus: string;
    transactionId?: string;
    totalAmount: string;
    status: "Active" | "Completed" | "Processing" | "Cancelled";
    totalWeight?: string;
    jarsCount?: string;
    totalJarsCount: number;
    deliveredJarsCount: number;
    deliveries: DeliveryStep[];
    shippingAddress?: {
        name: string;
        phone: string;
        address: string;
    };
    rawItem?: any;
}

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

// ---------- Sidebar Content Component ----------
function SidebarContent({ userData, onLogout, onLinkClick }: { userData?: any; onLogout?: () => void; onLinkClick?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const fullName = userData?.fullName || getStoredSession()?.user?.name || "ShuddhVeda Customer";
    const email = userData?.email || "Not Provided";
    const mobile = userData?.mobile || userData?.phone || getStoredSession()?.user?.mobile || "";

    const handleNavClick = (e: React.MouseEvent, href: string) => {
        if (onLinkClick) onLinkClick();

        const isPolicyLink = href.startsWith("/account/privacy");
        const isLoggedIn = Boolean(getStoredSession());

        if (!isPolicyLink && !isLoggedIn) {
            e.preventDefault();
            router.push(`/login?redirect=${encodeURIComponent(href)}`);
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 shadow-xs">
                <div className="flex flex-col items-center text-center gap-1.5">
                    <p className="font-serif text-lg font-extrabold text-[#593102] capitalize">
                        {fullName}
                    </p>
                    <p className="text-xs text-[#6E5D4F] font-medium break-all">
                        {email !== "Not Provided" ? email : `+91 ${userData?.mobile || userData?.phone || ""}`}
                    </p>
                    <button className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#D49313] hover:underline cursor-pointer">
                        <Pencil size={12} strokeWidth={2.5} className="inline-block shrink-0" />
                        <Link href="/account/editprofile" onClick={(e) => handleNavClick(e, "/account/editprofile")}>Edit profile</Link>
                    </button>
                </div>
            </div>

            <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 shadow-xs flex flex-col justify-between">
                <nav className="space-y-1.5">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === "/account"
                            ? pathname === "/account" || pathname === "/account/" || pathname?.startsWith("/account/orders")
                            : pathname === link.href || pathname?.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`
                                    relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300
                                    ${isActive
                                        ? "bg-[#FAF0DC] text-[#593102] font-extrabold shadow-xs"
                                        : "text-[#593102] hover:bg-[#FAF5EC] hover:text-[#D49313]"
                                    }
                                `}
                            >
                                <Icon size={18} className={`shrink-0 ${isActive ? "text-[#D49313]" : "text-[#8D7F73]"}`} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-8 pt-4 border-t border-[#EADCC9]/60">
                    <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 cursor-pointer">
                        <LogOut size={18} className="shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MySubscriptionsPage() {
    const router = useRouter();
    const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const plansPerPage = 3;

    // Profile details state
    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        phone: "",
    });

    const [purchasesList, setPurchasesList] = useState<SubscriptionPurchase[]>([]);
    const [loadingPurchases, setLoadingPurchases] = useState<boolean>(true);
    const [expandedSchedules, setExpandedSchedules] = useState<Record<string, boolean>>({});
    const [retryingPurchaseId, setRetryingPurchaseId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const toggleSchedule = (id: string) => {
        setExpandedSchedules((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const sectionRef = useRef<HTMLDivElement>(null);

    const fetchProfileDetails = async () => {
        try {
            const token = getTokenFromCookie();
            const res = await fetch(`${API_BASE_URL}/api/users/profile-details`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (res.ok) {
                const data = await res.json();
                const user = data.data || data.user || data;

                setUserData({
                    fullName: user.name || user.full_name || "",
                    email: user.email || "",
                    mobile: user.mobile || user.phone || "",
                    phone: user.mobile || user.phone || "",
                });
            }
        } catch (err) {
            console.error("Error fetching profile details:", err);
        }
    };

    const fetchMyPurchases = async () => {
        try {
            setLoadingPurchases(true);
            const token = getTokenFromCookie();
            const res = await fetch(`${API_BASE_URL}/api/purchase-plans/my-purchases`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (res.ok) {
                const data = await res.json();
                const rawList = Array.isArray(data.data)
                    ? data.data
                    : Array.isArray(data.purchases)
                        ? data.purchases
                        : Array.isArray(data.myPurchases)
                            ? data.myPurchases
                            : Array.isArray(data)
                                ? data
                                : [];

                const mapped: SubscriptionPurchase[] = rawList.map((item: any, idx: number) => {
                    const planObj = item.plan || item.planId || item.purchasePlan || item;
                    const name = planObj.name || item.planName || item.title || "Family Plan";
                    const planImg = planObj.plan_image || planObj.image || planObj.image_url || planObj.img || item.plan_image || item.image || "/natural.webp";
                    const tagline = planObj.description || planObj.packageLabel || item.tagline || `${planObj.numberOfJars || 6} Jars Honey Box`;
                    const dateStr = item.createdAt || item.purchasedAt || item.purchaseDate || item.date || new Date().toISOString();
                    const dateObj = new Date(dateStr);
                    const formattedDate = dateObj.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    });
                    const formattedDateShort = dateObj.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                    });
                    const formattedTime = dateObj.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    }).toLowerCase();

                    const rawPayMethod = String(item.paymentMethod || item.payment_mode || item.paymentType || "NETBANKING").toUpperCase();
                    const rawPayStatus = String(item.paymentStatus || item.payment_status || "captured").toLowerCase();
                    const payMethodFormatted = `${rawPayMethod} (${rawPayStatus})`;
                    const amountVal = Number(item.amount || item.price || item.totalAmount || item.finalAmount || planObj.price || 4299);

                    const statusRaw = String(item.status || "Active").toLowerCase();
                    let status: "Active" | "Completed" | "Processing" | "Cancelled" = "Active";
                    if (statusRaw.includes("complet") || statusRaw.includes("deliver")) status = "Completed";
                    else if (statusRaw.includes("cancel")) status = "Cancelled";
                    else if (statusRaw.includes("pend") || statusRaw.includes("process") || statusRaw.includes("fail") || rawPayStatus.includes("fail") || rawPayStatus.includes("pend")) status = "Processing";

                    const addrObj = item.shippingAddress || item.shipping_address || item.address || {};
                    const addrName = addrObj.full_name || addrObj.name || item.name || "";
                    const addrPhone = addrObj.phone || addrObj.phone_number || item.phone || "";
                    const addrLines = [
                        addrObj.address_line1 || addrObj.line1 || "",
                        addrObj.address_line2 || addrObj.line2 || "",
                        [addrObj.city, addrObj.state].filter(Boolean).join(", "),
                        [addrObj.pincode, addrObj.country].filter(Boolean).join("-"),
                    ].filter(Boolean).join(", ");

                    let pId = item.purchase_id || item.purchaseId || item.orderId;
                    if (!pId) {
                        const dateCode = dateObj.getFullYear().toString() + String(dateObj.getMonth() + 1).padStart(2, "0") + String(dateObj.getDate()).padStart(2, "0");
                        const itemHex = item._id ? String(item._id).slice(-8).toUpperCase() : `627C853B`;
                        pId = `PP-${dateCode}-${itemHex}`;
                    }

                    const numDeliveries = 3;

                    let deliveredCount = Number(
                        item.completedDeliveries !== undefined
                            ? item.completedDeliveries
                            : item.deliveredJars !== undefined
                                ? item.deliveredJars
                                : item.deliveredCount !== undefined
                                    ? item.deliveredCount
                                    : (status === "Completed" ? 3 : 0)
                    );

                    if (status === "Cancelled") {
                        deliveredCount = 0;
                    }

                    const apiDeliveries = Array.isArray(item.deliveries)
                        ? item.deliveries
                        : Array.isArray(item.shipments)
                            ? item.shipments
                            : Array.isArray(item.deliveryOrders)
                                ? item.deliveryOrders
                                : Array.isArray(item.planDeliveries)
                                    ? item.planDeliveries
                                    : [];

                    const deliveriesList: DeliveryStep[] = [];

                    if (apiDeliveries.length > 0) {
                        apiDeliveries.forEach((customDev: any, idx: number) => {
                            const dNum = customDev.deliveryNumber || customDev.delivery_number || customDev.step || (idx + 1);
                            const monthName = customDev.monthName || customDev.month || `Delivery ${dNum}`;
                            const title = customDev.title || customDev.harvestTitle || customDev.name || customDev.productName || `Delivery ${dNum}`;
                            const season = customDev.season || customDev.harvestTitle || "";
                            const description = customDev.description || customDev.readMore || "";
                            const devImg = customDev.image || customDev.image_url || customDev.url || planImg || "";

                            const rawDevOrderStatus = customDev.orderId?.order_status || customDev.order_status || customDev.status || "";
                            const isCancelled = String(rawDevOrderStatus).toLowerCase().includes("cancel") || String(item.status || "").toLowerCase().includes("cancel");

                            let stepStatus: "Delivered" | "In Transit" | "Upcoming" | "Cancelled" = "Upcoming";

                            if (isCancelled) {
                                stepStatus = "Cancelled";
                            } else {
                                const devStatusLower = String(rawDevOrderStatus).toLowerCase();
                                if (devStatusLower.includes("deliver") || devStatusLower.includes("complet")) {
                                    stepStatus = "Delivered";
                                } else if (devStatusLower.includes("transit") || devStatusLower.includes("process") || devStatusLower.includes("active") || dNum <= (item.currentDeliveryNumber || 1)) {
                                    stepStatus = (dNum <= deliveredCount && deliveredCount > 0) ? "Delivered" : "In Transit";
                                } else {
                                    stepStatus = (dNum <= deliveredCount && deliveredCount > 0) ? "Delivered" : dNum === (item.currentDeliveryNumber || 1) ? "In Transit" : "Upcoming";
                                }
                            }

                            const scheduledDateRaw = customDev.scheduledDate || customDev.deliveredAt || customDev.deliveryDate || customDev.createdAt;
                            let formattedSchedDate = "";
                            if (scheduledDateRaw) {
                                try {
                                    const dt = new Date(scheduledDateRaw);
                                    formattedSchedDate = dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                                } catch (e) {
                                    formattedSchedDate = String(scheduledDateRaw);
                                }
                            }

                            deliveriesList.push({
                                jarNumber: dNum,
                                deliveryNumber: dNum,
                                monthName,
                                title,
                                season,
                                description,
                                image: devImg,
                                scheduledDate: formattedSchedDate,
                                orderStatus: rawDevOrderStatus || undefined,
                                status: stepStatus,
                                date: formattedSchedDate || formattedDateShort,
                            });
                        });
                    }

                    const custName = item.customerName || item.customer?.name || item.name || addrName || "Subscriber";
                    const totalDevCount = deliveriesList.length;

                    const weightText = planObj.totalQuantity ? `Total ${planObj.totalQuantity}${planObj.totalQuantityUnit || 'kg'}` : (item.totalWeight || "");
                    const totalDevs = item.totalDeliveries || item.totalDeliveriesCount || totalDevCount;
                    const jarsText = totalDevs > 0 ? `${totalDevs} ${totalDevs === 1 ? 'Delivery' : 'Deliveries'} Pack` : "";

                    return {
                        id: String(item._id || item.id || `SUB-${idx + 1}`),
                        purchaseId: String(pId),
                        planName: name,
                        customerName: custName,
                        planImage: planImg,
                        tagline: planObj.description || item.tagline || "",
                        purchasedOn: formattedDate,
                        purchasedDateShort: formattedDateShort,
                        purchasedTime: formattedTime,
                        paymentMethod: payMethodFormatted,
                        paymentStatus: rawPayStatus,
                        transactionId: item.transactionId || item.razorpay_payment_id || item.paymentId || undefined,
                        totalAmount: amountVal > 0 ? `₹${amountVal.toLocaleString("en-IN")}` : "₹0",
                        status: status,
                        totalWeight: weightText,
                        jarsCount: jarsText,
                        totalJarsCount: totalDevCount,
                        deliveredJarsCount: deliveredCount,
                        deliveries: deliveriesList,
                        shippingAddress: (addrName || addrLines) ? {
                            name: addrName,
                            phone: addrPhone,
                            address: addrLines,
                        } : undefined,
                        rawItem: item,
                    };
                });

                setPurchasesList(mapped);
            }
        } catch (err) {
            console.error("Error fetching my-purchases:", err);
        } finally {
            setLoadingPurchases(false);
        }
    };

    const handleRetryPlanPayment = async (purchase: SubscriptionPurchase) => {
        const targetId = purchase.rawItem?.plan_purchase_id || purchase.rawItem?._id || purchase.rawItem?.id || purchase.rawItem?.purchase_id || purchase.purchaseId || purchase.id;
        if (!targetId) {
            setToastMessage({ type: "error", text: "Subscription ID not found." });
            setTimeout(() => setToastMessage(null), 4000);
            return;
        }

        try {
            setRetryingPurchaseId(purchase.id);
            const token = getTokenFromCookie();

            const response = await fetch(`${API_BASE_URL}/api/purchase-plans/retry-plan-payment`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-Tunnel-Skip-Anti-Phishing-Page": "true",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    plan_purchase_id: targetId,
                    purchase_id: targetId,
                    id: targetId,
                    purchaseId: targetId,
                    planPurchaseId: targetId,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok || (data && (data.success === false || data.status === "failed"))) {
                const err = data?.message || data?.error || data?.msg || "Failed to initiate subscription payment retry.";
                setToastMessage({ type: "error", text: typeof err === "string" ? err : JSON.stringify(err) });
                return;
            }

            const resData = data?.data || data?.razorpay || data || {};

            // 1. Check if redirect/checkout URL is returned
            const payUrl = resData?.payment_url || resData?.url || resData?.checkout_url || resData?.redirectUrl || data?.payment_url || data?.url;
            if (payUrl) {
                window.location.href = payUrl;
                return;
            }

            // 2. Check if Razorpay details are returned
            const key = resData.key_id || resData.key || data?.key_id || data?.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            const rzpOrderId = resData.razorpay_order_id || resData.order_id || resData.id || data?.order_id || data?.razorpay_order_id;
            const amount = resData.amount || data?.amount;
            const currency = resData.currency || data?.currency || "INR";
            const customerObj = resData.customer || data?.customer || {};
            const planObj = resData.plan || data?.plan || {};

            if (key && rzpOrderId && typeof window !== "undefined") {
                await loadRazorpayScript();
                if ((window as any).Razorpay) {
                    const options = {
                        key: key,
                        amount: amount,
                        currency: currency,
                        name: "ShuddhVeda Honey",
                        description: `${planObj.name || purchase.planName} Payment Retry`,
                        order_id: rzpOrderId,
                        handler: function (res: any) {
                            setToastMessage({ type: "success", text: "Subscription payment completed successfully!" });
                            setTimeout(() => window.location.reload(), 1500);
                        },
                        prefill: {
                            name: customerObj.name || purchase.customerName || purchase.shippingAddress?.name || "",
                            email: customerObj.email || "",
                            contact: customerObj.mobile || customerObj.phone || purchase.shippingAddress?.phone || "",
                        },
                        theme: { color: "#FA4B1B" },
                    };
                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();
                    return;
                }
            }

            // 3. Fallback message or reload
            if (data?.message) {
                setToastMessage({ type: "success", text: data.message });
            } else {
                setToastMessage({ type: "success", text: "Payment retry response received." });
            }
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            console.error("Retry plan payment error:", err);
            setToastMessage({ type: "error", text: err.message || "An error occurred while retrying payment." });
        } finally {
            setRetryingPurchaseId(null);
            setTimeout(() => setToastMessage(null), 4000);
        }
    };

    useEffect(() => {
        function syncSession() {
            setSession(getStoredSession());
        }

        window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
        window.addEventListener("storage", syncSession);
        fetchProfileDetails();
        fetchMyPurchases();

        return () => {
            window.removeEventListener(AUTH_CHANGED_EVENT, syncSession);
            window.removeEventListener("storage", syncSession);
        };
    }, []);

    useEffect(() => {
        if (!session) {
            router.replace("/login");
        }
    }, [router, session]);



    async function logout() {
        try {
            await fetch(`${API_BASE_URL}/api/users/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("Logout API error", e);
        }
        clearSession();
        setSession(null);
        router.push("/login");
    }

    if (!session) {
        return (
            <section className="min-h-[60vh] bg-[#FFF8EF] px-4 py-16">
                <div className="mx-auto h-24 max-w-sm animate-pulse rounded-2xl bg-white" />
            </section>
        );
    }

    // Filter purchases by search term
    const filteredPurchases = purchasesList.filter((item) => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;
        return (
            item.planName.toLowerCase().includes(search) ||
            item.purchaseId.toLowerCase().includes(search) ||
            item.status.toLowerCase().includes(search) ||
            (item.transactionId && item.transactionId.toLowerCase().includes(search))
        );
    });

    const totalItems = filteredPurchases.length;
    const totalPages = Math.ceil(totalItems / plansPerPage);
    const startIndex = (currentPage - 1) * plansPerPage;
    const endIndex = startIndex + plansPerPage;
    const currentPurchases = filteredPurchases.slice(startIndex, endIndex);

    const statusBadgeStyles = {
        Active: "bg-emerald-100 border border-emerald-300 text-emerald-800",
        Processing: "bg-emerald-100 border border-emerald-300 text-emerald-800",
        Completed: "bg-green-100 border border-green-300 text-green-800",
        Cancelled: "bg-red-100 border border-red-300 text-red-800",
    };

    return (
        <section ref={sectionRef} className="relative min-h-screen bg-[#FFF8EF] pb-8 pt-0 lg:pt-12">
            {/* MOBILE STICKY BAR */}
            <div
                className="z-30 bg-[#FFF8EF]/95 backdrop-blur-md py-2.5 px-4 lg:hidden border-b border-[#F0E2CC] shadow-xs sticky top-[96px]"
            >
                <div className="mx-auto max-w-[1480px] flex items-center justify-between rounded-2xl border border-[#F0E2CC] bg-white p-3 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBE4B8] text-sm font-bold text-[#593102]">
                            {getInitials({
                                name: userData.fullName || session.user.name || "Customer",
                                mobile: userData?.mobile || session.user?.mobile || ""
                            })}
                        </div>
                        <div>
                            <p className="font-serif text-sm font-bold text-[#3C2015] capitalize">
                                {userData.fullName || session.user.name || "Shuddhveda Customer"}
                            </p>
                            <p className="text-xs text-[#B59A78]">Subscription Plans</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex h-10 items-center gap-2 rounded-xl bg-[#593102] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#C98715] transition cursor-pointer"
                    >
                        <Menu size={16} />
                        Menu
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-4 lg:pt-0">
                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md lg:hidden animate-in fade-in duration-300 transition-all touch-none overscroll-contain"
                        onClick={() => setMobileMenuOpen(false)}
                        onTouchMove={(e) => {
                            if (e.target === e.currentTarget) e.preventDefault();
                        }}
                    >
                        <div
                            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[330px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] shadow-[0_0_40px_rgba(89,49,2,0.25)] rounded-r-[28px] border-r-2 border-[#D49313]/40 overflow-y-auto flex flex-col animate-in slide-in-from-left duration-300 overscroll-contain touch-pan-y"
                            onClick={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-[#FFFDF9]/95 backdrop-blur-md z-10 flex items-center justify-between p-4 px-5 border-b border-[#EADCC9]/80 shadow-2xs">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF0DC] text-[#D49313] border border-[#D49313]/30">
                                        <Crown size={16} />
                                    </div>
                                    <h3 className="font-serif text-base font-extrabold text-[#593102] tracking-tight">Subscription Plans</h3>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-full p-2 bg-[#FAF0DC] hover:bg-[#D49313] text-[#593102] hover:text-white transition-all shadow-2xs cursor-pointer active:scale-95"
                                    aria-label="Close menu"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 pt-3" onClick={() => setMobileMenuOpen(false)}>
                                <SidebarContent userData={userData} onLogout={logout} onLinkClick={() => setMobileMenuOpen(false)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] items-start relative">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-[240px] xl:w-[260px] shrink-0 sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto z-20">
                        <SidebarContent userData={userData} onLogout={logout} />
                    </aside>

                    {/* Main Content Area */}
                    <main className="space-y-6 min-w-0 relative">
                        {toastMessage && (
                            <div
                                className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl text-xs font-bold transition-all animate-in fade-in slide-in-from-top-4 ${
                                    toastMessage.type === "success"
                                        ? "bg-[#10B981] text-white"
                                        : "bg-[#EF4444] text-white"
                                }`}
                            >
                                <span>{toastMessage.text}</span>
                                <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80 cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        {/* Page Header Banner */}
                        <div className="rounded-3xl border border-[#EADCC9] bg-gradient-to-r from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] p-6 sm:p-8 shadow-xs relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#D49313]/10 rounded-full blur-2xl pointer-events-none" />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                <div>
                                    <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#593102] tracking-tight">
                                        Subscription Plans
                                    </h1>
                                    <p className="text-xs sm:text-sm text-[#7A5C3E] font-medium mt-1">
                                        View and manage your active honey membership packages &amp; periodic harvest deliveries.
                                    </p>
                                </div>
                                <Link
                                    href="/subscribe"
                                    className="inline-flex items-center justify-center px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#FA4B1B] hover:bg-[#E64216] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer border border-white/20 self-start sm:self-auto"
                                >
                                    <span>EXPLORE NEW PLANS</span>
                                </Link>
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-[#EADCC9] bg-white p-3.5 sm:p-4 shadow-xs">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D7F73]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by plan, transaction ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-2xl border border-[#EADCC9] bg-[#FFFDF9] py-2.5 pl-10 pr-4 text-xs font-semibold text-[#593102] placeholder-[#A08E7E] focus:border-[#D49313] focus:outline-none focus:ring-1 focus:ring-[#D49313]"
                                />
                            </div>

                            <div className="text-xs font-bold text-[#7A5C3E] self-start sm:self-center px-1 sm:px-0">
                                Showing {filteredPurchases.length} {filteredPurchases.length === 1 ? "Subscription" : "Subscriptions"}
                            </div>
                        </div>

                        {/* Purchases List */}
                        {loadingPurchases ? (
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-44 w-full animate-pulse rounded-3xl bg-white border border-[#EADCC9]" />
                                ))}
                            </div>
                        ) : filteredPurchases.length === 0 ? (
                            <div className="rounded-3xl border border-[#EADCC9] bg-white p-8 sm:p-12 text-center shadow-xs">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF0DC] text-[#D49313] border border-[#D49313]/20 shadow-xs">
                                    <Crown size={32} />
                                </div>
                                <h3 className="font-serif text-xl font-extrabold text-[#593102]">
                                    No Active Subscriptions Found
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm font-semibold text-[#8D7F73]">
                                    {searchTerm
                                        ? `No subscription plans match "${searchTerm}". Try clearing your search.`
                                        : "You have not subscribed to any honey delivery plans yet. Subscribe today to receive regular fresh harvests at discounted member rates!"}
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/subscribe"
                                        className="inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#FA4B1B] hover:bg-[#E64216] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
                                    >
                                        <span>EXPLORE NEW PLANS</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {currentPurchases.map((purchase) => {
                                    const isCompleted = purchase.status === "Completed";
                                    const isCancelled = purchase.status === "Cancelled";
                                    const isProcessing = purchase.status === "Processing";

                                    return (
                                        <div
                                            key={purchase.id}
                                            className="overflow-hidden rounded-3xl border-2 border-[#EADCC9]/90 bg-white shadow-xs hover:border-[#D49313]/60 transition-all duration-300"
                                        >
                                            {/* Subscription Header - matching Image 2 */}
                                            <div className="flex flex-row items-center justify-between gap-3 border-b border-[#F0E4D0] bg-[#FFFDF9] px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF0DC] text-[#D49313] border border-[#EADCC9] shadow-2xs">
                                                        <Crown size={22} className="text-[#D49313]" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#8D7F73] font-mono block truncate" title={purchase.purchaseId}>
                                                            ID: {purchase.purchaseId}
                                                        </span>
                                                        <p className="font-serif text-base sm:text-xl font-black text-[#593102] truncate mt-0.5">
                                                            Purchased on {purchase.purchasedOn}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center shrink-0">
                                                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${
                                                        isCancelled
                                                            ? "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]"
                                                            : "bg-[#E6F9F3] text-[#00A86B] border-[#A3EAD2]"
                                                    }`}>
                                                        <CheckCircle2 size={14} className={isCancelled ? "text-[#DC2626]" : "text-[#00A86B]"} />
                                                        {purchase.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Subscription Details Body - matching Image 2 */}
                                            <div className="p-4 sm:p-6 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                                    {/* Plan Image + Info */}
                                                    <div className="md:col-span-7 flex items-start gap-4">
                                                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-[#EADCC9] bg-[#FFFDF9] shadow-xs">
                                                            <Image
                                                                src={purchase.planImage || "/natural.webp"}
                                                                alt={purchase.planName}
                                                                fill
                                                                className="object-cover object-center"
                                                                unoptimized={Boolean(purchase.planImage && purchase.planImage.startsWith("http"))}
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <h4 className="font-serif text-xl sm:text-2xl font-black text-[#593102] leading-tight">
                                                                {purchase.planName}
                                                            </h4>
                                                            <p className="text-xs sm:text-sm font-semibold text-[#8D7F73]">
                                                                {purchase.tagline || "250 g × 6 Jars"}
                                                            </p>

                                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                                {purchase.totalWeight && (
                                                                    <span className="inline-flex items-center text-xs font-bold text-[#593102] bg-[#FAF0DC] px-3 py-1 rounded-xl border border-[#D49313]/20">
                                                                        {purchase.totalWeight}
                                                                    </span>
                                                                )}
                                                                {purchase.jarsCount && (
                                                                    <span className="inline-flex items-center text-xs font-bold text-[#593102] bg-[#FAF0DC] px-3 py-1 rounded-xl border border-[#D49313]/20">
                                                                        {purchase.jarsCount}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Pricing & Payment Info */}
                                                    <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[#F0E4D0] pt-4 md:pt-0 md:pl-6 space-y-2.5">
                                                        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#6E5D4F]">
                                                            <span>Amount Paid:</span>
                                                            <span className="font-serif text-lg sm:text-xl font-black text-[#593102]">
                                                                {purchase.totalAmount}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#6E5D4F]">
                                                            <span>Payment Method:</span>
                                                            <span className="font-extrabold text-[#593102]">
                                                                {purchase.paymentMethod}
                                                            </span>
                                                        </div>

                                                        {purchase.transactionId && (
                                                            <div className="flex items-center justify-between text-xs font-semibold text-[#6E5D4F]">
                                                                <span>Transaction ID:</span>
                                                                <span className="font-mono text-[11px] font-bold text-[#8D7F73]">
                                                                    {purchase.transactionId}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {isProcessing && (
                                                            <div className="pt-3">
                                                                <button
                                                                    onClick={() => handleRetryPlanPayment(purchase)}
                                                                    disabled={retryingPurchaseId === purchase.id}
                                                                    className="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FA4B1B] hover:bg-[#E64216] text-white shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                                                                >
                                                                    {retryingPurchaseId === purchase.id ? (
                                                                        <>
                                                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                                            <span>Processing...</span>
                                                                        </>
                                                                    ) : (
                                                                        <span>PAY AGAIN</span>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Deliveries Schedule Section */}
                                                {(() => {
                                                    const isScheduleOpen = Boolean(expandedSchedules[purchase.id]);
                                                    return (
                                                        <div className="pt-6 border-t border-[#F0E4D0]">
                                                            <div
                                                                onClick={() => toggleSchedule(purchase.id)}
                                                                className="flex items-center justify-between gap-2 mb-4 p-2 -mx-2 rounded-2xl cursor-pointer hover:bg-[#FAF0DC]/50 transition-all select-none group"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Package size={18} className="text-[#D49313] group-hover:scale-110 transition-transform shrink-0" />
                                                                    <span className="font-serif text-base sm:text-lg font-extrabold text-[#593102]">
                                                                        Delivery Schedule ({purchase.deliveries.length} {purchase.deliveries.length === 1 ? 'Delivery' : 'Deliveries'})
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2.5">
                                                                    <span className="text-xs font-bold text-[#8D7F73]">
                                                                        {purchase.deliveredJarsCount} of {purchase.deliveries.length} Delivered
                                                                    </span>
                                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF0DC] text-[#593102] group-hover:bg-[#D49313] group-hover:text-white transition-all shadow-2xs">
                                                                        {isScheduleOpen ? (
                                                                            <ChevronUp size={16} strokeWidth={2.5} />
                                                                        ) : (
                                                                            <ChevronDown size={16} strokeWidth={2.5} />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Dynamic Grid Layout based on number of deliveries */}
                                                            {isScheduleOpen && (
                                                                <div className={`grid gap-4 sm:gap-5 w-full transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                                                                    purchase.deliveries.length === 1
                                                                        ? "grid-cols-1 max-w-xl"
                                                                        : purchase.deliveries.length === 2
                                                                        ? "grid-cols-1 md:grid-cols-2"
                                                                        : "grid-cols-1 md:grid-cols-3"
                                                                }`}>
                                                                    {purchase.deliveries.map((step) => {
                                                                        const isDelivered = step.status === "Delivered";
                                                                        const isInTransit = step.status === "In Transit";
                                                                        const isCancelled = step.status === "Cancelled";

                                                                        return (
                                                                            <div
                                                                                key={step.deliveryNumber}
                                                                                className={`relative rounded-2xl border p-4 transition-all flex flex-col justify-between w-full ${
                                                                                    isDelivered
                                                                                        ? "bg-[#F2FBF7] border-[#A3EAD2]"
                                                                                        : isInTransit
                                                                                        ? "bg-[#F2FBF7] border-[#A3EAD2] shadow-xs"
                                                                                        : isCancelled
                                                                                        ? "bg-[#FFF5F5] border-[#F8B4B4]"
                                                                                        : "bg-[#FFFDF9] border-[#EADCC9]"
                                                                                }`}
                                                                            >
                                                                                {/* Header Info */}
                                                                                <div>
                                                                                    <div className="flex items-center justify-between pb-3 border-b border-[#EADCC9]/60 gap-2">
                                                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                                            <span className="font-serif font-black text-sm text-[#593102] shrink-0">
                                                                                                Delivery {step.deliveryNumber}
                                                                                            </span>
                                                                                            {step.monthName && (
                                                                                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF0DC] text-[#593102] uppercase tracking-wider truncate">
                                                                                                    {step.monthName}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>

                                                                                        <span
                                                                                            className={`inline-flex items-center text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shrink-0 ${
                                                                                                isDelivered || isInTransit
                                                                                                    ? "bg-[#E6F9F3] text-[#00A86B] border border-[#A3EAD2]"
                                                                                                    : isCancelled
                                                                                                    ? "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]"
                                                                                                    : "bg-[#FAF4EB] text-[#8C7765] border border-[#E8DEC9]"
                                                                                            }`}
                                                                                        >
                                                                                            {step.status}
                                                                                        </span>
                                                                                    </div>

                                                                                    {/* Image + Title + Season Details */}
                                                                                    <div className="flex items-start gap-3.5 mt-3.5">
                                                                                        {step.image && (
                                                                                            <div className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden border border-[#EADCC9] bg-white shadow-2xs">
                                                                                                <Image
                                                                                                    src={step.image}
                                                                                                    alt={step.title}
                                                                                                    fill
                                                                                                    className="object-cover object-center"
                                                                                                    unoptimized={Boolean(step.image.startsWith("http"))}
                                                                                                />
                                                                                            </div>
                                                                                        )}

                                                                                        <div className="min-w-0 flex-1">
                                                                                            {step.season && (
                                                                                                <p className="text-xs font-bold text-[#D49313] uppercase tracking-wider">
                                                                                                    {step.season}
                                                                                                </p>
                                                                                            )}
                                                                                            <h5 className="font-serif text-sm sm:text-base font-extrabold text-[#593102] leading-snug line-clamp-2 mt-0.5" title={step.title}>
                                                                                                {step.title}
                                                                                            </h5>
                                                                                            {step.description && (
                                                                                                <p className="text-[11px] sm:text-xs text-[#7A5C3E] line-clamp-2 mt-1 font-medium leading-relaxed">
                                                                                                    {step.description}
                                                                                                </p>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Footer Info Row */}
                                                                                <div className="mt-3.5 pt-2.5 border-t border-[#EADCC9]/50 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#8D7F73]">
                                                                                    {step.scheduledDate ? (
                                                                                        <span>Scheduled: <strong className="text-[#593102]">{step.scheduledDate}</strong></span>
                                                                                    ) : (
                                                                                        <span>Seasonal Delivery</span>
                                                                                    )}

                                                                                    {step.orderStatus && (() => {
                                                                                        const rawOrd = String(step.orderStatus || "").replace(/_/g, " ");
                                                                                        const formattedOrd = rawOrd.replace(/\b\w/g, (c) => c.toUpperCase());
                                                                                        const ordLower = rawOrd.toLowerCase();

                                                                                        let ordBadgeStyle = "bg-[#FAF0DC] text-[#593102] border-[#EADCC9]";
                                                                                        if (
                                                                                            ordLower.includes("ready") ||
                                                                                            ordLower.includes("pickup") ||
                                                                                            ordLower.includes("deliver") ||
                                                                                            ordLower.includes("complet") ||
                                                                                            ordLower.includes("active")
                                                                                        ) {
                                                                                            ordBadgeStyle = "bg-[#E6F9F3] text-[#00A86B] border-[#A3EAD2]";
                                                                                        } else if (
                                                                                            ordLower.includes("transit") ||
                                                                                            ordLower.includes("ship") ||
                                                                                            ordLower.includes("dispatch") ||
                                                                                            ordLower.includes("process")
                                                                                        ) {
                                                                                            ordBadgeStyle = "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]";
                                                                                        } else if (ordLower.includes("cancel") || ordLower.includes("fail")) {
                                                                                            ordBadgeStyle = "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]";
                                                                                        }

                                                                                        return (
                                                                                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${ordBadgeStyle}`}>
                                                                                                Order: {formattedOrd}
                                                                                            </span>
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}

                                                {/* Shipping Address Footer if available */}
                                                {purchase.shippingAddress && (
                                                    <div className="pt-4 border-t border-[#F0E4D0] text-xs text-[#6E5D4F] flex items-start gap-2">
                                                        <MapPin size={15} className="text-[#D49313] shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="font-bold text-[#593102]">Delivery Address: </span>
                                                            <span>{purchase.shippingAddress.name} ({purchase.shippingAddress.phone}) - {purchase.shippingAddress.address}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EADCC9] bg-white text-[#593102] disabled:opacity-40 hover:bg-[#FAF0DC] transition"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition ${currentPage === p
                                            ? "bg-[#593102] text-white shadow-xs"
                                            : "border border-[#EADCC9] bg-white text-[#593102] hover:bg-[#FAF0DC]"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EADCC9] bg-white text-[#593102] disabled:opacity-40 hover:bg-[#FAF0DC] transition"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
}
