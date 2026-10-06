"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Faq {
  question: string;
  answer: string;
}

const leftFaqs: Faq[] = [
  {
    question: "How can I place an order?",
    answer:
      "You can easily place an order through our online boutique by selecting your favorite honey, adding it to your cart, and completing checkout securely.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to select international destinations. Shipping rates and delivery times vary by country.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Domestic orders typically arrive within 3–5 business days. International orders may take longer depending on location.",
  },
];

const rightFaqs: Faq[] = [
  {
    question: "Can I customize a gift box?",
    answer:
      "Absolutely! Our bespoke gifting service allows you to hand-pick honey jars, packaging, and a personal note for any occasion.",
  },
  {
    question: "How should I store my honey?",
    answer:
      "Raw honey should be stored at room temperature away from direct sunlight. Avoid refrigeration to prevent crystallization.",
  },
  {
    question: "Is your pure honey?",
    answer:
      "Every drop of Shuddha Veda honey is raw, unheated, and unprocessed. We provide lab reports for every batch to guarantee its purity and natural goodness.",
  },
];

export default function SubscribeFaqSection() {
  const [openLeft, setOpenLeft] = useState<number | null>(null);
  const [openRight, setOpenRight] = useState<number | null>(null);

  const toggleLeft = (index: number) => {
    setOpenLeft((prev) => (prev === index ? null : index));
  };

  const toggleRight = (index: number) => {
    setOpenRight((prev) => (prev === index ? null : index));
  };

  const renderCard = (
    faq: Faq,
    isOpen: boolean,
    onToggle: () => void,
    keyIndex: number
  ) => {
    return (
      <div
        key={keyIndex}
        className="bg-white rounded-2xl border border-[#EADCC9]/90 px-6 py-5 cursor-pointer transition-all duration-300 hover:border-[#D49313]/60 hover:shadow-md"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-serif text-[15px] sm:text-[17px] font-bold text-[#3C2415]">
            {faq.question}
          </h3>
          <FiChevronDown
            size={18}
            className={`text-[#6E5D4F] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#D49313]" : ""
              }`}
          />
        </div>

        <div
          className={`grid transition-all duration-300 ease-in-out ${isOpen
              ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-[#EADCC9]/50"
              : "grid-rows-[0fr] opacity-0"
            }`}
        >
          <div className="overflow-hidden">
            <p className="text-[13.5px] sm:text-[14px] text-[#6E5D4F] font-medium leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#F9F0DF] pt-12 lg:pt-16 pb-16 lg:pb-24 w-full border-t border-[#EADCC9]/50">
      <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <span className="text-[13.5px] sm:text-[14.5px] font-extrabold uppercase text-[#C08218] tracking-[0.25em] block mb-2 font-sans">
            FAQS
          </span>

          <h2
            className="font-cormorant font-bold text-[#2C1D11] text-center"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: "36px",
              lineHeight: "40px",
              letterSpacing: "0px",
            }}
          >
            Quick Answers for You
          </h2>

          <div className="w-16 h-[2.5px] bg-[#C08218] mx-auto mt-3 rounded-full" />
        </div>

        {/* 2 Columns */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-5">
          <div className="flex flex-col gap-4 sm:gap-5 flex-1">
            {leftFaqs.map((faq, index) =>
              renderCard(faq, openLeft === index, () => toggleLeft(index), index)
            )}
          </div>
          <div className="flex flex-col gap-4 sm:gap-5 flex-1">
            {rightFaqs.map((faq, index) =>
              renderCard(
                faq,
                openRight === index,
                () => toggleRight(index),
                index
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
