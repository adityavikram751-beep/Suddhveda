"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Package,
    Truck,
    MapPin,
    Heart,
    Settings,
    LogOut,
    Pencil,
    ChevronRight,
    FileText,
    ShoppingCart,
    RotateCcw,
    UserCheck,
    ShieldAlert,
    Phone,
    Mail,
    Clock,
    Menu,
    X,
    ArrowLeft,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
];

const sections = [
    {
        number: "01",
        icon: FileText,
        title: "Acceptance of Terms",
        body: [
            "By accessing and using ShudhVeda.com, you agree to comply with and be bound by the following terms and conditions. If you do not agree with any part of these terms, please refrain from using our platform. We reserve the right to update these terms at any time without prior notice.",
        ],
    },
    {
        number: "02",
        icon: ShoppingCart,
        title: "Orders & Payments",
        body: [
            "All orders placed through ShudhVeda are subject to acceptance and availability. We offer multiple secure payment methods for your convenience.",
        ],
        bullets: [
            "Pricing for all products is listed in Indian Rupees (INR) and includes applicable taxes.",
            "Payment must be made in full at the time of order placement unless using Cash on Delivery (CoD) options.",
            "We reserve the right to cancel orders due to pricing errors or stock unavailability.",
        ],
    },
    {
        number: "03",
        icon: Truck,
        title: "Shipping & Delivery",
        body: [
            "ShudhVeda delivers luxury honey across India. Delivery timelines vary based on location but typically range from 3 to 7 business days. While we strive for prompt delivery, external factors like weather or courier delays may occur. Tracking information will be provided once your order is dispatched.",
        ],
    },
    {
        number: "04",
        icon: RotateCcw,
        title: "Returns & Refunds",
        body: [
            "Due to the nature of our products, we only accept returns if the product is damaged during transit or if the seal is broken upon arrival. Please notify us within 24 hours of delivery with photographic evidence to initiate a refund or replacement process.",
        ],
    },
    {
        number: "05",
        icon: UserCheck,
        title: "User Responsibilities",
        body: [
            "Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.",
        ],
        bullets: [
            "Provide accurate and complete information during checkout.",
            "Not use the platform for any fraudulent or illegal activities.",
            "Respect the intellectual property rights of ShudhVeda.",
        ],
    },
    {
        number: "06",
        icon: ShieldAlert,
        title: "Limitation of Liability",
        body: [
            "ShudhVeda shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our products or website. Our maximum liability is limited to the purchase price of the product in question.",
        ],
    },
];

