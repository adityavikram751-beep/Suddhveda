import Image from "next/image";

const values = [
  {
    title: "Purity First",
    desc: "We never compromise on quality or authenticity.",
    icon: "/Group.png",
  },
  {
    title: "Respect for Nature",
    desc: "We work in harmony with bees and the environment.",
    icon: "/Group.png",
  },
  {
    title: "Transparency",
    desc: "We believe in honesty, clarity, and open communication.",
    icon: "/Group.png",
  },
  {
    title: "Ethical Partnership",
    desc: "We support local beekeepers and fair practices.",
    icon: "/Group.png",
  },
  {
    title: "Sustainability",
    desc: "From hive to home, we care for our planet.",
    icon: "/Group.png",
  },
  {
    title: "Wellness for All",
    desc: "Pure honey for healthier homes and happier lives.",
    icon: "/Group.png",
  },
];

const stats = [
  { value: "20,000+", label: "Happy Customers", icon: "/first.png" },
  { value: "1,250+", label: "Bee Colonies", icon: "/icons/bee.svg" },
  { value: "7M+", label: "Bees Protected", icon: "/icons/honeycomb.svg" },
  { value: "99.9%", label: "Pure & Natural Honey", icon: "/icons/drop.svg" },
];

export default function OurValues() {
  return (
    <section className="bg-[#FAF6F0] relative ">
      <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-10 py-16 lg:py-20">
        {/* Decorative honeycomb corner */}
        <div className=" lg:block absolute -top-32 right-2 w-60 h-60 opacity-50 pointer-events-none">
          <Image src="/customer.png" alt="" fill className="object-contain" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* LEFT IMAGE + QUOTE */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden min-h-[560px]">
            <Image
              src="/honeyprocess.png"
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

          {/* RIGHT VALUES */}
          <div className="flex flex-col justify-center h-full">
            <span className="text-[#D49313] text-[13px] font-semibold tracking-[0.15em] uppercase">
              Our Values
            </span>
            <h2 className="mt-3 text-[30px] sm:text-[36px] md:text-[38px] font-serif text-[#2D3A1B] leading-tight">
              What Drives Everything We Do
            </h2>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7 mt-10">
              {values.map((item, i) => (
                <div key={i} className="flex flex-col items-start gap-4">
                  {/* BILKUL SADA ICON - size yahan badlo (width/height) */}
                  <div className="flex-shrink-0">
                    <Image
                      src={item.icon}
                      alt=""
                      width={50}  // <-- yeh value badhao ya ghatao
                      height={50} // <-- yeh value badhao ya ghatao
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-[#2D3A1B]">
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

       
      </div>
    </section>
  );
}