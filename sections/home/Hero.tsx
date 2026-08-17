"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiGift, FiPackage } from "react-icons/fi";
import { TbLeaf } from "react-icons/tb";

function FssaiBadge() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#D49313]/40 bg-white flex items-center justify-center shadow-xs p-1 sm:p-1.5 mx-auto group-hover:scale-105 group-hover:border-[#D49313] transition-all shrink-0 aspect-square overflow-hidden">
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
        <span className="text-[#593102] text-[10px] sm:text-[11px] font-black">FSSAI</span>
      )}
    </div>
  );
}

function IsoBadge() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#D49313]/40 bg-white flex items-center justify-center shadow-xs p-1 sm:p-1.5 mx-auto group-hover:scale-105 group-hover:border-[#D49313] transition-all shrink-0 aspect-square overflow-hidden">
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
        <span className="text-[#593102] text-[10px] sm:text-[11px] font-black">ISO</span>
      )}
    </div>
  );
}

function NaturalBadge() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#D49313]/40 bg-white flex items-center justify-center shadow-xs p-1 sm:p-1.5 mx-auto group-hover:scale-105 group-hover:border-[#D49313] transition-all shrink-0 aspect-square overflow-hidden">
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
        <span className="text-[#593102] text-[10px] sm:text-[11px] font-black">100%</span>
      )}
    </div>
  );
}

