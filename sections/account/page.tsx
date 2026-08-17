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
    Sparkles,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

type OrderStatus = "Processing" | "Delivered" | "Shipped";

interface Order {
    id: string;
    productTitle: string;
    productSub: string;
    qty: number;
    image: string;
    orderId: string;
    orderedOn: string;
    paymentMethod: string;
    totalAmount: string;
    status: OrderStatus;
    statusNote: string;
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
        productTitle: "Wild Forest Honey",
        productSub: "500g",
        qty: 1,
        image: "/Upcoming.png",
        orderId: "SVN1256789",
        orderedOn: "12 May, 2024",
        paymentMethod: "UPI",
        totalAmount: "₹1,549",
        status: "Processing",
        statusNote: "Your order is being processed",
    },
    {
        id: "2",
        productTitle: "Natural Honey",
        productSub: "750g",
        qty: 1,
        image: "/Upcoming.png",
        orderId: "SVN1245601",
        orderedOn: "12 May, 2024",
        paymentMethod: "UPI",
        totalAmount: "₹899",
        status: "Delivered",
        statusNote: "Delivered on 15 May, 2024",
    },
    {
        id: "3",
        productTitle: "Honey Combo Pack",
        productSub: "(3 x 250g)",
        qty: 1,
        image: "/Upcoming.png",
        orderId: "SVN1234789",
        orderedOn: "10 May, 2024",
        paymentMethod: "Credit Card",
        totalAmount: "₹1,249",
        status: "Shipped",
        statusNote: "Expected delivery 16 May, 2024",
    },
    {
        id: "4",
        productTitle: "Organic Raw Honey",
        productSub: "1kg",
        qty: 2,
        image: "/Upcoming.png",
        orderId: "SVN1234567",
        orderedOn: "15 May, 2024",
        paymentMethod: "UPI",
        totalAmount: "₹2,199",
        status: "Delivered",
        statusNote: "Delivered on 18 May, 2024",
    },
    {
        id: "5",
        productTitle: "Manuka Honey",
        productSub: "250g",
        qty: 1,
        image: "/Upcoming.png",
        orderId: "SVN1234568",
        orderedOn: "18 May, 2024",
        paymentMethod: "Credit Card",
        totalAmount: "₹3,499",
        status: "Processing",
        statusNote: "Your order is being processed",
    },
    {
        id: "6",
        productTitle: "Acacia Honey",
        productSub: "500g",
        qty: 1,
        image: "/Upcoming.png",
        orderId: "SVN1234569",
        orderedOn: "20 May, 2024",
        paymentMethod: "UPI",
        totalAmount: "₹1,199",
        status: "Shipped",
        statusNote: "Expected delivery 23 May, 2024",
    },
    {
        id: "7",
        productTitle: "Buckwheat Honey",
        productSub: "750g",
        qty: 1,
        image: "/Upcoming.png",
        orderId: "SVN1234570",
        orderedOn: "22 May, 2024",
        paymentMethod: "Net Banking",
        totalAmount: "₹1,499",
        status: "Delivered",
        statusNote: "Delivered on 25 May, 2024",
    },
    {
        id: "8",
        productTitle: "Clover Honey",
        productSub: "500g",
        qty: 2,
        image: "/Upcoming.png",
        orderId: "SVN1234571",
        orderedOn: "25 May, 2024",
        paymentMethod: "UPI",
        totalAmount: "₹1,299",
        status: "Processing",
        statusNote: "Your order is being processed",
    },
    {
        id: "9",
        productTitle: "Eucalyptus Honey",
        productSub: "250g",
        qty: 1,
        image: "/Upcoming.png",
        orderId: "SVN1234572",
        orderedOn: "28 May, 2024",
        paymentMethod: "Credit Card",
        totalAmount: "₹899",
        status: "Shipped",
        statusNote: "Expected delivery 31 May, 2024",
    },
    {
        id: "10",
        productTitle: "Orange Blossom Honey",
        productSub: "1kg",
        qty: 1,
        image: "/Upcoming.png",
        orderId: "SVN1234573",
        orderedOn: "30 May, 2024",
        paymentMethod: "UPI",
        totalAmount: "₹2,499",
        status: "Delivered",
        statusNote: "Delivered on 2 June, 2024",
    },
];

const statusStyles: Record<OrderStatus, { bg: string; text: string; icon: typeof Clock }> = {
    Processing: { bg: "bg-[#FDECC8]", text: "text-[#B9740B]", icon: Clock },
    Delivered: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    Shipped: { bg: "bg-blue-100", text: "text-blue-700", icon: Ship },
};

