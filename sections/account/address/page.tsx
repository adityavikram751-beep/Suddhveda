"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    X,
    CheckCircle,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

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
        <div className="flex flex-col rounded-2xl border border-[#F0E2CC] bg-white p-6">
            <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#2D3A1B]">
                    <TypeIcon size={18} />
                </div>
                {address.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-green-700">
                        <CheckCircle size={12} />
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
                    <button
                        onClick={() => onEdit(address)}
                        className="flex items-center gap-1 text-xs font-medium text-[#3C2015] hover:text-[#2D3A1B] transition"
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

                {/* Default → static badge, else "Set Default" */}
                {address.isDefault ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D3A1B]/10 px-3 py-1.5 text-xs font-bold text-[#2D3A1B]">
                        <CheckCircle size={14} className="text-[#2D3A1B]" />
                        Default Address
                    </span>
                ) : (
                    <button
                        onClick={() => onSetDefault(address.id)}
                        className="flex h-8 items-center justify-center rounded-lg border border-[#2D3A1B] px-4 text-xs font-bold text-[#2D3A1B] hover:bg-[#FFF8EF] transition"
                    >
                        Set Default
                    </button>
                )}
            </div>
        </div>
    );
}

// ---------- Add New Address Card ----------
function AddNewAddressCard({ onAdd }: { onAdd: () => void }) {
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
            <button
                onClick={onAdd}
                className="mt-5 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#2D3A1B] px-4 text-xs font-bold text-white hover:bg-[#C98715] transition"
            >
                <Plus size={14} />
                Add Address
            </button>
        </div>
    );
}

// ---------- Address Form Modal (Improved UI + Scroll Lock) ----------
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

    // Lock body scroll when modal opens
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-lg rounded-3xl bg-white shadow-2xl transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0E2CC] px-6 py-5 bg-[#FFFCF8] rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBE4B8] text-[#2D3A1B]">
                            <MapPin size={20} />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-[#3C2015]">
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
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
                                className="w-full rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] focus:outline-none focus:ring-2 focus:ring-[#2D3A1B]/40 transition"
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
                                className="w-full rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#2D3A1B]/40 transition"
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
                                className="w-full rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#2D3A1B]/40 transition"
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
                                className="w-full rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#2D3A1B]/40 transition"
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
                                    className="flex-1 rounded-xl border border-[#F0E2CC] bg-white px-4 py-3 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#2D3A1B]/40 transition"
                                />
                                {form.lines.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLine(idx)}
                                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addLine}
                            className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D3A1B] hover:text-[#C98715] transition"
                        >
                            <Plus size={16} />
                            Add line
                        </button>
                    </div>

                    {/* Set as default checkbox */}
                    <div className="flex items-center gap-3 pt-1">
                        <input
                            type="checkbox"
                            id="default-address"
                            checked={form.isDefault}
                            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                            className="h-5 w-5 rounded border-[#D4C5B2] text-[#2D3A1B] focus:ring-2 focus:ring-[#2D3A1B]/40 accent-[#2D3A1B] cursor-pointer"
                        />
                        <label htmlFor="default-address" className="text-sm font-medium text-[#3C2015] cursor-pointer">
                            Set as default
                        </label>
                    </div>

                    {/* Actions */}
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
                            className="w-full sm:w-auto flex-1 rounded-xl bg-[#2D3A1B] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#C98715] transition"
                        >
                            {initialData ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
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
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // ---------- Fetch Addresses ----------
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
        fetchAddresses();
    }, []);

    // ---------- Add Address ----------
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

    // ---------- Update Address ----------
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

    // ---------- Delete Address ----------
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

    // ---------- Set Default ----------
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
        addr.lines.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ---------- Render ----------
    return (
        <section className="min-h-screen bg-[#FFF8EF] py-8 md:py-12">
            <div className="mx-auto max-w-[1480px] -mt-4 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start">

                    {/* Sidebar */}
                    <aside className="self-start lg:sticky lg:top-20 w-full space-y-4">
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
                                    <Link href="/account/editprofile">Edit profile</Link>
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5 flex flex-col lg:min-h-[480px]">
                            <nav className="space-y-1">
                                <Link href="/account" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors">
                                    <Package size={18} className="shrink-0" />
                                    <span>My Orders</span>
                                </Link>
                                <Link href="/trackorder" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors">
                                    <Truck size={18} className="shrink-0" />
                                    <span>Track Order</span>
                                </Link>
                                <div className="relative flex items-center gap-3 rounded-xl bg-[#FFF2D8] px-4 py-2.5 text-sm font-medium text-[#2D3A1B]">
                                    <MapPin size={18} className="shrink-0" />
                                    <span>My Addresses</span>
                                    <span className="absolute right-0 top-0 h-full w-1 rounded-l-full bg-[#2D3A1B]" />
                                </div>
                                <Link href="/wishlist" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors">
                                    <Heart size={18} className="shrink-0" />
                                    <span>Wishlist</span>
                                </Link>
                                <Link href="/account/privacy" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D3A1B] hover:bg-[#FFF8EF] transition-colors">
                                    <Settings size={18} className="shrink-0" />
                                    <span>Policy Center</span>
                                </Link>
                            </nav>
                            <div className="mt-48 border-t border-[#F0E2CC]" />
                            <button className="flex w-full items-center gap-3 rounded-xl px-4 pt-4 pb-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                                <LogOut size={18} className="shrink-0" />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6">
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-11 w-full rounded-lg border border-[#F0E2CC] bg-white pl-10 pr-4 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#2D3A1B]/40"
                                    />
                                    <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#B59A78]" />
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingAddress(null);
                                        setModalOpen(true);
                                    }}
                                    className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#2D3A1B] px-4 text-sm font-bold text-white hover:bg-[#C98715] transition"
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
                                    <div className="text-center py-10 text-[#B59A78]">
                                        {searchTerm ? "No matches." : "No addresses saved yet."}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-3 text-white shadow-lg ${
                    toast.type === "success" ? "bg-green-600" : "bg-red-600"
                }`}>
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-4 text-white/70 hover:text-white">
                        <X size={16} />
                    </button>
                </div>
            )}
        </section>
    );
}