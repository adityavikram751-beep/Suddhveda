"use client";

import { API_BASE_URL } from "@/lib/auth";
import Image from "next/image";
import { FiPhone, FiMail, FiMapPin, FiArrowUp, FiChevronDown, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import { useState, useEffect, useRef } from "react";

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

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  const subjectOptions = [
    { value: "general", label: "General Inquiry" },
    { value: "order", label: "Order Support" },
    { value: "wholesale", label: "Wholesale" },
    { value: "product", label: "Product Query" },
  ];

  // Close custom dropdown when clicking outside (mouse or touch)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSubjectDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

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
    setSubmitStatus({ type: null, message: "" });

    // Client-side validations
    if (!formData.name.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Please enter your full name.",
      });
      return;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!formData.subject) {
      setSubmitStatus({
        type: "error",
        message: "Please select a subject.",
      });
      return;
    }

    if (!formData.mobile.trim() || formData.mobile.trim().length < 10) {
      setSubmitStatus({
        type: "error",
        message: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setSubmitStatus({
        type: "error",
        message: "Message must be at least 10 characters.",
      });
      return;
    }

    setIsSubmitting(true);

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
        let errorMsg = data.message || "Failed to send enquiry. Please try again.";

        // Extract detailed validation errors if returned by API
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMsg = data.errors.map((err: any) => (typeof err === "string" ? err : err.msg || err.message)).join(". ");
        } else if (data.errors && typeof data.errors === "object") {
          errorMsg = Object.values(data.errors)
            .map((err: any) => (typeof err === "string" ? err : err.msg || err.message))
            .join(". ");
        } else if (data.error) {
          errorMsg = typeof data.error === "string" ? data.error : data.error.message || errorMsg;
        }

        // If backend message is generic "Validation failed", provide helpful specific guidance
        if (errorMsg.toLowerCase() === "validation failed") {
          if (formData.message.trim().length < 10) {
            errorMsg = "Message must be at least 10 characters.";
          } else {
            errorMsg = "Please check your details and try again.";
          }
        }

        setSubmitStatus({
          type: "error",
          message: errorMsg,
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
    <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#FFFDF9] pt-6 sm:pt-8 lg:pt-10 pb-12 lg:pb-16 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-16 relative">

        {/* TOP ROW - Form + Photo */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          {/* LEFT - Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#EADCC9] shadow-sm p-5 sm:p-7 lg:p-9 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] border border-[#D49313]/40 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase text-[#593102] tracking-[0.16em] mb-2">
                <span>WE&apos;D LOVE TO</span>
              </div>
              <h2 className="text-[26px] sm:text-[32px] font-serif font-extrabold text-[#593102] mt-1 mb-4 sm:mb-5">
                Hear From You
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-3.5">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[48px] sm:h-[50px] px-4 rounded-xl border border-[#EADCC9] bg-[#FAF9F7] text-[14px] font-medium text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full h-[48px] sm:h-[50px] px-4 rounded-xl border border-[#EADCC9] bg-[#FAF9F7] text-[14px] font-medium text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="relative" ref={subjectDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsSubjectDropdownOpen((prev) => !prev)}
                      className={`w-full h-[48px] sm:h-[50px] px-4 rounded-xl border bg-[#FAF9F7] text-[14px] font-medium text-[#593102] flex items-center justify-between transition-all cursor-pointer text-left select-none active:scale-[0.995] ${
                        isSubjectDropdownOpen
                          ? "border-[#D49313] ring-2 ring-[#D49313]/20 shadow-xs bg-white"
                          : "border-[#EADCC9] hover:border-[#D49313]"
                      }`}
                      aria-haspopup="listbox"
                      aria-expanded={isSubjectDropdownOpen}
                    >
                      <span className={`truncate mr-2 ${formData.subject ? "text-[#593102] font-semibold" : "text-[#A69C8F]"}`}>
                        {subjectOptions.find((opt) => opt.value === formData.subject)?.label || "Subject"}
                      </span>
                      <FiChevronDown
                        className={`text-[#A69C8F] transition-transform duration-300 flex-shrink-0 ${
                          isSubjectDropdownOpen ? "rotate-180 text-[#D49313]" : ""
                        }`}
                        size={18}
                      />
                    </button>

                    {/* Custom Touch-Friendly Dropdown Popover */}
                    {isSubjectDropdownOpen && (
                      <div 
                        className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl border border-[#EADCC9] bg-[#FFFDF9] shadow-xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
                        role="listbox"
                      >
                        {subjectOptions.map((option) => {
                          const isSelected = formData.subject === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, subject: option.value }));
                                setIsSubjectDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-3 rounded-xl text-[14px] text-left transition-all flex items-center justify-between cursor-pointer select-none active:scale-[0.98] ${
                                isSelected
                                  ? "bg-[#FAF0DC] text-[#593102] font-extrabold border border-[#D49313]/40 shadow-2xs"
                                  : "text-[#593102] hover:bg-[#FAF5EC] active:bg-[#FAF0DC]/60 font-medium"
                              }`}
                              role="option"
                              aria-selected={isSelected}
                            >
                              <span>{option.label}</span>
                              {isSelected && <FiCheck className="text-[#D49313] stroke-[3] flex-shrink-0 ml-2" size={16} />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Phone Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="w-full h-[48px] sm:h-[50px] px-4 rounded-xl border border-[#EADCC9] bg-[#FAF9F7] text-[14px] font-medium text-[#593102] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] focus:bg-white transition-colors"
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
              Phone: {loading ? "..." : phoneNumber} &nbsp;|&nbsp; Email: {loading ? "..." : emailAddress} &nbsp;|&nbsp; Instagram: @ShuddhVedaHoney
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}