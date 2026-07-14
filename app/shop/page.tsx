import HeroSection from "@/sections/shop/honey";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import ProductSection from "@/sections/shop/productsection";
import Gift  from "@/sections/shop/gift";


import Footer from "@/components/layout/Footer";
export default function ShopPage() {
  return (
    <>
    <TopBar />
      <Header />
      <HeroSection />
        <ProductSection/>
        <Gift/>
       
        <Footer/>
    </>
  );
}