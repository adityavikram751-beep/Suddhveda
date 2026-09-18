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
    const boxSize = isMobile ? "w-[44px] h-[44px]" : "w-[42px] h-[42px] lg:w-[46px] lg:h-[46px] xl:w-[64px] xl:h-[64px]";
    const textSize = isMobile ? "text-[14px]" : "text-[13px] lg:text-[15px] xl:text-[18px]";
    const labelSize = isMobile ? "text-[9px]" : "text-[8.5px] lg:text-[9.5px] xl:text-[11px]";
    return items.map((item, i) => (
      <div key={i} className="flex flex-col items-center shrink-0">
        <div className={`${boxSize} rounded-[8px] lg:rounded-[10px] bg-[#FEF6EC] border border-[#EFD2AE] flex flex-col items-center justify-center shrink-0`}>
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
          lg:w-[220px]
          xl:w-[270px]
          h-auto
          object-contain
          pointer-events-none
          select-none
          z-10
        "
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 py-8 sm:py-10 lg:py-12">
        {/* ===== DESKTOP: 3-Column Layout ===== */}
        <div className="hidden lg:grid grid-cols-[230px_minmax(0,1fr)_260px] xl:grid-cols-[320px_minmax(0,1fr)_360px] gap-3 lg:gap-4 xl:gap-8 items-stretch">
          
          {/* LEFT – Image Card */}
          <div className="flex justify-center items-center min-w-0 h-full">
            <div className="relative w-full max-w-[320px] min-w-0 h-full min-h-[260px] lg:min-h-[300px] xl:min-h-[380px] rounded-[20px] lg:rounded-[24px] overflow-hidden bg-white shadow-xl border-2 border-[#D49313]/40 group">
              <div className="absolute top-3 left-3 z-20">
                <span className="bg-[#593102] text-[#FFD700] text-[10px] lg:text-[11px] xl:text-[12px] px-2.5 py-1 lg:px-3 lg:py-1 xl:px-4 xl:py-1.5 rounded-full font-extrabold shadow-md border border-[#D49313] tracking-wide uppercase">
                  {banner.title}
                </span>
              </div>
              <Image
                src={banner.banner_image}
                alt={banner.product_name}
                fill
                priority
                quality={100}
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* CENTER – Details + Countdown + Pre-Order Button */}
          <div className="flex flex-col items-center justify-center text-center bg-white/95 backdrop-blur-md rounded-[20px] lg:rounded-[24px] border-2 border-[#D49313]/30 px-3 py-4 lg:px-5 lg:py-6 xl:px-8 xl:py-7 shadow-xl h-full min-w-0">
            <span className="uppercase tracking-[0.12em] lg:tracking-[0.15em] xl:tracking-[0.18em] text-[#593102] text-[10px] lg:text-[11px] xl:text-[12px] font-extrabold bg-[#FAF0DC] border border-[#D49313]/60 px-2.5 py-0.5 lg:px-3 lg:py-1 xl:px-4 xl:py-1.5 rounded-full shadow-2xs">
              {banner.tag}
            </span>
            <h2 className="mt-2 lg:mt-2.5 text-[20px] lg:text-[24px] xl:text-[42px] font-serif font-extrabold leading-tight text-[#593102] whitespace-normal xl:whitespace-nowrap">
              {banner.product_name}
            </h2>
            <p className="mt-1 lg:mt-1.5 text-[12px] lg:text-[13px] xl:text-[16px] text-[#6E5D4F] font-medium max-w-[360px] xl:max-w-[420px] leading-snug sm:leading-relaxed">{banner.subtitle}</p>
            
            <div className="flex gap-1.5 sm:gap-2 xl:gap-4 mt-3 lg:mt-4 xl:mt-5 justify-center flex-nowrap shrink-0 max-w-full overflow-hidden">{renderCountdown(false)}</div>
            
            {banner.pre_order_url && (
              <a
                href={banner.pre_order_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 lg:mt-4 xl:mt-5 w-full max-w-[150px] lg:max-w-[170px] xl:max-w-[180px] h-[36px] lg:h-[38px] inline-flex items-center justify-center bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-white font-extrabold rounded-xl transition-all duration-500 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 text-center text-[11px] lg:text-xs uppercase tracking-wider cursor-pointer border border-[#FFD700]/40 shrink-0"
              >
                Pre-Order Now
              </a>
            )}
          </div>

          {/* RIGHT – Features with /madhu.png icon */}
          <div className="relative bg-[#FFF9F2] rounded-[20px] lg:rounded-[24px] border-2 border-[#D49313]/30 px-4 py-5 lg:px-5 lg:py-6 xl:px-8 xl:py-8 h-full overflow-hidden min-w-0 flex flex-col justify-center shadow-xl">
            <h3 className="text-[18px] lg:text-[22px] xl:text-[30px] font-serif font-extrabold text-[#593102]">{banner.product_name}</h3>
            <p className="mt-1.5 lg:mt-2 text-[12px] lg:text-[13px] xl:text-[15px] leading-relaxed text-[#6E5D4F] font-medium whitespace-pre-line break-words">
              {banner.product_description}
            </p>
            <div className="mt-3 lg:mt-4 xl:mt-5 space-y-2 lg:space-y-2.5 xl:space-y-3.5">
              {banner.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2 lg:gap-2.5 xl:gap-3.5">
                  <Image
                    src="/madhu.png"
                    alt=""
                    width={20}
                    height={20}
                    className="w-[16px] lg:w-[18px] xl:w-[22px] h-auto flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[12.5px] lg:text-[13.5px] xl:text-[16px] font-extrabold text-[#593102] break-words whitespace-normal leading-snug">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== MOBILE & TABLET: Single Card Layout ===== */}
        <div className="lg:hidden">
          <div className="max-w-sm sm:max-w-md mx-auto w-full bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#EEE5D9]">
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
                className="w-full h-[240px] object-cover"
              />
            </div>
            
            <div className="p-5 sm:p-6 text-center">
              <span className="uppercase tracking-[4px] text-[#D49313] text-[12px] font-semibold">
                {banner.tag}
              </span>
              <h2 className="mt-1 text-[26px] sm:text-[30px] font-semibold leading-tight text-[#5A2505] whitespace-pre-line">
                {banner.product_name}
              </h2>
              <p className="mt-1 text-[14px] text-[#444]">{banner.subtitle}</p>
              
              <div className="flex justify-center gap-2 mt-4">
                {renderCountdown(true)}
              </div>

              {banner.pre_order_url && (
                <a
                  href={banner.pre_order_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full max-w-[200px] mx-auto h-[38px] flex items-center justify-center bg-[#593102] hover:bg-[#C68B2C] text-white font-semibold rounded-lg transition-all duration-300 shadow-md text-center text-xs uppercase tracking-wider cursor-pointer"
                >
                  Pre-Order Now
                </a>
              )}

              <div className="mt-5 pt-5 border-t border-[#EEE5D9] text-left">
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