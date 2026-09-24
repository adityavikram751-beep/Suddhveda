
import Header from "@/components/layout/Header";
import GiftSets from "@/sections/giftsets/page";
import CuratedGift from "@/sections/giftsets/curatedgift";
// import GiftSelection from "@/sections/giftsets/giftselection";
import Movement from "@/sections/giftsets/movement";
import RealReview from "@/sections/giftsets/realreview";

import Footer from "@/components/layout/Footer";
export default function GiftsetPage() {
  return (
    <>
      <Header />
      <GiftSets />
      <CuratedGift />
      {/* <GiftSelection/> */}
      <Movement />
      <RealReview />
      <Footer />
    </>
  );
}