import Image from "next/image";

const offers = [
  "First Order? Get Flat 10% OFF",
  "Prepaid Orders? Get FREE Delivery",
  "Up to 24% OFF on All Honey",
];

function OfferItems() {
  return (
    <>
      {offers.map((offer, index) => (
        <div key={index} className="offer">
          <Image
            src="/topbaricon.png"
            alt="Offer"
            width={20}
            height={20}
            className="object-contain flex-shrink-0 w-4 h-4 sm:w-[20px] sm:h-[20px]"
          />
          <span>{offer}</span>
        </div>
      ))}
    </>
  );
}

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="marquee-track">
        <OfferItems />
        <OfferItems />
      </div>

      <div className="marquee-track" aria-hidden="true">
        <OfferItems />
        <OfferItems />
      </div>
    </div>
  );
}