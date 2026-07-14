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
      <Image
        src="/contact.png"
        alt=""
        width={200}
        height={130}
        className="absolute left-0 top-0 pointer-events-none select-none"
      />
      <Image
        src="/videoleft.png"
        alt=""
        width={160}
        height={140}
        className="absolute right-0 top-0 pointer-events-none select-none opacity-90 hidden lg:block"
      />

      <div className="max-w-[1250px] mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold tracking-[0.15em] text-[#D89A1B]">
            MAKE IT PERSONAL
          </p>
          <h2 className="flex items-center justify-center gap-3 text-[32px] md:text-[38px] font-serif text-[#2E1E16] mt-2">
            <span>Build Your Own Gift Box</span>
            <Image src="/customer2.png" alt="" width={26} height={26} />
            <Image src="/customer2.png" alt="" width={26} height={26} />
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr_300px] gap-10 items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <StepHeading number={1} title="Choose Your Box" />
              <p className="mt-1 ml-9 text-[11px] tracking-[0.05em] text-[#9A8F80]">
                SELECT THE PERFECT BOX SIZE.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {boxes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBox(box.id)}
                    className={`flex flex-col items-center rounded-xl border-2 p-2.5 transition-colors ${
                      selectedBox === box.id
                        ? "border-[#D89A1B] bg-[#FFF8EF]"
                        : "border-[#ECE2D2] hover:border-[#D8C4A3]"
                    }`}
                  >
                    <div className="relative flex w-full aspect-[4/3] items-center justify-center rounded-md bg-[#EDEDED]">
                      <div className="h-[35%] w-[55%] rounded bg-[#E6C99B]" />
                    </div>
                    <span className="mt-2.5 text-center text-[10px] font-semibold leading-tight tracking-[0.06em] text-[#2E1E16]">
                      {box.label}
                      <br />({box.capacity} JARS)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <StepHeading number={2} title="Select Honey Blends" />
              <p className="mt-1 ml-9 text-[11px] tracking-[0.05em] text-[#9A8F80]">
                CHOOSE FROM OUR {honeyBlends.length} NATURAL VARIANTS.
              </p>
              <div className="relative mt-5">
                <button
                  type="button"
                  onClick={() => setHoneyMenuOpen((o) => !o)}
                  className="w-full flex items-center justify-between rounded-xl border border-[#ECE2D2] bg-white px-4 py-3.5 text-[14px] text-[#8A7A65] focus:outline-none focus:border-[#D89A1B]"
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

            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
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

          {/* ===== MIDDLE COLUMN – IMAGE (shifted down, bigger) ===== */}
          <div className="hidden lg:flex items-center justify-center mt-16">
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

          {/* RIGHT COLUMN - Preview */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-[19px] font-serif text-[#2E1E16] mb-5">
                Preview Your Gift
              </h3>

              <div className="space-y-4">
                <div className="flex gap-2.5">
                  <div className="flex flex-col items-center pt-[3px]">
                    <span className="h-2 w-2 rounded-full bg-[#1F2B1B]" />
                    <ChevronDown size={11} className="mt-1 text-[#9A8F80]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-[#D89A1B]">
                      BOX SIZE
                    </p>
                    <p className="mt-1 text-[13px] text-[#2E1E16]">
                      {boxData.label.charAt(0) + boxData.label.slice(1).toLowerCase()}{" "}
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
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-[#D89A1B]">
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
                          <p key={h.id} className="text-[13px] text-[#2E1E16]">
                            {h.label}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold tracking-[0.08em] text-[#D89A1B]">
                    GREETING CARD
                  </p>
                  <p className="mt-1 text-[13px] text-[#2E1E16]">
                    {cardData ? cardData.label : "None"}
                  </p>
                </div>
              </div>

              <div className="h-px bg-[#F0E4D3] my-4" />

              <div className="flex items-center justify-between">
                <span className="text-[18px] font-serif text-[#2E1E16]">
                  Total Price
                </span>
                <span className="text-[20px] font-semibold text-[#2E1E16]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button className="w-full mt-5 bg-[#D89A1B] hover:bg-[#C98715] text-white text-[13px] font-semibold tracking-[0.08em] py-3.5 rounded-xl transition-colors">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-24">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/image2.png"
              alt="Packing a gift with a ribbon"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-[280px] bg-white/90 backdrop-blur-sm rounded-lg px-5 py-4">
              <p className="text-[15px] font-serif italic text-[#2E1E16] leading-snug">
                &ldquo;Every box is a work of art, packed with intention.&rdquo;
              </p>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-semibold tracking-[0.15em] text-[#D89A1B]">
              PREMIUM BY NATURE
            </p>
            <h2 className="text-[32px] md:text-[38px] font-serif text-[#2E1E16] mt-2 leading-tight">
              Every Gift is Packed with Love
            </h2>
            <p className="text-[15px] text-[#6F665F] leading-relaxed mt-4 max-w-[480px]">
              We believe the experience starts from the moment the box is
              held. Our packaging is designed to evoke wonder and warmth.
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-8">
              <Feature
                icon={<Leaf size={18} />}
                title="Sustainable Materials"
                desc="Eco-friendly boxes and fillers."
              />
              <Feature
                icon={<Award size={18} />}
                title="Hand-Tied Ribbons"
                desc="Premium satin finish."
              />
              <Feature
                icon={<PenLine size={18} />}
                title="Personalized Notes"
                desc="Handwritten for that extra touch."
              />
              <Feature
                icon={<ShieldCheck size={18} />}
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
      <h3 className="text-[18px] font-serif text-[#2E1E16]">{title}</h3>
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
        <p className="text-[14px] font-semibold text-[#2E1E16] leading-tight">
          {title}
        </p>
        <p className="text-[13px] text-[#6F665F] leading-snug mt-0.5">
          {desc}
        </p>
      </div>
    </div>
  );
}