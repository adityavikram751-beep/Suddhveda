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
      <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-10 py-16 lg:py-20">
        {/* Decorative bee + flowers */}
        <div className="hidden lg:block absolute top-6 right-16 w-24 h-24">
          <Image
            src="/bee-flowers.png"
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
          <h2 className="mt-3 text-[30px] sm:text-[36px] md:text-[42px] font-serif text-[#2C241E] leading-tight">
            Crafted with Care, From Hive to Home
          </h2>
        </div>

        {/* Steps row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-3 mt-14 items-start">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-start text-left relative">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border border-[#F2ECE4]">
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
                <span className="hidden lg:block absolute top-[38%] -right-4 text-[#D49313] text-lg">
                  »
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Certified strip */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-16">
          <div>
            <span className="text-[#D49313] text-[13px] font-semibold tracking-[0.15em] uppercase">
              Certified Purity. Trusted Quality.
            </span>

            <div className="grid grid-cols-3 gap-x-8 gap-y-8 mt-8">
              {badges.map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-11 h-11 rounded-full border border-[#E6D2B8] flex items-center justify-center text-[#D49313]">
                    {badge.icon}
                  </div>
                  <span className="text-[12px] text-[#2C241E] font-medium">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#F2ECE4]">
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