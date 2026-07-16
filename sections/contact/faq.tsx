"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Faq {
  question: string;
  answer: string;
}

const faqs: Faq[] = [
  {
    question: "How can I place an order?",
    answer:
      "You can easily place an order through our online boutique by selecting your favorite honey, adding it to your cart, and completing checkout securely.",
  },
  {
    question: "Can I customize a gift box?",
    answer:
      "Absolutely! Our bespoke gifting service allows you to hand-pick honey jars, packaging, and a personal note for any occasion.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to select international destinations. Shipping rates and delivery times vary by country.",
  },
  {
    question: "How should I store my honey?",
    answer:
      "Raw honey should be stored at room temperature away from direct sunlight. Avoid refrigeration to prevent crystallization.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Domestic orders typically arrive within 3–5 business days. International orders may take longer depending on location.",
  },
  {
    question: "Is your honey 100% pure?",
    answer:
      "Every drop of Shuddha Veda honey is raw, unheated, and unprocessed.",
  },
];

// FAQs ko do columns mein split karo (left: even index, right: odd index)
const leftFaqs = faqs.filter((_, i) => i % 2 === 0);
const rightFaqs = faqs.filter((_, i) => i % 2 === 1);

export default function FaqSection() {
  // null = koi bhi card default open nahi hoga
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const renderCard = (faq: Faq, index: number) => {
    const isOpen = openIndex === index;
    return (
      <div
        key={index}
        className="bg-white rounded-xl border border-[#E8E1D8] px-5 sm:px-6 py-4 sm:py-5 cursor-pointer transition-colors hover:border-[#D49313]"
        onClick={() => toggle(index)}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#2D3A1B]">
            {faq.question}
          </h3>
          <FiChevronDown
            size={18}
            className={`text-[#8D7F73] flex-shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-[13px] sm:text-[14px] text-[#8D7F73] leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#FAF6F0] pt-4 lg:pt-6 pb-14 lg:pb-20 w-full">
      <div className="max-w-[1300px] mx-auto w-full px-6 lg:px-0">
        {/* Heading */}
        <div className="text-center mb-10 lg:mb-12">
          <p className="text-[#D49313] tracking-[2px] text-[13px] font-medium uppercase">
            Faqs
          </p>
          <h2 className="font-serif text-[#2D3A1B] text-[28px] sm:text-[34px] mt-2">
            Quick Answers for You
          </h2>
          <div className="w-14 h-[2px] bg-[#D49313] mx-auto mt-3" />
        </div>

        {/* Two independent columns - masonry style, no shared row height */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            {leftFaqs.map((faq, i) => renderCard(faq, i * 2))}
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {rightFaqs.map((faq, i) => renderCard(faq, i * 2 + 1))}
          </div>
        </div>
      </div>
    </section>
  );
}