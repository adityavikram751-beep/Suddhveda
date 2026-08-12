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
} from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

const sidebarLinks = [
  { icon: Package, label: "My Orders", href: "/account" },
  { icon: MapPin, label: "My Addresses", href: "/address" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Settings, label: "Policy Center", href: "/account/privacy" },
];

// CHANGE THIS to your actual header's rendered height in pixels.
const HEADER_HEIGHT = 96;
// Extra breathing room between the header and the sidebar when it's stuck.
const TOP_GAP = 16;
const HEADER_OFFSET = HEADER_HEIGHT + TOP_GAP;
const BOTTOM_GAP = 24;

// Helper to get token from cookie
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
  const fullName = userData?.fullName || "Rahul Sharma";
  const email = userData?.email || "Not Provided";
  const initials = getInitials(fullName);

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="space-y-4 w-full">
      {/* Profile Card */}
      <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5 shadow-sm">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBE4B8] text-base font-bold text-[#593102]">
            {initials}
          </div>
          <p className="font-serif text-lg font-bold text-[#3C2015] capitalize">
            {fullName}
          </p>
          <p className="text-xs text-[#B59A78] break-all">
            {email !== "Not Provided" ? email : `+91 ${userData?.mobile || userData?.phone || ""}`}
          </p>
          <Link
            href="/account/editprofile"
            onClick={handleClick}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#593102] hover:underline"
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
                onClick={handleClick}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#593102] hover:bg-[#FFF8EF] transition-colors"
              >
                <Icon size={18} className="shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-[#F0E2CC]">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
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

  // ---- JS-driven sticky sidebar (DESKTOP LOGIC UNTOUCHED) ----
  const rowRef = useRef<HTMLDivElement>(null); // the grid row containing aside + main content
  const sidebarRef = useRef<HTMLDivElement>(null); // the aside itself
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

      // Disable on mobile/tablet where the sidebar is hidden anyway
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
        // Not scrolled far enough yet: normal document flow
        setSidebarStyle({});
        setSidebarPinned(false);
        setPlaceholderHeight(0);
      } else if (desiredTopDoc + sidebarHeight + BOTTOM_GAP >= rowBottomDoc) {
        // Reached the bottom of the content column: pin to bottom of row
        setSidebarStyle({
          position: "absolute",
          top: rowHeight - sidebarHeight,
          left: 0,
          width: sidebarWidth,
        });
        setSidebarPinned(true);
        setPlaceholderHeight(sidebarHeight);
      } else {
        // Actively sticking to viewport, just under the header
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
  }, [loading]);

  // Fetch Profile Details
  const fetchProfileDetails = async () => {
    setLoading(true);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Handler for PUT Update Profile API
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
              {initials}
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-[#3C2015] capitalize">
                {formData.fullName || "Rahul Sharma"}
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

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#FFF8EF] shadow-2xl overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#FFF8EF] z-10 flex items-center justify-between p-4 pb-2 border-b border-[#F0E2CC]">
                <h3 className="font-serif text-lg font-bold text-[#3C2015]">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-2 hover:bg-[#F0E2CC] text-[#8A7460]"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pt-2" onClick={() => setMobileMenuOpen(false)}>
                <SidebarContent userData={formData} onLinkClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <div ref={rowRef} className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] items-start relative">
          {/* Placeholder: reserves the column width/height in the grid row
              while the real sidebar below is pinned (fixed/absolute) and
              therefore removed from normal document flow. Prevents the
              main content from jumping. */}
          {sidebarPinned && (
            <div
              className="hidden lg:block w-full"
              style={{ height: placeholderHeight }}
            />
          )}

          {/* --- DESKTOP SIDEBAR (JS-driven sticky) --- */}
          <aside
            ref={sidebarRef}
            style={sidebarStyle}
            className="hidden lg:block w-full max-h-[calc(100vh-96px-24px)] overflow-y-auto"
          >
            <SidebarContent userData={formData} />
          </aside>

          {/* --- MAIN CONTENT --- */}
          <div className="space-y-6 w-full min-w-0">
            {/* Header */}
            <div className="space-y-1">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3C2015]">
                Edit Profile
              </h1>
              <p className="text-base text-[#B59A78]">
                Update your personal information and login details.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-[#F0E2CC] bg-white p-5 sm:p-6 md:p-8 shadow-sm">
              {loading ? (
                <div className="flex h-64 items-center justify-center text-[#593102]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-6 sm:space-y-8">
                  {/* Status Message */}
                  {message && (
                    <div
                      className={`p-4 rounded-xl text-sm font-semibold ${
                        message.type === "success"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  {/* Personal Information Section */}
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-[#F0E2CC]">
                      <User size={18} className="text-[#3C2015]" />
                      <h2 className="font-serif text-base sm:text-lg font-bold text-[#3C2015]">
                        Personal Information
                      </h2>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-[#3C2015]">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          readOnly
                          className="mt-1.5 h-11 w-full rounded-lg border border-[#F0E2CC] bg-gray-50 px-3 text-sm text-[#3C2015] cursor-not-allowed outline-none select-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-[#3C2015]">
                          Mobile Number
                        </label>
                        <div className="mt-1.5 flex h-11 items-center justify-between rounded-lg border border-[#F0E2CC] bg-gray-50 px-3 select-none">
                          <span className="text-sm text-[#3C2015] font-medium">
                            {formData.mobile ? `+91 ${formData.mobile}` : "Not Available"}
                          </span>
                          {formData.mobile && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                              <ShieldCheck size={11} />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-[#3C2015]">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className="mt-1.5 h-11 w-full rounded-lg border border-[#F0E2CC] bg-white px-3 text-sm text-[#3C2015] focus:outline-none focus:ring-2 focus:ring-[#593102]/40 transition"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-[#3C2015]">
                          Date of Birth
                        </label>
                        <div className="relative mt-1.5">
                          <input
                            type="text"
                            name="DOB"
                            value={formData.DOB}
                            onChange={handleChange}
                            placeholder="DD/MM/YYYY"
                            className="h-11 w-full rounded-lg border border-[#F0E2CC] bg-white px-3 pr-9 text-sm text-[#3C2015] placeholder:text-[#B59A78] focus:outline-none focus:ring-2 focus:ring-[#593102]/40 transition"
                          />
                          <CalendarDays
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#B59A78]"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs sm:text-sm font-semibold text-[#3C2015]">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="mt-1.5 h-11 w-full rounded-lg border border-[#F0E2CC] bg-white px-3 text-sm text-[#3C2015] focus:outline-none focus:ring-2 focus:ring-[#593102]/40 transition"
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
                  <div className="flex items-center gap-3 pt-4 border-t border-[#F0E2CC]">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-11 flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-[#593102] px-6 text-sm font-bold text-white hover:bg-[#C98715] transition disabled:opacity-60"
                    >
                      {saving && <Loader2 size={16} className="animate-spin" />}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={fetchProfileDetails}
                      className="flex h-11 flex-1 sm:flex-none items-center justify-center rounded-lg border border-[#F0E2CC] px-6 text-sm font-bold text-[#3C2015] hover:bg-[#FFF8EF] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}