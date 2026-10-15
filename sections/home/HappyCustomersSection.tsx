"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Star, X, Loader2, Volume2, VolumeX } from "lucide-react";
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Modal Video Player Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showPlayPulse, setShowPlayPulse] = useState<boolean>(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Carousel Controls
  const [isCarouselHovered, setIsCarouselHovered] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const currentVideo = selectedIndex !== null ? videos[selectedIndex] : null;
  const prevIndex =
    selectedIndex !== null && videos.length > 1
      ? selectedIndex === 0
        ? videos.length - 1
        : selectedIndex - 1
      : null;
  const nextIndex =
    selectedIndex !== null && videos.length > 1
      ? selectedIndex === videos.length - 1
        ? 0
        : selectedIndex + 1
      : null;
  const prevVideo = prevIndex !== null ? videos[prevIndex] : null;
  const nextVideo = nextIndex !== null ? videos[nextIndex] : null;

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
        name: item.name || item.customerName || item.user?.name || "",
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

  // --- Smart Autoplay for Carousel Cards ---
  useEffect(() => {
    if (videos.length === 0 || selectedIndex !== null) return;

    const observerOptions = {
      root: scrollRef.current,
      rootMargin: "0px 50px 0px 50px",
      threshold: 0.75,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const videoId = entry.target.getAttribute("data-video-id");
        const videoElement = videoRefs.current.get(videoId!);

        if (!videoElement) return;

        if (entry.isIntersecting && !playingVideoId) {
          videoElement.play().catch((error) => {
            console.warn("Autoplay prevented:", error);
          });
        } else if (!entry.isIntersecting && playingVideoId === videoId) {
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
  }, [videos, playingVideoId, selectedIndex]);

  // --- Carousel Auto-Scroll Logic ---
  useEffect(() => {
    if (videos.length === 0 || isCarouselHovered || selectedIndex !== null) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const firstCard = container.querySelector(".feedback-card") as HTMLElement;
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth + 24; // gap 24px
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [videos, isCarouselHovered, selectedIndex]);

  // --- Modal Navigation & Controls ---
  const handlePrev = useCallback(() => {
    if (videos.length === 0) return;
    setSelectedIndex((prev) => (prev === null || prev === 0 ? videos.length - 1 : prev - 1));
  }, [videos.length]);

  const handleNext = useCallback(() => {
    if (videos.length === 0) return;
    setSelectedIndex((prev) => (prev === null || prev >= videos.length - 1 ? 0 : prev + 1));
  }, [videos.length]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalVideoRef.current) {
      const nextMuted = !modalVideoRef.current.muted;
      modalVideoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  const togglePlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play();
        setIsPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsPlaying(false);
      }
      setShowPlayPulse(true);
      setTimeout(() => setShowPlayPulse(false), 500);
    }
  };

  const handleTimeUpdate = () => {
    if (modalVideoRef.current) {
      const current = modalVideoRef.current.currentTime;
      const duration = modalVideoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (modalVideoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
      modalVideoRef.current.currentTime = newRatio * (modalVideoRef.current.duration || 0);
    }
  };

  // Touch Swipe Handlers for Mobile (Supports both Horizontal & Vertical Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartPos.current.x - touchEndX;
    const diffY = touchStartPos.current.y - touchEndY;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      // Vertical swipe (TikTok / Reels style)
      if (diffY > 45) {
        handleNext(); // swipe up to next
      } else if (diffY < -45) {
        handlePrev(); // swipe down to prev
      }
    } else {
      // Horizontal swipe
      if (diffX > 45) {
        handleNext(); // swipe left to next
      } else if (diffX < -45) {
        handlePrev(); // swipe right to prev
      }
    }
    touchStartPos.current = null;
  };

  // Reset modal video state on video change
  useEffect(() => {
    if (selectedIndex !== null) {
      setIsPlaying(true);
      setProgress(0);
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = 0;
        modalVideoRef.current.play().catch(() => {
          if (modalVideoRef.current) {
            modalVideoRef.current.muted = true;
            setIsMuted(true);
            modalVideoRef.current.play().catch(() => { });
          }
        });
      }
    }
  }, [selectedIndex]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") handlePrev();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") handleNext();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m" || e.key === "M") {
        setIsMuted((prev) => {
          if (modalVideoRef.current) modalVideoRef.current.muted = !prev;
          return !prev;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF9F3] via-[#FAF6F0] to-[#FDF9F3] py-14 sm:py-20 border-t border-b border-[#EADCC9]/60">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D49313]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="text-center flex flex-col items-center max-w-[900px] mx-auto">
          <Image
            src="/yellow logo.png"
            alt="ShuddhVeda Honey"
            width={120}
            height={120}
            className="w-[100px] sm:w-[125px] h-auto object-contain mb-4"
          />

          <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-serif font-bold text-[#3C2415] tracking-tight">
            How do we get this right?
          </h2>

          <div className="mt-4 text-[14px] sm:text-[15.5px] text-[#7C6A5B] font-medium leading-relaxed space-y-3">
            <p>
              Each harvest comes from one named apiary partner, in a season we can point to on a calendar — not a blend of sources sold under one label. Nothing is added to bulk it out, and nothing is heated past the point where its character survives.
            </p>
            <p>
              We pay our beekeeper partners a fixed, agreed share of every jar sold — not a rate that moves with our margins.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 size={40} className="text-[#D49313] animate-spin" />
            <p className="text-[15px] text-[#6E5D4F] font-semibold">Loading customer stories...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="py-16 text-center text-[#6E5D4F] text-[15px] font-medium">
            No video feedback available right now.
          </div>
        ) : (
          <div
            className="relative mt-10 sm:mt-12 w-full"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            <div
              ref={scrollRef}
              className="flex items-center gap-6 overflow-x-auto scroll-smooth scrollbar-none py-4 px-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
            >
              {videos.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedIndex(index)}
                  className="
                    feedback-card
                    group
                    relative
                    shrink-0
                    snap-start
                    w-[260px] sm:w-[280px] md:w-[300px] lg:w-[calc(25%-18px)]
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
                  {/* --- VIDEO LAYER --- */}
                  {item.videoUrl ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.videoUrl}
                        poster={item.thumbnail || undefined}
                        autoPlay={selectedIndex === null}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        ref={(el) => {
                          if (el) {
                            videoRefs.current.set(item.id, el);
                            if (selectedIndex !== null) {
                              el.pause();
                            }
                          } else {
                            videoRefs.current.delete(item.id);
                          }
                        }}
                        data-video-id={item.id}
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
                    <h3 className="text-white text-[17px] sm:text-[19px] font-serif font-bold leading-tight truncate group-hover:text-[#FFD700] transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[#FFD700] text-[12px] font-extrabold uppercase tracking-wider">
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🎬 Reel Modal View (Mobile: 100% Full Screen Edge-to-Edge | Desktop: 3-Reel Layout | NO ARROWS | NO CART BUTTON) */}
      {selectedIndex !== null && currentVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black sm:bg-black/90 sm:backdrop-blur-md p-0 sm:p-4 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Desktop Fixed Close Button (Top-Right) */}
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close"
            className="hidden sm:flex fixed top-6 right-8 z-50 w-11 h-11 rounded-full bg-black/70 hover:bg-black text-white border border-white/25 backdrop-blur-md items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          >
            <X size={22} />
          </button>

          {/* Reel Track Container */}
          <div
            className="relative w-full h-full sm:max-w-[1350px] flex items-center justify-center overflow-hidden sm:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ⬅️ Left Side Video (Previous Customer Story - Desktop Only) */}
            {prevVideo && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="
                  hidden sm:flex
                  relative
                  shrink-0
                  w-[140px] md:w-[220px] lg:w-[260px]
                  h-[62vh] max-h-[560px]
                  rounded-2xl sm:rounded-3xl
                  overflow-hidden
                  bg-black/80
                  border border-white/10
                  opacity-45 hover:opacity-90
                  transition-all duration-300
                  cursor-pointer
                  shadow-2xl
                  scale-95 hover:scale-100
                  mr-2 sm:mr-4 md:mr-6
                  group
                  select-none
                "
              >
                {prevVideo.videoUrl ? (
                  <video
                    src={prevVideo.videoUrl}
                    poster={prevVideo.thumbnail || undefined}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover pointer-events-none brightness-90 group-hover:brightness-100 transition-all"
                  />
                ) : (
                  <Image
                    src={prevVideo.thumbnail || `/api/placeholder/400/600?text=${prevVideo.name}`}
                    alt={prevVideo.name}
                    fill
                    className="object-cover pointer-events-none brightness-90 group-hover:brightness-100 transition-all"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 group-hover:from-black/70 transition-colors pointer-events-none" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#D49313]/80 transition-all shadow-xl">
                    <Play size={20} className="fill-white text-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-4 inset-x-3 text-center pointer-events-none">
                  <p className="text-white text-[13px] sm:text-[14px] font-medium truncate drop-shadow">
                    {prevVideo.name}
                  </p>
                </div>
              </div>
            )}

            {/* ⭐ Center Active Video (Mobile: Fullscreen 100% Edge-to-Edge | Desktop: Dedicated Reel Card) */}
            <div
              className="
                relative
                w-full h-full
                sm:w-[350px] md:w-[390px] lg:w-[420px]
                sm:h-[82vh] sm:max-h-[720px]
                bg-black
                rounded-none sm:rounded-3xl
                overflow-hidden
                shadow-none sm:shadow-[0_0_50px_rgba(0,0,0,0.85)]
                border-0 sm:border-2 sm:border-white/25
                flex flex-col
                z-20
                select-none
              "
            >
              {/* Close Button (Top-Right on Mobile, exact match to screenshot) */}
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close video"
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
              >
                <X size={19} />
              </button>

              {/* Sound Toggle Button (Bottom-Right on Mobile & Desktop, exact match to screenshot) */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="absolute bottom-20 right-4 sm:bottom-16 sm:right-4 z-40 w-11 h-11 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/25 backdrop-blur-md shadow-xl hover:scale-105 active:scale-95"
              >
                {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>

              {/* Video Player Area */}
              <div
                className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={togglePlay}
              >
                <video
                  ref={modalVideoRef}
                  key={currentVideo.videoUrl}
                  src={currentVideo.videoUrl}
                  poster={currentVideo.thumbnail || undefined}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />

                {/* Play / Pause Animated Pulse */}
                {showPlayPulse && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                      {isPlaying ? (
                        <Play size={28} className="fill-white ml-1" />
                      ) : (
                        <Pause size={28} className="fill-white" />
                      )}
                    </div>
                  </div>
                )}

                {/* Centered Play Button when paused */}
                {!isPlaying && !showPlayPulse && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="w-16 h-16 rounded-full bg-black/65 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-2xl">
                      <Play size={26} className="fill-white ml-1" />
                    </div>
                  </div>
                )}

                {/* Subtle Top & Bottom Vignettes */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none z-20" />
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-20" />

                {/* Customer Info (Bottom Left) */}
                <div className="absolute bottom-6 sm:bottom-5 left-4 right-18 z-30 pointer-events-none flex flex-col gap-1">
                  <h3 className="text-white text-[16px] sm:text-[18px] font-serif font-bold drop-shadow-md">
                    {currentVideo.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[#FFD700] text-[11.5px] font-extrabold uppercase tracking-wider drop-shadow-md">

                  </div>
                </div>

                {/* Interactive Bottom Progress Bar / Scrubber */}
                <div
                  className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20 hover:h-2.5 transition-all cursor-pointer z-40 group/bar"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#D49313] to-[#FFD700] relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>

            {/* ➡️ Right Side Video (Next Customer Story - Desktop Only) */}
            {nextVideo && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="
                  hidden sm:flex
                  relative
                  shrink-0
                  w-[140px] md:w-[220px] lg:w-[260px]
                  h-[62vh] max-h-[560px]
                  rounded-2xl sm:rounded-3xl
                  overflow-hidden
                  bg-black/80
                  border border-white/10
                  opacity-45 hover:opacity-90
                  transition-all duration-300
                  cursor-pointer
                  shadow-2xl
                  scale-95 hover:scale-100
                  ml-2 sm:ml-4 md:ml-6
                  group
                  select-none
                "
              >
                {nextVideo.videoUrl ? (
                  <video
                    src={nextVideo.videoUrl}
                    poster={nextVideo.thumbnail || undefined}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover pointer-events-none brightness-90 group-hover:brightness-100 transition-all"
                  />
                ) : (
                  <Image
                    src={nextVideo.thumbnail || `/api/placeholder/400/600?text=${nextVideo.name}`}
                    alt={nextVideo.name}
                    fill
                    className="object-cover pointer-events-none brightness-90 group-hover:brightness-100 transition-all"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 group-hover:from-black/70 transition-colors pointer-events-none" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#D49313]/80 transition-all shadow-xl">
                    <Play size={20} className="fill-white text-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-4 inset-x-3 text-center pointer-events-none">
                  <p className="text-white text-[13px] sm:text-[14px] font-medium truncate drop-shadow">
                    {nextVideo.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute left-1/2 bottom-[-120px] -translate-x-1/2 w-[650px] h-[210px] rounded-full bg-[#FFF2D8] blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E8D5BA] to-transparent" />
    </section>
  );
}