import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Hero from "@/sections/home/Hero";
import FeaturesBar from "@/sections/home/FeaturesBar";
import UpcomingProduct from "@/sections/home/UpcomingProduct";
import HoneySelection from "@/sections/home/HoneySelection";
import ImpactSection from "@/sections/home/ImpactSection";
import GiftSetSection from "@/sections/home/GiftSetSection";
import HoneyProcessSection from "@/sections/home/HoneyProcessSection";
import RecipesSection from "@/sections/home/RecipesSection";
import HappyCustomersSection from "@/sections/home/HappyCustomersSection";
import TouchSection from "@/sections/home/TouchSection"
import Footer from "@/components/layout/Footer";


export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <Hero />
      <FeaturesBar />
      <UpcomingProduct/>
      <HoneySelection />
      <ImpactSection />
      <GiftSetSection />
      <HoneyProcessSection />
      <RecipesSection />
      <HappyCustomersSection />
      <TouchSection />
      <Footer/>
    </>
  );
}