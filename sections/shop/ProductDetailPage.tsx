"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  CircleX,
  MapPin,
  Play,
  Plus,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
  TriangleAlert,
} from "lucide-react";
import ProductCard from "@/components/Productcard";
import { useCart } from "@/components/cart/CartProvider";
import { allProducts, type Product } from "@/lib/shop-data";

const detailRows = [
  ["Pack of", "1"],
  ["Sales Package", "1 Natural Honey"],
  ["Brand", "SuddhVeda"],
  ["Model Name", "Premium Natural Honey"],
  ["Quantity", "250g   500g   1kg   2kg"],
  ["Flavor", "Natural Honey"],
  ["Source Type", "Honey Bee"],
  ["Honey Form", "Raw Honey"],
  ["Container Type", "Glass Bottle"],
  ["Maximum Shelf Life", "9 Months"],
  ["Organic", "Yes"],
  ["Caloric Value", "305"],
];

const reasons = [
  {
    icon: TriangleAlert,
    text: "Sourced from Wild Forests",
  },
  {
    text: "Unfiltered & Unprocessed",
  },
  {
    icon: CheckCircle2,
    text: "Rich in Antioxidants & Enzymes",
  },
  {
    text: "Naturally Boosts Immunity",
  },
];

const comparisonRows = [
  ["100% Raw & Unfiltered", true, false],
  ["No Added Sugar", true, false],
  ["No Additives / Preservatives", true, false],
  ["Lab Tested for Purity", true, true],
  ["Ethically Sourced", true, false],
] as const;

// Tab content for "All details"
const tabContents = {
  Specification: (
    <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-6">
      {detailRows.map(([label, value]) => (
        <div key={label}>
          <p className="text-[16px] text-[#778092]">{label}</p>
          <p className="mt-1.5 whitespace-pre-line font-serif text-[18px] font-bold leading-6 text-black">
            {value}
          </p>
        </div>
      ))}
    </div>
  ),
  Description: (
    <p className="mt-6 text-[16px] leading-7 text-[#5F6674]">
      Sourced from the deep wild forests, our Wild Forest Honey is 100% raw,
      unfiltered and unprocessed. It retains all the natural nutrients, enzymes
      and antioxidants just as nature intended. This honey is a powerhouse of
      health benefits, from boosting immunity to soothing sore throats. Perfect
      for your daily wellness routine.
    </p>
  ),
  "Manufacturer info": (
    <div className="mt-6 space-y-3 text-[16px] text-[#5F6674]">
      <p>
        <strong>Manufacturer:</strong> SuddhVeda Naturals Pvt. Ltd.
      </p>
      <p>
        <strong>Address:</strong> 123 Forest Lane, Wild Valley, India
      </p>
      <p>
        <strong>Contact:</strong> +91 98765 43210
      </p>
      <p>
        <strong>FSSAI License:</strong> 12345678901234
      </p>
    </div>
  ),
};

