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
} from "@/lib/auth";
import { API_BASE_URL } from "@/lib/auth";
import {
    CheckCircle2,
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
    Crown,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: Crown, label: "Subscription Plans", href: "/account/subscriptions" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

type OrderStatus = "Processing" | "Delivered" | "Shipped" | "Cancelled" | "Pending";

interface OrderItem {
    title: string;
    sub: string;
    qty: number;
    price: string;
    image: string;
}

interface ShippingAddress {
    name: string;
    phone: string;
    address: string;
}

interface Order {
    id: string;
    orderId: string;
    orderedOn: string;
    paymentMethod: string;
    paymentStatus: string;
    transactionId?: string;
    items: OrderItem[];
    subtotal: string;
    shippingFee: string;
    totalAmount: string;
    status: OrderStatus;
    statusNote: string;
    shippingAddress?: ShippingAddress;
}

// Desktop Header Constants
const HEADER_HEIGHT = 96;
const TOP_GAP = 16;
const HEADER_OFFSET = HEADER_HEIGHT + TOP_GAP;
const BOTTOM_GAP = 24;

// Helper to get token from cookie
function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
}

// ---------- More Orders Data ----------
const allOrders: Order[] = [
    {
        id: "1",
        orderId: "SVN1256789",
        orderedOn: "12 May, 2024",
        paymentMethod: "UPI",
        paymentStatus: "Paid",
        transactionId: "TXN9849201",
        items: [
            {
                title: "Wild Forest Honey",
                sub: "500g",
                qty: 1,
                price: "₹1,549",
                image: "/Upcoming.png",
            },
        ],
        subtotal: "₹1,549",
        shippingFee: "Free",
        totalAmount: "₹1,549",
        status: "Processing",
        statusNote: "Your order is being processed",
    },
    {
        id: "2",
        orderId: "SVN1245601",
        orderedOn: "12 May, 2024",
        paymentMethod: "UPI",
        paymentStatus: "Paid",
        items: [
            {
                title: "Natural Honey",
                sub: "750g",
                qty: 1,
                price: "₹899",
                image: "/Upcoming.png",
            },
        ],
        subtotal: "₹899",
        shippingFee: "Free",
        totalAmount: "₹899",
        status: "Delivered",
        statusNote: "Delivered on 15 May, 2024",
    },
];

const statusStyles: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
    Processing: { bg: "bg-emerald-100 border border-emerald-300", text: "text-emerald-800", icon: Clock },
    Pending: { bg: "bg-emerald-100 border border-emerald-300", text: "text-emerald-800", icon: Clock },
    Delivered: { bg: "bg-green-100 border border-green-300", text: "text-green-800", icon: CheckCircle2 },
    Shipped: { bg: "bg-blue-100 border border-blue-300", text: "text-blue-800", icon: Ship },
    Cancelled: { bg: "bg-red-100 border border-red-300", text: "text-red-800", icon: X },
};

