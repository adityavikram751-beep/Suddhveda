import Image from "next/image";

const timeline = [
  {
    year: "2018",
    title: "The Beginning",
    desc: "Our journey began with a passion for bees and a desire to create something pure.",
    image: "/occession6.png",
  },
  {
    year: "2019",
    title: "The Discovery",
    desc: "We discovered the magic of raw, unprocessed honey and its incredible benefits.",
    image: "/occession1.png",
  },
  {
    year: "2020",
    title: "The Commitment",
    desc: "We built relationships with ethical beekeepers who share our values and vision.",
    image: "/occession2.png",
  },
  {
    year: "NOW & ALWAYS",
    title: "The Promise",
    desc: "Today, we deliver nature's purest honey to thousands of homes across the country.",
    image: "/occession3.png",
  },
];

export default function Timeline() {
  return (
    <section className="bg-[#FAF6F0] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-10 py-16 lg:py-20">
        {/* Decorative bee */}
        <div className="hidden lg:block absolute top-4 right-124 w-14 h-14">
          <Image
            src="/customer2.png"
            alt=""
            width={56}
            height={56}
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <div className="text-center max-w-[700px] mx-auto">
          <span className="text-[#D49313] text-[13px] font-semibold tracking-[0.15em] uppercase">
            Our Story
          </span>
          <h2 className="mt-3 text-[28px] sm:text-[34px] md:text-[34px] font-serif text-[#2D3A1B] leading-tight">
            From a Simple Idea to a Promise of Purity
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] leading-[1.7] text-[#4B5563] max-w-[620px] mx-auto">
            What started as a deep love for nature and bees has grown into a
            mission to bring you the purest, most authentic honey—straight
            from the hive to your home.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-16 mt-14">
          {timeline.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="relative w-full aspect-square  overflow-hidden bg-white border border-[#F2ECE4]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 font-serif text-[18px] sm:text-[19px] text-[#2D3A1B]">
                {item.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#8D7F73] max-w-[220px]">
                {item.desc}
              </p>
              <span className="mt-3 text-[#D49313] font-bold text-[13px] tracking-wide uppercase">
                {item.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}