function LabTestedBadge() {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#D49313]/40 bg-white flex items-center justify-center shadow-xs p-1 sm:p-1.5 mx-auto group-hover:scale-105 group-hover:border-[#D49313] transition-all shrink-0 aspect-square overflow-hidden">
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
        <span className="text-[#593102] text-[10px] sm:text-[11px] font-black">LAB</span>
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="bg-[#FAF6F0] overflow-hidden lg:min-h-[720px] relative">
      <div className="max-w-[1440px] -m-2 mx-auto w-full px-4 sm:px-6 lg:pl-8 lg:pr-16 pt-6 pb-12 lg:pb-0">

        {/* Mobile & Tablet Layout (< 1024px): Center aligned text and buttons, image at bottom */}
        <div className="flex flex-col lg:hidden items-center text-center space-y-6">

          {/* VIP Royal Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-2 border-[#D49313]/60 rounded-full px-5 py-2 text-[#593102] text-[13px] font-black tracking-widest uppercase bg-gradient-to-r from-[#FAF0DC] via-[#FFE3AA] to-[#FAF0DC] shadow-md backdrop-blur-md">
            <span className="text-[#D49313] text-[15px]">👑</span>
            <span>RAW &amp; ORGANIC</span>
            <span className="text-[#D49313] font-bold">•</span>
            <span>Raw</span>
            <span className="text-[#D49313] font-bold">•</span>
            <span>Unprocessed Organic Honey</span>
          </div>

          {/* Heading */}
          <h1 className="text-[36px] sm:text-[44px] leading-[1.14] font-serif text-[#593102] tracking-tight font-bold">
            Experience Nature&apos;s Purest Honey,
            <br />
            <span className="inline-block pr-3 overflow-visible bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] bg-clip-text text-transparent font-serif italic">
              Straight From The Royal Hive
            </span>
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto rounded-full" />

          {/* Description */}
          <p className="text-[15px] sm:text-[17px] leading-[1.65] text-[#6E5D4F] max-w-[500px] px-2 font-medium">
            Ethically harvested, raw and unprocessed organic honey crafted by nature and delivered fresh from trusted beekeepers to your home.
          </p>

          {/* 4 Feature Circles - Image Inside Circle, Text Below */}
          <div className="grid grid-cols-4 gap-2 sm:gap-6 mt-4 w-full max-w-[540px]">
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <FssaiBadge />
              <span className="text-[#593102] text-[10px] sm:text-[12px] font-black leading-tight mt-2.5 uppercase tracking-tight">
                FSSAI<br />APPROVED
              </span>
            </div>

            <div className="flex flex-col items-center text-center group cursor-pointer">
              <IsoBadge />
              <span className="text-[#593102] text-[10px] sm:text-[12px] font-black leading-tight mt-2.5 uppercase tracking-tight">
                22000 : 2015
              </span>
            </div>

            <div className="flex flex-col items-center text-center group cursor-pointer">
              <NaturalBadge />
              <span className="text-[#593102] text-[10px] sm:text-[12px] font-black leading-tight mt-2.5 uppercase tracking-tight">
                PURE &amp;<br />NATURAL
              </span>
            </div>

            <div className="flex flex-col items-center text-center group cursor-pointer">
              <LabTestedBadge />
              <span className="text-[#593102] text-[10px] sm:text-[12px] font-black leading-tight mt-2.5 uppercase tracking-tight">
                LAB<br />TESTED
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3.5 w-full max-w-[420px] pt-2">
            <Link
              href="/shop"
              className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] transition-all duration-500 text-white h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-black text-[16px] shadow-lg hover:shadow-xl cursor-pointer w-full uppercase tracking-wider border border-[#FFD700]/30 active:scale-98"
            >
              <FiGift size={18} className="text-[#FFD700]" />
              Buy Now
            </Link>
            <Link
              href="/giftsets"
              className="border-2 border-[#593102] text-[#593102] hover:bg-[#593102] hover:text-white transition-all duration-300 h-[52px] rounded-xl flex items-center justify-center gap-2.5 font-black text-[15px] cursor-pointer w-full bg-white/90 shadow-xs uppercase tracking-wider"
            >
              <FiPackage size={18} />
              Explore Gift Sets
            </Link>
          </div>

          {/* Image with Floating Cards */}
          <div className="relative w-full max-w-[500px] pt-4">
            <Image
              src="/hero.png"
              alt="ShudhVeda Natural Honey Jar"
              width={1200}
              height={1200}
              priority
              className="w-full h-auto object-contain rounded-2xl"
            />

            {/* Floating Cards (Top-Left Positioned) */}
            <div className="absolute left-2 sm:left-4 top-8 flex flex-col gap-3 z-20">

              {/* Card 1 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-[#F2ECE4] w-[155px] py-2.5 px-3.5 flex items-center gap-2.5 text-left">
                <div className="text-[#B37B1B] shrink-0">
                  <TbLeaf size={22} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-[#593102] text-[14px]">No Added</span>
                  <span className="text-[#8D7F73] text-[11px]">Sugar</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-[#F2ECE4] w-[155px] py-2.5 px-3.5 flex items-center gap-2.5 text-left">
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <Image src="/pinhead_honeycomb.png" alt="Raw & Filtered" width={28} height={28} className="object-contain" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-[#593102] text-[14px]">Raw &amp;</span>
                  <span className="text-[#8D7F73] text-[11px]">Filtered</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Desktop Layout (>= 1024px): 2-Column Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-4 items-center min-h-[650px]">

          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start relative z-30 max-w-[600px]">
            {/* VIP Royal Badge */}
            <div className="inline-flex items-center gap-x-2 border-2 border-[#D49313]/50 rounded-full px-4.5 py-1.5 text-[#593102] text-[13px] font-extrabold bg-[#FAF0DC]/80 backdrop-blur-sm shadow-2xs">
              <span className="text-[#D49313] text-[15px]">👑</span>
              <span>RAW &amp; ORGANIC</span>
              <span className="text-[#D49313] font-bold">•</span>
              <span>RAW</span>
              <span className="text-[#D49313] font-bold">•</span>
              <span>UNPROCESSED ORGANIC HONEY</span>
            </div>

            {/* Main Heading */}
            <h1 className="mt-6 text-[48px] xl:text-[56px] leading-[1.12] font-serif text-[#593102] tracking-tight font-extrabold">
              Nature&apos;s Purity.
              <br />
              Delivered{" "}
              <span className="inline-block pr-4 overflow-visible bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent font-serif italic">
                Honestly.
              </span>
            </h1>

            {/* Sub-heading */}
            <p className="mt-5 text-[19px] sm:text-[20px] font-extrabold text-[#593102] tracking-tight">
              Raw Natural, Filtered Organic Honey
            </p>

            {/* Description */}
            <p className="mt-3 text-[17px] leading-[1.7] text-[#6E5D4F] max-w-[530px] font-medium">
              Experience the true goodness of pure honey, just as nature intended—ethically harvested and delivered fresh with guaranteed royal purity.
            </p>

            {/* 4 Feature Circles - Image Inside Circle, Text Below */}
            <div className="grid grid-cols-4 gap-x-6 sm:gap-x-8 mt-10 w-full max-w-[540px]">
              <div className="flex flex-col items-center text-center group cursor-pointer">
                <FssaiBadge />
                <span className="text-[#593102] text-[12px] xl:text-[13px] font-black leading-tight mt-3 uppercase tracking-tight">
                  FSSAI<br />APPROVED
                </span>
              </div>

              <div className="flex flex-col items-center text-center group cursor-pointer">
                <IsoBadge />
                <span className="text-[#593102] text-[12px] xl:text-[13px] font-black leading-tight mt-3 uppercase tracking-tight">
                  22000 : 2015
                </span>
              </div>

              <div className="flex flex-col items-center text-center group cursor-pointer">
                <NaturalBadge />
                <span className="text-[#593102] text-[12px] xl:text-[13px] font-black leading-tight mt-3 uppercase tracking-tight">
                  PURE &amp;<br />NATURAL
                </span>
              </div>

              <div className="flex flex-col items-center text-center group cursor-pointer">
                <LabTestedBadge />
                <span className="text-[#593102] text-[12px] xl:text-[13px] font-black leading-tight mt-3 uppercase tracking-tight">
                  LAB<br />TESTED
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-5 mt-10">
              <Link
                href="/shop"
                className="bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] transition-all duration-500 text-white h-[54px] px-9 rounded-2xl flex items-center justify-center gap-2.5 font-extrabold text-[15px] shadow-lg hover:shadow-xl cursor-pointer border border-[#FFD700]/30 active:scale-98"
              >
                <FiGift size={18} className="text-[#FFD700]" />
                Buy Now
              </Link>
              <Link
                href="/giftsets"
                className="border-2 border-[#5C4033] text-[#5C4033] hover:bg-[#5C4033] hover:text-white transition-all duration-300 h-[54px] px-8 rounded-2xl flex items-center justify-center gap-2.5 font-extrabold text-[15px] cursor-pointer bg-white/90 shadow-xs"
              >
                <FiPackage size={18} />
                Explore Gift Sets
              </Link>
            </div>
          </div>

          {/* RIGHT – IMAGE + FLOATING CARDS */}
          <div className="relative flex justify-end w-full">
            <div className="relative flex justify-end items-center w-full h-[650px]">
              <Image
                src="/hero.png"
                alt="ShudhVeda Natural Honey Jar"
                width={1800}
                height={1800}
                priority
                className="absolute top-12 right-14 w-[110%] max-w-none h-full object-contain object-right-top translate-x-22 scale-[1.2]"
              />

              {/* Floating Cards Container */}
              <div className="absolute right-[-30px] top-[18%] -translate-y-1/2 flex flex-col gap-3.5 z-20">

                {/* Card 1 */}


                {/* Card 2 */}


              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}