"use client";

import HeroSection from "@/sections/subscribe/HeroSection";
import HoneyJourneySection from "@/sections/subscribe/HoneyJourneySection";
import SubscriptionPlansSection from "@/sections/subscribe/SubscriptionPlansSection";
import WhatsInsideSection from "@/sections/subscribe/WhatsInsideSection";
import HowItWorksSection from "@/sections/subscribe/HowItWorksSection";

export default function SubscribeSection() {
    const scrollToPlans = () => {
        document.getElementById("subscription-plans")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="bg-[#FFF9F2] min-h-screen text-[#2F241C] font-sans">
            <HeroSection onScrollToPlans={scrollToPlans} />
            <HoneyJourneySection />
            <SubscriptionPlansSection />
            <WhatsInsideSection />
            <HowItWorksSection />
        </div>
    );
}
