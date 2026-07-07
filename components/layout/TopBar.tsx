import Image from "next/image";

const offers = [
  "First order? Get Flat 10% OFF",
  "Up to 24% OFF All Honey + Up to 10% OFF on Prepaid",
  "Free Delivery on Orders Above ₹400",
];

function OfferItems() {
  return (
    <>
      {offers.map((offer, index) => (
        <div key={index} className="offer">
          <Image
            src="/topbaricon.png"
            alt="Offer"
            width={22}
            height={22}
            className="object-contain flex-shrink-0"
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
      </div>

      <div className="marquee-track">
        <OfferItems />
      </div>
    </div>
  );
}