"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ArrowUpRight, X, ShoppingCart, Trash2, Check } from "lucide-react";

const initialWishlist = [
  { id: 1, title: "Wild Forest Honey", weight: "250g • Raw & Unfiltered", image: "/honneycart.png", price: 799 },
  { id: 2, title: "Mustard Honey", weight: "250g • Raw & Unfiltered", image: "/honneycart.png", price: 799 },
  { id: 3, title: "Jamun Honey", weight: "250g • Raw & Unfiltered", image: "/honneycart.png", price: 799 },
  { id: 4, title: "Acacia Honey", weight: "250g • Raw & Unfiltered", image: "/honneycart.png", price: 799 },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlist);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const removeItem = (id: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    if (wishlistItems.length === 0) return;
    setWishlistItems([]);
    showToast("Wishlist cleared");
  };

  const moveToCart = (id: number, title: string) => {
    // TODO: hook this up to actual cart state / API
    removeItem(id);
    showToast(`${title} moved to cart`);
  };

  const shareWishlist = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Wishlist", url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Wishlist link copied!");
      }
    } catch {
      // user cancelled share, ignore
    }
  };

  const referNow = async () => {
    const referralLink =
      (typeof window !== "undefined" ? window.location.origin : "") + "/refer?code=SHUDDH10";
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast("Referral link copied!");
    } catch {
      showToast("Couldn't copy link");
    }
  };

  return (
    <section className="bg-[#FFF8EF] min-h-screen py-10">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10">

        <div className="flex items-center gap-2 text-[14px] text-[#B59A78]">
         
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-[34px] font-bold text-[#3C2015] flex items-center gap-3">
              My Wishlist <Heart size={26} className="text-red-400 fill-red-400" />
            </h1>
            <p className="text-[15px] text-[#B59A78] mt-1">Save your favorite products and buy them anytime.</p>
          </div>
          <Image src="/wishlist.png" alt="" width={130} height={130} className="hidden sm:block" />
        </div>

        <div className="bg-white border border-[#F0E2CC] rounded-2xl mt-8 p-7">
          <div className="flex items-center justify-between text-[14px] text-[#B59A78] mb-4">
            <span>{wishlistItems.length} Items in Your Wishlist</span>
            <div className="flex items-center gap-6">
              <button
                onClick={shareWishlist}
                className="flex items-center gap-1.5 text-[#2D3A1B] hover:text-[#D89A1B] transition-colors"
              >
                <ArrowUpRight size={15} /> Share Wishlist
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-[#B59A78] hover:text-red-500 transition-colors"
              >
                <Trash2 size={15} /> Clear All
              </button>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="py-20 text-center">
              <Heart size={40} className="mx-auto text-[#E7D8C2] mb-4" />
              <p className="text-[16px] text-[#B59A78]">Your wishlist is empty.</p>
              <Link
                href="/shop"
                className="inline-block mt-4 text-[15px] font-semibold text-[#D89A1B] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F0E2CC]">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-6 py-5">
                  <div className="relative w-20 h-20 rounded-xl bg-[#FFF8EF] shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[17px] font-semibold text-[#3C2015]">{item.title}</p>
                    <p className="text-[14px] text-[#B59A78]">{item.weight}</p>
                    <span className="inline-block mt-1.5 text-[11px] bg-[#F5F8EE] text-[#3C6B2E] px-2.5 py-1 rounded-full">
                      ✓ 100% Raw &amp; Unfiltered
                    </span>
                  </div>
                  <span className="text-[19px] font-bold text-[#3C2015] shrink-0">₹{item.price}</span>
                  <button
                    onClick={() => moveToCart(item.id, item.title)}
                    className="shrink-0 flex items-center gap-2 border border-[#D89A1B] text-[#D89A1B] text-[14px] font-semibold px-6 py-3 rounded-xl hover:bg-[#FFF8EF] transition-colors"
                  >
                    <ShoppingCart size={16} /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-[#F0E2CC] text-[#B59A78] hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-[#FFF2D8] to-[#FDECC8] border border-[#F0DAAE] rounded-2xl p-7 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src="/wishlist1.png"
              alt="Refer and earn"
              width={110}
              height={110}
              className="shrink-0"
            />
            <div>
              <p className="text-[19px] font-bold text-[#3C2015]">Refer &amp; Earn Rewards!</p>
              <p className="text-[15px] text-[#2D3A1B] mt-1.5">
                Refer your friends and get <span className="text-[#D89A1B] font-semibold">10% off</span> on their first order.
              </p>
              <button
                onClick={referNow}
                className="mt-4 bg-[#D89A1B] hover:bg-[#C98715] text-white text-[15px] font-semibold px-7 py-3 rounded-xl transition-colors"
              >
                Refer Now
              </button>
            </div>
          </div>

          <Image
            src="/gift.png"
            alt="Gift"
            width={140}
            height={140}
            className="hidden sm:block shrink-0"
          />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3C2015] text-white text-[14px] px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <Check size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </section>
  );
}