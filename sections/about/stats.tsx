"use client";

import Image from "next/image";

const stats = [
  {
    icon: "/first0.png",
    value: "20,000+",
    label: "Happy Customers",
  },
  {
    icon: "/first.png",
    value: "1,250+",
    label: "Bee Colonies",
  },
  {
    icon: "/first2.png",
    value: "7M+",
    label: "Bees Protected",
  },
  {
    icon: "/first3.png",
    value: "99.9%",
    label: "Pure & Natural Honey",
  },
];

export default function Stats() {
  return (
    <section className="bg-[#FAF6F0] py-16 px-4">
      <div className="max-w-[1300px] mx-auto">
        <div className="bg-white rounded-[22px] border border-[#F2E8DD] shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <div
                key={index}
                className="relative flex items-center gap-5 px-8 lg:px-10 py-8"
              >
                {/* Small Divider */}
                {index !== stats.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-[#E9DDCF]" />
                )}

                {/* Icon */}
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={58}
                  height={58}
                  className="w-[58px] h-[58px] object-contain flex-shrink-0"
                />

                {/* Text */}
                <div>
                  <h3 className="text-[34px] lg:text-[42px] font-serif font-medium leading-none text-[#3F2B1D]">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-[13px] lg:text-[14px] text-[#8E8277]">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}