"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, ArrowUpRight } from "lucide-react";

const slides = [
  {
    id: 1,
    name: "Mustard Honey",
    accent: "Honey",
    titleSuffix: "with nothing",
    titleLine2: "to hide",
    subtitle: "Thoughtfully sourced, carefully bottled, and transparently batch-tested for everyday rituals.",
    mobileTitleLine1: "Nature gives",
    mobileAccent: "character.",
    mobileTitleLine2: "We preserve it.",
    mobileSubtitle: "Raw, carefully sourced honey with its natural character intact.",
    regions: "Northwestern",
    flavorNotes: "Mild & Buttery",
    aroma: "Pungent mustardy aroma",
    desktopBg: "/mustardnewdes.png",
    mobileBg: "/mustardm.png",
    bottleImg: "/mustardnew.webp",
    bottleOffset: "translate-x-8 sm:translate-x-20 lg:translate-x-30",
    alt: "Mustard Honey Jar",
    link: "/shop?category=mustard",
  },
  {
    id: 2,
    name: "Ajwain Honey",
    accent: "Golden",
    titleSuffix: "herbal nectar.",
    titleLine2: "crafted for wellness.",
    subtitle: "Hand-harvested from sunlit Ajwain blooms across Chittorgarh, Rajasthan.",
    mobileTitleLine1: "Golden",
    mobileAccent: "herbal nectar.",
    mobileTitleLine2: "Crafted for wellness.",
    mobileSubtitle: "Hand-harvested from sunlit Ajwain blooms across Chittorgarh.",
    regions: "Chittorgarh (Rajasthan)",
    flavorNotes: "Slight Herbal & Earthy",
    aroma: "Subtle spice-like & Earthy",
    desktopBg: "/ajwainnewdes.png",
    mobileBg: "/ajwain.png",
    bottleImg: "/ajwainnew.png",
    bottleOffset: "translate-x-8 sm:translate-x-20 lg:translate-x-30",
    alt: "Ajwain Honey Jar",
    link: "/shop?category=ajwain",
  },
  {
    id: 3,
    name: "Fennel Honey",
    accent: "Clean",
    titleSuffix: "blossom drop.",
    titleLine2: "sweetness redefined.",
    subtitle: "Freshly collected from vibrant fennel fields of Gujarat and Rajasthan.",
    mobileTitleLine1: "Clean",
    mobileAccent: "blossom drop.",
    mobileTitleLine2: "Sweetness redefined.",
    mobileSubtitle: "Freshly collected from vibrant fennel fields of Gujarat.",
    regions: "Gujrat & Rajasthan",
    flavorNotes: "Clean & Slightly Viscous",
    aroma: "Fresh Fennel & Delicately Floral",
    desktopBg: "/funeelnewdes.png",
    mobileBg: "/fannel.png",
    bottleImg: "/funnelnew.webp",
    bottleOffset: "translate-x-8 sm:translate-x-20 lg:translate-x-30",
    alt: "Fennel Honey Jar",
    link: "/shop?category=fennel",
  },
  {
    id: 4,
    name: "Litchi Honey",
    accent: "Fruity",
    titleSuffix: "orchard nectar.",
    titleLine2: "purely authentic.",
    subtitle: "Thoughtfully sourced from lush Pathankot and Ramnagar litchi groves.",
    mobileTitleLine1: "Fruity",
    mobileAccent: "orchard nectar.",
    mobileTitleLine2: "Purely authentic.",
    mobileSubtitle: "Thoughtfully sourced from lush Ramnagar litchi groves.",
    regions: "Pathankot & Ramnagar",
    flavorNotes: "Lightly fruity & Mild",
    aroma: "Light Fruity & litchi blossom",
    desktopBg: "/lychinewdes.png",
    mobileBg: "/dashboard1.png",
    bottleImg: "/dashboardm1.png",
    bottleOffset: "translate-x-8 sm:translate-x-20 lg:translate-x-30",
    alt: "Litchi Honey Jar",
    link: "/shop?category=litchi",
  },
  {
    id: 5,
    name: "Multi Flora Honey",
    accent: "Wild",
    titleSuffix: "forest nectar.",
    titleLine2: "rich & unprocessed.",
    subtitle: "Harvested from pristine wild mountain blooms of Nagrota, Jammu.",
    mobileTitleLine1: "Wild",
    mobileAccent: "forest nectar.",
    mobileTitleLine2: "Rich & unprocessed.",
    mobileSubtitle: "Harvested from pristine wild mountain blooms of Nagrota.",
    regions: "Nagata (jammu)",
    flavorNotes: "Layered & Wild Floral",
    aroma: "Meadow blooms& Slightly earthy",
    desktopBg: "/multinewdes.png",
    mobileBg: "/multim.png",
    bottleImg: "/multinew.png",
    bottleOffset: "-translate-x-8 sm:translate-x-16 lg:translate-x-24",
    alt: "Multi Flora Honey Jar",
    link: "/shop?category=multiflora",
  },
  {
    id: 6,
    name: "Raw Natural Honey",
    accent: "Raw",
    titleSuffix: "mountain honey.",
    titleLine2: "straight from hives.",
    subtitle: "Transparently batch-tested from Corbett & Ramnagar forest reserves.",
    mobileTitleLine1: "Raw",
    mobileAccent: "mountain honey.",
    mobileTitleLine2: "Straight from hives.",
    mobileSubtitle: "Transparently batch-tested from Corbett forest reserves.",
    regions: "Corbett &Ramnagar(UK)",
    flavorNotes: "Light, Clean & Floral",
    aroma: "Fresh, light & Botanical",
    desktopBg: "/naturalnewdes.png",
    mobileBg: "/natural.png",
    bottleImg: "/naturalnew.png",
    bottleOffset: "-translate-x-8 sm:translate-x-16 lg:translate-x-22",
    alt: "Raw Natural Honey Jar",
    link: "/shop?category=natural",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [nextSlide]);

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
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden flex flex-col justify-between select-none w-full bg-[#FAF5EE] touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ========================================================= */}
      {/* MOBILE & TABLET VIEW (< lg screens)                       */}
      {/* Exactly matching reference screenshots                     */}
      {/* ========================================================= */}
      {/* Hidden preloader so browser caches all slide background and bottle assets instantly */}
      <div className="hidden" aria-hidden="true">
        {slides.map((s) => (
          <div key={`preload-${s.id}`}>
            <img src={s.desktopBg || s.mobileBg} alt="" />
            <img src={s.bottleImg} alt="" />
          </div>
        ))}
      </div>

      <div className="block lg:hidden w-full px-3 sm:px-6 pt-3 sm:pt-4 pb-5">
        {/* Mobile Slide Card Container (Compact height & responsive proportion) */}
        <div className="relative w-full rounded-b-[32px] sm:rounded-b-[40px] bg-[#FAF5EE] border border-[#EADBCE]/60 shadow-xs min-h-[500px] xs:min-h-[550px] sm:min-h-[620px] flex flex-col justify-between">

          {/* 1. Background Artworks Container (Clipped strictly to the card's rounded bottom) */}
          <div className="absolute inset-0 w-full h-full rounded-b-[32px] sm:rounded-b-[40px] overflow-hidden">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={`mobile-bg-${slide.id}`}
                  className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 ease-in-out ${isActive ? "opacity-100 z-0" : "opacity-0 -z-10"
                    }`}
                  style={{ backgroundImage: `url('${slide.desktopBg || slide.mobileBg}')` }}
                />
              );
            })}

            {/* Soft Gradient Overlay for crisp text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5EE]/50 via-transparent to-transparent pointer-events-none z-10" />
          </div>

          {/* 2. Top Content (Pill + Headline + Subtitle with dynamic slide transition) */}
          <div className="relative z-20 px-4 xs:px-5 sm:px-8 pt-5 sm:pt-8 text-left flex flex-col items-start w-full">

            {/* Top Tagline Pill Badge */}
            <div className="inline-flex items-center justify-center gap-2 bg-[#FAF3EA]/90 backdrop-blur-sm border border-[#E5D3C2] px-4.5 py-1.5 rounded-full mb-4 shadow-xs">
              <span className="text-[16px] leading-none">🍯</span>
              <span className="text-[#D97706] font-semibold text-[14.5px] xs:text-[15.5px] sm:text-[16.5px] tracking-wide whitespace-nowrap">
                100% Pure • Raw • Unprocessed
              </span>
            </div>

            {/* Main Headline (Dynamic 3-line breakdown per active slide with larger responsive serif font) */}
            <h1 className="font-serif text-[38px] xs:text-[44px] sm:text-[52px] md:text-[58px] font-medium sm:font-semibold leading-[1.08] sm:leading-[1.06] text-[#1F1F1F] tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] transition-all duration-500 text-left">
              {currentSlide === 0 ? (
                <>
                  <span className="text-[#D97706]">Honey</span> with
                  <br />
                  nothing to
                  <br />
                  hide
                </>
              ) : currentSlide === 1 ? (
                <>
                  <span className="text-[#D97706]">Pure</span> by
                  <br />
                  nature. <span className="text-[#593102]">Honest</span>
                  <br />
                  by choice.
                </>
              ) : currentSlide === 2 ? (
                <>
                  <span className="text-[#D97706]">Clean</span> blossom
                  <br />
                  drop. Sweetness
                  <br />
                  redefined.
                </>
              ) : currentSlide === 3 ? (
                <>
                  <span className="text-[#D97706]">Fruity</span> orchard
                  <br />
                  nectar. Purely
                  <br />
                  authentic.
                </>
              ) : currentSlide === 4 ? (
                <>
                  <span className="text-[#D97706]">Wild</span> forest
                  <br />
                  nectar. Rich &
                  <br />
                  unprocessed.
                </>
              ) : (
                <>
                  <span className="text-[#D97706]">Raw</span> mountain
                  <br />
                  honey. Straight
                  <br />
                  from hives.
                </>
              )}
            </h1>

            {/* Subtitle (Larger responsive font size for mobile & tablet) */}
            <p className="font-serif italic text-[17px] xs:text-[19px] sm:text-[22px] md:text-[24px] text-[#4A3B30] font-medium leading-relaxed mt-3.5 sm:mt-5 max-w-[360px] xs:max-w-[420px] sm:max-w-[540px] text-left drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-500">
              {slides[currentSlide].mobileSubtitle}
            </p>
          </div>

          {/* 3. Bottle Showcase (NOT clipped by overflow-hidden, so bottle extends 3D outside bottom edge!) */}
          <div className="relative z-20 w-full flex justify-center items-end mt-2 pt-2 pb-0 h-[310px] xs:h-[350px] sm:h-[430px] md:h-[470px]">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={`mobile-jar-${slide.id}`}
                  className={`absolute bottom-0 flex justify-center items-end w-full h-full transition-opacity duration-500 ease-in-out ${isActive ? "opacity-100 z-20 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                    }`}
                >
                  <Image
                    src={slide.bottleImg}
                    alt={slide.alt}
                    width={800}
                    height={800}
                    priority
                    className="w-auto h-[300px] xs:h-[340px] sm:h-[410px] max-w-[99%] object-contain drop-shadow-[0_26px_34px_rgba(0,0,0,0.35)] scale-110 sm:scale-120 translate-y-8 xs:translate-y-9 sm:translate-y-12 transition-transform duration-300"
                  />
                </div>
              );
            })}
          </div>

        </div>

        {/* Action Buttons Stack (Shifted lower with generous clean spacing from bottle image) */}
        <div className="w-full mt-10 xs:mt-12 sm:mt-14 px-1 flex flex-col items-center gap-3 max-w-[400px] mx-auto relative z-30">

          {/* Shop Honey Button (Full Width with larger font) */}
          <Link
            href={slides[currentSlide].link}
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-[17.5px] sm:text-[18.5px] py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer tracking-wide"
          >
            <Gift size={22} className="text-white" />
            <span>Shop honey</span>
          </Link>

          {/* How We Ensure Purity Button (Centered fit-content matching reference image 1) */}
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2.5 bg-[#FDF8F3] hover:bg-[#F5EAD9] text-[#4A2E19] border border-[#5C3D24]/40 font-bold text-[15px] sm:text-[16px] py-2.5 px-6 rounded-2xl transition-all active:scale-[0.98] cursor-pointer shadow-xs"
          >
            <span className="tracking-wide">How we ensure purity</span>
            <div className="w-5.5 h-5.5 rounded-full border border-[#4A2E19] flex items-center justify-center shrink-0">
              <ArrowUpRight size={13} className="text-[#4A2E19] stroke-[2.5]" />
            </div>
          </Link>
        </div>

      </div>

      {/* ========================================================= */}
      {/* DESKTOP VIEW (>= lg screens)                              */}
      {/* Clean original layout preserved                            */}
      {/* ========================================================= */}
      <div className="hidden lg:block relative w-full min-h-[720px]">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={`desktop-slide-${slide.id}`}
              className={`absolute inset-0 w-full h-full flex items-center py-8 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              {/* Desktop Background */}
              <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
                style={{ backgroundImage: `url('${slide.desktopBg}')` }}
              />

              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent pointer-events-none z-0" />

              <div className="max-w-[1440px] mx-auto w-full px-14 relative z-10">
                <div className="grid grid-cols-12 gap-8 items-center">

                  {/* LEFT TEXT CONTENT */}
                  <div className="col-span-7 flex flex-col items-start text-left -mt-22 relative z-20">
                    {/* Top Tagline Pill */}
                    <div className="inline-flex items-center justify-center gap-2.5 bg-[#FAF3EA]/75 backdrop-blur-md border border-[#E5D3C2] px-5 py-2 rounded-full mb-4.5 shadow-xs w-full max-w-[335px] min-h-[42px]">
                      <span className="text-[17px] leading-none">🍯</span>
                      <span className="text-[#D97706] font-semibold text-[15px] tracking-wide whitespace-nowrap">
                        100% Pure • Raw • Unprocessed
                      </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-serif text-[60px] font-normal leading-[1.08] text-[#221B16] tracking-tight">
                      <span className="text-[#D97706]">{slide.accent}</span> {slide.titleSuffix}
                      <br />
                      <span>{slide.titleLine2}</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="font-serif italic text-[21px] text-[#5C4A3E] font-medium leading-relaxed mt-5 max-w-[520px]">
                      {slide.subtitle}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-8 flex-wrap">
                      <Link
                        href={slide.link}
                        className="bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-[15px] px-7 py-3.5 rounded-2xl shadow-md hover:shadow-lg inline-flex items-center gap-2.5 transition-all duration-300 active:scale-95 cursor-pointer"
                      >
                        <Gift size={18} />
                        <span>Shop honey</span>
                      </Link>

                      <Link
                        href="/about"
                        className="bg-[#F3E4D4]/50 hover:bg-[#F3E4D4]/80 text-[#4A2E19] border border-[#5C3D24]/80 font-semibold text-[15px] px-7 py-3.5 rounded-2xl backdrop-blur-md inline-flex items-center gap-2.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-xs"
                      >
                        <span className="tracking-wide">How we ensure purity</span>
                        <div className="w-5.5 h-5.5 rounded-full border border-[#4A2E19] flex items-center justify-center shrink-0">
                          <ArrowUpRight size={13} className="text-[#4A2E19] stroke-[2.5]" />
                        </div>
                      </Link>
                    </div>

                    {/* Trust Badges Pills Directly Under Buttons (Increased Height, Compact Width) */}
                    <div className="flex items-center gap-2 xl:gap-2.5 mt-5 flex-nowrap whitespace-nowrap z-30 relative py-1">
                      <div className="flex items-center gap-2 bg-[#F3E4D4] hover:bg-[#F5EAD9] backdrop-blur-md border border-[#5C3D24]/40 rounded-2xl px-3.5 py-2.5 xl:px-4 xl:py-3 shadow-xs hover:shadow-md transition-all shrink-0">
                        <Image
                          src="/Vector (13).png"
                          alt="Naturally Sourced"
                          width={18}
                          height={18}
                          className="w-4 h-4 object-contain shrink-0 brightness-[0.4] contrast-[1.4]"
                        />
                        <span className="font-sans text-[12.5px] lg:text-[13px] xl:text-[13.5px] font-bold text-[#4A2E19]">
                          Naturally Sourced
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-[#F3E4D4] hover:bg-[#F5EAD9] backdrop-blur-md border border-[#5C3D24]/40 rounded-2xl px-3.5 py-2.5 xl:px-4 xl:py-3 shadow-xs hover:shadow-md transition-all shrink-0">
                        <Image
                          src="/majesticons_leaf-3-angled-line.png"
                          alt="FSSAI Approved"
                          width={32}
                          height={18}
                          className="h-4.5 w-auto object-contain shrink-0 sepia hue-rotate-[15deg] brightness-[0.4] contrast-[1.4]"
                        />
                        <span className="font-sans text-[12.5px] lg:text-[13px] xl:text-[13.5px] font-bold text-[#4A2E19]">
                          FSSAI Approved
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-[#F3E4D4] hover:bg-[#F5EAD9] backdrop-blur-md border border-[#5C3D24]/40 rounded-2xl px-3.5 py-2.5 xl:px-4 xl:py-3 shadow-xs hover:shadow-md transition-all shrink-0">
                        <Image
                          src="/Ellipse 19.png"
                          alt="I.S.O Certificate"
                          width={18}
                          height={18}
                          className="w-4.5 h-4.5 object-contain shrink-0 sepia hue-rotate-[15deg] brightness-[0.4] contrast-[1.4]"
                        />
                        <span className="font-sans text-[12.5px] lg:text-[13px] xl:text-[13.5px] font-bold text-[#4A2E19]">
                          I.S.O Certificate
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-[#F3E4D4] hover:bg-[#F5EAD9] backdrop-blur-md border border-[#5C3D24]/40 rounded-2xl px-3.5 py-2.5 xl:px-4 xl:py-3 shadow-xs hover:shadow-md transition-all shrink-0">
                        <Image
                          src="/basil_flask-outline.png"
                          alt="Lab Tested"
                          width={18}
                          height={18}
                          className="w-4 h-4 object-contain shrink-0 brightness-[0.4] contrast-[1.4]"
                        />
                        <span className="font-sans text-[12.5px] lg:text-[13px] xl:text-[13.5px] font-bold text-[#4A2E19]">
                          Lab Tested
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT BOTTLE + GLASS PILLS */}
                  <div className="col-span-5 flex items-end justify-end relative h-full z-10">
                    {/* Glassmorphic Info Cards (Shifted further left and slightly lower) */}
                    <div className="flex flex-col gap-3.5 absolute -left-20 top-1 z-20">
                      <div className="bg-[#FAF0DC]/85 backdrop-blur-md border border-white/90 rounded-2xl px-4 py-3 flex items-center gap-3.5 w-[270px] min-h-[66px] shadow-[0_10px_28px_rgba(200,130,20,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-lg transition-all">
                        <Image
                          src="/boxicons_location.png"
                          alt="Regions"
                          width={34}
                          height={34}
                          className="w-8 h-8 object-contain shrink-0 brightness-[0.75] contrast-[1.3]"
                        />
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <span className="text-[14.5px] font-bold text-[#201812] leading-tight">Regions</span>
                          <span className="text-[14px] font-serif italic text-[#A2620A] font-semibold leading-snug mt-0.5 break-words">
                            {slide.regions}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#FAF0DC]/85 backdrop-blur-md border border-white/90 rounded-2xl px-4 py-3 flex items-center gap-3.5 w-[270px] min-h-[66px] shadow-[0_10px_28px_rgba(200,130,20,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-lg transition-all">
                        <Image
                          src="/boxicons_honey.png"
                          alt="Flavor Notes"
                          width={34}
                          height={34}
                          className="w-8 h-8 object-contain shrink-0 brightness-[0.75] contrast-[1.3]"
                        />
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <span className="text-[14.5px] font-bold text-[#201812] leading-tight">Flavor Notes</span>
                          <span className="text-[14px] font-serif italic text-[#A2620A] font-semibold leading-snug mt-0.5 break-words">
                            {slide.flavorNotes}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#FAF0DC]/85 backdrop-blur-md border border-white/90 rounded-2xl px-4 py-3 flex items-center gap-3.5 w-[270px] min-h-[66px] shadow-[0_10px_28px_rgba(200,130,20,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-lg transition-all">
                        <Image
                          src="/mdi_scent.png"
                          alt="Aroma"
                          width={34}
                          height={34}
                          className="w-8 h-8 object-contain shrink-0 brightness-[0.75] contrast-[1.3]"
                        />
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <span className="text-[14.5px] font-bold text-[#201812] leading-tight">Aroma</span>
                          <span className="text-[14px] font-serif italic text-[#A2620A] font-semibold leading-snug mt-0.5 break-words">
                            {slide.aroma}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Honey Bottle Display */}
                    <div className="relative flex justify-center items-end w-full max-w-[620px] h-[550px] cursor-pointer pb-0">
                      <Image
                        src={slide.bottleImg}
                        alt={slide.alt}
                        width={900}
                        height={900}
                        priority
                        className={`w-auto h-full max-h-[590px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.38)] scale-110 translate-y-14 ${slide.bottleOffset} transition-transform duration-300 ease-out`}
                      />
                    </div>
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