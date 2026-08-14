import Header from "@/components/layout/Header";
import SubscribeSection from "@/sections/subscribe";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Annual Honey Subscription | ShuddhVeda Honey",
  description: "One Year. Six Honey Experiences. Discover six premium honey varieties delivered to your doorstep throughout the year.",
};

export default function SubscribePage() {
  return (
    <>
      <Header />
      <SubscribeSection />
      <Footer />
    </>
  );
}
