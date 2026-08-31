"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiUser, FiBox, FiDroplet } from "react-icons/fi";
import { GiBee } from "react-icons/gi";
import { ChevronRight } from "lucide-react";

export default function ImpactSection() {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play();
      setHasStarted(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF9F3] via-[#FAF6F0] to-[#FDF9F3] py-14 sm:py-20 border-t border-b border-[#EADCC9]/60">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D49313]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* LEFT - Video Showcase */}
          <div className="lg:col-span-6 relative w-full max-w-[540px] mx-auto lg:mx-0">
            <div className="relative aspect-[4/3.8] rounded-3xl overflow-hidden border-2 border-[#D49313]/40 shadow-2xl group bg-black">
              <video
                ref={videoRef}
                src="https://res.cloudinary.com/anjp8e9i/video/upload/v1786972510/0817_1_ztof9t"
                poster="/move1.png"
                muted
                controls
                playsInline
                preload="metadata"
                onPlay={() => {
                  if (videoRef.current) videoRef.current.muted = true;
                  setHasStarted(true);
                }}
                onVolumeChange={(e) => {
                  e.currentTarget.muted = true;
                }}
                className="w-full h-full object-cover"
              />

              {/* Glowing Play button overlay when not started */}
              {!hasStarted && (
                <button
                  type="button"
                  onClick={handlePlayClick}
                  aria-label="Play video"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer border-2 border-[#FFD700]/70 z-10"
                >
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[18px] border-l-white ml-1.5" />
                </button>
              )}

              {/* Floating Quality Badge */}

            </div>
          </div>

          {/* RIGHT - Content */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.18em] text-[#593102] uppercase bg-[#FAF0DC] border border-[#D49313]/50 px-4 py-1.5 rounded-full shadow-2xs">
              WHY CHOOSE SHUDDH VEDA HONEY?
            </p>

            <h2 className="mt-4 text-[32px] sm:text-[42px] lg:text-[50px] font-serif font-bold leading-[1.12] text-[#593102] tracking-tight">
              Rooted in Tradition.
              <br />
              <span className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent font-serif italic pr-2">
                Committed to Purity.
              </span>
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-transparent my-3.5 rounded-full" />

            <p className="mt-2 text-[15px] sm:text-[17px] leading-[1.7] text-[#6E5D4F] font-medium max-w-[540px] px-2 lg:px-0">
              At Shuddh Veda Honey, we follow traditional beekeeping practices and modern purity standards to bring you honey that is{" "}
              <span className="font-extrabold text-[#593102]">raw, natural, and filtered.</span>
            </p>

            {/* 4 Stats Cards */}
            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 max-w-[540px] w-full px-1 sm:px-0">
              <div className="flex items-center gap-2 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-2xl bg-white/80 border border-[#EADCC9] shadow-xs hover:shadow-md transition-all min-w-0 overflow-hidden min-h-[62px] sm:min-h-[72px] h-full">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FAF0DC] text-[#593102] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                  <FiUser className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-[#D49313]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-[15px] xs:text-[18px] sm:text-[22px] font-black text-[#593102] leading-tight truncate sm:whitespace-normal">20,000+</h3>
                  <p className="mt-0.5 text-[9.5px] xs:text-[10.5px] sm:text-[11px] font-extrabold tracking-normal sm:tracking-wider text-[#7A6A5C] uppercase leading-tight break-words">Happy Customers</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-2xl bg-white/80 border border-[#EADCC9] shadow-xs hover:shadow-md transition-all min-w-0 overflow-hidden min-h-[62px] sm:min-h-[72px] h-full">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FAF0DC] text-[#593102] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                  <GiBee className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-[#D49313]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-[15px] xs:text-[18px] sm:text-[22px] font-black text-[#593102] leading-tight truncate sm:whitespace-normal">7M+</h3>
                  <p className="mt-0.5 text-[9.5px] xs:text-[10.5px] sm:text-[11px] font-extrabold tracking-normal sm:tracking-wider text-[#7A6A5C] uppercase leading-tight break-words">Bees Protected</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-2xl bg-white/80 border border-[#EADCC9] shadow-xs hover:shadow-md transition-all min-w-0 overflow-hidden min-h-[62px] sm:min-h-[72px] h-full">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FAF0DC] text-[#593102] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                  <FiBox className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-[#D49313]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-[15px] xs:text-[18px] sm:text-[22px] font-black text-[#593102] leading-tight truncate sm:whitespace-normal">1,250+</h3>
                  <p className="mt-0.5 text-[9.5px] xs:text-[10.5px] sm:text-[11px] font-extrabold tracking-normal sm:tracking-wider text-[#7A6A5C] uppercase leading-tight break-words">Bee Colonies</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-2xl bg-white/80 border border-[#EADCC9] shadow-xs hover:shadow-md transition-all min-w-0 overflow-hidden min-h-[62px] sm:min-h-[72px] h-full">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#FAF0DC] text-[#593102] flex items-center justify-center shrink-0 border border-[#D49313]/40">
                  <FiDroplet className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-[#D49313]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="text-[15px] xs:text-[18px] sm:text-[22px] font-black text-[#593102] leading-tight truncate sm:whitespace-normal">99.9%</h3>
                  <p className="mt-0.5 text-[9.5px] xs:text-[10.5px] sm:text-[11px] font-extrabold tracking-normal sm:tracking-wider text-[#7A6A5C] uppercase leading-tight break-words">Pure &amp; Natural</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => router.push("/about")}
              className="mt-7 bg-[#FA4B1B] hover:bg-[#E64216] text-white text-xs sm:text-sm font-black tracking-wider uppercase px-6 sm:px-7 h-[42px] rounded-2xl cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>KNOW MORE ABOUT US</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}