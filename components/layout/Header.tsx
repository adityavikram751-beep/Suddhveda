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
  { title: "Subscribe", href: "/subscribe" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const { openCart, itemCount: ctxItemCount } = useCart();
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

  // ---------- Fetch Wishlist Count ----------
  const fetchWishlistCount = async () => {
    try {
      const sessionData = getStoredSession();
      if (!sessionData) {
        const { getGuestWishlist } = await import("@/lib/wishlist");
        const guestIds = getGuestWishlist();
        setWishlistCount(guestIds.length);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/wishlist/product-count`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        const { getGuestWishlist } = await import("@/lib/wishlist");
        const guestIds = getGuestWishlist();
        setWishlistCount(guestIds.length);
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
      }
      setWishlistCount(count);
    } catch (error) {
      const { getGuestWishlist } = await import("@/lib/wishlist");
      setWishlistCount(getGuestWishlist().length);
    }
  };

  // ---------- Fetch Cart Count ----------
  const fetchCartCount = async () => {
    try {
      const sessionData = getStoredSession();
      if (!sessionData) {
        setCartCount(ctxItemCount);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/cart/count`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 401) {
        setCartCount(ctxItemCount);
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
      }

      setCartCount(count);
    } catch (error) {
      setCartCount(ctxItemCount);
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
        headers: { "Content-Type": "application/json" },
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
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    async function syncSession() {
      const sessionData = await ensureValidSession();
      setSession(sessionData);
      fetchWishlistCount();
      fetchCartCount();
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
    fetchWishlistCount();
    fetchCartCount();
  }, [pathname, session]);

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
  }, []);

  useEffect(() => {
    if (open) {
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

  function handleWishlistClick() {
    setOpen(false);
  }

  return (
    <div ref={headerWrapperRef} className="fixed top-0 left-0 w-full z-40">
      <PromoBar />

      <header className="w-full bg-[#FFFCF8] border-b border-[#EFE7DF] font-sans">
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

          <nav className="hidden lg:flex items-center gap-12 font-sans">
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

                    {/* Premium Shop Mega Menu Popup UI */}
                    {shopMenuOpen && (
                      <div
                        className="fixed top-[90px] left-1/2 -translate-x-1/2 w-[960px] max-w-[95vw] z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-2"
                        onMouseEnter={() => setShopMenuOpen(true)}
                      >
                        <div className="relative overflow-hidden rounded-3xl border border-[#E8DED1] bg-[#FFFDF9] p-8 sm:p-10 shadow-[0_30px_70px_-15px_rgba(89,49,2,0.18)]">
                          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#D89B00] via-[#593102] to-[#D89B00]" />

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
                            <div className="col-span-4 relative rounded-2xl overflow-hidden border border-[#D49313]/40 shadow-md group/card min-h-[190px] h-full flex items-center justify-center bg-white">
                              <Image
                                src="/shop 2.png"
                                alt="ShuddhVeda Pure Honey"
                                fill
                                priority
                                className="object-cover object-center transition-transform duration-500 group-hover/card:scale-105 rounded-2xl"
                              />
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
              onClick={handleWishlistClick}
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

        {/* MOBILE SIDE NAVIGATION DRAWER */}
        {open && (
          <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md lg:hidden animate-in fade-in duration-300 transition-all touch-none overscroll-contain"
            onClick={() => setOpen(false)}
            onTouchMove={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
              }
            }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-[88%] max-w-[340px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] shadow-[0_0_60px_rgba(89,49,2,0.35)] rounded-r-[32px] border-r-2 border-[#D49313]/50 overflow-y-auto flex flex-col animate-in slide-in-from-left duration-300 ease-out overscroll-contain touch-pan-y"
              onClick={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-[#FFFDF9]/95 backdrop-blur-md z-20 flex items-center justify-between p-4 px-5 border-b border-[#EADCC9]/80 shadow-2xs">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                  <Image
                    src="/yellow logo.png"
                    alt="ShuddhVeda Honey"
                    width={52}
                    height={52}
                    priority
                    className="h-10 w-auto object-contain"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="font-serif text-[17px] font-extrabold text-[#593102] tracking-tight">
                      ShuddhVeda
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2F241C]/40 bg-white text-[#2F241C] hover:border-[#F24E1E] hover:text-[#F24E1E] hover:bg-[#FFF0EB] transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                  aria-label="Close navigation"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {session ? (
                  <div className="relative overflow-hidden rounded-2xl border border-[#EADCC9] bg-gradient-to-br from-[#FFFDF9] via-white to-[#FAF5EC] p-3.5 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] text-sm font-black text-white shadow-md uppercase tracking-wider">
                        {session.user.name ? session.user.name.slice(0, 2) : "SV"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-extrabold text-[#593102] truncate capitalize">
                          {session.user.name || "ShuddhVeda Customer"}
                        </p>
                        <Link
                          href="/account"
                          onClick={() => setOpen(false)}
                          className="text-[11px] font-bold text-[#D49313] hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          My Profile &amp; Orders &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-[#EADCC9] bg-gradient-to-r from-[#593102] to-[#8F590A] p-3.5 text-white shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-serif text-sm font-extrabold text-white">Welcome to ShuddhVeda</p>
                        <p className="text-[11px] text-white/80 font-medium">Pure organic raw honey</p>
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="bg-white text-[#593102] hover:bg-[#FAF0DC] transition-colors text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs active:scale-95 shrink-0"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                )}

                {/* Main Navigation Links */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8D7F73] px-2 block mb-1">
                    Navigation Menu
                  </span>

                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const isActive =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname === item.href || pathname?.startsWith(`${item.href}/`);

                      if (item.title === "Shop") {
                        return (
                          <div key={item.title} className="rounded-2xl border border-[#EADCC9]/90 bg-white/90 overflow-hidden shadow-2xs">
                            <div className="flex items-center justify-between px-4 py-3">
                              <Link
                                href="/shop"
                                onClick={() => setOpen(false)}
                                className={`text-[15px] font-extrabold ${
                                  isActive ? "text-[#D49313]" : "text-[#593102]"
                                }`}
                              >
                                Shop Collections
                              </Link>
                              <button
                                type="button"
                                onClick={() => setMobileShopOpen((prev) => !prev)}
                                className="p-1.5 rounded-xl bg-[#FAF0DC] text-[#593102] hover:text-[#D49313] cursor-pointer border border-[#D49313]/20"
                                aria-label="Toggle Shop submenu"
                              >
                                <FiChevronDown
                                  size={18}
                                  className={`transition-transform duration-300 ${
                                    mobileShopOpen ? "rotate-180 text-[#D49313]" : ""
                                  }`}
                                />
                              </button>
                            </div>

                            {mobileShopOpen && (
                              <div className="p-3.5 bg-[#FAF5EC] border-t border-[#EADCC9]/60 space-y-3">
                                <Link
                                  href="/shop"
                                  onClick={() => {
                                    setOpen(false);
                                    setMobileShopOpen(false);
                                  }}
                                  className="block text-[13px] font-extrabold text-[#D49313] hover:underline"
                                >
                                  View All Honey Collections &rarr;
                                </Link>

                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8D7F73] block mb-1">
                                    Multi-Flora Honey
                                  </span>
                                  <div className="space-y-1.5 pl-1">
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
                                            className="block text-[13px] font-semibold text-[#593102] hover:text-[#D49313] transition-colors"
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
                                        className="block text-[13px] font-semibold text-[#593102]"
                                      >
                                        • Himalayan Forest Honey
                                      </Link>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8D7F73] block mb-1">
                                    Mono-Flora Honey
                                  </span>
                                  <div className="grid grid-cols-1 gap-1.5 pl-1">
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
                                            className="block text-[13px] font-semibold text-[#593102] hover:text-[#D49313] transition-colors"
                                          >
                                            • {name}
                                          </Link>
                                        );
                                      })
                                    ) : (
                                      <>
                                        <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#593102]">• Ajwain Honey</Link>
                                        <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#593102]">• Lychee Honey</Link>
                                        <Link href="/shop" onClick={() => setOpen(false)} className="block text-[13px] font-semibold text-[#593102]">• Fennel Honey</Link>
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
                          className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-extrabold transition-all duration-300 ${
                            isActive
                              ? "bg-[#FAF0DC] text-[#593102] border-l-4 border-[#D49313] shadow-2xs"
                              : "text-[#593102] bg-white/90 hover:bg-[#FAF5EC] border border-[#EADCC9]/80 hover:border-[#D49313]/50"
                          }`}
                        >
                          <span>{item.title}</span>
                          {isActive && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#D49313] shadow-xs" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Quick Access */}
                <div className="pt-3 space-y-2 border-t border-[#EADCC9]/80">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8D7F73] px-2 block mb-1">
                    Quick Access
                  </span>

                  <Link
                    href="/wishlist"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-white/90 p-3 px-4 border border-[#EADCC9]/80 text-[#593102] font-bold text-sm hover:border-[#D49313] transition shadow-2xs"
                  >
                    <span className="flex items-center gap-2.5">
                      <FiHeart size={18} className="text-[#FA4B1B] fill-[#FA4B1B]" />
                      My Wishlist
                    </span>
                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-[#D49313] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/account/privacy"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-white/90 p-3 px-4 border border-[#EADCC9]/80 text-[#593102] font-bold text-sm hover:border-[#D49313] transition shadow-2xs"
                  >
                    <span className="flex items-center gap-2.5">
                      <FiUser size={18} className="text-[#D49313]" />
                      Policy Center
                    </span>
                  </Link>

                  {session && (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-2xl bg-red-50/90 p-3 px-4 text-red-600 font-bold text-sm hover:bg-red-100 transition border border-red-200/60"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
