import Image from "next/image";
import {
  BsCheckCircle,
  BsLightningCharge,
  BsBoxSeam,
} from "react-icons/bs";
import { PiArrowsClockwiseBold, PiWaveformBold } from "react-icons/pi";
import { FiX } from "react-icons/fi";

const steps = [
  {
    title: "Nectar Collection",
    desc: "Bees collect nectar from wildflowers and blooms.",
    image: "/process-nectar.png",
  },
  {
    title: "Ethical Beekeeping",
    desc: "We follow ethical practices that protect bees and their natural habitat.",
    image: "/process-beekeeping.png",
  },
  {
    title: "Gentle Extraction",
    desc: "Honey is extracted with care to preserve its natural goodness.",
    image: "/process-extraction.png",
  },
  {
    title: "Lab Tested",
    desc: "Every batch is lab tested for purity, quality and safety.",
    image: "/process-labtested.png",
  },
  {
    title: "Secure Packaging",
    desc: "Packed in eco-friendly, food-grade jars to retain freshness.",
    image: "/process-packaging.png",
  },
  {
    title: "Delivered with Love",
    desc: "From our hives to your home, with love and responsibility.",
    image: "/process-delivered.png",
  },
];

const badges = [
  { label: "100% Raw", icon: <BsCheckCircle size={18} /> },
  { label: "GMO Free", icon: <BsLightningCharge size={18} /> },
  { label: "BPA Free", icon: <BsBoxSeam size={18} /> },
  { label: "FSSAI Certified", icon: <PiArrowsClockwiseBold size={18} /> },
  { label: "Lab Tested", icon: <PiWaveformBold size={18} /> },
  { label: "No Added Sugar", icon: <FiX size={18} /> },
];

export default function BeekeepingProcess() {
  return (
    <section className="bg-[#FAF6F0] relative overflow-hidden">
      <style>{`
        @keyframes arrowMove {
          0% {
            transform: translateX(0);
            opacity: 0.4;
          }
          50% {
            transform: translateX(6px);
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 0.4;
          }
        }
        .arrow-motion {
          animation: arrowMove 1.4s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-10 py-16 lg:py-20">
        {/* Decorative bee + flowers */}
        {/* Decorative bee + flowers - BIGGER */}
{/* Decorative bee + flowers - Bada hua, lekin position stable */}
{/* Decorative bee + flowers - MEGA BADA */}
<div className="hidden lg:block absolute top-0 -right-16 w-[400px] h-[220px] pointer-events-none z-2 opacity-80">
  <Image
    src="/videoleft.png"
    alt=""
    fill
    className="object-contain"
  />
</div>
        {/* Heading */}
        <div className="text-center max-w-[700px] mx-auto">
          <span className="text-[#D49313] text-[13px] font-semibold tracking-[0.15em] uppercase">
            Our Beekeeping Process
          </span>
          <h2 className="mt-3 text-[30px] sm:text-[36px] md:text-[38px] font-serif text-[#2C241E] leading-tight">
            Crafted with Care, From Hive to Home
          </h2>
        </div>

        {/* Steps row */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-14 lg:gap-10 mt-14 items-start">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="relative w-[110px] aspect-square overflow-hidden bg-white border border-[#F2ECE4]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-semibold text-[13px] tracking-wide text-[#2C241E] uppercase">
                {step.title}
              </h3>
              <p className="mt-1 text-[12px] leading-[1.5] text-[#8D7F73]">
                {step.desc}
              </p>
              {i < steps.length - 1 && (
                <span
                  className="arrow-motion hidden lg:block absolute top-[38%] -right-4 text-[#D49313] text-lg"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  »
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Certified strip - Exactly like screenshot */}
<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-16">
  {/* Left side - Heading + Badges */}
  <div>
    <span className="text-[#D49313] text-[16px] font-semibold tracking-[0.15em] uppercase block text-center">
      Certified Purity. Trusted Quality.
    </span>

    <div className="grid grid-cols-3 gap-x-6 gap-y-8 mt-8 max-w-[400px] mx-auto lg:mx-0">
      {badges.map((badge, i) => (
        <div key={i} className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#E6D2B8] flex items-center justify-center text-[#D49313] bg-white/50 hover:bg-[#FDF6ED] transition-all duration-200 hover:border-[#D49313] hover:scale-105">
            {badge.icon}
          </div>
          <span className="text-[12px] text-[#2C241E] font-medium tracking-wide">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Right side - Honey Jar Image */}
  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#F2ECE4] shadow-sm">
    <Image
      src="/certified-quality.png"
      alt="Certified purity and trusted quality"
      fill
      className="object-cover"
    />
  </div>
</div>
      </div>
    </section>
  );
}