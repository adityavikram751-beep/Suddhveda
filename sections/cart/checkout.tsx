"use client";

import { useState, useEffect } from "react";
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

// Map API address to UI address
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

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    deliveryInstructions: "",
  });
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // ---------- Location (for Need Help) ----------
  const [location, setLocation] = useState<LocationData | null>(null);

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

  // ---------- Cart ----------
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
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
      const items = data.items || [];
      const products: any[] = [];
      items.forEach((item: any) => {
        if (item.type === "NORMAL" && item.product) {
          const product = item.product;
          const variant = product.variant || {};
          products.push({
            id: product._id || item.cartItemId,
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
            id: item.giftCartItemId,
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
      setCartProducts(products);
    } catch (err: any) {
      console.error("Error fetching cart:", err);
      setCartError(err.message || "Failed to load cart");
      setCartProducts([]);
    } finally {
      setCartLoading(false);
    }
  };

  // ---------- Addresses ----------
  const fetchAddresses = async () => {
    try {
      setLoading(true);
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
      // ✅ Explicit type for map callback and the resulting array
      const list: Address[] = items.map((item: any): Address => mapApiAddress(item));
      setAddresses(list);
      if (list.length > 0) {
        const defaultAddr = list.find((a: Address) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr.id);
        populateForm(defaultAddr);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
    fetchLocation();
  }, []);

  // ---------- Save Address API ----------
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

  // ---------- Form handlers ----------
  const populateForm = (address: Address) => {
    setFormData({
      fullName: address.name || "",
      phone: address.phone || "",
      pincode: address.pincode || "",
      locality: address.line.split(",")[0] || "",
      address: address.line || "",
      landmark: "",
      city: address.city || "",
      state: address.state || "",
      deliveryInstructions: "",
    });
  };

  const handleEditAddress = (address: Address) => {
    populateForm(address);
    setEditingAddressId(address.id);
    setSelectedAddressId(address.id);
  };

  const handleAddNew = () => {
    setFormData({
      fullName: "",
      phone: "",
      pincode: "",
      locality: "",
      address: "",
      landmark: "",
      city: "",
      state: "",
      deliveryInstructions: "",
    });
    setEditingAddressId(null);
    setIsPincodeVerified(false);
  };

  const handleSaveAddressAndContinue = async () => {
    if (!formData.fullName || !formData.phone || !formData.pincode || !formData.address) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const isEdit = !!editingAddressId;
      await saveAddressToAPI(
        {
          ...formData,
          address_type: "home",
          isDefault: addresses.length === 0 || false,
        },
        isEdit,
        editingAddressId || undefined
      );
      await fetchAddresses();
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

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    setEditingAddressId(null);
    const addr = addresses.find((a) => a.id === id);
    if (addr) populateForm(addr);
  };

  // ---------- Computed totals ----------
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
  const getButtonLabel = () => (isEditing ? "Update Address & Continue" : "Add Your Address");

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] items-start">
          <section>
            <CheckoutHeader />
            <Stepper activeStep={activeStep} />

            <DeliveryAddressForm
              formData={formData}
              setFormData={setFormData}
              isPincodeVerified={isPincodeVerified}
              onVerifyPincode={handleVerifyPincode}
              onSave={handleSaveAddressAndContinue}
              buttonLabel={getButtonLabel()}
              isEditing={isEditing}
            />

            {loading ? (
              <div className="mt-8 text-center py-10 text-[#B59A78]">Loading addresses...</div>
            ) : (
              <SavedAddresses
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={handleSelectAddress}
                onAddNew={handleAddNew}
                onEdit={handleEditAddress}
              />
            )}
          </section>

          <aside className="lg:sticky lg:top-6 flex flex-col">
            {cartLoading ? (
              <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-8 text-center text-[#B59A78]">
                Loading cart...
              </div>
            ) : cartError ? (
              <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-8 text-center text-red-600">
                {cartError}
              </div>
            ) : (
              <CheckoutOrderSummary
                products={cartProducts}
                subtotal={subtotal}
                saved={saved}
                location={location}
              />
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────

function CheckoutHeader() {
  return (
    <div className="relative">
      <h1 className="font-serif text-[34px] font-bold">Checkout</h1>
      <p className="mt-1 text-[14px] text-[#7B8493]">
        Almost there! Just a few more details to get your pure honey.
      </p>
      <Image
        src="/need.png"
        alt="Honey illustration"
        width={200}
        height={80}
        className="absolute right-0 -top-6 hidden object-contain sm:block"
      />
    </div>
  );
}

function Stepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="mt-8 rounded-lg border border-[#F4D7B8] bg-white/55 px-3 py-4 shadow-sm md:px-4">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step) => {
          const isDone = step.id < activeStep;
          const isActive = step.id === activeStep;
          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-[16px] font-bold ${
                    isDone
                      ? "border-[#77AE61] bg-white text-[#77AE61]"
                      : isActive
                      ? "border-[#D18500] bg-[#D18500] text-white"
                      : "border-[#F0DDC8] bg-white text-[#2F241C]"
                  }`}
                >
                  {isDone ? <CheckCircle2 size={28} strokeWidth={1.8} /> : step.id}
                </span>
                <div className="hidden min-w-0 sm:block">
                  <p
                    className={`text-[15px] font-semibold leading-tight ${
                      isActive ? "text-[#D18500]" : "text-[#2F241C]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="mt-1 truncate text-[12px] leading-tight text-[#596273]">
                    {step.subtitle}
                  </p>
                </div>
              </div>
              {step.id < steps.length && (
                <span className="mx-3 hidden shrink-0 text-[26px] leading-none text-[#F0A33A] md:block">
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

function DeliveryAddressForm({
  formData,
  setFormData,
  isPincodeVerified,
  onVerifyPincode,
  onSave,
  buttonLabel,
  isEditing,
}: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-6 rounded-[16px] border border-[#F2EFE9] bg-white p-7">
      <h2 className="font-serif text-[19px] font-bold">Delivery Address</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
          label="Landmark"
          optional
          placeholder="E.g. Near post office, school, etc."
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
        />
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
        <FormField
          label="Delivery Instructions"
          optional
          placeholder="Any special instructions for delivery"
          name="deliveryInstructions"
          value={formData.deliveryInstructions}
          onChange={handleChange}
        />
      </div>

      <label className="mt-5 flex items-center gap-2 text-[13px] text-[#4C5362]">
        <input type="checkbox" className="h-4 w-4 rounded border-[#D3D8DF]" />
        Save this address for faster checkout next time
      </label>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          className="flex h-12 items-center gap-2 rounded-lg bg-[#D18500] px-6 text-[14px] font-bold text-white hover:bg-[#B97100]"
        >
          {buttonLabel}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  optional,
  placeholder,
  name,
  value,
  onChange,
  action,
  as = "input",
}: any) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#2F241C]">
        {label}
        {required && <span className="text-red-500">*</span>}
        {optional && (
          <span className="ml-1 text-[11px] font-normal text-[#9AA3AF]">(Optional)</span>
        )}
      </label>
      <div className="flex gap-2">
        {as === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="h-11 w-full rounded-lg border border-[#E3E6EB] bg-white px-3 text-[13px] text-[#2F241C] outline-none focus:border-[#2D3A1B]"
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
            className="h-11 w-full rounded-lg border border-[#E3E6EB] px-3 text-[13px] text-[#2F241C] outline-none placeholder:text-[#B5BBC5] focus:border-[#2D3A1B]"
          />
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-5 text-[13px] font-bold text-white transition-colors ${
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

function SavedAddresses({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onEdit,
}: {
  addresses: Address[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddNew: () => void;
  onEdit: (address: Address) => void;
}) {
  if (addresses.length === 0) {
    return (
      <div className="mt-8 rounded-[16px] border border-[#F2EFE9] bg-white p-7 text-center text-[#B59A78]">
        No saved addresses. Add one below.
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-[16px] border border-[#F2EFE9] bg-white p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[19px] font-bold">Saved Addresses</h2>
        <button
          type="button"
          onClick={onAddNew}
          className="text-[13px] font-semibold text-[#2D3A1B] hover:underline"
        >
          + Add New
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {addresses.map((address: Address) => {
          const isSelected = selectedId === address.id;
          return (
            <div
              key={address.id}
              onClick={() => onSelect(address.id)}
              className={`cursor-pointer rounded-[14px] border p-5 text-left transition-colors ${
                isSelected
                  ? "border-[#2D3A1B] bg-[#FFF8EF]"
                  : "border-[#EEF1F4] bg-white hover:border-[#E3D3B4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[14px] font-bold">
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      isSelected
                        ? "border-[#2D3A1B] bg-[#2D3A1B]"
                        : "border-[#CBD2DB] bg-white"
                    }`}
                  />
                  {address.label}
                  {address.isDefault && (
                    <span className="text-[11px] font-normal text-[#2D3A1B]">(Default)</span>
                  )}
                </span>
                {isSelected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(address);
                    }}
                    className="text-[12px] font-semibold text-[#2D3A1B] hover:underline"
                  >
                    ✎ Edit
                  </button>
                )}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#4C5362]">
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

// ORDER SUMMARY
type CheckoutProduct = {
  id: number | string;
  title: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
  oldPrice?: number;
  type?: string;
};

function CheckoutOrderSummary({
  products,
  subtotal,
  saved,
  location,
}: {
  products: CheckoutProduct[];
  subtotal: number;
  saved: number;
  location: LocationData | null;
}) {
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  return (
    <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col min-h-[720px]">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
        <span className="text-[12px] text-[#9AA3AF]">{products.length} Items</span>
      </div>

      <div className="mt-5 max-h-[280px] space-y-4 overflow-y-auto pr-1 scrollbar-hide">
        {products.length === 0 ? (
          <p className="text-center text-[#9AA3AF]">Your cart is empty.</p>
        ) : (
          // ✅ Explicitly type the product parameter
          products.map((product: CheckoutProduct) => (
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
                  {product.weight || "Selected weight"} - {product.type === "CUSTOM" ? "Gift Box" : "Raw & Unfiltered"}
                </p>
                <p className="text-[11px] text-[#9AA3AF]">Qty: {product.quantity}</p>
              </div>
              <p className="text-[14px] font-bold">₹{product.price}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 space-y-3 border-t border-[#EEF1F4] pt-5 text-[13px] text-[#6F7786]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <strong className="text-[#2D3A1B]">₹{subtotal.toLocaleString("en-IN")}</strong>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <strong className="text-[#0BA445]">FREE</strong>
        </div>
        <div className="flex justify-between">
          <span>You Save</span>
          <strong className="text-[#0BA445]">- ₹{saved}</strong>
        </div>
        <div className="flex justify-between">
          <span>Coupon Applied</span>
          <strong className="text-[#0BA445]">- ₹{saved}</strong>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
        <div>
          <p className="text-[21px] font-bold">Total</p>
          <p className="text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
        </div>
        <p className="font-serif text-[28px] font-bold">₹{subtotal.toLocaleString("en-IN")}</p>
      </div>

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

      <div className="mt-auto pt-24">
        <div className="rounded-[14px] bg-[#FFF8EF] p-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <span className="p-1">
              <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
              <p className="text-[10px] font-bold text-[#2F241C]">Secure Checkout</p>
              <p className="text-[9px] text-[#9AA3AF]">100% safe payments</p>
            </span>
            <span className="p-1">
              <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
              <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
              <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
            </span>
            <span className="p-1">
              <Leaf className="mx-auto mb-1 h-5 w-5 text-[#2D3A1B]" />
              <p className="text-[10px] font-bold text-[#2F241C]">100% Natural</p>
              <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
            </span>
          </div>

          {/* Need Help Section - populated from location API */}
          <div className="relative mt-6">
            <h2 className="font-serif text-[19px] font-bold">Need help ?</h2>
            <div className="mt-3 space-y-2 text-[15px] text-[#6F7786]">
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-[#2D3A1B]" />
                {location?.phone || "+91 98765 43210"}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-[#2D3A1B]" />
                {location?.email || "connect@honeyveda.in"}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={16} className="text-[#2D3A1B]" />
                {location?.phone_timing || "Mon - Sat : 9AM - 6PM"}
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

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}