"use client";

import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    Package,
    Truck,
    MapPin,
    CreditCard,
    Heart,
    Bell,
    Settings,
    LogOut,
    ShoppingBag,
    CheckCircle,
    Pencil,
} from "lucide-react";

const sidebarLinks = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/account", active: true },
    { icon: Package, label: "My Orders", href: "/account/orders" },
    { icon: Truck, label: "Track Order", href: "/trackorder" },
    { icon: MapPin, label: "My Addresses", href: "/account/addresses" },
    { icon: CreditCard, label: "Payment Methods", href: "/account/payment-methods" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Bell, label: "Notifications", href: "/account/notifications" },
    { icon: Settings, label: "Account Settings", href: "/account/settings" },
];

const stats = [
    {
        label: "Orders Placed",
        value: 5,
        icon: ShoppingBag,
        borderColor: "border-green-600",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        label: "Orders In Transit",
        value: 2,
        icon: Truck,
        borderColor: "border-orange-500",
        bgColor: "bg-orange-50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-500",
    },
    {
        label: "Orders Delivered",
        value: 3,
        icon: CheckCircle,
        borderColor: "border-purple-700",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-700",
    },
    {
        label: "Wishlist Items",
        value: 4,
        icon: Heart,
        borderColor: "border-blue-600",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
];

const recentOrders = [
    { id: "SVN1256789", date: "12 May, 2024", status: "In Transit", amount: "₹1,549" },
    { id: "SVN1245601", date: "12 May, 2024", status: "Delivered", amount: "₹899" },
    { id: "SVN1234789", date: "12 May, 2024", status: "Delivered", amount: "₹1,249" },
    { id: "SVN1223456", date: "12 May, 2024", status: "Delivered", amount: "₹750" },
];

export default function AccountDashboardPage() {
    return (
        <section className="min-h-screen bg-[#FFF8EF] py-8 md:py-12">
            <div className="mx-auto max-w-[1480px] -mt-4 px-4 sm:px-6 lg:px-8">

                {/* -------- HEADER -------- */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#3C2015] tracking-tight">
                            My Account
                        </h1>
                        <p className="mt-0.5 text-sm md:text-base text-[#B59A78]">
                            Manage your orders, addresses and account details.
                        </p>
                    </div>
                    <Image
                        src="/wishlist.png"
                        alt=""
                        width={104}
                        height={124}
                        className="hidden sm:block shrink-0"
                    />
                </div>

                {/* -------- GRID: SIDEBAR + MAIN -------- */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start">

                    {/* --- SIDEBAR (Profile + Nav Joint) --- */}
                    <aside className="self-start lg:sticky lg:top-20 w-full">
                        <div className="flex flex-col rounded-2xl border border-[#F0E2CC] bg-white overflow-hidden">
                            
                            {/* Profile Section - Top */}
                            <div className="p-5 pb-4 border-b border-[#F0E2CC]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FBE4B8] text-sm font-semibold text-[#D89A1B]">
                                        RS
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-[#3C2015]">
                                            Rahul Sharma
                                        </p>
                                        <p className="truncate text-xs text-[#B59A78]">
                                            rahulsharma123@gmail.com
                                        </p>
                                        <button className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#D89A1B] hover:underline">
                                            <Pencil size={12} strokeWidth={2.5} className="inline-block shrink-0" />
                                            <span>Edit Profile</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Nav + Logout - Bottom */}
                            <div className="p-5 pt-3 flex flex-col flex-1 lg:min-h-[480px]">
                                <nav className="space-y-1">
                                    {sidebarLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.label}
                                                href={link.href}
                                                className={`
                                                    relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors
                                                    ${link.active
                                                        ? "bg-[#FFF2D8] text-[#D89A1B]"
                                                        : "text-[#6B2E08] hover:bg-[#FFF8EF]"
                                                    }
                                                `}
                                            >
                                                <Icon size={18} className="shrink-0" />
                                                <span>{link.label}</span>
                                                {link.active && (
                                                    <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#D89A1B]" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Logout */}
                                <button className="mt-36 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                                    <LogOut size={18} className="shrink-0" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="space-y-6">

                        {/* Welcome + Stats */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-6 md:p-7">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-[#3C2015]">
                                    Welcome back, Rahul!
                                </h3>
                                <span className="text-2xl">👋</span>
                            </div>
                            <p className="mt-0.5 text-sm text-[#B59A78]">
                                Here&apos;s what&apos;s happening with your account.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {stats.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <div
                                            key={s.label}
                                            className={`flex items-center gap-4 rounded-xl border-2 p-4 ${s.borderColor} ${s.bgColor}`}
                                        >
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${s.iconBg}`}
                                            >
                                                <Icon size={22} className={s.iconColor} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-[#3C2015]">
                                                    {s.value}
                                                </p>
                                                <p className="text-sm text-[#8A7460]">{s.label}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-6 md:p-7">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-lg font-bold text-[#3C2015]">
                                    Recent Orders
                                </h3>
                                <Link
                                    href="/account/orders"
                                    className="text-sm font-medium text-[#D89A1B] hover:underline"
                                >
                                    View All Orders →
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[500px] text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[#F0E2CC] text-xs font-bold uppercase text-[#B59A78] tracking-wider">
                                            <th className="py-3 pr-4 font-bold">ORDER ID</th>
                                            <th className="py-3 pr-4 font-bold">DATE</th>
                                            <th className="py-3 pr-4 font-bold">STATUS</th>
                                            <th className="py-3 pr-4 font-bold">AMOUNT</th>
                                            <th className="py-3 font-bold">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-[#F0E2CC] last:border-0"
                                            >
                                                <td className="py-4 pr-4 font-semibold text-[#3C2015]">
                                                    {order.id}
                                                </td>
                                                <td className="py-4 pr-4 text-[#6B2E08]">
                                                    {order.date}
                                                </td>
                                                <td className="py-4 pr-4">
                                                    <span
                                                        className={`
                                                            inline-block rounded-full px-3 py-1 text-xs font-bold
                                                            ${order.status === "Delivered"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-orange-100 text-orange-600"
                                                            }
                                                        `}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-4 font-bold text-[#3C2015]">
                                                    {order.amount}
                                                </td>
                                                <td className="py-4">
                                                    <Link
                                                        href={order.status === "Delivered" 
                                                            ? "/account/orders" 
                                                            : "/account/track-order"
                                                        }
                                                        className="inline-block rounded-lg border border-[#D89A1B] px-4 py-1.5 text-xs font-bold text-[#D89A1B] transition-colors hover:bg-[#D89A1B] hover:text-white"
                                                    >
                                                        {order.status === "Delivered"
                                                            ? "View Details"
                                                            : "Track Order"}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Referral */}
                        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#F0DAAE] bg-gradient-to-r from-[#FFF2D8] to-[#FDECC8] p-6 md:flex-row md:items-center md:p-7">
                            <div className="flex items-center gap-5">
                                <Image
                                    src="/wishlist1.png"
                                    alt="Refer and earn"
                                    width={110}
                                    height={110}
                                    className="shrink-0"
                                />
                                <div>
                                    <p className="text-lg font-bold text-[#3C2015]">
                                        Refer &amp; Earn Rewards!
                                    </p>
                                    <p className="mt-1 text-sm text-[#6B2E08]">
                                        Refer your friends and get{" "}
                                        <span className="font-bold text-[#D89A1B]">
                                            10% off
                                        </span>{" "}
                                        on their first order.
                                    </p>
                                    <button className="mt-4 rounded-xl bg-[#D89A1B] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#C98715]">
                                        Refer Now
                                    </button>
                                </div>
                            </div>

                            <Image
                                src="/gift.png"
                                alt="Gift"
                                width={110}
                                height={110}
                                className="hidden shrink-0 sm:block"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}