"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Heart,
  Lock,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Truck,
  Mail,
  Clock,
  Tag,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ProductCard from "@/components/Productcard";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";

const freeDeliveryTarget = 2000;

const paymentIcons = {
  VISA: "/visa.png",
  RuPay: "/rupay.png",
  UPI: "/upi.png",
  Paytm: "/paytm.png",
  "G Pay": "/gpay.png",
  PhonePe: "/phonepe.png",
  mastercard: "/mastercard.png",
  SBI: "/sbi.png",
};

const coupons = [
  { code: "WELCOME100", desc: "Save ₹100 on orders above ₹999", minOrder: "₹999" },
  { code: "FREESHIP", desc: "Free Delivery above ₹499", minOrder: "₹499" },
  { code: "HONEY20", desc: "Get 20% OFF up to ₹300", minOrder: "₹100" },
];

export default function Cart() {
  const router = useRouter();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartProducts = allProducts
    .filter((product) => cartItems[product.id] > 0)
    .map((product) => ({ ...product, quantity: cartItems[product.id] }));
  const visibleProducts =
    cartProducts.length > 0
      ? cartProducts
      : allProducts.slice(0, 2).map((product) => ({ ...product, quantity: 1 }));
  const subtotal = visibleProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );
  const saved = visibleProducts.reduce(
    (sum, product) =>
      sum + Math.max(product.oldPrice - product.price, 0) * product.quantity,
    0,
  );
  const recommendations = allProducts.slice(2, 5);

  return (
    <main className="bg-[#FFF8EF] py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
        <nav className="mb-6 text-sm text-[#7B8493]">
          <span className="font-medium text-[#2F241C]">Home</span> &gt;{" "}
          <span className="font-semibold text-[#D89A1B]">Cart</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
          {/* LEFT */}
          <section>
            <h1 className="text-[34px] font-bold">
              Your Cart <span className="text-[#D89A1B]">({visibleProducts.length})</span>
            </h1>

            <FreeDeliveryBar subtotal={subtotal} />

            <div className="mt-14 hidden grid-cols-[1fr_120px_160px_100px] px-5 text-[15px] font-semibold uppercase tracking-[0.08em] text-[#30303A] md:grid">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="mt-4 space-y-5">
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid gap-4 rounded bg-white px-5 py-5 md:grid-cols-[1fr_120px_160px_100px] md:items-center"
                >
                  <div className="flex gap-5">
                    <div className="relative h-24 w-24 overflow-hidden rounded bg-[#FFF8EF]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h2 className="text-[17px] font-bold">{product.title}</h2>
                      <p className="mt-1 text-[12px] text-[#7B8493]">
                        {product.weight.split(" - ")[0]} - Raw & Unfiltered
                      </p>
                      <span className="mt-2 inline-flex rounded-full bg-[#E7F9EA] px-3 py-1 text-[10px] font-bold text-[#149447]">
                        100% Raw & Unfiltered
                      </span>
                      <div className="mt-2 flex gap-4 text-[11px] text-[#7B8493]">
                        <button type="button" className="flex items-center gap-1 hover:text-[#D89A1B] transition-colors">
                          <Heart size={12} /> Move to Wishlist
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product, -product.quantity)}
                          className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[20px] font-bold text-[#D89A1B]">₹{product.price}</p>
                  <QuantityControl
                    quantity={product.quantity}
                    onMinus={() => updateQuantity(product, -1)}
                    onPlus={() => updateQuantity(product, 1)}
                  />
                  <p className="text-[20px] font-bold text-[#D89A1B]">₹{product.price * product.quantity}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-8 text-[22px] font-semibold">You May Also Like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((item) => (
                <div key={item.id} className="h-full">
                  <ProductCard
                    badge={item.badge}
                    image={item.image}
                    title={item.title}
                    subtitle={item.subtitle}
                    weight={item.weight}
                    price={item.price}
                    oldPrice={item.oldPrice}
                    discount={item.discount}
                    rating={item.rating}
                    reviews={item.reviews}
                    quantity={cartItems[item.id] ?? 0}
                    onAddToCart={() => addToCart(item)}
                    onIncrement={() => updateQuantity(item, 1)}
                    onDecrement={() => updateQuantity(item, -1)}
                    onOpenDetails={() => router.push(`/shop/products/${item.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT - Order Summary */}
          <aside className="space-y-6">
            <OrderSummaryWithCoupons subtotal={subtotal} saved={saved} />
            <PaymentPanel />
            <HelpPanel />
          </aside>
        </div>
      </div>
    </main>
  );
}

export function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);
  
  return (
    <div className="mt-5 rounded-[10px] border border-[#F0DDC4] bg-white px-6 py-5">
      <p className="text-[13px] text-[#4C5362]">
        Yay! You are ₹{remaining} away from FREE delivery!
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8EBEF]">
        <div
          className="h-full rounded-full bg-[#D89A1B] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[#A2AAB7]">
        <span>₹0</span>
        <span>₹{freeDeliveryTarget}</span>
      </div>
    </div>
  );
}

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
    <div className="inline-grid h-9 w-[94px] grid-cols-3 items-center rounded-md border border-[#DFE4EA] bg-[#FBFCFD] text-center">
      <button 
        type="button" 
        onClick={onMinus} 
        className="flex h-full items-center justify-center rounded-l-md transition-colors hover:bg-gray-100"
      >
        <Minus size={14} />
      </button>
      <span className="font-bold text-[#2F241C]">{quantity}</span>
      <button 
        type="button" 
        onClick={onPlus} 
        className="flex h-full items-center justify-center rounded-r-md transition-colors hover:bg-gray-100"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// -------- ORDER SUMMARY WITH COUPON DROPDOWN --------
export function OrderSummaryWithCoupons({
  subtotal,
  saved,
}: {
  subtotal: number;
  saved: number;
}) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  const handleApplyCoupon = (code: string) => {
    setAppliedCoupon(code);
    setCouponCode("");
    setIsCouponOpen(false);
  };

  return (
    <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <h2 className="text-[20px] font-bold">Order Summary</h2>
      
      {/* Summary Rows */}
      <div className="mt-5 space-y-3 text-[14px] text-[#6F7786]">
        <div className="flex justify-between">
          <span>Subtotal (2 items)</span>
          <strong className="text-[#1F2937]">₹{subtotal.toLocaleString("en-IN")}</strong>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <strong className="text-[#0BA445]">FREE</strong>
        </div>
        <div className="flex justify-between">
          <span>You Save</span>
          <strong className="text-[#0BA445]">- ₹{saved}</strong>
        </div>
      </div>

      <hr className="my-5 border-[#EEF1F4]" />

      {/* Apply Coupon - WITH DROPDOWN */}
      <div>
        {/* Coupon Header with Toggle */}
        <button
          onClick={() => setIsCouponOpen(!isCouponOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <p className="text-[14px] font-bold text-[#2F241C]">Apply Coupon</p>
          {isCouponOpen ? (
            <ChevronUp size={18} className="text-[#6F7786]" />
          ) : (
            <ChevronDown size={18} className="text-[#6F7786]" />
          )}
        </button>

        {/* Coupon Dropdown Content */}
        {isCouponOpen && (
          <div className="mt-3 space-y-3">
            {/* Input + Apply */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#D89A1B] bg-white"
              />
              <button 
                onClick={() => couponCode && handleApplyCoupon(couponCode)}
                className="bg-[#D89A1B] text-white px-7 py-2.5 rounded-lg text-sm font-bold hover:bg-[#C98500] transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Available Coupons */}
            <div>
              <p className="text-[10px] font-bold text-[#6F7786] uppercase tracking-[0.08em] mb-2">
                AVAILABLE COUPONS
              </p>
              <div className="space-y-2">
                {coupons.map((coupon) => (
                  <div 
                    key={coupon.code}
                    className={`border rounded-xl p-3 transition-all ${
                      appliedCoupon === coupon.code 
                        ? "border-[#D89A1B] bg-[#FFF8EF]" 
                        : "border-gray-200 hover:border-[#D89A1B]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[14px] text-[#2F241C]">{coupon.code}</span>
                          {appliedCoupon === coupon.code && (
                            <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check size={9} /> Applied
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6F7786] mt-0.5">{coupon.desc}</p>
                        <p className="text-[9px] text-[#9AA3AF] mt-0.5">Min order {coupon.minOrder}</p>
                      </div>
                      <button
                        onClick={() => handleApplyCoupon(coupon.code)}
                        disabled={appliedCoupon === coupon.code}
                        className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-colors ${
                          appliedCoupon === coupon.code
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-[#D89A1B] border border-[#D89A1B] hover:bg-[#FFF8EF]"
                        }`}
                      >
                        {appliedCoupon === coupon.code ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="my-5 border-[#EEF1F4]" />

      {/* Total */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[20px] font-bold">Total</p>
          <p className="text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
        </div>
        <p className="text-[26px] font-bold">₹{subtotal.toLocaleString("en-IN")}</p>
      </div>

      {/* Proceed to Checkout */}
      <Link
        href="/checkout"
        className="mt-6 flex h-[56px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#C98500] text-[16px] font-semibold text-white hover:bg-[#B97B00] transition-all"
      >
        <Lock size={18} />
        PROCEED TO CHECKOUT
      </Link>

      {/* ShudhVeda Promise */}
      <div className="mt-6 rounded-[16px] border border-[#D7F3D9] bg-[#FAFFF6] px-5 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/drip.png"
            alt="Promise"
            width={22}
            height={22}
            className="shrink-0"
          />
          <div>
            <h3 className="text-[16px] font-semibold text-[#187A37]">
              ShudhVeda Promise
            </h3>
            <p className="text-[13px] text-[#3F3F3F]">
              Pure honey, delivered with care.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <TrustBadges />
    </div>
  );
}

export function TrustBadges() {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[9px] font-bold text-[#2D3A1B]">
      <span className="rounded-lg bg-white p-2.5 shadow-sm border border-gray-100">
        <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        Secure Checkout
      </span>
      <span className="rounded-lg bg-white p-2.5 shadow-sm border border-gray-100">
        <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        Easy Returns
      </span>
      <span className="rounded-lg bg-white p-2.5 shadow-sm border border-gray-100">
        <Truck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        Fast Delivery
      </span>
    </div>
  );
}

function PaymentPanel() {
  return (
    <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <h2 className="text-[18px] font-bold">We Accept</h2>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {Object.entries(paymentIcons).map(([name, path]) => (
          <div
            key={name}
            className="flex h-10 items-center justify-center rounded-md border border-[#EEF1F4] bg-[#FBFAF8]"
          >
            <Image
              src={path}
              alt={name}
              width={70}
              height={28}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpPanel() {
  return (
    <div className="relative w-full rounded-[22px] border border-[#F2EFE9] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      <h2 className="text-[18px] font-bold">Need help?</h2>
      <div className="mt-3 space-y-2 text-[14px] text-[#6F7786]">
        <p className="flex items-center gap-2">
          <Phone size={15} className="text-[#D89A1B]" /> +91 98765 43210
        </p>
        <p className="flex items-center gap-2">
          <Mail size={15} className="text-[#D89A1B]" /> connect@shudhveda.in
        </p>
        <p className="flex items-center gap-2">
          <Clock size={15} className="text-[#D89A1B]" /> Mon - Sat : 9AM - 7PM
        </p>
      </div>
      <div className="absolute -bottom-4 -right-2 opacity-100">
        <Image
          src="/need.png"
          alt="Honey illustration"
          width={180}
          height={60}
          className="object-contain"
        />
      </div>
    </div>
  );
}