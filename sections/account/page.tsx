"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Package,
    Truck,
    MapPin,
    Heart,
    Settings,
    LogOut,
    Pencil,
    Search,
    Clock,
    CheckCircle2,
    Ship,
} from "lucide-react";

const sidebarLinks = [
    { icon: Truck, label: "Track Order", href: "/trackorder" },
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

const orders: Order[] = [
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
                    href="/account/track-order"
                    className="flex h-9 items-center justify-center rounded-lg bg-[#D89A1B] text-xs font-bold text-white hover:bg-[#C98715] transition"
                >
                    Track Order
                </Link>
                <Link
                    href={`/account/orders/${order.orderId}`}
                    className="flex h-9 items-center justify-center rounded-lg border border-[#D89A1B] text-xs font-bold text-[#D89A1B] hover:bg-[#FFF8EF] transition"
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
                <button className="flex h-9 items-center justify-center rounded-lg bg-[#D89A1B] text-xs font-bold text-white hover:bg-[#C98715] transition">
                    Buy Again
                </button>
                <Link
                    href={`/account/orders/${order.orderId}`}
                    className="flex h-9 items-center justify-center rounded-lg border border-[#D89A1B] text-xs font-bold text-[#D89A1B] hover:bg-[#FFF8EF] transition"
                >
                    View Details
                </Link>
                <button className="flex h-9 items-center justify-center rounded-lg border border-[#D89A1B] text-xs font-bold text-[#D89A1B] hover:bg-[#FFF8EF] transition">
                    Write Review
                </button>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-2 sm:w-44">
            <Link
                href="/account/track-order"
                className="flex h-9 items-center justify-center rounded-lg bg-[#D89A1B] text-xs font-bold text-white hover:bg-[#C98715] transition"
            >
                Track Shipment
            </Link>
            <Link
                href={`/account/orders/${order.orderId}`}
                className="flex h-9 items-center justify-center rounded-lg border border-[#D89A1B] text-xs font-bold text-[#D89A1B] hover:bg-[#FFF8EF] transition"
            >
                View Details
            </Link>
            <button className="flex h-9 items-center justify-center gap-1 rounded-lg border border-[#D89A1B] text-xs font-bold text-[#D89A1B] hover:bg-[#FFF8EF] transition">
                Download Invoice
            </button>
        </div>
    );
}

export default function MyOrdersPage() {
    const pathname = usePathname();

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
                                {/* My Orders - this page itself, no navigation needed */}
                                <div className="relative flex items-center gap-3 rounded-xl bg-[#FFF2D8] px-4 py-2.5 text-sm font-medium text-[#D89A1B]">
                                    <Package size={18} className="shrink-0" />
                                    <span>My Orders</span>
                                    <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#D89A1B]" />
                                </div>
                                {sidebarLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={`
                                                relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors
                                                ${isActive
                                                    ? "bg-[#FFF2D8] text-[#D89A1B]"
                                                    : "text-[#6B2E08] hover:bg-[#FFF8EF]"
                                                }
                                            `}
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            <span>{link.label}</span>
                                            {isActive && (
                                                <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#D89A1B]" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Divider */}
                            <div className="mt-48 border-t border-[#F0E2CC]" />

                            {/* Logout - right below nav, not pushed to bottom */}
                            <button className="flex w-full items-center gap-3 rounded-xl px-4 pt-4 pb-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                                <LogOut size={18} className="shrink-0" />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="space-y-6">

                        {/* Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="font-serif text-3xl font-bold text-[#3C2015]">
                                    My Orders
                                </h1>
                                <p className="mt-0.5 text-sm text-[#B59A78]">
                                    Manage and track all your orders.
                                </p>
                            </div>
                            <div className="relative w-full sm:w-80">
                                <input
                                    type="text"
                                    placeholder="Search Order ID or Product Name..."
                                    className="h-11 w-full rounded-lg border border-[#F0E2CC] bg-white pl-4 pr-10 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#D89A1B]/40"
                                />
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#B59A78]"
                                />
                            </div>
                        </div>

                        {/* Filter pill */}
                        <div>
                            <button className="rounded-lg border border-[#D89A1B] bg-[#FFF2D8] px-5 py-2 text-sm font-semibold text-[#D89A1B]">
                                All Orders
                            </button>
                        </div>

                        {/* Order cards */}
                        <div className="space-y-5">
                            {orders.map((order) => {
                                const StatusIcon = statusStyles[order.status].icon;
                                return (
                                    <div
                                        key={order.id}
                                        className="rounded-2xl border border-[#F0E2CC] bg-white p-5 md:p-6"
                                    >
                                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                            {/* Product */}
                                            <div className="flex items-center gap-4 md:w-64">
                                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#FFF8EF]">
                                                    <Image
                                                        src={order.image}
                                                        alt={order.productTitle}
                                                        fill
                                                        className="object-contain p-1.5"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#3C2015]">
                                                        {order.productTitle}
                                                    </p>
                                                    <p className="text-xs text-[#8A7460]">{order.productSub}</p>
                                                    <p className="mt-1 text-xs text-[#B59A78]">Qty: {order.qty}</p>
                                                </div>
                                            </div>

                                            {/* Order ID */}
                                            <div className="md:w-36">
                                                <p className="text-xs text-[#B59A78]">Order ID</p>
                                                <p className="text-sm font-bold text-[#3C2015]">{order.orderId}</p>
                                                <p className="mt-2 text-xs text-[#B59A78]">Ordered on</p>
                                                <p className="text-sm font-semibold text-[#3C2015]">{order.orderedOn}</p>
                                            </div>

                                            {/* Payment */}
                                            <div className="md:w-32">
                                                <p className="text-xs text-[#B59A78]">Payment Method</p>
                                                <p className="text-sm font-bold text-[#3C2015]">{order.paymentMethod}</p>
                                                <p className="mt-2 text-xs text-[#B59A78]">Total Amount</p>
                                                <p className="text-sm font-semibold text-[#3C2015]">{order.totalAmount}</p>
                                            </div>

                                            {/* Status */}
                                            <div className="md:w-40">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}
                                                >
                                                    <StatusIcon size={13} />
                                                    {order.status}
                                                </span>
                                                <p className="mt-2 text-xs text-[#B59A78]">{order.statusNote}</p>
                                            </div>

                                            {/* Actions */}
                                            <OrderActions order={order} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F0E2CC] text-[#8A7460] hover:bg-[#FFF8EF]">
                                ‹
                            </button>
                            {[1, 2, 3].map((n) => (
                                <button
                                    key={n}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                                        n === 1
                                            ? "bg-[#D89A1B] text-white"
                                            : "border border-[#F0E2CC] text-[#3C2015] hover:bg-[#FFF8EF]"
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                            <span className="px-1 text-[#B59A78]">…</span>
                            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F0E2CC] text-sm font-bold text-[#3C2015] hover:bg-[#FFF8EF]">
                                10
                            </button>
                            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F0E2CC] text-[#8A7460] hover:bg-[#FFF8EF]">
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}