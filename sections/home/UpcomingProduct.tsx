"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/auth";

interface BannerData {
  _id: string;
  title: string;
  subtitle: string;
  tag: string;
  product_name: string;
  product_description: string;
  features: string[];
  banner_image: string;
  launch_date: string;
  pre_order_url: string;
  isActive: boolean;
}

interface ApiResponse {
  success: boolean;
  launched: boolean;
  data: {
    banner: BannerData;
  };
}

export default function UpcomingProduct() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/upcoming/all-banners`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch banner");
        const data: ApiResponse = await res.json();
        if (data.success && data.data.banner) {
          setBanner(data.data.banner);
        } else {
          console.error("No banner data");
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!banner?.launch_date) return;

    const targetDate = new Date(banner.launch_date).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      let diff = targetDate - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 1000 * 60 * 60 * 24;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 1000 * 60 * 60;
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * 1000 * 60;
      const seconds = Math.floor(diff / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [banner]);

  // Render countdown boxes
  const renderCountdown = (isMobile = false) => {
    const items = [
      { value: countdown.days, label: "Days" },
      { value: countdown.hours, label: "hour" },
      { value: countdown.minutes, label: "Minute" },
      { value: countdown.seconds, label: "Second" },
    ];
    const boxSize = isMobile ? "w-[50px] h-[50px]" : "w-[64px] h-[64px]";
    const textSize = isMobile ? "text-[16px]" : "text-[18px]";
    const labelSize = isMobile ? "text-[9px]" : "text-[11px]";
    return items.map((item, i) => (
      <div key={i} className="flex flex-col items-center">
        <div className={`${boxSize} rounded-[10px] bg-[#FEF6EC] border border-[#EFD2AE] flex flex-col items-center justify-center`}>
          <span className={`${textSize} font-semibold text-[#3B2A1A] leading-none`}>
            {String(item.value).padStart(2, "0")}
          </span>
          <span className={`mt-0.5 ${labelSize} text-[#A58F79] leading-none`}>
            {item.label}
          </span>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <section className="bg-[#FBF7F1] py-12 flex justify-center items-center">
        <div className="text-[#D49313] text-lg">Loading...</div>
      </section>
    );
  }

  if (!banner) {
    return (
      <section className="bg-[#FBF7F1] py-12 flex justify-center items-center">
        <div className="text-gray-600">No upcoming product available.</div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#FBF7F1] overflow-hidden border-b border-[#F1DEC7] border-b-[0.5px]">
      {/* Decorative image */}
      <Image
        src="/upcomin side logo.png"
        alt=""
        width={250}
        height={250}
        className="
          absolute
          bottom-0
          right-0
          w-[140px]
          sm:w-[180px]
          lg:w-[250px]
          xl:w-[270px]
          h-auto
          object-contain
          pointer-events-none
          select-none
          z-10
        "
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-14 py-8 sm:py-10 lg:py-12">
        {/* ===== DESKTOP: 3-Column Layout ===== */}
        <div className="hidden lg:grid grid-cols-[minmax(0,322px)_minmax(0,1fr)_minmax(0,360px)] gap-8 items-center">
          {/* LEFT – Image */}
          <div className="flex justify-center min-w-0">
            <div className="relative w-full max-w-[320px] min-w-0 rounded-[22px] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute top-3 left-3 z-20">
                <span className="bg-[#7DA314] text-white text-[12px] px-4 py-1.5 rounded-lg font-medium">
                  {banner.title}
                </span>
              </div>
              <Image
                src={banner.banner_image}
                alt={banner.product_name}
                width={320}
                height={320}
                priority
                quality={100}
                sizes="(max-width: 1024px) 100vw, 320px"
                className="w-full h-[320px] object-cover"
              />
            </div>
          </div>

          {/* CENTER – Details + Countdown + Button */}
          <div className="flex flex-col items-center justify-center text-center bg-white rounded-[18px] border border-[#F3E8DA] px-8 py-6 shadow-sm h-[400px] min-w-0">
            <span className="uppercase tracking-[5px] text-[#D49313] text-[13px] font-semibold">
              {banner.tag}
            </span>
            <h2 className="mt-2 text-[42px] font-semibold leading-tight text-[#5A2505] whitespace-pre-line">
              {banner.product_name}
            </h2>
            <p className="mt-2 text-[16px] text-[#444]">{banner.subtitle}</p>
            <p className="mt-1 text-[16px] font-semibold text-[#6B3008]">
              {banner.subtitle}
            </p>
            <div className="flex gap-6 mt-6">{renderCountdown(false)}</div>
           
          </div>

          {/* RIGHT – Features with /madhu.png icon */}
          <div className="relative bg-[#FFF8F0] rounded-[18px] border border-[#F3E8DA] px-8 py-8 h-[400px] overflow-hidden min-w-0 flex flex-col justify-center">
            <h3 className="text-[32px] font-serif text-[#2F241B]">{banner.product_name}</h3>
            <p className="mt-3 text-[17px] leading-8 text-[#5B4A3D] whitespace-pre-line break-words">
              {banner.product_description}
            </p>
            <div className="mt-6 space-y-4">
              {banner.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Image
                    src="/madhu.png"
                    alt=""
                    width={22}
                    height={22}
                    className="w-[22px] h-auto flex-shrink-0 mt-1"
                  />
                  <span className="text-[17px] text-[#2F241B] break-words whitespace-normal">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== MOBILE: Single Card ===== */}
        <div className="lg:hidden">
          <div className="max-w-sm mx-auto w-full bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#EEE5D9]">
            <div className="relative">
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#7DA314] text-white text-[12px] px-4 py-1.5 rounded-lg font-medium">
                  {banner.title}
                </span>
              </div>
              <Image
                src={banner.banner_image}
                alt={banner.product_name}
                width={400}
                height={300}
                priority
                quality={100}
                sizes="(max-width: 640px) 100vw, 400px"
                className="w-full h-[220px] object-cover"
              />
            </div>
            <div className="p-5 text-center">
              <span className="uppercase tracking-[4px] text-[#D49313] text-[12px] font-semibold">
                {banner.tag}
              </span>
              <h2 className="mt-1 text-[26px] font-semibold leading-tight text-[#5A2505] whitespace-pre-line">
                {banner.product_name}
              </h2>
              <p className="mt-1 text-[14px] text-[#444]">{banner.subtitle}</p>
              <p className="mt-0 text-[14px] font-semibold text-[#6B3008]">
                {banner.subtitle}
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {renderCountdown(true)}
              </div>
              <div className="mt-4 pt-4 border-t border-[#EEE5D9] text-left">
                <h3 className="text-[20px] font-serif text-[#2F241B] text-center">
                  {banner.product_name}
                </h3>
                <p className="mt-1 text-[14px] leading-6 text-[#5B4A3D] text-center whitespace-pre-line break-words">
                  {banner.product_description}
                </p>
                <div className="mt-3 space-y-2">
                  {banner.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Image
                        src="/madhu.png"
                        alt=""
                        width={18}
                        height={18}
                        className="w-[18px] h-auto flex-shrink-0 mt-0.5"
                      />
                      <span className="text-[14px] text-[#2F241B] break-words whitespace-normal">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}