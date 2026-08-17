"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    Package,
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
    X,
    CheckCircle,
    Menu,
    Sparkles,
} from "lucide-react";
import { API_BASE_URL, getInitials, getStoredSession } from "@/lib/auth";

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

interface AddressFormData {
    type: AddressType;
    label: string;
    name: string;
    phone: string;
    lines: string[];
    isDefault: boolean;
}

const typeIcons: Record<AddressType, typeof Home> = {
    Home: Home,
    Office: Briefcase,
    Other: MapPin,
};

// CHANGE THIS to your actual header's rendered height in pixels.
const HEADER_HEIGHT = 96;
const TOP_GAP = 16;
const HEADER_OFFSET = HEADER_HEIGHT + TOP_GAP;
const BOTTOM_GAP = 24;

// Helper to get token from cookie
function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
}

// ---------- Address Card Component ----------
function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetDefault,
}: {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}) {
    const TypeIcon = typeIcons[address.type];

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-[#F0E2CC] bg-white p-5 sm:p-6 shadow-sm h-full">
            <div>
                <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#593102]">
                        <TypeIcon size={18} />
                    </div>
                    {address.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-green-700">
                            <CheckCircle size={12} />
                            DEFAULT
                        </span>
                    )}
                </div>

                <h3 className="mt-4 font-serif text-lg font-bold text-[#3C2015] break-words">
                    {address.label}
                </h3>

                <p className="mt-2 text-sm font-bold text-[#3C2015] break-words">{address.name}</p>
                <p className="text-sm text-[#3C2015]">{address.phone}</p>

                <div className="mt-2 space-y-0.5">
                    {address.lines.map((line, idx) => (
                        <p key={idx} className="text-sm text-[#8A7460] break-words">
                            {line}
                        </p>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2 pt-3 border-t border-[#F0E2CC]/55">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onEdit(address)}
                        className="flex items-center gap-1 text-xs font-medium text-[#3C2015] hover:text-[#593102] transition"
                    >
                        <Pencil size={13} />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(address.id)}
                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                </div>

                <div>
                    {address.isDefault ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#593102]/10 px-3 py-1.5 text-xs font-bold text-[#593102]">
                            <CheckCircle size={14} className="text-[#593102]" />
                            Default Address
                        </span>
                    ) : (
                        <button
                            onClick={() => onSetDefault(address.id)}
                            className="flex h-8 items-center justify-center rounded-lg border border-[#593102] px-3 text-xs font-bold text-[#593102] hover:bg-[#FFF8EF] transition"
                        >
                            Set Default
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ---------- Add New Address Card ----------
function AddNewAddressCard({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E7D3AE] bg-[#FFF8EF] p-6 text-center h-full min-h-[260px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#593102]">
                <Plus size={22} />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-[#3C2015]">
                Add New Address
            </h3>
            <p className="mt-2 text-sm text-[#8A7460] max-w-xs">
                Save new address to enjoy faster and hassle-free delivery.
            </p>
            <button
                onClick={onAdd}
                className="mt-5 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#593102] px-4 text-xs font-bold text-white hover:bg-[#C98715] transition"
            >
                <Plus size={14} />
                Add Address
            </button>
        </div>
    );
}

// ---------- Address Form Modal ----------
function AddressModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AddressFormData) => void;
    initialData?: Address | null;
    title: string;
}) {
    const [form, setForm] = useState<AddressFormData>({
        type: "Home",
        label: "Home",
        name: "",
        phone: "",
        lines: ["", ""],
        isDefault: false,
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setForm({
                type: initialData.type,
                label: initialData.label,
                name: initialData.name,
                phone: initialData.phone,
                lines: initialData.lines.length ? initialData.lines : ["", ""],
                isDefault: initialData.isDefault,
            });
        } else {
            setForm({
                type: "Home",
                label: "Home",
                name: "",
                phone: "",
                lines: ["", ""],
                isDefault: false,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleLineChange = (index: number, value: string) => {
        const newLines = [...form.lines];
        newLines[index] = value;
        setForm({ ...form, lines: newLines });
    };

    const addLine = () => {
        setForm({ ...form, lines: [...form.lines, ""] });
    };

    const removeLine = (index: number) => {
        if (form.lines.length <= 2) return;
        const newLines = form.lines.filter((_, i) => i !== index);
        setForm({ ...form, lines: newLines });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredLines = form.lines.filter((line) => line.trim() !== "");
        if (filteredLines.length === 0) {
            alert("Please add at least one address line.");
            return;
        }
        onSubmit({ ...form, lines: filteredLines });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div
                className="w-full max-w-lg rounded-3xl bg-white shadow-2xl my-auto max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-[#F0E2CC] px-4 sm:px-6 py-4 sm:py-5 bg-[#FFFCF8] rounded-t-3xl shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#593102]">
                            <MapPin size={20} />
                        </div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3C2015]">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-[#F0E2CC] transition-colors text-[#8A7460] hover:text-[#3C2015]"
                    >
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-6 space-y-5 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7460] mb-1.5">
                                Address Type
                            </label>
                            <select
                                value={form.type}
                                onChange={(e) =>
                                    setForm({ ...form, type: e.target.value as AddressType })
                                }
                                className="w-full rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] focus:outline-none focus:ring-2 focus:ring-[#593102]/40 transition"
                            >
                                <option value="Home">🏠 Home</option>
                                <option value="Office">💼 Office</option>
                                <option value="Other">📍 Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7460] mb-1.5">
                                Label
                            </label>
                            <input
                                type="text"
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                className="w-full rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#593102]/40 transition"
                                placeholder="My Home"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7460] mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#593102]/40 transition"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7460] mb-1.5">
                                Phone
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#593102]/40 transition"
                                placeholder="+91 98765 43210"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7460] mb-1.5">
                            Address
                        </label>
                        {form.lines.map((line, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    value={line}
                                    onChange={(e) => handleLineChange(idx, e.target.value)}
                                    placeholder={`Line ${idx + 1}`}
                                    className="flex-1 rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#593102]/40 transition"
                                />
                                {form.lines.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLine(idx)}
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addLine}
                            className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#593102] hover:text-[#C98715] transition"
                        >
                            <Plus size={16} />
                            Add line
                        </button>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                        <input
                            type="checkbox"
                            id="default-address"
                            checked={form.isDefault}
                            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                            className="h-5 w-5 rounded border-[#D4C5B2] text-[#593102] focus:ring-2 focus:ring-[#593102]/40 accent-[#593102] cursor-pointer"
                        />
                        <label htmlFor="default-address" className="text-sm font-medium text-[#3C2015] cursor-pointer">
                            Set as default
                        </label>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto flex-1 rounded-xl border border-[#F0E2CC] bg-white px-6 py-3 text-sm font-bold text-[#8A7460] hover:bg-[#FFF8EF] transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto flex-1 rounded-xl bg-[#593102] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#C98715] transition"
                        >
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const sidebarLinks = [
    { icon: Package, label: "My Orders", href: "/account" },
    { icon: MapPin, label: "My Addresses", href: "/address" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

// ---------- Sidebar Content Component ----------
function SidebarContent({ userData, onLinkClick }: { userData?: any; onLinkClick?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const fullName = userData?.fullName || getStoredSession()?.user?.name || "ShuddhVeda Customer";
    const email = userData?.email || "Not Provided";
    const initials = getInitials({ name: fullName, mobile: userData?.mobile || "" });

    const handleNavClick = (e: React.MouseEvent, href: string) => {
        if (onLinkClick) onLinkClick();

        const isPolicyLink = href.startsWith("/account/privacy");
        const isLoggedIn = Boolean(getStoredSession());

        if (!isPolicyLink && !isLoggedIn) {
            e.preventDefault();
            router.push(`/login?redirect=${encodeURIComponent(href)}`);
        }
    };

    return (
        <div className="space-y-4 w-full">
            <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 shadow-xs">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] text-base font-black text-[#ffffff] shadow-md">
                        {initials}
                    </div>
                    <p className="font-serif text-lg font-extrabold text-[#593102] capitalize">
                        {fullName}
                    </p>
                    <p className="text-xs text-[#6E5D4F] font-medium break-all">
                        {email !== "Not Provided" ? email : `+91 ${userData?.mobile || userData?.phone || ""}`}
                    </p>
                    <Link
                        href="/account/editprofile"
                        onClick={(e) => handleNavClick(e, "/account/editprofile")}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#D49313] hover:underline cursor-pointer"
                    >
                        <Pencil size={12} strokeWidth={2.5} className="inline-block shrink-0" />
                        Edit profile
                    </Link>
                </div>
            </div>

            <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 shadow-xs flex flex-col justify-between">
                <nav className="space-y-1.5">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === "/account"
                            ? pathname === "/account" || pathname === "/account/"
                            : pathname === link.href || pathname?.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`
                                    relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300
                                    ${isActive
                                        ? "bg-[#FAF0DC] text-[#593102] font-bold border-l-4 border-[#D49313] shadow-xs"
                                        : "text-[#593102] hover:bg-[#FAF5EC] hover:text-[#D49313]"
                                    }
                                `}
                            >
                                <Icon size={18} className={`shrink-0 ${isActive ? "text-[#D49313]" : "text-[#8D7F73]"}`} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-8 pt-4 border-t border-[#EADCC9]/60">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 cursor-pointer">
                        <LogOut size={18} className="shrink-0" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------- Main Page ----------
export default function MyAddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Profile State
    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        phone: "",
    });

    // 1. Profile Details GET API
    const fetchProfileDetails = async () => {
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

                setUserData({
                    fullName: user.name || user.full_name || "",
                    email: user.email || "",
                    mobile: user.mobile || user.phone || "",
                    phone: user.mobile || user.phone || "",
                });
            }
        } catch (err) {
            console.error("Error fetching profile details:", err);
        }
    };

    // ---- JS-driven sticky sidebar logic ----
    const rowRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
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
                setSidebarStyle({});
                setSidebarPinned(false);
                setPlaceholderHeight(0);
            } else if (desiredTopDoc + sidebarHeight + BOTTOM_GAP >= rowBottomDoc) {
                setSidebarStyle({
                    position: "absolute",
                    top: rowHeight - sidebarHeight,
                    left: 0,
                    width: sidebarWidth,
                });
                setSidebarPinned(true);
                setPlaceholderHeight(sidebarHeight);
            } else {
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
    }, [loading, addresses.length]);

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
    }, [loading, addresses.length]);

    // 2. Fetch Addresses GET API
    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/addresses/all`, {
                credentials: "include",
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setAddresses([]);
                    setToast({ type: "error", message: "Please log in to view addresses" });
                    return;
                }
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            const items = data.data || [];
            const list = items.map((item: any) => {
                const lines = [
                    item.address_line1,
                    item.address_line2,
                    `${item.city}, ${item.state}`,
                    `${item.pincode}, ${item.country}`,
                ].filter(Boolean);

                const typeMap: Record<string, AddressType> = {
                    home: "Home",
                    work: "Office",
                    other: "Other",
                };
                const type = typeMap[item.address_type?.toLowerCase()] || "Other";

                return {
                    id: item._id,
                    type,
                    label: type,
                    name: item.full_name || "",
                    phone: item.phone || "",
                    lines,
                    isDefault: item.is_default || false,
                };
            });

            setAddresses(list);
        } catch (err: any) {
            console.error("Error fetching addresses:", err);
            setToast({ type: "error", message: err.message || "Could not load addresses" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileDetails();
        fetchAddresses();
    }, []);

    const addAddress = async (data: AddressFormData) => {
        try {
            const payload = {
                full_name: data.name,
                phone: data.phone,
                address_line1: data.lines[0] || "",
                address_line2: data.lines[1] || "",
                city: data.lines[2]?.split(",")[0]?.trim() || "",
                state: data.lines[2]?.split(",")[1]?.trim() || "",
                pincode: data.lines[3]?.split(",")[0]?.trim() || "",
                country: data.lines[3]?.split(",")[1]?.trim() || "India",
                address_type: data.type.toLowerCase(),
                is_default: data.isDefault,
            };

            const res = await fetch(`${API_BASE_URL}/api/addresses/add`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to add address");
            }
            await fetchAddresses();
            setToast({ type: "success", message: "Address added" });
            setModalOpen(false);
        } catch (err: any) {
            setToast({ type: "error", message: err.message || "Failed to add address" });
        }
    };

    const updateAddress = async (id: string, data: AddressFormData) => {
        try {
            const payload = {
                full_name: data.name,
                phone: data.phone,
                address_line1: data.lines[0] || "",
                address_line2: data.lines[1] || "",
                city: data.lines[2]?.split(",")[0]?.trim() || "",
                state: data.lines[2]?.split(",")[1]?.trim() || "",
                pincode: data.lines[3]?.split(",")[0]?.trim() || "",
                country: data.lines[3]?.split(",")[1]?.trim() || "India",
                address_type: data.type.toLowerCase(),
                is_default: data.isDefault,
            };

            const res = await fetch(`${API_BASE_URL}/api/addresses/update/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to update address");
            }
            await fetchAddresses();
            setToast({ type: "success", message: "Address updated" });
            setModalOpen(false);
            setEditingAddress(null);
        } catch (err: any) {
            setToast({ type: "error", message: err.message || "Failed to update address" });
        }
    };

    const deleteAddress = async (id: string) => {
        if (!confirm("Delete this address?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/addresses/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to delete address");
            }
            await fetchAddresses();
            setToast({ type: "success", message: "Address deleted" });
        } catch (err: any) {
            setToast({ type: "error", message: err.message || "Failed to delete address" });
        }
    };

    const setDefaultAddress = async (id: string) => {
        try {
            const address = addresses.find((a) => a.id === id);
            if (!address) return;

            const payload = {
                full_name: address.name,
                phone: address.phone,
                address_line1: address.lines[0] || "",
                address_line2: address.lines[1] || "",
                city: address.lines[2]?.split(",")[0]?.trim() || "",
                state: address.lines[2]?.split(",")[1]?.trim() || "",
                pincode: address.lines[3]?.split(",")[0]?.trim() || "",
                country: address.lines[3]?.split(",")[1]?.trim() || "India",
                address_type: address.type.toLowerCase(),
                is_default: true,
            };

            const res = await fetch(`${API_BASE_URL}/api/addresses/update/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to set default");
            }
            await fetchAddresses();
            setToast({ type: "success", message: "Default address updated" });
        } catch (err: any) {
            setToast({ type: "error", message: err.message || "Failed to set default" });
        }
    };

    const filteredAddresses = addresses.filter((addr) =>
        addr.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.lines.join(" ").toLowerCase().includes(searchTerm.toLowerCase()) ||
        addr.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.touchAction = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [mobileMenuOpen]);

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
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBE4B8] text-sm font-bold text-[#593102]">
                            {getInitials({ name: userData.fullName || "Customer", mobile: userData.mobile || "" })}
                        </div>
                        <div>
                            <p className="font-serif text-sm font-bold text-[#3C2015] capitalize">
                                {userData.fullName || "Shuddhveda Customer"}
                            </p>
                            <p className="text-xs text-[#B59A78]">Account Navigation</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex h-10 items-center gap-2 rounded-xl bg-[#593102] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#C98715] transition"
                    >
                        <Menu size={16} />
                        Menu
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 pt-4 lg:pt-0">
                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div 
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md lg:hidden animate-in fade-in duration-300 transition-all touch-none overscroll-contain"
                        onClick={() => setMobileMenuOpen(false)}
                        onTouchMove={(e) => {
                            if (e.target === e.currentTarget) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <div 
                            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[330px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] shadow-[0_0_40px_rgba(89,49,2,0.25)] rounded-r-[28px] border-r-2 border-[#D49313]/40 overflow-y-auto flex flex-col animate-in slide-in-from-left duration-300 overscroll-contain touch-pan-y"
                            onClick={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-[#FFFDF9]/95 backdrop-blur-md z-10 flex items-center justify-between p-4 px-5 border-b border-[#EADCC9]/80 shadow-2xs">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF0DC] text-[#D49313] border border-[#D49313]/30">
                                        <Sparkles size={16} />
                                    </div>
                                    <h3 className="font-serif text-base font-extrabold text-[#593102] tracking-tight">Account Navigation</h3>
                                </div>
                                <button 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-full p-2 bg-[#FAF0DC] hover:bg-[#D49313] text-[#593102] hover:text-white transition-all shadow-2xs cursor-pointer active:scale-95"
                                    aria-label="Close menu"
                                >
                                    <X size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 pt-3" onClick={() => setMobileMenuOpen(false)}>
                                <SidebarContent userData={userData} onLinkClick={() => setMobileMenuOpen(false)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start relative">

                    {/* Desktop Sidebar (Pure CSS Sticky - 100% smooth, 0 jitter) */}
                    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto z-20">
                        <SidebarContent userData={userData} />
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6 flex-1 w-full min-w-0">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#593102]">
                                    My Addresses
                                </h1>
                                <p className="mt-0.5 text-sm text-[#6E5D4F] font-medium">
                                    Manage your delivery addresses and shipping preferences.
                                </p>
                            </div>
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search address"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-[#EADCC9] bg-white/90 backdrop-blur-sm pl-10 pr-4 text-sm text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] font-medium transition-colors"
                                    />
                                    <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D49313]" />
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingAddress(null);
                                        setModalOpen(true);
                                    }}
                                    className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 border border-[#FFD700]/30 cursor-pointer"
                                >
                                    <Plus size={16} />
                                    Add New Address
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-[#B59A78]">Loading...</div>
                        ) : (
                            <>
                                {filteredAddresses.length === 0 ? (
                                    <div className="text-center py-12 text-[#B59A78] bg-white rounded-2xl border border-[#F0E2CC]">
                                        {searchTerm ? "No matches found." : "No addresses saved yet."}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                        {filteredAddresses.map((address) => (
                                            <AddressCard
                                                key={address.id}
                                                address={address}
                                                onEdit={(addr) => {
                                                    setEditingAddress(addr);
                                                    setModalOpen(true);
                                                }}
                                                onDelete={deleteAddress}
                                                onSetDefault={setDefaultAddress}
                                            />
                                        ))}
                                        <AddNewAddressCard
                                            onAdd={() => {
                                                setEditingAddress(null);
                                                setModalOpen(true);
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AddressModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingAddress(null);
                }}
                onSubmit={(data) => {
                    if (editingAddress) {
                        updateAddress(editingAddress.id, data);
                    } else {
                        addAddress(data);
                    }
                }}
                initialData={editingAddress}
                title={editingAddress ? "Edit Address" : "Add New Address"}
            />

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-3 text-white shadow-lg flex items-center gap-3 ${
                    toast.type === "success" ? "bg-green-600" : "bg-red-600"
                }`}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="text-white/70 hover:text-white">
                        <X size={16} />
                    </button>
                </div>
            )}
        </section>
    );
}