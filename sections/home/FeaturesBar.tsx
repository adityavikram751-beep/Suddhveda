"use client";

import Image from "next/image";

const features = [
  {
    icon: "/Vector.png",
    title: "Ethically Sourced",
    subtitle: "Supporting local beekeepers",
  },
  {
    icon: "/hugeicons_security-check.png",
    title: "Lab Tested Purity",
    subtitle: "Lab tested for every batch",
  },
  {
    icon: "/f7_leaf-arrow-circlepath.png",
    title: "Sustainable Beekeeping",
    subtitle: "For a better tomorrow",
  },
  {
    icon: "/homeicon1.png",
    title: "Secure Packaging",
    subtitle: "Delivered with care",
  },
];

export default function FeaturesBar() {
  return (
    <section className="bg-[#303F24] border-t border-[#EEE5DA] border-b border-[#F1DEC7] border-b-[0.5px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                relative
                flex
                flex-col
                items-center
                text-center
                px-5
                sm:px-7
                lg:px-8
                py-7
                sm:py-8
                lg:py-10
                min-h-[150px]
              "
            >
              {/* Divider */}
              {index !== features.length - 1 && (
                <div
                  className="
                    hidden
                    lg:block
                    absolute
                    right-0
                    top-1/2
                    -translate-y-1/2
                    h-[72px]
                    w-[2px]
                    bg-[#E3D4BC30]
                  "
                />
              )}

              {/* Icon */}
              <div
                className="
                  w-[42px]
                  h-[42px]
                  sm:w-[50px]
                  sm:h-[50px]
                  lg:w-[54px]
                  lg:h-[54px]
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>

              {/* Text */}
              <div className="mt-4">
                <h3
                  className="
                    text-[16px]
                    lg:text-[18px]
                    font-semibold
                    leading-tight
                    text-white
                  "
                >
                  {item.title}
                </h3>
                <p
                  className="
                    mt-2
                    text-[14px]
                    lg:text-[15px]
                    text-[#C9C2B6]
                  "
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}