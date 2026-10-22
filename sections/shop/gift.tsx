"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";

type Feature = {
  id: number;
  image: string;
  title: string;
  description: string;
};

type Faq = {
  id: number;
  question: string;
  answer: string;
};

const features: Feature[] = [
  {
    id: 1,
    image: "/process1.png",
    title: "From Nature To Your Home",
    description: "Sourced from the best beekeepers.",
  },
  {
    id: 2,
    image: "/craft.webp",
    title: "Crafted with Care",
    description: "Handled with care to preserve purity.",
  },
  {
    id: 3,
    image: "/hygene.webp",
    title: "Packed Hygienically",
    description: "Sealed to retain freshness and nutrients.",
  },
  {
    id: 4,
    image: "/safely.webp",
    title: "Delivered Safely",
    description: "Secure delivery to your doorstep.",
  },
];

const faqs: Faq[] = [
  {
    id: 1,
    question: "Is Shuddh Veda Honey raw & natural?",
    answer: "Yes, our honey is raw, natural, and  pure with no additives.",
  },
  {
    id: 2,
    question: "Is the honey raw or processed?",
    answer: "Our honey is completely raw and minimally filtered to retain its natural goodness.",
  },
  {
    id: 3,
    question: "Does this honey contain any added sugar?",
    answer: "No, our honey contains no added sugar or syrups whatsoever.",
  },
  {
    id: 4,
    question: "Which honey is best for immunity?",
    answer: "Our Turmeric Honey Shot and raw natural honey are both excellent for boosting immunity.",
  },
  {
    id: 5,
    question: "How should I store honey?",
    answer: "Store honey in a cool, dry place away from direct sunlight, tightly sealed.",
  },
  {
    id: 6,
    question: "Can honey be given to kids?",
    answer: "Honey is safe for children above 1 year of age; avoid giving it to infants under 12 months.",
  },
  {
    id: 7,
    question: "Why does natural honey crystalize?",
    answer: "Crystallization is a natural process for raw honey and doesn't affect its quality.",
  },
  {
    id: 8,
    question: "How long does honey last?",
    answer: "Pure honey has an almost indefinite shelf life when stored properly.",
  },
];

// FAQs split into two independent columns to prevent row-stretching
const leftFaqs = faqs.filter((_, i) => i % 2 === 0);
const rightFaqs = faqs.filter((_, i) => i % 2 === 1);

export default function GiftSetSection() {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleFaq = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderFaqCard = (faq: Faq) => {
    const isOpen = openIds.includes(faq.id);
    return (
      <div
        key={faq.id}
        onClick={() => toggleFaq(faq.id)}
        className="rounded-2xl border border-[#EADCC9] bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-[#D49313]/60 transition-all duration-300 cursor-pointer select-none"
      >
        <div className="w-full flex items-center justify-between gap-4 text-left">
          <span className="font-serif font-extrabold text-[15px] sm:text-[16px] lg:text-[17px] text-[#593102] leading-snug">
            {faq.question}
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF0DC] border border-[#D49313]/40 flex items-center justify-center shrink-0">
            <FiChevronDown
              size={18}
              className={`text-[#D49313] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && (
          <p className="mt-3.5 pt-3.5 border-t border-[#EADCC9]/70 text-[13px] sm:text-[14px] lg:text-[15px] text-[#6E5D4F] leading-[1.65] font-medium">
            {faq.answer}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF9F3] via-[#FAF6F0] to-[#FDF9F3]">
        {/* ================= FEATURES STRIP ================= */}
        <div className="border-t border-b border-[#EADCC9]/60 bg-white/80 backdrop-blur-md">
          <div className="max-w-[1480px] mx-auto w-full px-6 lg:px-16 py-5 md:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F7ECE0] border border-[#D49313]/30 shadow-2xs hover:shadow-md transition-all">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[#D49313]/40 shadow-xs">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-extrabold text-[15px] sm:text-[16px] text-[#593102] leading-tight">
                      {feature.title}
                    </span>
                    <span className="text-[#7A6A5C] text-[12px] sm:text-[13px] font-medium mt-1">
                      {feature.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= FAQ SECTION ================= */}
        <div className="py-16 md:py-24 bg-gradient-to-b from-[#FAF6F0] to-[#FDF9F3]">
          <div className="max-w-[1480px] mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-16">
            {/* Heading */}
            <div className="text-center flex flex-col items-center">
              <span className="uppercase tracking-[0.18em] text-[#593102] text-[12px] font-extrabold bg-[#FAF0DC] border border-[#D49313]/50 px-4 py-1.5 rounded-full shadow-2xs mb-3">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-serif font-extrabold text-[#593102] leading-tight">
                Got Questions? We Have Answers
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#D49313] via-[#8F590A] to-transparent my-4 rounded-full" />
            </div>

            {/* FAQ Accordion Grid: 2 Independent Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 sm:gap-5 lg:gap-6 mt-10">
              <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
                {leftFaqs.map(renderFaqCard)}
              </div>
              <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
                {rightFaqs.map(renderFaqCard)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}