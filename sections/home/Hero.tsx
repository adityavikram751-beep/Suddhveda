"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiChevronRight } from "react-icons/fi";

function FssaiBadge() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#D49313]/60 bg-white flex items-center justify-center shadow-md p-1 sm:p-1.5 mx-auto group-hover:scale-105 group-hover:border-[#FFD700] transition-all shrink-0 aspect-square overflow-hidden">
      {!imgError ? (
        <Image
          src="/fssai.png"
          alt="FSSAI Approved"
          width={80}
          height={80}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-[#593102] text-[9px] xs:text-[10px] sm:text-[11px] font-black">FSSAI</span>
      )}
    </div>
  );
}

function IsoBadge() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#D49313]/60 bg-white flex items-center justify-center shadow-md p-1 sm:p-1.5 mx-auto group-hover:scale-105 group-hover:border-[#FFD700] transition-all shrink-0 aspect-square overflow-hidden">
      {!imgError ? (
        <Image
          src="/iso-.png"
          alt="ISO Certified 22000:2015"
          width={100}
          height={100}
          className="w-full h-full object-contain rounded-full scale-125"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-[#593102] text-[9px] xs:text-[10px] sm:text-[11px] font-black">ISO</span>
      )}
    </div>
  );
}

function NaturalBadge() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#D49313]/60 bg-white flex items-center justify-center shadow-md p-1 sm:p-1.5 mx-auto group-hover:scale-105 group-hover:border-[#FFD700] transition-all shrink-0 aspect-square overflow-hidden">
      {!imgError ? (
        <Image
          src="/natural.webp"
          alt="100% Pure & Natural"
          width={100}
          height={100}
          className="w-full h-full object-contain rounded-full scale-125"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-[#593102] text-[9px] xs:text-[10px] sm:text-[11px] font-black">100%</span>
      )}
    </div>
  );
}

function LabTestedBadge() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#D49313]/60 bg-white flex items-center justify-center shadow-md p-1 sm:p-1.5 mx-auto group-hover:scale-105 group-hover:border-[#FFD700] transition-all shrink-0 aspect-square overflow-hidden">
      {!imgError ? (
        <Image
          src="/lab..webp"
          alt="Lab Tested Purity & Safety"
          width={100}
          height={100}
          className="w-full h-full object-contain rounded-full scale-125"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-[#593102] text-[9px] xs:text-[10px] sm:text-[11px] font-black">LAB</span>
      )}
    </div>
  );
}

