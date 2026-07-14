
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import GiftSets from "@/sections/giftsets/page";
import GiftOccession from"@/sections/giftsets/giftoccesion";
import CuratedGift from "@/sections/giftsets/curatedgift";
import GiftSelection from "@/sections/giftsets/giftselection";
import Movement from "@/sections/giftsets/movement";
import RealReview from "@/sections/giftsets/realreview";

import Footer from "@/components/layout/Footer";
export default function GiftsetPage() {
  return (
    <>
    <TopBar />
      <Header />
      <GiftSets/>
      <GiftOccession/>
      <CuratedGift/>
      <GiftSelection/>
      <Movement/>
      <RealReview/>
        <Footer/>
    </>
  );
}