function OrderActions({ order }: { order: Order }) {
    if (order.status === "Cancelled") {
        return (
            <div className="flex w-full flex-col gap-2 sm:w-44">
                <span className="flex h-9 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-500 border border-gray-200">
                    Cancelled
                </span>
            </div>
        );
    }

    if (order.status === "Processing" || order.status === "Pending") {
        return (
            <div className="flex w-full flex-col sm:flex-col gap-2 sm:w-44">
                <Link
                    href="/trackorder"
                    className="flex h-10 sm:h-9 w-full items-center justify-center rounded-xl bg-[#F24E1E] hover:bg-[#D93F13] text-xs font-extrabold text-white transition shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                >
                    Track Order
                </Link>
                <Link
                    href={`/account/orders/${order.orderId}`}
                    className="flex h-10 sm:h-9 w-full items-center justify-center rounded-xl border border-[#593102] text-xs font-extrabold text-[#593102] hover:bg-[#FFF8EF] transition cursor-pointer active:scale-95 whitespace-nowrap"
                >
                    View Details
                </Link>
            </div>
        );
    }

    if (order.status === "Delivered") {
        return (
            <div className="flex w-full flex-col gap-2 sm:w-44">
                <Link
                    href={`/account/orders/${order.orderId}`}
                    className="flex h-10 sm:h-9 w-full items-center justify-center rounded-xl bg-[#593102] text-xs font-bold text-white hover:bg-[#C98715] transition shadow-xs whitespace-nowrap"
                >
                    View Details
                </Link>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-2 sm:w-44">
            <Link
                href="/trackorder"
                className="flex h-10 sm:h-9 w-full items-center justify-center rounded-xl bg-[#F24E1E] hover:bg-[#D93F13] text-xs font-extrabold text-white shadow-xs transition cursor-pointer active:scale-95 whitespace-nowrap"
            >
                Track Shipment
            </Link>
            <Link
                href={`/account/orders/${order.orderId}`}
                className="flex h-10 sm:h-9 w-full items-center justify-center rounded-xl border border-[#D49313] text-xs font-bold text-[#593102] hover:bg-[#FAF0DC] transition-colors whitespace-nowrap"
            >
                View Details
            </Link>
        </div>
    );
}

// ---------- Sidebar Content Component ----------
function SidebarContent({ userData, onLogout, onLinkClick }: { userData?: any; onLogout?: () => void; onLinkClick?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const fullName = userData?.fullName || getStoredSession()?.user?.name || "ShuddhVeda Customer";
    const email = userData?.email || "Not Provided";
    const mobile = userData?.mobile || userData?.phone || getStoredSession()?.user?.mobile || "";
    const initials = getInitials({ name: fullName, mobile });

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

export default function MyOrdersPage() {
    const router = useRouter();
    const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3;

    // Profile details state
    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        phone: "",
    });

    // JS-driven sticky sidebar refs & state
    const rowRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});
    const [sidebarPinned, setSidebarPinned] = useState(false);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);

    // JS-driven "unstick near footer" logic for the mobile fixed bar
    const sectionRef = useRef<HTMLDivElement>(null);
    const mobileBarRef = useRef<HTMLDivElement>(null);
    const [mobileBarStyle, setMobileBarStyle] = useState<React.CSSProperties>({
        position: "fixed",
        top: 98,
        left: 0,
        right: 0,
    });
    const MOBILE_BAR_TOP_OFFSET = 98;

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

    const [ordersList, setOrdersList] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

    const fetchMyOrders = async () => {
        try {
            setLoadingOrders(true);
            const token = getTokenFromCookie();
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

                const mappedOrders: Order[] = [];

                rawList.forEach((group: any, gIdx: number) => {
                    const groupOrderId = String(
                        group.order_id || group.group_id || group.orderId || group._id || `ORD-${gIdx + 1}`
                    );
                    const groupCreatedAt = group.createdAt || group.created_at || group.date || new Date().toISOString();
                    const formattedDate = new Date(groupCreatedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    });

                    // Payment details
                    const paymentMethodRaw = String(group.payment_mode || group.paymentMethod || group.payment_type || "COD");
                    const paymentMethod = paymentMethodRaw.toLowerCase() === "cod" ? "Cash on Delivery" : paymentMethodRaw.toUpperCase();

                    const paymentStatusRaw = String(
                        group.payment_status ||
                        group.paymentStatus ||
                        (paymentMethodRaw.toLowerCase() === "cod" ? "Pending (COD)" : "Paid")
                    );

                    const transactionId = group.transaction_id || group.transactionId || group.payment_id || group.razorpay_payment_id || "";

                    // Shipping Address details
                    const addrObj = group.shipping_address || group.shippingAddress || group.address || group.delivery_address || {};
                    const addrName = addrObj.full_name || addrObj.name || group.name || "";
                    const addrPhone = addrObj.phone_number || addrObj.phone || group.phone || "";
                    const addrLines = [
                        addrObj.address_line1 || addrObj.line1 || "",
                        addrObj.address_line2 || addrObj.line2 || "",
                        [addrObj.city, addrObj.state].filter(Boolean).join(", "),
                        [addrObj.pincode, addrObj.country].filter(Boolean).join("-"),
                    ].filter(Boolean).join(", ");

                    // Items list
                    const rawItems = Array.isArray(group.items)
                        ? group.items
                        : Array.isArray(group.orders)
                            ? group.orders
                            : Array.isArray(group.order_items)
                                ? group.order_items
                                : Array.isArray(group.products)
                                    ? group.products
                                    : [group];

                    const itemsList: OrderItem[] = [];
                    let groupTotalSum = 0;

                    if (Array.isArray(rawItems) && rawItems.length > 0) {
                        rawItems.forEach((item: any) => {
                            const pd = item.product_details || item.productDetails || item.product || item;
                            const prod = pd.product || item.product || pd;
                            const gift = item.giftBox || pd.giftBox || item.gift_box || pd.gift_box || {};
                            const variant = item.variant || pd.variant || prod.variant || {};

                            const isCustomGift = item.type === "CUSTOM" || Boolean(item.giftBox) || Boolean(pd.giftBox) || Boolean(item.gift_box);

                            const title = isCustomGift
                                ? (gift.name || gift.title || item.title || item.name || "Custom Gift Box")
                                : (item.product_name || prod.product_name || prod.name || prod.title || item.title || item.productTitle || "Pure Honey");

                            const weightVal = variant.weight || item.weight || prod.weight || item.totalWeight;
                            const unitVal = variant.unit || item.unit || prod.unit || "g";
                            const weightLabel = weightVal ? `${weightVal}${unitVal}` : "";
                            const sub = isCustomGift ? (weightLabel ? `${weightLabel} Gift Box` : "Gift Box") : (weightLabel || item.productSub || "Standard Pack");

                            let img = "/Upcoming.png";
                            if (isCustomGift) {
                                img = gift.image || gift.image_url || gift.boxImage || item.image || item.giftBoxImage || pd.image || "/giftset.png";
                            } else if (typeof item.image === "string" && item.image) {
                                img = item.image;
                            } else if (item.image?.image_url) {
                                img = item.image.image_url;
                            } else if (typeof prod.image === "string" && prod.image) {
                                img = prod.image;
                            } else if (prod.image?.image_url) {
                                img = prod.image.image_url;
                            } else if (Array.isArray(prod.imageDocumentId) && prod.imageDocumentId[0]?.image_url) {
                                img = prod.imageDocumentId[0].image_url;
                            } else if (Array.isArray(prod.images) && prod.images[0]?.image_url) {
                                img = prod.images[0].image_url;
                            } else if (gift.image || gift.image_url) {
                                img = gift.image || gift.image_url;
                            }

                            const itemQty = item.quantity || item.qty || 1;
                            const itemPrice = Number(
                                item.amount ||
                                item.finalAmount ||
                                pd.finalAmount ||
                                item.totalAmount ||
                                item.price ||
                                (variant.price ? Number(variant.price) * itemQty : 0) ||
                                (prod.price ? Number(prod.price) * itemQty : 0) ||
                                0
                            );
                            groupTotalSum += itemPrice;

                            itemsList.push({
                                title,
                                sub,
                                qty: itemQty,
                                price: itemPrice > 0 ? `₹${itemPrice.toLocaleString("en-IN")}` : "",
                                image: img,
                            });
                        });
                    }

                    const groupFinalTotal = Number(
                        group.total_amount ||
                        group.totalAmount ||
                        group.finalAmount ||
                        group.grand_total ||
                        group.grandTotal ||
                        group.total ||
                        groupTotalSum
                    );
                    const subtotal = Number(group.subtotal || groupFinalTotal);
                    const shippingFee = Number(group.shippingFee || group.shipping_fee || 0);

                    const statusRaw = String(group.status || "Processing").toLowerCase();
                    let status: OrderStatus = "Processing";
                    if (statusRaw.includes("deliver")) status = "Delivered";
                    else if (statusRaw.includes("ship") || statusRaw.includes("transit") || statusRaw.includes("out")) status = "Shipped";
                    else if (statusRaw.includes("cancel")) status = "Cancelled";
                    else if (statusRaw.includes("pend")) status = "Pending";

                    mappedOrders.push({
                        id: `${groupOrderId}-${gIdx}`,
                        orderId: groupOrderId,
                        orderedOn: formattedDate,
                        paymentMethod: paymentMethod,
                        paymentStatus: paymentStatusRaw,
                        transactionId: transactionId ? String(transactionId) : undefined,
                        items: itemsList,
                        subtotal: `₹${subtotal.toLocaleString("en-IN")}`,
                        shippingFee: shippingFee > 0 ? `₹${shippingFee.toLocaleString("en-IN")}` : "Free",
                        totalAmount: `₹${groupFinalTotal.toLocaleString("en-IN")}`,
                        status: status,
                        statusNote: status === "Delivered"
                            ? `Delivered on ${formattedDate}`
                            : status === "Shipped"
                                ? "In Transit"
                                : status === "Cancelled"
                                    ? "Order Cancelled"
                                    : "Your order is being processed",
                        shippingAddress: (addrName || addrLines) ? {
                            name: addrName,
                            phone: addrPhone,
                            address: addrLines,
                        } : undefined,
                    });
                });

                setOrdersList(mappedOrders);
            }
        } catch (err) {
            console.error("Error fetching my-orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        function syncSession() {
            setSession(getStoredSession());
        }

        window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
        window.addEventListener("storage", syncSession);
        fetchProfileDetails();
        fetchMyOrders();

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

    // JS-driven Sticky Sidebar Scroll Handler (Desktop)
    useEffect(() => {
        let ticking = false;

        function computeStickyPosition() {
            const rowEl = rowRef.current;
            const sidebarEl = sidebarRef.current;
            if (!rowEl || !sidebarEl) return;

            if (window.innerWidth < 1024) {
                if (Object.keys(sidebarStyle).length > 0) {
                    setSidebarStyle({});
                    setSidebarPinned(false);
                    setPlaceholderHeight(0);
                }
                return;
            }

            const scrollY = window.scrollY || window.pageYOffset;
            const rowRect = rowEl.getBoundingClientRect();
            const rowTopDoc = rowRect.top + scrollY;
            const rowHeight = rowEl.offsetHeight;
            const rowBottomDoc = rowTopDoc + rowHeight;
            const sidebarHeight = sidebarEl.offsetHeight;
            const sidebarWidth = sidebarEl.offsetWidth;

            const desiredTopDoc = scrollY + HEADER_OFFSET;

            if (desiredTopDoc < rowTopDoc) {
                setSidebarStyle({});
                setSidebarPinned(false);
                setPlaceholderHeight(0);
            } else if (desiredTopDoc + sidebarHeight + BOTTOM_GAP >= rowBottomDoc) {
                setSidebarStyle({
                    position: "absolute",
                    top: rowHeight - sidebarHeight,
                    left: 0,
                    width: sidebarWidth,
                });
                setSidebarPinned(true);
                setPlaceholderHeight(sidebarHeight);
            } else {
                setSidebarStyle({
                    position: "fixed",
                    top: HEADER_OFFSET,
                    left: rowRect.left,
                    width: sidebarWidth,
                });
                setSidebarPinned(true);
                setPlaceholderHeight(sidebarHeight);
            }
        }

        function onScrollOrResize() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    computeStickyPosition();
                    ticking = false;
                });
                ticking = true;
            }
        }

        computeStickyPosition();
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [currentPage, searchTerm, userData]);

    // Unstick the mobile fixed bar once the footer is about to appear
    useEffect(() => {
        function handleMobileBarScroll() {
            const sectionEl = sectionRef.current;
            const barEl = mobileBarRef.current;
            if (!sectionEl || !barEl) return;

            if (window.innerWidth >= 1024) {
                return;
            }

            const scrollY = window.scrollY || window.pageYOffset;
            const sectionRect = sectionEl.getBoundingClientRect();
            const sectionTopDoc = sectionRect.top + scrollY;
            const sectionHeight = sectionEl.offsetHeight;
            const sectionBottomDoc = sectionTopDoc + sectionHeight;
            const barHeight = barEl.offsetHeight;

            const desiredTopDoc = scrollY + MOBILE_BAR_TOP_OFFSET;

            if (desiredTopDoc + barHeight >= sectionBottomDoc) {
                setMobileBarStyle({
                    position: "absolute",
                    top: sectionHeight - barHeight,
                    left: 0,
                    right: 0,
                });
            } else {
                setMobileBarStyle({
                    position: "fixed",
                    top: MOBILE_BAR_TOP_OFFSET,
                    left: 0,
                    right: 0,
                });
            }
        }

        handleMobileBarScroll();
        window.addEventListener("scroll", handleMobileBarScroll, { passive: true });
        window.addEventListener("resize", handleMobileBarScroll);
        return () => {
            window.removeEventListener("scroll", handleMobileBarScroll);
            window.removeEventListener("resize", handleMobileBarScroll);
        };
    }, []);

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
        window.dispatchEvent(new Event("auth-changed"));
        window.location.href = "/login";
    }

    if (!session) {
        return (
            <section className="min-h-[60vh] bg-[#FFF8EF] px-4 py-16">
                <div className="mx-auto h-24 max-w-sm animate-pulse rounded-2xl bg-white" />
            </section>
        );
    }

    // ---------- Filter Orders by Search ----------
    const filteredOrders = ordersList.filter((order) => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;
        return (
            order.orderId.toLowerCase().includes(search) ||
            order.status.toLowerCase().includes(search) ||
            order.paymentMethod.toLowerCase().includes(search) ||
            order.items.some((item) => item.title.toLowerCase().includes(search))
        );
    });

    // ---------- Pagination Logic ----------
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push('...');
            }
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }
        return pages;
    };

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.touchAction = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [mobileMenuOpen]);

    return (
        <section ref={sectionRef} className="relative min-h-screen bg-[#FFF8EF] pb-8 pt-[106px] sm:pt-32 lg:pt-12">

            {/* MOBILE FIXED BAR: Fixed top-[98px] to guarantee safe distance under site header */}
            <div
                ref={mobileBarRef}
                style={mobileBarStyle}
                className="z-30 bg-[#FFF8EF]/95 backdrop-blur-md py-2.5 px-4 lg:hidden border-b border-[#F0E2CC] shadow-sm"
            >
                <div className="mx-auto max-w-[1480px] flex items-center justify-between rounded-2xl border border-[#F0E2CC] bg-white p-3 shadow-sm">
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
                            <p className="text-xs text-[#B59A78]">Account Navigation</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex h-10 items-center gap-2 rounded-xl bg-[#593102] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#C98715] transition"
                    >
                        <Menu size={16} />
                        Menu
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-1 lg:pt-0">

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md lg:hidden animate-in fade-in duration-300 transition-all touch-none overscroll-contain"
                        onClick={() => setMobileMenuOpen(false)}
                        onTouchMove={(e) => {
                            if (e.target === e.currentTarget) {
                                e.preventDefault();
                            }
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
                                        <Settings size={16} />
                                    </div>
                                    <h3 className="font-serif text-base font-extrabold text-[#593102] tracking-tight">Account Navigation</h3>
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start relative">

                    {/* Desktop Sidebar (Pure CSS Sticky - 100% smooth, 0 jitter) */}
                    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto z-20">
                        <SidebarContent userData={userData} onLogout={logout} />
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="space-y-4 sm:space-y-6 flex-1 w-full min-w-0">

                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#593102]">
                                    My Orders
                                </h1>
                                <p className="mt-0.5 text-sm text-[#6E5D4F] font-medium">
                                    Manage and track all your orders seamlessly.
                                </p>
                            </div>
                            <div className="relative w-full sm:w-80">
                                <input
                                    type="text"
                                    placeholder="Search Order ID or Product Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-[#EADCC9] bg-white/90 backdrop-blur-sm pl-4 pr-10 text-sm text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] font-medium transition-colors"
                                />
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#D49313]"
                                />
                            </div>
                        </div>

                        {/* Filter pill */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button className="rounded-full border border-[#D49313]/40 bg-[#FAF0DC] px-5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#593102] shadow-2xs">
                                All Orders
                            </button>
                        </div>

                        {/* Order cards */}
                        <div className="space-y-5">
                            {loadingOrders ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-32 rounded-3xl border-2 border-[#EADCC9]/50 bg-white/80 animate-pulse flex items-center justify-center">
                                            <span className="text-xs font-bold text-[#8D7F73]">Loading your orders...</span>
                                        </div>
                                    ))}
                                </div>
                            ) : currentOrders.length === 0 ? (
                                <div className="text-center py-14 text-[#6E5D4F] font-medium bg-white/90 rounded-3xl border-2 border-[#EADCC9]/80 shadow-xs space-y-2">
                                    <Package size={40} className="mx-auto text-[#D49313] opacity-60" />
                                    <p className="font-serif text-lg font-bold text-[#593102]">
                                        {searchTerm ? "No orders match your search." : "No orders found."}
                                    </p>
                                    <p className="text-xs text-[#8D7F73]">
                                        {searchTerm ? "Try searching with a different Order ID or Product Name." : "Your placed orders will appear here."}
                                    </p>
                                </div>
                            ) : (
                                currentOrders.map((order) => {
                                    const StatusIcon = statusStyles[order.status]?.icon || Clock;
                                    return (
                                        <div
                                            key={order.id}
                                            className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/95 backdrop-blur-sm p-5 md:p-6 shadow-xs hover:shadow-md hover:border-[#D49313]/60 transition-all space-y-4"
                                        >
                                            {/* Top Header Bar */}
                                            <div className="pb-3.5 border-b border-[#EADCC9]/60">
                                                {/* Desktop Header Layout */}
                                                <div className="hidden sm:flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF0DC] text-[#D49313]">
                                                            <Package size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8D7F73]">Order ID</p>
                                                            <p className="text-sm font-extrabold text-[#593102]">{order.orderId.replace(/\s+-\s+/g, "-")}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-bold text-[#8D7F73]">Total Price</p>
                                                            <p className="text-sm font-black text-[#D49313]">{order.totalAmount}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-bold text-[#8D7F73]">Ordered on</p>
                                                            <p className="text-xs font-extrabold text-[#593102]">{order.orderedOn}</p>
                                                        </div>

                                                        {(() => {
                                                            const style = statusStyles[order.status] || statusStyles.Processing;
                                                            return (
                                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold shadow-2xs ${style.bg} ${style.text}`}>
                                                                    <StatusIcon size={13} />
                                                                    {order.status}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>

                                                {/* Mobile Header Layout */}
                                                <div className="flex sm:hidden flex-col gap-2.5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FAF0DC] text-[#D49313]">
                                                                <Package size={16} />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#8D7F73]">Order ID</p>
                                                                <p className="text-[11.5px] xs:text-[12px] font-extrabold text-[#593102] tracking-tight leading-tight whitespace-normal break-all">
                                                                    {order.orderId.replace(/\s+-\s+/g, "-")}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {(() => {
                                                            const style = statusStyles[order.status] || statusStyles.Processing;
                                                            return (
                                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold shadow-2xs shrink-0 ${style.bg} ${style.text}`}>
                                                                    <StatusIcon size={12} />
                                                                    {order.status}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>

                                                    <div className="flex items-center justify-between rounded-xl bg-[#FAF5EC] px-3 py-2 text-xs border border-[#EADCC9]/50">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-[#8D7F73]">Ordered on</p>
                                                            <p className="text-xs font-extrabold text-[#593102]">{order.orderedOn}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-bold text-[#8D7F73]">Total Price</p>
                                                            <p className="text-sm font-black text-[#D49313]">{order.totalAmount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Products List */}
                                            <div className="space-y-2.5 pt-1">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#FAF5EC]/50 border border-[#EADCC9]/40">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white border border-[#EADCC9]/60">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    fill
                                                                    sizes="56px"
                                                                    className="object-contain p-1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-serif text-sm font-bold text-[#593102]">{item.title}</p>
                                                                <p className="text-xs text-[#6E5D4F] font-medium">{item.sub}</p>
                                                                <span className="inline-block mt-0.5 text-[11px] font-bold text-[#8D7F73]">Qty: {item.qty}</span>
                                                            </div>
                                                        </div>
                                                        {item.price && (
                                                            <p className="text-sm font-extrabold text-[#593102] shrink-0">{item.price}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Payment & Address Summary Footer */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3.5 border-t border-[#EADCC9]/60 text-xs">
                                                {/* Payment Details */}
                                                <div className="space-y-1 bg-[#FFFDF9] p-3 rounded-2xl border border-[#EADCC9]/60">
                                                    <p className="font-extrabold uppercase tracking-wider text-[#8D7F73] text-[10px]">Payment Details</p>
                                                    <div className="flex justify-between items-center text-[#593102] font-semibold pt-1">
                                                        <span>Method:</span>
                                                        <span className="font-bold">{order.paymentMethod}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-[#593102] font-semibold">
                                                        <span>Status:</span>
                                                        <span className={`font-extrabold ${order.paymentStatus.toLowerCase().includes("paid") ? "text-emerald-700" : "text-amber-700"}`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </div>
                                                    {order.transactionId && (
                                                        <div className="flex justify-between items-center text-[#8D7F73] pt-0.5">
                                                            <span>Txn ID:</span>
                                                            <span className="font-mono text-[11px] truncate max-w-[110px]">{order.transactionId}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Shipping Address */}
                                                <div className="space-y-1 bg-[#FFFDF9] p-3 rounded-2xl border border-[#EADCC9]/60">
                                                    <p className="font-extrabold uppercase tracking-wider text-[#8D7F73] text-[10px]">Shipping Address</p>
                                                    {order.shippingAddress ? (
                                                        <>
                                                            <p className="font-bold text-[#593102] truncate">{order.shippingAddress.name || "Customer"}</p>
                                                            <p className="text-[#6E5D4F] line-clamp-2 leading-snug">{order.shippingAddress.address}</p>
                                                            {order.shippingAddress.phone && (
                                                                <p className="text-[#8D7F73] font-medium pt-0.5">📞 {order.shippingAddress.phone}</p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-[#8D7F73] italic">Standard Delivery</p>
                                                    )}
                                                </div>

                                                {/* Amount Breakdown */}
                                                <div className="flex flex-col justify-between bg-[#FAF0DC]/60 p-3 rounded-2xl border border-[#D49313]/30">
                                                    <div>
                                                        <div className="flex justify-between text-[#6E5D4F]">
                                                            <span>Subtotal:</span>
                                                            <span className="font-bold text-[#593102]">{order.subtotal}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[#6E5D4F]">
                                                            <span>Shipping:</span>
                                                            <span className="font-bold text-[#593102]">{order.shippingFee}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm font-extrabold text-[#593102] pt-1.5 border-t border-[#D49313]/30 mt-1">
                                                            <span>Total Amount:</span>
                                                            <span className="text-[#D49313]">{order.totalAmount}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions Bar */}
                                            <div className="flex flex-col gap-3 pt-3 border-t border-[#EADCC9]/60 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-xs sm:text-sm text-[#6E5D4F] font-medium leading-tight">{order.statusNote}</p>
                                                <OrderActions order={order} />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${currentPage === 1
                                            ? "border-[#F0E2CC] text-[#D4C5B2] cursor-not-allowed"
                                            : "border-[#F0E2CC] text-[#8A7460] hover:bg-[#FFF8EF]"
                                        }`}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {getPageNumbers().map((page, index) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${index}`} className="px-2 text-[#B59A78]">…</span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page as number)}
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${page === currentPage
                                                    ? "bg-[#593102] text-white"
                                                    : "border border-[#F0E2CC] text-[#3C2015] hover:bg-[#FFF8EF]"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}

                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${currentPage === totalPages
                                            ? "border-[#F0E2CC] text-[#D4C5B2] cursor-not-allowed"
                                            : "border-[#F0E2CC] text-[#8A7460] hover:bg-[#FFF8EF]"
                                        }`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}