"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Leaf,
  Award,
  PenLine,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

const boxes = [
  { id: "small", label: "SMALL", capacity: 2, price: 349 },
  { id: "medium", label: "MEDIUM", capacity: 4, price: 499 },
  { id: "large", label: "LARGE", capacity: 6, price: 649 },
];

const honeyBlends = [
  { id: "natural", label: "Natural Honey (250g)", price: 150 },
  { id: "mustard", label: "Mustard Honey (250g)", price: 150 },
  { id: "multiflora", label: "Multiflora Honey (250g)", price: 150 },
  { id: "litchi", label: "Litchi Honey (250g)", price: 150 },
  { id: "fennel", label: "Fennel Honey (250g)", price: 150 },
  { id: "ajwain", label: "Ajwain Honey (250g)", price: 150 },
  { id: "wildflower", label: "Wildflower Honey (250g)", price: 150 },
  { id: "acacia", label: "Acacia Honey (250g)", price: 150 },
];

const greetingCards = [
  { id: "birthday", label: "Birthday" },
  { id: "thank-you", label: "Thank You" },
  { id: "festival", label: "Festival Wishes" },
  { id: "custom", label: "Custom Note" },
];

export default function BuildYourOwnGiftBox() {
  const [selectedBox, setSelectedBox] = useState(boxes[1].id);
  const [selectedHoneys, setSelectedHoneys] = useState<string[]>([
    "natural",
    "litchi",
    "fennel",
  ]);
  const [selectedCard, setSelectedCard] = useState<string>("birthday");
  const [honeyMenuOpen, setHoneyMenuOpen] = useState(false);

  const boxData = boxes.find((b) => b.id === selectedBox)!;
  const cardData = greetingCards.find((c) => c.id === selectedCard);
  const honeyTotal = honeyBlends
    .filter((h) => selectedHoneys.includes(h.id))
    .reduce((sum, h) => sum + h.price, 0);
  const total = boxData.price + honeyTotal;

  const toggleHoney = (id: string) => {
    setSelectedHoneys((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  };

  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* Decorative corner images — replace with your own assets in /public */}
      <Image
        src="/contact.png"
        alt=""
        width={150}
        height={110}
        className="absolute left-0 top-0 pointer-events-none select-none"
      />
      <Image
        src="/videoleft.png"
        alt=""
        width={220}
        height={140}
        className="absolute right-6 top-2 pointer-events-none select-none opacity-95 hidden lg:block"
      />

      <div className="max-w-[1250px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold tracking-[0.15em] text-[#2D3A1B]">
            MAKE IT PERSONAL
          </p>
          <h2 className="flex items-center justify-center gap-3 text-[32px] md:text-[38px] font-serif text-[#2D3A1B] mt-2">
            <span>Build Your Own Gift Box</span>
            <Image src="/customer2.png" alt="" width={26} height={26} />
            <Image src="/customer2.png" alt="" width={26} height={26} />
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr_300px] gap-10 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Step 1 — Choose Your Box */}
            <div className="bg-white   p-6">
              <StepHeading number={1} title="Choose Your Box" />
              <p className="mt-1 ml-9 text-[11px] tracking-[0.05em] text-[#9A8F80]">
                SELECT THE PERFECT BOX SIZE.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {boxes.map((box) => (
                  <button
                    key={box.id}
                    type="button"
                    onClick={() => setSelectedBox(box.id)}
                    className={`flex flex-col items-center rounded-xl border-2 p-2.5 transition-colors ${
                      selectedBox === box.id
                        ? "border-[#2D3A1B] bg-[#FFF8EF]"
                        : "border-[#ECE2D2] hover:border-[#D8C4A3]"
                    }`}
                  >
                    <div className="relative flex w-full aspect-[4/3] items-center justify-center rounded-md bg-[#EDEDED]">
                      <div className="h-[35%] w-[55%] rounded bg-[#E6C99B]" />
                    </div>
                    <span className="mt-2.5 text-center text-[10px] font-semibold leading-tight tracking-[0.06em] text-[#2D3A1B]">
                      {box.label}
                      <br />({box.capacity} JARS)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Select Honey Blends */}
            <div className=" -mt-10 bg-white  p-6">
              <StepHeading number={2} title="Select Honey Blends" />
              <p className="mt-1 ml-9 text-[11px] tracking-[0.05em] text-[#9A8F80]">
                CHOOSE FROM OUR {honeyBlends.length} NATURAL VARIANTS.
              </p>
              <div className="relative mt-5">
                <button
                  type="button"
                  onClick={() => setHoneyMenuOpen((o) => !o)}
                  className="w-full flex items-center justify-between rounded-xl border border-[#ECE2D2] bg-white px-4 py-3.5 text-[14px] text-[#8A7A65] focus:outline-none focus:border-[#2D3A1B]"
                >
                  Select Honeys
                  <ChevronDown
                    size={14}
                    className={`text-[#8A7A65] transition-transform ${
                      honeyMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {honeyMenuOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border border-[#ECE2D2] bg-white p-3 shadow-md max-h-[220px] overflow-y-auto">
                    {honeyBlends.map((h) => (
                      <label
                        key={h.id}
                        className="flex items-center gap-2.5 py-1.5 text-[13px] text-[#4A4038] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedHoneys.includes(h.id)}
                          onChange={() => toggleHoney(h.id)}
                          className="h-4 w-4 accent-[#B9791A]"
                        />
                        {h.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3 — Add a Greeting Card */}
            <div className=" -mt-10 bg-white  p-6">
              <StepHeading number={3} title="Add a Greeting Card" />
              <div className="mt-5 space-y-3">
                {greetingCards.map((card) => (
                  <label
                    key={card.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="greeting-card"
                      checked={selectedCard === card.id}
                      onChange={() => setSelectedCard(card.id)}
                      className="w-4 h-4 accent-[#B9791A]"
                    />
                    <span className="text-[13px] text-[#4A4038]">
                      {card.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN — IMAGE */}
          <div className="hidden lg:flex items-center justify-center mt-36">
            <div className="relative w-full max-h-[300px] aspect-square rounded-xl overflow-hidden">
              <Image
                src="/image1.png"
                alt="Gift box preview"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* RIGHT COLUMN — Preview */}
          <div>
            <div className=" mt-20 bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-[19px] font-serif text-[#2D3A1B] mb-5">
                Preview Your Gift
              </h3>

              <div className="space-y-4">
                <div className="flex gap-2.5">
                  <div className="flex flex-col items-center pt-[3px]">
                    <span className="h-2 w-2 rounded-full bg-[#1F2B1B]" />
                    <ChevronDown size={11} className="mt-1 text-[#9A8F80]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-[#2D3A1B]">
                      BOX SIZE
                    </p>
                    <p className="mt-1 text-[13px] text-[#2D3A1B]">
                      {boxData.label.charAt(0) +
                        boxData.label.slice(1).toLowerCase()}{" "}
                      ({selectedHoneys.length} Jars)
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="flex flex-col items-center pt-[3px]">
                    <span className="h-2 w-2 rounded-full border border-[#9A8F80]" />
                    <ChevronDown size={11} className="mt-1 text-[#9A8F80]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-[#2D3A1B]">
                      HONEYS
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {selectedHoneys.length === 0 && (
                        <p className="text-[13px] text-[#9A8F80]">
                          No honeys selected
                        </p>
                      )}
                      {honeyBlends
                        .filter((h) => selectedHoneys.includes(h.id))
                        .map((h) => (
                          <p key={h.id} className="text-[13px] text-[#2D3A1B]">
                            {h.label}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-[#2D3A1B]">
                    GREETING CARD
                  </p>
                  <p className="mt-1 text-[13px] text-[#2D3A1B]">
                    {cardData ? cardData.label : "None"}
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#F0E4D3] my-4" />

              <div className="flex items-center justify-between">
                <span className="text-[18px] font-serif text-[#2D3A1B]">
                  Total Price
                </span>
                <span className="text-[20px] font-semibold text-[#2D3A1B]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                className="w-full mt-5 bg-[#2D3A1B] hover:bg-[#C98715] text-white text-[13px] font-semibold tracking-[0.08em] py-3.5 rounded-xl transition-colors"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-20 items-center mt-24">

{/* Left Image */}
<div className="relative w-full max-w-[490px] h-[620px] mx-auto lg:mx-0 rounded-[28px] overflow-hidden">
  <Image
    src="/image2.png"
    alt="Gift Packaging"
    fill
    className="object-cover"
    priority
  />

  {/* Quote Card */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/5 w-[58%] bg-white rounded-[22px] shadow-xl px-7 py-6">
    <p
      className="font-serif italic text-[#A16A00] leading-[1.15]"
      style={{ fontSize: "34px" }}
    >
      “Every box is a
      <br />
      work of art,
      <br />
      packed with
      <br />
      intention.”
    </p>
  </div>
</div>

{/* Right Content */}
<div className="max-w-[600px]">

  <p className="uppercase tracking-[0.18em] text-[#A77710] text-[13px] font-semibold">
    PREMIUM BY NATURE
  </p>

  <h2
    className="font-serif text-[#14361E] mt-4 leading-[1.05]"
    style={{ fontSize: "58px" }}
  >
    Every Gift is Packed
    <br />
    with Love
  </h2>

  <p className="text-[#6C5D53] text-[20px] leading-9 mt-7 max-w-[540px]">
    We believe the experience starts from the moment the box is held.
    Our packaging is designed to evoke wonder and warmth.
  </p>

  <div className="grid grid-cols-2 gap-x-14 gap-y-10 mt-12">

    <Feature
      icon={<Leaf size={20} />}
      title="Sustainable Materials"
      desc="Eco-friendly boxes and fillers."
    />

    <Feature
      icon={<Award size={20} />}
      title="Hand-Tied Ribbons"
      desc="Premium satin finish."
    />

    <Feature
      icon={<PenLine size={20} />}
      title="Personalized Notes"
      desc="Handwritten for that extra touch."
    />

    <Feature
      icon={<ShieldCheck size={20} />}
      title="Wax-Sealed Cards"
      desc="Ensuring exclusivity."
    />

  </div>

</div>

</div>
      </div>
    </section>
  );
}

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1F2B1B] text-white text-[12px] font-semibold shrink-0">
        {number}
      </span>
      <h3 className="text-[18px] font-serif text-[#2D3A1B]">{title}</h3>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[#B9791A] mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[14px] font-semibold text-[#2D3A1B] leading-tight">
          {title}
        </p>
        <p className="text-[13px] text-[#6F665F] leading-snug mt-0.5">
          {desc}
        </p>
      </div>
    </div>
  );
}