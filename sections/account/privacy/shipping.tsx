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
    Clock,
    AlertTriangle,
    HelpCircle,
    Mail,
    Phone,
    Menu,
    X,
    ArrowLeft,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
];

const deliveryTimeline = [
    { label: "Metro Cities", value: "2-4 Days" },
    { label: "Other Cities", value: "4-7 Days" },
    { label: "Remote Areas", value: "5-9 Days" },
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

export default function ShippingPolicyPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <section className="min-h-screen bg-[#FFF8EF] pt-6 pb-8 md:py-12">
            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">

                {/* Mobile Header Bar - Fixed safe spacing so it never goes over/under site header */}
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#F0E2CC] bg-white p-4 lg:hidden shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/account/privacy" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF8EF] text-[#3C2015] hover:bg-[#F0E2CC] transition">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="font-serif text-base font-bold text-[#3C2015]">Shipping Policy</h1>
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
                            <span className="font-semibold text-[#2D3A1B]">Shipping Policy</span>
                        </div>

                        {/* Header - desktop only */}
                        <div className="hidden lg:block space-y-1">
                            <h1 className="font-serif text-4xl font-bold text-[#2D3A1B]">
                                Shipping Policy
                            </h1>
                            <p className="text-base text-[#B59A78]">
                                Learn about our shipping process, delivery timelines and shipping charges.
                            </p>
                        </div>

                        {/* Content Card */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-7 space-y-7 shadow-sm">

                            {/* Order Processing */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0E2CC]">
                                    <Package size={18} className="text-[#2D3A1B]" />
                                    <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                        Order Processing
                                    </h2>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-[#5C4A3A]">
                                    Orders are processed within 1–2 business days after payment confirmation. We ensure each batch of honey is carefully inspected and packed to preserve its natural nutrients and rich aroma before it leaves our facility.
                                </p>
                            </div>

                            {/* Shipping Charges */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0E2CC]">
                                    <Truck size={18} className="text-[#2D3A1B]" />
                                    <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                        Shipping Charges
                                    </h2>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-[#5C4A3A]">
                                    Enjoy <span className="font-bold text-[#3C2015]">Free shipping</span> on all orders above ₹499. For orders below this minimum value, standard shipping charges of ₹50 will be applicable and displayed during checkout.
                                </p>
                            </div>

                            {/* Delivery Timeline */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0E2CC]">
                                    <Clock size={18} className="text-[#2D3A1B]" />
                                    <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                        Delivery Timeline
                                    </h2>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {deliveryTimeline.map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-xl bg-[#FBE9CE] p-4"
                                        >
                                            <p className="text-xs text-[#8A7460]">{item.label}</p>
                                            <p className="mt-1 text-lg font-bold text-[#3C2015]">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Delays */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0E2CC]">
                                    <AlertTriangle size={18} className="text-[#2D3A1B]" />
                                    <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                        Delivery Delays
                                    </h2>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-[#5C4A3A]">
                                    While we strive for timely delivery, delays may occur during peak festival seasons, public holidays, extreme weather conditions, or unforeseen courier disruptions. We will proactively notify you via email or SMS in such instances.
                                </p>
                            </div>

                            {/* Need Help */}
                            <div>
                                <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0E2CC]">
                                    <HelpCircle size={18} className="text-[#2D3A1B]" />
                                    <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                        Need Help?
                                    </h2>
                                </div>
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
                                    <div className="flex items-center gap-2 text-sm text-[#5C4A3A]">
                                        <Mail size={15} className="text-[#B59A78]" />
                                        support@shudhveda.com
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#5C4A3A]">
                                        <Phone size={15} className="text-[#B59A78]" />
                                        +91 98765 43210
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#5C4A3A]">
                                        <Clock size={15} className="text-[#B59A78]" />
                                        Mon–Sat: 9:00 AM – 7:00 PM
                                    </div>
                                </div>
                            </div>

                            {/* Last Updated */}
                            <div className="border-t border-[#F0E2CC] pt-4">
                                <p className="text-xs text-[#B59A78]">Last Updated: 12 July 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}