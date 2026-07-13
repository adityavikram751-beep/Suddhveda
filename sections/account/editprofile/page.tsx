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
    User,
    Camera,
    Lock,
    ChevronRight,
    CalendarDays,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: Truck, label: "Track Order", href: "/trackorder" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

function SecurityRow({
    title,
    description,
    actionLabel,
}: {
    title: string;
    description: string;
    actionLabel: string;
}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[#F0E2CC] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-bold text-[#3C2015]">{title}</p>
                <p className="mt-0.5 text-xs text-[#B59A78]">{description}</p>
            </div>
            <button className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg border border-[#D89A1B] px-4 text-xs font-bold text-[#D89A1B] hover:bg-[#FFF8EF] transition">
                {actionLabel}
                <ChevronRight size={14} />
            </button>
        </div>
    );
}

export default function EditProfilePage() {
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
                                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors"
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            <span>{link.label}</span>
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
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-[#3C2015]">
                                Edit Profile
                            </h1>
                            <p className="mt-0.5 text-sm text-[#B59A78]">
                                Update your personal information and login details
                            </p>
                        </div>

                        {/* Card */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-6 md:p-8 space-y-8">

                            {/* Personal Information */}
                            <div>
                                <div className="flex items-center gap-2 pb-3 border-b border-[#F0E2CC]">
                                    <User size={18} className="text-[#3C2015]" />
                                    <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                        Personal Information
                                    </h2>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr_1fr]">
                                    {/* Profile photo */}
                                    <div className="flex flex-col items-center gap-2 sm:w-28">
                                        <p className="text-sm font-semibold text-[#3C2015] self-start sm:self-center">
                                            Profile Photo
                                        </p>
                                        <div className="relative mt-1">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FBE4B8] text-[#D89A1B]">
                                                <User size={28} />
                                            </div>
                                            <button className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#3C2015] text-white">
                                                <Camera size={12} />
                                            </button>
                                        </div>
                                        <button className="text-xs font-medium text-[#D89A1B] hover:underline">
                                            Change Photo
                                        </button>
                                    </div>

                                    {/* Full name + Email */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-[#3C2015]">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Rahul Sharma"
                                                className="mt-2 h-11 w-full rounded-lg border border-[#F0E2CC] bg-white px-3 text-sm text-[#3C2015] focus:outline-none focus:ring-2 focus:ring-[#D89A1B]/40"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-[#3C2015]">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                defaultValue="rahulsharma123@gmail.com"
                                                className="mt-2 h-11 w-full rounded-lg border border-[#F0E2CC] bg-white px-3 text-sm text-[#3C2015] focus:outline-none focus:ring-2 focus:ring-[#D89A1B]/40"
                                            />
                                        </div>
                                    </div>

                                    {/* Mobile + DOB + Gender */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-[#3C2015]">
                                                Mobile Number
                                            </label>
                                            <div className="mt-2 flex h-11 items-center justify-between rounded-lg border border-[#F0E2CC] bg-white px-3">
                                                <span className="text-sm text-[#3C2015]">+91 98765 43210</span>
                                                <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                                                    Verified
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-semibold text-[#3C2015]">
                                                    Date of Birth{" "}
                                                    <span className="font-normal text-[#B59A78]">(Optional)</span>
                                                </label>
                                                <div className="relative mt-2">
                                                    <input
                                                        type="text"
                                                        placeholder="DD / MM / YYYY"
                                                        className="h-11 w-full rounded-lg border border-[#F0E2CC] bg-white px-3 pr-9 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#D89A1B]/40"
                                                    />
                                                    <CalendarDays
                                                        size={16}
                                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#B59A78]"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-[#3C2015]">
                                                    Gender{" "}
                                                    <span className="font-normal text-[#B59A78]">(Optional)</span>
                                                </label>
                                                <select
                                                    defaultValue=""
                                                    className="mt-2 h-11 w-full rounded-lg border border-[#F0E2CC] bg-white px-3 text-sm text-[#3C2015] focus:outline-none focus:ring-2 focus:ring-[#D89A1B]/40"
                                                >
                                                    <option value="" disabled>
                                                        Select Gender
                                                    </option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Login & Security */}
                            <div>
                                <div className="flex items-center gap-2 pb-3 border-b border-[#F0E2CC]">
                                    <Lock size={18} className="text-[#3C2015]" />
                                    <h2 className="font-serif text-lg font-bold text-[#3C2015]">
                                        Login &amp; Security
                                    </h2>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <SecurityRow
                                        title="Change Password"
                                        description="Choose a strong password to keep your account secure."
                                        actionLabel="Change Password"
                                    />
                                    <SecurityRow
                                        title="Change Mobile Number"
                                        description="Update your mobile number with OTP verification."
                                        actionLabel="Change Mobile Number"
                                    />
                                    <SecurityRow
                                        title="Change Email Address"
                                        description="Update your email address with OTP verification."
                                        actionLabel="Change Email Address"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button className="flex h-11 items-center justify-center rounded-lg bg-[#D89A1B] px-6 text-sm font-bold text-white hover:bg-[#C98715] transition">
                                    Save Changes
                                </button>
                                <button className="flex h-11 items-center justify-center rounded-lg border border-[#F0E2CC] px-6 text-sm font-bold text-[#3C2015] hover:bg-[#FFF8EF] transition">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}