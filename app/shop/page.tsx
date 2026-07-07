import HeroSection from "@/sections/shop/honey";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Feature from "@/sections/shop/feature";
import ProductSection from "@/sections/shop/productsection";
import Gift  from "@/sections/shop/gift";
import ShopWhyChoose from "@/sections/shop/ShopWhyChoose";
import Enverthing from "@/sections/shop/enverthing";
import TouchSection from "@/sections/home/TouchSection";

import Footer from "@/components/layout/Footer";
export default function ShopPage() {
  return (
    <>
    <TopBar />
      <Header />
      <HeroSection />
      <Feature />
        <ProductSection/>
        <Gift/>
        <ShopWhyChoose/>
        <Enverthing/>
        <TouchSection/>
        <Footer/>
    </>
  );
}