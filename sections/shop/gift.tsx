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
    image: "/honneycart.png",
    title: "Crafted with Care",
    description: "Handled with care to preserve purity.",
  },
  {
    id: 3,
    image: "/wishlist.png",
    title: "Packed Hygienically",
    description: "Sealed to retain freshness and nutrients.",
  },
  {
    id: 4,
    image: "/wishlist1.png",
    title: "Delivered Safely",
    description: "Secure delivery to your doorstep.",
  },
];

const faqs: Faq[] = [
  {
    id: 1,
    question: "Is Shuddh Veda Honey 100% pure?",
    answer: "Yes, our honey is 100% pure, raw, and unprocessed with no additives.",
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

export default function GiftSetSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      {/* ===== TOP THIN LINE ===== */}

      <section className="relative overflow-hidden  ">
       
       

        {/* ================= FEATURES STRIP ================= */}
        <div className="  border-t border-[#00000033] bg-white">
          <div className="max-w-[1480px] mx-auto w-full px-6 lg:px-16 py-8 md:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center gap-4">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[14px] sm:text-[15px] text-[#2D3A1B] leading-tight">
                      {feature.title}
                    </span>
                    <span className="text-[#8D7F73] text-[12px] sm:text-[13px] mt-0.5">
                      {feature.description}
                    </span>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= FAQ SECTION ================= */}
        <div className="bg-white border-t  border-[#00000033]  py-16 md:py-20">
          <div className="max-w-[1000px] mx-auto w-full px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-serif text-[#2D3A1B]">
                FAQs
              </h2>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="w-12 md:w-16 h-px bg-[#2D3A1B]" />
                <span className="text-[#2D3A1B]">✦</span>
                <div className="w-12 md:w-16 h-px bg-[#E6D2B8]" />
              </div>
            </div>

            {/* FAQ Grid */}
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2 mt-12">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-[#E6D2B8]/60 py-4">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-semibold text-[14px] sm:text-[15px] text-[#2D3A1B]">
                      {faq.question}
                    </span>
                    <FiChevronDown
                      size={18}
                      className={`text-[#D49313] flex-shrink-0 transition-transform duration-300 ${
                        expandedId === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedId === faq.id && (
                    <p className="mt-3 text-[13px] sm:text-[14px] text-[#8D7F73] leading-[1.6]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}