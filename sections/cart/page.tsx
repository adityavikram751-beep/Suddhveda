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
          {/* LEFT SECTION */}
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

          {/* RIGHT SIDEBAR */}
          <aside className="w-full space-y-10 box-border lg:max-w-[420px]">
            <OrderSummaryWithCoupons subtotal={subtotal} saved={saved} />
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

export function OrderSummaryWithCoupons({
  subtotal,
  saved,
}: {
  subtotal: number;
  saved: number;
}) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("FREESHIP");
  const [isCouponOpen, setIsCouponOpen] = useState(true);

  const handleApplyCoupon = (code: string) => {
    setAppliedCoupon(code);
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const appliedCouponData = coupons.find((c) => c.code === appliedCoupon);

  return (
    <div className="w-full space-y-6 box-border">
      {/* Top Prices Section */}
      <div className="bg-transparent px-1 w-full box-border">
        <h2 className="text-[20px] font-bold text-[#2F241C]">Order Summary</h2>
        <div className="mt-4 space-y-3 text-[15px] text-[#6F7786]">
          <div className="flex justify-between">
            <span>Subtotal (2 items)</span>
            <strong className="font-semibold text-[#2F241C]">₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <strong className="font-bold text-[#0BA445]">FREE</strong>
          </div>
          <div className="flex justify-between">
            <span>You Save</span>
            <strong className="font-semibold text-[#0BA445]">- ₹{saved}</strong>
          </div>
        </div>
      </div>

      {/* Coupon Card Box */}
      <div className="rounded-[22px] border border-[#F2EFE9] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] w-full box-border transition-all duration-300">
        <button
          onClick={() => setIsCouponOpen(!isCouponOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <p className="flex items-center gap-2 text-[15px] font-bold text-[#2F241C]">
            <span className="text-[16px] leading-none">🎟️</span>
            Apply Coupon
          </p>
          {isCouponOpen ? (
            <ChevronUp size={18} className="text-[#6F7786]" />
          ) : (
            <ChevronDown size={18} className="text-[#6F7786]" />
          )}
        </button>

        {isCouponOpen && (
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D89A1B] bg-[#FBFCFD]"
              />
              <button
                onClick={() => couponCode && handleApplyCoupon(couponCode)}
                className="bg-[#B97B00] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#A06A00] transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-[#A2AAB7] uppercase tracking-wider">
                AVAILABLE COUPONS
              </p>

              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="flex items-center justify-between rounded-xl border border-dashed border-[#D89A1B]/60 p-3 bg-white"
                >
                  <div className="flex-1">
                    <div className="inline-block rounded border border-dashed border-[#D89A1B] bg-[#FFF8EF] px-2 py-0.5 text-[12px] font-bold text-[#B97B00]">
                      {coupon.code}
                    </div>
                    <p className="text-[12px] font-medium text-[#2F241C] mt-1.5">{coupon.desc}</p>
                    <p className="text-[10px] text-[#A2AAB7] mt-0.5">Min. order {coupon.minOrder}</p>
                  </div>

                  {appliedCoupon === coupon.code ? (
                    <span className="flex items-center gap-1 text-[12px] font-bold text-[#0BA445]">
                      <Check size={14} className="stroke-[3]" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyCoupon(coupon.code)}
                      className="text-[12px] font-bold px-4 py-1.5 rounded-lg border border-[#D89A1B] text-[#D89A1B] hover:bg-[#FFF8EF] transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
              ))}
            </div>

            {appliedCouponData && (
              <div className="flex items-center justify-between rounded-xl bg-[#E7F9EA] px-4 py-3 border border-[#B7E4C7]">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0BA445] text-white">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-[#2F241C]">
                      Coupon Applied <span className="text-[#0BA445] ml-1">{appliedCouponData.code}</span>
                    </p>
                    <p className="text-[10px] text-[#6F7786]">FREE DELIVERY</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-[11px] font-bold text-red-500 hover:underline tracking-wider"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checkout Section & Promise */}
      <div className="px-1 space-y-4 w-full box-border">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[22px] font-bold text-[#2F241C]">Total</p>
            <p className="text-[11px] text-[#A2AAB7] mt-0.5">(Inclusive of all taxes)</p>
          </div>
          <p className="text-[26px] font-bold text-[#2F241C]">₹{subtotal.toLocaleString("en-IN")}</p>
        </div>

        <Link
          href="/checkout"
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#B97B00] text-[15px] font-bold text-white hover:bg-[#A06A00] transition-all shadow-md shadow-amber-900/10"
        >
          <Lock size={16} className="fill-white stroke-[2.5]" />
          PROCEED TO CHECKOUT
        </Link>

        {/* ShudhVeda Promise Box */}
        <div className="flex items-center justify-between rounded-xl bg-[#FAFFF6] px-5 py-4 border border-[#D7F3D9] w-full box-border">
          <div>
            <h3 className="text-[14px] font-bold text-[#187A37]">ShudhVeda Promise</h3>
            <p className="text-[12px] text-[#3F3F3F] mt-0.5">Pure honey, delivered with care.</p>
          </div>
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/need.png"
              alt="Honey jar"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <TrustBadges />
      </div>
    </div>
  );
}

export function TrustBadges() {
  return (
    <div>
    
     
    </div>
  );
}

function PaymentPanel() {
  return null;
}

// -------- NEED HELP PANEL (stays within sticky sidebar, always visible while scrolling) --------
function HelpPanel() {
  return (
    <div className="w-full box-border flex items-center justify-between gap-4 px-1">
      <div className="flex-1 space-y-3">
        <h2 className="text-[18px] font-bold text-[#2F241C]">Need help?</h2>
        <div className="space-y-2 text-[14px] text-[#6F7786]">
          <p className="flex items-center gap-3">
            <Phone size={16} className="text-[#D89A1B] shrink-0" />
            <span className="font-medium text-[#2F241C] whitespace-nowrap">+91 98765 43210</span>
          </p>
          <p className="flex items-center gap-3">
            <Mail size={16} className="text-[#D89A1B] shrink-0" />
            <span className="font-medium text-[#2F241C] break-all">connect@honeyveda.in</span>
          </p>
          <p className="flex items-center gap-3">
            <Clock size={16} className="text-[#D89A1B] shrink-0" />
            <span className="font-medium text-[#2F241C] whitespace-nowrap">Mon – Sat : 9AM – 7PM</span>
          </p>
        </div>
      </div>
      {/* Right Side Image Box */}
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