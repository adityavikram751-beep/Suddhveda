"use client";

import { useState, useEffect } from "react";
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
  Home,
  Truck,
  CreditCard,
  Edit3,
  ShoppingBag,
  LockKeyhole,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  X,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";

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

function getStoredSession(): any {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem("sudhveda_auth_session");
    if (stored) return JSON.parse(stored);
  } catch { }
  return null;
}

const freeDeliveryTarget = 2000;

const steps = [
  { id: 1, title: "Address", subtitle: "Add delivery address" },
  { id: 2, title: "Shipping", subtitle: "Choose shipping method" },
  { id: 3, title: "Review", subtitle: "Review & place order" },
  { id: 4, title: "Payment", subtitle: "Select payment option" },
] as const;

type Address = {
  id: string;
  label: string;
  isDefault: boolean;
  name: string;
  line: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  country: string;
};

type LocationData = {
  phone: string;
  phone_timing: string;
  email: string;
  email_reply_time: string;
  whatsapp: string;
  whatsapp_timing: string;
  map_embed_url: string;
};

const mapApiAddress = (item: any): Address => ({
  id: item._id || item.id || item.address_id || "",
  label: item.address_type === "home" ? "Home" : item.address_type === "work" ? "Office" : "Other",
  isDefault: item.is_default || false,
  name: item.full_name || item.name || "",
  line: [item.address_line1, item.address_line2].filter(Boolean).join(", "),
  address_line1: item.address_line1 || "",
  address_line2: item.address_line2 || "",
  city: item.city || "",
  state: item.state || "",
  pincode: item.pincode || "",
  phone: item.phone || item.phone_number || item.mobile || "",
  country: item.country || "India",
});

