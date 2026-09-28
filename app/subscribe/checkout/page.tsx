import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubscriptionCheckoutForm from "@/components/subscribe/SubscriptionCheckoutForm";

export const metadata = {
  title: "Subscription Checkout | ShuddhVeda Honey",
  description: "Complete your annual honey subscription checkout",
};

export default function SubscriptionCheckoutPage() {
  return (
    <div className="bg-[#F9F0DF] min-h-screen flex flex-col justify-between">
      <Header />
      <main className="py-10 sm:py-16 px-4 sm:px-6">
        <SubscriptionCheckoutForm />
      </main>
      <Footer />
    </div>
  );
}
