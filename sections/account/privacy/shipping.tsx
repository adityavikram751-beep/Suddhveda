"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    Package,
    Truck,
    MapPin,
    Heart,
    Settings,
    LogOut,
    Pencil,
    ChevronRight,
    Clock,
    AlertTriangle,
    HelpCircle,
    Mail,
    Phone,
    Menu,
    X,
    ArrowLeft,
} from "lucide-react";
import { API_BASE_URL, getStoredSession } from "@/lib/auth";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

const deliveryTimeline = [
    { label: "Metro Cities", value: "2-4 Days" },
    { label: "Other Cities", value: "4-7 Days" },
    { label: "Remote Areas", value: "5-9 Days" },
];

function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
}

function getInitials(fullName: string) {
    if (!fullName) return "RS";
    return fullName
        .split(" ")
        .filter(Boolean)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// ---------- Sidebar Content ----------
function SidebarContent({ userData, onLinkClick }: { userData: any; onLinkClick?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const fullName = userData?.fullName || getStoredSession()?.user?.name || "ShuddhVeda Customer";
    const email = userData?.email || "Not Provided";
    const initials = getInitials(fullName);

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
                    <Link
                        href="/account/editprofile"
                        onClick={(e) => handleNavClick(e, "/account/editprofile")}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#D49313] hover:underline cursor-pointer"
                    >
                        <Pencil size={12} strokeWidth={2.5} className="inline-block shrink-0" />
                        Edit profile
                    </Link>
                </div>
            </div>

            <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 shadow-xs flex flex-col justify-between">
                <nav className="space-y-1.5">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === "/account"
                            ? pathname === "/account" || pathname === "/account/"
                            : pathname === link.href || pathname?.startsWith(`${link.href}`);
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
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 cursor-pointer">
                        <LogOut size={18} className="shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------- Main Shipping Policy Page ----------
export default function ShippingPolicyPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        phone: "",
    });

    const fetchProfileDetails = async () => {
        try {
            setLoading(true);
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
                setFormData({
                    fullName: user.name || user.full_name || "",
                    email: user.email || "",
                    mobile: user.mobile || user.phone || "",
                    phone: user.mobile || user.phone || "",
                });
            }
        } catch (err) {
            console.error("Error fetching profile details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileDetails();
    }, []);

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
        <section className="relative min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] pb-12 pt-0 lg:pt-12 border-b border-[#EADCC9]/50">

            {/* MOBILE BAR */}
            <div className="z-30 bg-[#FFFDF9]/95 backdrop-blur-md py-2.5 px-4 lg:hidden border-b border-[#EADCC9] shadow-sm sticky top-[94px]">
                <div className="mx-auto max-w-[1480px] flex items-center justify-between rounded-2xl border border-[#EADCC9] bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/account/privacy" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF0DC] text-[#593102] hover:bg-[#EADCC9] transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="font-serif text-base font-bold text-[#593102]">Shipping Policy</h1>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D49313] to-[#593102] px-3 text-xs font-bold text-white shadow-sm cursor-pointer"
                    >
                        <Menu size={15} />
                        Menu
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-4 lg:pt-0">

                {/* Mobile Drawer Overlay */}
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
                                <SidebarContent userData={formData} onLinkClick={() => setMobileMenuOpen(false)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* GRID CONTAINER WITH PURE CSS STICKY SIDEBAR */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start relative">

                    {/* NATIVE CSS STICKY SIDEBAR - ZERO JS LAG, 100% SMOOTH */}
                    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto z-20">
                        <SidebarContent userData={formData} />
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="space-y-6 w-full min-w-0">

                        {/* Breadcrumb */}
                        <div className="hidden lg:flex items-center gap-2 text-sm text-[#8D7F73]">
                            <Link href="/" className="hover:text-[#D49313] transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <Link href="/account" className="hover:text-[#D49313] transition-colors">My Account</Link>
                            <ChevronRight size={14} />
                            <Link href="/account/privacy" className="hover:text-[#D49313] transition-colors">Policy Center</Link>
                            <ChevronRight size={14} />
                            <span className="font-bold text-[#593102]">Shipping Policy</span>
                        </div>

                        {/* Header */}
                        <div className="hidden lg:block space-y-1">
                            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2">
                                <Truck size={13} className="text-[#D49313]" />
                                <span>SHIPPING &amp; DELIVERY</span>
                            </div>
                            <h1 className="font-serif text-4xl font-extrabold text-[#593102]">
                                Shipping Policy
                            </h1>
                            <p className="text-base text-[#6E5D4F] font-medium">
                                Learn about our shipping process, delivery timelines and shipping charges.
                            </p>
                        </div>

                        {/* Content Card */}
                        <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-7 space-y-7 shadow-xs">

                            {/* Order Processing */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#EADCC9]/60">
                                    <Package size={18} className="text-[#D49313]" />
                                    <h2 className="font-serif text-lg font-bold text-[#593102]">
                                        Order Processing
                                    </h2>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-[#6E5D4F] font-medium">
                                    Orders are processed within 1–2 business days after payment confirmation. We ensure each batch of honey is carefully inspected and packed to preserve its natural nutrients and rich aroma before it leaves our facility.
                                </p>
                            </div>

                            {/* Shipping Charges */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#EADCC9]/60">
                                    <Truck size={18} className="text-[#D49313]" />
                                    <h2 className="font-serif text-lg font-bold text-[#593102]">
                                        Shipping Charges
                                    </h2>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-[#6E5D4F] font-medium">
                                    Enjoy <span className="font-extrabold text-[#593102]">Free shipping</span> on all orders above ₹499. For orders below this minimum value, standard shipping charges of ₹50 will be applicable and displayed during checkout.
                                </p>
                            </div>

                            {/* Delivery Timeline */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#EADCC9]/60">
                                    <Clock size={18} className="text-[#D49313]" />
                                    <h2 className="font-serif text-lg font-bold text-[#593102]">
                                        Delivery Timeline
                                    </h2>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {deliveryTimeline.map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-2xl bg-[#FAF0DC]/70 border border-[#D49313]/30 p-4 text-center"
                                        >
                                            <p className="text-xs font-bold uppercase tracking-wider text-[#8D7F73]">{item.label}</p>
                                            <p className="mt-1 font-serif text-xl font-extrabold text-[#593102]">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Delays */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#EADCC9]/60">
                                    <AlertTriangle size={18} className="text-[#D49313]" />
                                    <h2 className="font-serif text-lg font-bold text-[#593102]">
                                        Delivery Delays
                                    </h2>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-[#6E5D4F] font-medium">
                                    While we strive for timely delivery, delays may occur during peak festival seasons, public holidays, extreme weather conditions, or unforeseen courier disruptions. We will proactively notify you via email or SMS in such instances.
                                </p>
                            </div>

                            {/* Need Help */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#EADCC9]/60">
                                    <HelpCircle size={18} className="text-[#D49313]" />
                                    <h2 className="font-serif text-lg font-bold text-[#593102]">
                                        Need Help?
                                    </h2>
                                </div>
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
                                    <div className="flex items-center gap-2 text-sm text-[#6E5D4F] font-semibold">
                                        <Mail size={15} className="text-[#D49313]" />
                                        support@shudhveda.com
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#6E5D4F] font-semibold">
                                        <Phone size={15} className="text-[#D49313]" />
                                        +91 98765 43210
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#6E5D4F] font-semibold">
                                        <Clock size={15} className="text-[#D49313]" />
                                        Mon–Sat: 9:00 AM – 7:00 PM
                                    </div>
                                </div>
                            </div>

                            {/* Last Updated */}
                            <div className="border-t border-[#EADCC9]/60 pt-4">
                                <p className="text-xs text-[#8D7F73] font-semibold">Last Updated: 12 July 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}