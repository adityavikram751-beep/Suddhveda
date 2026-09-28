"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { API_BASE_URL, getStoredSession } from "@/lib/auth";

function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
    if (match) return decodeURIComponent(match[2]);
    const match2 = document.cookie.match(/(^| )token=([^;]+)/);
    if (match2) return decodeURIComponent(match2[2]);
    if (typeof window !== "undefined") {
        return localStorage.getItem("token") || localStorage.getItem("sudhveda_token") || null;
    }
    return null;
}

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
            return resolve(true);
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

interface PlanItem {
    id: string;
    name: string;
    detail: string;
    price: number;
    mrp: number;
}

interface SubscriptionCheckoutFormProps {
    planId?: string;
    onClose?: () => void;
}

export default function SubscriptionCheckoutForm({ planId, onClose }: SubscriptionCheckoutFormProps = {}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planIdParam = searchParams.get("planId");
    const targetPlanId = planId || planIdParam;

    const [selectedPlan, setSelectedPlan] = useState<PlanItem>({
        id: "default-annual-plan",
        name: "A Year of Honey Subscription",
        detail: "500g × 6 Jars",
        price: 2099,
        mrp: 2394,
    });

    const [submittingCheckout, setSubmittingCheckout] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);

    const [checkoutForm, setCheckoutForm] = useState({
        name: "",
        mobile: "",
        email: "",
        shipping_full_name: "",
        shipping_phone: "",
        shipping_address_line1: "",
        shipping_address_line2: "",
        shipping_city: "",
        shipping_state: "",
        shipping_pincode: "",
        shipping_country: "India",
        billing_full_name: "",
        billing_phone: "",
        billing_address_line1: "",
        billing_address_line2: "",
        billing_city: "",
        billing_state: "",
        billing_pincode: "",
        billing_country: "India",
    });

    useEffect(() => {
        // Always reset form fields to empty state so no fields are auto-filled
        setCheckoutForm({
            name: "",
            mobile: "",
            email: "",
            shipping_full_name: "",
            shipping_phone: "",
            shipping_address_line1: "",
            shipping_address_line2: "",
            shipping_city: "",
            shipping_state: "",
            shipping_pincode: "",
            shipping_country: "India",
            billing_full_name: "",
            billing_phone: "",
            billing_address_line1: "",
            billing_address_line2: "",
            billing_city: "",
            billing_state: "",
            billing_pincode: "",
            billing_country: "India",
        });

        const fetchPlanDetails = async () => {
            if (!targetPlanId) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/subscripation/plan/all-plans`);
                if (!res.ok) return;
                const data = await res.json();
                const rawList = data.data || data.plans || data || [];
                if (Array.isArray(rawList)) {
                    const found = rawList.find((p: any) => (p._id || p.id) === targetPlanId);
                    if (found) {
                        setSelectedPlan({
                            id: found._id || found.id,
                            name: found.name || "A Year of Honey Subscription",
                            detail: found.packageLabel || `${found.quantityPerJar || 500}g × ${found.numberOfJars || 6} Jars`,
                            price: found.price || 2099,
                            mrp: found.originalPrice || found.mrp || 2394,
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching plan details:", err);
            }
        };

        fetchPlanDetails();
    }, [targetPlanId]);

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmittingCheckout(true);
            const token = getTokenFromCookie();

            const payload = {
                planId: selectedPlan.id,
                customer: {
                    name: checkoutForm.name,
                    mobile: checkoutForm.mobile,
                    email: checkoutForm.email,
                },
                shipping_address: {
                    full_name: checkoutForm.shipping_full_name || checkoutForm.name,
                    phone: checkoutForm.shipping_phone || checkoutForm.mobile,
                    address_line1: checkoutForm.shipping_address_line1,
                    address_line2: checkoutForm.shipping_address_line2,
                    city: checkoutForm.shipping_city,
                    state: checkoutForm.shipping_state,
                    pincode: checkoutForm.shipping_pincode,
                    country: checkoutForm.shipping_country || "India",
                },
                billing_address: sameAsShipping
                    ? {
                        full_name: checkoutForm.shipping_full_name || checkoutForm.name,
                        phone: checkoutForm.shipping_phone || checkoutForm.mobile,
                        address_line1: checkoutForm.shipping_address_line1,
                        address_line2: checkoutForm.shipping_address_line2,
                        city: checkoutForm.shipping_city,
                        state: checkoutForm.shipping_state,
                        pincode: checkoutForm.shipping_pincode,
                        country: checkoutForm.shipping_country || "India",
                    }
                    : {
                        full_name: checkoutForm.billing_full_name || checkoutForm.name,
                        phone: checkoutForm.billing_phone || checkoutForm.mobile,
                        address_line1: checkoutForm.billing_address_line1,
                        address_line2: checkoutForm.billing_address_line2,
                        city: checkoutForm.billing_city,
                        state: checkoutForm.billing_state,
                        pincode: checkoutForm.billing_pincode,
                        country: checkoutForm.billing_country || "India",
                    },
            };

            const res = await fetch(`${API_BASE_URL}/api/purchase-plans/checkout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            const resData = await res.json().catch(() => ({}));

            if (res.ok && (resData.success !== false)) {
                if (resData.payment_required && resData.razorpay) {
                    await loadRazorpayScript();
                    if (typeof window !== "undefined" && (window as any).Razorpay) {
                        const options = {
                            key: resData.razorpay.key_id,
                            amount: resData.razorpay.amount,
                            currency: resData.razorpay.currency || "INR",
                            name: "ShuddhVeda Honey",
                            description: `${resData.purchase?.plan?.name || selectedPlan.name} Subscription`,
                            order_id: resData.razorpay.order_id,
                            handler: function (response: any) {
                                const finalOrder = {
                                    orderId: resData.purchase?.purchase_id || resData.purchase?._id || `PP-${Date.now().toString().slice(-6)}`,
                                    createdAt: new Date().toISOString(),
                                    paymentMethod: "Online Payment",
                                    paymentStatus: "Paid",
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpaySignature: response.razorpay_signature,
                                    planName: resData.purchase?.plan?.name || selectedPlan.name,
                                    purchase: resData.purchase,
                                    shippingAddress: {
                                        name: payload.shipping_address.full_name,
                                        phone: payload.shipping_address.phone,
                                        addressLine: payload.shipping_address.address_line1,
                                        city: payload.shipping_address.city,
                                        state: payload.shipping_address.state,
                                        pincode: payload.shipping_address.pincode,
                                    },
                                    pricing: { total: resData.purchase?.finalAmount || selectedPlan.price },
                                };
                                if (typeof window !== "undefined") {
                                    localStorage.setItem("latest_order", JSON.stringify(finalOrder));
                                }
                                router.push("/thank");
                            },
                            prefill: {
                                name: payload.customer.name,
                                email: payload.customer.email,
                                contact: payload.customer.mobile,
                            },
                            theme: { color: "#D97706" },
                        };
                        const rzp = new (window as any).Razorpay(options);
                        rzp.open();
                        setSubmittingCheckout(false);
                        return;
                    }
                }

                const createdOrder = resData.purchase || resData.data || resData.order || resData;
                if (typeof window !== "undefined") {
                    localStorage.setItem("latest_order", JSON.stringify(createdOrder));
                }
                router.push("/thank");
            } else {
                alert(resData.message || "Failed to process plan checkout. Please try again.");
            }
        } catch (err: any) {
            console.error("Plan checkout error:", err);
            alert(err.message || "Something went wrong while processing your subscription order.");
        } finally {
            setSubmittingCheckout(false);
        }
    };

    return (
        <div className="w-full text-left space-y-5">
            {/* Header Banner Image (Background.svg - Full width, exact aspect ratio, no side cuts) */}
            <div className="relative w-full aspect-[1040/205] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#FAF4E8]">
                <Image
                    src="/Background.svg"
                    alt="Subscribe Honey Subscription Banner"
                    fill
                    priority
                    className="object-contain object-center w-full h-full"
                />
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-5">

                {/* 1. Customer Details */}
                <div className="bg-white/80 border border-[#EADBCA] rounded-2xl p-4 sm:p-6 shadow-2xs">
                    <div className="flex items-center gap-3 pb-2.5 border-b border-[#EADBCA]">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6B3A04] text-white flex items-center justify-center font-serif font-bold text-sm sm:text-base shadow-2xs flex-shrink-0">
                            1
                        </div>
                        <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#593102]">
                            Customer Details
                        </h4>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                autoComplete="off"
                                value={checkoutForm.name}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                                placeholder="Rahul Kumar"
                                className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Mobile Number *</label>
                            <input
                                type="tel"
                                required
                                autoComplete="off"
                                maxLength={10}
                                value={checkoutForm.mobile}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    setCheckoutForm({ ...checkoutForm, mobile: val });
                                }}
                                placeholder="9876543210"
                                className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Email Address *</label>
                            <input
                                type="email"
                                required
                                autoComplete="off"
                                value={checkoutForm.email}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                                placeholder="rahul@gmail.com"
                                className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="bg-white/80 border border-[#EADBCA] rounded-2xl p-4 sm:p-6 shadow-2xs">
                    <div className="flex items-center gap-3 pb-2.5 border-b border-[#EADBCA]">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6B3A04] text-white flex items-center justify-center font-serif font-bold text-sm sm:text-base shadow-2xs flex-shrink-0">
                            2
                        </div>
                        <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#593102]">
                            Shipping Address
                        </h4>
                    </div>
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Recipient Name *</label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="off"
                                    value={checkoutForm.shipping_full_name}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_full_name: e.target.value })}
                                    placeholder="Rahul Kumar"
                                    className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    autoComplete="off"
                                    maxLength={10}
                                    value={checkoutForm.shipping_phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                        setCheckoutForm({ ...checkoutForm, shipping_phone: val });
                                    }}
                                    placeholder="9876543210"
                                    className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Address Line 1 *</label>
                            <input
                                type="text"
                                required
                                autoComplete="off"
                                value={checkoutForm.shipping_address_line1}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_address_line1: e.target.value })}
                                placeholder="House No. 123, Shalimar Bagh"
                                className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Address Line 2 (Landmark / Area)</label>
                            <input
                                type="text"
                                autoComplete="off"
                                value={checkoutForm.shipping_address_line2}
                                onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_address_line2: e.target.value })}
                                placeholder="Near Main Market"
                                className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div>
                                <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">City *</label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="off"
                                    value={checkoutForm.shipping_city}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_city: e.target.value })}
                                    placeholder="Delhi"
                                    className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">State *</label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="off"
                                    value={checkoutForm.shipping_state}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_state: e.target.value })}
                                    placeholder="Delhi"
                                    className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Pincode *</label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="off"
                                    value={checkoutForm.shipping_pincode}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_pincode: e.target.value })}
                                    placeholder="110088"
                                    className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-semibold text-[#593102] block mb-1">Country *</label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="off"
                                    value={checkoutForm.shipping_country}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_country: e.target.value })}
                                    placeholder="India"
                                    className="h-10 sm:h-11 w-full rounded-xl border border-[#EADBCA] bg-[#FAF5EC] px-3.5 text-xs sm:text-sm font-medium text-[#593102] focus:border-[#D97706] focus:bg-white focus:outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Submit Button INSIDE Section 2 Card with slimmer height */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submittingCheckout}
                                className="w-full h-10 sm:h-11 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white font-sans font-bold text-sm sm:text-base tracking-wide shadow-sm hover:shadow transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {submittingCheckout ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <span>Check Out</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer slogan with divider line above text */}
                <div className="pt-4 border-t border-[#EADBCA] text-center">
                    <p className="font-cormorant italic text-[14px] sm:text-[16px] text-[#7A6A59]">
                        Rooted in tradition. Committed to purity.
                    </p>
                </div>

            </form>
        </div>
    );
}
