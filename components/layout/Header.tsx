"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-1 text-[16px] font-medium text-[#7A3F10] hover:text-[#D89B00] transition-all duration-300"
            >
              {item.title}
            </Link>
          ))}
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

          <Link
            href="/cart"
            className="text-[#7A3F10] hover:text-[#D89B00] transition"
          >
            <FiShoppingCart size={22} />
          </Link>
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
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 border-b border-[#F1ECE6] text-[#7A3F10] font-medium"
            >
              {item.title}
            </Link>
          ))}

          <div className="flex items-center gap-6 px-6 py-5">
            <Link href="/wishlist" onClick={() => setOpen(false)}>
              <FiHeart size={22} className="text-[#7A3F10]" />
            </Link>
            <Link href="/account" onClick={() => setOpen(false)}>
              <FiUser size={22} className="text-[#7A3F10]" />
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)}>
              <FiShoppingCart size={22} className="text-[#7A3F10]" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}