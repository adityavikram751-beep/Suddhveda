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
    Lock,
    FileText,
    ShieldCheck,
    Share2,
    Phone,
    Mail,
    Clock,
    Calendar,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/myorder" },
    { icon: Truck, label: "Track Order", href: "/trackorder" },
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

export default function PrivacyPolicyPage() {
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
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-4 shadow-sm flex flex-col min-h-[440px]">
                            <nav className="space-y-1 flex-1">
                                {sidebarLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] hover:text-[#D89A1B] transition-all duration-200"
                                        >
                                            <Icon size={20} className="shrink-0" />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}

                                {/* Policy Center - active (parent section) */}
                                <div className="relative flex items-center gap-3 rounded-xl bg-[#FFF2D8] px-4 py-3 text-sm font-medium text-[#D89A1B]">
                                    <Settings size={20} className="shrink-0" />
                                    <span>Policy Center</span>
                                    <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#D89A1B]" />
                                </div>
                            </nav>

                            <div className="mt-3 border-t border-[#F0E2CC]" />

                            <button className="flex w-full items-center gap-3 rounded-xl px-4 pt-4 pb-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                                <LogOut size={20} className="shrink-0" />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="space-y-6">

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-[#B59A78]">
                            <Link href="/" className="hover:text-[#D89A1B] transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <Link href="/account" className="hover:text-[#D89A1B] transition-colors">My Account</Link>
                            <ChevronRight size={14} />
                            <Link href="/account/privacy" className="hover:text-[#D89A1B] transition-colors">Policy Center</Link>
                            <ChevronRight size={14} />
                            <span className="font-semibold text-[#D89A1B]">Privacy Policy</span>
                        </div>

                        {/* Header */}
                        <div className="space-y-1">
                            <h1 className="font-serif text-4xl font-bold text-[#3C2015]">
                                Privacy Policy
                            </h1>
                            <p className="text-base text-[#B59A78]">
                                Learn how we collect, use, protect and manage your personal information.
                            </p>
                        </div>

                        {/* Content Card */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-7 space-y-7">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <div key={section.number}>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#D89A1B]">
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
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#D89A1B]">
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