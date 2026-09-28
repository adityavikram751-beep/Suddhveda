"use client";

import HeroSection from "@/sections/subscribe/HeroSection";
import HoneyJourneySection from "@/sections/subscribe/HoneyJourneySection";
import SubscriptionPlansSection from "@/sections/subscribe/SubscriptionPlansSection";
import ThreeDeliveriesSection from "@/sections/subscribe/ThreeDeliveriesSection";
import WhatsInsideSection from "@/sections/subscribe/WhatsInsideSection";
import HowItWorksSection from "@/sections/subscribe/HowItWorksSection";
import SubscribeFaqSection from "@/sections/subscribe/SubscribeFaqSection";

export default function SubscribeSection() {
    const scrollToPlans = () => {
        document.getElementById("subscription-plans")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-[#F9F0DF] min-h-screen text-[#2F241C] font-sans">
            <HeroSection onScrollToPlans={scrollToPlans} />
            <HoneyJourneySection />
            <SubscriptionPlansSection />
            <ThreeDeliveriesSection />
            <WhatsInsideSection />
            <HowItWorksSection />
            <SubscribeFaqSection />
        </div>
    );
}
