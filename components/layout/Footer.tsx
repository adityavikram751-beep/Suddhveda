"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Phone,
  Mail,
  MapPin,
  // Instagram,
  // Facebook,
  // Twitter,
  // Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#3C2015] text-white block">

      <div className="max-w-[1445px] mx-auto px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">

          {/* ================= Logo ================= */}

          <div>

            <div className="flex items-center gap-3">

              <Image
                src="/yellow logo.png"
                alt="HoneyVeda"
                width={32}
                height={32}
              />

              <h2 className="text-[22px] font-semibold">
                HoneyVeda
              </h2>

            </div>

            <p
              className="
                mt-4
                max-w-[280px]
                text-[14px]
                leading-6
                text-[#E2D2C4]
              "
            >
              Bringing nature&apos;s purest honey from
              the hive to your home. Committed
              to quality, purity, and sustainability.
            </p>

            {/* Social Icons */}

            <div className="flex gap-3 mt-6">

              {/* {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-[#563327]
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:bg-[#D89A1B]
                  "
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))} */}

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
                  className="text-[14px] text-[#E2D2C4] hover:text-[#D89A1B] transition-colors"
                >
                  All Honey
                </Link>
              </li>

              <li>
                <Link
                  href="/account"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#D89A1B] transition-colors"
                >
                  My Account
                </Link>
              </li>

              <li>
                <Link
                  href="/b2b"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#D89A1B] transition-colors"
                >
                  B2B Order
                </Link>
              </li>

              <li>
                <Link
                  href="/bulk-gifting"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#D89A1B] transition-colors"
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
                  className="text-[14px] text-[#E2D2C4] hover:text-[#D89A1B] transition-colors"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#D89A1B] transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/our-process"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#D89A1B] transition-colors"
                >
                  Our Process
                </Link>
              </li>

              <li>
                <Link
                  href="/blogs"
                  className="text-[14px] text-[#E2D2C4] hover:text-[#D89A1B] transition-colors"
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

                <Phone
                  size={15}
                  className="mt-1 text-[#D89A1B]"
                />

                <a
                  href="tel:+919876543210"
                  className="
                    text-[14px]
                    text-[#E2D2C4]
                    hover:text-[#D89A1B]
                    transition-colors
                  "
                >
                  +91 98765 43210
                </a>

              </div>

              {/* Phone */}

              <div className="flex items-start gap-3">

                <Phone
                  size={15}
                  className="mt-1 text-[#D89A1B]"
                />

                <a
                  href="tel:+919876543210"
                  className="
                    text-[14px]
                    text-[#E2D2C4]
                    hover:text-[#D89A1B]
                    transition-colors
                  "
                >
                  +91 98765 43210
                </a>

              </div>

              {/* Email */}

              <div className="flex items-start gap-3">

                <Mail
                  size={15}
                  className="mt-1 text-[#D89A1B]"
                />

                <a
                  href="mailto:connect@honeyveda.in"
                  className="
                    text-[14px]
                    text-[#E2D2C4]
                    hover:text-[#D89A1B]
                    transition-colors
                  "
                >
                  connect@honeyveda.in
                </a>

              </div>

              {/* Address */}

              <div className="flex items-start gap-3">

                <MapPin
                  size={16}
                  className="
                    mt-1
                    text-[#D89A1B]
                    shrink-0
                  "
                />

                <p
                  className="
                    text-[13px]
                    leading-5
                    text-[#E2D2C4]
                  "
                >
                  HARISONS VENTURE PRIVATE LIMITED, C-11 Sudarshan Tower, Opp.
                  Sambhavnath Tenaments, Sun N Step Club Road, Thaltej,
                  Ahmedabad, Gujarat, India–380054
                </p>

              </div>

            </div>

          </div>

        </div>
        {/* ================= Bottom Footer ================= */}

        <div
          className="
            mt-10
            border-t
            border-[#5A3428]
            pt-6
            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-4
          "
        >

          {/* Left */}

          <p
            className="
              text-[13px]
              text-[#D9C8BA]
              text-center
              lg:text-left
            "
          >
            © {new Date().getFullYear()} HoneyVeda. All rights reserved.
            <span className="mx-2">•</span>
            Made with 🍯 in India.
          </p>

          {/* Right */}

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-2
              text-[13px]
              text-[#D9C8BA]
            "
          >
            <span>FSSAI Licensed</span>

            <span className="text-[#7A5142]">•</span>

            <span>ISO Certified</span>

            <span className="text-[#7A5142]">•</span>

            <span>100% Natural</span>
          </div>

        </div>

      </div>

    </footer>
  );
}