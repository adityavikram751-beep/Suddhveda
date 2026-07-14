import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-center">
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start">
            {/* Heading */}
            <h1
              className="font-['Playfair_Display'] font-bold text-[#1E1B16]"
              style={{
                fontSize: "48px",
                lineHeight: "60px",
                letterSpacing: "-0.96px",
                verticalAlign: "middle",
              }}
            >
              Celebrate Every Moment
              <br />
              <span className="text-[#3E5C2C]">
                with Nature&apos;s Sweetest
                <br />
                Gift
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 text-[15px] sm:text-[16px] leading-[1.7] text-[#6B6259] max-w-[480px]">
              Whether it&apos;s a festival, a birthday, or a simple thank
              you — our honey gift sets are made to spread health, happiness
              and sweetness.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                href="/shop"
                className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[46px] px-7 rounded-lg font-semibold text-[13px] tracking-wide flex items-center justify-center"
              >
                EXPLORE GIFT SETS
              </Link>
              <Link
                href="/customize"
                className="border border-[#795900] text-[#795900] hover:bg-[#D49313] hover:text-white transition-colors h-[46px] px-7 rounded-lg font-semibold text-[13px] tracking-wide flex items-center justify-center"
              >
                CUSTOMIZE YOUR BOX
              </Link>
            </div>
          </div>

          {/* RIGHT – IMAGE CARD */}
          <div className="relative flex justify-center lg:justify-start w-full">
            <div className="relative w-full max-w-[440px]">
              {/* Photo card */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[24px] shadow-xl rotate-2">
                <Image
                  src="/hero.png"
                  alt="ShudhVeda Himalayan Forest Bloom Gift Set"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Floating badge card */}
              <div className="absolute -bottom-8 -left-6 sm:-left-10 max-w-[240px] rounded-xl bg-[#F3ECE0] px-5 py-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#3E5C2C]">
                  Limited Edition
                </p>
                <p className="mt-1 font-serif text-[17px] font-semibold leading-snug text-[#1E1B16]">
                  The Himalayan Forest Bloom Gift Set
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}