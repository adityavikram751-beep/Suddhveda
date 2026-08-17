"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
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
import { API_BASE_URL, getStoredSession } from "@/lib/auth";

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

    useEffect(() => {
        if (!getStoredSession()) {
            router.replace("/login?redirect=/cart");
        }
    }, [router]);

    const {
        cartItems,
        addToCart,
        updateQuantity,
        updateCustomQuantity,
        removeItem,
        isLoading,
    } = useCart();

    const cartProducts = Object.values(cartItems);
    const [unselectedItemIds, setUnselectedItemIds] = useState<string[]>([]);

    const isItemSelected = (cartItemId: string) => !unselectedItemIds.includes(cartItemId);

    const toggleSelectItem = (cartItemId: string) => {
        setUnselectedItemIds((prev) =>
            prev.includes(cartItemId)
                ? prev.filter((id) => id !== cartItemId)
                : [...prev, cartItemId]
        );
    };

    const toggleSelectAll = () => {
        const allIds = cartProducts.map((p) => p.cartItemId);
        setUnselectedItemIds((prev) => (prev.length === 0 ? allIds : []));
    };

    const selectedProducts = cartProducts.filter((p) => isItemSelected(p.cartItemId));

    const recommendationScrollerRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    // Observe footer and toggle sticky behavior for the sidebar
    useEffect(() => {
        if (typeof window === "undefined") return;
        const footer = document.querySelector("footer");
        if (!footer) return;
        const obs = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                setIsFooterVisible(!!(e && (e.isIntersecting || e.intersectionRatio > 0)));
            },
            { threshold: 0 }
        );
        obs.observe(footer);
        return () => obs.disconnect();
    }, []);

    const subtotal = selectedProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );
    const saved = selectedProducts.reduce(
        (sum, product) =>
            sum +
            (product.type === "NORMAL"
                ? Math.max((product.oldPrice || 0) - product.price, 0) * product.quantity
                : 0),
        0
    );

    type ApiProduct = {
        _id: string;
        product_name: string;
        brand?: string;
        categoryId?: { category_name?: string };
        category?: { category_name?: string } | string;
        categoryName?: string;
        image?: { image_url?: string };
        imageDocumentId?: { image_url?: string; is_primary?: boolean }[];
        variantDocumentId?: { _id: string; weight: number; price: number; mrp?: number; unit?: string }[];
    };

    const [recommendations, setRecommendations] = useState<ApiProduct[]>([]);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Track selected variants for each recommendation product
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

    // Location data for Need Help panel
    const [location, setLocation] = useState<LocationData | null>(null);
    const [locationLoading, setLocationLoading] = useState(true);

    // Fetch recommendations
    useEffect(() => {
        (async () => {
            try {
                const data = await authFetch(`${API_BASE_URL}/api/products`);
                const list: ApiProduct[] =
                    data.data || data.products || data.items || (Array.isArray(data) ? data : []);
                setRecommendations(list);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        })();
    }, []);

    useEffect(() => {
        if (recommendations.length <= 1) return;

        const timer = window.setInterval(() => {
            recommendationScrollerRefs.current.forEach((scroller) => {
                if (!scroller || scroller.offsetParent === null) return;

                const firstCard = scroller.querySelector<HTMLElement>("[data-recommendation-card]");
                const gap = 24;
                const step = firstCard ? firstCard.offsetWidth + gap : scroller.clientWidth;
                const isAtEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 8;

                scroller.scrollTo({
                    left: isAtEnd ? 0 : scroller.scrollLeft + step,
                    behavior: "smooth",
                });
            });
        }, 3000);

        return () => window.clearInterval(timer);
    }, [recommendations.length]);

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

    // Fetch location/help info
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
                `${API_BASE_URL}/api/wishlist/${isWishlisted ? "remove" : "add"}/${productId}`,
                {
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

    // Reusable "You May Also Like" block
    const renderRecommendations = (scrollerIndex: number) => (
        <div className="mt-8">
            <h2 className="font-serif text-[22px] font-extrabold text-[#593102]">You May Also Like</h2>
            <div
                ref={(node) => {
                    recommendationScrollerRefs.current[scrollerIndex] = node;
                }}
                className="mt-5 flex w-full max-w-full gap-0 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {recommendations.map((item) => {
                    const variants = item.variantDocumentId || [];
                    const selectedVariantId =
                        selectedVariants[item._id] || (variants[0]?._id ?? "");

                    const currentVariant =
                        variants.find((v) => v._id === selectedVariantId) || variants[0];

                    const primaryImage =
                        item.imageDocumentId?.find((img) => img.is_primary)?.image_url ||
                        item.imageDocumentId?.find((img) => img.image_url)?.image_url ||
                        item.image?.image_url ||
                        "/placeholder.png";
                    const categoryName =
                        item.categoryId?.category_name ||
                        (typeof item.category === "string" ? item.category : item.category?.category_name) ||
                        item.categoryName;

                    return (
                        <div
                            key={item._id}
                            data-recommendation-card
                            className="w-full min-w-full sm:min-w-0 sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] shrink-0 snap-center flex flex-col h-full mx-auto px-1 sm:px-0"
                        >
                            <ProductCardShop
                                badge={categoryName}
                                image={primaryImage}
                                title={item.product_name}
                                subtitle={categoryName}
                                weight={
                                    currentVariant
                                        ? `${currentVariant.weight}${currentVariant.unit || "g"}`
                                        : ""
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
                                onIncrement={() => { }}
                                onDecrement={() => { }}
                                onOpenDetails={() => router.push(`/shop/products/${item._id}`)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <main className="bg-[#FFF8EF] min-h-screen py-10 text-[#2F241C]">
            <div className="mx-auto max-w-[1410px] px-4 sm:px-6">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] items-start">
                    {/* LEFT SECTION */}
                    <section className="min-w-0">
                        <div className="inline-flex items-center gap-2 bg-[#EA580C]/10 border border-[#EA580C]/30 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase text-[#EA580C] tracking-[0.18em] shadow-xs mb-2">
                            <span>YOUR SHOPPING CART</span>
                        </div>
                        <h1 className="text-[30px] sm:text-[36px] font-serif font-extrabold text-[#201A18] tracking-tight">
                            Your <span className="text-[#EA580C]">Cart</span>{" "}
                            <span className="inline-flex items-center justify-center rounded-full bg-[#EA580C]/10 border border-[#EA580C]/30 px-3 py-0.5 text-sm font-black text-[#EA580C] align-middle ml-1">
                                ({cartProducts.length})
                            </span>
                        </h1>

                        <div className="mt-8 flex items-center justify-between px-6 py-3 rounded-xl border border-[#EADCC9] bg-[#FAF5EC] text-xs font-black uppercase tracking-[0.12em] text-[#593102]">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={cartProducts.length > 0 && unselectedItemIds.length === 0}
                                    onChange={toggleSelectAll}
                                    className="h-4.5 w-4.5 accent-[#EA580C] rounded cursor-pointer shrink-0"
                                />
                                <span>Product</span>
                            </div>
                            <div className="hidden md:grid grid-cols-3 gap-12 text-right min-w-[360px]">
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>Total</span>
                            </div>
                        </div>

                        {/* Cart items list with max-height scroll (shows 1.5 cards, rest scroll) */}
                        <div className="mt-4 space-y-4 max-h-[360px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {isLoading ? (
                                <div className="rounded-2xl border-2 border-[#EADCC9] bg-white px-5 py-12 text-center text-[#6E5D4F] font-semibold">
                                    Loading your cart...
                                </div>
                            ) : cartProducts.length === 0 ? (
                                <div className="rounded-2xl border-2 border-dashed border-[#EADCC9] bg-white px-5 py-12 text-center text-[#6E5D4F] font-semibold">
                                    Your cart is currently empty.
                                </div>
                            ) : (
                                cartProducts.map((product) => {
                                    const selected = isItemSelected(product.cartItemId);
                                    return (
                                        <div
                                            key={product.cartItemId}
                                            className={`group grid gap-4 rounded-2xl border-2 p-3.5 sm:p-5 transition-all md:grid-cols-[1fr_110px_140px_110px] md:items-center overflow-hidden ${
                                                selected
                                                    ? "border-[#D49313] bg-white shadow-xs"
                                                    : "border-[#EADCC9]/70 bg-white/60 opacity-60"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() => toggleSelectItem(product.cartItemId)}
                                                    className="h-5 w-5 accent-[#EA580C] rounded cursor-pointer shrink-0"
                                                />
                                                <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-xl bg-[#FAF5EC] border border-[#EADCC9]">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.productName}
                                                        fill
                                                        className="object-contain p-1.5"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
                                                    <h2 className="font-serif text-[15px] sm:text-[17px] font-extrabold leading-snug text-[#593102] truncate">
                                                        {product.productName}
                                                    </h2>
                                                    {product.type === "NORMAL" && product.categoryName && (
                                                        <p className="text-xs font-semibold text-[#6E5D4F] truncate">
                                                            {product.categoryName}
                                                        </p>
                                                    )}
                                                    <p className="text-xs font-semibold text-[#6E5D4F] truncate">
                                                        {product.type === "NORMAL"
                                                            ? product.weight
                                                            : product.customMessage || "Gift box"}
                                                    </p>
                                                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-emerald-800 mt-0.5">
                                                        <Check size={10} className="stroke-[3]" />
                                                        Raw &amp; Unfiltered
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(product.cartItemId)}
                                                        className="mt-2.5 flex w-fit items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200/80 px-3 py-1.5 text-[12px] sm:text-[13px] font-bold text-red-600 transition-all cursor-pointer shadow-2xs active:scale-95"
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-[#EADCC9]/50 pt-2.5 md:border-t-0 md:pt-0 md:block">
                                                <span className="text-[11px] font-bold text-[#8D7F73] uppercase md:hidden">Price</span>
                                                <p className="font-serif text-[15px] sm:text-[17px] font-extrabold text-[#593102]">
                                                    ₹{product.price}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-start">
                                                <span className="text-[11px] font-bold text-[#8D7F73] uppercase md:hidden">Quantity</span>
                                                <QuantityControl
                                                    quantity={product.quantity}
                                                    onMinus={() =>
                                                        product.type === "NORMAL"
                                                            ? updateQuantity(product.productId, product.variantId, -1)
                                                            : updateCustomQuantity(product.cartItemId, -1)
                                                    }
                                                    onPlus={() =>
                                                        product.type === "NORMAL"
                                                            ? updateQuantity(product.productId, product.variantId, 1)
                                                            : updateCustomQuantity(product.cartItemId, 1)
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between border-t border-[#EADCC9]/50 pt-2.5 md:border-t-0 md:pt-0 md:block">
                                                <span className="text-[11px] font-bold text-[#8D7F73] uppercase md:hidden">Total</span>
                                                <p className="font-serif text-[16px] sm:text-[19px] font-extrabold text-[#593102]">
                                                    ₹{product.price * product.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Desktop Recommendations */}
                        <div className="hidden lg:block">
                            {renderRecommendations(0)}
                        </div>
                    </section>

                    {/* RIGHT SIDEBAR */}
                    <aside
                        className={`w-full space-y-8 box-border lg:max-w-[420px] ${isFooterVisible ? "lg:static" : "lg:sticky lg:top-16"
                            } self-end`}
                    >
                        <OrderSummaryWithCoupons
                            subtotal={subtotal}
                            saved={saved}
                            itemCount={selectedProducts.length}
                            selectedProducts={selectedProducts}
                        />
                        {/* Desktop Help Panel */}
                        <div className="hidden lg:block">
                            <HelpPanel location={location} loading={locationLoading} />
                        </div>
                    </aside>
                </div>

                {/* Mobile Recommendations + Help Panel */}
                <div className="lg:hidden mt-10 space-y-10">
                    {renderRecommendations(1)}
                    <HelpPanel location={location} loading={locationLoading} />
                </div>
            </div>
        </main>
    );
}

// ─── Free Delivery Bar ──────────────────────────────────────────────────

export function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
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
                className="flex h-full items-center justify-center rounded-l-full text-[#7A6A52] transition-colors hover:bg-[#FFF3DF] hover:text-[#B97B00] cursor-pointer"
            >
                <Minus size={14} />
            </button>
            <span className="font-bold text-[#2F241C]">{quantity}</span>
            <button
                type="button"
                onClick={onPlus}
                className="flex h-full items-center justify-center rounded-r-full text-[#7A6A52] transition-colors hover:bg-[#FFF3DF] hover:text-[#B97B00] cursor-pointer"
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
    selectedProducts = [],
}: {
    subtotal: number;
    saved: number;
    itemCount: number;
    selectedProducts?: any[];
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
                const rawList =
                    data.data || data.coupons || (Array.isArray(data) ? data : []);
                const list: ApiCoupon[] = rawList
                    .filter((c: any) => c.isActive !== false)
                    .map((c: any) => {
                        const typeUpper = (c.discountType || c.type || "").toUpperCase();
                        const val = Number(c.discountValue ?? c.value ?? c.discount ?? 0);

                        const isPerc = typeUpper === "PERCENTAGE" || typeUpper === "PERCENT";
                        const isFlat = typeUpper === "FLAT" || typeUpper === "AMOUNT" || typeUpper === "FIXED";

                        const discountPercentage = isPerc
                            ? val || c.discountPercentage || c.percentage || 0
                            : c.discountPercentage || c.percentage || 0;

                        const flatDiscount = isFlat
                            ? val || c.discountAmount || c.amount || 0
                            : c.discountAmount || c.amount || 0;

                        return {
                            offerId: c._id || c.offerId,
                            code: c.couponCode || c.code,
                            desc: c.title || c.description || "",
                            minOrder: c.minimumOrderAmount ? `₹${c.minimumOrderAmount}` : "",
                            isAvailable: true,
                            discountPercentage,
                            flatDiscount,
                        };
                    });
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
            const serverDiscount =
                cartData?.couponDiscount ?? cartData?.discountAmount ?? cartData?.discount ?? 0;
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

            const sumDiscount = updatedList.reduce(
                (acc, item) => acc + (item.calculatedDiscount || 0),
                0
            );

            if (updatedList.length > 0) {
                localStorage.setItem("applied_coupons", JSON.stringify(updatedList));
                localStorage.setItem(
                    "applied_coupon",
                    JSON.stringify({
                        discount: sumDiscount,
                        coupon: { code: updatedList.map((u) => u.code).join(", ") },
                    })
                );
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
            const selectedItem = selectedProducts[0];
            const targetItemId = selectedItem?.cartItemId || "";
            const targetItemType = selectedItem?.type || "NORMAL";

            const data = await authFetch(`${API_BASE_URL}/api/coupon/apply`, {
                method: "POST",
                body: JSON.stringify({
                    couponCode: upperCode,
                    itemType: targetItemType,
                    itemId: targetItemId,
                }),
            });

            let calculatedDiscount = 0;
            const resDiscount =
                data.discount ??
                data.discountAmount ??
                data.discountValue ??
                data.data?.discount ??
                data.data?.discountAmount ??
                data.data?.discountValue ??
                data.data?.calculatedDiscount;

            if (resDiscount !== undefined && resDiscount !== null && Number(resDiscount) > 0) {
                calculatedDiscount = typeof resDiscount === "string" ? parseFloat(resDiscount) || 0 : Number(resDiscount);
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
        } catch (err: any) {
            const errorMsg = err.message || "";
            if (
                errorMsg.toLowerCase().includes("already used") ||
                errorMsg.toLowerCase().includes("already applied")
            ) {
                const couponObj: ApiCoupon = {
                    offerId: matched?.offerId || upperCode,
                    code: matched?.code || upperCode,
                    desc: matched?.desc || "Applied Coupon",
                    minOrder: matched?.minOrder || "",
                    isAvailable: true,
                    discountPercentage: matched?.discountPercentage,
                    flatDiscount: matched?.flatDiscount,
                    calculatedDiscount: matched?.discountPercentage
                        ? Math.round((subtotal * matched.discountPercentage) / 100)
                        : matched?.flatDiscount || 0,
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
        const matchedCoupon = appliedCoupons.find(
            (c) => c.code.toUpperCase() === codeToRemove?.toUpperCase()
        );
        const idToRemove = targetOfferId || matchedCoupon?.offerId || codeToRemove;

        if (!codeToRemove) return;

        const filtered = appliedCoupons.filter(
            (c) => c.code.toUpperCase() !== codeToRemove.toUpperCase()
        );
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
        } catch (err) {
            console.error("Remove coupon error:", err);
        }
    };

    // Net Total Price
    const total = Math.max(subtotal - totalDiscount, 0);

    return (
        <div className="w-full rounded-3xl border-2 border-[#EADCC9]/80 bg-white/95 backdrop-blur-md shadow-xs flex flex-col p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-[18px] sm:text-[20px] font-extrabold text-[#593102]">
                    Order Summary
                </h2>
                <span className="inline-flex items-center justify-center rounded-full bg-[#FAF0DC] border border-[#D49313]/40 px-2.5 py-0.5 text-xs font-black text-[#593102]">
                    {itemCount} items
                </span>
            </div>

            <div className="mt-4 space-y-4">
                {/* Price breakdown */}
                <div className="space-y-2.5 text-[14px]">
                    <div className="flex justify-between py-1">
                        <span className="text-[#6E5D4F] font-semibold">Subtotal</span>
                        <span className="font-serif font-extrabold text-[#593102]">
                            ₹{subtotal.toLocaleString("en-IN")}
                        </span>
                    </div>
                    {saved > 0 && (
                        <div className="flex justify-between py-1">
                            <span className="text-[#6E5D4F] font-semibold">You Save</span>
                            <span className="font-serif font-extrabold text-emerald-700">
                                - ₹{saved.toLocaleString("en-IN")}
                            </span>
                        </div>
                    )}
                    {totalDiscount > 0 && (
                        <div className="mt-2 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/80 p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white text-[10px] font-bold">
                                        ✓
                                    </span>
                                    <span className="text-[12px] font-bold text-emerald-900">
                                        Coupon Applied
                                    </span>
                                </div>
                                <span className="font-serif text-[13px] font-extrabold text-emerald-700">
                                    - ₹{totalDiscount.toLocaleString("en-IN")}
                                </span>
                            </div>
                            {appliedCoupons.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {appliedCoupons.map((coupon) => (
                                        <span
                                            key={coupon.code}
                                            className="inline-flex rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200"
                                        >
                                            {coupon.code}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-[#EADCC9]/60"></div>

                <div className="flex items-end justify-between border-t border-[#EADCC9]/60 pt-4">
                    <div>
                        <p className="font-serif text-[18px] sm:text-[21px] font-extrabold text-[#593102]">
                            Total
                        </p>
                        <p className="text-[10px] text-[#8D7F73] font-medium">(Inclusive of all taxes)</p>
                    </div>
                    <p className="font-serif text-[24px] sm:text-[28px] font-extrabold text-[#593102]">
                        ₹{total.toLocaleString("en-IN")}
                    </p>
                </div>
            </div>

            {/* Coupon Section */}
            <div className="mt-4 border-t border-[#F5EEE3]">
                <button
                    type="button"
                    onClick={() => setIsCouponSectionOpen(!isCouponSectionOpen)}
                    className="flex w-full items-center justify-between px-2 py-3.5 text-[13px] font-bold text-[#593102] hover:bg-[#FAF7F0] transition-colors rounded-xl cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <Gift size={16} className="text-[#D49313]" />
                        Apply Coupons
                        {appliedCoupons.length > 0 && (
                            <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                                {appliedCoupons.length} applied
                            </span>
                        )}
                    </span>
                    {isCouponSectionOpen ? (
                        <ChevronUp size={16} className="text-[#8D7F73]" />
                    ) : (
                        <ChevronDown size={16} className="text-[#8D7F73]" />
                    )}
                </button>

                {isCouponSectionOpen && (
                    <div className="pb-4 pt-1 space-y-3">
                        <div className="max-h-[340px] flex flex-col space-y-3">
                            {/* Input row */}
                            <div className="flex gap-2 shrink-0">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    className="flex-1 rounded-xl border border-[#EADCC9] bg-[#FAF5EC]/50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#593102] placeholder:text-[#8D7F73] focus:border-[#D49313] focus:outline-none focus:ring-2 focus:ring-[#D49313]/20 transition-all"
                                />
                                <button
                                    onClick={() => couponCode && applyCoupon(couponCode)}
                                    disabled={couponLoading}
                                    className="min-w-[90px] rounded-xl bg-gradient-to-r from-[#D49313] to-[#593102] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
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
                                <p className="text-[11px] font-bold text-red-500 shrink-0">{couponError}</p>
                            )}

                            {/* Scrollable content */}
                            <div className="flex-1 overflow-y-auto space-y-3 min-h-0 pr-0.5">
                                {/* Available coupons */}
                                <div>
                                    <p className="text-[10px] font-black text-[#8D7F73] uppercase tracking-[0.1em] mb-2">
                                        Available Coupons
                                    </p>
                                    {coupons.length > 0 ? (
                                        <div className="space-y-2">
                                            {coupons.slice(0, 4).map((coupon) => {
                                                const isApplied = appliedCoupons.some(
                                                    (c) => c.code.toUpperCase() === coupon.code.toUpperCase()
                                                );
                                                return (
                                                    <div
                                                        key={coupon.offerId || coupon.code}
                                                        className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${isApplied
                                                            ? "border-emerald-500 bg-emerald-50/70"
                                                            : "border-[#EADCC9] bg-white hover:border-[#D49313]/60 shadow-2xs"
                                                            }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="inline-block rounded-lg border border-dashed border-[#D49313]/50 bg-[#FAF0DC] px-2 py-0.5 text-[10px] font-black text-[#593102]">
                                                                    {coupon.code}
                                                                </span>
                                                                {coupon.discountPercentage && coupon.discountPercentage > 0 ? (
                                                                    <span className="text-[10px] font-black text-emerald-700">
                                                                        {coupon.discountPercentage}% OFF
                                                                    </span>
                                                                ) : coupon.flatDiscount && coupon.flatDiscount > 0 ? (
                                                                    <span className="text-[10px] font-black text-emerald-700">
                                                                        ₹{coupon.flatDiscount} OFF
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                            <p className="text-[11px] text-[#6E5D4F] font-semibold mt-0.5 truncate">
                                                                {coupon.desc}
                                                            </p>
                                                            {coupon.minOrder && (
                                                                <p className="text-[9px] text-[#8D7F73] font-medium mt-0.5">
                                                                    Min. order {coupon.minOrder}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {isApplied ? (
                                                            <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                                                <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-700">
                                                                    <Check size={12} className="stroke-[3]" /> Applied
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeCoupon(coupon.offerId, coupon.code)}
                                                                    className="text-[10px] font-black text-red-500 hover:underline ml-0.5 cursor-pointer"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => applyCoupon(coupon.code)}
                                                                disabled={couponLoading}
                                                                className="ml-2 shrink-0 rounded-lg border border-[#D49313]/40 px-3 py-1 text-[10px] font-black text-[#593102] hover:bg-[#FAF0DC] transition-colors cursor-pointer bg-white"
                                                            >
                                                                Apply
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {coupons.length > 4 && (
                                                <p className="text-[10px] text-[#8D7F73] font-semibold text-center pt-0.5">
                                                    +{coupons.length - 4} more coupons available
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-2 text-[11px] text-[#8D7F73] font-semibold">
                                            No coupons available right now
                                        </div>
                                    )}
                                </div>

                                {/* Applied coupons summary */}
                                <div
                                    className={`rounded-xl p-2.5 border ${appliedCoupons.length > 0
                                        ? "bg-[#FAF0DC]/70 border-[#D49313]/40"
                                        : "bg-[#FAF5EC]/50 border-[#EADCC9]"
                                        }`}
                                >
                                    <p className="text-[10px] font-black text-[#593102] uppercase tracking-[0.1em] mb-1.5">
                                        Applied Coupons
                                    </p>
                                    {appliedCoupons.length > 0 ? (
                                        <div className="space-y-1.5">
                                            {appliedCoupons.map((c) => (
                                                <div key={c.code} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <Check size={12} className="text-emerald-700 stroke-[3]" />
                                                        <span className="text-[11px] font-black text-[#593102]">
                                                            {c.code}
                                                        </span>
                                                        <span className="text-[10px] text-emerald-700 font-extrabold">
                                                            -₹{(c.calculatedDiscount || 0).toLocaleString("en-IN")}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCoupon(c.offerId, c.code)}
                                                        className="text-[10px] font-black text-red-500 hover:underline cursor-pointer"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-0.5 text-[10px] text-[#8D7F73] font-semibold">
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
            <div className="px-5 py-5 bg-[#FAF5EC]/80 border-t border-[#EADCC9]/80 rounded-b-3xl mt-4">
                <Link
                    href="/checkout"
                    className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#D49313] via-[#8F590A] to-[#593102] hover:from-[#593102] hover:to-[#D49313] text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition-all duration-300 border border-[#FFD700]/30 active:scale-[0.98] cursor-pointer"
                >
                    <Lock size={15} className="fill-white stroke-[2.5]" />
                    PROCEED TO CHECKOUT
                </Link>

                {/* Trust row */}
                <div className="mt-4 flex items-center justify-center gap-5 text-[11px] font-bold text-[#6E5D4F]">
                    <span className="flex items-center gap-1.5">
                        <Truck size={13} className="text-[#D49313]" />
                        Free delivery
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-700" />
                        Secure checkout
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-emerald-700 stroke-[3]" />
                        100% raw &amp; natural honey
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

function HelpPanel({
    location,
    loading,
}: {
    location: LocationData | null;
    loading: boolean;
}) {
    return (
        <div className="w-full box-border flex items-center justify-between gap-4 px-3 py-4 rounded-2xl bg-white/95 border-2 border-[#EADCC9]/80 shadow-xs">
            <div className="flex-1 space-y-2.5">
                <h2 className="font-serif text-[18px] font-extrabold text-[#593102]">Need help?</h2>
                <div className="space-y-1.5 text-[13px] font-semibold text-[#6E5D4F]">
                    <p className="flex items-center gap-2.5">
                        <Phone size={15} className="text-[#D49313] shrink-0" />
                        <span className="text-[#593102] whitespace-nowrap">
                            {loading ? "Loading..." : location?.phone || "+91 98765 43210"}
                        </span>
                    </p>
                    <p className="flex items-center gap-2.5">
                        <Mail size={15} className="text-[#D49313] shrink-0" />
                        <span className="text-[#593102] break-all">
                            {loading ? "Loading..." : location?.email || "connect@honeyveda.in"}
                        </span>
                    </p>
                    <p className="flex items-center gap-2.5">
                        <Clock size={15} className="text-[#D49313] shrink-0" />
                        <span className="text-[#593102] whitespace-nowrap">
                            {loading ? "Loading..." : location?.phone_timing || "Mon - Sat : 9AM - 6PM"}
                        </span>
                    </p>
                </div>
            </div>
            <div className="relative w-[90px] h-[80px] shrink-0 hidden sm:block">
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