const slides = [
  {
    id: 1,
    tagline: "PURE MUSTARD FLOWER NECTAR • DEFINITELY BETTER",
    titleLine1: "MUSTARD",
    titleLine2: "HONEY",
    subtitle: "Collected from mustard flower fields. Golden, smooth and full of natural energy.",
    desktopBg: "/backgroundf.png",
    mobileBg: "/mustardm.png",
    bottleImg: "/mustard honey.png",
    alt: "Mustard Honey Jar",
    link: "/shop?category=mustard",
  },
  {
    id: 2,
    tagline: "WILD AJWAIN BLOSSOMS • DIGESTIVE HEALTH & WELLNESS",
    titleLine1: "AJWAIN",
    titleLine2: "HONEY",
    subtitle: "Harvested from wild ajwain blossoms. Known for digestive health & aromatic flavor.",
    desktopBg: "/backgrounda.png",
    mobileBg: "/ajwain.png",
    bottleImg: "/ajwain honey.png",
    alt: "Ajwain Honey Jar",
    link: "/shop?category=ajwain",
  },
  {
    id: 3,
    tagline: "ORGANIC FENNEL FIELDS • MILD & SOOTHING PURITY",
    titleLine1: "FENNEL",
    titleLine2: "HONEY",
    subtitle: "Extracted from organic fennel fields. Mild, soothing with natural digestive benefits.",
    desktopBg: "/backgroundo.png",
    mobileBg: "/fannel.png",
    bottleImg: "/fennel honey.png",
    alt: "Fennel Honey Jar",
    link: "/shop?category=fennel",
  },
  {
    id: 4,
    tagline: "LUSH LITCHI ORCHARDS • FRUITY, LIGHT & SWEET",
    titleLine1: "LITCHI",
    titleLine2: "HONEY",
    subtitle: "Sourced from lush litchi orchards. Light, fruity, and naturally sweet.",
    desktopBg: "/backgroundl.png",
    mobileBg: "/lyechi.png",
    bottleImg: "/litchi honey.png",
    alt: "Litchi Honey Jar",
    link: "/shop?category=litchi",
  },
  {
    id: 5,
    tagline: "FOREST WILDFLOWERS • RICH IN NATURAL ANTIOXIDANTS",
    titleLine1: "MULTI FLORA",
    titleLine2: "HONEY",
    subtitle: "Nectar gathered from diverse forest wildflowers. Rich in antioxidants and minerals.",
    desktopBg: "/backgroundm.png",
    mobileBg: "/multim.png",
    bottleImg: "/multi flora.png",
    alt: "Multi Flora Honey Jar",
    link: "/shop?category=multiflora",
  },
  {
    id: 6,
    tagline: "UNPROCESSED RAW HONEY • STRAIGHT FROM FARM HIVES",
    titleLine1: "RAW NATURAL",
    titleLine2: "HONEY",
    subtitle: "Pure, unprocessed nectar straight from trusted farm hives with zero additives.",
    desktopBg: "/backgroundn.png",
    mobileBg: "/natural.png",
    bottleImg: "/natural honey.png",
    alt: "Raw Natural Honey Jar",
    link: "/shop?category=natural",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2300);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      nextSlide();
    } else if (distance < -40) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden min-h-[820px] xs:min-h-[880px] sm:min-h-[940px] lg:min-h-[700px] flex items-center select-none w-full bg-[#111] touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Seamless Cross-fade Overlapping Slides Container */}
      <div className="relative w-full min-h-[820px] xs:min-h-[880px] sm:min-h-[940px] lg:min-h-[700px] flex items-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={`slide-${slide.id}`}
              className={`absolute inset-0 w-full h-full flex items-start lg:items-center pt-8 xs:pt-10 sm:py-10 lg:py-12 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              {/* Mobile Background Image (Pure CSS - SSR Safe, Zero Hydration Error) */}
              <div
                className="absolute inset-0 bg-cover bg-center block lg:hidden pointer-events-none z-0"
                style={{ backgroundImage: `url('${slide.mobileBg}')` }}
              />

              {/* Desktop Background Image (Pure CSS - SSR Safe, Zero Hydration Error) */}
              <div
                className="absolute inset-0 bg-cover bg-center hidden lg:block pointer-events-none z-0"
                style={{ backgroundImage: `url('${slide.desktopBg}')` }}
              />

              {/* Balanced Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35 lg:from-black/55 lg:via-black/35 lg:to-black/20 pointer-events-none z-0" />

              <div className="max-w-[1440px] mx-auto w-full px-3 xs:px-4 sm:px-8 lg:px-16 relative z-10 pt-1 sm:pt-0 pb-16 xs:pb-24 lg:pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-8 lg:gap-4 items-center">

                  {/* LEFT CONTENT */}
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

                    {/* Top Tagline Badge - Dynamic per slide */}
                    <div className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-1.5 xs:mb-2 sm:mb-3 max-w-full">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFD700] animate-pulse shrink-0" />
                      <span className="text-[#FFD700] font-extrabold text-[10px] xs:text-[11px] sm:text-[13px] lg:text-[14px] tracking-wider uppercase font-sans drop-shadow-sm truncate">
                        {slide.tagline}
                      </span>
                    </div>

                    {/* Main Title - Mobile (Single Line) & Desktop (2 Stacked Lines with Gap) */}
                    {/* Mobile Single Line Title */}
                    <h1 className="lg:hidden flex flex-wrap items-center justify-center gap-x-2 text-[26px] xs:text-[32px] sm:text-[46px] leading-[1] font-black tracking-tight uppercase">
                      <span style={{ color: "#F9531E", textShadow: "0 3px 12px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8)" }}>
                        {slide.titleLine1}
                      </span>
                      <span style={{ color: "#FFFFFF", textShadow: "0 3px 12px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8)" }}>
                        {slide.titleLine2}
                      </span>
                    </h1>

                    {/* Desktop 2-Line Stacked Title with Vertical Gap */}
                    <div className="hidden lg:flex flex-col mt-1">
                      <h1
                        className="text-[68px] xl:text-[76px] leading-[0.95] font-black tracking-tight uppercase"
                        style={{ color: "#F9531E", textShadow: "0 4px 15px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8)" }}
                      >
                        {slide.titleLine1}
                      </h1>
                      <h1
                        className="text-[68px] xl:text-[76px] leading-[0.95] font-black tracking-tight uppercase mt-1.5"
                        style={{ color: "#FFFFFF", textShadow: "0 4px 15px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8)" }}
                      >
                        {slide.titleLine2}
                      </h1>
                    </div>

                    {/* Subtitle / Description Text */}
                    <p className="text-[#F3F4F6] text-[12.5px] xs:text-[14px] sm:text-[16px] lg:text-[19px] font-medium leading-relaxed max-w-[520px] mt-2 xs:mt-2.5 sm:mt-4 drop-shadow-sm px-1 xs:px-0">
                      {slide.subtitle}
                    </p>

                    {/* MOBILE-ONLY HONEY BOTTLE JAR (Massive Showcase Display) */}
                    <div
                      className="lg:hidden relative flex justify-center items-center w-full h-[360px] xs:h-[420px] sm:h-[480px] my-3 xs:my-4 group cursor-pointer"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <Image
                        src={slide.bottleImg}
                        alt={slide.alt}
                        width={900}
                        height={900}
                        priority
                        className="w-auto h-full max-h-[350px] xs:max-h-[410px] sm:max-h-[470px] object-contain drop-shadow-2xl scale-130 active:scale-135 transition-transform duration-300"
                      />
                    </div>

                    {/* 4 Circular Image Badges (FSSAI, ISO, PURE, LAB TESTED) */}
                    <div className="grid grid-cols-4 gap-2 xs:gap-3 sm:gap-6 mt-12 xs:mt-16 sm:mt-10 w-full max-w-[540px]">
                      {/* FSSAI */}
                      <div className="flex flex-col items-center text-center group cursor-pointer">
                        <FssaiBadge />
                        <span className="text-white text-[9px] xs:text-[10px] sm:text-[12px] font-bold leading-tight mt-1 sm:mt-2.5 uppercase tracking-tight drop-shadow-xs">
                          FSSAI<br />APPROVED
                        </span>
                      </div>

                      {/* ISO */}
                      <div className="flex flex-col items-center text-center group cursor-pointer">
                        <IsoBadge />
                        <span className="text-white text-[9px] xs:text-[10px] sm:text-[12px] font-bold leading-tight mt-1 sm:mt-2.5 uppercase tracking-tight drop-shadow-xs">
                          22000 : 2015
                        </span>
                      </div>

                      {/* PURE & NATURAL */}
                      <div className="flex flex-col items-center text-center group cursor-pointer">
                        <NaturalBadge />
                        <span className="text-white text-[9px] xs:text-[10px] sm:text-[12px] font-bold leading-tight mt-1 sm:mt-2.5 uppercase tracking-tight drop-shadow-xs">
                          PURE &amp;<br />NATURAL
                        </span>
                      </div>

                      {/* LAB TESTED */}
                      <div className="flex flex-col items-center text-center group cursor-pointer">
                        <LabTestedBadge />
                        <span className="text-white text-[9px] xs:text-[10px] sm:text-[12px] font-bold leading-tight mt-1 sm:mt-2.5 uppercase tracking-tight drop-shadow-xs">
                          LAB<br />TESTED
                        </span>
                      </div>
                    </div>

                    {/* Perfectly Balanced Orange BUY NOW Button */}
                    <Link
                      href={slide.link}
                      className="mt-6 xs:mt-7 sm:mt-6 bg-[#F9531E] hover:bg-[#E04515] text-white px-5 py-2 xs:px-6 xs:py-2.5 sm:px-6 sm:py-2.5 rounded-xl font-bold text-[12px] xs:text-[13px] sm:text-[14px] shadow-md inline-flex items-center gap-2 tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer border border-white/20"
                    >
                      <FiShoppingCart size={15} />
                      <span>BUY NOW</span>
                      <FiChevronRight size={15} />
                    </Link>



                  </div>

                  {/* DESKTOP-ONLY HONEY BOTTLE JAR (Right column on desktop) */}
                  <div
                    className="hidden lg:flex relative justify-end items-center w-full h-[560px] group cursor-pointer"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <Image
                      src={slide.bottleImg}
                      alt={slide.alt}
                      width={850}
                      height={850}
                      priority
                      className="w-auto h-full max-h-[540px] object-contain drop-shadow-2xl scale-105 group-hover:-translate-y-7 group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}