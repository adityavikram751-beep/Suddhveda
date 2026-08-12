"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
    Package,
    MapPin,
    Heart,
    Settings,
    LogOut,
    Pencil,
    ChevronRight,
    Lock,
    FileText,
    ShieldCheck,
    Share2,
    Phone,
    Mail,
    Clock,
    Calendar,
    ArrowLeft,
    Menu,
    X,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
];

const sections = [
    {
        number: "1",
        icon: Lock,
        title: "Information We Collect",
        body: "We collect information you provide while creating an account, placing orders, contacting support, subscribing to newsletters, and interacting with our website. This includes your name, contact details, shipping address, and payment preferences necessary for a smooth shopping experience.",
    },
    {
        number: "2",
        icon: FileText,
        title: "How We Use Your Information",
        body: "We use your information to process orders, improve services, personalize your shopping experience, provide customer support, and send important order notifications. Data helps us refine our luxury honey offerings and ensure that your wellness journey with ShudhVeda is exceptional.",
    },
    {
        number: "3",
        icon: ShieldCheck,
        title: "Data Protection",
        body: "We use secure technologies and industry-standard practices to protect your personal information against unauthorized access, alteration, or misuse. Our systems are regularly audited to maintain the highest levels of security for our discerning clients.",
    },
    {
        number: "4",
        icon: Share2,
        title: "Sharing Information",
        body: "We never sell your personal information. Information may only be shared with trusted payment gateways and courier partners required to complete your order. We maintain strict non-disclosure agreements with all third-party service providers.",
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

// ---------- Reusable Sidebar Content ----------
function SidebarContent({ userData, onLinkClick }: { userData: any; onLinkClick?: () => void }) {
    const fullName = userData?.fullName || "Rahul Sharma";
    const email = userData?.email || "Not Provided";
    const initials = getInitials(fullName);

    const handleClick = () => {
        if (onLinkClick) onLinkClick();
    };

    return (
        <div className="space-y-4 w-full">
            {/* Profile Card */}
            <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5 shadow-sm">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBE4B8] text-base font-bold text-[#593102]">
                        {initials}
                    </div>
                    <p className="font-serif text-lg font-bold text-[#3C2015] capitalize">
                        {fullName}
                    </p>
                    <p className="text-xs text-[#B59A78] break-all">
                        {email !== "Not Provided" ? email : `+91 ${userData?.mobile || userData?.phone || ""}`}
                    </p>
                    <Link
                        href="/account/editprofile"
                        onClick={handleClick}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#593102] hover:underline"
                    >
                        <Pencil size={12} strokeWidth={2.5} className="inline-block shrink-0" />
                        Edit profile
                    </Link>
                </div>
            </div>

            {/* Nav + Logout Card */}
            <div className="rounded-2xl border border-[#F0E2CC] bg-white p-4 shadow-sm flex flex-col justify-between">
                <nav className="space-y-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={handleClick}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#593102] hover:bg-[#FFF8EF] hover:text-[#593102] transition-all duration-200"
                            >
                                <Icon size={20} className="shrink-0" />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}

                    {/* Policy Center - active */}
                    <div className="relative flex items-center gap-3 rounded-xl bg-[#FFF2D8] px-4 py-3 text-sm font-medium text-[#593102]">
                        <Settings size={20} className="shrink-0" />
                        <span>Policy Center</span>
                        <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#593102]" />
                    </div>
                </nav>

                <div className="mt-8 pt-4 border-t border-[#F0E2CC]">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                        <LogOut size={20} className="shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PrivacyPolicyPage() {
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

    // ---- JS-driven sticky sidebar (DESKTOP LOGIC UNTOUCHED) ----
    const rowRef = useRef<HTMLDivElement>(null); // the grid row containing aside + main content
    const sidebarRef = useRef<HTMLDivElement>(null); // the aside itself
    const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});
    const [sidebarPinned, setSidebarPinned] = useState(false);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);

    // ---- JS-driven "unstick near footer" logic for the mobile fixed bar ----
    const sectionRef = useRef<HTMLDivElement>(null);
    const mobileBarRef = useRef<HTMLDivElement>(null);
    const [mobileBarStyle, setMobileBarStyle] = useState<React.CSSProperties>({
        position: "fixed",
        top: 95,
        left: 0,
        right: 0,
    });
    const MOBILE_BAR_TOP_OFFSET = 95;

    useEffect(() => {
        function handleScroll() {
            const rowEl = rowRef.current;
            const sidebarEl = sidebarRef.current;
            if (!rowEl || !sidebarEl) return;

            // Disable on mobile/tablet where the sidebar is hidden anyway
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
                // Not scrolled far enough yet: normal document flow
                setSidebarStyle({});
                setSidebarPinned(false);
                setPlaceholderHeight(0);
            } else if (desiredTopDoc + sidebarHeight + BOTTOM_GAP >= rowBottomDoc) {
                // Reached the bottom of the content column: pin to bottom of row
                setSidebarStyle({
                    position: "absolute",
                    top: rowHeight - sidebarHeight,
                    left: 0,
                    width: sidebarWidth,
                });
                setSidebarPinned(true);
                setPlaceholderHeight(sidebarHeight);
            } else {
                // Actively sticking to viewport, just under the header
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

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    // ---- Unstick the mobile fixed bar once the footer is about to appear ----
    useEffect(() => {
        function handleMobileBarScroll() {
            const sectionEl = sectionRef.current;
            const barEl = mobileBarRef.current;
            if (!sectionEl || !barEl) return;

            if (window.innerWidth >= 1024) {
                return; // bar is hidden on desktop anyway (lg:hidden)
            }

            const scrollY = window.scrollY || window.pageYOffset;
            const sectionRect = sectionEl.getBoundingClientRect();
            const sectionTopDoc = sectionRect.top + scrollY;
            const sectionHeight = sectionEl.offsetHeight;
            const sectionBottomDoc = sectionTopDoc + sectionHeight;
            const barHeight = barEl.offsetHeight;

            const desiredTopDoc = scrollY + MOBILE_BAR_TOP_OFFSET;

            if (desiredTopDoc + barHeight >= sectionBottomDoc) {
                // Section (and footer right after it) is coming into view —
                // pin the bar to the bottom of the section so it scrolls
                // away naturally instead of floating over the footer.
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
    }, [loading]);

    return (
        <section ref={sectionRef} className="relative min-h-screen bg-[#FFF8EF] pb-8 pt-32 lg:pt-12">

            {/* MOBILE BAR: fixed while scrolling, unsticks (absolute) once the footer approaches */}
            <div
                ref={mobileBarRef}
                style={mobileBarStyle}
                className="z-30 bg-[#FFF8EF]/95 backdrop-blur-md py-2.5 px-4 lg:hidden border-b border-[#F0E2CC] shadow-sm"
            >
                <div className="mx-auto max-w-[1480px] flex items-center justify-between rounded-2xl border border-[#F0E2CC] bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/account/privacy" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF8EF] text-[#3C2015] hover:bg-[#F0E2CC] transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="font-serif text-base font-bold text-[#3C2015]">Privacy Policy</h1>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex h-9 items-center gap-1.5 rounded-xl bg-[#593102] px-3 text-xs font-bold text-white shadow-sm hover:bg-[#C98715] transition"
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
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div
                            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#FFF8EF] shadow-2xl overflow-y-auto flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-[#FFF8EF] z-10 flex items-center justify-between p-4 pb-2 border-b border-[#F0E2CC]">
                                <h3 className="font-serif text-lg font-bold text-[#3C2015]">Menu</h3>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-full p-2 hover:bg-[#F0E2CC] text-[#8A7460]"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 pt-2" onClick={() => setMobileMenuOpen(false)}>
                                <SidebarContent userData={formData} onLinkClick={() => setMobileMenuOpen(false)} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={rowRef} className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start relative">

                    {/* Placeholder: reserves the column width/height in the grid row
                        while the real sidebar below is pinned (fixed/absolute) and
                        therefore removed from normal document flow. Prevents the
                        main content from jumping. */}
                    {sidebarPinned && (
                        <div
                            className="hidden lg:block w-full"
                            style={{ height: placeholderHeight }}
                        />
                    )}

                    {/* --- DESKTOP SIDEBAR (JS-driven sticky) --- */}
                    <aside
                        ref={sidebarRef}
                        style={sidebarStyle}
                        className="hidden lg:block w-full max-h-[calc(100vh-96px-24px)] overflow-y-auto"
                    >
                        <SidebarContent userData={formData} />
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="space-y-6 w-full min-w-0">

                        {/* Breadcrumb - desktop only */}
                        <div className="hidden lg:flex items-center gap-2 text-sm text-[#B59A78]">
                            <Link href="/" className="hover:text-[#593102] transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <Link href="/account" className="hover:text-[#593102] transition-colors">My Account</Link>
                            <ChevronRight size={14} />
                            <Link href="/account/privacy" className="hover:text-[#593102] transition-colors">Policy Center</Link>
                            <ChevronRight size={14} />
                            <span className="font-semibold text-[#593102]">Privacy Policy</span>
                        </div>

                        {/* Header - desktop only */}
                        <div className="hidden lg:block space-y-1">
                            <h1 className="font-serif text-4xl font-bold text-[#3C2015]">
                                Privacy Policy
                            </h1>
                            <p className="text-base text-[#B59A78]">
                                Learn how we collect, use, protect and manage your personal information.
                            </p>
                        </div>

                        {/* Content Card */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-7 space-y-7 shadow-sm">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <div key={section.number}>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#593102]">
                                                <Icon size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                                    {section.number}. {section.title}
                                                </h2>
                                                <p className="mt-2 text-sm leading-relaxed text-[#5C4A3A]">
                                                    {section.body}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 border-t border-[#F0E2CC]" />
                                    </div>
                                );
                            })}

                            {/* Contact Us */}
                            <div>
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#593102]">
                                        <Phone size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                            5. Contact Us
                                        </h2>
                                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-16">
                                            <div>
                                                <p className="flex items-center gap-1.5 text-xs text-[#B59A78]">
                                                    <Mail size={12} /> Email
                                                </p>
                                                <p className="mt-0.5 text-sm font-semibold text-[#3C2015]">
                                                    support@shudhveda.com
                                                </p>
                                            </div>
                                            <div>
                                                <p className="flex items-center gap-1.5 text-xs text-[#B59A78]">
                                                    <Phone size={12} /> Phone
                                                </p>
                                                <p className="mt-0.5 text-sm font-semibold text-[#3C2015]">
                                                    +91 98765 43210
                                                </p>
                                            </div>
                                            <div>
                                                <p className="flex items-center gap-1.5 text-xs text-[#B59A78]">
                                                    <Clock size={12} /> Business Hours
                                                </p>
                                                <p className="mt-0.5 text-sm font-semibold text-[#3C2015]">
                                                    Monday – Saturday, 9:00 AM – 7:00 PM
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Last Updated */}
                            <div className="border-t border-[#F0E2CC] pt-4">
                                <p className="flex items-center gap-1.5 text-xs text-[#B59A78]">
                                    <Calendar size={12} />
                                    Last Updated: 12 July 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}