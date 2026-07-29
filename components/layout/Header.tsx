"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import {
  AUTH_CHANGED_EVENT,
  AuthSession,
  clearSession,
  getStoredSession,
  API_BASE_URL,
} from "@/lib/auth";
import {
  FiHeart,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import PromoBar from "@/components/layout/TopBar";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop" },
  { title: "Gift Sets", href: "/giftsets" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const fetchWishlistCount = async () => {
    try {
      const sessionData = getStoredSession();
      if (!sessionData) {
        setWishlistCount(0);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        setWishlistCount(0);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch wishlist: ${res.status}`);
      }

      const data = await res.json();
      const products = data?.data?.products || [];
      const count = Array.isArray(products) ? products.length : 0;
      setWishlistCount(count);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      setWishlistCount(0);
    }
  };

  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAllCookies();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("session");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("session");
      clearSession();
      setSession(null);
      setAccountOpen(false);
      setOpen(false);
      setWishlistCount(0);
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      router.push("/login");
    }
  };

  useEffect(() => {
    function syncSession() {
      const sessionData = getStoredSession();
      setSession(sessionData);
      if (sessionData) {
        fetchWishlistCount();
      } else {
        setWishlistCount(0);
      }
    }

    function closeOnOutsideClick(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    const handleWishlistUpdate = (event: CustomEvent) => {
      setWishlistCount(event.detail.count);
    };

    syncSession();
    window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
    window.addEventListener("storage", syncSession);
    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener('wishlist-count-update', handleWishlistUpdate as EventListener);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncSession);
      window.removeEventListener("storage", syncSession);
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener('wishlist-count-update', handleWishlistUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    const sessionData = getStoredSession();
    if (sessionData) {
      const timer = setTimeout(() => {
        fetchWishlistCount();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    if (session) {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }
  }, [session]);

  function handleAccountClick() {
    if (!session) {
      const currentPath = `${pathname || "/"}${window.location.search || ""}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      setOpen(false);
      return;
    }
    setAccountOpen((value) => !value);
  }

  return (
    // Poora block (promo bar + nav bar) ab FIXED hai top pe — scroll pe bilkul nahi hilega
    <div className="fixed top-0 left-0 w-full z-50">
      <PromoBar />

      <header className="w-full bg-[#FFFCF8] border-b border-[#EFE7DF]">
        <div className="relative max-w-[1445px] mx-auto h-[62px] px-4 sm:px-6 lg:px-[52px] flex items-center justify-between">

          {/* Left Side: Mobile Menu Button / Desktop Logo */}
          <div className="flex items-center z-10">
            <button
              className="lg:hidden text-[#7A3F10] focus:outline-none p-1"
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
            >
              {open ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>

            <Link href="/" className="hidden lg:flex items-center flex-shrink-0">
              <Image
                src="/yellow logo.png"
                alt="ShuddhVeda Honey"
                width={66}
                height={66}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* Center Logo for Mobile/Tablet */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden flex items-center justify-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/yellow logo.png"
                alt="ShuddhVeda Honey"
                width={56}
                height={56}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`relative flex items-center gap-1 py-1 text-[16px] font-medium transition-all duration-300 ${
                    isActive
                      ? "text-[#D89B00]"
                      : "text-[#7A3F10] hover:text-[#D89B00]"
                  }`}
                >
                  {item.title}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#D89B00] transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4 sm:gap-[18px] z-10">
            <Link
              href="/wishlist"
              className="relative text-[#7A3F10] hover:text-[#D89B00] transition"
            >
              <FiHeart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={handleAccountClick}
                className="flex items-center gap-1 text-[#7A3F10] hover:text-[#D89B00] transition"
                aria-label="Open account menu"
                aria-expanded={accountOpen}
              >
                <FiUser size={22} />
                {session && (
                  <FiChevronDown
                    size={15}
                    className={`transition-transform ${accountOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {session && accountOpen && (
                <div className="absolute right-0 top-9 w-44 rounded-xl border border-[#EFE7DF] bg-white p-2 shadow-[0_16px_40px_rgba(45,58,27,0.15)] z-50">
                  <Link
                    href="/account"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#2D3A1B] hover:bg-[#FFF8EF]"
                  >
                    <FiUser size={16} />
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <FiX size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={openCart}
              className="relative text-[#7A3F10] transition hover:text-[#D89B00]"
              aria-label="Open cart"
            >
              <FiShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#2D3A1B] px-1.5 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-[450px]" : "max-h-0"
          }`}
        >
          <div className="bg-white border-t border-[#EFE7DF]">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center justify-between px-6 py-4 border-b border-[#F1ECE6] font-medium ${
                    isActive ? "text-[#D89B00]" : "text-[#7A3F10]"
                  }`}
                >
                  {item.title}
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#D89B00]" />
                  )}
                </Link>
              );
            })}

            {session && (
              <div className="border-t border-[#F1ECE6] px-6 py-4">
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-2 text-sm font-semibold text-[#2D3A1B]"
                >
                  Account
                  <FiUser size={18} />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-between py-2 text-sm font-semibold text-red-600 mt-2"
                >
                  Logout
                  <FiX size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}