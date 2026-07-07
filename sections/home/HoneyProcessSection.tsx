"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const processSteps = [
  {
    id: 1,
    title: "Nectar Collection",
    subtitle: "FROM FRESH FLOWERS",
    description:
      "Bees collect fresh nectar from blooming flowers.",
    image: "/process1.png",
    icon: "/iconflower.png",
  },
  {
    id: 2,
    title: "Ethical Beekeeping",
    subtitle: "HAPPY & HEALTHY BEES",
    description:
      "Healthy bees naturally transform nectar into honey.",
    image: "/process2.png",
    icon: "/steps1.png",
  },
  {
    id: 3,
    title: "Gentle Extraction",
    subtitle: "RAW & NATURAL",
    description:
      "Honey is extracted carefully while preserving purity.",
    image: "/process3.png",
    icon: "/steps2.png",
  },
  {
    id: 4,
    title: "Packing & Delivery",
    subtitle: "READY FOR YOUR HOME",
    description:
      "Packed with care and delivered fresh to your doorstep.",
    image: "/process4.png",
    icon: "/steps4.png",
  },
];

export default function HoneyProcessSection() {
  return (
    <section
      className="
        relative
        mt-10 md:mt-16 lg:mt-20
        overflow-hidden
        bg-[#FCF4E8]
        rounded-t-[40px] md:rounded-t-[60px] lg:rounded-t-[70px]
        pb-12 md:pb-16 lg:pb-24
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          pointer-events-none
        "
      >
        <div
          className="
            w-[600px] md:w-[800px] lg:w-[900px]
            h-[600px] md:h-[800px] lg:h-[900px]
            bg-[#FFF1D8]
            blur-[100px] md:blur-[130px] lg:blur-[150px]
            opacity-70
          "
        />
      </div>

      <div className="relative max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center">
          <h2
            className="
              text-[32px] sm:text-[40px] md:text-[48px] lg:text-[58px]
              font-semibold
              text-[#6B2E08]
              leading-tight
            "
          >
            From Hive To Bottle
          </h2>

          <p
            className="
              max-w-[820px]
              mx-auto
              mt-3 md:mt-4
              text-[16px] sm:text-[18px] md:text-[20px]
              leading-[28px] sm:leading-[32px] md:leading-9
              text-[#A88E77]
              px-2
            "
          >
            Follow the complete journey of ShudhVeda Honey
            from blooming flowers to your table while
            preserving nature, purity and nutrition.
          </p>
        </div>

        {/* Process Grid */}
        <div
          className="
            relative
            mt-12 md:mt-16 lg:mt-24
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-y-12 md:gap-y-16 lg:gap-y-20
            xl:gap-0
            bg-[#FCF6ED]
            shadow-[0_20px_60px_rgba(132,90,20,0.08)]
            px-4 sm:px-6 lg:px-8
            py-10 sm:py-12 lg:py-16
            rounded-2xl sm:rounded-3xl
            overflow-hidden
          "
        >
          {processSteps.map((step, index) => (
            <div
              key={step.id}
              className="
                relative
                flex
                flex-col
                items-center
                text-center
                px-2 sm:px-4 lg:px-6 xl:px-8
              "
            >
              {/* Image */}
              <div
                className="
                  relative
                  w-[140px] sm:w-[180px] md:w-[200px] lg:w-[220px]
                  h-[140px] sm:h-[180px] md:h-[200px] lg:h-[220px]
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="
                    object-contain
                    transition-all
                    duration-500
                    hover:scale-105
                  "
                />
              </div>

              {/* Arrow — only on xl screens */}
              {index !== processSteps.length - 1 && (
                <div
                  className="
                    hidden
                    xl:flex
                    absolute
                    top-[274px]
                    right-[-70px]
                    items-center
                    gap-3
                    z-10
                  "
                >
                  <div className="w-[55px] h-px bg-[#E8D4B8]" />
                  <motion.div
                    animate={{
                      x: [0, 8, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/arrow.png"
                      alt=""
                      width={18}
                      height={18}
                    />
                  </motion.div>
                  <div className="w-[55px] h-px bg-[#E8D4B8]" />
                </div>
              )}

              {/* Icon */}
              <div
                className="
                  mt-5 sm:mt-6 md:mt-7 lg:mt-8
                  w-[60px] sm:w-[68px] md:w-[74px]
                  h-[60px] sm:h-[68px] md:h-[74px]
                  rounded-full
                  border
                  border-[#D89A1B]
                  bg-[#F6E7CD]
                  flex
                  items-center
                  justify-center
                  shadow-[0_10px_30px_rgba(216,154,27,0.15)]
                  flex-shrink-0
                "
              >
                <Image
                  src={step.icon}
                  alt=""
                  width={40}
                  height={32}
                  className="w-[32px] sm:w-[40px] md:w-[50px] h-auto"
                />
              </div>

              {/* Title */}
              <h3
                className="
                  mt-3 sm:mt-3 md:mt-3 lg:mt-3
                  text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px]
                  leading-tight
                  font-semibold
                  text-[#6B2E08]
                "
              >
                {step.title}
              </h3>

              {/* Subtitle */}
              <p
                className="
                  mt-1 sm:mt-1.5 md:mt-2
                  text-[14px] sm:text-[16px] md:text-[18px]
                  uppercase
                  tracking-[1.5px] sm:tracking-[2px]
                  font-medium
                  text-[#C88A18]
                "
              >
                {step.subtitle}
              </p>

              {/* Description */}
              <p
                className="
                  mt-1 sm:mt-1.5 md:mt-1
                  max-w-[250px]
                  text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]
                  leading-[22px] sm:leading-[26px] md:leading-7
                  text-[#A98F78]
                  px-1
                "
              >
                {step.description}
              </p>
            </div>
          ))}

          {/* ================= Flying Bees ================= */}
          <div
            className="
              absolute
              inset-0
              hidden
              xl:block
              pointer-events-none
              overflow-hidden
            "
          >
            {/* Bee 1 (Flower → Step 2) */}
            <motion.div
              className="absolute left-[70px] top-[115px]"
              animate={{
                x: [0, 320, 350, 350],
                y: [0, -10, -25, -25],
                rotate: [0, 8, 12, 12],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
                times: [0, 0.25, 0.35, 1],
              }}
            >
              <Image src="/Without honey.png" alt="" width={36} height={36} />
            </motion.div>

            <motion.div
              className="absolute left-[70px] top-[145px]"
              animate={{
                x: [0, 320, 350, 350],
                y: [0, -5, -15, -15],
                rotate: [0, 8, 12, 12],
              }}
              transition={{
                duration: 8,
                delay: 1.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
                times: [0, 0.25, 0.35, 1],
              }}
            >
              <Image src="/Without honey.png" alt="" width={30} height={30} />
            </motion.div>

            {/* Bee 2 (Empty → Step 1) */}
            <motion.div
              className="absolute left-[420px] top-[95px]"
              animate={{
                x: [0, -350, -350],
                y: [0, 20, 20],
                rotate: [180, 170, 170],
              }}
              transition={{
                duration: 6,
                delay: 0.8,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
                times: [0, 0.2, 1],
              }}
            >
              <Image src="/MOVE TO VISIT.png" alt="" width={30} height={30} />
            </motion.div>

            {/* Bee 3 (Honey → Step 3) */}
            <motion.div
              className="absolute left-[420px] top-[95px]"
              animate={{
                x: [0, 360, 360],
                y: [0, 15, 15],
                rotate: [0, 8, 8],
              }}
              transition={{
                duration: 6,
                delay: 3.2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
                times: [0, 0.2, 1],
              }}
            >
              <Image src="/Main Flying bee.png" alt="" width={34} height={34} />
            </motion.div>

            <motion.div
              className="absolute left-[420px] top-[125px]"
              animate={{
                x: [0, 360, 360],
                y: [0, 5, 5],
                rotate: [0, 8, 8],
              }}
              transition={{
                duration: 8,
                delay: 5.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
                times: [0, 0.3, 1],
              }}
            >
              <Image src="/Main Flying bee.png" alt="" width={30} height={30} />
            </motion.div>

            {/* Bee 4 (Empty : Step 3 → Step 2) */}
            <motion.div
              className="absolute left-[790px] top-[115px]"
              animate={{
                x: [0, 0, 0, -360, -360],
                y: [0, -20, -20, -20, -20],
                rotate: [180, 170, 170, 170, 170],
              }}
              transition={{
                duration: 6,
                delay: 2.5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
                times: [0, 0.15, 0.45, 0.6, 1],
              }}
            >
              <Image src="/MOVE TO VISIT.png" alt="" width={30} height={30} />
            </motion.div>

            {/* Bee 5 (Honey : Step 3 → Step 4) */}
            <motion.div
              className="absolute left-[790px] top-[115px]"
              animate={{
                x: [0, 330, 360, 360],
                y: [0, -8, -18, -18],
                rotate: [0, 4, 8, 8],
              }}
              transition={{
                duration: 6,
                delay: 5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
                times: [0, 0.2, 0.35, 1],
              }}
            >
              <Image src="/bee with honey bottle.png" alt="" width={64} height={64} />
            </motion.div>

            <motion.div
              className="absolute left-[790px] top-[145px]"
              animate={{
                x: [0, 330, 360, 360],
                y: [0, -2, -8, -8],
                rotate: [0, 4, 8, 8],
              }}
              transition={{
                duration: 8,
                delay: 8.5,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut",
                times: [0, 0.25, 0.35, 1],
              }}
            >
              <Image src="/bee with honey bottle.png" alt="" width={30} height={30} />
            </motion.div>

            {/* Bee 6 (Empty : Step 4 → Step 3) */}
            <motion.div
              className="absolute left-[1150px] top-[95px]"
              animate={{
                x: [0, 0, 0, -360, -360],
                y: [0, 15, 15, 15, 15],
                rotate: [180, 170, 170, 170, 170],
              }}
              transition={{
                duration: 6,
                delay: 4.8,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
                times: [0, 0.15, 0.45, 0.6, 1],
              }}
            >
              <Image src="/MOVE TO VISIT.png" alt="" width={30} height={30} />
            </motion.div>
          </div>
          {/* ================= End Flying Bees ================= */}
        </div>
      </div>
    </section>
  );
}