import { Suspense } from "react";
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
        <Suspense fallback={<div className="py-10 text-center font-semibold text-[#593102]">Loading checkout...</div>}>
          <SubscriptionCheckoutForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
