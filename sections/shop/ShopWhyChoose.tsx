"use client";

import Image from "next/image";

const features = [
  {
    id: 1,
    image: "/whychoose/quality.png",
    alt: "Quality Guaranteed",
    title: "QUALITY GUARANTEED",
    description: "100% pure and authentic honey"
  },
  {
    id: 2,
    image: "/whychoose/beekeeper.png",
    alt: "Trusted Beekeeper Network",
    title: "TRUSTED BEEKEEPER NETWORK",
    description: "Directly from local beekeepers"
  },
  {
    id: 3,
    image: "/whychoose/harvest.png",
    alt: "Fresh Harvest Guarantee",
    title: "FRESH HARVEST GUARANTEE",
    description: "Harvested at the right time"
  },
  {
    id: 4,
    image: "/whychoose/center-logo.png",
    alt: "SuddhVeda",
    title: "SuddhVeda",
    description: "Pure honey, just the way nature intended"
  },
  {
    id: 5,
    image: "/whychoose/no-sugar.png",
    alt: "No Sugar Added",
    title: "NO ADDED SUGAR",
    description: "100% natural sweetness"
  },
  {
    id: 6,
    image: "/whychoose/residue-free.png",
    alt: "Residue Free",
    title: "RESIDUE-FREE & CHEMICAL-FREE",
    description: "No pesticides or chemicals"
  },
  {
    id: 7,
    image: "/whychoose/safe-delivery.png",
    alt: "Safe Delivery",
    title: "SAFE DELIVERY",
    description: "Carefully packed and delivered"
  },
];

export default function ShopWhyChoose() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8EF] py-16 md:py-24">
      {/* Left Honeycomb */}
      <Image
        src="/whychoose/honeycomb-left.png"
        alt=""
        width={170}
        height={650}
        className="absolute left-0 top-0 select-none pointer-events-none opacity-50"
      />

      {/* Right Honeycomb */}
      <Image
        src="/whychoose/honeycomb-right.png"
        alt=""
        width={170}
        height={650}
        className="absolute right-0 top-0 select-none pointer-events-none opacity-50"
      />

      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[36px] sm:text-[48px] md:text-[56px] font-semibold text-[#6B2E08]">
            Why Choose
            <span className="mx-2 md:mx-3 text-[#D89A1B]">SuddhVeda</span>
            ?
          </h2>

          <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <div className="w-12 md:w-20 h-px bg-[#E6D1B3]" />
            <Image
              src="/whychoose/divider-leaf.png"
              alt=""
              width={22}
              height={22}
              className="w-5 h-5 md:w-[22px] md:h-[22px]"
            />
            <div className="w-12 md:w-20 h-px bg-[#E6D1B3]" />
          </div>
        </div>

        {/* Hexagon Grid Layout */}
        <div className="relative mt-12 md:mt-20">
          {/* Desktop Layout - 3+1+3 Hexagonal */}
          <div className="hidden lg:block">
            <div className="flex justify-center items-center gap-6">
              {/* Top Row - 3 items */}
              {features.slice(0, 3).map((feature) => (
                <HexagonCard key={feature.id} feature={feature} />
              ))}
            </div>

            {/* Center Row - 1 item (bigger) */}
            <div className="flex justify-center mt-[-20px]">
              <CenterHexagon feature={features[3]} />
            </div>

            {/* Bottom Row - 3 items */}
            <div className="flex justify-center items-center gap-6 mt-[-20px]">
              {features.slice(4, 7).map((feature) => (
                <HexagonCard key={feature.id} feature={feature} />
              ))}
            </div>
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

// Hexagon Card Component
function HexagonCard({ feature }: { feature: typeof features[0] }) {
  return (
    <div className="relative w-[200px] h-[230px] group">
      {/* Hexagon Shape */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm clip-hexagon shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#E6D1B3] hover:border-[#D89A1B]">
        <div className="flex flex-col items-center justify-center h-full px-4 py-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#FFF8EF] flex items-center justify-center mb-3 border border-[#E6D1B3] group-hover:border-[#D89A1B] transition-colors">
            <Image
              src={feature.image}
              alt={feature.alt}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          
          {/* Title */}
          <h3 className="text-[13px] font-semibold text-[#6B2E08] text-center leading-tight">
            {feature.title}
          </h3>
          
          {/* Description */}
          <p className="text-[10px] text-[#B59A78] text-center mt-1 leading-tight">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Center Hexagon Component (Bigger)
function CenterHexagon({ feature }: { feature: typeof features[0] }) {
  return (
    <div className="relative w-[240px] h-[270px] group">
      <div className="absolute inset-0 bg-[#D89A1B]/10 backdrop-blur-sm clip-hexagon shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-[#D89A1B]">
        <div className="flex flex-col items-center justify-center h-full px-6 py-8">
          {/* Logo/Icon */}
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-md border-2 border-[#D89A1B]">
            <Image
              src={feature.image}
              alt={feature.alt}
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          
          {/* Title */}
          <h3 className="text-[18px] font-bold text-[#6B2E08] text-center">
            {feature.title}
          </h3>
          
          {/* Description */}
          <p className="text-[13px] text-[#6B2E08]/80 text-center mt-2 font-medium">
            {feature.description}
          </p>
          
          {/* Decorative Line */}
          <div className="w-12 h-0.5 bg-[#D89A1B] mt-3" />
        </div>
      </div>
    </div>
  );
}

// Mobile Card Component
function MobileCard({ feature }: { feature: typeof features[0] }) {
  const isCenter = feature.id === 4;
  
  return (
    <div className={`
      bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300
      border border-[#E6D1B3] hover:border-[#D89A1B]
      ${isCenter ? 'col-span-2 sm:col-span-1 bg-[#D89A1B]/5 border-[#D89A1B]' : ''}
    `}>
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center mb-2
          ${isCenter ? 'bg-[#D89A1B] text-white' : 'bg-[#FFF8EF] border border-[#E6D1B3]'}
        `}>
          <Image
            src={feature.image}
            alt={feature.alt}
            width={30}
            height={30}
            className="object-contain"
          />
        </div>
        
        {/* Title */}
        <h3 className={`text-[11px] sm:text-[12px] font-semibold leading-tight ${isCenter ? 'text-[#D89A1B]' : 'text-[#6B2E08]'}`}>
          {feature.title}
        </h3>
        
        {/* Description */}
        <p className="text-[9px] sm:text-[10px] text-[#B59A78] mt-1 leading-tight">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

// Add this to your global CSS file or use Tailwind CSS plugin
// For now, adding style tag for clip-path
const hexagonStyles = `
  .clip-hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
  
  @media (max-width: 1023px) {
    .clip-hexagon {
      clip-path: none;
      border-radius: 1rem;
    }
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = hexagonStyles;
  document.head.appendChild(style);
}