"use client";

import { API_BASE_URL } from "@/lib/auth";
import Image from "next/image";
import { FiPhone, FiMail, FiMapPin, FiArrowUp, FiChevronDown } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";

interface LocationData {
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  _id: string;
  phone: string;
  phone_timing: string;
  email: string;
  email_reply_time: string;
  whatsapp: string;
  whatsapp_timing: string;
  map_embed_url: string;
  isActive: boolean;
}

interface FormData {
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Fetch location data
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/location/all`);
        const data = await response.json();
        if (data.success) {
          setLocationData(data.data);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiry/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: "Your enquiry has been sent successfully!",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Failed to send enquiry. Please try again.",
        });
      }
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format full address
  const getFullAddress = () => {
    if (!locationData) return "";
    const { address } = locationData;
    return `${address.line1}, ${address.line2}, ${address.city}, ${address.state} ${address.pincode}`;
  };

  // Format address for display in cards
  const getShortAddress = () => {
    if (!locationData) return "";
    const { address } = locationData;
    return `${address.line1}, ${address.line2}, ${address.city}, ${address.state} – ${address.pincode}`;
  };

  // Google Maps directions link
  const getDirectionsLink = () => {
    if (!locationData) return "#";
    const { address } = locationData;
    const fullAddress = `${address.line1} ${address.line2} ${address.city} ${address.state} ${address.pincode}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  };

  // Convert map URL to embeddable format
  const getEmbedMapUrl = () => {
    if (!locationData?.map_embed_url) return null;
    
    const url = locationData.map_embed_url;
    
    // If it's already an embed URL, return as is
    if (url.includes('maps/embed') || url.includes('maps/dir')) {
      return url;
    }
    
    // If it's a Google Maps share link (maps.app.goo.gl)
    if (url.includes('maps.app.goo.gl')) {
      // Extract the place ID or coordinates from the URL if possible
      // For now, use the address to generate a proper embed URL
      const { address } = locationData;
      const query = `${address.line1} ${address.line2} ${address.city} ${address.state}`;
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}`;
    }
    
    // If it's a regular Google Maps URL, try to extract the place ID
    if (url.includes('google.com/maps')) {
      // Try to extract coordinates or place ID
      const coordsMatch = url.match(/@([-\d.]+),([-\d.]+)/);
      if (coordsMatch) {
        const lat = coordsMatch[1];
        const lng = coordsMatch[2];
        return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${lat},${lng}&zoom=15`;
      }
      
      // If we have a place ID
      const placeMatch = url.match(/place\/([^/]+)/);
      if (placeMatch) {
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeMatch[1])}`;
      }
    }
    
    // Fallback: use address
    const { address } = locationData;
    const query = `${address.line1} ${address.line2} ${address.city} ${address.state}`;
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}`;
  };

  // Get the embed URL
  const embedMapUrl = getEmbedMapUrl();

  return (
    <section className="bg-[#FAF6F0] pb-10 lg:pb-14 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-16 relative">

        {/* TOP ROW - Form + Photo */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* LEFT - Form Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
            <p className="text-[#D49313] italic font-serif text-[17px] sm:text-[18px]">We'd love to</p>
            <h2 className="text-[26px] sm:text-[32px] font-serif text-[#2D3A1B] mt-1 mb-6">Hear From You</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="appearance-none w-full h-[50px] sm:h-[52px] px-4 pr-9 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] focus:outline-none focus:border-[#D49313] transition-colors"
                  >
                    <option value="" disabled>Subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="product">Product Query</option>
                  </select>
                  <FiChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A69C8F] pointer-events-none"
                    size={16}
                  />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Phone Number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                />
              </div>

              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors resize-none"
              />

              {/* Submit Status Messages */}
              {submitStatus.type && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <label className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[#8D7F73] mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-[#E8E1D8] accent-[#D49313] flex-shrink-0"
                  required
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-[#D49313] underline">Privacy Policy</a>{" "}
                  and{" "}
                  <a href="#" className="text-[#D49313] underline">Terms &amp; Conditions</a>
                </span>
              </label>

              <div className="flex flex-col items-start gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[48px] sm:h-[50px] px-7 sm:px-8 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] shadow-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <FiArrowUp size={16} className="rotate-45" />
                </button>

                <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-[#D49313] font-medium">
                  <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="flex-shrink-0">
                    <path
                      d="M1 10C4 2 7 2 9 8C11 13 14 13 16 6C18 1 21 1 23 4"
                      stroke="#D49313"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>We will get back to you soon!</span>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT - Photo with overlay copy */}
          <div className="relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[400px] lg:min-h-[520px]">
            <Image
              src="/move1.png"
              alt="Honey being drizzled into a bowl"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* CONTACT CARDS - single row of 4, icon on top, text below */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10 lg:mt-14">
          {/* Call Us */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-start gap-3 border border-transparent hover:border-[#D49313] shadow-sm transition-colors">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#D49313] flex-shrink-0">
              <FiPhone size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[16px] text-[#2D3A1B]">Call Us</span>
              <span className="text-[14px] text-[#2D3A1B] font-medium">
                {loading ? "Loading..." : locationData?.phone || "+91 123 456 7890"}
              </span>
              <span className="text-[12px] text-[#A69C8F]">
                {loading ? "..." : locationData?.phone_timing || "Mon – Sat: 9AM – 6PM"}
              </span>
            </div>
          </div>

          {/* Email Us */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-start gap-3 border border-transparent hover:border-[#D49313] shadow-sm transition-colors">
            <div className="w-11 h-11 rounded-full bg-white border border-[#E8E1D8] flex items-center justify-center flex-shrink-0">
              <FiMail size={18} className="text-[#EA4335]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[16px] text-[#2D3A1B]">Email Us</span>
              <span className="text-[14px] text-[#2D3A1B] font-medium">
                {loading ? "Loading..." : locationData?.email || "hello@shuddhadeva.com"}
              </span>
              <span className="text-[12px] text-[#A69C8F]">
                {loading ? "..." : locationData?.email_reply_time || "We reply within 24 hrs"}
              </span>
            </div>
          </div>

          {/* WhatsApp Us */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-start gap-3 border border-transparent hover:border-[#D49313] shadow-sm transition-colors">
            <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white flex-shrink-0">
              <FaWhatsapp size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[16px] text-[#2D3A1B]">WhatsApp Us</span>
              <span className="text-[14px] text-[#2D3A1B] font-medium">
                {loading ? "Loading..." : locationData?.whatsapp || "+91 987 654 3210"}
              </span>
              <span className="text-[12px] text-[#A69C8F]">
                {loading ? "..." : locationData?.whatsapp_timing || "Mon – Sat: 9AM – 6PM"}
              </span>
            </div>
          </div>

          {/* Visit Our Studio */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-start gap-3 border border-transparent hover:border-[#D49313] shadow-sm transition-colors">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#D49313] flex-shrink-0">
              <FiMapPin size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[16px] text-[#2D3A1B]">Visit Our Studio</span>
              <span className="text-[13px] text-[#2D3A1B] font-medium leading-snug">
                {loading ? "Loading..." : getShortAddress() || "123, Green Hive Road, Whitefield, Bengaluru, KA – 560066"}
              </span>
              <a
                href={getDirectionsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#D49313] font-semibold mt-0.5"
              >
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>

        {/* FULL WIDTH MAP with overlay card */}
        <div className="relative mt-10 lg:mt-12 rounded-2xl overflow-hidden bg-[#EFE9DD] min-h-[420px] lg:min-h-[480px]">
          {embedMapUrl ? (
            <iframe
              title="Shuddha Veda location map"
              src={embedMapUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#EFE9DD]">
              <p className="text-[#8D7F73]">Map not available</p>
            </div>
          )}

          {/* Bee icon + soft glow marker over the pin location */}
          <div className="hidden sm:flex absolute left-[52%] top-[38%] items-center gap-2 z-10 pointer-events-none select-none">
            <div className="w-16 h-8 rounded-full bg-[#D49313]/25 blur-md" />
            <svg
              viewBox="0 0 32 32"
              className="absolute -translate-x-[70%] -translate-y-1/2 w-7 h-7 drop-shadow-sm"
              fill="none"
            >
              <ellipse cx="16" cy="17" rx="8" ry="9" fill="#C98A1E" />
              <path d="M8 13C8 13 12 15 16 15C20 15 24 13 24 13" stroke="#2D2210" strokeWidth="1.3" />
              <path d="M9 18C9 18 12.5 19.5 16 19.5C19.5 19.5 23 18 23 18" stroke="#2D2210" strokeWidth="1.3" />
              <ellipse cx="16" cy="8" rx="3.2" ry="3" fill="#2D2210" />
              <path d="M20 8C25 4 29 6 27 11C25 15 20 12 20 8Z" fill="#F4E9D8" fillOpacity="0.75" />
              <path d="M12 8C7 4 3 6 5 11C7 15 12 12 12 8Z" fill="#F4E9D8" fillOpacity="0.75" />
              <path d="M11 6.5C11.5 5 13 4.2 14 5" stroke="#2D2210" strokeWidth="1" strokeLinecap="round" />
              <path d="M21 6.5C20.5 5 19 4.2 18 5" stroke="#2D2210" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          {/* Find Us strip - bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-4 sm:py-5 text-center z-10">
            <h3 className="font-serif text-[#2D3A1B] text-[20px] sm:text-[22px]">Find Us</h3>
            <p className="text-[12px] sm:text-[13px] text-[#8D7F73] mt-1">
              {loading ? "Loading..." : getFullAddress() || "Shuddha Veda Studio, 4A, Sri Sai Enclave, ECC Road, Whitefield, Bengaluru, Karnataka 560066"}
            </p>
            <p className="text-[12px] sm:text-[13px] text-[#8D7F73] mt-1">
              Phone: {loading ? "..." : locationData?.phone || "+91 98765 43210"} &nbsp;|&nbsp; Email: {loading ? "..." : locationData?.email || "hello@shuddhadeva.com"} &nbsp;|&nbsp; Instagram: @shuddhadeva
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}