import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Trackorder from "@/sections/trackorder";
import Footer from "@/components/layout/Footer";

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#D49313] border-t-transparent" />
        </div>
      }>
        <Trackorder />
      </Suspense>
      <Footer />
    </>
  );
}