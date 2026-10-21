import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderHelpReturnExchangeSection from "@/sections/account/help/page";

export default function AccountReturnExchangePage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-[60vh] bg-[#FFF8EF] flex items-center justify-center p-8">
          <div className="h-32 w-full max-w-md rounded-3xl border-2 border-[#EADCC9] bg-white/80 animate-pulse flex items-center justify-center">
            <span className="text-xs font-bold text-[#8D7F73]">Loading Return & Exchange Portal...</span>
          </div>
        </div>
      }>
        <OrderHelpReturnExchangeSection />
      </Suspense>
      <Footer />
    </>
  );
}
