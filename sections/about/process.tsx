import Image from "next/image";


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



export default function BeekeepingProcess() {
  return (
    <section className="bg-[#FDF8F1] relative overflow-hidden">
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
          <h2 className="mt-3 text-[30px] sm:text-[36px] md:text-[38px] font-serif text-[#2D3A1B] leading-tight">
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
              <h3 className="mt-4 font-semibold text-[13px] tracking-wide text-[#2D3A1B] uppercase">
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


      </div>
    </section>
  );
}