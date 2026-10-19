import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductSection from "@/sections/shop/productsection";

export const metadata = {
  title: "Our Honey Selection | ShuddhVeda",
  description: "Discover our ethically harvested, raw and natural honey straight from natural hives.",
};

export default function ProductSectionPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[60vh] bg-[#FAF7F2] flex items-center justify-center p-8">
            <div className="h-32 w-full max-w-md rounded-3xl border-2 border-[#EADCC9] bg-white/80 animate-pulse flex items-center justify-center">
              <span className="text-xs font-bold text-[#8D7F73]">Loading Honey Selection...</span>
            </div>
          </div>
        }
      >
        <ProductSection />
      </Suspense>
      <Footer />
    </>
  );
}
