"use client";

import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState, useEffect, useRef, useCallback } from "react";

interface Product {
  id: number;
  image: string;
  badgeText: string;
  comingSoonLabel: string;
  title: string;
  description: string;
  subDescription: string;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  detailsTitle: string;
  detailsDescription: string;
  features: string[];
}

const products: Product[] = [
  {
    id: 1,
    image: "/Upcoming.png",
    badgeText: "New Arrival",
    comingSoonLabel: "COMING SOON",
    title: "Upcoming\nProduct",
    description: "Something sweet is on the way",
    subDescription: "Stay tuned!",
    countdown: { days: 14, hours: 5, minutes: 20, seconds: 11 },
    detailsTitle: "Tulsi Honey",
    detailsDescription: "Infused with the goodness\nof Tulsi, Pure, Natural",
    features: ["Boosts Immunity", "Rich in Antioxidants", "100% Raw & Natural"],
  },
  {
    id: 2,
    image: "/Upcoming.png",
    badgeText: "Coming Soon",
    comingSoonLabel: "PRE-ORDER",
    title: "Organic\nHoney",
    description: "Pure & Natural from Himalayas",
    subDescription: "Limited stock!",
    countdown: { days: 7, hours: 12, minutes: 30, seconds: 0 },
    detailsTitle: "Wild Forest Honey",
    detailsDescription: "Collected from deep forests,\nrich in minerals",
    features: ["100% Raw", "No Additives", "High Enzymatic Activity"],
  },
  {
    id: 3,
    image: "/Upcoming.png",
    badgeText: "Limited Edition",
    comingSoonLabel: "EXCLUSIVE",
    title: "Infused\nHoney",
    description: "With Ginger & Turmeric",
    subDescription: "Available soon!",
    countdown: { days: 21, hours: 3, minutes: 45, seconds: 22 },
    detailsTitle: "Ginger Honey",
    detailsDescription: "Warm and soothing,\nperfect for winters",
    features: ["Anti-inflammatory", "Digestive Aid", "Natural Energy"],
  },
];

// Clone for infinite loop: [last, 0, 1, 2, first]
const slides = [products[products.length - 1], ...products, products[0]];
const TOTAL = slides.length;

