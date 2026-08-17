
import Header from "@/components/layout/Header";
import Hero from "@/sections/home/Hero";
import UpcomingProduct from "@/sections/home/UpcomingProduct";
import HoneySelection from "@/sections/home/HoneySelection";
import ImpactSection from "@/sections/home/ImpactSection";
import GiftSetSection from "@/sections/home/GiftSetSection";
import HoneyProcessSection from "@/sections/home/HoneyProcessSection";
import HappyCustomersSection from "@/sections/home/HappyCustomersSection";
import Footer from "@/components/layout/Footer";


export default function Home() {
  return (
    <>

      <Header />
      <Hero />
      <HoneySelection />
      <ImpactSection />
      <UpcomingProduct />
      <GiftSetSection />
      <HoneyProcessSection />
      <HappyCustomersSection />
      <Footer />
    </>
  );
}