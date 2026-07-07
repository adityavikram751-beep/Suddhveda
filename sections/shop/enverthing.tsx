"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "1. Is ShudhVeda honey 100% raw and unprocessed?",
    answer:
      "Yes. Our honey is naturally harvested, minimally processed, and free from artificial additives, preservatives, or added sugar.",
  },
  {
    question: "2. Does your honey crystallize?",
    answer:
      "Yes. Pure honey naturally crystallizes over time. This is a sign of authenticity and does not affect quality.",
  },
  {
    question: "3. Which honey is best for daily use?",
    answer:
      "Multiflora Honey is a great everyday choice for regular consumption and overall wellness.",
  },
  {
    question: "4. How long does delivery take?",
    answer:
      "Orders are generally delivered within 3–7 business days depending on your location.",
  },
  {
    question: "5. How should I store honey?",
    answer:
      "Store honey in a cool, dry place away from direct sunlight. Do not refrigerate.",
  },
  {
    question: "6. Is there any added sugar or preservatives?",
    answer:
      "No. ShudhVeda honey contains no added sugar, preservatives, or artificial ingredients.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#FFF8EF] py-24">
      {/* Left Decoration */}
      <Image
        src="/process1.png"
        alt=""
        width={300}
        height={220}
        className="absolute left-0 top-0 pointer-events-none select-none"
      />

      {/* Right Bottom Honeycomb Decoration */}
      <Image
        src="/whychoose/honeycomb-right.png"
        alt=""
        width={260}
        height={260}
        className="absolute right-0 bottom-0 pointer-events-none select-none opacity-40"
      />

      <div className="max-w-[1450px] mx-auto px-8 relative z-10">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[54px] font-serif leading-tight text-[#2E1E16]">
            Everything You{" "}
            <span className="text-[#D89A1B]">Need to Know</span>
          </h2>

          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="w-20 h-px bg-[#E8D5BA]" />
            <Image
              src="/vector 3.png"
              alt=""
              width={18}
              height={18}
            />
            <div className="w-20 h-px bg-[#E8D5BA]" />
          </div>
        </div>

        {/* FAQ List */}
        <div className="mt-12 space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-[#ECD8B8] bg-white/70 backdrop-blur-sm transition-all duration-300"
              >
                {/* Question Button */}
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between px-7 py-5 text-left"
                >
                  <h3 className="text-[20px] font-serif text-[#7A3D08]">
                    {faq.question}
                  </h3>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D8C4A3] text-[#5E4A38] transition-all">
                    {isOpen ? <Minus size={17} /> : <Plus size={17} />}
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[220px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-[#ECD8B8] px-7 py-5">
                    <p className="max-w-[900px] text-[16px] leading-[27px] text-[#6F665F]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}