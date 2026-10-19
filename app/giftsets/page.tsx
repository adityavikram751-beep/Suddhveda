"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import GiftSets from "@/sections/giftsets/page";
import CuratedGift from "@/sections/giftsets/curatedgift";
import Movement from "@/sections/giftsets/movement";
import RealReview from "@/sections/giftsets/realreview";
import Footer from "@/components/layout/Footer";

export default function GiftsetPage() {
  useEffect(() => {
    const scrollToCurated = () => {
      if (typeof window === "undefined") return;

      const hash = window.location.hash;
      const isTarget =
        hash === "#curatedgift" ||
        hash === "#curatedgiftwale" ||
        hash === "#curated-gift-boxes" ||
        window.location.search.includes("curatedgift");

      if (isTarget) {
        const target =
          document.getElementById("curatedgift") ||
          document.getElementById("curated-gift-boxes");
        if (target) {
          const headerHeight = 80;
          const rect = target.getBoundingClientRect();
          if (Math.abs(rect.top - headerHeight) > 40) {
            const targetY = rect.top + window.pageYOffset - headerHeight;
            window.scrollTo({
              top: targetY,
              behavior: "smooth",
            });
          }
        }
      }
    };

    scrollToCurated();
    const t1 = setTimeout(scrollToCurated, 150);
    const t2 = setTimeout(scrollToCurated, 450);
    const t3 = setTimeout(scrollToCurated, 900);

    window.addEventListener("hashchange", scrollToCurated);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("hashchange", scrollToCurated);
    };
  }, []);

  return (
    <>
      <Header />
      <GiftSets />
      <div id="curatedgift" className="scroll-mt-24">
        <CuratedGift />
      </div>
      <Movement />
      <RealReview />
      <Footer />
    </>
  );
}