// ---------- Reusable Sidebar Content (used in desktop aside + mobile drawer) ----------
function SidebarContent() {
    return (
        <div className="space-y-4 w-full">
            {/* Profile Card */}
            <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5 shadow-sm">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBE4B8] text-base font-bold text-[#2D3A1B]">
                        RS
                    </div>
                    <p className="font-serif text-lg font-bold text-[#3C2015]">
                        Rahul Sharma
                    </p>
                    <p className="text-xs text-[#B59A78] break-all">
                        rahulsharma123@gmail.com
                    </p>
                    <Link
                        href="/account/editprofile"
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#2D3A1B] hover:underline"
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
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] hover:text-[#2D3A1B] transition-all duration-200"
                            >
                                <Icon size={20} className="shrink-0" />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}

                    {/* Policy Center - active (parent section) */}
                    <div className="relative flex items-center gap-3 rounded-xl bg-[#FFF2D8] px-4 py-3 text-sm font-medium text-[#2D3A1B]">
                        <Settings size={20} className="shrink-0" />
                        <span>Policy Center</span>
                        <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#2D3A1B]" />
                    </div>
                </nav>

                <div className="mt-48 pt-4 border-t border-[#F0E2CC]">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                        <LogOut size={20} className="shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TermsConditionsPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="min-h-screen bg-[#FFF8EF] pt-6 pb-8 md:py-12">
            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">

                {/* Mobile Header Bar - Safe spacing layout */}
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#F0E2CC] bg-white p-4 lg:hidden shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/account/privacy" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF8EF] text-[#3C2015] hover:bg-[#F0E2CC] transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="font-serif text-base font-bold text-[#3C2015]">Terms & Conditions</h1>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex h-9 items-center gap-1.5 rounded-xl bg-[#2D3A1B] px-3 text-xs font-bold text-white shadow-sm hover:bg-[#C98715] transition"
                    >
                        <Menu size={15} />
                        Menu
                    </button>
                </div>

                {/* Mobile Drawer Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div
                            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#FFF8EF] p-5 shadow-2xl overflow-y-auto flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0E2CC]">
                                <h3 className="font-serif text-lg font-bold text-[#3C2015]">Menu</h3>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-full p-2 hover:bg-[#F0E2CC] text-[#8A7460]"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div onClick={() => setMobileMenuOpen(false)}>
                                <SidebarContent />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start">

                    {/* --- DESKTOP SIDEBAR --- */}
                    <aside className="hidden lg:block lg:sticky lg:top-20 w-full">
                        <SidebarContent />
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="space-y-6 w-full min-w-0">

                        {/* Breadcrumb - desktop only */}
                        <div className="hidden lg:flex items-center gap-2 text-sm text-[#B59A78]">
                            <Link href="/" className="hover:text-[#2D3A1B] transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <Link href="/account" className="hover:text-[#2D3A1B] transition-colors">My Account</Link>
                            <ChevronRight size={14} />
                            <Link href="/account/privacy" className="hover:text-[#2D3A1B] transition-colors">Policy Center</Link>
                            <ChevronRight size={14} />
                            <span className="font-semibold text-[#2D3A1B]">Terms & Conditions</span>
                        </div>

                        {/* Header - desktop only */}
                        <div className="hidden lg:block space-y-1">
                            <h1 className="font-serif text-4xl font-bold text-[#3C2015]">
                                Terms &amp; Conditions
                            </h1>
                            <p className="text-base text-[#B59A78]">
                                Please read these terms carefully before using the ShudhVeda website or placing an order.
                            </p>
                        </div>

                        {/* Content Card */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-7 space-y-6 shadow-sm">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <div key={section.number}>
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 flex h-6 w-8 shrink-0 items-center justify-center rounded-md bg-[#FBE4B8] text-[11px] font-bold text-[#2D3A1B]">
                                                {section.number}
                                            </span>
                                            <div className="flex-1">
                                                <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#3C2015]">
                                                    <Icon size={17} className="text-[#2D3A1B]" />
                                                    {section.title}
                                                </h2>
                                                {section.body.map((para, idx) => (
                                                    <p
                                                        key={idx}
                                                        className="mt-2 text-sm leading-relaxed text-[#5C4A3A]"
                                                    >
                                                        {para}
                                                    </p>
                                                ))}
                                                {section.bullets && (
                                                    <ul className="mt-2 space-y-1.5">
                                                        {section.bullets.map((bullet, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-start gap-2 text-sm leading-relaxed text-[#5C4A3A]"
                                                            >
                                                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#2D3A1B]" />
                                                                {bullet}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-6 border-t border-[#F0E2CC]" />
                                    </div>
                                );
                            })}

                            {/* Contact Information */}
                            <div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-6 w-8 shrink-0 items-center justify-center rounded-md bg-[#FBE4B8] text-[11px] font-bold text-[#2D3A1B]">
                                        07
                                    </span>
                                    <div className="flex-1">
                                        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#3C2015]">
                                            <Phone size={17} className="text-[#2D3A1B]" />
                                            Contact Information
                                        </h2>
                                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-10">
                                            <div className="flex items-center gap-1.5 text-sm text-[#5C4A3A]">
                                                <Mail size={14} className="text-[#B59A78]" />
                                                support@shudhveda.com
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-[#5C4A3A]">
                                                <Phone size={14} className="text-[#B59A78]" />
                                                +91 98765 43210
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-[#5C4A3A]">
                                                <Clock size={14} className="text-[#B59A78]" />
                                                Mon-Sat 9 AM - 7 PM
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}