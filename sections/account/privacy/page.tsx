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
    Shield,
    FileText,
    Menu,
    X,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
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

// ---------- Sidebar Content Component (Shared for Desktop & Mobile Drawer) ----------
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
            <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5 flex flex-col justify-between shadow-sm">
                <nav className="space-y-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors"
                            >
                                <Icon size={18} className="shrink-0" />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}

                    {/* Policy Center - active */}
                    <div className="relative flex items-center gap-3 rounded-xl bg-[#FFF2D8] px-4 py-2.5 text-sm font-medium text-[#2D3A1B]">
                        <Settings size={18} className="shrink-0" />
                        <span>Policy Center</span>
                        <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#2D3A1B]" />
                    </div>
                </nav>

                <div className="mt-48 pt-4 border-t border-[#F0E2CC]">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
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

    return (
        <section className="min-h-screen bg-[#FFF8EF] py-6 sm:py-4 md:py-12">
            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
                
                {/* Mobile Menu Toggle Bar */}
                <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#F0E2CC] bg-white p-4 lg:hidden shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBE4B8] text-sm font-bold text-[#2D3A1B]">
                            RS
                        </div>
                        <div>
                            <p className="font-serif text-sm font-bold text-[#3C2015]">Rahul Sharma</p>
                            <p className="text-xs text-[#B59A78]">Account Navigation</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex h-10 items-center gap-2 rounded-xl bg-[#2D3A1B] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#C98715] transition"
                    >
                        <Menu size={16} />
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

                        {/* Header */}
                        <div className="space-y-1">
                            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3C2015]">
                                Policy Center
                            </h1>
                            <p className="text-base text-[#B59A78]">
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
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 rounded-2xl border border-[#F0E2CC] bg-white p-6 sm:p-9 hover:border-[#2D3A1B] hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[#FBE4B8] text-[#2D3A1B] group-hover:scale-105 transition-transform duration-300">
                                            <Icon size={32} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3C2015] group-hover:text-[#2D3A1B] transition-colors break-words">
                                                {policy.title}
                                            </h3>
                                            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-[#8A7460] leading-relaxed break-words">
                                                {policy.description}
                                            </p>
                                        </div>
                                        <ChevronRight size={24} className="hidden sm:block shrink-0 text-[#2D3A1B] group-hover:translate-x-1 transition-transform duration-300" />
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