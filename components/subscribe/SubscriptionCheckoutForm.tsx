"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, CheckCircle2, MapPin, Plus } from "lucide-react";
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
    image_url?: string;
    image?: string;
}

interface UserSavedAddress {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    label?: string;
    is_default?: boolean;
}

function normalizeUserAddress(item: any): UserSavedAddress {
    return {
        id: item._id || item.id || String(Math.random()),
        full_name: item.full_name || item.fullName || item.name || item.recipient_name || "",
        phone: item.phone_number || item.phone || item.mobile || "",
        email: item.email || "",
        address_line1: item.address_line1 || item.addressLine1 || item.line1 || item.address || "",
        address_line2: item.address_line2 || item.addressLine2 || item.line2 || item.locality || "",
        city: item.city || "",
        state: item.state || "",
        pincode: item.pincode || item.zip || item.postal_code || "",
        country: item.country || "India",
        label: item.address_type === "home" ? "Home" : item.address_type === "work" ? "Office" : (item.address_type ? String(item.address_type).toUpperCase() : "Saved Address"),
        is_default: item.is_default || item.isDefault || false,
    };
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
        image_url: "/subscribe2.0.png",
    });

    const [submittingCheckout, setSubmittingCheckout] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);

    const [savedAddresses, setSavedAddresses] = useState<UserSavedAddress[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

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

    const selectAddressAndFillForm = (addr: UserSavedAddress) => {
        setSelectedAddressId(addr.id);
        setCheckoutForm((prev) => ({
            ...prev,
            name: prev.name || addr.full_name,
            mobile: prev.mobile || addr.phone,
            email: prev.email || addr.email || "",
            shipping_full_name: addr.full_name,
            shipping_phone: addr.phone,
            shipping_address_line1: addr.address_line1,
            shipping_address_line2: addr.address_line2,
            shipping_city: addr.city,
            shipping_state: addr.state,
            shipping_pincode: addr.pincode,
            shipping_country: addr.country || "India",
        }));
    };

    const clearAddressForm = () => {
        setSelectedAddressId(null);
        setCheckoutForm((prev) => ({
            ...prev,
            shipping_full_name: "",
            shipping_phone: "",
            shipping_address_line1: "",
            shipping_address_line2: "",
            shipping_city: "",
            shipping_state: "",
            shipping_pincode: "",
            shipping_country: "India",
        }));
    };

    const toggleAddressSelection = (addr: UserSavedAddress) => {
        if (selectedAddressId === addr.id) {
            clearAddressForm();
        } else {
            selectAddressAndFillForm(addr);
        }
    };

    useEffect(() => {
        // Pre-fill customer details from session if available
        const session = getStoredSession();
        if (session && session.user) {
            const userObj = session.user as any;
            setCheckoutForm((prev) => ({
                ...prev,
                name: prev.name || userObj.name || userObj.fullName || "",
                mobile: prev.mobile || userObj.mobile || userObj.phone || "",
                email: prev.email || userObj.email || "",
            }));
        }

        const fetchUserAddresses = async () => {
            setLoadingAddresses(true);
            try {
                const token = getTokenFromCookie();
                let res = await fetch(`${API_BASE_URL}/api/purchase-plans/user-address`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Tunnel-Skip-Anti-Phishing-Page": "true",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });

                if (!res.ok && res.status === 404) {
                    res = await fetch(`${API_BASE_URL}/api/shipping/addresses/all`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Tunnel-Skip-Anti-Phishing-Page": "true",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                    });
                }

                if (res.ok) {
                    const data = await res.json();
                    let rawList: any[] = [];
                    if (Array.isArray(data.data)) {
                        rawList = data.data;
                    } else if (Array.isArray(data.addresses)) {
                        rawList = data.addresses;
                    } else if (Array.isArray(data)) {
                        rawList = data;
                    } else if (data.data && typeof data.data === "object") {
                        rawList = [data.data];
                    } else if (data.address && typeof data.address === "object") {
                        rawList = [data.address];
                    }

                    const parsed = rawList.map(normalizeUserAddress).filter((a) => a.address_line1 || a.city || a.pincode);
                    setSavedAddresses(parsed);
                }
            } catch (err) {
                console.error("Error fetching user address for purchase plans:", err);
            } finally {
                setLoadingAddresses(false);
            }
        };

        fetchUserAddresses();
    }, []);

    useEffect(() => {
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
                        const foundImg =
                            found.image_url ||
                            (typeof found.image === "string" ? found.image : (found.image?.image_url || found.image?.url)) ||
                            found.imageUrl ||
                            "/subscribe2.0.png";

                        setSelectedPlan({
                            id: found._id || found.id,
                            name: found.name || "A Year of Honey Subscription",
                            detail: found.packageLabel || `${found.quantityPerJar || 500}g × ${found.numberOfJars || 6} Jars`,
                            price: found.price || 2099,
                            mrp: found.originalPrice || found.mrp || 2394,
                            image_url: foundImg,
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
                const planImage =
                    resData.purchase?.plan?.image_url ||
                    (typeof resData.purchase?.plan?.image === "string" ? resData.purchase?.plan?.image : resData.purchase?.plan?.image?.image_url) ||
                    selectedPlan.image_url ||
                    selectedPlan.image ||
                    "/subscribe2.0.png";

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
                                    planImage: planImage,
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

                const rawCreated = resData.purchase || resData.data || resData.order || resData;
                const createdOrder = {
                    ...rawCreated,
                    planName: resData.purchase?.plan?.name || rawCreated.planName || selectedPlan.name,
                    planImage: planImage,
                    shippingAddress: rawCreated.shippingAddress || {
                        name: payload.shipping_address.full_name,
                        phone: payload.shipping_address.phone,
                        addressLine: payload.shipping_address.address_line1,
                        city: payload.shipping_address.city,
                        state: payload.shipping_address.state,
                        pincode: payload.shipping_address.pincode,
                    },
                    pricing: rawCreated.pricing || { total: resData.purchase?.finalAmount || selectedPlan.price },
                };
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
                    src="/shuddpng.png"
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

                    {/* Saved User Addresses Selection */}
                    {loadingAddresses ? (
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#6B3A04]">
                            <Loader2 size={14} className="animate-spin text-[#D97706]" />
                            <span>Loading saved addresses...</span>
                        </div>
                    ) : savedAddresses.length > 0 ? (
                        <div className="mt-4 mb-5 p-3.5 sm:p-4 rounded-xl bg-[#FAF5EC]/80 border border-[#EADBCA]">
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <label className="text-xs sm:text-sm font-bold text-[#593102] flex items-center gap-1.5">
                                    <MapPin size={15} className="text-[#D97706]" />
                                    <span>Select from your Saved Addresses:</span>
                                </label>
                                {selectedAddressId && (
                                    <button
                                        type="button"
                                        onClick={clearAddressForm}
                                        className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <Plus size={13} />
                                        <span>Add New Address</span>
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {savedAddresses.map((addr) => {
                                    const isSelected = selectedAddressId === addr.id;
                                    return (
                                        <div
                                            key={addr.id}
                                            onClick={() => toggleAddressSelection(addr)}
                                            className={`p-3.5 rounded-2xl border-2 text-xs cursor-pointer transition-all flex flex-col justify-between ${
                                                isSelected
                                                    ? "border-[#D97706] bg-white ring-2 ring-[#D97706]/20 shadow-md"
                                                    : "border-[#EADBCA] bg-white/90 hover:border-[#D97706]/60 hover:bg-white"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors ${
                                                        isSelected ? "border-[#D97706] bg-[#D97706] text-white" : "border-[#C8B28F] bg-white"
                                                    }`}>
                                                        {isSelected && <CheckCircle2 size={13} />}
                                                    </span>
                                                    <span className="font-bold text-[#593102] text-sm">{addr.full_name || "Saved Address"}</span>
                                                </div>
                                                {addr.label && (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FAF0DC] text-[#593102] border border-[#D49313]/30">
                                                        {addr.label}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-2.5 text-[#6E5D4F] leading-snug font-medium">
                                                {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}, {addr.city}, {addr.state} - {addr.pincode}
                                            </p>
                                            <p className="mt-2 font-bold text-[#593102] text-xs">
                                                Phone: {addr.phone}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

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
