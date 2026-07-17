"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import {
  FiHeart,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop" },
  { title: "Gift Sets", href: "/giftsets" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFCF8] border-b border-[#EFE7DF]">
      <div className="max-w-[1445px] mx-auto h-[62px] px-[52px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/yellow logo.png"
            alt="ShuddhVeda Honey"
            width={66}
            height={66}
            priority
            className="object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-12">
          {navItems.map((item) => {
            // "Home" should only be active on the exact "/" route.
            // Other items are active on their route and any nested sub-routes.
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
                {/* Active underline indicator */}
                <span
                  className={`absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-[#D89B00] transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center gap-[18px]">
          <Link
            href="/wishlist"
            className="text-[#7A3F10] hover:text-[#D89B00] transition"
          >
            <FiHeart size={22} />
          </Link>

          <Link
            href="/account"
            className="text-[#7A3F10] hover:text-[#D89B00] transition"
          >
            <FiUser size={22} />
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative text-[#7A3F10] transition hover:text-[#D89B00]"
            aria-label="Open cart"
          >
            <FiShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2D3A1B] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile */}
        <button
          className="lg:hidden text-[#7A3F10]"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX size={30} /> : <FiMenu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
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

          <div className="flex items-center gap-6 px-6 py-5">
            <Link href="/wishlist" onClick={() => setOpen(false)}>
              <FiHeart size={22} className="text-[#7A3F10]" />
            </Link>
            <Link href="/account" onClick={() => setOpen(false)}>
              <FiUser size={22} className="text-[#7A3F10]" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openCart();
              }}
              aria-label="Open cart"
              className="relative"
            >
              <FiShoppingCart size={22} className="text-[#7A3F10]" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2D3A1B] px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}