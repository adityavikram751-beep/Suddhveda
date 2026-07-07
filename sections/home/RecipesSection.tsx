"use client";

import Image from "next/image";
import { Play } from "lucide-react";

const recipes = [
  {
    id: 1,
    title: "Honey Lemon Tea",
    image: "/hero.png",
    time: "5 MIN",
  },
  {
    id: 2,
    title: "Honey Oats Bowl",
    image: "/hero.png",
    time: "5 MIN",
  },
  {
    id: 3,
    title: "Honey Toast",
    image: "/hero.png",
    time: "5 MIN",
  },
  {
    id: 4,
    title: "Honey Smoothie",
    image: "/hero.png",
    time: "5 MIN",
  },
  {
    id: 5,
    title: "Honey Pancakes",
    image: "/hero.png",
    time: "5 MIN",
  },
];

export default function RecipesSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#FFF8EF]
        pt-6 sm:pt-8
        pb-10 sm:pb-12 md:pb-16
      "
    >
      {/* ===== Left Decorative Icon ===== */}
      <Image
        src="/videoright.png"
        alt=""
        width={360}
        height={300}
        className="
          absolute left-0 top-0 z-10 object-contain
          hidden lg:block
          w-[180px] xl:w-[280px] 2xl:w-[360px]
          h-auto
        "
      />

      {/* ===== Right Decorative Icon ===== */}
      <Image
        src="/videoleft.png"
        alt=""
        width={220}
        height={150}
        className="
          absolute right-0 top-0 z-10 object-contain
          hidden lg:block
          w-[120px] xl:w-[180px] 2xl:w-[220px]
          h-auto
        "
      />

      <div className="relative max-w-[1445px] mx-auto px-4 sm:px-6 md:px-8 z-20">
        {/* Heading */}
        <div className="text-center">
          <span
            className="
              inline-flex
              items-center
              rounded-full
              bg-[#FFF1D8]
              px-4 sm:px-5
              py-1 sm:py-1.5
              text-[10px] sm:text-[11px]
              font-semibold
              uppercase
              tracking-[1.5px] sm:tracking-[2px]
              text-[#D89A1B]
            "
          >
            MADE WITH PURE HONEY
          </span>
          <h2
            className="
              mt-2 sm:mt-3
              text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px]
              font-semibold
              text-[#6B2E08]
              tracking-[-0.5px] sm:tracking-[-1px]
              leading-tight
            "
          >
            Recipes to Relish
          </h2>
          <p
            className="
              mt-1.5 sm:mt-2
              max-w-[600px]
              mx-auto
              text-[14px] sm:text-[15px] md:text-[16px]
              leading-[24px] sm:leading-[28px] md:leading-7
              text-[#A98F78]
              px-2
            "
          >
            Delicious recipes, healthy drinks and sweet treats crafted
            with pure ShudhVeda honey.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-6 sm:mt-7 md:mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* ================= Left Large Recipe Card ================= */}
          <div className="col-span-1 md:col-span-12 lg:col-span-7">
            <div
              className="
                group
                relative
                h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px]
                overflow-hidden
                rounded-[18px] sm:rounded-[20px] lg:rounded-[22px]
                cursor-pointer
                shadow-[0_16px_50px_rgba(0,0,0,0.12)]
              "
            >
              <Image
                src={recipes[0].image}
                alt={recipes[0].title}
                fill
                priority
                className="
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/80
                  via-black/15
                  to-transparent
                "
              />

              {/* Logo Ribbon (only on first card) */}
              <div
                className="
                  absolute
                  top-0
                  left-4 sm:left-5 md:left-6
                  z-30
                  flex
                  h-[60px] sm:h-[70px] md:h-[80px]
                  w-[46px] sm:w-[52px] md:w-[60px]
                  flex-col
                  items-center
                  justify-center
                  rounded-b-2xl
                  bg-white
                  shadow-xl
                "
              >
                <Image
                  src="/yellow logo.png"
                  alt=""
                  width={42}
                  height={42}
                  className="w-[28px] sm:w-[34px] md:w-[42px] h-auto"
                />
                <span
                  className="
                    mt-0.5
                    text-[6px] sm:text-[7px] md:text-[8px]
                    font-bold
                    uppercase
                    tracking-[1.5px] sm:tracking-[2px]
                    text-[#8B4A13]
                  "
                >
                  
                </span>
              </div>

              {/* Play Button (only on first card) */}
              <div
                className="
                  absolute
                  inset-0
                  z-20
                  flex
                  items-center
                  justify-center
                "
              >
                <button
                  className="
                    flex
                    h-[56px] sm:h-[64px] md:h-[72px]
                    w-[56px] sm:w-[64px] md:w-[72px]
                    items-center
                    justify-center
                    rounded-full
                    bg-white/90
                    backdrop-blur-md
                    transition-all
                    duration-300
                    group-hover:scale-110
                    shadow-lg
                  "
                >
                  <Play
                    size={20}
                    fill="#D89A1B"
                    className="ml-0.5 sm:ml-1 text-[#D89A1B] w-[18px] sm:w-[22px] md:w-[26px] h-auto"
                  />
                </button>
              </div>

              {/* Time Badge */}
              <div
                className="
                  absolute
                  right-4 sm:right-5 md:right-6
                  top-4 sm:top-5 md:top-6
                  rounded-full
                  bg-[#FFF4DD]
                  px-2.5 sm:px-3
                  py-1 sm:py-1.5
                  text-[10px] sm:text-[11px]
                  font-semibold
                  text-[#B87B16]
                  z-20
                  shadow-sm
                "
              >
                ⏱ {recipes[0].time}
              </div>

              {/* Bottom Content */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  z-20
                  p-4 sm:p-5 md:p-7
                "
              >
                <h3
                  className="
                    text-[20px] sm:text-[24px] md:text-[28px]
                    font-semibold
                    text-white
                    leading-tight
                  "
                >
                  {recipes[0].title}
                </h3>
                <p
                  className="
                    mt-1 sm:mt-1.5
                    max-w-[450px]
                    text-[12px] sm:text-[13px] md:text-[14px]
                    leading-[20px] sm:leading-[24px] md:leading-6
                    text-white/90
                    hidden sm:block
                  "
                >
                  A soothing tea with honey, lemon and a
                  touch of ginger.
                </p>
                <button
                  className="
                    mt-2 sm:mt-3
                    rounded-full
                    border
                    border-white/30
                    bg-white/10
                    px-4 sm:px-5
                    py-1.5 sm:py-2
                    text-[11px] sm:text-[12px] md:text-[13px]
                    text-white
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-white
                    hover:text-[#6B2E08]
                    shadow-lg
                  "
                >
                  Watch Recipe →
                </button>
              </div>
            </div>
          </div>

          {/* ================= Right Side (4 small cards) ================= */}
          <div className="col-span-1 md:col-span-12 lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 h-full">
              {recipes.slice(1).map((recipe) => (
                <div
                  key={recipe.id}
                  className="
                    group
                    relative
                    h-[140px] sm:h-[155px] md:h-[165px] lg:h-[175px]
                    overflow-hidden
                    rounded-[14px] sm:rounded-[16px] md:rounded-[18px]
                    cursor-pointer
                    shadow-[0_10px_30px_rgba(0,0,0,0.10)]
                  "
                >
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="
                      object-cover
                      transition-all
                      duration-700
                      group-hover:scale-110
                    "
                  />
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/80
                      via-black/15
                      to-transparent
                    "
                  />

                  {/* Time Badge */}
                  <span
                    className="
                      absolute
                      top-2 sm:top-3
                      right-2 sm:right-3
                      z-20
                      rounded-full
                      bg-[#FFF4DD]
                      px-2 sm:px-2.5
                      py-0.5 sm:py-1
                      text-[8px] sm:text-[9px] md:text-[10px]
                      font-semibold
                      text-[#B87B16]
                      shadow-sm
                    "
                  >
                    ⏱ {recipe.time}
                  </span>

                  {/* Bottom Content */}
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      z-20
                      p-2.5 sm:p-3 md:p-3.5
                    "
                  >
                    <h3
                      className="
                        text-[13px] sm:text-[14px] md:text-[16px]
                        font-semibold
                        text-white
                        leading-tight
                      "
                    >
                      {recipe.title}
                    </h3>
                    <p
                      className="
                        mt-0.5
                        text-[9px] sm:text-[10px] md:text-[11px]
                        leading-[16px] sm:leading-[18px] md:leading-5
                        text-white/85
                        line-clamp-2
                        hidden sm:block
                      "
                    >
                      A soothing tea with honey, lemon and a touch of ginger.
                    </p>
                    <button
                      className="
                        mt-1 sm:mt-1.5
                        text-[8px] sm:text-[9px] md:text-[10px]
                        font-semibold
                        uppercase
                        tracking-[1.5px] sm:tracking-[2px]
                        text-white
                        hover:text-[#F5D48A]
                        transition-colors
                      "
                    >
                      Watch Recipe →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div
        className="
          absolute
          left-1/2
          bottom-[-80px] sm:bottom-[-100px] md:bottom-[-120px]
          -translate-x-1/2
          w-[400px] sm:w-[550px] md:w-[700px]
          h-[150px] sm:h-[180px] md:h-[200px]
          rounded-full
          bg-[#FFF2D8]
          blur-[80px] sm:blur-[100px] md:blur-[120px]
          opacity-60
          pointer-events-none
        "
      />

      {/* Bottom Divider */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#E8D5BA]
          to-transparent
        "
      />
    </section>
  );
}