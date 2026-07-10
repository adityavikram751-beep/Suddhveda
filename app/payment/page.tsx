import Header from "@/components/layout/Header";
import TopBar from "@/components/layout/TopBar";
import Payment from "@/sections/cart/payment";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  return (
    <>
      <TopBar />
      <Header />
      <Payment/>
      <Footer/>
    </>
  );
}
