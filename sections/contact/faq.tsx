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
    question: "Is your honey raw & natural?",
    answer:
      "Every drop of Shuddha Veda honey is raw, unheated, unfiltered, and completely unprocessed.",
  },
];

// FAQs split into two columns (even/odd)
const leftFaqs = faqs.filter((_, i) => i % 2 === 0);
const rightFaqs = faqs.filter((_, i) => i % 2 === 1);

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const renderCard = (faq: Faq, index: number) => {
    const isOpen = openIndex === index;
    return (
      <div
        key={index}
        className="bg-white rounded-2xl border border-[#EADCC9] px-5 sm:px-6 py-4.5 sm:py-5 cursor-pointer transition-all duration-300 hover:border-[#D49313] hover:shadow-md"
        onClick={() => toggle(index)}
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-serif text-[15px] sm:text-[17px] font-bold text-[#593102]">
            {faq.question}
          </h3>
          <FiChevronDown
            size={18}
            className={`text-[#D49313] flex-shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-[#EADCC9]/50" : "grid-rows-[0fr] opacity-0"
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
    <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] pt-8 lg:pt-12 pb-16 lg:pb-24 w-full border-t border-[#EADCC9]/50">
      <div className="max-w-[1300px] mx-auto w-full px-6">
        {/* Heading */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FAF0DC] border border-[#D49313]/40 px-4 py-1.5 rounded-full text-[12px] font-extrabold uppercase text-[#593102] tracking-[0.18em] shadow-2xs mb-3">
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="font-serif text-[32px] sm:text-[40px] font-extrabold text-[#593102] tracking-tight">
            Quick Answers for{" "}
            <span className="bg-gradient-to-r from-[#D49313] via-[#B87D0E] to-[#593102] bg-clip-text text-transparent">
              You
            </span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#D49313] to-transparent mx-auto mt-3.5 rounded-full" />
        </div>

        {/* Two columns */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
          <div className="flex flex-col gap-4 sm:gap-5 flex-1">
            {leftFaqs.map((faq, i) => renderCard(faq, i * 2))}
          </div>
          <div className="flex flex-col gap-4 sm:gap-5 flex-1">
            {rightFaqs.map((faq, i) => renderCard(faq, i * 2 + 1))}
          </div>
        </div>
      </div>
    </section>
  );
}