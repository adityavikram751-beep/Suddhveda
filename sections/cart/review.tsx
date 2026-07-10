"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  RotateCcw,
  Leaf,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  Package,
  Check,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts } from "@/lib/shop-data";

const freeDeliveryTarget = 2000;

const steps = [
  { id: 1, title: "Address", subtitle: "Add delivery address" },
  { id: 2, title: "Shipping", subtitle: "Choose shipping method" },
  { id: 3, title: "Payment", subtitle: "Select payment option" },
  { id: 4, title: "Review", subtitle: "Review & place order" },
] as const;

type Address = {
  id: string;
  label: string;
  isDefault: boolean;
  name: string;
  line: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

const defaultAddress: Address = {
  id: "home",
  label: "Home",
  isDefault: true,
  name: "Rahul Sharma",
  line: "123, Green Avenue, Near City Park, Koramangala",
  city: "Bengaluru",
  state: "Karnataka, India",
  pincode: "560034",
  phone: "+91 98765 43210",
};

export default function ReviewPage() {
  const router = useRouter();
  const { cartItems } = useCart();

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

  const total = subtotal;
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  // Mock data - in real app, these would come from state/context
  const address = defaultAddress;
  const shippingMethod = {
    label: "Standard Shipping",
    description: "Delivery in 3-5 business days",
    price: 0,
  };
  const paymentMethod = {
    label: "UPI",
    id: "shudhveda@icici",
  };

  const handleBack = () => {
    router.push("/payment");
  };

  const handlePlaceOrder = () => {
    // Navigate to order confirmation or success page
    router.push("/thank");
  };

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#7B8493]">
          <Link href="/" className="font-medium text-[#2F241C] hover:text-[#D89A1B]">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/cart" className="font-medium text-[#2F241C] hover:text-[#D89A1B]">
            Cart
          </Link>{" "}
          &gt;{" "}
          <Link
            href="/checkout"
            className="font-medium text-[#2F241C] hover:text-[#D89A1B]"
          >
            Checkout
          </Link>{" "}
          &gt;{" "}
          <Link
            href="/checkout/shipping"
            className="font-medium text-[#2F241C] hover:text-[#D89A1B]"
          >
            Shipping
          </Link>{" "}
          &gt;{" "}
          <Link
            href="/checkout/payment"
            className="font-medium text-[#2F241C] hover:text-[#D89A1B]"
          >
            Payment
          </Link>{" "}
          &gt; <span className="font-semibold text-[#D89A1B]">Review</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
          {/* LEFT COLUMN */}
          <section className="flex flex-col gap-6">
            {/* Header */}
            <div className="relative">
              <h1 className="font-serif text-[34px] font-bold">
                Review & Place Order
              </h1>
              <p className="mt-1 text-[14px] text-[#7B8493]">
                Please review your order details and confirm your purchase.
              </p>
              <Image
                src="/honey.png"
                alt="Honey illustration"
                width={110}
                height={80}
                className="absolute right-0 top-0 hidden object-contain sm:block"
              />
            </div>

            {/* Stepper */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white px-6 py-5">
              <div className="flex justify-between items-start">
                {steps.map((step) => {
                  const isActive = step.id === 4;
                  const isDone = step.id < 4;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                          isActive || isDone
                            ? "bg-[#D89A1B] text-white"
                            : "bg-[#F1F2F4] text-[#8A94A6]"
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : step.id}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isActive ? "text-[#D89A1B]" : "text-[#2F241C]"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[10px] text-[#9AA3AF] text-center hidden sm:block">
                        {step.subtitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <h2 className="font-serif text-[19px] font-bold flex items-center gap-2">
                <MapPin size={20} className="text-[#D89A1B]" />
                Delivery Details
              </h2>

              <div className="mt-5 grid sm:grid-cols-2 gap-6">
                {/* Address */}
                <div className="rounded-lg border border-[#EEF1F4] p-4 bg-[#FBFCFD]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold">{address.label}</span>
                    {address.isDefault && (
                      <span className="text-[11px] font-semibold text-[#D89A1B] bg-[#FFF8EF] px-2 py-0.5 rounded">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[14px] text-[#4C5362] leading-relaxed">
                    {address.name}
                    <br />
                    {address.line}
                    <br />
                    {address.city} - {address.pincode}
                    <br />
                    {address.state}
                    <br />
                    {address.phone}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Shipping Method */}
                  <div className="rounded-lg border border-[#EEF1F4] p-4 bg-[#FBFCFD]">
                    <p className="text-[13px] font-semibold flex items-center gap-2">
                      <Truck size={16} className="text-[#D89A1B]" />
                      Shipping Method
                    </p>
                    <p className="mt-2 text-[14px] font-medium">{shippingMethod.label}</p>
                    <p className="text-[13px] text-[#6F7786]">{shippingMethod.description}</p>
                  </div>

                  {/* Payment Method */}
                  <div className="rounded-lg border border-[#EEF1F4] p-4 bg-[#FBFCFD]">
                    <p className="text-[13px] font-semibold flex items-center gap-2">
                      <CreditCard size={16} className="text-[#D89A1B]" />
                      Payment Method
                    </p>
                    <p className="mt-2 text-[14px] font-medium">{paymentMethod.label}</p>
                    <p className="text-[13px] text-[#6F7786]">{paymentMethod.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items in Your Order */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <h2 className="font-serif text-[19px] font-bold flex items-center gap-2">
                <Package size={20} className="text-[#D89A1B]" />
                Items in Your Order ({visibleProducts.length})
              </h2>

              <div className="mt-5 space-y-4">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-lg border border-[#EEF1F4] p-4 bg-[#FBFCFD]"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold">{product.title}</p>
                      <p className="text-[12px] text-[#9AA3AF]">
                        {product.weight.split(" - ")[0]} - Raw & Unfiltered
                      </p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-[12px] text-[#6F7786]">Qty: {product.quantity}</span>
                        <span className="text-[14px] font-bold text-[#D89A1B]">
                          ₹{product.price * product.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#E7F9EA] px-2.5 py-0.5 text-[10px] font-bold text-[#149447]">
                      100% Raw & Unfiltered
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-7">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex h-12 items-center gap-2 rounded-lg border border-[#D3D8DF] px-6 text-[14px] font-semibold text-[#2F241C] hover:bg-[#F5F0EB] transition w-full sm:w-auto justify-center"
                >
                  <ArrowLeft size={16} />
                  Back to Payment
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex h-12 items-center gap-2 rounded-lg bg-[#D18500] px-6 text-[14px] font-bold text-white hover:bg-[#B97100] transition w-full sm:w-auto justify-center"
                >
                  <Check size={16} />
                  Place Order
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN – Order Summary (same as previous pages) */}
          <aside className="flex flex-col h-full">
            <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col h-full">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
                <span className="text-[12px] text-[#9AA3AF]">
                  {visibleProducts.length} Items
                </span>
              </div>

              <div className="mt-5 max-h-[280px] space-y-4 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold">{product.title}</p>
                      <p className="text-[11px] text-[#9AA3AF]">
                        {product.weight.split(" - ")[0]} - Raw & Unfiltered
                      </p>
                      <p className="text-[11px] text-[#9AA3AF]">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <p className="text-[14px] font-bold">₹{product.price}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-[#EEF1F4] pt-5 text-[13px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#1F2937]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
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

              <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
                <div>
                  <p className="text-[21px] font-bold">Total</p>
                  <p className="text-[10px] text-[#9AA3AF]">
                    (Inclusive of all taxes)
                  </p>
                </div>
                <p className="text-[26px] font-bold">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Savings and free delivery progress */}
              <div className="mt-6 rounded-[14px] border border-[#D7F3D9] bg-[#F0FFF4] p-4">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-[#187A37]">
                  <ShieldCheck size={16} /> You&apos;re saving ₹{saved} on this order!
                </p>
                {remaining > 0 && (
                  <>
                    <p className="mt-2 text-[12px] text-[#4C5362]">
                      Add items worth ₹{remaining} more to get FREE delivery!
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DDEFE0]">
                      <div
                        className="h-full rounded-full bg-[#0BA445]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-[#9AA3AF]">
                      <span>₹0</span>
                      <span>₹{freeDeliveryTarget}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Secure Checkout</p>
                  <p className="text-[9px] text-[#9AA3AF]">100% safe payments</p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
                  <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <Leaf className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
                  <p className="text-[10px] font-bold text-[#2F241C]">100% Natural</p>
                  <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
                </div>
              </div>

              {/* Need Help – at bottom */}
              <div className="mt-auto pt-6 border-t border-[#EEF1F4]">
                <div className="relative">
                  <h2 className="font-serif text-[19px] font-bold">Need help ?</h2>
                  <div className="mt-3 space-y-2 text-[15px] text-[#6F7786]">
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-[#D89A1B]" /> +91 98765 43210
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={16} className="text-[#D89A1B]" /> connect@honeyveda.in
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={16} className="text-[#D89A1B]" /> Mon - Sat : 9AM - 7PM
                    </p>
                  </div>
                  <div className="absolute bottom-0 right-0 opacity-100">
                    <Image
                      src="/need.png"
                      alt="Honey illustration"
                      width={200}
                      height={90}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}