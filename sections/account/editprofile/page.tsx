"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Pencil,
  User,
  CalendarDays,
  Menu,
  X,
  Loader2,
  ShieldCheck,
  Trash2,
  Plus,
  Crown,
} from "lucide-react";
import { API_BASE_URL, getStoredSession } from "@/lib/auth";

import { usePathname, useRouter } from "next/navigation";

const sidebarLinks = [
  { icon: Package, label: "My Orders", href: "/account" },
  { icon: Crown, label: "Subscription Plans", href: "/account/subscriptions" },
  { icon: MapPin, label: "My Addresses", href: "/address" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
}

function getInitials(fullName: string) {
  if (!fullName) return "RS";
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------- Sidebar Content Component ----------
function SidebarContent({ userData, onLinkClick }: { userData: any; onLinkClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const fullName = userData?.fullName || getStoredSession()?.user?.name || "ShuddhVeda Customer";
  const email = userData?.email || "Not Provided";
  const mobile = userData?.mobile || userData?.phone || getStoredSession()?.user?.mobile || "";
  const initials = getInitials(fullName);

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
      {/* Profile Card */}
      <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 shadow-xs">
        <div className="flex flex-col items-center text-center gap-1.5">
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

      {/* Nav + Logout Card */}
      <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-5 flex flex-col justify-between shadow-xs">
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
                    ? "bg-[#FAF0DC] text-[#593102] font-extrabold shadow-xs"
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

// ---------- Main Edit Profile Page ----------
export default function EditProfilePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    phone: "",
    gender: "",
    DOB: "",
    password: "",
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const [mobileBarStyle, setMobileBarStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: 98,
    left: 0,
    right: 0,
  });

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
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

        setFormData({
          fullName: user.name || user.full_name || "",
          email: user.email || "",
          mobile: user.mobile || user.phone || "",
          phone: user.mobile || user.phone || "",
          gender: user.gender || "",
          DOB: user.DOB || user.dob || "",
          password: "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  // Address State & Handlers
  interface AddressItem {
    id: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    address_type: string;
  }

  interface AddressFormData {
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    address_type: string;
  }

  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(true);
  const [addressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    address_type: "home",
  });

  const resetAddressForm = () => {
    setAddressForm({
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      address_type: "home",
    });
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const token = getTokenFromCookie();
      const res = await fetch(`${API_BASE_URL}/api/addresses/all`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        const rawItems = data.data || data.addresses || (Array.isArray(data) ? data : []) || [];
        const list = rawItems.map((item: any) => ({
          id: item._id || item.id || item.address_id,
          address_line1: item.address_line1 || "",
          address_line2: item.address_line2 || "",
          city: item.city || "",
          state: item.state || "",
          pincode: item.pincode || "",
          country: item.country || "India",
          address_type: item.address_type || "home",
        }));
        setAddresses(list);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
    fetchAddresses();
  }, []);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getTokenFromCookie();
      const payload = {
        address_line1: addressForm.address_line1,
        address_line2: addressForm.address_line2 || "",
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        country: addressForm.country || "India",
        address_type: (addressForm.address_type || "home").toLowerCase(),
      };

      const url = editingAddressId
        ? `${API_BASE_URL}/api/addresses/update/${editingAddressId}`
        : `${API_BASE_URL}/api/addresses/add`;
      const method = editingAddressId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAddressModalOpen(false);
        setEditingAddressId(null);
        resetAddressForm();
        fetchAddresses();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Failed to save address");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const token = getTokenFromCookie();
      const res = await fetch(`${API_BASE_URL}/api/addresses/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = getTokenFromCookie();
      const payload: any = {
        email: formData.email,
        gender: formData.gender,
        DOB: formData.DOB,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(`${API_BASE_URL}/api/users/update/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({ type: "success", text: resData.message || "Profile updated successfully!" });
        setFormData((prev) => ({ ...prev, password: "" }));
      } else {
        throw new Error(resData.message || "Failed to update profile");
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  const initials = getInitials(formData.fullName);

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
    <section ref={sectionRef} className="relative min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] pb-12 pt-[106px] sm:pt-32 lg:pt-12 border-b border-[#EADCC9]/50">

      {/* MOBILE BAR */}
      <div
        ref={mobileBarRef}
        style={mobileBarStyle}
        className="z-30 bg-[#FFFDF9]/95 backdrop-blur-md py-2.5 px-4 lg:hidden border-b border-[#EADCC9] shadow-sm"
      >
        <div className="mx-auto max-w-[1480px] flex items-center justify-between rounded-2xl border border-[#EADCC9] bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] text-sm font-black text-white">
              {initials}
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-[#593102] capitalize">
                {formData.fullName || getStoredSession()?.user?.name || "ShuddhVeda Customer"}
              </p>
              <p className="text-xs text-[#6E5D4F] font-medium">Account Settings</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#D49313] to-[#593102] px-4 text-xs font-bold text-white shadow-sm hover:opacity-90 transition cursor-pointer"
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
                    <Settings size={16} />
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
                <SidebarContent userData={formData} onLinkClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start relative">
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto z-20">
            <SidebarContent userData={formData} />
          </aside>

          {/* MAIN CONTENT */}
          <div className="space-y-6 w-full min-w-0">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-2">
                <span>PROFILE SETTINGS</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#593102]">
                Edit Profile
              </h1>
              <p className="text-base text-[#6E5D4F] font-medium">
                Update your personal information and address details.
              </p>
            </div>

            {/* Profile Form Card */}
            <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xs">
              {loading ? (
                <div className="flex h-64 items-center justify-center text-[#D49313]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-6 sm:space-y-8">
                  {message && (
                    <div
                      className={`p-4 rounded-2xl text-sm font-bold ${
                        message.type === "success"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                          : "bg-red-50 text-red-800 border border-red-300"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-[#EADCC9]/60">
                      <User size={18} className="text-[#D49313]" />
                      <h2 className="font-serif text-base sm:text-lg font-bold text-[#593102]">
                        Personal Information
                      </h2>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-xs sm:text-sm font-bold text-[#593102]">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          readOnly
                          className="mt-1.5 h-11 w-full rounded-xl border border-[#EADCC9] bg-[#FAF5EC]/60 px-4 text-sm font-semibold text-[#593102] cursor-not-allowed outline-none select-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-[#593102]">
                          Mobile Number
                        </label>
                        <div className="mt-1.5 flex h-11 items-center justify-between rounded-xl border border-[#EADCC9] bg-[#FAF5EC]/60 px-4 select-none">
                          <span className="text-sm text-[#593102] font-bold">
                            {formData.mobile ? `+91 ${formData.mobile}` : "Not Available"}
                          </span>
                          {formData.mobile && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                              <ShieldCheck size={11} />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-[#593102]">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className="mt-1.5 h-11 w-full rounded-xl border border-[#EADCC9] bg-white px-4 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313] transition"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-[#593102]">
                          Date of Birth
                        </label>
                        <div className="relative mt-1.5">
                          <input
                            type="text"
                            name="DOB"
                            value={formData.DOB}
                            onChange={handleChange}
                            placeholder="DD/MM/YYYY"
                            className="h-11 w-full rounded-xl border border-[#EADCC9] bg-white px-4 pr-10 text-sm font-medium text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition"
                          />
                          <CalendarDays
                            size={16}
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D49313]"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs sm:text-sm font-bold text-[#593102]">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="mt-1.5 h-11 w-full rounded-xl border border-[#EADCC9] bg-white px-4 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313] transition cursor-pointer"
                        >
                          <option value="" disabled>
                            Select Gender
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 pt-4 border-t border-[#EADCC9]/60">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-9 flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white px-5 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all duration-300 border border-[#FFD700]/30 disabled:opacity-60 cursor-pointer active:scale-95"
                    >
                      {saving && <Loader2 size={14} className="animate-spin" />}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={fetchProfileDetails}
                      className="flex h-9 flex-1 sm:flex-none items-center justify-center rounded-xl border border-[#EADCC9] px-4 text-[11px] font-bold uppercase tracking-wider text-[#593102] hover:bg-[#FAF0DC] transition cursor-pointer active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Address Management Section */}
            <div className="rounded-3xl border-2 border-[#EADCC9]/80 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#EADCC9]/60">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin size={18} className="text-[#D49313] shrink-0" />
                  <h2 className="font-serif text-[15px] sm:text-xl font-bold text-[#593102] whitespace-nowrap">
                    <span className="sm:hidden">Saved Addresses</span>
                    <span className="hidden sm:inline">My Saved Addresses</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetAddressForm();
                    setEditingAddressId(null);
                    setAddressModalOpen(true);
                  }}
                  className="flex h-8 sm:h-10 shrink-0 items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-gradient-to-r from-[#D49313] to-[#593102] px-3 sm:px-4 text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition cursor-pointer shadow-xs border border-[#FFD700]/30 active:scale-95 whitespace-nowrap"
                >
                  <Plus size={13} className="shrink-0" />
                  <span className="sm:hidden">Add New</span>
                  <span className="hidden sm:inline">Add New Address</span>
                </button>
              </div>

              {loadingAddresses ? (
                <div className="flex h-32 items-center justify-center text-[#D49313]">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-10 text-[#6E5D4F] font-medium bg-[#FAF5EC]/40 rounded-2xl border border-dashed border-[#EADCC9]">
                  No saved addresses found. Click "Add New Address" to add one.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="rounded-2xl border border-[#EADCC9] bg-white p-4 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block rounded-md bg-[#FAF0DC] px-2.5 py-1 text-[11px] font-extrabold uppercase text-[#593102]">
                            {addr.address_type}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#593102] break-words">
                          {addr.address_line1}
                        </p>
                        {addr.address_line2 && (
                          <p className="text-xs text-[#6E5D4F] break-words">
                            {addr.address_line2}
                          </p>
                        )}
                        <p className="text-xs text-[#8D7F73]">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-[#8D7F73]">{addr.country}</p>
                      </div>

                      <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#EADCC9]/50">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddressId(addr.id);
                            setAddressForm({
                              address_line1: addr.address_line1,
                              address_line2: addr.address_line2,
                              city: addr.city,
                              state: addr.state,
                              pincode: addr.pincode,
                              country: addr.country,
                              address_type: addr.address_type,
                            });
                            setAddressModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-[#593102] hover:text-[#D49313] transition cursor-pointer"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-[#EADCC9] pb-4">
              <h3 className="font-serif text-xl font-bold text-[#593102]">
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="rounded-full p-1.5 hover:bg-[#FAF0DC] text-[#593102] transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#593102] mb-1">
                  Address Type
                </label>
                <select
                  value={addressForm.address_type}
                  onChange={(e) => setAddressForm({ ...addressForm, address_type: e.target.value })}
                  className="w-full h-11 rounded-xl border border-[#EADCC9] bg-white px-3 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313] cursor-pointer"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#593102] mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.address_line1}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full h-11 rounded-xl border border-[#EADCC9] bg-white px-4 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#593102] mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={addressForm.address_line2}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                  placeholder="Near Market"
                  className="w-full h-11 rounded-xl border border-[#EADCC9] bg-white px-4 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#593102] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full h-11 rounded-xl border border-[#EADCC9] bg-white px-4 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#593102] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full h-11 rounded-xl border border-[#EADCC9] bg-white px-4 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#593102] mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="400001"
                    className="w-full h-11 rounded-xl border border-[#EADCC9] bg-white px-4 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#593102] mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    placeholder="India"
                    className="w-full h-11 rounded-xl border border-[#EADCC9] bg-white px-4 text-sm font-medium text-[#593102] focus:outline-none focus:border-[#D49313]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#EADCC9]">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="rounded-xl border border-[#EADCC9] px-5 py-2.5 text-xs font-bold text-[#593102] hover:bg-[#FAF0DC] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#D49313] to-[#593102] px-6 py-2.5 text-xs font-bold text-white hover:opacity-90 transition cursor-pointer shadow-xs"
                >
                  {editingAddressId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}