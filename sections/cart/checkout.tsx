"use client";

import { useState } from "react";
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
  ChevronRight,
  CheckCircle2,
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

const initialAddresses: Address[] = [
  {
    id: "home",
    label: "Home",
    isDefault: true,
    name: "Rahul Sharma",
    line: "123, Green Avenue, Near City Park, Koramangala",
    city: "Bengaluru",
    state: "Karnataka, India",
    pincode: "560034",
    phone: "+91 98765 43210",
  },
  {
    id: "office",
    label: "Office",
    isDefault: false,
    name: "Rahul Sharma",
    line: "ShudhVeda Naturals Pvt. Ltd., 45, 2nd Cross, HSR Layout",
    city: "Bengaluru",
    state: "Karnataka, India",
    pincode: "560102",
    phone: "+91 98765 43210",
  },
];

export default function Checkout() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("home");
  const [activeStep] = useState<number>(1);

  // Form fields state
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

  // Helper: populate form from address
  const populateForm = (address: Address) => {
    setFormData({
      fullName: address.name,
      phone: address.phone,
      pincode: address.pincode,
      locality: address.line.split(",")[0] || "",
      address: address.line,
      landmark: "",
      city: address.city,
      state: address.state,
      deliveryInstructions: "",
    });
  };

  // Handle Edit click – populate form and set editing mode
  const handleEditAddress = (address: Address) => {
    populateForm(address);
    setEditingAddressId(address.id);
    setSelectedAddressId(address.id);
  };

  // Handle Add New – clear form and set editing mode to null
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

  // Save address (add or update) and navigate to shipping
  const handleSaveAddressAndContinue = () => {
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.pincode || !formData.address) {
      alert("Please fill all required fields.");
      return;
    }

    const newAddress: Address = {
      id: editingAddressId || `addr-${Date.now()}`,
      label: editingAddressId ? "Home" : "Other",
      isDefault: addresses.length === 0,
      name: formData.fullName,
      line: formData.address,
      city: formData.city || "Bengaluru",
      state: formData.state || "Karnataka, India",
      pincode: formData.pincode,
      phone: formData.phone,
    };

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddressId ? newAddress : a))
      );
    } else {
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
    }

    router.push("/shipping");
  };

  const isEditing = editingAddressId !== null;
  const getButtonLabel = () => {
    if (isEditing) return "Update Address & Continue";
    return "Add Your Address";
  };

  const handleVerifyPincode = () => {
    setIsPincodeVerified(true);
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    setEditingAddressId(null);
  };

  return (
    <main className="bg-[#FFF8EF] min-h-screen py-10 text-[#2F241C]">
      <div className="mx-auto max-w-[1410px] px-5">
        <Breadcrumb />

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

            <SavedAddresses
              addresses={addresses}
              selectedId={selectedAddressId}
              onSelect={handleSelectAddress}
              onAddNew={handleAddNew}
              onEdit={handleEditAddress}
            />
          </section>

          <aside className="lg:sticky lg:top-6 flex flex-col">
            <CheckoutOrderSummary
              products={visibleProducts}
              subtotal={subtotal}
              saved={saved}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────

function Breadcrumb() {
  return (
    <nav className="mb-6 text-sm text-[#7B8493]">
      <Link href="/" className="font-medium text-[#2F241C] hover:text-[#D89A1B]">
        Home
      </Link>{" "}
      &gt;{" "}
      <Link href="/cart" className="font-medium text-[#2F241C] hover:text-[#D89A1B]">
        Cart
      </Link>{" "}
      &gt; <span className="font-semibold text-[#D89A1B]">Checkout</span>
    </nav>
  );
}

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
    <div className="mt-8 rounded-[16px] border border-[#F2EFE9] bg-white px-6 py-5">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isDone = step.id < activeStep;
          const showArrow = step.id <= activeStep;
          return (
            <div
              key={step.id}
              className={`flex flex-1 items-center last:flex-none rounded-lg px-3 py-2 transition-colors ${
                isActive ? "bg-[#FFF8EF]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${
                    isActive || isDone
                      ? "bg-[#D89A1B] text-white"
                      : "bg-[#F1F2F4] text-[#8A94A6]"
                  }`}
                >
                  {step.id}
                </span>
                <div className="hidden sm:block">
                  <p
                    className={`text-[14px] font-semibold ${
                      isActive ? "text-[#D89A1B]" : "text-[#2F241C]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-[#9AA3AF]">{step.subtitle}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-4 flex flex-1 items-center">
                  <span className="h-px flex-1 bg-[#EEF1F4]" />
                  {showArrow && (
                    <ChevronRight size={18} className="mx-0.5 shrink-0 text-[#D89A1B]" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Delivery Address Form ──────────────────────────────────────

function DeliveryAddressForm({
  formData,
  setFormData,
  isPincodeVerified,
  onVerifyPincode,
  onSave,
  buttonLabel,
  isEditing,
}: {
  formData: any;
  setFormData: (data: any) => void;
  isPincodeVerified: boolean;
  onVerifyPincode: () => void;
  onSave: () => void;
  buttonLabel: string;
  isEditing: boolean;
}) {
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

// ─── Reusable Form Field ──────────────────────────────────────

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
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  action?: { label: string; onClick: () => void; done?: boolean };
  as?: "input" | "select";
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#2F241C]">
        {label}
        {required && <span className="text-red-500">*</span>}
        {optional && (
          <span className="ml-1 text-[11px] font-normal text-[#9AA3AF]">
            (Optional)
          </span>
        )}
      </label>
      <div className="flex gap-2">
        {as === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="h-11 w-full rounded-lg border border-[#E3E6EB] bg-white px-3 text-[13px] text-[#2F241C] outline-none focus:border-[#D89A1B]"
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
            className="h-11 w-full rounded-lg border border-[#E3E6EB] px-3 text-[13px] text-[#2F241C] outline-none placeholder:text-[#B5BBC5] focus:border-[#D89A1B]"
          />
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-5 text-[13px] font-bold text-white transition-colors ${
              action.done ? "bg-[#0BA445] hover:bg-[#0A8F3B]" : "bg-[#D18500] hover:bg-[#B97100]"
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

// ─── Saved Addresses (no continue button) ─────────────────────

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
  return (
    <div className="mt-8 rounded-[16px] border border-[#F2EFE9] bg-white p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[19px] font-bold">Saved Addresses</h2>
        <button
          type="button"
          onClick={onAddNew}
          className="text-[13px] font-semibold text-[#D89A1B] hover:underline"
        >
          + Add New
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => {
          const isSelected = selectedId === address.id;
          return (
            <div
              key={address.id}
              onClick={() => onSelect(address.id)}
              className={`cursor-pointer rounded-[14px] border p-5 text-left transition-colors ${
                isSelected
                  ? "border-[#D89A1B] bg-[#FFF8EF]"
                  : "border-[#EEF1F4] bg-white hover:border-[#E3D3B4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[14px] font-bold">
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      isSelected
                        ? "border-[#D89A1B] bg-[#D89A1B]"
                        : "border-[#CBD2DB] bg-white"
                    }`}
                  />
                  {address.label}
                  {address.isDefault && (
                    <span className="text-[11px] font-normal text-[#D89A1B]">
                      (Default)
                    </span>
                  )}
                </span>
                {isSelected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(address);
                    }}
                    className="text-[12px] font-semibold text-[#D89A1B] hover:underline"
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

// ─── Order Summary ────────────────────────────────────────────

type CheckoutProduct = {
  id: number;
  title: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
};

function CheckoutOrderSummary({
  products,
  subtotal,
  saved,
}: {
  products: CheckoutProduct[];
  subtotal: number;
  saved: number;
}) {
  const remaining = Math.max(freeDeliveryTarget - subtotal, 0);
  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  return (
    <div className="w-full rounded-[22px] border border-[#F2EFE9] bg-white -mt-8 p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col h-full">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[20px] font-bold">Order Summary</h2>
        <span className="text-[12px] text-[#9AA3AF]">{products.length} Items</span>
      </div>

      <div className="mt-5 max-h-[280px] space-y-4 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E3D3B4] [&::-webkit-scrollbar-track]:bg-transparent">
        {products.map((product) => (
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
              <p className="text-[11px] text-[#9AA3AF]">Qty: {product.quantity}</p>
            </div>
            <p className="text-[14px] font-bold">₹{product.price}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-[#EEF1F4] pt-5 text-[13px] text-[#6F7786]">
        <div className="flex justify-between">
          <span>Subtotal</span>
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

      <div className="mt-6 flex items-end justify-between border-t border-[#EEF1F4] pt-6">
        <div>
          <p className="text-[21px] font-bold">Total</p>
          <p className="text-[10px] text-[#9AA3AF]">(Inclusive of all taxes)</p>
        </div>
        <p className="text-[26px] font-bold">₹{subtotal.toLocaleString("en-IN")}</p>
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

      <TrustBadges />

      {/* Need Help – attached at bottom of the same card */}
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
  );
}

// ─── Trust Badges ──────────────────────────────────────────────

function TrustBadges() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-3 text-center">
      <span className="rounded-lg bg-white p-3 shadow-sm">
        <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        <p className="text-[10px] font-bold text-[#2F241C]">Secure Checkout</p>
        <p className="text-[9px] text-[#9AA3AF]">100% safe payments</p>
      </span>
      <span className="rounded-lg bg-white p-3 shadow-sm">
        <RotateCcw className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        <p className="text-[10px] font-bold text-[#2F241C]">Easy Returns</p>
        <p className="text-[9px] text-[#9AA3AF]">Hassle-free returns</p>
      </span>
      <span className="rounded-lg bg-white p-3 shadow-sm">
        <Leaf className="mx-auto mb-1 h-5 w-5 text-[#D89A1B]" />
        <p className="text-[10px] font-bold text-[#2F241C]">100% Natural</p>
        <p className="text-[9px] text-[#9AA3AF]">Pure & unadulterated</p>
      </span>
    </div>
  );
}