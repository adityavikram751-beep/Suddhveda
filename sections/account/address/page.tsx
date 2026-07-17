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
    Search,
    Plus,
    Trash2,
    Home,
    Briefcase,
    Gift,
} from "lucide-react";

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: Truck, label: "Track Order", href: "/trackorder" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

type AddressType = "Home" | "Office" | "Other";

interface Address {
    id: string;
    type: AddressType;
    label: string;
    name: string;
    phone: string;
    lines: string[];
    isDefault: boolean;
}

const addresses: Address[] = [
    {
        id: "1",
        type: "Home",
        label: "Home",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        lines: [
            "C-11 Sudarshan Tower,",
            "Sanbhavnath Tenaments,",
            "Sun N Step Club Road, Thaltej,",
            "Ahmedabad, Gujarat - 380054",
        ],
        isDefault: true,
    },
    {
        id: "2",
        type: "Office",
        label: "Office",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        lines: [
            "2nd Floor, Business Park,",
            "Near Iscon Circle,",
            "S.G Highway, Ahmedabad,",
            "Gujarat - 380015",
        ],
        isDefault: false,
    },
    {
        id: "3",
        type: "Other",
        label: "Other",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        lines: [
            "Gift Delivery Address,",
            "Friends Colony,",
            "New Delhi, Delhi - 110025",
        ],
        isDefault: false,
    },
    {
        id: "4",
        type: "Home",
        label: "Home",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        lines: [
            "B-105, Shivalik Residency,",
            "Near Prahladnagar Garden,",
            "Prahladnagar, Ahmedabad,",
            "Gujarat - 380015",
        ],
        isDefault: false,
    },
    {
        id: "5",
        type: "Office",
        label: "Office",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        lines: [
            "Unit No. 301, Corporate House,",
            "Nr. VR Mall, Dumas Road,",
            "Surat, Gujarat - 395007",
        ],
        isDefault: false,
    },
];

const typeIcons: Record<AddressType, typeof Home> = {
    Home: Home,
    Office: Briefcase,
    Other: MapPin,
};

function AddressCard({ address }: { address: Address }) {
    const TypeIcon = typeIcons[address.type];

    return (
        <div className="flex flex-col rounded-2xl border border-[#F0E2CC] bg-white p-6">
            <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#2D3A1B]">
                    <TypeIcon size={18} />
                </div>
                {address.isDefault && (
                    <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-green-700">
                        DEFAULT
                    </span>
                )}
            </div>

            <h3 className="mt-4 font-serif text-lg font-bold text-[#3C2015]">
                {address.label}
            </h3>

            <p className="mt-2 text-sm font-bold text-[#3C2015]">{address.name}</p>
            <p className="text-sm text-[#3C2015]">{address.phone}</p>

            <div className="mt-2 space-y-0.5">
                {address.lines.map((line, idx) => (
                    <p key={idx} className="text-sm text-[#8A7460]">
                        {line}
                    </p>
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs font-medium text-[#3C2015] hover:text-[#2D3A1B] transition">
                        <Pencil size={13} />
                        Edit
                    </button>
                    <button className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition">
                        <Trash2 size={13} />
                        Delete
                    </button>
                </div>

                {address.isDefault ? (
                    <button className="flex h-8 items-center justify-center rounded-lg bg-[#2D3A1B] px-4 text-xs font-bold text-white hover:bg-[#C98715] transition">
                        Deliver Here
                    </button>
                ) : (
                    <button className="flex h-8 items-center justify-center rounded-lg border border-[#2D3A1B] px-4 text-xs font-bold text-[#2D3A1B] hover:bg-[#FFF8EF] transition">
                        Set Default
                    </button>
                )}
            </div>
        </div>
    );
}

function AddNewAddressCard() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E7D3AE] bg-[#FFF8EF] p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#2D3A1B]">
                <Plus size={22} />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-[#3C2015]">
                Add New Address
            </h3>
            <p className="mt-2 text-sm text-[#8A7460]">
                Save new address to enjoy faster and hassle-free delivery.
            </p>
            <button className="mt-5 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2D3A1B] px-4 text-xs font-bold text-white hover:bg-[#C98715] transition">
                <Plus size={14} />
                Add Address
            </button>
        </div>
    );
}

export default function MyAddressesPage() {
    return (
        <section className="min-h-screen bg-[#FFF8EF] py-8 md:py-12">
            <div className="mx-auto max-w-[1480px] -mt-4 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start">

                    {/* --- SIDEBAR (Profile + Nav as separate cards) --- */}
                    <aside className="self-start lg:sticky lg:top-20 w-full space-y-4">

                        {/* Profile Card */}
                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBE4B8] text-base font-bold text-[#2D3A1B]">
                                    RS
                                </div>
                                <p className="font-serif text-lg font-bold text-[#3C2015]">
                                    Rahul Sharma
                                </p>
                                <p className="text-xs text-[#B59A78]">
                                    rahulsharma123@gmail.com
                                </p>
                                <button className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#2D3A1B] hover:underline">
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
                                {/* My Orders */}
                                <Link
                                    href="/account"
                                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors"
                                >
                                    <Package size={18} className="shrink-0" />
                                    <span>My Orders</span>
                                </Link>
                                <Link
                                    href="/trackorder"
                                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors"
                                >
                                    <Truck size={18} className="shrink-0" />
                                    <span>Track Order</span>
                                </Link>

                                {/* My Addresses - this page itself, always active */}
                                <div className="relative flex items-center gap-3 rounded-xl bg-[#FFF2D8] px-4 py-2.5 text-sm font-medium text-[#2D3A1B]">
                                    <MapPin size={18} className="shrink-0" />
                                    <span>My Addresses</span>
                                    <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#2D3A1B]" />
                                </div>

                                <Link
                                    href="/wishlist"
                                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors"
                                >
                                    <Heart size={18} className="shrink-0" />
                                    <span>Wishlist</span>
                                </Link>
                                <Link
                                    href="/account/privacy"
                                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors"
                                >
                                    <Settings size={18} className="shrink-0" />
                                    <span>Policy Center</span>
                                </Link>
                            </nav>

                            {/* Divider */}
                            <div className="mt-48 border-t border-[#F0E2CC]" />

                            {/* Logout */}
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
                                    My Addresses
                                </h1>
                                <p className="mt-0.5 text-sm text-[#B59A78]">
                                    Manage your delivery addresses.
                                </p>
                            </div>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search address"
                                        className="h-11 w-full rounded-lg border border-[#F0E2CC] bg-white pl-10 pr-4 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#2D3A1B]/40"
                                    />
                                    <Search
                                        size={18}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B59A78]"
                                    />
                                </div>
                                <button className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#2D3A1B] px-4 text-sm font-bold text-white hover:bg-[#C98715] transition">
                                    <Plus size={16} />
                                    Add New Address
                                </button>
                            </div>
                        </div>

                        {/* Address grid */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {addresses.map((address) => (
                                <AddressCard key={address.id} address={address} />
                            ))}
                            <AddNewAddressCard />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}