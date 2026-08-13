"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import {
  AUTH_CHANGED_EVENT,
  AuthSession,
  clearSession,
  ensureValidSession,
  getStoredSession,
  API_BASE_URL,
} from "@/lib/auth";
import {
  getProductsFromResponse,
  getProductId,
  getProductName,
  getCategoryName,
} from "@/lib/api-products";
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
  { title: "Subcribe", href: "/subscribe" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const { openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const headerWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadShopProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const list = getProductsFromResponse(data);
        if (list && list.length > 0) {
          setApiProducts(list);
        }
      } catch (err) {
        console.error("Error fetching mega menu products:", err);
      }
    }
    loadShopProducts();
  }, []);

  const { multiFloraProducts, monoFloraProducts } = useMemo(() => {
    const multi: any[] = [];
    const mono: any[] = [];

    apiProducts.forEach((product) => {
      const name = getProductName(product).toLowerCase();
      const cat = getCategoryName(product).toLowerCase();
      if (name.includes("himalayan") || name.includes("forest") || cat.includes("multi")) {
        multi.push(product);
      } else {
        mono.push(product);
      }
    });

    return {
      multiFloraProducts: multi,
      monoFloraProducts: mono.length > 0 ? mono : apiProducts,
    };
  }, [apiProducts]);

  // ✅ Fetch wishlist count with 401 Session Expiry Check
  const fetchWishlistCount = async () => {
    try {
      const sessionData = getStoredSession();
      if (!sessionData) {
        setWishlistCount(0);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/wishlist/product-count`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 🔴 AGAR COOKIE EXPIRE HO GAYI HOGI TOH BACKEND 401 DEGA -> SESSION CLEAR KAR DO
      if (res.status === 401) {
        clearSession();
        setSession(null);
        setWishlistCount(0);
        setCartCount(0);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch wishlist count: ${res.status}`);
      }

      const data = await res.json();
      let count = 0;
      if (data?.data?.count !== undefined) {
        count = data.data.count;
      } else if (data?.count !== undefined) {
        count = data.count;
      } else if (data?.data?.total !== undefined) {
        count = data.data.total;
      } else if (data?.total !== undefined) {
        count = data.total;
      } else if (data?.data?.totalItems !== undefined) {
        count = data.data.totalItems;
      } else if (data?.totalItems !== undefined) {
        count = data.totalItems;
      } else {
        for (const key of Object.keys(data)) {
          if (typeof data[key] === 'number') {
            count = data[key];
            break;
          }
          if (data[key] && typeof data[key] === 'object' && data[key] !== null) {
            for (const subKey of Object.keys(data[key])) {
              if (typeof data[key][subKey] === 'number') {
                count = data[key][subKey];
                break;
              }
            }
          }
        }
      }

      setWishlistCount(count);
    } catch (error) {
      setWishlistCount(0);
    }
  };

  // ✅ Fetch cart count with 401 Session Expiry Check
  const fetchCartCount = async () => {
    try {
      const sessionData = getStoredSession();
      if (!sessionData) {
        setCartCount(0);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/cart/count`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 🔴 AGAR COOKIE EXPIRE HO GAYI HOGI TOH BACKEND 401 DEGA -> SESSION CLEAR KAR DO
      if (res.status === 401) {
        clearSession();
        setSession(null);
        setWishlistCount(0);
        setCartCount(0);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch cart count: ${res.status}`);
      }

      const data = await res.json();
      let count = 0;
      if (typeof data?.data?.totalCount === "number") {
        count = data.data.totalCount;
      } else if (typeof data?.totalCount === "number") {
        count = data.totalCount;
      } else if (data?.data?.cartCount !== undefined || data?.data?.giftCartCount !== undefined) {
        count = (Number(data.data?.cartCount) || 0) + (Number(data.data?.giftCartCount) || 0);
      } else if (data?.data?.count !== undefined) {
        count = data.data.count;
      } else if (data?.count !== undefined) {
        count = data.count;
      } else if (data?.data?.totalItems !== undefined) {
        count = data.data.totalItems;
      } else if (data?.totalItems !== undefined) {
        count = data.totalItems;
      } else if (data?.data?.total !== undefined) {
        count = data.data.total;
      } else if (data?.total !== undefined) {
        count = data.total;
      } else {
        for (const key of Object.keys(data)) {
          if (typeof data[key] === 'number') {
            count = data[key];
            break;
          }
          if (data[key] && typeof data[key] === 'object' && data[key] !== null) {
            for (const subKey of Object.keys(data[key])) {
              if (typeof data[key][subKey] === 'number') {
                count = data[key][subKey];
                break;
              }
            }
          }
        }
      }

      setCartCount(count);
    } catch (error) {
      setCartCount(0);
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
      setCartCount(0);
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      router.push("/login");
    }
  };

  useEffect(() => {
    async function syncSession() {
      const sessionData = await ensureValidSession();
      setSession(sessionData);
      if (sessionData) {
        fetchWishlistCount();
        fetchCartCount();
      } else {
        setWishlistCount(0);
        setCartCount(0);
      }
    }

    function closeOnOutsideClick(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
      if (
        shopMenuRef.current &&
        !shopMenuRef.current.contains(event.target as Node)
      ) {
        setShopMenuOpen(false);
      }
    }

    const handleWishlistUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.count !== undefined) {
        setWishlistCount(customEvent.detail.count);
      } else {
        fetchWishlistCount();
      }
    };

    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.count !== undefined) {
        setCartCount(customEvent.detail.count);
      } else {
        fetchCartCount();
      }
    };

    syncSession();
    window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
    window.addEventListener("storage", syncSession);
    document.addEventListener("mousedown", closeOnOutsideClick);
    window.addEventListener("wishlist-count-update", handleWishlistUpdate);
    window.addEventListener("cart-count-update", handleCartUpdate);
    window.addEventListener("trigger-live-update", fetchCartCount);
    window.addEventListener("cart-updated", fetchCartCount);
    window.addEventListener("cartUpdated", fetchCartCount);
    window.addEventListener("cart_updated", fetchCartCount);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncSession);
      window.removeEventListener("storage", syncSession);
      document.removeEventListener("mousedown", closeOnOutsideClick);
      window.removeEventListener("wishlist-count-update", handleWishlistUpdate);
      window.removeEventListener("cart-count-update", handleCartUpdate);
      window.removeEventListener("trigger-live-update", fetchCartCount);
      window.removeEventListener("cart-updated", fetchCartCount);
      window.removeEventListener("cartUpdated", fetchCartCount);
      window.removeEventListener("cart_updated", fetchCartCount);
    };
  }, []);

  useEffect(() => {
    const sessionData = getStoredSession();
    if (sessionData) {
      const timer = setTimeout(() => {
        fetchWishlistCount();
        fetchCartCount();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    if (session) {
      fetchWishlistCount();
      fetchCartCount();
    } else {
      setWishlistCount(0);
      setCartCount(0);
    }
  }, [session]);

  useEffect(() => {
    function updatePadding() {
      if (headerWrapperRef.current) {
        const height = headerWrapperRef.current.offsetHeight;
        document.body.style.paddingTop = `${height}px`;
      }
    }

    updatePadding();
    window.addEventListener("resize", updatePadding);

    const observer = new ResizeObserver(updatePadding);
    if (headerWrapperRef.current) observer.observe(headerWrapperRef.current);

    return () => {
      window.removeEventListener("resize", updatePadding);
      observer.disconnect();
    };
  }, [open]);

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
    <div ref={headerWrapperRef} className="fixed top-0 left-0 w-full z-40">
      <PromoBar />

      <header className="w-full bg-[#FFFCF8] border-b border-[#EFE7DF]">
        <div className="relative max-w-[1445px] mx-auto h-[62px] px-4 sm:px-6 lg:px-[52px] flex items-center justify-between">
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

          <nav className="hidden lg:flex items-center gap-12">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              if (item.title === "Shop") {
                return (
                  <div
                    key={item.title}
                    ref={shopMenuRef}
                    className="relative group py-2"
                    onMouseEnter={() => setShopMenuOpen(true)}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setShopMenuOpen((prev) => !prev)}
                      className={`relative flex items-center gap-1 text-[16px] font-medium transition-all duration-300 ${
                        isActive
                          ? "text-[#D89B00]"
                          : "text-[#7A3F10] hover:text-[#D89B00]"
                      }`}
                    >
                      {item.title}
                      <FiChevronDown size={14} className={`transition-transform duration-200 ${shopMenuOpen ? "rotate-180 text-[#D89B00]" : ""}`} />
                      <span
                        className={`absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#D89B00] transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </Link>

                    {/* 🟢 Premium Shop Mega Menu Popup UI */}
                    {shopMenuOpen && (
                      <div
                        className="fixed top-[90px] left-1/2 -translate-x-1/2 w-[960px] max-w-[95vw] z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-2"
                        onMouseEnter={() => setShopMenuOpen(true)}
                      >
                        <div className="relative overflow-hidden rounded-3xl border border-[#E8DED1] bg-[#FFFDF9] p-8 sm:p-10 shadow-[0_30px_70px_-15px_rgba(89,49,2,0.18)]">
                          {/* Top Golden Brand Accent Bar */}
                          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#D89B00] via-[#593102] to-[#D89B00]" />

                          {/* Top Header Title & View All Link */}
                          <div className="mb-6 flex items-center justify-between border-b border-[#F0E4D0] pb-4">
                            <Link
                              href="/shop"
                              onClick={() => setShopMenuOpen(false)}
                              className="group flex items-center gap-3"
                            >
                              <span className="font-serif text-[26px] font-bold text-[#593102] group-hover:text-[#C98715] transition-colors">
                                Shop All Honey
                              </span>
                              <span className="text-[13px] font-semibold text-[#8C6239] group-hover:text-[#593102] group-hover:translate-x-1 transition-all flex items-center gap-1">
                                View Full Collection &rarr;
                              </span>
                            </Link>
                          </div>

                          <div className="grid grid-cols-12 gap-8 items-stretch">
                            {/* Multi-Flora Column */}
                            <div className="col-span-3">
                              <span className="mb-4 inline-block rounded-full bg-[#F5ECDF] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8C6239]">
                                Multi-Flora
                              </span>
                              <div className="flex flex-col gap-3">
                                {multiFloraProducts.length > 0 ? (
                                  multiFloraProducts.map((p) => {
                                    const id = getProductId(p);
                                    const name = getProductName(p);
                                    return (
                                      <Link
                                        key={id || name}
                                        href={`/shop/products/${id}`}
                                        onClick={() => setShopMenuOpen(false)}
                                        className="group/item flex items-center gap-2 text-[14px] font-semibold text-[#2C221E] hover:text-[#593102] transition-all"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#D89B00] group-hover/item:scale-150 transition-transform" />
                                        <span className="group-hover/item:translate-x-1 transition-transform">
                                          {name}
                                        </span>
                                      </Link>
                                    );
                                  })
                                ) : (
                                  <Link
                                    href="/shop"
                                    onClick={() => setShopMenuOpen(false)}
                                    className="group/item flex items-center gap-2 text-[14px] font-semibold text-[#2C221E] hover:text-[#593102] transition-all"
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#D89B00]" />
                                    <span>Himalayan Forest Honey</span>
                                  </Link>
                                )}
                              </div>
                            </div>

                            {/* Mono-Flora Column */}
                            <div className="col-span-5 border-l border-[#F0E4D0] pl-6">
                              <span className="mb-4 inline-block rounded-full bg-[#F5ECDF] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#8C6239]">
                                Mono-Flora
                              </span>
                              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                {monoFloraProducts.length > 0 ? (
                                  monoFloraProducts.map((p) => {
                                    const id = getProductId(p);
                                    const name = getProductName(p);
                                    return (
                                      <Link
                                        key={id || name}
                                        href={`/shop/products/${id}`}
                                        onClick={() => setShopMenuOpen(false)}
                                        className="group/item flex items-center gap-2 text-[14px] font-semibold text-[#2C221E] hover:text-[#593102] transition-all"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#D89B00] group-hover/item:scale-150 transition-transform shrink-0" />
                                        <span className="group-hover/item:translate-x-1 transition-transform line-clamp-1">
                                          {name}
                                        </span>
                                      </Link>
                                    );
                                  })
                                ) : (
                                  <>
                                    <Link href="/shop" onClick={() => setShopMenuOpen(false)} className="text-[14px] font-semibold text-[#2C221E] hover:text-[#593102]">Ajwain Honey</Link>
                                    <Link href="/shop" onClick={() => setShopMenuOpen(false)} className="text-[14px] font-semibold text-[#2C221E] hover:text-[#593102]">Lychee Honey</Link>
                                    <Link href="/shop" onClick={() => setShopMenuOpen(false)} className="text-[14px] font-semibold text-[#2C221E] hover:text-[#593102]">Fennel Honey</Link>
                                    <Link href="/shop" onClick={() => setShopMenuOpen(false)} className="text-[14px] font-semibold text-[#2C221E] hover:text-[#593102]">Jamun Honey</Link>
                                    <Link href="/shop" onClick={() => setShopMenuOpen(false)} className="text-[14px] font-semibold text-[#2C221E] hover:text-[#593102]">Mustard Honey</Link>
                                    <Link href="/shop" onClick={() => setShopMenuOpen(false)} className="text-[14px] font-semibold text-[#2C221E] hover:text-[#593102]">Eucalyptus Honey</Link>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Featured Honey Jars Spotlight Box */}
                            <div className="col-span-4 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#F6EDE2] to-[#EBE0CE] p-4 border border-[#E5DACB] shadow-inner relative overflow-hidden group/card">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#593102] bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full w-fit">
                                100% Raw & Organic
                              </span>
                              <div className="relative h-[130px] w-full my-2">
                                <Image
                                  src="/Upcoming.png"
                                  alt="ShuddhVeda Pure Honey Jars"
                                  fill
                                  className="object-contain transition-transform duration-500 group-hover/card:scale-105"
                                />
                              </div>
                              <span className="text-[12px] font-bold text-[#593102] text-center block">
                                Directly From Natural Hives 🍯
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

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

          <div className="flex items-center gap-4 sm:gap-[18px] z-10">
            <Link
              href="/wishlist"
              className="relative text-[#7A3F10] hover:text-[#D89B00] transition"
            >
              <FiHeart size={22} />
              <span data-wishlist-count={wishlistCount} />
              {wishlistCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                  {wishlistCount}
                </span>
              ) : null}
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
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#593102] hover:bg-[#FFF8EF]"
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
              <span data-cart-count={cartCount} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#593102] px-1.5 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-[800px]" : "max-h-0"
          }`}
        >
          <div className="bg-[#FAF5EE] border-t border-[#EFE7DF] px-4 py-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              if (item.title === "Shop") {
                return (
                  <div key={item.title} className="border-b border-[#E8DED1]">
                    <div className="flex items-center justify-between py-3.5 px-2">
                      <Link
                        href="/shop"
                        onClick={() => setOpen(false)}
                        className={`text-[16px] font-bold ${
                          isActive ? "text-[#D89B00]" : "text-[#593102]"
                        }`}
                      >
                        Shop
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileShopOpen((prev) => !prev)}
                        className="p-2.5 text-[#593102] hover:text-[#D89B00] cursor-pointer"
                        aria-label="Toggle Shop mobile menu"
                      >
                        <FiChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            mobileShopOpen ? "rotate-180 text-[#D89B00]" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Expandable Mobile Submenu */}
                    {mobileShopOpen && (
                      <div className="pb-4 pl-3 pr-2 space-y-3 bg-[#FFFDF9] rounded-xl p-3.5 mb-2 border border-[#E8DED1]">
                        <Link
                          href="/shop"
                          onClick={() => {
                            setOpen(false);
                            setMobileShopOpen(false);
                          }}
                          className="block text-[14px] font-bold text-[#593102] underline"
                        >
                          Shop All Honey &rarr;
                        </Link>

                        {/* Multi Flora */}
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E826B] block mb-1.5 border-b border-[#E8DED1] pb-0.5">
                            Multi-Flora
                          </span>
                          <div className="pl-1 space-y-2 mt-1">
                            {multiFloraProducts.length > 0 ? (
                              multiFloraProducts.map((p) => {
                                const id = getProductId(p);
                                const name = getProductName(p);
                                return (
                                  <Link
                                    key={id || name}
                                    href={`/shop/products/${id}`}
                                    onClick={() => {
                                      setOpen(false);
                                      setMobileShopOpen(false);
                                    }}
                                    className="block text-[13px] font-semibold text-[#2C221E] hover:text-[#593102]"
                                  >
                                    • {name}
                                  </Link>
                                );
                              })
                            ) : (
                              <Link
                                href="/shop"
                                onClick={() => {
                                  setOpen(false);
                                  setMobileShopOpen(false);
                                }}
                                className="block text-[13px] font-semibold text-[#2C221E] hover:text-[#593102]"
                              >
                                • Himalayan Forest Honey
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Mono Flora */}
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E826B] block mb-1.5 border-b border-[#E8DED1] pb-0.5">
                            Mono-Flora
                          </span>
                          <div className="pl-1 grid grid-cols-1 gap-2 mt-1">
                            {monoFloraProducts.length > 0 ? (
                              monoFloraProducts.map((p) => {
                                const id = getProductId(p);
                                const name = getProductName(p);
                                return (
                                  <Link
                                    key={id || name}
                                    href={`/shop/products/${id}`}
                                    onClick={() => {
                                      setOpen(false);
                                      setMobileShopOpen(false);
                                    }}
                                    className="block text-[13px] font-semibold text-[#2C221E] hover:text-[#593102]"
                                  >
                                    • {name}
                                  </Link>
                                );
                              })
                            ) : (
                              <>
                                <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#2C221E]">• Ajwain Honey</Link>
                                <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#2C221E]">• Lychee Honey</Link>
                                <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#2C221E]">• Fennel Honey</Link>
                                <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#2C221E]">• Jamun Honey</Link>
                                <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#2C221E]">• Mustard Honey</Link>
                                <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#2C221E]">• Eucalyptus Honey</Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center justify-between px-2 py-3.5 border-b border-[#E8DED1] text-[16px] font-semibold ${
                    isActive ? "text-[#D89B00]" : "text-[#593102]"
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
                  className="flex items-center justify-between py-2 text-sm font-semibold text-[#593102]"
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