"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
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
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { API_BASE_URL } from "@/lib/auth";

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
  id: item._id,
  label: item.address_type === "home" ? "Home" : item.address_type === "work" ? "Office" : "Other",
  isDefault: item.is_default || false,
  name: item.full_name || "",
  line: `${item.address_line1 || ""} ${item.address_line2 || ""}`.trim(),
  city: item.city || "",
  state: item.state || "",
  pincode: item.pincode || "",
  phone: item.phone || "",
});

export default function Checkout() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeStep] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    deliveryInstructions: "",
  });
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          phone_timing: loc.phone_timing || "Mon - Sat : 9AM - 6PM",
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

  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  const mapCartItemsToProducts = (items: Record<string, any>) =>
    Object.values(items).map((item: any) => {
      if (item.type === "NORMAL") {
        return {
          id: item.cartItemId,
          cartItemId: item.cartItemId,
          variantId: item.variantId || "",
          title: item.productName || item.title || "Honey",
          weight: item.weight || "",
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || "/placeholder.png",
          oldPrice: item.oldPrice || 0,
          type: item.type,
        };
      }

      return {
        id: item.cartItemId,
        cartItemId: item.cartItemId,
        variantId: "",
        title: item.productName || item.title || `🎁 Gift Box`,
        weight: item.weight || "",
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || "/placeholder.png",
        oldPrice: 0,
        type: item.type,
      };
    });

  useEffect(() => {
    const productsFromContext = mapCartItemsToProducts(cartItems);
    if (productsFromContext.length > 0) {
      setCartProducts(productsFromContext);
      setCartLoading(false);
    }
  }, [cartItems]);

  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      const stored = localStorage.getItem("applied_coupon");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.discount) setCouponDiscount(parsed.discount);
          if (parsed?.coupon?.code) setAppliedCouponCode(parsed.coupon.code);
        } catch (e) {
          console.error("Error parsing saved coupon in checkout", e);
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
      
      const rawDiscount = data.couponDiscount ?? data.discountAmount ?? data.discount ?? data.data?.discountAmount ?? 0;
      const apiDiscount = typeof rawDiscount === "string" ? parseFloat(rawDiscount) || 0 : rawDiscount;
      const apiCode = data.appliedCoupon?.code || data.couponCode || "";

      if (isMounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("applied_coupon");
        if (!stored && apiDiscount > 0) {
          setCouponDiscount(apiDiscount);
          setAppliedCouponCode(apiCode);
        }
      }

      const items = Array.isArray(data)
        ? data
        : data.items || data.data?.items || (Array.isArray(data.data) ? data.data : []) || [];
      const products: any[] = [];
      items.forEach((item: any) => {
        if (item.type === "NORMAL" && item.product) {
          const product = item.product;
          const variant = product.variant || {};
          products.push({
            id: product._id || item.cartItemId,
            cartItemId: item.cartItemId || item._id,
            variantId: variant._id || '',
            title: product.product_name || "Honey",
            weight: variant.weight ? `${variant.weight}g` : "",
            price: variant.price || 0,
            quantity: item.quantity || 1,
            image: product.image?.image_url || "/placeholder.png",
            oldPrice: variant.mrp || 0,
            type: "NORMAL",
          });
        } else if (item.type === "CUSTOM") {
          const giftBox = item.giftBox || {};
          products.push({
            id: item.giftCartItemId || item._id,
            cartItemId: item.giftCartItemId || item._id,
            variantId: '',
            title: `🎁 ${giftBox.name || "Gift Box"}`,
            weight: `${item.totalWeight || 0}g`,
            price: item.totalAmount || 0,
            quantity: item.quantity || 1,
            image: giftBox.image || "/placeholder.png",
            oldPrice: 0,
            type: "CUSTOM",
          });
        }
      });
      if (products.length > 0) {
        setCartProducts(products);
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

  const fetchAddresses = async () => {
    try {
      if (addresses.length === 0) {
        setLoading(true);
      }
      const res = await fetch(`${API_BASE_URL}/api/addresses/all`, {
        credentials: "include",
      });
      if (res.status === 401) {
        setAddresses([]);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = data.data || [];
      const list: Address[] = items.map((item: any): Address => mapApiAddress(item));
      setAddresses(list);

      const storedId = isMounted && typeof window !== "undefined" ? localStorage.getItem("selected_address_id") : null;
      const restored = storedId ? list.find((a: Address) => a.id === storedId) : null;

      if (restored) {
        setSelectedAddressId(restored.id);
      } else if (list.length > 0) {
        const defaultAddr = list.find((a: Address) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr.id);
        if (isMounted && typeof window !== "undefined") {
          localStorage.setItem("selected_address_id", defaultAddr.id);
        }
      } else {
        setSelectedAddressId("");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) {
      fetchCart();
      fetchAddresses();
      fetchLocation();
    }
  }, [isMounted]);

  const saveAddressToAPI = async (addressData: any, isEdit: boolean, addressId?: string) => {
    const payload = {
      full_name: addressData.fullName,
      phone: addressData.phone,
      address_line1: addressData.address.split(",")[0] || addressData.address,
      address_line2: addressData.address.split(",").slice(1).join(",").trim() || "",
      city: addressData.city || "Bengaluru",
      state: addressData.state || "Karnataka",
      pincode: addressData.pincode,
      country: "India",
      address_type: addressData.address_type || "home",
      is_default: addressData.isDefault || false,
    };

    const url = isEdit
      ? `${API_BASE_URL}/api/addresses/update/${addressId}`
      : `${API_BASE_URL}/api/addresses/add`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to save address");
    }
    return res.json();
  };

  const populateForm = (address: Address) => {
    setFormData({
      fullName: address.name || "",
      phone: address.phone || "",
      pincode: address.pincode || "",
      locality: address.line.split(",")[0] || "",
      address: address.line || "",
      city: address.city || "",
      state: address.state || "",
      deliveryInstructions: "",
    });
  };

  const handleEditAddress = (address: Address) => {
    populateForm(address);
    setEditingAddressId(address.id);
    setSelectedAddressId(address.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_address_id", address.id);
    }
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleAddNew = () => {
    setFormData({
      fullName: "",
      phone: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      deliveryInstructions: "",
    });
    setEditingAddressId(null);
    setIsPincodeVerified(false);
    setSelectedAddressId("");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_address_id", id);
    }
  };

  const handleSaveAddressAndContinue = async () => {
    if (!formData.fullName || !formData.phone || !formData.pincode || !formData.address) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const isEdit = editingAddressId !== null;
      const result = await saveAddressToAPI(
        {
          ...formData,
          address_type: "home",
          isDefault: addresses.length === 0 || false,
        },
        isEdit,
        editingAddressId || undefined
      );

      const savedId = result?.data?._id || result?._id || editingAddressId;
      if (typeof window !== "undefined" && savedId) {
        localStorage.setItem("selected_address_id", savedId);
      }

      await fetchAddresses();
      
      setFormData({
        fullName: "",
        phone: "",
        pincode: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        deliveryInstructions: "",
      });
      setEditingAddressId(null);
      setIsPincodeVerified(false);

      if (savedId) {
        setSelectedAddressId(savedId);
      }

      router.push("/shipping");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVerifyPincode = () => {
    if (formData.pincode.length === 6) {
      setIsPincodeVerified(true);
    } else {
      alert("Please enter a valid 6-digit pincode.");
    }
  };

  const subtotal = cartProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const saved = cartProducts.reduce(
    (sum, product) =>
      sum + Math.max((product.oldPrice || 0) - product.price, 0) * product.quantity,
    0
  );

  const isEditing = editingAddressId !== null;
  const getButtonLabel = () => (isEditing ? "Update Address & Continue" : "Add Address & Continue");

  if (!isMounted) {
    return null;
  }

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-6 sm:py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-4 sm:px-5">
        {/* 🔥 FIXED - items-stretch se dono side equal height */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_420px] items-stretch">
          
          <div 
            className="max-h-[calc(100vh-80px)] overflow-y-auto pr-1 sm:pr-2 space-y-6 sm:space-y-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <CheckoutHeader />
            <Stepper activeStep={activeStep} />

            <SavedAddresses
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={handleSelectAddress}
              onAddNew={handleAddNew}
              onEdit={handleEditAddress}
            />

            <DeliveryAddressForm
              ref={formRef}
              formData={formData}
              setFormData={setFormData}
              isPincodeVerified={isPincodeVerified}
              onVerifyPincode={handleVerifyPincode}
              onSave={handleSaveAddressAndContinue}
              buttonLabel={getButtonLabel()}
              isEditing={isEditing}
            />
            
            <div className="h-6 sm:h-8" />
          </div>

          {/* 🔥 FIXED - self-stretch se full height */}
          <aside className="sticky top-6 flex flex-col self-stretch">
            <CheckoutOrderSummary
              products={cartProducts}
              subtotal={subtotal}
              saved={saved}
              couponDiscount={couponDiscount}
              couponCode={appliedCouponCode}
              location={location}
              selectedAddressId={selectedAddressId}
              onProceedDirectly={() => {
                if (!selectedAddressId) {
                  alert("Please select a delivery address first.");
                  return;
                }
                if (typeof window !== "undefined") {
                  localStorage.setItem("selected_address_id", selectedAddressId);
                }
                router.push("/shipping");
              }}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function CheckoutHeader() {
  return (
    <div className="relative mb-2 sm:mb-4">
      <h1 className="font-serif text-[26px] sm:text-[34px] font-bold">Checkout</h1>
      <p className="mt-1 text-[13px] sm:text-[14px] text-[#7B8493]">
        Almost there! Just a few more details to get your pure honey.
      </p>
      <Image
        src="/need.png"
        alt="Honey illustration"
        width={180}
        height={70}
        className="absolute right-0 -top-4 sm:-top-6 hidden sm:block object-contain"
      />
    </div>
  );
}

function Stepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="rounded-lg border border-[#F4D7B8] bg-white/55 px-2 sm:px-4 py-3 sm:py-4 shadow-sm mb-2 sm:mb-4">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step) => {
          const isDone = step.id < activeStep;
          const isActive = step.id === activeStep;
          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 items-center gap-1 sm:gap-3">
                <span
                  className={`hidden sm:flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border text-[14px] sm:text-[16px] font-bold ${
                    isDone
                      ? "border-[#77AE61] bg-white text-[#77AE61]"
                      : isActive
                      ? "border-[#D18500] bg-[#D18500] text-white"
                      : "border-[#F0DDC8] bg-white text-[#2F241C]"
                  }`}
                >
                  {isDone ? <CheckCircle2 size={22} className="sm:w-[28px] sm:h-[28px]" strokeWidth={1.8} /> : step.id}
                </span>
                <span
                  className={`sm:hidden h-3 w-3 rounded-full shrink-0 ${
                    isDone ? "bg-[#77AE61]" : isActive ? "bg-[#D18500]" : "bg-[#F0DDC8]"
                  }`}
                />
                <div className="min-w-0">
                  <p
                    className={`text-[11px] sm:text-[15px] font-semibold leading-tight truncate ${
                      isActive ? "text-[#D18500]" : "text-[#2F241C]"
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
                <span className="mx-1 sm:mx-3 hidden sm:block shrink-0 text-[20px] sm:text-[26px] leading-none text-[#F0A33A]">
                  &rsaquo;
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type DeliveryAddressFormProps = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isPincodeVerified: boolean;
  onVerifyPincode: () => void;
  onSave: () => void;
  buttonLabel: string;
  isEditing: boolean;
};

const DeliveryAddressForm = forwardRef<HTMLDivElement, DeliveryAddressFormProps>(
  (
    {
      formData,
      setFormData,
      isPincodeVerified,
      onVerifyPincode,
      onSave,
      buttonLabel,
      isEditing,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
      <div ref={ref} className="rounded-[16px] border border-[#F2EFE9] bg-white p-5 sm:p-7">
        <h2 className="font-serif text-[17px] sm:text-[19px] font-bold">
          {isEditing ? "Edit Delivery Address" : "Or Add a New Address"}
        </h2>
        <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2">
          <FormField
            label="Full Name"
            required
            placeholder="Enter your full name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          <FormField
            label="Phone Number"
            required
            placeholder="Enter 10 digit mobile number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <FormField
            label="Pincode"
            required
            placeholder="Enter pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            action={{
              label: "Verify",
              onClick: onVerifyPincode,
              done: isPincodeVerified,
            }}
          />
          <FormField
            label="Locality / Area"
            required
            placeholder="Enter locality or area"
            name="locality"
            value={formData.locality}
            onChange={handleChange}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Address (House No., Building, Street)"
              required
              placeholder="Enter complete address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <FormField
            label="City / Town"
            required
            placeholder="Enter city or town"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <FormField
            label="State"
            required
            placeholder="Select state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            as="select"
          />
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            className="flex h-11 sm:h-12 items-center gap-2 rounded-lg bg-[#D18500] px-5 sm:px-6 text-[13px] sm:text-[14px] font-bold text-white hover:bg-[#B97100] w-full sm:w-auto justify-center"
          >
            {buttonLabel}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }
);
DeliveryAddressForm.displayName = "DeliveryAddressForm";

function FormField({ label, required, optional, placeholder, name, value, onChange, action, as = "input" }: any) {
  return (
    <div>
      <label className="mb-1 block text-[12px] sm:text-[13px] font-semibold text-[#2F241C]">
        {label}
        {required && <span className="text-red-500">*</span>}
        {optional && <span className="ml-1 text-[10px] sm:text-[11px] font-normal text-[#9AA3AF]">(Optional)</span>}
      </label>
      <div className="flex gap-2">
        {as === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="h-10 sm:h-11 w-full rounded-lg border border-[#E3E6EB] bg-white px-3 text-[12px] sm:text-[13px] text-[#2F241C] outline-none focus:border-[#2D3A1B]"
          >
            <option value="">{placeholder}</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
          </select>
        ) : (
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="h-10 sm:h-11 w-full rounded-lg border border-[#E3E6EB] px-3 text-[12px] sm:text-[13px] text-[#2F241C] outline-none placeholder:text-[#B5BBC5] focus:border-[#2D3A1B]"
          />
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`flex h-10 sm:h-11 shrink-0 items-center gap-1.5 rounded-lg px-4 sm:px-5 text-[12px] sm:text-[13px] font-bold text-white transition-colors ${
              action.done ? "bg-[#0BA445]" : "bg-[#D18500] hover:bg-[#B97100]"
            }`}
          >
            {action.done && <CheckCircle2 size={14} />}
            {action.done ? "Verified" : action.label}
          </button>
        )}
      </div>
    </div>
  );
}

function SavedAddresses({ addresses, selectedId, onSelect, onAddNew, onEdit }: any) {
  if (addresses.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-5 sm:p-7 text-center text-[#B59A78]">
        No saved addresses. Please fill the form below to add one.
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#F2EFE9] bg-white p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[17px] sm:text-[19px] font-bold">Select Saved Address</h2>
        <button
          type="button"
          onClick={onAddNew}
          className="text-[12px] sm:text-[13px] font-semibold text-[#2D3A1B] hover:underline"
        >
          + Add New
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2">
        {addresses.map((address: Address) => {
          const isSelected = selectedId === address.id;
          return (
            <div
              key={address.id}
              onClick={() => onSelect(address.id)}
              className={`cursor-pointer rounded-[14px] border p-4 sm:p-5 text-left transition-colors ${
                isSelected
                  ? "border-[#2D3A1B] bg-[#FFF8EF] shadow-sm ring-1 ring-[#2D3A1B]"
                  : "border-[#EEF1F4] bg-white hover:border-[#E3D3B4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold">
                  <span
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-2 ${
                      isSelected ? "border-[#2D3A1B] bg-[#2D3A1B]" : "border-[#CBD2DB] bg-white"
                    }`}
                  />
                  {address.label}
                  {address.isDefault && (
                    <span className="text-[10px] sm:text-[11px] font-normal text-[#2D3A1B]">(Default)</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(address);
                  }}
                  className="text-[11px] sm:text-[12px] font-semibold text-[#2D3A1B] hover:underline"
                >
                  ✎ Edit
                </button>
              </div>
              <p className="mt-2 sm:mt-3 text-[12px] sm:text-[13px] leading-relaxed text-[#4C5362]">
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
          );
        })}
      </div>
    </div>
  );
}

function CheckoutOrderSummary({ products, subtotal, saved, couponDiscount = 0, couponCode = "", location, selectedAddressId, onProceedDirectly }: any) {
  const finalTotal = Math.max(subtotal - couponDiscount, 0);
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);

  return (
    <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col p-4 sm:p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[18px] sm:text-[20px] font-bold">Order Summary</h2>
        <span className="text-[11px] sm:text-[12px] text-[#9AA3AF]">{products.length} Items</span>
      </div>

      {/* Items with scroll - exactly 2 visible, scrollbar hidden */}
      <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 max-h-[90px] sm:max-h-[115px] overflow-y-auto scrollbar-hide">
        {products.length === 0 ? (
          <p className="text-center text-[#9AA3AF]">Your cart is empty.</p>
        ) : (
          products.map((product: any, index: number) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-md bg-[#FFF8EF]">
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

      {/* Pricing */}
      <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 border-t border-[#EEF1F4] pt-3 sm:pt-4 text-[12px] sm:text-[13px] text-[#6F7786]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <strong className="text-[#2D3A1B]">₹{subtotal.toLocaleString("en-IN")}</strong>
        </div>
        <div className="flex justify-between">
          <span>You Save</span>
          <strong className="text-[#0BA445]">- ₹{saved.toLocaleString("en-IN")}</strong>
        </div>
        {couponDiscount > 0 && (
          <div className="mt-2 rounded-xl border border-dashed border-[#0BA445]/40 bg-[#F0FFF4] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0BA445] text-white text-[10px] font-bold">✓</span>
                <span className="text-[12px] font-bold text-[#187A37]">Coupon Applied</span>
              </div>
              <span className="text-[13px] font-bold text-[#0BA445]">- ₹{couponDiscount.toLocaleString("en-IN")}</span>
            </div>
            {couponCode && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {couponCode.split(',').map((code: string, i: number) => (
                  <span key={i} className="inline-block rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-[#187A37] border border-[#D7F3D9]">
                    {code.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mt-3 sm:mt-4 flex items-end justify-between border-t border-[#EEF1F4] pt-3 sm:pt-4">
        <div>
          <p className="text-[18px] sm:text-[21px] font-bold">Total</p>
          <p className="text-[9px] sm:text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
        </div>
        <p className="font-serif text-[24px] sm:text-[28px] font-bold">₹{finalTotal.toLocaleString("en-IN")}</p>
      </div>

      {/* Button + Saving Badge + Need Help - neeche attach */}
      <div className="mt-auto space-y-3 sm:space-y-4 pb-4">
        {selectedAddressId && (
          <button
            type="button"
            onClick={onProceedDirectly}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D18500] text-[14px] font-bold text-white shadow-md hover:bg-[#B97100] transition"
          >
            Proceed with Selected Address <ArrowRight size={16} />
          </button>
        )}

        <div className="rounded-[14px] border border-[#D7F3D9] bg-[#F0FFF4] p-3 sm:p-4">
          <p className="flex items-center gap-2 text-[12px] sm:text-[13px] font-semibold text-[#187A37]">
            <ShieldCheck size={14} /> You&apos;re saving ₹{(saved + couponDiscount).toLocaleString("en-IN")} on this order!
          </p>
          {remaining > 0 && (
            <p className="mt-1.5 text-[11px] text-[#4C5362]"></p>
          )}
        </div>

        <div>
          <h2 className="font-serif text-[17px] sm:text-[19px] font-bold">Need help ?</h2>
          <div className="mt-2 sm:mt-3 space-y-1.5 text-[14px] text-[#6F7786]">
            <p className="flex items-center gap-2"><Phone size={14} /> {location?.phone || "+91 98765 43210"}</p>
            <p className="flex items-center gap-2"><Mail size={14} /> {location?.email || "connect@honeyveda.in"}</p>
            <p className="flex items-center gap-2"><Clock size={14} /> {location?.phone_timing || "Mon - Sat : 9AM - 6PM"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}