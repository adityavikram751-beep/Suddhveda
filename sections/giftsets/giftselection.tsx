"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Leaf,
  Award,
  PenLine,
  ShieldCheck,
} from "lucide-react";

const boxes = [
  { id: "classic-wood", label: "CLASSIC WOOD", price: 599, image: "/build-box/classic-wood.png" },
  { id: "matte-black", label: "MATTE BLACK", price: 649, image: "/build-box/matte-black.png" },
  { id: "gold-embossed", label: "GOLD EMBOSSED", price: 749, image: "/build-box/gold-embossed.png" },
];

const honeyBlends = [
  { id: "wildflower", label: "Wildflower Pure Honey (250g)", price: 450 },
  { id: "multiflora", label: "Multiflora Honey (250g)", price: 420 },
  { id: "acacia", label: "Acacia Honey (250g)", price: 520 },
  { id: "raw-forest", label: "Raw Forest Honey (250g)", price: 480 },
];

const greetingCards = [
  { id: "birthday", label: "Happy Birthday" },
  { id: "anniversary", label: "Happy Anniversary" },
  { id: "love", label: "With Love" },
];

const wrapColors = [
  { id: "gold", hex: "#F0C77E" },
  { id: "peach", hex: "#F3C9A8" },
  { id: "blush", hex: "#F1CFC2" },
];

const GIFT_WRAP_PRICE = 150;

export default function BuildYourOwnGiftBox() {
  const [selectedBox, setSelectedBox] = useState(boxes[0].id);
  const [selectedHoney, setSelectedHoney] = useState(honeyBlends[0].id);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedWrap, setSelectedWrap] = useState(wrapColors[0].id);

  const boxData = boxes.find((b) => b.id === selectedBox)!;
  const honeyData = honeyBlends.find((h) => h.id === selectedHoney)!;
  const total = boxData.price + honeyData.price + GIFT_WRAP_PRICE;

  return (
    <section className="relative overflow-hidden bg-orange-50 py-20">
      {/* Top-left honey drip decoration */}
      <Image
        src="/contact.png"
        alt=""
        width={220}
        height={140}
        className="absolute left-0 top-0 pointer-events-none select-none"
      />

      {/* Right florals decoration (near preview card) */}
      <Image
        src="/videoleft.png"
        alt=""
        width={160}
        height={300}
        className="absolute right-22 top-[460px] pointer-events-none select-none opacity-80 hidden lg:block"
      />

      <div className="max-w-[1250px] mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold tracking-[0.15em] text-[#D89A1B]">
            CREATE SOMETHING UNIQUE
          </p>
          <h2 className="text-[32px] md:text-[38px] font-serif text-[#2E1E16] mt-2">
            Build Your Own Gift Box <span className="align-middle">  <Image
        src="/customer2.png"
        alt=""
        width={60}
        height={300}
        className="absolute right-88 top-[2px] pointer-events-none select-none opacity-80 hidden lg:block"
      /></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Step 1 - Choose Your Box */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <StepHeading number={1} title="Choose Your Box" />
              <div className="grid grid-cols-3 gap-4 mt-5">
                {boxes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBox(box.id)}
                    className={`flex flex-col items-center rounded-xl border-2 p-3 transition-colors ${
                      selectedBox === box.id
                        ? "border-[#B9791A] bg-[#FFF8EF]"
                        : "border-[#ECE2D2] hover:border-[#D8C4A3]"
                    }`}
                  >
                    <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden bg-[#F5DCC6]">
                      <Image
                        src={box.image}
                        alt={box.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="mt-3 text-[10px] font-semibold tracking-[0.08em] text-[#2E1E16]">
                      {box.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 - Select Honey Blends */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <StepHeading number={2} title="Select Honey Blends" />
              <div className="relative mt-5">
                <select
                  value={selectedHoney}
                  onChange={(e) => setSelectedHoney(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#ECE2D2] bg-white px-4 py-3.5 text-[14px] text-[#2E1E16] focus:outline-none focus:border-[#D89A1B] cursor-pointer"
                >
                  {honeyBlends.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8A7A65]"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* Step 3 & 4 side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Step 3 - Greeting Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <StepHeading number={3} title="Greeting Card" />
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

              {/* Step 4 - Gift Wrap */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <StepHeading number={4} title="Gift Wrap" />
                <div className="mt-5 flex items-center gap-3">
                  {wrapColors.map((wrap) => (
                    <button
                      key={wrap.id}
                      onClick={() => setSelectedWrap(wrap.id)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedWrap === wrap.id
                          ? "ring-2 ring-offset-2 ring-[#B9791A]"
                          : ""
                      }`}
                      style={{ backgroundColor: wrap.hex }}
                      aria-label={wrap.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Preview Your Gift */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
            <h3 className="text-[19px] font-serif text-[#2E1E16] mb-5">
              Preview Your Gift
            </h3>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/image1.png"
                alt="Gift preview"
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-5 space-y-2.5">
              <PriceRow label={boxData.label.charAt(0) + boxData.label.slice(1).toLowerCase()} value={boxData.price} />
              <PriceRow label={honeyData.label.replace(/\s*\(.*?\)/, "")} value={honeyData.price} />
              <PriceRow label="Premium Gift Wrap" value={GIFT_WRAP_PRICE} />
            </div>

            <div className="h-px bg-[#F0E4D3] my-4" />

            <div className="flex items-center justify-between">
              <span className="text-[18px] font-serif text-[#2E1E16]">
                Total Price
              </span>
              <span className="text-[20px] font-semibold text-[#D89A1B]">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button className="w-full mt-5 bg-[#5C3A0E] hover:bg-[#4A2F0B] text-white text-[13px] font-semibold tracking-[0.08em] py-3.5 rounded-xl transition-colors">
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Bottom Section - Every Gift is Packed with Love */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-24">
          {/* Left - Image with quote overlay */}
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

          {/* Right - Text content */}
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
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5C3A0E] text-white text-[12px] font-semibold shrink-0">
        {number}
      </span>
      <h3 className="text-[18px] font-serif text-[#2E1E16]">{title}</h3>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-[#6F665F]">{label}</span>
      <span className="text-[#2E1E16] font-medium">{value}</span>
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