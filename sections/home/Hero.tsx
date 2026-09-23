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
      <div className="block lg:hidden w-full px-3 sm:px-6 pt-3 sm:pt-4 pb-5">
        {/* Mobile Slide Card Container (Compact height & responsive proportion) */}
        <div className="relative w-full rounded-b-[32px] sm:rounded-b-[40px] bg-[#FAF5EE] border border-[#EADBCE]/60 shadow-xs min-h-[500px] xs:min-h-[550px] sm:min-h-[620px] flex flex-col justify-between">
          
          {/* Card Inner Background Clipping Container */}
          <div className="absolute inset-0 w-full h-full rounded-b-[32px] sm:rounded-b-[40px] overflow-hidden">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={`mobile-bg-${slide.id}`}
                  className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out ${
                    isActive ? "opacity-100 z-0" : "opacity-0 -z-10"
                  }`}
                  style={{ backgroundImage: `url('${slide.desktopBg || slide.mobileBg}')` }}
                />
              );
            })}

            {/* Soft, Light Gradient Overlay for crisp background artwork clarity */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5EE]/50 via-transparent to-transparent pointer-events-none z-10" />
          </div>

          {/* Top Content (Pill + Headline + Subtitle with dynamic slide transition) */}
          <div className="relative z-20 px-4 pt-5 sm:pt-7 text-center flex flex-col items-center">
            
            {/* Top Tagline Pill Badge */}
            <div className="inline-flex items-center justify-center gap-2 bg-[#FAF3EA]/85 backdrop-blur-sm border border-[#E5D3C2] px-4 py-1.5 rounded-full mb-3.5 shadow-xs">
              <span className="text-[15px] leading-none">🍯</span>
              <span className="text-[#D97706] font-semibold text-[13.5px] sm:text-[14.5px] tracking-wide whitespace-nowrap">
                100% Pure • Raw • Unprocessed
              </span>
            </div>

            {/* Main Headline (Dynamic 3-line breakdown per active slide with bold serif font) */}
            <h1 className="font-serif text-[32px] xs:text-[36px] sm:text-[44px] font-normal leading-[1.12] text-[#201812] tracking-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] transition-all duration-500">
              <span>{slides[currentSlide].mobileTitleLine1}</span>
              <br />
              <span className="text-[#D97706]">
                {slides[currentSlide].mobileAccent}
              </span>
              <br />
              <span>{slides[currentSlide].mobileTitleLine2}</span>
            </h1>

            {/* Subtitle */}
            <p className="font-serif italic text-[15.5px] sm:text-[18px] text-[#4A3B30] font-medium leading-relaxed mt-3 sm:mt-4 max-w-[340px] sm:max-w-[440px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-500">
              {slides[currentSlide].mobileSubtitle}
            </p>
          </div>

          {/* Bottom Jar Showcase (Enlarged jar width & height with 3D bottom pop-out) */}
          <div className="relative z-20 w-full flex justify-center items-end mt-2 pt-2 pb-0 h-[310px] xs:h-[350px] sm:h-[420px]">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={`mobile-jar-${slide.id}`}
                  className={`absolute bottom-0 flex justify-center items-end w-full h-full transition-all duration-700 ${
                    isActive ? "opacity-100 scale-100 z-20 pointer-events-auto" : "opacity-0 scale-95 z-0 pointer-events-none"
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
              className={`absolute inset-0 w-full h-full flex items-center py-8 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
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
                  <div className="col-span-6 flex flex-col items-start text-left -mt-36">
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
                  </div>

                  {/* RIGHT BOTTLE + GLASS PILLS */}
                  <div className="col-span-6 flex items-end justify-end relative h-full">
                    {/* Glassmorphic Info Pills */}
                    <div className="flex flex-col gap-3.5 absolute left-2 top-3 z-20">
                      <div className="bg-[#EBD6BF]/60 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-3 flex items-center gap-3.5 w-[275px] min-h-[66px] shadow-[0_10px_28px_rgba(200,130,20,0.20),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-lg transition-all">
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

                      <div className="bg-[#EBD6BF]/60 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-3 flex items-center gap-3.5 w-[275px] min-h-[66px] shadow-[0_10px_28px_rgba(200,130,20,0.20),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-lg transition-all">
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

                      <div className="bg-[#EBD6BF]/60 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-3 flex items-center gap-3.5 w-[275px] min-h-[66px] shadow-[0_10px_28px_rgba(200,130,20,0.20),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:shadow-lg transition-all">
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

      {/* Seamless Bottom Trust Banner Strip (Hidden on Mobile, Visible on Desktop) */}
      <div className="hidden lg:block w-full bg-[#FCE0C3] border-t border-[#ECC69A]/80 py-3.5 px-4 z-30 relative">
        <div className="max-w-[1200px] mx-auto flex items-center justify-center sm:justify-between flex-wrap gap-y-3 gap-x-4 text-[#3C2415] text-[13.5px] sm:text-[15px] font-serif font-medium">

          {/* Item 1 */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/Vector (13).png"
              alt="Naturally Sourced"
              width={26}
              height={26}
              className="w-5.5 h-5.5 object-contain shrink-0 brightness-[0.7] contrast-[1.4]"
            />
            <span>Naturally Sourced</span>
          </div>

          <div className="hidden sm:block w-[1.5px] h-5 bg-[#A87244]/60" />

          {/* Item 2 */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/majesticons_leaf-3-angled-line.png"
              alt="FSSAI Approved"
              width={54}
              height={34}
              className="h-7 sm:h-8 w-auto object-contain shrink-0 sepia hue-rotate-[15deg] brightness-[0.5] contrast-[1.4]"
            />
            <span>FSSAI Approved</span>
          </div>

          <div className="hidden sm:block w-[1.5px] h-5 bg-[#A87244]/60" />

          {/* Item 3 */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/Ellipse 19.png"
              alt="I.S.O Certified"
              width={32}
              height={32}
              className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 object-contain shrink-0 sepia hue-rotate-[15deg] brightness-[0.5] contrast-[1.4]"
            />
            <span>I.S.O Certified</span>
          </div>

          <div className="hidden sm:block w-[1.5px] h-5 bg-[#A87244]/60" />

          {/* Item 4 */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/basil_flask-outline.png"
              alt="Lab Tested"
              width={26}
              height={26}
              className="w-5.5 h-5.5 object-contain shrink-0 brightness-[0.7] contrast-[1.4]"
            />
            <span>Lab Tested</span>
          </div>

        </div>
      </div>
    </section>
  );
}