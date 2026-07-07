import Image from "next/image";
import {
  PiHexagonLight,
} from "react-icons/pi";

const values = [
  {
    title: "Purity First",
    desc: "We never compromise on quality or authenticity.",
  },
  {
    title: "Respect for Nature",
    desc: "We work in harmony with bees and the environment.",
  },
  {
    title: "Transparency",
    desc: "We believe in honesty, clarity, and open communication.",
  },
  {
    title: "Ethical Partnership",
    desc: "We support local beekeepers and fair practices.",
  },
  {
    title: "Sustainability",
    desc: "From hive to home, we care for our planet.",
  },
  {
    title: "Wellness for All",
    desc: "Pure honey for healthier homes and happier lives.",
  },
];

const stats = [
  { value: "20,000+", label: "Happy Customers" },
  { value: "1,250+", label: "Bee Colonies" },
  { value: "7M+", label: "Bees Protected" },
  { value: "99.9%", label: "Pure & Natural Honey" },
];

export default function OurValues() {
  return (
    <section className="bg-[#FAF6F0] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-10 py-16 lg:py-20">
        {/* Decorative honeycomb corner */}
        <div className="hidden lg:block absolute top-0 right-0 w-40 h-40 opacity-70">
          <Image
            src="/honeycomb-corner.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT IMAGE + QUOTE */}
          <div className="relative w-full rounded-2xl overflow-hidden">
            <div className="relative w-full aspect-[4/5] lg:aspect-[3/4]">
              <Image
                src="/beekeeper.png"
                alt="Beekeeper pouring honey into jars"
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
                <p className="text-white text-[15px] sm:text-[16px] leading-[1.6] italic">
                  "Our mission is simple: to protect bees, preserve nature,
                  and promote healthier lives — one jar of honey at a time."
                </p>
                <span className="mt-3 inline-block text-[#F4C15B] text-[12px] tracking-[0.15em] font-semibold uppercase">
                  — Team ShudhVeda
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT VALUES */}
          <div>
            <span className="text-[#D49313] text-[13px] font-semibold tracking-[0.15em] uppercase">
              Our Values
            </span>
            <h2 className="mt-3 text-[30px] sm:text-[36px] md:text-[42px] font-serif text-[#2C241E] leading-tight">
              What Drives Everything We Do
            </h2>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7 mt-10">
              {values.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md border border-[#E6D2B8] flex items-center justify-center text-[#D49313] flex-shrink-0 mt-0.5">
                    <PiHexagonLight size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-[#2C241E]">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-[#8D7F73] mt-1 leading-[1.5]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="mt-16 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F2ECE4] grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#F2ECE4]">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center"
            >
              <div className="w-10 h-10 rounded-md border border-[#E6D2B8] flex items-center justify-center text-[#D49313]">
                <PiHexagonLight size={20} />
              </div>
              <span className="font-serif text-[24px] sm:text-[28px] text-[#2C241E]">
                {stat.value}
              </span>
              <span className="text-[#8D7F73] text-[13px]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}