export default function UpcomingProduct() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const nextRef = useRef<() => void>(() => {});
  const isTransitioningRef = useRef(isTransitioning);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);

  // ----- navigation -----
  const goTo = useCallback((index: number, transition = true) => {
    if (!isMounted.current) return;
    setIsTransitioning(transition);
    setCurrentIndex(index);
  }, []);

  const next = useCallback(() => {
    if (!isTransitioningRef.current) return;
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const prev = useCallback(() => {
    if (!isTransitioningRef.current) return;
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // ----- infinite loop via onTransitionEnd -----
  const handleTransitionEnd = useCallback(() => {
    if (!isMounted.current) return;
    if (currentIndex === TOTAL - 1) {
      // jumped to cloned first → snap to real first (index 1) without transition
      setIsTransitioning(false);
      setCurrentIndex(1);
      // re‑enable transition after paint
      requestAnimationFrame(() => {
        if (isMounted.current) setIsTransitioning(true);
      });
    } else if (currentIndex === 0) {
      // jumped to cloned last → snap to real last (index TOTAL-2)
      setIsTransitioning(false);
      setCurrentIndex(TOTAL - 2);
      requestAnimationFrame(() => {
        if (isMounted.current) setIsTransitioning(true);
      });
    }
  }, [currentIndex]);

  // ----- auto‑play -----
  const startAutoPlay = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isTransitioningRef.current) nextRef.current();
    }, 4000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    startAutoPlay();
    return () => {
      isMounted.current = false;
      stopAutoPlay();
    };
  }, [startAutoPlay, stopAutoPlay, currentIndex]);

  // ----- handlers (pause / resume) -----
  const handlePrev = useCallback(() => {
    stopAutoPlay();
    prev();
  }, [stopAutoPlay, prev]);

  const handleNext = useCallback(() => {
    stopAutoPlay();
    next();
  }, [stopAutoPlay, next]);

  // ----- touch swipe for mobile -----
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = touchStartX.current;
    isDragging.current = true;
    stopAutoPlay();
  }, [stopAutoPlay]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchCurrentX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = touchStartX.current - touchCurrentX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) handleNext();
      else handlePrev();
    } else {
      // no significant swipe → resume auto‑play if not hovering
      // we'll resume via onTouchStart/End already stopped; we can restart after a delay
      setTimeout(startAutoPlay, 300);
    }
    touchStartX.current = 0;
    touchCurrentX.current = 0;
  }, [handleNext, handlePrev, startAutoPlay]);

  // ----- render helpers (countdown) -----
  const renderCountdown = (product: Product, isMobile = false) => {
    const items = [
      { value: product.countdown.days, label: "Days" },
      { value: product.countdown.hours, label: "hour" },
      { value: product.countdown.minutes, label: "Minute" },
      { value: product.countdown.seconds, label: "Second" },
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

  // ----- desktop track -----
  const renderDesktopTrack = () => (
    <div className="overflow-hidden min-w-0">
      <div
        ref={trackRef}
        className="flex"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((product, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 min-w-full w-full grid grid-cols-[minmax(0,322px)_minmax(0,1fr)_minmax(0,360px)] gap-8 items-center"
          >
            {/* LEFT CARD */}
            <div className="flex justify-center min-w-0">
              <div className="relative w-full max-w-[320px] min-w-0 rounded-[22px] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                <div className="absolute top-3 left-3 z-20">
                  <span className="bg-[#7DA314] text-white text-[12px] px-4 py-1.5 rounded-lg font-medium">
                    {product.badgeText}
                  </span>
                </div>
                <Image
                  src={product.image}
                  alt="Upcoming Honey"
                  width={320}
                  height={320}
                  priority={idx === 1}
                  quality={100}
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="w-full h-[320px] object-cover"
                />
              </div>
            </div>

            {/* CENTER */}
            <div className="flex flex-col items-center justify-center text-center bg-white rounded-[18px] border border-[#F3E8DA] px-8 py-6 shadow-sm h-[400px] min-w-0">
              <span className="uppercase tracking-[5px] text-[#D49313] text-[13px] font-semibold">
                {product.comingSoonLabel}
              </span>
              <h2 className="mt-2 text-[42px] font-semibold leading-tight text-[#5A2505] whitespace-pre-line">
                {product.title}
              </h2>
              <p className="mt-2 text-[16px] text-[#444]">{product.description}</p>
              <p className="mt-1 text-[16px] font-semibold text-[#6B3008]">
                {product.subDescription}
              </p>
              <div className="flex gap-6 mt-6">{renderCountdown(product)}</div>
              <button className="mt-6 h-[44px] w-[170px] rounded-xl bg-[#D49313] text-white font-medium text-[16px] shadow-lg transition-all duration-300 hover:bg-[#BB7E11] hover:shadow-xl hover:-translate-y-1">
                Pre Order Now
              </button>
            </div>

            {/* RIGHT */}
            <div className="relative bg-[#FFF8F0] rounded-[18px] border border-[#F3E8DA] px-8 py-8 h-[400px] overflow-hidden min-w-0">
              <h3 className="text-[32px] font-serif text-[#2F241B]">{product.detailsTitle}</h3>
              <p className="mt-5 text-[17px] leading-8 text-[#5B4A3D] whitespace-pre-line">
                {product.detailsDescription}
              </p>
              <div className="mt-10 space-y-5">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Image src="/check.png" alt="" width={22} height={22} className="w-[22px] h-auto" />
                    <span className="text-[18px] text-[#2F241B]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ----- mobile track (single card) -----
  const renderMobileTrack = () => (
    <div
      className="overflow-hidden min-w-0"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((product, idx) => (
          <div key={idx} className="flex-shrink-0 min-w-full w-full flex justify-center">
            <div className="max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#EEE5D9]">
              <div className="relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#7DA314] text-white text-[12px] px-4 py-1.5 rounded-lg font-medium">
                    {product.badgeText}
                  </span>
                </div>
                <Image
                  src={product.image}
                  alt="Upcoming Honey"
                  width={400}
                  height={300}
                  priority={idx === 1}
                  quality={100}
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="w-full h-[220px] object-cover"
                />
              </div>
              <div className="p-5 text-center">
                <span className="uppercase tracking-[4px] text-[#D49313] text-[12px] font-semibold">
                  {product.comingSoonLabel}
                </span>
                <h2 className="mt-1 text-[26px] font-semibold leading-tight text-[#5A2505] whitespace-pre-line">
                  {product.title}
                </h2>
                <p className="mt-1 text-[14px] text-[#444]">{product.description}</p>
                <p className="mt-0 text-[14px] font-semibold text-[#6B3008]">
                  {product.subDescription}
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  {renderCountdown(product, true)}
                </div>
                <div className="mt-4 pt-4 border-t border-[#EEE5D9] text-left">
                  <h3 className="text-[20px] font-serif text-[#2F241B] text-center">
                    {product.detailsTitle}
                  </h3>
                  <p className="mt-1 text-[14px] leading-6 text-[#5B4A3D] text-center whitespace-pre-line">
                    {product.detailsDescription}
                  </p>
                  <div className="mt-3 space-y-2">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Image src="/check.png" alt="" width={18} height={18} className="w-[18px] h-auto" />
                        <span className="text-[14px] text-[#2F241B]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="mt-5 h-[42px] w-full rounded-xl bg-[#D49313] text-white font-medium text-[15px] shadow-lg transition-all duration-300 hover:bg-[#BB7E11] hover:shadow-xl hover:-translate-y-1">
                  Pre Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <section
      className="relative bg-[#FBF7F1] overflow-hidden select-none border-b border-[#F1DEC7] border-b-[0.5px]"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {/* Decoration – now behind everything (z-10) */}
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
        {/* ===== DESKTOP ===== */}
        <div className="hidden lg:grid grid-cols-[70px_minmax(0,1fr)_70px] items-center gap-8">
        <div className="flex justify-center">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-white shadow-md text-[#D49313] flex items-center justify-center hover:bg-[#D49313] hover:text-white transition-all duration-300 active:scale-90 focus:outline-none"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={22} />
          </button>
        </div>

        <div className="overflow-hidden min-w-0">
          {renderDesktopTrack()}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-white shadow-md text-[#D49313] flex items-center justify-center hover:bg-[#D49313] hover:text-white transition-all duration-300 active:scale-90 focus:outline-none"
            aria-label="Next slide"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>

        {/* ===== MOBILE ===== */}
        <div className="lg:hidden relative">
          {/* Arrows overlay */}
          <button
            onClick={handlePrev}
            className="
              absolute left-0 top-1/2 -translate-y-1/2 z-30
              w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md
              text-[#D49313] flex items-center justify-center
              hover:bg-[#D49313] hover:text-white transition-all duration-300
              ml-1 active:scale-90 focus:outline-none
            "
            aria-label="Previous slide"
          >
            <FiChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            className="
              absolute right-0 top-1/2 -translate-y-1/2 z-30
              w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md
              text-[#D49313] flex items-center justify-center
              hover:bg-[#D49313] hover:text-white transition-all duration-300
              mr-1 active:scale-90 focus:outline-none
            "
            aria-label="Next slide"
          >
            <FiChevronRight size={22} />
          </button>

          {renderMobileTrack()}
        </div>
      </div>
    </section>
  );
}