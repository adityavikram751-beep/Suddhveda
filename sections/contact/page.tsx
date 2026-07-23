"use client";

import { API_BASE_URL } from "@/lib/auth";
import Image from "next/image";
import { HandHeart, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

// Custom headset-support icon (exact match to design)
const HeadsetIcon = ({ size = 32, strokeWidth = 1.6, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 13a9 9 0 0 1 18 0" />
    <path d="M3 13v3a2 2 0 0 0 2 2h1v-6H4a1 1 0 0 0-1 1z" />
    <path d="M21 13v3a2 2 0 0 1-2 2h-1v-6h2a1 1 0 0 1 1 1z" />
    <circle cx="12" cy="14.5" r="2.5" />
    <path d="M10.5 13.2c.4-.5 1.1-.5 1.5 0" />
    <circle cx="11" cy="14.3" r="0.3" fill="currentColor" />
    <circle cx="13" cy="14.3" r="0.3" fill="currentColor" />
  </svg>
);

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

export default function Hero() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/location/all`, {
          credentials: "include", // include cookies if needed for auth
        });
        if (!response.ok) throw new Error("Failed to fetch location data");
        const data = await response.json();
        if (data.success) {
          setLocationData(data.data);
        } else {
          console.error("API returned success: false");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  // Get the first part of address for display
  const getAddressLine = () => {
    if (!locationData) return "";
    const { address } = locationData;
    return `${address.line1}, ${address.line2}`;
  };

  // Get city and state for display
  const getCityState = () => {
    if (!locationData) return "";
    const { address } = locationData;
    return `${address.city}, ${address.state}`;
  };

  const cards = [
    {
      icon: HeadsetIcon,
      title: (
        <>
          We're Here To
          <br />
          Help
        </>
      ),
      content: loading ? "Loading..." : `${locationData?.phone || "+91 98765 43210"}`,
      subContent: loading ? "..." : locationData?.phone_timing || "Mon - Sat: 9AM - 6PM",
    },
    {
      icon: HandHeart,
      title: (
        <>
          Quick & Friendly
          <br />
          Support
        </>
      ),
      content: loading ? "Loading..." : getAddressLine() || "123, Green Hive Road",
      subContent: loading ? "..." : getCityState() || "Whitefield, Bengaluru",
    },
    {
      icon: ShieldCheck,
      title: (
        <>
          Your Satisfaction
          <br />
          Matters
        </>
      ),
      content: loading ? "Loading..." : locationData?.email || "hello@shuddhadeva.com",
      subContent: loading ? "..." : locationData?.email_reply_time || "We reply within 24 hrs",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAF6F0]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid min-h-[760px] items-center lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="relative z-10 max-w-[610px] py-16 lg:py-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 uppercase tracking-[0.28em] text-[#D49313] text-[14px] font-medium">
              <span>Get In Touch</span>
              <span className="text-[12px]">🍃</span>
            </div>

            {/* Heading */}
            <h1 className="mt-12 font-serif text-[#3A2C24] leading-[1.05] text-[36px] sm:text-[48px] lg:text-[76px] tracking-[-0.03em]">
              Let&apos;s Start a{" "}
              <span className="italic text-[#4D6840]">
                Sweet
              </span>
              <br />
              Conversation.
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-[520px] text-[18px] leading-[1.8] text-[#6E6258]">
              We&apos;re here to answer your questions, support your journey
              towards natural living, and help you experience the goodness of
              pure honey.
            </p>

            {/* Cards */}
            <div className="mt-6 grid grid-cols-3 gap-5 max-w-[640px]">

              {cards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group flex h-[160px] flex-col items-center justify-center rounded-[18px] border border-[#E8DED3] bg-white px-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                  >
                    <div className="mb-2 text-[#D49313]">
                      <Icon size={28} strokeWidth={1.6} />
                    </div>

                    <p className="text-center text-[14px] leading-[18px] font-semibold text-[#453B34]">
                      {item.title}
                    </p>
                    
                    <p className="text-center text-[12px] leading-[16px] font-medium text-[#D49313] mt-1">
                      {item.content}
                    </p>
                    
                    <p className="text-center text-[10px] leading-[14px] text-[#8D7F73] mt-0.5">
                      {item.subContent}
                    </p>
                  </div>
                );
              })}

            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex items-center justify-end h-[760px]">

            <div
              className="absolute right-[-140px] top-1/2 -translate-y-1/2
              w-[780px] h-[780px]
              rounded-full
              bg-[radial-gradient(circle,rgba(255,214,120,0.35)_0%,rgba(255,255,255,0)_70%)]"
            />

            <Image
              src="/hero.png"
              alt="ShudhVeda Natural Honey Jar"
              width={1800}
              height={1800}
              priority
              className="
                relative lg:absolute
                top-0 lg:top-43
                right-0 lg:right-32
                w-full lg:w-[90%]
                max-w-full lg:max-w-none
                h-full
                object-contain
                object-center lg:object-right-top
                translate-x-0 lg:translate-x-22
                scale-100 lg:scale-[1.2]
              "
            />

          </div>

        </div>
      </div>
    </section>
  );
}