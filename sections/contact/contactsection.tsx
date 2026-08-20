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
  const [isMapActive, setIsMapActive] = useState(false);
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
    if (!locationData) return "Whitefield, Bengaluru, Karnataka 560066";
    const { address } = locationData;
    return `${address.line1}, ${address.line2}, ${address.city}, ${address.state} ${address.pincode}`;
  };

  // Format address for display in cards
  const getShortAddress = () => {
    if (!locationData) return "Whitefield, Bengaluru, KA – 560066";
    const { address } = locationData;
    return `${address.line1}, ${address.line2}, ${address.city}, ${address.state} – ${address.pincode}`;
  };

  // Google Maps directions / open link
  const getDirectionsLink = () => {
    if (!locationData) return "https://www.google.com/maps";
    const { address } = locationData;
    const fullAddress = `${address.line1} ${address.line2} ${address.city} ${address.state} ${address.pincode}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  };

  // Convert map URL to embeddable format safely
  const getEmbedMapUrl = () => {
    if (!locationData?.map_embed_url) {
      const query = getFullAddress();
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}`;
    }
    
    const url = locationData.map_embed_url;

    if (url.includes('<iframe')) {
      const match = url.match(/src="([^"]+)"/);
      if (match && match[1]) return match[1];
    }
    
    if (url.includes('maps/embed') || url.includes('maps/dir')) {
      return url;
    }
    
    if (url.includes('maps.app.goo.gl') || url.includes('google.com/maps')) {
      const { address } = locationData;
      if (address) {
        const query = `${address.line1} ${address.line2} ${address.city} ${address.state}`;
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}`;
      }
    }
    
    return url;
  };

  const embedMapUrl = getEmbedMapUrl();

  const phoneNumber = locationData?.phone || "+911234567890";
  const emailAddress = locationData?.email || "hello@shuddhadeva.com";
  const whatsappNumber = locationData?.whatsapp || "+919876543210";

  return (
    <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] pb-12 lg:pb-16 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-16 relative">

        {/* TOP ROW - Form + Photo */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* LEFT - Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#EADCC9] shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] border border-[#D49313]/40 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase text-[#593102] tracking-[0.16em] mb-2">
                <span>WE&apos;D LOVE TO</span>
              </div>
              <h2 className="text-[28px] sm:text-[34px] font-serif font-extrabold text-[#593102] mt-1 mb-6">
                Hear From You
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[50px] sm:h-[52px] px-4 rounded-xl border border-[#EADCC9] bg-[#FAF9F7] text-[14px] font-medium text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[50px] sm:h-[52px] px-4 rounded-xl border border-[#EADCC9] bg-[#FAF9F7] text-[14px] font-medium text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="appearance-none w-full h-[50px] sm:h-[52px] px-4 pr-9 rounded-xl border border-[#EADCC9] bg-[#FAF9F7] text-[14px] font-medium text-[#593102] focus:outline-none focus:border-[#D49313] transition-colors cursor-pointer"
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
                    className="w-full h-[50px] sm:h-[52px] px-4 rounded-xl border border-[#EADCC9] bg-[#FAF9F7] text-[14px] font-medium text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                  />
                </div>

                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#EADCC9] bg-[#FAF9F7] text-[14px] font-medium text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors resize-none"
                />

                {/* Submit Status Messages */}
                {submitStatus.type && (
                  <div
                    className={`p-3 rounded-xl text-sm font-medium ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <label className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[#6E5D4F] font-medium mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 rounded border-[#EADCC9] accent-[#D49313] flex-shrink-0 cursor-pointer"
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-[#D49313] font-bold underline">Privacy Policy</a>{" "}
                    and{" "}
                    <a href="#" className="text-[#D49313] font-bold underline">Terms &amp; Conditions</a>
                  </span>
                </label>

                <div className="flex flex-col items-start gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#FA4B1B] hover:bg-[#E64216] text-white h-[40px] px-5 sm:px-6 rounded-xl flex items-center justify-center gap-2 font-extrabold text-[12px] sm:text-[13px] tracking-wide uppercase shadow-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <FiArrowUp size={14} className="rotate-45" />
                  </button>

                  <div className="flex items-center gap-2 text-[12.5px] text-[#D49313] font-bold">
                    <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="flex-shrink-0">
                      <path
                        d="M1 10C4 2 7 2 9 8C11 13 14 13 16 6C18 1 21 1 23 4"
                        stroke="#D49313"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>We will get back to you soon!</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT - Photo Card */}
          <div className="relative rounded-3xl overflow-hidden min-h-[340px] sm:min-h-[400px] lg:min-h-[520px] border-4 border-white ring-1 ring-[#D49313]/30 shadow-xl">
            <Image
              src="/move1.png"
              alt="Honey being drizzled into a bowl"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* CONTACT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10 lg:mt-14">
          
          {/* Call Us */}
          <a 
            href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-[180px] sm:h-[190px] border border-[#EADCC9] hover:border-[#D49313] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FAF0DC] border border-[#D49313]/30 flex items-center justify-center text-[#D49313] flex-shrink-0 group-hover:bg-[#D49313] group-hover:text-white transition-all">
              <FiPhone size={18} />
            </div>
            <div className="flex flex-col w-full overflow-hidden">
              <span className="font-serif font-bold text-[16px] text-[#593102] group-hover:text-[#D49313] transition-colors">Call Us</span>
              <span className="text-[13px] sm:text-[14px] text-[#593102] font-semibold truncate mt-0.5">
                {loading ? "Loading..." : phoneNumber}
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#6E5D4F] font-medium truncate mt-0.5">
                {loading ? "..." : locationData?.phone_timing || "Mon – Sat: 9AM – 6PM"}
              </span>
            </div>
          </a>

          {/* Email Us */}
          <a 
            href={`mailto:${emailAddress}`}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-[180px] sm:h-[190px] border border-[#EADCC9] hover:border-[#D49313] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FAF0DC] border border-[#D49313]/30 flex items-center justify-center text-[#D49313] flex-shrink-0 group-hover:bg-[#D49313] group-hover:text-white transition-all">
              <FiMail size={18} />
            </div>
            <div className="flex flex-col w-full overflow-hidden">
              <span className="font-serif font-bold text-[16px] text-[#593102] group-hover:text-[#D49313] transition-colors">Email Us</span>
              <span className="text-[12px] sm:text-[13px] text-[#593102] font-semibold break-all line-clamp-1 mt-0.5">
                {loading ? "Loading..." : emailAddress}
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#6E5D4F] font-medium truncate mt-0.5">
                {loading ? "..." : locationData?.email_reply_time || "We reply within 24 hrs"}
              </span>
            </div>
          </a>

          {/* WhatsApp Us */}
          <a 
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-[180px] sm:h-[190px] border border-[#EADCC9] hover:border-[#D49313] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] flex-shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-all">
              <FaWhatsapp size={18} />
            </div>
            <div className="flex flex-col w-full overflow-hidden">
              <span className="font-serif font-bold text-[16px] text-[#593102] group-hover:text-[#D49313] transition-colors">WhatsApp Us</span>
              <span className="text-[13px] sm:text-[14px] text-[#593102] font-semibold truncate mt-0.5">
                {loading ? "Loading..." : whatsappNumber}
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#6E5D4F] font-medium truncate mt-0.5">
                {loading ? "..." : locationData?.whatsapp_timing || "Mon – Sat: 9AM – 6PM"}
              </span>
            </div>
          </a>

          {/* Visit Our Studio */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-[180px] sm:h-[190px] border border-[#EADCC9] hover:border-[#D49313] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="w-11 h-11 rounded-xl bg-[#FAF0DC] border border-[#D49313]/30 flex items-center justify-center text-[#D49313] flex-shrink-0 group-hover:bg-[#D49313] group-hover:text-white transition-all">
              <FiMapPin size={18} />
            </div>
            <div className="flex flex-col w-full overflow-hidden">
              <span className="font-serif font-bold text-[16px] text-[#593102] group-hover:text-[#D49313] transition-colors">Visit Our Studio</span>
              <span className="text-[11px] sm:text-[12px] text-[#593102] font-medium leading-snug line-clamp-2 mt-0.5">
                {loading ? "Loading..." : getShortAddress() || "123, Green Hive Road, Whitefield, Bengaluru, KA – 560066"}
              </span>
              <a
                href={getDirectionsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#D49313] font-bold tracking-wide mt-1 relative z-10 inline-block truncate hover:underline"
              >
                GET DIRECTIONS →
              </a>
            </div>
          </div>

        </div>

        {/* FULL WIDTH EMBEDDED MAP */}
        <div className="relative mt-10 lg:mt-12 rounded-3xl overflow-hidden border border-[#EADCC9] bg-[#FAF5EC] w-full shadow-sm">
          
          {!isMapActive && (
            <div 
              onClick={() => setIsMapActive(true)}
              className="absolute inset-0 z-30 bg-black/10 flex items-center justify-center cursor-pointer lg:hidden backdrop-blur-[1px]"
            >
              <div className="bg-white text-[#593102] text-[13px] font-bold px-5 py-2.5 rounded-full shadow-md border border-[#EADCC9]">
                Tap to explore map
              </div>
            </div>
          )}

          <div className="relative w-full" style={{ paddingBottom: '45%', minHeight: '360px' }}>
            {embedMapUrl ? (
              <iframe
                title="Shuddha Veda location map"
                src={embedMapUrl}
                className={`absolute inset-0 w-full h-full border-0 transition-all ${!isMapActive ? 'lg:pointer-events-auto pointer-events-none' : 'pointer-events-auto'}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#FAF5EC]">
                <p className="text-[#6E5D4F]">Map not available</p>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md py-4 sm:py-5 text-center z-20 border-t border-[#EADCC9]">
            <h3 className="font-serif font-bold text-[#593102] text-[20px] sm:text-[22px]">Find Us</h3>
            <p className="text-[12px] sm:text-[13px] text-[#6E5D4F] font-medium mt-1 px-4 truncate">
              {loading ? "Loading..." : getFullAddress() || "Shuddha Veda Studio, 4A, Sri Sai Enclave, ECC Road, Whitefield, Bengaluru, Karnataka 560066"}
            </p>
            <p className="text-[12px] sm:text-[13px] text-[#6E5D4F] font-medium mt-1 px-4 truncate">
              Phone: {loading ? "..." : phoneNumber} &nbsp;|&nbsp; Email: {loading ? "..." : emailAddress} &nbsp;|&nbsp; Instagram: @shuddhadeva
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}