export default function ReviewPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  const [address, setAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);

  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [deliveryLabel, setDeliveryLabel] = useState<string>("Standard Shipping");
  const [deliveryDescription, setDeliveryDescription] = useState<string>("Delivery in 3-5 business days");

  const [paymentLabel, setPaymentLabel] = useState<string>("Cash on Delivery (COD)");
  const [codCharge, setCodCharge] = useState<number>(0);
  const [isDiscountsOpen, setIsDiscountsOpen] = useState(false);

  const [location, setLocation] = useState<LocationData | null>(null);

  const [rawApiCartItems, setRawApiCartItems] = useState<any[]>([]);
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);

  const mapCartItemsToProducts = (items: any) => {
    const rawItems = Array.isArray(items) ? items : Object.values(items || {});
    return rawItems.map((item: any) => {
      if (item.type === "CUSTOM") {
        const giftBox = item.giftBox || {};
        const qty = item.quantity || 1;
        const totalAmt = item.totalAmount || 0;
        const unitPrice = item.price || item.unitPrice || (totalAmt > 0 ? totalAmt / qty : 0);
        return {
          id: item.giftCartItemId || item._id,
          cartItemId: item.giftCartItemId || item._id,
          title: `${giftBox.name || "Gift Box"}`,
          weight: `${item.totalWeight || 0}g`,
          price: unitPrice,
          quantity: qty,
          image: giftBox.image || "/placeholder.png",
          oldPrice: 0,
          type: "CUSTOM",
        };
      }

      const product = item.product || {};
      const variant = item.variant || product.variant || {};
      return {
        id: product._id || item.cartItemId || item._id,
        cartItemId: item.cartItemId || item._id,
        title: product.product_name || item.productName || item.title || "Honey",
        weight: variant.weight ? `${variant.weight}${variant.unit || 'g'}` : item.weight || "",
        price: variant.price || item.price || 0,
        quantity: item.quantity || 1,
        image: product.image?.image_url || product.image?.url || item.image || "/placeholder.png",
        oldPrice: variant.mrp || variant.oldPrice || item.oldPrice || 0,
        type: "NORMAL",
      };
    });
  };

  useEffect(() => {
    if (cartItems && Object.keys(cartItems).length > 0) {
      const mapped = mapCartItemsToProducts(cartItems);
      if (mapped.length > 0) {
        setCartProducts(mapped);
        setCartLoading(false);
      }
    }
  }, [cartItems]);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      const storedCoupon = localStorage.getItem("applied_coupon");
      if (storedCoupon) {
        try {
          const parsed = JSON.parse(storedCoupon);
          if (parsed?.discount) setCouponDiscount(parsed.discount);
          if (parsed?.coupon?.code) setAppliedCouponCode(parsed.coupon.code);
        } catch (e) {
          console.error("Error parsing saved coupon", e);
        }
      }

      const storedShipping = localStorage.getItem("selected_shipping");
      if (storedShipping) {
        try {
          const parsed = JSON.parse(storedShipping);
          setDeliveryCharge(Number(parsed?.price) || 0);
          setDeliveryLabel(parsed?.label || "Standard Shipping");
          setDeliveryDescription(
            parsed?.id === "express"
              ? "Delivery in 1-2 business days"
              : parsed?.id === "priority"
                ? "Delivery by tomorrow"
                : "Delivery in 3-5 business days"
          );
        } catch (e) {
          console.error("Error parsing saved shipping method", e);
        }
      }

      const storedPayment = localStorage.getItem("selected_payment");
      if (storedPayment) {
        try {
          if (storedPayment === "cod") {
            setPaymentLabel("Cash on Delivery (COD)");
          } else if (storedPayment === "upi") {
            setPaymentLabel("Online Payment");
          } else {
            setPaymentLabel(storedPayment);
          }
        } catch (e) {
          console.error("Error parsing saved payment method", e);
        }
      }
    }
  }, [isMounted]);

  const fetchCart = async () => {
    try {
      if (cartProducts.length === 0) {
        setCartLoading(true);
      }
      setCartError(null);
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        credentials: "include",
      });
      if (res.status === 401) {
        setCartError("Please log in to view your cart.");
        setCartProducts([]);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const rawDiscount =
        data.couponDiscount ?? data.discountAmount ?? data.discount ?? data.data?.discountAmount ?? 0;
      const apiDiscount = typeof rawDiscount === "string" ? parseFloat(rawDiscount) || 0 : rawDiscount;
      const apiCode = data.appliedCoupon?.code || data.couponCode || "";

      if (isMounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("applied_coupon");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed?.discount !== undefined && parsed?.discount !== null) setCouponDiscount(Number(parsed.discount));
            if (parsed?.coupon?.code) setAppliedCouponCode(parsed.coupon.code);
          } catch (e) { }
        } else if (apiDiscount > 0) {
          setCouponDiscount(apiDiscount);
          setAppliedCouponCode(apiCode);
        }
      }

      const items = data.items || data.data?.items || (Array.isArray(data.data) ? data.data : []) || [];
      setRawApiCartItems(items);
      const mapped = mapCartItemsToProducts(items);
      if (mapped.length > 0) {
        setCartProducts(mapped);
      }
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      if (cartProducts.length === 0) {
        setCartError(err.message || "Failed to load cart");
      }
    } finally {
      setCartLoading(false);
    }
  };

  const fetchAddress = async () => {
    try {
      setAddressLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/shipping/addresses/all`, {
        credentials: "include",
      });
      if (!res.ok) {
        setAddress(null);
        return;
      }
      const data = await res.json();
      const items = data.data || [];
      const list: Address[] = items.map((item: any): Address => mapApiAddress(item));

      const storedId =
        isMounted && typeof window !== "undefined" ? localStorage.getItem("selected_address_id") : null;
      const selected = storedId ? list.find((a) => a.id === storedId) : null;

      if (selected) {
        setAddress(selected);
      } else if (list.length > 0) {
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setAddress(defaultAddr);
      } else {
        setAddress(null);
      }
    } catch (err) {
      console.error("Error fetching address:", err);
      setAddress(null);
    } finally {
      setAddressLoading(false);
    }
  };

  const fetchLocation = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/location/all`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const loc = data.data || data;
        setLocation({
          phone: loc.phone || "+91 98765 43210",
          phone_timing: loc.phone_timing || "Mon - Sat : 9AM - 7PM",
          email: loc.email || "connect@honeyveda.in",
          email_reply_time: loc.email_reply_time || "We reply within 24 hrs",
          whatsapp: loc.whatsapp || "",
          whatsapp_timing: loc.whatsapp_timing || "",
          map_embed_url: loc.map_embed_url || "",
        });
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  useEffect(() => {
    if (isMounted) {
      fetchCart();
      fetchAddress();
      fetchLocation();
    }
  }, [isMounted]);

  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const saved = cartProducts.reduce((sum, p) => {
    const perUnitSaving = Math.max((p.oldPrice || 0) - p.price, 0);
    const cappedPerUnit = Math.min(perUnitSaving, p.price || perUnitSaving);
    return sum + cappedPerUnit * p.quantity;
  }, 0);
  const totalDiscounts = saved + couponDiscount;

  const formatAmount = (num: number) => {
    if (num % 1 !== 0) {
      return num.toFixed(2);
    }
    return num.toLocaleString("en-IN");
  };

  const isCod = paymentLabel.toLowerCase().includes("cash on delivery") || paymentLabel.toLowerCase().includes("cod");
  const netSubtotal = Math.max(subtotal - couponDiscount, 0);
  const rawCodCharge = isCod ? netSubtotal * 0.25 : 0;
  const computedCodCharge = Number(rawCodCharge.toFixed(2));
  const rawTotal = Math.max(subtotal + deliveryCharge - couponDiscount + computedCodCharge, 0);
  const total = Number(rawTotal.toFixed(2));
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const handleBack = () => {
    router.push("/shipping");
  };

  const loadRazorpayScript = () => {
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
  };

  const handlePlaceOrder = async () => {
    if (placingOrder) return;
    try {
      setPlacingOrder(true);
      const storedPayment = typeof window !== "undefined" ? localStorage.getItem("selected_payment") || "" : "";
      const isCodMode = storedPayment.toLowerCase() === "cod" || paymentLabel.toLowerCase().includes("cash");

      const userPhone = address?.phone || getStoredSession()?.user?.mobile || getStoredSession()?.user?.phone || "9876543210";

      const shippingAddressObj = {
        full_name: address?.name || getStoredSession()?.user?.name || "Customer",
        phone: userPhone,
        address_line1: address?.address_line1 || address?.line || "",
        address_line2: address?.address_line2 || "",
        city: address?.city || "",
        state: address?.state || "",
        pincode: address?.pincode || "",
        country: address?.country || "India",
      };

      let billingAddressObj = shippingAddressObj;
      try {
        const token = getTokenFromCookie();
        const bRes = await fetch(`${API_BASE_URL}/api/addresses/all`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (bRes.ok) {
          const bData = await bRes.json();
          const bItems = bData.data || bData.addresses || (Array.isArray(bData) ? bData : []) || [];
          if (bItems.length > 0) {
            const bItem = bItems.find((item: any) => item.is_default) || bItems[0];
            billingAddressObj = {
              full_name: bItem.full_name || bItem.name || address?.name || "Customer",
              phone: bItem.phone || bItem.phone_number || userPhone,
              address_line1: bItem.address_line1 || "",
              address_line2: bItem.address_line2 || "",
              city: bItem.city || "",
              state: bItem.state || "",
              pincode: bItem.pincode || "",
              country: bItem.country || "India",
            };
          }
        }
      } catch (e) {
        console.error("Error fetching billing address:", e);
      }

      const sourceItems = rawApiCartItems.length > 0 ? rawApiCartItems : cartProducts;

      const formattedItems = sourceItems.map((item: any) => {
        const isCustom = item.type === "CUSTOM";
        const quantity = item.quantity || 1;
        const reservedQuantity = item.reserved_quantity || quantity;

        if (isCustom) {
          const pd = item.product_details || item;
          const giftBox = pd.giftBox || item.giftBox || {};
          const rawProducts = pd.products || item.products || [];

          const formattedProducts = rawProducts.map((p: any) => {
            const prodObj = p.product || p;
            const variantObj = p.variant || prodObj.variant || {};
            const imgUrl =
              typeof p.image === "string"
                ? p.image
                : p.image?.image_url || prodObj.image?.image_url || prodObj.image || "https://res.cloudinary.com/anjp8e9i/image/upload/v1784636390/products/cqwj18nqm6dcz9r0htlk.jpg";

            return {
              productId: p.productId || prodObj._id || prodObj.id || "",
              product_name: prodObj.product_name || prodObj.productName || prodObj.name || p.product_name || "Honey",
              brand: prodObj.brand || "SudhVeda Honey",
              description: prodObj.description || "Raw and organic honey.",
              image: {
                image_url: imgUrl,
              },
              variant: {
                _id: variantObj._id || variantObj.variantId || variantObj.id || "",
                weight: variantObj.weight || 250,
                price: variantObj.price || 0,
                mrp: variantObj.mrp || variantObj.price || 0,
                save: variantObj.save || 0,
              },
              reserved_quantity: p.reserved_quantity || 1,
            };
          });

          const totalWeight = pd.totalWeight || item.totalWeight || 500;
          const packingPrice = pd.packingPrice || item.packingPrice || giftBox.price || 0;
          const totalAmount = pd.totalAmount || item.totalAmount || 0;
          const itemCouponDiscount = pd.couponDiscount || 0;
          const finalAmount = pd.finalAmount || Math.max(totalAmount - itemCouponDiscount, 0);
          const totalsave = pd.totalsave || item.totalsave || 0;

          return {
            type: "CUSTOM",
            product_details: {
              giftCartItemId: pd.giftCartItemId || item.giftCartItemId || item.cartItemId || item._id || "",
              giftBox: {
                _id: giftBox._id || giftBox.id || "",
                name: giftBox.name || "Gift Box",
                image: typeof giftBox.image === "string" ? giftBox.image : (giftBox.image?.image_url || "/placeholder.png"),
                price: giftBox.price || 0,
              },
              products: formattedProducts,
              coupon: pd.coupon || (appliedCouponCode ? { code: appliedCouponCode, discount: couponDiscount } : null),
              totalWeight: totalWeight,
              packingPrice: packingPrice,
              totalAmount: totalAmount,
              couponDiscount: itemCouponDiscount,
              finalAmount: finalAmount,
              totalsave: totalsave,
            },
            quantity: quantity,
            reserved_quantity: reservedQuantity,
          };
        } else {
          // NORMAL item
          const pd = item.product_details || item;
          const prodObj = pd.product || item.product || item;
          const variantObj = pd.variant || prodObj.variant || item.variant || {};
          const imgUrl =
            typeof prodObj.image === "string"
              ? prodObj.image
              : (prodObj.image?.image_url || item.image || "https://res.cloudinary.com/anjp8e9i/image/upload/v1784636390/products/cqwj18nqm6dcz9r0htlk.jpg");

          const totalAmount = pd.totalAmount || item.totalAmount || ((variantObj.price || item.price || 0) * quantity);
          const itemCouponDiscount = pd.couponDiscount || 0;
          const finalAmount = pd.finalAmount || Math.max(totalAmount - itemCouponDiscount, 0);
          const totalWeight = pd.totalWeight || item.totalWeight || ((variantObj.weight || 250) * quantity);
          const totalsave = pd.totalsave || item.totalsave || ((variantObj.save || 0) * quantity);

          return {
            type: "NORMAL",
            product_details: {
              cartItemId: pd.cartItemId || item.cartItemId || item._id || "",
              product: {
                _id: prodObj._id || prodObj.productId || prodObj.id || item.productId || item.id || "",
                product_name: prodObj.product_name || prodObj.productName || prodObj.name || item.title || "Pure Honey",
                brand: prodObj.brand || "SudhVeda Honey",
                description: prodObj.description || "Raw and organic honey collected directly from natural hives.",
                image: {
                  image_url: imgUrl,
                },
                variant: {
                  _id: variantObj._id || variantObj.variantId || variantObj.id || item.variantId || "",
                  weight: variantObj.weight || parseInt(item.weight) || 250,
                  price: variantObj.price || item.price || 0,
                  mrp: variantObj.mrp || item.oldPrice || variantObj.price || item.price || 0,
                  save: variantObj.save || Math.max((item.oldPrice || 0) - (item.price || 0), 0),
                },
              },
              coupon: pd.coupon || (appliedCouponCode ? { code: appliedCouponCode, discount: couponDiscount } : null),
              totalAmount: totalAmount,
              couponDiscount: itemCouponDiscount,
              finalAmount: finalAmount,
              totalWeight: totalWeight,
              totalsave: totalsave,
            },
            quantity: quantity,
            reserved_quantity: reservedQuantity,
          };
        }
      });

      const calculatedFinalAmount = total > 0 ? total : formattedItems.reduce((sum: number, it: any) => sum + (it.product_details?.finalAmount || 0), 0);

      const payload = {
        items: formattedItems,
        finalAmount: calculatedFinalAmount,
        couponCode: appliedCouponCode || null,
        coupon_code: appliedCouponCode || null,
        couponDiscount: couponDiscount || 0,
        coupon: appliedCouponCode ? { code: appliedCouponCode, discount: couponDiscount } : null,
        shipping_address: shippingAddressObj,
        billing_address: billingAddressObj,
        payment_mode: isCodMode || isCod ? "cod" : (storedPayment || "upi"),
        customer_note: "Please deliver during daytime.",
      };

      const token = getTokenFromCookie();
      const res = await fetch(`${API_BASE_URL}/api/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok || data.success) {
        if (data.payment_required && data.razorpay) {
          await loadRazorpayScript();
          if (typeof window !== "undefined" && (window as any).Razorpay) {
            const options = {
              key: data.razorpay.key_id,
              amount: data.razorpay.amount,
              currency: data.razorpay.currency || "INR",
              name: "SudhVeda Honey",
              description: "Honey Order",
              order_id: data.razorpay.order_id,
              handler: function (response: any) {
                const finalOrder = {
                  orderId: data.group?.group_id || data.orders?.[0]?.order_id || `ORD-${Date.now().toString().slice(-6)}`,
                  createdAt: new Date().toISOString(),
                  paymentMethod: "Online Payment (Razorpay)",
                  paymentStatus: "Paid",
                  razorpayPaymentId: response.razorpay_payment_id,
                  shippingAddress: {
                    name: shippingAddressObj.full_name,
                    phone: shippingAddressObj.phone,
                    addressLine: shippingAddressObj.address_line1,
                    city: shippingAddressObj.city,
                    state: shippingAddressObj.state,
                    pincode: shippingAddressObj.pincode,
                  },
                  items: cartProducts,
                  pricing: { subtotal, saved, couponDiscount, codFee: 0, total: calculatedFinalAmount },
                };
                if (typeof window !== "undefined") {
                  localStorage.setItem("latest_order", JSON.stringify(finalOrder));
                  localStorage.removeItem("applied_coupon");
                }
                router.push("/thank");
              },
              prefill: {
                name: shippingAddressObj.full_name,
                contact: shippingAddressObj.phone,
              },
              theme: { color: "#F24E1E" },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
            setPlacingOrder(false);
            return;
          }
        }

        // COD or direct order success response
        const orderId = data.group?.group_id || data.orders?.[0]?.order_id || data.orderId || data.order_id || `ORD-${Date.now().toString().slice(-6)}`;
        const finalOrder = {
          orderId: orderId,
          createdAt: new Date().toISOString(),
          paymentMethod: isCodMode || isCod ? "Cash on Delivery (COD)" : "Online Payment",
          paymentStatus: isCodMode || isCod ? "Pay on Delivery (COD)" : "Completed",
          shippingAddress: {
            name: shippingAddressObj.full_name,
            phone: shippingAddressObj.phone,
            addressLine: shippingAddressObj.address_line1,
            city: shippingAddressObj.city,
            state: shippingAddressObj.state,
            pincode: shippingAddressObj.pincode,
          },
          items: cartProducts,
          pricing: { subtotal, saved, couponDiscount, codFee: isCodMode || isCod ? computedCodCharge : 0, total: calculatedFinalAmount },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("latest_order", JSON.stringify(finalOrder));
          localStorage.removeItem("applied_coupon");
        }
        router.push("/thank");
        return;
      } else {
        alert(data.message || "Failed to create order. Please try again.");
      }
    } catch (e: any) {
      console.error("Error creating order:", e);
      const fallbackOrder = {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        paymentMethod: isCod ? "Cash on Delivery (COD)" : "Online Payment",
        paymentStatus: isCod ? "Pay on Delivery (COD)" : "Paid",
        shippingAddress: {
          name: address?.name || "Customer",
          phone: address?.phone || "",
          addressLine: address?.line || "",
          city: address?.city || "",
          state: address?.state || "",
          pincode: address?.pincode || "",
        },
        items: cartProducts,
        pricing: { subtotal, saved, couponDiscount, codFee: isCod ? computedCodCharge : 0, total },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("latest_order", JSON.stringify(fallbackOrder));
      }
      router.push("/thank");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFF8EF] py-8 text-[#2F241C] md:py-10">
      <div className="mx-auto max-w-[1410px] px-4 md:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">

          {/* Left Column - Scrollable */}
          <section className="flex flex-col gap-7">
            {/* Header */}
            <header className="relative pr-1 sm:pr-28">
              <h1 className="font-serif text-[42px] font-bold leading-none text-[#593102] md:text-[48px]">
                Review &amp; Place Order
              </h1>
              <p className="mt-4 text-[16px] text-[#5D6778]">
                Please review your order details and confirm your purchase.
              </p>
              <Image
                src="/bee with honey bottle.png"
                alt="Honey jar with bee"
                width={110}
                height={92}
                className="absolute right-0 top-0 hidden object-contain sm:block"
                priority
              />
            </header>


            {/* Stepper */}
            <div className="rounded-lg border border-[#F4D7B8] bg-white/55 px-1.5 sm:px-4 py-2 sm:py-4 shadow-sm w-full max-w-full overflow-hidden">
              <div className="flex items-center justify-between gap-0.5 sm:gap-2 w-full">
                {[
                  { id: 1, title: "Address", subtitle: "Add delivery address" },
                  { id: 2, title: "Shipping", subtitle: "Choose shipping method" },
                  { id: 3, title: "Review", subtitle: "Review & confirm order" },
                  { id: 4, title: isCod ? "Thanks" : "Payment", subtitle: isCod ? "Order confirmation" : "Select payment option" },
                ].map((step) => {
                  const isDone = step.id < 3;
                  const isActive = step.id === 3;
                  return (
                    <div key={step.id} className="flex min-w-0 flex-1 items-center justify-between">
                      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
                        <span
                          className={`flex h-5.5 w-5.5 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border text-[9.5px] sm:text-[16px] font-bold ${isDone
                            ? "border-[#77AE61] bg-white text-[#77AE61]"
                            : isActive
                              ? "border-[#F24E1E] bg-[#F24E1E] text-white"
                              : "border-[#F0DDC8] bg-white text-[#2F241C]"
                            }`}
                        >
                          {isDone ? <CheckCircle2 size={12} className="sm:w-[28px] sm:h-[28px]" strokeWidth={2} /> : step.id}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`text-[9.5px] sm:text-[15px] font-semibold leading-tight truncate ${isActive ? "text-[#F24E1E]" : "text-[#2F241C]"
                              }`}
                          >
                            {step.title}
                          </p>
                          <p className="hidden sm:block mt-0.5 sm:mt-1 truncate text-[10px] sm:text-[12px] leading-tight text-[#596273]">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                      {step.id < steps.length && (
                        <span className="mx-0.5 sm:mx-3 shrink-0 text-[10px] sm:text-[26px] leading-none text-[#F24E1E]/60">
                          &rsaquo;
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>


            {/* Delivery Details */}
            <section className="rounded-xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#593102]">Delivery Details</h2>
                <button
                  onClick={() => router.push("/checkout")}
                  className="flex items-center gap-1 text-[13px] text-[#D18500]"
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>

              <div className="mt-7 grid gap-7 md:grid-cols-3">
                <div className="flex items-start gap-3.5">
                  <Home size={22} className="mt-0.5 text-[#593102] shrink-0" />
                  <div>
                    {addressLoading ? (
                      <p className="text-[14px] text-[#B59A78]">Loading address...</p>
                    ) : address ? (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-[16px] font-bold text-[#3A2418]">{address.label}</p>
                          {address.isDefault && (
                            <span className="rounded bg-[#F2F4F7] px-2 py-1 text-[10px] text-[#8A94A6]">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-[15px] leading-7 text-[#686F7C]">
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
                      </>
                    ) : (
                      <p className="text-[14px] text-[#B59A78]">No address found.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Truck size={20} className="mt-1 text-[#3A2418]" />
                  <div>
                    <p className="text-[16px] font-bold text-[#3A2418]">Shipping Method</p>
                    <p className="mt-3 text-[15px] text-[#3A2418]">
                      {deliveryLabel}
                      {deliveryCharge === 0 ? " (FREE)" : ` (₹${deliveryCharge})`}
                    </p>
                    <p className="mt-1 text-[15px] text-[#686F7C]">{deliveryDescription}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CreditCard size={20} className="mt-1 text-[#3A2418]" />
                  <div>
                    <p className="text-[16px] font-bold text-[#3A2418]">Payment Method</p>
                    <p className="mt-3 text-[15px] font-semibold text-[#3A2418]">{paymentLabel}</p>
                  </div>
                </div>
              </div>
            </section>




            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-[42px] w-full sm:w-auto px-6 items-center justify-center gap-2 rounded-xl border border-[#F24E1E] bg-white text-[12px] font-extrabold uppercase tracking-wider text-[#F24E1E] hover:bg-[#FFF0EB] transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <ArrowLeft size={16} />
                Back to Shipping
              </button>
              <button
                type="button"
                disabled={placingOrder}
                onClick={handlePlaceOrder}
                className="flex h-[42px] w-full sm:w-auto px-6 items-center justify-center gap-2 rounded-xl bg-[#F24E1E] hover:bg-[#D93F13] text-[12.5px] font-bold text-white shadow-md hover:shadow-lg hover:shadow-[#F24E1E]/35 hover:-translate-y-1 transition-all duration-300 cursor-pointer active:translate-y-0 active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOrder ? "Processing..." : isCod ? "Place Order" : "Proceed to Payment"}
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* Right Column - Order Summary */}
          <aside className="lg:sticky lg:top-[112px] flex flex-col w-full min-w-0">
            <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-3.5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[18px] sm:text-[20px] font-bold">Order Summary</h2>
                <span className="text-[11px] sm:text-[12px] text-[#9AA3AF]">{cartProducts.length} Items</span>
              </div>

              {/* Product List */}
              <div className="mt-4 max-h-[180px] sm:max-h-[220px] space-y-4 overflow-y-auto pr-1 scrollbar-hide">
                {cartLoading ? (
                  <p className="text-center text-[#9AA3AF] py-4">Loading cart...</p>
                ) : cartError ? (
                  <p className="text-center text-red-600 py-4">{cartError}</p>
                ) : cartProducts.length === 0 ? (
                  <p className="text-center text-[#9AA3AF]">Your cart is empty.</p>
                ) : (
                  cartProducts.map((product: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
                        <Image src={product.image} alt={product.title} fill className="object-contain p-1.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] font-semibold truncate">{product.title}</p>
                        <p className="text-[10px] sm:text-[11px] text-[#9AA3AF]">{product.weight || "Weight"}</p>
                        <p className="text-[10px] sm:text-[11px] text-[#9AA3AF]">Qty: {product.quantity}</p>
                      </div>
                      <p className="text-[13px] sm:text-[14px] font-bold shrink-0">₹{product.price * product.quantity}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-3 border-t border-[#EEF1F4] pt-4 text-[12px] sm:text-[13px] text-[#6F7786]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong className="text-[#593102]">₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>
                {saved > 0 && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Discount on MRP</span>
                    <strong className="text-emerald-700 font-extrabold">- ₹{saved.toLocaleString("en-IN")}</strong>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="mt-2 rounded-xl border border-dashed border-[#0BA445]/40 bg-[#F0FFF4] p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0BA445] text-white text-[10px] font-bold">✓</span>
                        <span className="text-[12px] font-bold text-[#187A37]">Coupon Applied</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#0BA445]">- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                    {appliedCouponCode && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {appliedCouponCode.split(',').map((code: string, i: number) => (
                          <span key={i} className="inline-block rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-[#187A37] border border-[#D7F3D9]">
                            {code.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {computedCodCharge > 0 && (
                  <div className="flex justify-between text-[#F24E1E] font-bold pt-1 border-t border-dashed border-[#E5E8ED]">
                    <span>COD Charge</span>
                    <span>+ ₹{formatAmount(computedCodCharge)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-4 flex items-end justify-between border-t border-[#EEF1F4] pt-4">
                <div>
                  <p className="text-[18px] sm:text-[21px] font-bold">Total</p>
                  <p className="text-[9px] sm:text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
                </div>
                <p className="font-serif text-[24px] sm:text-[28px] font-bold">₹{formatAmount(total)}</p>
              </div>

              {/* Savings box */}
              <div className="mt-4 rounded-[14px] border border-[#D7F3D9] bg-[#F0FFF4] p-3 sm:p-4">
                <p className="flex items-center gap-2 text-[12px] sm:text-[13px] font-semibold text-[#187A37]">
                  <ShieldCheck size={14} /> You&apos;re saving ₹{formatAmount(saved + couponDiscount)} on this order!
                </p>
              </div>

              {/* Need help */}
              <div className="mt-4 w-full box-border flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFDF9] border border-[#EADCC9]/80 shadow-2xs">
                <div className="flex-1 space-y-2">
                  <h2 className="font-serif text-[17px] font-extrabold text-[#593102]">Need help?</h2>
                  <div className="space-y-1.5 text-[12.5px] font-semibold text-[#6E5D4F]">
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-[#D49313] shrink-0" />
                      <span className="text-[#593102]">{location?.phone || "9876543210"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-[#D49313] shrink-0" />
                      <span className="text-[#593102] break-all">{location?.email || "hello@shuddhaveda.com"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={14} className="text-[#D49313] shrink-0" />
                      <span className="text-[#593102]">{location?.phone_timing || "Mon - Sat: 9AM - 6PM"}</span>
                    </p>
                  </div>
                </div>
                <div className="relative w-[80px] h-[70px] shrink-0 hidden sm:block">
                  <Image
                    src="/need.png"
                    alt="Honey dipper illustration"
                    fill
                    className="object-contain object-right-bottom"
                  />
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}