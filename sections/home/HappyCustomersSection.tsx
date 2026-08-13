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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF9F3] via-[#FAF6F0] to-[#FDF9F3] py-14 sm:py-20 border-t border-b border-[#EADCC9]/60">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D49313]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Decorative Graphics */}
      <Image src="/customer2.png" alt="" width={70} height={70} className="absolute left-[62%] top-12 z-10 hidden lg:block pointer-events-none opacity-80" />
      <Image src="/customer.png" alt="" width={240} height={220} className="absolute right-0 top-0 z-10 hidden lg:block pointer-events-none opacity-85" />

      <div className="relative max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="text-center flex flex-col items-center">
          <span className="uppercase tracking-[0.18em] text-[#593102] text-[12px] font-extrabold bg-[#FAF0DC] border border-[#D49313]/50 px-4 py-1.5 rounded-full shadow-2xs">
            TRUST &amp; REVIEWS
          </span>

          <h2 className="mt-3 text-[34px] sm:text-[42px] lg:text-[48px] font-serif font-extrabold text-[#593102] leading-tight tracking-tight">
            Happy Customers
          </h2>
          
          <p className="mt-2.5 text-[15px] sm:text-[17px] text-[#6E5D4F] font-medium max-w-[680px] mx-auto leading-relaxed">
            Trusted by thousands of families who choose 100% purity, natural taste, and uncompromised quality every day.
          </p>

          {/* Rating Showcase Badge */}
          <div className="mt-4 inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#D49313]/40 shadow-sm">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={18} fill="#F59E0B" color="#F59E0B" className="text-[#F59E0B]" />
              ))}
            </div>
            <span className="text-[20px] font-black text-[#593102] border-l border-[#EADCC9] pl-3">4.9 / 5.0</span>
            <span className="text-[13px] font-bold text-[#7A6A5C] uppercase tracking-wider hidden sm:inline">• Loved by 20,000+ Families</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 size={40} className="text-[#D49313] animate-spin" />
            <p className="text-[15px] text-[#6E5D4F] font-semibold">Loading customer stories...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="py-16 text-center text-[#6E5D4F] text-[15px] font-medium">No video feedback available right now.</div>
        ) : (
          <div className="relative mt-10 sm:mt-12 w-full">
            <div ref={scrollRef} className="flex items-center gap-6 overflow-x-auto scroll-smooth scrollbar-none py-4 px-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
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
                    w-full
                    sm:w-[calc(50%-12px)]
                    md:w-[calc(33.333%-16px)]
                    lg:w-[calc(25%-18px)]
                    h-[410px] sm:h-[430px] lg:h-[450px]
                    overflow-hidden
                    rounded-3xl
                    border-2
                    border-[#D49313]/30
                    bg-black
                    shadow-xl
                    cursor-pointer
                    transition-all
                    duration-500
                    hover:shadow-2xl
                    hover:border-[#D49313]/80
                    hover:-translate-y-1.5
                  "
                >
                  {/* --- VIDEO LAYER (Continuous Autoplay + Modal Click) --- */}
                  {item.videoUrl ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.videoUrl}
                        poster={item.thumbnail || undefined}
                        autoPlay={!selectedVideo}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        ref={(el) => {
                          if (el) {
                            if (selectedVideo) {
                              el.pause();
                            }
                          }
                        }}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                    </div>
                  ) : (
                    <Image
                      src={item.thumbnail || `/api/placeholder/400/600?text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  {/* Glowing Golden Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] border-2 border-[#FFD700]/60 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-xl">
                      <Play size={22} className="ml-0.5 text-white fill-white" />
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pointer-events-none">
                    <h3 className="text-white text-[17px] sm:text-[19px] font-serif font-bold leading-tight truncate group-hover:text-[#FFD700] transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[#FFD700] text-[12px] font-extrabold uppercase tracking-wider">
                      <span>✓ Verified Buyer</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🎬 Video Popup Modal (Smooth Desktop Playback, No GPU Bottleneck) */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-[360px] sm:max-w-[380px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent absolute top-0 left-0 right-0 z-30">
              <div>
                <h3 className="text-white text-[15px] font-serif font-bold">{selectedVideo.name}</h3>
                <p className="text-[#FFD700] text-[11px] font-extrabold uppercase tracking-wider">✓ Verified Customer</p>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedVideo(null)} 
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Video Stream - Object-Contain for Butter-Smooth Decoding */}
            <div className="relative w-full h-[480px] sm:h-[520px] max-h-[75vh] bg-black flex items-center justify-center">
              <video 
                src={selectedVideo.videoUrl} 
                controls 
                autoPlay 
                playsInline 
                preload="auto"
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
        </div>
      )}
      <div className="absolute left-1/2 bottom-[-120px] -translate-x-1/2 w-[650px] h-[210px] rounded-full bg-[#FFF2D8] blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8D5BA] to-transparent" />
    </section>
  );
}