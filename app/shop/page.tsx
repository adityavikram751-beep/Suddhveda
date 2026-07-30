import HeroSection from "@/sections/shop/honey";
import Header from "@/components/layout/Header";
import ProductSection from "@/sections/shop/productsection";
import Gift  from "@/sections/shop/gift";


import Footer from "@/components/layout/Footer";
export default function ShopPage() {
  return (
    <>
      <Header />
      <HeroSection />
        <ProductSection/>
        <Gift/>
       
        <Footer/>
    </>
  );
}