import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Shipping from "@/sections/cart/shipping";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  return (
    <>
      <TopBar />
      <Header />
      <Shipping/>
      <Footer/>
    </>
  );
}
