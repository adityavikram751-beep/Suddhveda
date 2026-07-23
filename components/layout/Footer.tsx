"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
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
    <footer className="bg-[linear-gradient(180deg,#0a1f12_0%,#1f6b3a_50%,#050f09_100%)] text-white block">
      <div className="max-w-[1445px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">

          {/* ================= Logo ================= */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-[#2D3A1B] flex items-center justify-center overflow-hidden p-1.5">
                <Image
                  src="/yellow logo.png"
                  alt="HoneyVeda Logo"
                  width={42}
                  height={42}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-[22px] font-semibold">
                Shuddhveda Honey
              </h2>
            </div>
            <p className="mt-4 max-w-[280px] text-[14px] leading-6 text-[#E2D2C4]">
              Bringing nature&apos;s purest honey from
              the hive to your home. Committed
              to quality, purity, and sustainability.
            </p>
            <div className="flex gap-3 mt-6">
              {/* Social icons can be added here */}
            </div>
          </div>

          {/* ================= Quick Links ================= */}
          <div>
            <h3 className="text-[16px] font-semibold">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  All Honey
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/b2b"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  B2B Order
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-gifting"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  Bulk Gifting
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= Products ================= */}
          <div>
            <h3 className="text-[16px] font-semibold">
              Products
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/our-process"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  Our Process
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  Blogs
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
              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone size={15} className="mt-1 text-[#2D3A1B]" />
                <a
                  href={`tel:${loading ? "+919876543210" : locationData?.phone || "+919876543210"}`}
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  {loading ? "Loading..." : locationData?.phone || "+91 98765 43210"}
                </a>
              </div>

              {/* WhatsApp (Second phone number) */}
              <div className="flex items-start gap-3">
                <Phone size={15} className="mt-1 text-[#2D3A1B]" />
                <a
                  href={`tel:${loading ? "+919876543210" : locationData?.whatsapp || "+919876543210"}`}
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  {loading ? "Loading..." : locationData?.whatsapp || "+91 98765 43210"}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail size={15} className="mt-1 text-[#2D3A1B]" />
                <a
                  href={`mailto:${loading ? "connect@honeyveda.in" : locationData?.email || "connect@honeyveda.in"}`}
                  className="text-[14px] text-[#E2D2C4] hover:text-[#2D3A1B] transition-colors"
                >
                  {loading ? "Loading..." : locationData?.email || "connect@honeyveda.in"}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-[#2D3A1B] shrink-0" />
                <p className="text-[13px] leading-5 text-[#E2D2C4]">
                  {loading ? "Loading..." : getFullAddress() || "HARISONS VENTURE PRIVATE LIMITED, C-11 Sudarshan Tower, Opp. Sambhavnath Tenaments, Sun N Step Club Road, Thaltej, Ahmedabad, Gujarat, India–380054"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ================= Bottom Footer ================= */}
        <div className="mt-10 border-t border-[#2e4b36] pt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left */}
          <p className="text-[13px] text-[#D9C8BA] text-center lg:text-left">
            © {new Date().getFullYear()} HoneyVeda. All rights reserved.
            <span className="mx-2">•</span>
            Made with 🍯 in India.
          </p>

          {/* Right */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-[#D9C8BA]">
            <span>FSSAI Licensed</span>
            <span className="text-[#4e7359]">•</span>
            <span>ISO Certified</span>
            <span className="text-[#4e7359]">•</span>
            <span>100% Natural</span>
          </div>
        </div>

      </div>
    </footer>
  );
}