function OrderActions({ order }: { order: Order }) {
    if (order.status === "Processing") {
        return (
            <div className="flex w-full flex-col gap-2 sm:w-44">
                <Link
                    href="/trackorder"
                    className="flex h-9 items-center justify-center rounded-lg bg-[#593102] text-xs font-bold text-white hover:bg-[#C98715] transition"
                >
                    Track Order
                </Link>
                <Link
                    href={`/account/orders/${order.orderId}`}
                    className="flex h-9 items-center justify-center rounded-lg border border-[#593102] text-xs font-bold text-[#593102] hover:bg-[#FFF8EF] transition"
                >
                    View Details
                </Link>
                <button className="flex h-9 items-center justify-center rounded-lg border border-red-500 text-xs font-bold text-red-500 hover:bg-red-50 transition">
                    Cancel Order
                </button>
            </div>
        );
    }

    if (order.status === "Delivered") {
        return (
            <div className="flex w-full flex-col gap-2 sm:w-44">
                <button className="flex h-9 items-center justify-center rounded-lg bg-[#593102] text-xs font-bold text-white hover:bg-[#C98715] transition">
                    Buy Again
                </button>
                <Link
                    href={`/account/orders/${order.orderId}`}
                    className="flex h-9 items-center justify-center rounded-lg border border-[#593102] text-xs font-bold text-[#593102] hover:bg-[#FFF8EF] transition"
                >
                    View Details
                </Link>
                <button className="flex h-9 items-center justify-center rounded-lg border border-[#593102] text-xs font-bold text-[#593102] hover:bg-[#FFF8EF] transition">
                    Write Review
                </button>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-2 sm:w-44">
            <Link
                href="/trackorder"
                className="flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-all duration-300 border border-[#FFD700]/30"
            >
                Track Shipment
            </Link>
            <Link
                href={`/account/orders/${order.orderId}`}
                className="flex h-9 items-center justify-center rounded-xl border border-[#D49313] text-xs font-bold text-[#593102] hover:bg-[#FAF0DC] transition-colors"
            >
                View Details
            </Link>
            <button className="flex h-9 items-center justify-center gap-1 rounded-xl border border-[#EADCC9] text-xs font-bold text-[#6E5D4F] hover:bg-[#FAF5EC] transition-colors cursor-pointer">
                Download Invoice
            </button>
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
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] text-base font-black text-white shadow-md">
                        {initials}
                    </div>
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
                                        ? "bg-[#FAF0DC] text-[#593102] font-bold border-l-4 border-[#D49313] shadow-xs"
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
        top: 95,
        left: 0,
        right: 0,
    });
    const MOBILE_BAR_TOP_OFFSET = 95;

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

    useEffect(() => {
        function syncSession() {
            setSession(getStoredSession());
        }

        window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
        window.addEventListener("storage", syncSession);
        fetchProfileDetails();

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

    function logout() {
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

    // ---------- Filter Orders by Search ----------
    const filteredOrders = allOrders.filter((order) => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;
        return (
            order.productTitle.toLowerCase().includes(search) ||
            order.orderId.toLowerCase().includes(search) ||
            order.status.toLowerCase().includes(search)
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
        <section ref={sectionRef} className="relative min-h-screen bg-[#FFF8EF] pb-8 pt-32 lg:pt-12">
            
            {/* MOBILE FIXED BAR: Fixed top-[95px] to guarantee safe distance under site header */}
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

            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-4 lg:pt-0">

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
                                        <Sparkles size={16} />
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
                    <div className="space-y-6 flex-1 w-full min-w-0">

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
                            {currentOrders.length === 0 ? (
                                <div className="text-center py-12 text-[#6E5D4F] font-medium bg-white/90 rounded-3xl border-2 border-[#EADCC9]/80 shadow-xs">
                                    {searchTerm ? "No orders match your search." : "No orders yet."}
                                </div>
                            ) : (
                                currentOrders.map((order) => {
                                    const StatusIcon = statusStyles[order.status].icon;
                                    return (
                                        <div
                                            key={order.id}
                                            className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 md:p-6 shadow-xs hover:shadow-md hover:border-[#D49313]/60 transition-all"
                                        >
                                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                                {/* Product */}
                                                <div className="flex items-center gap-4 md:w-64">
                                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#FFF8EF]">
                                                        <Image
                                                            src={order.image}
                                                            alt={order.productTitle}
                                                            fill
                                                            sizes="64px"
                                                            className="object-contain p-1.5"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-serif text-base font-bold text-[#593102]">
                                                            {order.productTitle}
                                                        </p>
                                                        <p className="text-xs text-[#6E5D4F] font-medium">{order.productSub}</p>
                                                        <p className="mt-1 text-xs text-[#8D7F73] font-semibold">Qty: {order.qty}</p>
                                                    </div>
                                                </div>

                                                {/* Order ID */}
                                                <div className="md:w-36">
                                                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">Order ID</p>
                                                    <p className="text-sm font-extrabold text-[#593102] mt-0.5">{order.orderId}</p>
                                                    <p className="mt-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">Ordered on</p>
                                                    <p className="text-xs font-bold text-[#593102] mt-0.5">{order.orderedOn}</p>
                                                </div>

                                                {/* Payment */}
                                                <div className="md:w-32">
                                                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">Payment Method</p>
                                                    <p className="text-xs font-bold text-[#593102] mt-0.5">{order.paymentMethod}</p>
                                                    <p className="mt-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8D7F73]">Total Amount</p>
                                                    <p className="text-sm font-extrabold text-[#593102] mt-0.5">{order.totalAmount}</p>
                                                </div>

                                                {/* Status */}
                                                <div className="md:w-40">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold shadow-2xs ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}
                                                    >
                                                        <StatusIcon size={13} />
                                                        {order.status}
                                                    </span>
                                                    <p className="mt-2 text-xs text-[#6E5D4F] font-medium">{order.statusNote}</p>
                                                </div>

                                                {/* Actions */}
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
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                        currentPage === 1
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
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${
                                                page === currentPage
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
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                        currentPage === totalPages
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