export default function ProductDetailPage({ product }: { product: Product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const router = useRouter();
  const quantity = cartItems[product.id] ?? 1;

  const [selectedSize, setSelectedSize] = useState("250g");
  const [question, setQuestion] = useState("");
  const [activeTab, setActiveTab] = useState<keyof typeof tabContents>("Specification");

  const recommendations = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      alert(`Your question: "${question}" has been submitted!`);
      setQuestion("");
    }
  };

  const sizeOptions = [
    { label: "250g", discount: null },
    { label: "500g", discount: "Save 10%" },
    { label: "1kg", discount: "Save 15%" },
    { label: "2kg", discount: "Save 20%" },
  ];

  return (
    <main className="bg-[#FFF8EF] text-[#2F241C]">
      <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
        {/* -------- MAIN GRID: IMAGE + DETAILS -------- */}
        <section className="grid items-stretch gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left column: Image & thumbnails */}
          <div className="flex flex-col h-full">
            <div className="grid gap-5 sm:grid-cols-[82px_1fr]">
              {/* Thumbnails */}
              <div className="hidden flex-col gap-3 sm:flex">
                {[product.image, "/videoheading.png", "/videoright.png", "/delivery.png"].map(
                  (image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={`relative h-[82px] overflow-hidden rounded-md bg-white ${
                        index === 0
                          ? "border-2 border-[#D89A1B] bg-[#111]"
                          : "border border-[#F0DDC4]"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} preview ${index + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </button>
                  ),
                )}
                <button
                  type="button"
                  className="flex h-[82px] flex-col items-center justify-center gap-2 rounded-md bg-white text-[#D89A1B]"
                >
                  <Play size={24} className="fill-[#D89A1B]" />
                  <span className="text-[10px] font-bold uppercase text-[#2F241C]">
                    Play Video
                  </span>
                </button>
              </div>

              {/* Main image */}
              <div className="relative min-h-[320px] overflow-hidden rounded-[18px] bg-[#FFF1DE] sm:min-h-[430px]">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain p-8 sm:p-12"
                  sizes="(max-width: 1024px) 100vw, 620px"
                />
                <span className="absolute right-4 top-4 rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-[#287A3D] shadow-sm">
                  100% Raw Unfiltered
                </span>
              </div>
            </div>

            {/* Quantity & Buy Now */}
            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr] sm:pl-[102px]">
              <div className="grid h-11 grid-cols-[52px_1fr_52px] items-center rounded border border-[#D89A1B] text-[#D89A1B]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => updateQuantity(product, -1)}
                  className="flex h-full items-center justify-center hover:bg-[#FFF2D8]"
                >
                  <Trash2 size={18} />
                </button>
                <span className="text-center text-[14px] font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => updateQuantity(product, 1)}
                  className="flex h-full items-center justify-center hover:bg-[#FFF2D8]"
                >
                  <Plus size={19} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product);
                  router.push("/cart");
                }}
                className="flex h-11 items-center justify-center gap-3 rounded border border-[#D89A1B] text-[15px] font-bold text-[#D89A1B] transition-colors hover:bg-[#FFF2D8]"
              >
                <ShoppingCart size={18} />
                Buy Now
              </button>
            </div>

            {/* Product Details - Left Side */}
            <section className="mt-12 flex-1 sm:pl-[102px]">
              <h2 className="font-serif text-[24px] font-bold text-[#38302A]">
                Product Details
              </h2>
              <p className="mt-4 max-w-[570px] text-[16px] leading-7 text-[#5F6674]">
                Sourced from the deep wild forests, our Wild Forest Honey is
                100% raw, unfiltered and unprocessed. It retains all the
                natural nutrients, enzymes and antioxidants just as nature
                intended.
              </p>

              {/* Reason cards */}
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {reasons.map((reason) => {
                  const Icon = reason.icon;
                  return (
                    <div
                      key={reason.text}
                      className="flex min-h-[98px] flex-col items-center justify-center rounded-md bg-white px-5 text-center text-[13px] leading-6 text-[#384252] shadow-sm"
                    >
                      {Icon && (
                        <Icon className="mb-2 h-5 w-5 text-[#D89A1B]" />
                      )}
                      {reason.text}
                    </div>
                  );
                })}
              </div>

              {/* Comparison table */}
              <div className="mt-10 rounded-2xl bg-white px-5 py-8 shadow-sm">
                <h3 className="text-center font-serif text-[22px] font-bold">
                  Why Choose Our Honey?
                </h3>
                <div className="mt-7 grid grid-cols-[1.5fr_1fr_1fr] text-center text-[12px] font-bold uppercase tracking-[0.08em] text-[#A3ABB8]">
                  <span>Features</span>
                  <span>ShudhVeda Honey</span>
                  <span>Other Honey</span>
                </div>
                <div className="mt-4 divide-y divide-[#F3E8D8]">
                  {comparisonRows.map(([label, ours, others]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[1.5fr_1fr_1fr] items-center py-4 text-[14px]"
                    >
                      <span className="pl-8 text-[#2F3742]">{label}</span>
                      <span className="flex justify-center">
                        {ours ? (
                          <CheckCircle2 className="h-4 w-4 fill-[#24A85F] text-white" />
                        ) : (
                          <CircleX className="h-4 w-4 fill-[#D1D8E0] text-white" />
                        )}
                      </span>
                      <span className="flex justify-center">
                        {others ? (
                          <CheckCircle2 className="h-4 w-4 fill-[#AEB7C3] text-white" />
                        ) : (
                          <CircleX className="h-4 w-4 fill-[#D1D8E0] text-white" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q&A */}
              <div className="mt-10">
                <h2 className="text-[30px] leading-tight text-black">
                  Questions and Answers
                </h2>
                <p className="mt-1.5 text-[20px] text-black">
                  Be the first to ask about this product
                </p>
                <form
                  onSubmit={handleQuestionSubmit}
                  className="mt-6 flex max-w-[480px] items-center gap-3"
                >
                  <input
                    type="text"
                    placeholder="Ask a question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="h-12 flex-1 rounded-md border border-[#F0DDC4] bg-transparent px-3 text-[17px] outline-none placeholder:text-[#4B4B4B] focus:border-[#D89A1B]"
                  />
                  <button
                    type="submit"
                    className="h-12 rounded-md bg-[#D89A1B] px-6 text-[16px] font-bold text-white hover:bg-[#C98715]"
                  >
                    Ask
                  </button>
                </form>
              </div>
            </section>
          </div>

          {/* Right column: Product info */}
          <aside className="flex flex-col h-full rounded-lg bg-white px-6 py-7 shadow-md sm:px-8">
            {/* Best Seller Badge - SAME SIZE */}
            <span className="inline-block w-fit rounded bg-[#F36D21] px-3 py-1.5 text-[11px] font-bold uppercase text-white">
              {product.badge}
            </span>

            <h1 className="mt-3 font-serif text-[36px] font-bold leading-tight text-[#3A342F] sm:text-[42px]">
              {product.title}
            </h1>
            <p className="mt-1.5 text-[15px] text-[#697386]">
              Raw · Unfiltered · Unprocessed
            </p>

            {/* Rating */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-[#697386]">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={
                      index < Math.round(product.rating)
                        ? "fill-[#D89A1B] text-[#D89A1B]"
                        : "fill-[#E8D5BA] text-[#E8D5BA]"
                    }
                  />
                ))}
              </div>
              <span>{product.rating} ({product.reviews} reviews)</span>
              <span className="h-4 w-px bg-[#CBD1DA]" />
              <span>20,000+ happy customers</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-[30px] font-bold">₹{product.price + 49}</span>
              <span className="pb-0.5 text-[17px] text-[#A6ADB8] line-through">
                ₹{product.oldPrice + 99}
              </span>
              <span className="pb-0.5 text-[14px] font-bold text-[#F36D21]">
                20% OFF
              </span>
            </div>
            <p className="mt-2 text-[12px] text-[#808999]">
              Inclusive of all taxes · Free shipping on orders above ₹400
            </p>

            {/* Size selection - CHHOTA AUR GAP KE SAATH */}
            <div className="mt-6">
              <p className="text-[13px] font-bold uppercase text-[#4A413A]">
                Select Size
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {sizeOptions.map(({ label, discount }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => setSelectedSize(label)}
                    className={`relative h-9 px-5 rounded border text-[13px] font-semibold transition-colors ${
                      selectedSize === label
                        ? "border-[#D89A1B] bg-[#FFF8EF] text-[#2F241C] ring-1 ring-[#D89A1B]"
                        : "border-[#E4E8EE] bg-white text-[#697386] hover:border-[#D89A1B]"
                    }`}
                  >
                    {discount && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#D9F8E6] px-2 py-0.5 text-[8px] font-medium text-[#20A85F]">
                        {discount}
                      </span>
                    )}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="mt-7">
              <h2 className="text-[22px] font-semibold text-black">
                Delivery details
              </h2>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-3 rounded border border-[#F2DEC1] bg-[#FFF8EF] px-4 py-3 text-[14px] text-[#4E4E4E]">
                  <MapPin size={19} className="text-[#D89A1B]" />
                  Location not set – Select delivery location
                </div>
                <div className="flex items-center gap-4 rounded border border-[#F2DEC1] bg-[#FFF8EF] px-4 py-3 text-[14px] text-[#4E4E4E]">
                  <Truck size={26} className="shrink-0 text-[#D89A1B]" />
                  <span>
                    Delivery by: Tomorrow, 24 May
                    <span className="block text-[12px] font-semibold text-[#20A85F]">
                      Order within 2h 15m
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Product highlights */}
            <div className="mt-8">
              <DetailsGrid title="Product highlights" rows={detailRows.slice(0, 8)} />
            </div>

            {/* All details with tabs */}
            <div className="mt-7 flex-1">
              <h2 className="text-[20px] font-semibold text-black">
                All details
              </h2>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {Object.keys(tabContents).map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab as keyof typeof tabContents)}
                    className={`h-11 rounded text-[15px] font-bold transition-colors ${
                      activeTab === tab
                        ? "bg-[#D89A1B] text-white"
                        : "bg-[#FFF8EF] text-black hover:bg-[#FFF2D8]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Tab content */}
              <div className="mt-5">{tabContents[activeTab]}</div>
            </div>
          </aside>
        </section>

        {/* -------- RECOMMENDATIONS -------- */}
        <section className="mt-17">
          <h2 className="mb-9 text-[42px] font-bold text-[#6B2E08]">
            Recommendation
          </h2>
          <div className="bg-white/45 p-5">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((item) => (
                <ProductCard
                  key={item.id}
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
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* -------- STICKY ADD-TO-CART BAR (mobile) -------- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#F0DDC4] bg-white p-4 shadow-lg lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Qty:</span>
            <div className="flex h-9 w-24 items-center rounded border border-[#D89A1B]">
              <button
                onClick={() => updateQuantity(product, -1)}
                className="flex h-full w-8 items-center justify-center text-[#D89A1B]"
              >
                <Trash2 size={16} />
              </button>
              <span className="flex-1 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => updateQuantity(product, 1)}
                className="flex h-full w-8 items-center justify-center text-[#D89A1B]"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              addToCart(product);
              router.push("/cart");
            }}
            className="flex-1 rounded bg-[#D89A1B] py-3 text-center font-bold text-white hover:bg-[#C98715]"
          >
            Add to Cart · ₹{product.price + 49}
          </button>
        </div>
      </div>
    </main>
  );
}

function DetailsGrid({
  title,
  rows,
  compact = false,
}: {
  title: string;
  rows: string[][];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "mt-6" : "mt-10"}>
      <h2 className="text-[20px] font-semibold text-black">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-5">
        {rows.map(([label, value]) => (
          <div key={`${title}-${label}`}>
            <p className="text-[15px] text-[#778092]">{label}</p>
            <p className="mt-1 whitespace-pre-line font-serif text-[17px] font-bold leading-5 text-black">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}