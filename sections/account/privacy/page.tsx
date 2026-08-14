"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    Shield,
    FileText,
    Menu,
    X,
    Sparkles,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

const policies = [
    {
        icon: Truck,
        title: "Shipping Policy",
        description:
            "Learn about shipping methods, delivery timelines, shipping charges and important information.",
        href: "/account/privacy/shipping",
    },
    {
        icon: Shield,
        title: "Privacy Policy",
        description:
            "Learn how we collect, use, store and protect your personal information.",
        href: "/account/privacy/privacy",
    },
    {
        icon: FileText,
        title: "Terms & Conditions",
        description:
            "Read the terms and conditions for using the ShudhVeda website and placing orders.",
        href: "/account/privacy/term",
    },
];

// CHANGE THIS to your actual header's rendered height in pixels.
const HEADER_HEIGHT = 96;
// Extra breathing room between the header and the sidebar when it's stuck.
const TOP_GAP = 16;
const HEADER_OFFSET = HEADER_HEIGHT + TOP_GAP;
const BOTTOM_GAP = 24;

// Helper to get token from cookie
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

// ---------- Sidebar Content Component (Shared for Desktop & Mobile Drawer) ----------
function SidebarContent({ userData, onLinkClick }: { userData: any; onLinkClick?: () => void }) {
    const pathname = usePathname();
    const fullName = userData?.fullName || "Rahul Sharma";
    const email = userData?.email || "Not Provided";
    const initials = getInitials(fullName);

    const handleClick = () => {
        if (onLinkClick) onLinkClick();
    };

    return (
        <div className="space-y-4 w-full">
            {/* Profile Card */}
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
                    <Link
                        href="/account/editprofile"
                        onClick={handleClick}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#D49313] hover:underline cursor-pointer"
                    >
                        <Pencil size={12} strokeWidth={2.5} className="inline-block shrink-0" />
                        Edit profile
                    </Link>
                </div>
            </div>

            {/* Nav + Logout Card */}
            <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 flex flex-col justify-between shadow-xs">
                <nav className="space-y-1.5">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === "/account"
                            ? pathname === "/account" || pathname === "/account/"
                            : pathname === link.href || pathname?.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={handleClick}
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
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 cursor-pointer">
                        <LogOut size={18} className="shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PolicyCenterPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Profile data (used to personalize the sidebar)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        phone: "",
    });

    // Fetch Profile Details
    const fetchProfileDetails = async () => {
        setLoading(true);
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

    // ---- JS-driven sticky sidebar (DESKTOP LOGIC UNTOUCHED) ----
    const rowRef = useRef<HTMLDivElement>(null); // the grid row containing aside + main content
    const sidebarRef = useRef<HTMLDivElement>(null); // the aside itself
    const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});
    const [sidebarPinned, setSidebarPinned] = useState(false);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);

    // ---- JS-driven "unstick near footer" logic for the mobile fixed bar ----
    const sectionRef = useRef<HTMLDivElement>(null);
    const mobileBarRef = useRef<HTMLDivElement>(null);


    return (
        <section ref={sectionRef} className="relative min-h-screen bg-[#FFF8EF] pb-8 pt-0 lg:pt-12">

            {/* MOBILE BAR: Clean CSS Sticky bar */}
            <div
                className="z-30 bg-[#FFF8EF]/95 backdrop-blur-md py-2.5 px-4 lg:hidden border-b border-[#F0E2CC] shadow-sm sticky top-[94px]"
            >
                <div className="mx-auto max-w-[1480px] flex items-center justify-between rounded-2xl border border-[#F0E2CC] bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBE4B8] text-sm font-bold text-[#593102]">
                            {getInitials(formData.fullName)}
                        </div>
                        <div>
                            <p className="font-serif text-sm font-bold text-[#3C2015] capitalize">
                                {formData.fullName || "Rahul Sharma"}
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
                                <SidebarContent userData={formData} onLinkClick={() => setMobileMenuOpen(false)} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start relative">

                    {/* Desktop Sidebar (Pure CSS Sticky - 100% smooth, 0 jitter) */}
                    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto z-20">
                        <SidebarContent userData={formData} />
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="space-y-6 w-full min-w-0">

                        {/* Header */}
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2">
                                <FileText size={13} className="text-[#D49313]" />
                                <span>LEGAL &amp; TRUST</span>
                            </div>
                            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#593102]">
                                Policy Center
                            </h1>
                            <p className="text-base text-[#6E5D4F] font-medium">
                                Access all important policies and legal information in one place.
                            </p>
                        </div>

                        {/* Policy Cards */}
                        <div className="space-y-5">
                            {policies.map((policy) => {
                                const Icon = policy.icon;
                                return (
                                    <Link
                                        key={policy.title}
                                        href={policy.href}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 sm:p-9 hover:border-[#D49313] hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[#FAF0DC] border border-[#D49313]/40 text-[#D49313] group-hover:bg-gradient-to-r group-hover:from-[#D49313] group-hover:to-[#593102] group-hover:text-white transition-all duration-300 shadow-2xs">
                                            <Icon size={32} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#593102] group-hover:text-[#D49313] transition-colors break-words">
                                                {policy.title}
                                            </h3>
                                            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-[#6E5D4F] font-medium leading-relaxed break-words">
                                                {policy.description}
                                            </p>
                                        </div>
                                        <ChevronRight size={24} className="hidden sm:block shrink-0 text-[#D49313] group-hover:translate-x-1.5 transition-transform duration-300" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}