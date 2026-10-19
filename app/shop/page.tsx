"use client";

import { useEffect } from "react";
import HeroSection from "@/sections/shop/honey";
import Header from "@/components/layout/Header";
import ProductSection from "@/sections/shop/productsection";
import Gift from "@/sections/shop/gift";
import Footer from "@/components/layout/Footer";

export default function ShopPage() {
  useEffect(() => {
    const scrollToProducts = () => {
      if (typeof window === "undefined") return;

      const hash = window.location.hash;
      const isTarget =
        hash === "#productsection" ||
        hash === "#products" ||
        window.location.search.includes("productsection");

      if (isTarget) {
        const target = document.getElementById("productsection");
        if (target) {
          const headerHeight = 80;
          const rect = target.getBoundingClientRect();
          // Scroll if not already positioned at the product section
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

    scrollToProducts();
    const t1 = setTimeout(scrollToProducts, 150);
    const t2 = setTimeout(scrollToProducts, 450);
    const t3 = setTimeout(scrollToProducts, 900);

    window.addEventListener("hashchange", scrollToProducts);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("hashchange", scrollToProducts);
    };
  }, []);

  return (
    <>
      <Header />
      <HeroSection />
      <div id="productsection" className="scroll-mt-24">
        <ProductSection />
      </div>
      <Gift />
      <Footer />
    </>
  );
}