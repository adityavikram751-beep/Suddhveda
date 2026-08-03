"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
    Lock,
    Minus,
    Plus,
    Trash2,
    Phone,
    Mail,
    Clock,
    Check,
    Loader2,
    ChevronDown,
    ChevronUp,
    Gift,
    Tag,
    ShieldCheck,
    Truck,
} from "lucide-react";
import ProductCardShop from "@/components/productcardshop";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";

const freeDeliveryTarget = 2000;

// ---------- Helper to get token from cookie ----------
function getTokenFromCookie(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^| )sudhveda_token=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
}

// ---------- Helper for authenticated fetch ----------
async function authFetch(url: string, options: RequestInit = {}) {
    const token = getTokenFromCookie();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };
    const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers,
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Request failed (${res.status})`);
    }
    return res.json();
}

type LocationData = {
    phone: string;
    phone_timing: string;
    email: string;
    email_reply_time: string;
    whatsapp: string;
    whatsapp_timing: string;
    map_embed_url: string;
};

export default function Cart() {
    const router = useRouter();
    const {
        cartItems,
        addToCart,
        updateQuantity,
        updateCustomQuantity,
        removeItem,
        isLoading,
    } = useCart();

    const cartProducts = Object.values(cartItems);

    const subtotal = cartProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0,
    );
    const saved = cartProducts.reduce(
        (sum, product) =>
        sum +
        (product.type === "NORMAL"
            ? Math.max((product.oldPrice || 0) - product.price, 0) * product.quantity
            : 0),
        0,
    );

    type ApiProduct = {
        _id: string;
        product_name: string;
        brand?: string;
        image?: { image_url?: string };
        imageDocumentId?: { image_url?: string; is_primary?: boolean }[];
        variantDocumentId?: { _id: string; weight: number; price: number; mrp?: number; unit?: string }[];
    };

    const [recommendations, setRecommendations] = useState<ApiProduct[]>([]);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Track selected variants for each recommendation product
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

    // 👇 Location data lifted up here so it's fetched ONCE and shared by both
    // the desktop "Need Help" panel and the mobile "Need Help" panel (no duplicate API calls)
    const [location, setLocation] = useState<LocationData | null>(null);
    const [locationLoading, setLocationLoading] = useState(true);

    // Fetch recommendations
    useEffect(() => {
        (async () => {
            try {
                const data = await authFetch(`${API_BASE_URL}/api/products`);
                const list: ApiProduct[] =
                    data.data || data.products || data.items || (Array.isArray(data) ? data : []);
                setRecommendations(list.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        })();
    }, []);

    // Fetch wishlist
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    const products = data?.data?.products || [];
                    const ids = products.map((item: any) =>
                        item.productId?._id || item.productId || item._id
                    );
                    setWishlistIds(ids);
                }
            } catch (err) {
                console.error("Error fetching wishlist:", err);
            }
        })();
    }, []);

    // Fetch location/help info once here (shared by desktop + mobile Need Help blocks)
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/location/all`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    const loc = data.data || data;
                    setLocation({
                        phone: loc.phone || "+91 98765 43210",
                        phone_timing: loc.phone_timing || "Mon - Sat : 9AM - 6PM",
                        email: loc.email || "connect@honeyveda.in",
                        email_reply_time: loc.email_reply_time || "We reply within 24 hrs",
                        whatsapp: loc.whatsapp || "",
                        whatsapp_timing: loc.whatsapp_timing || "",
                        map_embed_url: loc.map_embed_url || "",
                    });
                } else {
                    setLocation({
                        phone: "+91 98765 43210",
                        phone_timing: "Mon - Sat : 9AM - 6PM",
                        email: "connect@honeyveda.in",
                        email_reply_time: "We reply within 24 hrs",
                        whatsapp: "",
                        whatsapp_timing: "",
                        map_embed_url: "",
                    });
                }
            } catch (err) {
                console.error("Error fetching location:", err);
                setLocation({
                    phone: "+91 98765 43210",
                    phone_timing: "Mon - Sat : 9AM - 6PM",
                    email: "connect@honeyveda.in",
                    email_reply_time: "We reply within 24 hrs",
                    whatsapp: "",
                    whatsapp_timing: "",
                    map_embed_url: "",
                });
            } finally {
                setLocationLoading(false);
            }
        })();
    }, []);

    const handleToggleWishlist = async (productId: string) => {
        const isWishlisted = wishlistIds.includes(productId);
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/wishlist/${isWishlisted ? "remove" : "add"}/${productId}`, {
                    method: isWishlisted ? "DELETE" : "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (res.ok) {
                setWishlistIds((prev) =>
                    isWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]
                );
                window.dispatchEvent(
                    new CustomEvent("wishlist-count-update", {
                        detail: { count: isWishlisted ? wishlistIds.length - 1 : wishlistIds.length + 1 },
                    })
                );
            }
        } catch (err) {
            console.error("Error toggling wishlist:", err);
        }
    };

    const handleRecommendationAddToCart = async (productId: string, variantId: string) => {
        try {
            setActionLoading(productId);
            await addToCart(productId, variantId);
        } catch (err) {
            console.error("Error adding to cart:", err);
        } finally {
            setActionLoading(null);
        }
    };

    // 👇 Reusable "You May Also Like" block — rendered once for desktop (original spot)
    // and once for mobile (bottom of page, above footer). Uses the SAME shared state above,
    // so no duplicate fetching happens even though it's rendered twice.
    const renderRecommendations = () => (
        <>
            <h2 className="text-[22px] font-semibold">You May Also Like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {recommendations.map((item) => {
                    const variants = item.variantDocumentId || [];
                    const selectedVariantId =
                        selectedVariants[item._id] || (variants[0]?._id ?? "");

                    const currentVariant =
                        variants.find((v) => v._id === selectedVariantId) || variants[0];

                    const primaryImage =
                        item.imageDocumentId?.find((img) => img.is_primary)?.image_url ||
                        item.image?.image_url ||
                        "/placeholder.png";

                    return (
                        <div key={item._id} className="h-full">
                            <ProductCardShop
                                image={primaryImage}
                                title={item.product_name}
                                subtitle={item.brand || "SudhVeda Honey"}
                                weight={
                                    currentVariant ?
                                    `${currentVariant.weight}${currentVariant.unit || "g"}` :
                                    ""
                                }
                                price={currentVariant?.price || 0}
                                oldPrice={currentVariant?.mrp}
                                quantity={0}
                                variants={variants}
                                selectedVariantId={selectedVariantId}
                                onVariantSelect={(vId) =>
                                    setSelectedVariants((prev) => ({ ...prev, [item._id]: vId }))
                                }
                                isWishlisted={wishlistIds.includes(item._id)}
                                onToggleWishlist={() => handleToggleWishlist(item._id)}
                                onAddToCart={() =>
                                    currentVariant &&
                                    handleRecommendationAddToCart(item._id, currentVariant._id)
                                }
                                onIncrement={() => {}}
                                onDecrement={() => {}}
                                onOpenDetails={() => router.push(`/shop/products/${item._id}`)}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );

    return (
        <main className="bg-[#FFF8EF] py-10 text-[#2F241C]">
            <div className="mx-auto -mt-10 max-w-[1410px] px-5">
                <nav className="mb-6 text-sm text-[#7B8493]">

                </nav>

                <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
                    {/* LEFT SECTION */}
                    <section>
                        <h1 className="text-[34px] font-bold">
                            Your Cart <span className="text-[#2D3A1B]">({cartProducts.length})</span>
                        </h1>


                        <div className="mt-12 hidden grid-cols-[1fr_120px_160px_100px] px-5 text-[15px] font-semibold uppercase tracking-[0.08em] text-[#30303A] md:grid">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Total</span>
                        </div>

                        <div className="mt-4 space-y-5">
                            {isLoading ? (
                                <div className="rounded bg-white px-5 py-10 text-center text-[#8E623A]">
                                    Loading cart...
                                </div>
                            ) : cartProducts.length === 0 ? (
                                <div className="rounded bg-white px-5 py-10 text-center text-[#8E623A]">
                                    Your cart is empty.
                                </div>
                            ) : (
                                cartProducts.map((product) => (
                                    <div
                                        key={product.cartItemId}
                                        className="group grid gap-5 rounded-2xl border border-[#F0E4D4] bg-white px-5 py-5 shadow-[0_2px_10px_rgba(60,40,20,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(60,40,20,0.08)] md:grid-cols-[1fr_110px_140px_110px] md:items-center"
                                    >
                                        <div className="flex gap-4 sm:gap-5">
                                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#FFF8EF] ring-1 ring-[#F0E4D4]">
                                                <Image
                                                    src={product.image}
                                                    alt={product.productName}
                                                    fill
                                                    className="object-contain p-2.5"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center gap-1.5">
                                                <h2 className="text-[16px] sm:text-[17px] font-bold leading-snug text-[#2F241C]">
                                                    {product.productName}
                                                </h2>
                                                <p className="text-[12.5px] text-[#9B8B76]">
                                                    {product.type === "NORMAL" ?
                                                        product.weight :
                                                        product.customMessage || "Gift box"}
                                                </p>
                                                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#E7F9EA] px-2.5 py-1 text-[10px] font-bold text-[#149447]">
                                                    <Check size={11} className="stroke-[3]" />
                                                    100% Raw &amp; Unfiltered
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(product.cartItemId)}
                                                    className="mt-1 flex w-fit items-center gap-1.5 text-[12px] font-medium text-[#B0A18C] transition-colors hover:text-red-500"
                                                >
                                                    <Trash2 size={13} /> Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:block">
                                            <span className="text-[11px] font-medium text-[#B0A18C] md:hidden">Price</span>
                                            <p className="text-[17px] sm:text-[18px] font-bold text-[#3C2015]">
                                                ₹{product.price}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-start">
                                            <span className="text-[11px] font-medium text-[#B0A18C] md:hidden">Quantity</span>
                                            <QuantityControl
                                                quantity={product.quantity}
                                                onMinus={() =>
                                                    product.type === "NORMAL" ?
                                                    updateQuantity(product.productId, product.variantId, -1) :
                                                    updateCustomQuantity(product.cartItemId, -1)
                                                }
                                                onPlus={() =>
                                                    product.type === "NORMAL" ?
                                                    updateQuantity(product.productId, product.variantId, 1) :
                                                    updateCustomQuantity(product.cartItemId, 1)
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between border-t border-[#F5EEE3] pt-3 md:border-t-0 md:pt-0 md:block">
                                            <span className="text-[11px] font-medium text-[#B0A18C] md:hidden">Total</span>
                                            <p className="text-[19px] sm:text-[20px] font-bold text-[#2D3A1B]">
                                                ₹{product.price * product.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop-only: "You May Also Like" stays exactly where it was (under cart items) */}
                        <div className="hidden lg:block mt-8">
                            {renderRecommendations()}
                        </div>
                    </section>

                    {/* RIGHT SIDEBAR */}
                    <aside className="w-full space-y-8 box-border lg:max-w-[420px] lg:sticky lg:bottom-10 self-end">
                        <OrderSummaryWithCoupons
                            subtotal={subtotal}
                            saved={saved}
                            itemCount={cartProducts.length}
                        />
                        {/* Desktop-only: "Need Help" stays exactly where it was (under Order Summary) */}
                        <div className="hidden lg:block">
                            <HelpPanel location={location} loading={locationLoading} />
                        </div>
                    </aside>
                </div>

                {/* Mobile-only: "You May Also Like" + "Need Help" pushed to the very bottom, above the footer */}
                <div className="lg:hidden mt-10 space-y-10">
                    {renderRecommendations()}
                    <HelpPanel location={location} loading={locationLoading} />
                </div>
            </div>
        </main>
    );
}

// ─── Free Delivery Bar ──────────────────────────────────────────────────

export function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
    const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
    const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

    // Empty return to fix the component
    return null;
}

// ─── Quantity Control ──────────────────────────────────────────────────

export function QuantityControl({
    quantity,
    onMinus,
    onPlus,
}: {
    quantity: number;
    onMinus: () => void;
    onPlus: () => void;
}) {
    return (
        <div className="inline-grid h-10 w-[104px] grid-cols-3 items-center rounded-full border border-[#E4D9C7] bg-[#FBFCFD] text-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            <button
                type="button"
                onClick={onMinus}
                className="flex h-full items-center justify-center rounded-l-full text-[#7A6A52] transition-colors hover:bg-[#FFF3DF] hover:text-[#B97B00]"
            >
                <Minus size={14} />
            </button>
            <span className="font-bold text-[#2F241C]">{quantity}</span>
            <button
                type="button"
                onClick={onPlus}
                className="flex h-full items-center justify-center rounded-r-full text-[#7A6A52] transition-colors hover:bg-[#FFF3DF] hover:text-[#B97B00]"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}

// ─── Types ─────────────────────────────────────────────────────────────

type ApiCoupon = {
    offerId: string;
    code: string;
    desc: string;
    minOrder: string;
    isAvailable: boolean;
    discountPercentage?: number;
    flatDiscount?: number;
    calculatedDiscount?: number;
};

// ─── Order Summary with Permanent Back Navigation Fix ──────────────────

export function OrderSummaryWithCoupons({
    subtotal,
    saved,
    itemCount,
}: {
    subtotal: number;
    saved: number;
    itemCount: number;
}) {
    const router = useRouter();
    const { fetchCart } = useCart() as any;
    const [couponCode, setCouponCode] = useState("");
    const [coupons, setCoupons] = useState<ApiCoupon[]>([]);
    const [appliedCoupons, setAppliedCoupons] = useState<ApiCoupon[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("applied_coupons");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) {
                    console.error("Storage error", e);
                }
            }
        }
        return [];
    });

    const [couponError, setCouponError] = useState<string | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [isCouponSectionOpen, setIsCouponSectionOpen] = useState(true);

    // Fetch Available Coupons
    useEffect(() => {
        (async () => {
            try {
                const data = await authFetch(`${API_BASE_URL}/api/coupon/all-coupons`);
                const list: ApiCoupon[] = (data.data || data.coupons || Array.isArray(data) ? (data.data || data.coupons || data) : [])
                    .filter((c: any) => c.isActive !== false)
                    .map((c: any) => ({
                        offerId: c._id || c.offerId,
                        code: c.couponCode || c.code,
                        desc: c.title || c.description || "",
                        minOrder: c.minimumOrderAmount ? `₹${c.minimumOrderAmount}` : "",
                        isAvailable: true,
                        discountPercentage: c.discountPercentage || c.percentage || 0,
                        flatDiscount: c.discountAmount || c.amount || 0,
                    }));
                setCoupons(list);
            } catch (err) {
                console.error("Failed to fetch coupons:", err);
            }
        })();
    }, []);

    // Back button hone par LocalStorage + API Sync
    const syncCoupons = useCallback(async () => {
        let currentList: ApiCoupon[] = [];

        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("applied_coupons");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        currentList = parsed;
                    }
                } catch (e) {
                    console.error("Storage parse error", e);
                }
            }
        }

        try {
            const cartData = await authFetch(`${API_BASE_URL}/api/cart`);
            const serverCode = cartData?.appliedCoupon?.code || cartData?.couponCode;
            const serverDiscount = cartData?.couponDiscount ?? cartData?.discountAmount ?? cartData?.discount ?? 0;
            const offerId = cartData?.appliedCoupon?._id || cartData?.appliedCoupon?.offerId || serverCode;

            if (serverCode && serverDiscount > 0) {
                const upperServerCode = serverCode.toUpperCase();
                if (!currentList.some((c) => c.code.toUpperCase() === upperServerCode)) {
                    const matched = coupons.find((c) => c.code.toUpperCase() === upperServerCode);
                    currentList.push({
                        offerId: matched?.offerId || offerId || upperServerCode,
                        code: serverCode,
                        desc: matched?.desc || "Applied Coupon",
                        minOrder: matched?.minOrder || "",
                        isAvailable: true,
                        calculatedDiscount: Math.round(serverDiscount),
                        discountPercentage: matched?.discountPercentage,
                        flatDiscount: matched?.flatDiscount,
                    });
                }
            }
        } catch (err) {
            console.error("Cart sync error", err);
        }

        setAppliedCoupons(currentList);
    }, [coupons]);

    useEffect(() => {
        syncCoupons();

        const handlePageShow = () => syncCoupons();
        window.addEventListener("pageshow", handlePageShow);
        window.addEventListener("focus", syncCoupons);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
            window.removeEventListener("focus", syncCoupons);
        };
    }, [syncCoupons]);

    // Dynamic Discount Calculator
    const calculateTotalDiscount = (appliedList: ApiCoupon[], currentSubtotal: number) => {
        return appliedList.reduce((acc, coupon) => {
            let d = 0;
            if (coupon.discountPercentage && coupon.discountPercentage > 0) {
                d = Math.round((currentSubtotal * coupon.discountPercentage) / 100);
            } else if (coupon.flatDiscount && coupon.flatDiscount > 0) {
                d = coupon.flatDiscount;
            } else {
                d = coupon.calculatedDiscount || 0;
            }
            return acc + d;
        }, 0);
    };

    const totalDiscount = calculateTotalDiscount(appliedCoupons, subtotal);

    // Sync state into LocalStorage always
    useEffect(() => {
        if (typeof window !== "undefined") {
            const updatedList = appliedCoupons.map((c) => {
                let d = 0;
                if (c.discountPercentage && c.discountPercentage > 0) {
                    d = Math.round((subtotal * c.discountPercentage) / 100);
                } else if (c.flatDiscount && c.flatDiscount > 0) {
                    d = c.flatDiscount;
                } else {
                    d = c.calculatedDiscount || 0;
                }
                return { ...c, calculatedDiscount: d };
            });

            const sumDiscount = updatedList.reduce((acc, item) => acc + (item.calculatedDiscount || 0), 0);

            if (updatedList.length > 0) {
                localStorage.setItem("applied_coupons", JSON.stringify(updatedList));
                localStorage.setItem("applied_coupon", JSON.stringify({
                    discount: sumDiscount,
                    coupon: { code: updatedList.map(u => u.code).join(", ") }
                }));
            } else {
                localStorage.removeItem("applied_coupons");
                localStorage.removeItem("applied_coupon");
            }
        }
    }, [appliedCoupons, subtotal]);

    // Apply Coupon Action
    const applyCoupon = async (code: string) => {
        setCouponError(null);
        const upperCode = code.toUpperCase();
        const matched = coupons.find((c) => c.code.toUpperCase() === upperCode);

        if (appliedCoupons.some((c) => c.code.toUpperCase() === upperCode)) {
            setCouponError(`Coupon "${upperCode}" is already applied.`);
            return;
        }

        setCouponLoading(true);
        try {
            const data = await authFetch(`${API_BASE_URL}/api/coupon/apply`, {
                method: "POST",
                body: JSON.stringify({
                    couponCode: upperCode,
                    cartAmount: subtotal,
                }),
            });

            let calculatedDiscount = 0;
            const resDiscount = data.discount ?? data.discountAmount ?? data.data?.discount ?? data.data?.discountAmount;
            if (resDiscount !== undefined && resDiscount !== null) {
                calculatedDiscount = typeof resDiscount === "string" ? parseFloat(resDiscount) || 0 : resDiscount;
            } else if (matched?.discountPercentage && matched.discountPercentage > 0) {
                calculatedDiscount = (subtotal * matched.discountPercentage) / 100;
            } else if (matched?.flatDiscount && matched.flatDiscount > 0) {
                calculatedDiscount = matched.flatDiscount;
            }

            const finalDiscount = Math.round(calculatedDiscount);

            const couponObj: ApiCoupon = {
                offerId: matched?.offerId || data.offerId || data._id || data.data?._id || upperCode,
                code: matched?.code || upperCode,
                desc: matched?.desc || data.message || "Coupon applied",
                minOrder: matched?.minOrder || "",
                isAvailable: true,
                discountPercentage: matched?.discountPercentage,
                flatDiscount: matched?.flatDiscount,
                calculatedDiscount: finalDiscount,
            };

            setAppliedCoupons((prev) => [...prev, couponObj]);
            setCouponCode("");

            if (fetchCart) fetchCart();
            // router.refresh() removed — this was causing the coupon dropdown
            // to appear to "close" because it forced a full data re-render.
        } catch (err: any) {
            const errorMsg = err.message || "";
            if (errorMsg.toLowerCase().includes("already used") || errorMsg.toLowerCase().includes("already applied")) {
                const couponObj: ApiCoupon = {
                    offerId: matched?.offerId || upperCode,
                    code: matched?.code || upperCode,
                    desc: matched?.desc || "Applied Coupon",
                    minOrder: matched?.minOrder || "",
                    isAvailable: true,
                    discountPercentage: matched?.discountPercentage,
                    flatDiscount: matched?.flatDiscount,
                    calculatedDiscount: matched?.discountPercentage ?
                        Math.round((subtotal * matched.discountPercentage) / 100) :
                        (matched?.flatDiscount || 0),
                };

                setAppliedCoupons((prev) => {
                    if (prev.some((item) => item.code.toUpperCase() === upperCode)) return prev;
                    return [...prev, couponObj];
                });
                setCouponCode("");
                setCouponError(null);
            } else {
                setCouponError(errorMsg || "Could not apply coupon");
            }
        } finally {
            setCouponLoading(false);
        }
    };

    // REMOVE Coupon Action
    const removeCoupon = async (targetOfferId?: string, targetCode?: string) => {
        const codeToRemove = targetCode || appliedCoupons[0]?.code;
        const matchedCoupon = appliedCoupons.find((c) => c.code.toUpperCase() === codeToRemove?.toUpperCase());
        const idToRemove = targetOfferId || matchedCoupon?.offerId || codeToRemove;

        if (!codeToRemove) return;

        const filtered = appliedCoupons.filter((c) => c.code.toUpperCase() !== codeToRemove.toUpperCase());
        setAppliedCoupons(filtered);

        if (filtered.length === 0) {
            localStorage.removeItem("applied_coupons");
            localStorage.removeItem("applied_coupon");
        }

        try {
            if (idToRemove) {
                await authFetch(`${API_BASE_URL}/api/coupon/remove/${idToRemove}`, {
                    method: "DELETE",
                }).catch(() => null);
            }

            if (fetchCart) await fetchCart();
            // router.refresh() removed — same reason as above, so the
            // coupon dropdown stays open after removing a coupon too.
        } catch (err) {
            console.error("Remove coupon error:", err);
        }
    };

    // Net Total Price
    const total = Math.max(subtotal - totalDiscount, 0);

    return (
        <div className="w-full rounded-2xl bg-white shadow-[0_4px_24px_rgba(60,40,20,0.06)] border border-[#F0E4D4] overflow-hidden box-border">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#F5EEE3] bg-gradient-to-r from-[#FAF7F0] to-white">
                <div className="flex items-center justify-between">
                    <h2 className="text-[18px] font-bold text-[#2F241C] flex items-center gap-2">
                        <span className="text-[#B97B00]">🛒</span> Order Summary
                        <span className="ml-1 rounded-full bg-[#FFF3DF] px-2.5 py-0.5 text-[11px] font-medium text-[#B97B00]">
                            {itemCount} items
                        </span>
                    </h2>
                    <div className="flex items-center gap-1 text-[12px] text-[#9B8B76]">
                        <ShieldCheck size={14} className="text-[#149447]" />
                        <span>Secure</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
                {/* Price breakdown */}
                <div className="space-y-2.5 text-[14px]">
                    <div className="flex justify-between py-1">
                        <span className="text-[#6F7786]">Subtotal</span>
                        <span className="font-semibold text-[#2F241C]">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {saved > 0 && (
                        <div className="flex justify-between py-1">
                            <span className="text-[#6F7786]">You Save</span>
                            <span className="font-semibold text-[#0BA445]">- ₹{saved.toLocaleString("en-IN")}</span>
                        </div>
                    )}
                    {totalDiscount > 0 && (
                        <div className="flex justify-between py-1 border-t border-dashed border-[#E5E8ED] pt-2.5">
                            <span className="text-[#6F7786] flex items-center gap-1.5">
                                <Tag size={13} className="text-[#0BA445]" />
                                Coupon Discount
                                <span className="rounded-full bg-[#E7F9EA] px-2 py-0.5 text-[10px] font-bold text-[#0BA445]">
                                    {appliedCoupons.length}
                                </span>
                            </span>
                            <span className="font-bold text-[#0BA445]">- ₹{totalDiscount.toLocaleString("en-IN")}</span>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-[#F0E4D4]"></div>

                {/* Total */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[15px] font-bold text-[#2F241C]">Total</p>
                        <p className="text-[10px] text-[#9AA3AF]">Inclusive of all taxes</p>
                    </div>
                    <p className="font-serif text-[26px] font-bold text-[#2F241C]">
                        ₹{total.toLocaleString("en-IN")}
                    </p>
                </div>
            </div>

            {/* Coupon Section - Toggleable, natural height up to a max, then scrolls */}
            <div className="border-t border-[#F5EEE3]">
                <button
                    type="button"
                    className="flex w-full items-center justify-between px-6 py-3.5 text-[13px] font-semibold text-[#6F7786] hover:bg-[#FAF7F0] transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Gift size={15} className="text-[#B97B00]" />
                        Apply Coupons
                        {appliedCoupons.length > 0 && (
                            <span className="rounded-full bg-[#E7F9EA] px-2 py-0.5 text-[10px] font-bold text-[#0BA445]">
                                {appliedCoupons.length} applied
                            </span>
                        )}
                    </span>
                </button>

                {isCouponSectionOpen && (
                    <div className="px-6 pb-5 pt-1">
                        {/* max-h instead of a fixed h-, so it grows naturally with
                            content and only scrolls once it hits the cap */}
                        <div className="max-h-[340px] flex flex-col space-y-3">
                            {/* Input row - fixed height, won't shrink */}
                            <div className="flex gap-2 shrink-0">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    className="flex-1 rounded-xl border border-[#E8E0D6] bg-[#FBFCFD] px-4 py-2.5 text-sm text-[#2F241C] placeholder:text-[#B0A18C] focus:border-[#B97B00] focus:outline-none focus:ring-2 focus:ring-[#B97B00]/20 transition-all"
                                />
                                <button
                                    onClick={() => couponCode && applyCoupon(couponCode)}
                                    disabled={couponLoading}
                                    className="min-w-[90px] rounded-xl bg-[#B97B00] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#A06A00] transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                                >
                                    {couponLoading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Applying
                                        </>
                                    ) : (
                                        "Apply"
                                    )}
                                </button>
                            </div>

                            {couponError && (
                                <p className="text-[11px] font-medium text-red-500 shrink-0">{couponError}</p>
                            )}

                            {/* Scrollable content - takes remaining space, scrolls only past max-h */}
                            <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                                {/* Available coupons */}
                                <div>
                                    <p className="text-[9px] font-bold text-[#A2AAB7] uppercase tracking-[0.1em] mb-2">
                                        Available Coupons
                                    </p>
                                    {coupons.length > 0 ? (
                                        <div className="space-y-1.5">
                                            {coupons.slice(0, 4).map((coupon) => {
                                                const isApplied = appliedCoupons.some(
                                                    (c) => c.code.toUpperCase() === coupon.code.toUpperCase()
                                                );
                                                return (
                                                    <div
                                                        key={coupon.offerId || coupon.code}
                                                        className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${isApplied ?
                                                            "border-[#0BA445] bg-[#E7F9EA]/60" :
                                                            "border-[#EFE8DE] bg-white hover:border-[#B97B00]/40 hover:shadow-sm"
                                                        }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="inline-block rounded-lg border border-dashed border-[#2D3A1B]/30 bg-[#FFF8EF] px-2 py-0.5 text-[10px] font-bold text-[#B97B00]">
                                                                    {coupon.code}
                                                                </span>
                                                                {coupon.discountPercentage && coupon.discountPercentage > 0 ? (
                                                                    <span className="text-[9px] font-bold text-[#0BA445]">
                                                                        {coupon.discountPercentage}% OFF
                                                                    </span>
                                                                ) : coupon.flatDiscount && coupon.flatDiscount > 0 ? (
                                                                    <span className="text-[9px] font-bold text-[#0BA445]">
                                                                        ₹{coupon.flatDiscount} OFF
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                            <p className="text-[10px] text-[#6F7786] mt-0.5 truncate">
                                                                {coupon.desc}
                                                            </p>
                                                            {coupon.minOrder && (
                                                                <p className="text-[8px] text-[#A2AAB7] mt-0.5">
                                                                    Min. {coupon.minOrder}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {isApplied ? (
                                                            <div className="flex items-center gap-1 ml-2 shrink-0">
                                                                <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#0BA445]">
                                                                    <Check size={11} className="stroke-[3]" /> Applied
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeCoupon(coupon.offerId, coupon.code)}
                                                                    className="text-[9px] font-bold text-red-500 hover:underline ml-0.5 cursor-pointer"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => applyCoupon(coupon.code)}
                                                                disabled={couponLoading}
                                                                className="ml-2 shrink-0 rounded-lg border border-[#2D3A1B]/30 px-2.5 py-0.5 text-[9px] font-bold text-[#2D3A1B] hover:bg-[#FFF8EF] hover:border-[#B97B00] transition-colors cursor-pointer bg-white"
                                                            >
                                                                Apply
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {coupons.length > 4 && (
                                                <p className="text-[9px] text-[#A2AAB7] text-center pt-0.5">
                                                    +{coupons.length - 4} more coupons available
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-2 text-[11px] text-[#A2AAB7]">
                                            No coupons available right now
                                        </div>
                                    )}
                                </div>

                                {/* Applied coupons summary - Always visible with fixed height placeholder */}
                                <div className={`rounded-xl p-2.5 border ${appliedCoupons.length > 0 ? 'bg-[#E7F9EA] border-[#B7E4C7]' : 'bg-gray-50 border-gray-200'}`}>
                                    <p className="text-[8px] font-bold text-[#0BA445] uppercase tracking-[0.1em] mb-1.5">
                                        Applied Coupons
                                    </p>
                                    {appliedCoupons.length > 0 ? (
                                        <div className="space-y-1">
                                            {appliedCoupons.map((c) => (
                                                <div key={c.code} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <Check size={11} className="text-[#0BA445] stroke-[3]" />
                                                        <span className="text-[11px] font-bold text-[#2F241C]">{c.code}</span>
                                                        <span className="text-[9px] text-[#0BA445] font-semibold">
                                                            -₹{(c.calculatedDiscount || 0).toLocaleString("en-IN")}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCoupon(c.offerId, c.code)}
                                                        className="text-[9px] font-bold text-red-500 hover:underline cursor-pointer"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-0.5 text-[10px] text-[#A2AAB7]">
                                            No coupons applied yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Button */}
            <div className="px-6 py-5 bg-[#FAF7F0] border-t border-[#F5EEE3]">
                <Link
                    href="/checkout"
                    className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-[#B97B00] text-[14px] font-bold text-white hover:bg-[#A06A00] transition-all shadow-lg shadow-amber-900/15 hover:shadow-amber-900/25 active:scale-[0.98]"
                >
                    <Lock size={16} className="fill-white stroke-[2.5]" />
                    PROCEED TO CHECKOUT
                </Link>

                {/* Trust row */}
                <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-[#9B8B76]">
                    <span className="flex items-center gap-1.5">
                        <Truck size={13} className="text-[#B97B00]" />
                        Free delivery above ₹2000
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[#149447]" />
                        Secure checkout
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-[#149447]" />
                        100% pure honey
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Trust Badges ─────────────────────────────────────────────────────

export function TrustBadges() {
    return null;
}

// ─── NEED HELP PANEL ──────────────────────────────────────────────────
// Now a presentational component — location/loading are passed in as props
// from the parent Cart component, so it can be rendered twice (desktop +
// mobile position) WITHOUT triggering duplicate API calls.

function HelpPanel({
    location,
    loading,
}: {
    location: LocationData | null;
    loading: boolean;
}) {
    return (
        <div className="w-full box-border flex items-center justify-between gap-4 px-1 pb-2">
            <div className="flex-1 space-y-3">
                <h2 className="text-[18px] font-bold text-[#2F241C]">Need help?</h2>
                <div className="space-y-2 text-[14px] text-[#6F7786]">
                    <p className="flex items-center gap-3">
                        <Phone size={16} className="text-[#2D3A1B] shrink-0" />
                        <span className="font-medium text-[#2F241C] whitespace-nowrap">
                            {loading ? "Loading..." : location?.phone || "+91 98765 43210"}
                        </span>
                    </p>
                    <p className="flex items-center gap-3">
                        <Mail size={16} className="text-[#2D3A1B] shrink-0" />
                        <span className="font-medium text-[#2F241C] break-all">
                            {loading ? "Loading..." : location?.email || "connect@honeyveda.in"}
                        </span>
                    </p>
                    <p className="flex items-center gap-3">
                        <Clock size={16} className="text-[#2D3A1B] shrink-0" />
                        <span className="font-medium text-[#2F241C] whitespace-nowrap">
                            {loading ? "Loading..." : location?.phone_timing || "Mon - Sat : 9AM - 6PM"}
                        </span>
                    </p>
                </div>
            </div>
            <div className="relative w-[100px] h-[90px] shrink-0 hidden sm:block">
                <Image
                    src="/need.png"
                    alt="Honey illustration"
                    fill
                    className="object-contain object-right-bottom"
                />
            </div>
        </div>
    );
}