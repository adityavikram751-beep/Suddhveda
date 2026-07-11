"use client";

import Link from "next/link";
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
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: Truck, label: "Track Order", href: "/trackorder" },
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

export default function PolicyCenterPage() {
    return (
        <section className="min-h-screen bg-[#FFF8EF] py-8 md:py-12">
            <div className="mx-auto max-w-[1480px] -mt-4 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start">

                    {/* --- SIDEBAR (Profile + Nav as separate cards) --- */}
                    <aside className="self-start lg:sticky lg:top-20 w-full space-y-4">

                        {/* Profile Card */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBE4B8] text-base font-bold text-[#D89A1B]">
                                    RS
                                </div>
                                <p className="font-serif text-lg font-bold text-[#3C2015]">
                                    Rahul Sharma
                                </p>
                                <p className="text-xs text-[#B59A78]">
                                    rahulsharma123@gmail.com
                                </p>
                                <button className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#D89A1B] hover:underline">
                                    <Pencil size={12} strokeWidth={2.5} className="inline-block shrink-0" />
<Link
href={`/account/editprofile`}
>
Edit profile
</Link>                                  </button>
                            </div>
                        </div>

                        {/* Nav + Logout Card */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5 flex flex-col lg:min-h-[480px]">
                            <nav className="space-y-1">
                                {sidebarLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#6B2E08] hover:bg-[#FFF8EF] hover:text-[#D89A1B] transition-all duration-200"
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}

                                {/* Policy Center - active (parent section) */}
                                <div className="relative flex items-center gap-3 rounded-xl bg-[#FFF2D8] px-4 py-3 text-sm font-medium text-[#D89A1B]">
                                    <Settings size={18} className="shrink-0" />
                                    <span>Policy Center</span>
                                    <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#D89A1B]" />
                                </div>
                            </nav>

                            <div className="mt-48 border-t border-[#F0E2CC]" />

                            <button className="flex w-full items-center gap-3 rounded-xl px-4 pt-4 pb-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                                <LogOut size={18} className="shrink-0" />
                                Logout
                            </button>
                        </div>
                    </aside>


                    {/* --- MAIN CONTENT --- */}
                    <div className="space-y-6">

                        {/* Header */}
                        <div className="space-y-1">
                            <h1 className="font-serif text-4xl font-bold text-[#3C2015]">
                                Policy Center
                            </h1>
                            <p className="text-base text-[#B59A78]">
                                Access all important policies and legal information in one place.
                            </p>
                        </div>

                        {/* Policy Cards */}
                        <div className="space-y-7">
                            {policies.map((policy) => {
                                const Icon = policy.icon;
                                return (
                                    <Link
                                        key={policy.title}
                                        href={policy.href}
                                        className="flex items-center gap-8 rounded-2xl border border-[#F0E2CC] bg-white p-9 hover:border-[#D89A1B] hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#FBE4B8] text-[#D89A1B] group-hover:scale-105 transition-transform duration-300">
                                            <Icon size={36} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-serif text-2xl font-bold text-[#3C2015] group-hover:text-[#D89A1B] transition-colors">
                                                {policy.title}
                                            </h3>
                                            <p className="mt-2 text-base text-[#8A7460] leading-relaxed">
                                                {policy.description}
                                            </p>
                                        </div>
                                        <ChevronRight size={28} className="shrink-0 text-[#D89A1B] group-hover:translate-x-1 transition-transform duration-300" />
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