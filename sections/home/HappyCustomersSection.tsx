"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const fetchVideoFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/feedback/all-feedback/videos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch video feedback");

      const data = await res.json();
      const rawList = data.data || data.videos || data.feedbacks || data || [];

      const formattedVideos: VideoFeedback[] = rawList.map((item: any, index: number) => ({
        id: item._id || item.id || `video-${index}`,
        name: item.name || item.customerName || item.user?.name || "Happy Customer",
        videoUrl: item.video_url || item.videoUrl || item.video || item.url || "",
        thumbnail: item.thumbnail_url || item.thumbnailUrl || item.thumbnail || item.image || "",
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

  // --- Smart Autoplay: Intersection Observer (More Aggressive) ---
  useEffect(() => {
    if (videos.length === 0) return;

    const observerOptions = {
      root: scrollRef.current, // Observe within the horizontal scroll container
      rootMargin: '0px 50px 0px 50px', // Pre-load/prep video slightly before it enters view
      threshold: 0.75 // Play only when 75% of the video card is visible
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const videoId = entry.target.getAttribute('data-video-id');
        const videoElement = videoRefs.current.get(videoId!);

        if (!videoElement) return;

        if (entry.isIntersecting && !playingVideoId) {
          // Smart Play: Video is visible, play it, set global state
          videoElement.play().catch((error) => {
            // Often fails if user hasn't interacted with page yet (Autoplay policy)
            // In that case, ensure it stays paused.
            console.warn("Autoplay prevented:", error);
          });
        } else if (!entry.isIntersecting && playingVideoId === videoId) {
          // Video left view, pause it
          videoElement.pause();
          setPlayingVideoId(null);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    videoRefs.current.forEach((video) => {
      observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos, playingVideoId]);


  // Track which video is currently playing globally
  const handleVideoPlayStart = (id: string) => {
    // Pause any currently playing video when a new one starts
    if (playingVideoId && playingVideoId !== id) {
      const currentlyPlaying = videoRefs.current.get(playingVideoId);
      if (currentlyPlaying) currentlyPlaying.pause();
    }
    setPlayingVideoId(id);
  };

  const handleVideoPause = (id: string) => {
    if (playingVideoId === id) {
      setPlayingVideoId(null);
    }
  };

  // --- Perfect 1-Card Smooth Scroll Logic ---
  useEffect(() => {
    if (videos.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const firstCard = container.querySelector(".feedback-card") as HTMLElement;
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth + 20; // 20px gap
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 4000); // Slightly increased interval for better viewing experience

    return () => clearInterval(interval);
  }, [videos]);


  return (
    <section className="relative overflow-hidden bg-[#FFF8EF] py-8 sm:py-10 lg:py-12">
      {/* Decorations remain same */}
      <Image src="/customer2.png" alt="" width={60} height={60} className="absolute left-[64%] top-10 z-10 hidden lg:block pointer-events-none" />
      <Image src="/customer.png" alt="" width={220} height={200} className="absolute right-0 top-0 z-10 hidden lg:block pointer-events-none" />

      <div className="relative max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[42px] font-semibold text-[#593102] leading-tight">Happy Customers</h2>
          <p className="mt-2 sm:mt-3 text-[14px] sm:text-[16px] md:text-[18px] text-[#A98F78] max-w-[700px] mx-auto">
            Trusted By thousand of families who choose Purity, taste, and quality everyday
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
             <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} fill="#F59E0B" color="#F59E0B" className="text-[#F59E0B] w-[18px] sm:w-[20px] md:w-[24px] h-auto" />
              ))}
            </div>
            <span className="text-[24px] sm:text-[28px] md:text-[34px] font-semibold text-[#593102] ml-1 sm:ml-2">4.9</span>
            <span className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#593102] ml-2 sm:ml-3">loved by</span>
            <span className="text-[#A98F78] text-[14px] sm:text-[16px] md:text-[18px] ml-1 sm:ml-2">20,000+ Customers</span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 size={36} className="text-[#593102] animate-spin" />
            <p className="text-[15px] text-[#A98F78]">Loading customer videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="py-12 text-center text-[#A98F78] text-[15px]">No video feedback available right now.</div>
        ) : (
          <div className="relative mt-8 sm:mt-10 md:mt-14 w-full">
            <div ref={scrollRef} className="flex items-center gap-5 overflow-x-auto scroll-smooth scrollbar-none py-3 px-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
              {videos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedVideo(item)}
                  className="
                    feedback-card
                    group
                    relative
                    shrink-0
                    snap-start
                    w-full // Mobile: Full width
                    sm:w-[calc(50%-10px)] // Tablet: 2 cards
                    md:w-[calc(33.333%-14px)] // Small Desktop: 3 cards
                    lg:w-[calc(25%-15px)] // Large Desktop: 4 cards
                    h-[400px] sm:h-[420px] lg:h-[440px]
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
                  {/* --- VIDEO LAYER (Continuous Autoplay + Modal Click) --- */}
                  {item.videoUrl ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.videoUrl}
                        poster={item.thumbnail || undefined}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <Image
                      src={item.thumbnail || `/api/placeholder/400/600?text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-[44px] h-[44px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white shadow-lg">
                      <Play size={18} className="ml-0.5 text-[#593102] fill-[#593102]" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 pointer-events-none">
                    <h3 className="text-white text-[15px] sm:text-[17px] font-semibold leading-tight truncate">{item.name}</h3>
                    <p className="text-white/80 text-[11px] sm:text-[12px] mt-0.5">⭐ Verified Buyer</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🎬 Video Popup Modal (Loads only when clicked, full size) */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[420px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent absolute top-0 left-0 right-0 z-30">
              <div>
                <h3 className="text-white text-[15px] font-semibold">{selectedVideo.name}</h3>
                <p className="text-white/70 text-[11px]">⭐ Verified Customer Review</p>
              </div>
              <button onClick={() => setSelectedVideo(null)} className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/20">
                <X size={18} />
              </button>
            </div>
            <div className="relative w-full aspect-[9/16] bg-black">
              <video src={selectedVideo.videoUrl} controls autoPlay playsInline className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
      <div className="absolute left-1/2 bottom-[-120px] -translate-x-1/2 w-[650px] h-[210px] rounded-full bg-[#FFF2D8] blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8D5BA] to-transparent" />
    </section>
  );
}