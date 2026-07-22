"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Play, Star, X, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/auth";

interface VideoFeedback {
  id: string;
  name: string;
  videoUrl: string;
  thumbnail?: string;
}

export default function HappyCustomersSection() {
  const [videos, setVideos] = useState<VideoFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoFeedback | null>(null);

  // Auto Scroll Track Reference
  const scrollRef = useRef<HTMLDivElement>(null);

  // ---------------- 1. GET Video Feedbacks API ----------------
  const fetchVideoFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/feedback/all-feedback/videos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch video feedback");
      }

      const data = await res.json();
      const rawList = data.data || data.videos || data.feedbacks || data || [];

      const formattedVideos: VideoFeedback[] = rawList.map((item: any, index: number) => ({
        id: item._id || item.id || `video-${index}`,
        name: item.name || item.customerName || item.user?.name || "Happy Customer",
        videoUrl:
          item.video_url ||
          item.videoUrl ||
          item.video ||
          item.url ||
          "",
        thumbnail:
          item.thumbnail_url ||
          item.thumbnailUrl ||
          item.thumbnail ||
          item.image ||
          "",
      }));

      setVideos(formattedVideos);
    } catch (error) {
      console.error("Error fetching video feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoFeedbacks();
  }, []);

  // ---------------- 2. Auto Scroll Logic ----------------
  useEffect(() => {
    if (videos.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const scrollStep = clientWidth > 768 ? clientWidth / 2 : 250;

        // Reset to start if end reached
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: scrollStep, behavior: "smooth" });
        }
      }
    }, 3500); // 3.5 seconds interval

    return () => clearInterval(interval);
  }, [videos]);

  return (
    <section className="relative overflow-hidden bg-[#FFF8EF] py-8 sm:py-10 lg:py-12">

      {/* Left Decoration - Bee */}
      <Image
        src="/customer2.png"
        alt=""
        width={60}
        height={60}
        className="absolute left-[64%] top-10 z-10 hidden lg:block pointer-events-none"
      />

      {/* Right Decoration - Honeycomb */}
      <Image
        src="/customer.png"
        alt=""
        width={220}
        height={200}
        className="absolute right-0 top-0 z-10 hidden lg:block pointer-events-none"
      />

      <div className="relative max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 z-20">

        {/* Heading Section */}
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[42px] font-semibold text-[#2D3A1B] leading-tight">
            Happy Customers
          </h2>

          <p className="mt-2 sm:mt-3 text-[14px] sm:text-[16px] md:text-[18px] text-[#A98F78] max-w-[700px] mx-auto">
            Trusted By thousand of families who choose Purity, taste, and quality everyday
          </p>

          {/* Rating Section */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill="#F59E0B"
                  color="#F59E0B"
                  className="text-[#F59E0B] w-[18px] sm:w-[20px] md:w-[24px] h-auto"
                />
              ))}
            </div>

            <span className="text-[24px] sm:text-[28px] md:text-[34px] font-semibold text-[#2D3A1B] ml-1 sm:ml-2">
              4.9
            </span>

            <span className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#2D3A1B] ml-2 sm:ml-3">
              loved by
            </span>

            <span className="text-[#A98F78] text-[14px] sm:text-[16px] md:text-[18px] ml-1 sm:ml-2">
              20,000+ Customers
            </span>
          </div>
        </div>

        {/* Loader State */}
        {loading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 size={36} className="text-[#2D3A1B] animate-spin" />
            <p className="text-[15px] text-[#A98F78]">Loading customer videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="py-12 text-center text-[#A98F78] text-[15px]">
            No video feedback available right now.
          </div>
        ) : (
          /* 🎬 Auto-Scrolling Track (4 Cards visible in Desktop) */
          <div className="relative mt-8 sm:mt-10 md:mt-14 w-full">
            <div
              ref={scrollRef}
              className="
                flex items-center gap-4 sm:gap-5
                overflow-x-auto
                scroll-smooth
                scrollbar-none
                py-3 px-1
                [-ms-overflow-style:none]
                [scrollbar-width:none]
              "
            >
              {videos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedVideo(item)}
                  className="
                    group
                    relative
                    shrink-0
                    w-[calc((100%-1rem)/2)]
                    sm:w-[calc((100%-2*1.25rem)/3)]
                    lg:w-[calc((100%-3*1.25rem)/4)]
                    h-[250px] sm:h-[290px] lg:h-[350px]
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-[#E8D5BA]
                    bg-[#FDF3E4]
                    shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
                    hover:-translate-y-1
                  "
                >
                  {/* Auto-playing Background Video */}
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      poster={item.thumbnail || undefined}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  ) : (
                    <Image
                      src={item.thumbnail || "/customers/customer-1.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-[44px] sm:w-[50px] h-[44px] sm:h-[50px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white shadow-lg">
                      <Play size={18} className="ml-0.5 text-[#2D3A1B] fill-[#2D3A1B]" />
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 pointer-events-none">
                    <h3 className="text-white text-[15px] sm:text-[17px] font-semibold leading-tight truncate">
                      {item.name}
                    </h3>
                    <p className="text-white/80 text-[11px] sm:text-[12px] mt-0.5">⭐ Verified Buyer</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 🎬 Video Popup Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[420px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent absolute top-0 left-0 right-0 z-30">
              <div>
                <h3 className="text-white text-[15px] font-semibold">{selectedVideo.name}</h3>
                <p className="text-white/70 text-[11px]">⭐ Verified Customer Review</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* Popup Video Player */}
            <div className="relative w-full aspect-[9/16] bg-black">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Glow */}
      <div className="absolute left-1/2 bottom-[-120px] -translate-x-1/2 w-[650px] h-[210px] rounded-full bg-[#FFF2D8] blur-[120px] opacity-60 pointer-events-none" />

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8D5BA] to-transparent" />

    </section>
  );
}