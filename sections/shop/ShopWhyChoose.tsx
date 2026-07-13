"use client";

import Image from "next/image";

const features = [
  {
    id: 1,
    image: "/Polygon 1.png",
    alt: "Quality Guaranteed",
  },
  {
    id: 2,
    image: "/Polygon 2.png",
    alt: "Trusted Beekeeper Network",
  },
  {
    id: 3,
    image: "/Polygon 3.png",
    alt: "Fresh Harvest Guarantee",
  },
  {
    id: 4,
    image: "/Center.png",
    alt: "SuddhVeda",
  },
  {
    id: 5,
    image: "/Polygon 4.png",
    alt: "No Sugar Adulteration",
  },
  {
    id: 6,
    image: "/Polygon 5.png",
    alt: "Residue-Free & Chemical-Free",
  },
  {
    id: 7,
    image: "/Polygon 6.png",
    alt: "Safe Delivery Promise",
  },
];

// Hexagon sizing constants (true pointy-top hexagon tessellation math)
const HEX_H = 280; // hexagon height (point to point)
const HEX_W = Math.round(HEX_H * (Math.sqrt(3) / 2)); // hexagon width (flat side to flat side) ≈ 208
const GAP = 24; // visible gap between every hexagon, in px (increased)
const SPACING_W = HEX_W + GAP; // horizontal distance used for positioning (bigger than hex itself → creates gap)
const ROW_GAP = (HEX_H + GAP) * 0.75; // vertical distance between row tops, scaled the same way
const BORDER = 3; // gold border thickness in px

// Standard pointy-top hexagon clip path (point at top/bottom, flat left/right sides)
const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const GOLD = "#D89A1B";

export default function ShopWhyChoose() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8EF] py-10 md:py-14">
      {/* Left Honeycomb */}
      <Image
        src="/contact.png"
        alt=""
        width={270}
        height={50}
        className="absolute left--10 top-0 select-none pointer-events-none "
      />

      {/* Right Honeycomb */}
      <Image
        src="/honey.png"
        alt=""
        width={870}
        height={1050}
        className="absolute right-0 top-0 select-none pointer-events-none opacity-70"
      />

      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-semibold text-[#2D3A1B]">
            Why choose Suddhveda&nbsp;?
          </h2>

          <div className="flex items-center justify-center gap-3 md:gap-4 mt-3 md:mt-4">
            <div className="w-12 md:w-20 h-px bg-[#E6D1B3]" />
            <Image
              src="/vector 3.png"
              alt=""
              width={22}
              height={22}
              className="w-5 h-5 md:w-[22px] md:h-[22px]"
            />
            <div className="w-12 md:w-20 h-px bg-[#E6D1B3]" />
          </div>
        </div>

        {/* Hexagon Honeycomb Grid */}
        <div className="relative mt-6 md:mt-10">
          {/* Desktop Layout - True 2-3-2 Honeycomb */}
          <div
            className="hidden lg:block relative mx-auto"
            style={{
              width: SPACING_W * 4,
              height: ROW_GAP * 2 + HEX_H,
            }}
          >
            {/* Row 1 - top (2 hexagons) */}
            <HexagonCard
              feature={features[0]}
              style={{ top: 0, left: `calc(50% - ${SPACING_W}px)` }}
            />
            <HexagonCard
              feature={features[1]}
              style={{ top: 0, left: `calc(50%)` }}
            />

            {/* Row 2 - middle (3 hexagons, shifted left by half a hex) */}
            <HexagonCard
              feature={features[2]}
              style={{ top: ROW_GAP, left: `calc(50% - ${SPACING_W * 1.5}px)` }}
            />
            <CenterHexagon
              feature={features[3]}
              style={{ top: ROW_GAP, left: `calc(50% - ${SPACING_W / 2}px)` }}
            />
            <HexagonCard
              feature={features[4]}
              style={{ top: ROW_GAP, left: `calc(50% + ${SPACING_W / 2}px)` }}
            />

            {/* Row 3 - bottom (2 hexagons) */}
            <HexagonCard
              feature={features[5]}
              style={{ top: ROW_GAP * 2, left: `calc(50% - ${SPACING_W}px)` }}
            />
            <HexagonCard
              feature={features[6]}
              style={{ top: ROW_GAP * 2, left: `calc(50%)` }}
            />
          </div>

          {/* Mobile/Tablet Layout - Simple Grid */}
          <div className="lg:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              {features.map((feature) => (
                <MobileCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Hexagon Card Component (absolutely positioned) — image already contains all design/text.
// Gold outline is drawn by a slightly larger gold hexagon sitting behind an inset image hexagon.
function HexagonCard({
  feature,
  style,
}: {
  feature: (typeof features)[0];
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute group hover:z-20 transition-transform duration-300 hover:scale-[1.04]"
      style={{ width: HEX_W, height: HEX_H, ...style }}
    >
      {/* Gold border layer */}
      <div
        className="absolute inset-0 drop-shadow-lg group-hover:drop-shadow-xl transition-[filter] duration-300"
        style={{ clipPath: HEX_CLIP, backgroundColor: GOLD }}
      >
        {/* Image layer, inset by BORDER px to reveal gold outline */}
        <div
          className="absolute"
          style={{
            inset: BORDER,
            clipPath: HEX_CLIP,
          }}
        >
          <Image
            src={feature.image}
            alt={feature.alt}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

// Center Hexagon Component (Bigger, slightly forward) — image already contains bee + logo
function CenterHexagon({
  feature,
  style,
}: {
  feature: (typeof features)[0];
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute group z-10 hover:scale-[1.04] transition-transform duration-300"
      style={{ width: HEX_W, height: HEX_H, ...style }}
    >
      <div
        className="absolute inset-0 drop-shadow-xl group-hover:drop-shadow-2xl transition-[filter] duration-300"
        style={{ clipPath: HEX_CLIP, backgroundColor: GOLD }}
      >
        <div
          className="absolute"
          style={{
            inset: BORDER,
            clipPath: HEX_CLIP,
          }}
        >
          <Image
            src={feature.image}
            alt={feature.alt}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

// Mobile Card Component — image already contains all design/text
function MobileCard({ feature }: { feature: (typeof features)[0] }) {
  const isCenter = feature.id === 4;

  return (
    <div
      className={`
      relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300
      border-2 border-[#D89A1B]
      ${isCenter ? "col-span-2 sm:col-span-1" : ""}
    `}
    >
      <Image
        src={feature.image}
        alt={feature.alt}
        fill
        className="object-cover"
      />
    </div>
  );
}