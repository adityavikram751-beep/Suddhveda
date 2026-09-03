"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/auth";

interface LocationData {
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  _id: string;
  phone: string;
  phone_timing: string;
  email: string;
  email_reply_time: string;
  whatsapp: string;
  whatsapp_timing: string;
  map_embed_url: string;
  isActive: boolean;
}

export default function Footer() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/location/all`);
        const data = await response.json();
        if (data.success) {
          setLocationData(data.data);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  // Get full address for display
  const getFullAddress = () => {
    if (!locationData) return "";
    const { address } = locationData;
    return `${address.line1}, ${address.line2}, ${address.city}, ${address.state}, ${address.country}–${address.pincode}`;
  };

  return (
    <footer className="bg-[#593102] text-white block">
      <div className="max-w-[1445px] mx-auto px-6 sm:px-8 py-12">

        {/* ================= MOBILE & TABLET LAYOUT (Original Mobile UI Styling + Full Content) ================= */}
        <div className="flex flex-col items-center text-center lg:hidden space-y-10">

          {/* Logo & Brand & Description */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg bg-[#422402] flex items-center justify-center overflow-hidden p-1.5 shadow-md">
              <Image
                src="/yellow logo.png"
                alt="ShuddhVedahoney Logo"
                width={42}
                height={42}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-[22px] font-semibold mt-3">
              ShuddhVedaHoney
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-[#E2D2C4] max-w-xs text-center">
              Bringing nature&apos;s purest honey from the hive to your home. Committed to quality, purity, and sustainability.
            </p>

            {/* 4 Social Media Icons */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <a
                href="https://www.instagram.com/ShuddhVedaHoney"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram - ShuddhVedaHoney"
                title="ShuddhVedaHoney"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook - ShuddhVedaHoney"
                title="ShuddhVedaHoney"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FaFacebookF size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaXTwitter size={16} />
              </a>
              <a href="#" aria-label="Youtube" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Links Grid for Mobile / Tablet (Original UI Layout + ALL Content) */}
          <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-8 w-full max-w-lg px-2 justify-items-center text-left">

            {/* Quick Links */}
            <div className="w-full">
              <h3 className="text-[16px] font-semibold text-center sm:text-left">Quick Links</h3>
              <ul className="mt-4 space-y-2.5 text-center sm:text-left">
                <li><Link href="/shop" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">All Honey</Link></li>
                <li><Link href="/account" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">My Account</Link></li>
                <li><Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Policies &amp; Info</Link></li>
                <li><Link href="/shop" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/b2b" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">B2B Order</Link></li>
                <li><Link href="/bulk-gifting" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Bulk Gifting</Link></li>
              </ul>
            </div>

            {/* Info & Policies */}
            <div className="w-full">
              <h3 className="text-[16px] font-semibold text-center sm:text-left">Info &amp; Policies</h3>
              <ul className="mt-4 space-y-2.5 text-center sm:text-left">
                <li><Link href="/contact" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/about" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/our-process" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Our Process</Link></li>
                <li><Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Return Policy</Link></li>
                <li><Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>

          </div>

          {/* Get in Touch (Centered for Mobile/Tablet) */}
          <div className="w-full flex flex-col items-center text-center px-4">
            <h3 className="text-[16px] font-semibold">Get in Touch</h3>
            <div className="mt-4 space-y-3 max-w-md w-full">
              <div className="flex items-center justify-center gap-3">
                <Phone size={15} className="text-[#E2D2C4] shrink-0" />
                <a href={`tel:${loading ? "+919876543210" : locationData?.phone || "+919876543210"}`} className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  {loading ? "Loading..." : locationData?.phone || "+91 98765 43210"}
                </a>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Phone size={15} className="text-[#E2D2C4] shrink-0" />
                <a href={`tel:${loading ? "+919876543210" : locationData?.whatsapp || "+919876543210"}`} className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  WhatsApp: {loading ? "Loading..." : locationData?.whatsapp || "+91 98765 43210"}
                </a>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Mail size={15} className="text-[#E2D2C4] shrink-0" />
                <a href={`mailto:${loading ? "connect@Shuddhveda.in" : locationData?.email || "connect@Shuddhveda.in"}`} className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  {loading ? "Loading..." : locationData?.email || "connect@Shuddhveda.in"}
                </a>
              </div>
              <div className="flex items-start justify-center gap-3">
                <MapPin size={16} className="mt-1 text-[#E2D2C4] shrink-0" />
                <p className="text-[13px] leading-5 text-[#E2D2C4] text-center max-w-sm">
                  {loading ? "Loading..." : getFullAddress() || "HARISONS VENTURE PRIVATE LIMITED, C-11 Sudarshan Tower, Opp. Sambhavnath Tenaments, Sun N Step Club Road, Thaltej, Ahmedabad, Gujarat, India–380054"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Footer for Mobile */}
          <div className="w-full border-t border-white/15 pt-6 flex flex-col items-center gap-3 text-center">
            <p className="text-[13px] text-[#D9C8BA]">
              © {new Date().getFullYear()} Shuddhveda. All rights reserved. Made with 🍯 in India.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-[#D9C8BA]">
              <span>FSSAI Licensed</span>
              <span className="text-[#c29665]">•</span>
              <span>ISO Certified</span>
              <span className="text-[#c29665]">•</span>
              <span>Raw &amp; Organic</span>
            </div>
          </div>

        </div>


        {/* ================= DESKTOP LAYOUT (>= 1024px) ================= */}
        <div className="hidden lg:grid grid-cols-4 gap-10">

          {/* ================= Logo ================= */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-[#422402] flex items-center justify-center overflow-hidden p-1.5">
                <Image
                  src="/yellow logo.png"
                  alt="ShuddhVeda Logo"
                  width={42}
                  height={42}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-[22px] font-semibold">
                ShuddhVedaHoney
              </h2>
            </div>
            <p className="mt-4 max-w-[280px] text-[14px] leading-6 text-[#E2D2C4]">
              Bringing nature&apos;s purest honey from the hive to your home. Committed to quality, purity, and sustainability.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/ShuddhVedaHoney"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram - ShuddhVedaHoney"
                title="ShuddhVedaHoney"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="#"
                aria-label="Facebook - ShuddhVedaHoney"
                title="ShuddhVedaHoney"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FaFacebookF size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaXTwitter size={16} />
              </a>
              <a href="#" aria-label="Youtube" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

          {/* ================= Quick Links ================= */}
          <div>
            <h3 className="text-[16px] font-semibold">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/shop" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  All Honey
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  Policies &amp; Information
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= Products ================= */}
          <div>
            <h3 className="text-[16px] font-semibold">
              Products Information
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/contact" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/account/privacy" className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors">
                  Cancellation/Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= Get In Touch ================= */}
          <div>
            <h3 className="text-[16px] font-semibold">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-3">
              {/* Phone 1 */}
              <div className="flex items-start gap-3">
                <Phone size={15} className="mt-1 text-[#E2D2C4]" />
                <a
                  href={`tel:${loading ? "+919876543210" : locationData?.phone || "+919876543210"}`}
                  className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors"
                >
                  {loading ? "Loading..." : locationData?.phone || "+91 98765 43210"}
                </a>
              </div>

              {/* Phone 2 / WhatsApp */}
              <div className="flex items-start gap-3">
                <Phone size={15} className="mt-1 text-[#E2D2C4]" />
                <a
                  href={`tel:${loading ? "+919876543210" : locationData?.whatsapp || "+919876543210"}`}
                  className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors"
                >
                  {loading ? "Loading..." : locationData?.whatsapp || "+91 98765 43210"}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail size={15} className="mt-1 text-[#E2D2C4]" />
                <a
                  href={`mailto:${loading ? "connect@Shuddhveda.in" : locationData?.email || "connect@shuddhveda.in"}`}
                  className="text-[14px] text-[#E2D2C4] hover:text-white transition-colors"
                >
                  {loading ? "Loading..." : locationData?.email || "connect@shuddhveda.in"}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-[#E2D2C4] shrink-0" />
                <p className="text-[13px] leading-5 text-[#E2D2C4]">
                  {loading ? "Loading..." : getFullAddress() || "HARISONS VENTURE PRIVATE LIMITED, C-11 Sudarshan Tower, Opp. Sambhavnath Tenaments, Sun N Step Club Road, Thaltej, Ahmedabad, Gujarat, India–380054"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ================= Desktop Bottom Footer ================= */}
        <div className="hidden lg:flex mt-10 border-t border-white/15 pt-6 items-center justify-between">
          <p className="text-[13px] text-[#D9C8BA]">
            © {new Date().getFullYear()} Shuddhveda Honey. All rights reserved. Made with in India.
          </p>

          <div className="flex items-center gap-2 text-[13px] text-[#D9C8BA]">
            <span>FSSAI Licensed</span>
            <span className="text-[#c29665]">•</span>
            <span>ISO Certified</span>
            <span className="text-[#c29665]">•</span>
            <span>Raw &amp; Organic</span>
          </div>
        </div>

      </div>
    </footer>
  );
}