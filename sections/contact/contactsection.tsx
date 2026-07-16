import Image from "next/image";
import { FiPhone, FiMail, FiMapPin, FiArrowUp, FiChevronDown } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section className="bg-[#FAF6F0] pb-10 lg:pb-14 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto w-full px-6 lg:px-16 relative">

        {/* TOP ROW - Form + Photo */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* LEFT - Form Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
            <p className="text-[#D49313] italic font-serif text-[17px] sm:text-[18px]">We'd love to</p>
            <h2 className="text-[26px] sm:text-[32px] font-serif text-[#2D3A1B] mt-1 mb-6">Hear From You</h2>

            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    defaultValue=""
                    className="appearance-none w-full h-[50px] sm:h-[52px] px-4 pr-9 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                  >
                    <option value="" disabled>Subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                  <FiChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A69C8F] pointer-events-none"
                    size={16}
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                />
              </div>

              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2D3A1B] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors resize-none"
              />

              <label className="flex items-start gap-2 text-[12px] sm:text-[13px] text-[#8D7F73] mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-[#E8E1D8] accent-[#D49313] flex-shrink-0"
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
                  className="bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[48px] sm:h-[50px] px-7 sm:px-8 rounded-xl flex items-center justify-center gap-2.5 font-medium text-[14px] sm:text-[15px] shadow-sm tracking-wide"
                >
                  Send Message
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
              <span className="text-[14px] text-[#2D3A1B] font-medium">+91 123 456 7890</span>
              <span className="text-[12px] text-[#A69C8F]">Mon – Sat: 9AM – 6PM</span>
            </div>
          </div>

          {/* Email Us */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-start gap-3 border border-transparent hover:border-[#D49313] shadow-sm transition-colors">
            <div className="w-11 h-11 rounded-full bg-white border border-[#E8E1D8] flex items-center justify-center flex-shrink-0">
              <FiMail size={18} className="text-[#EA4335]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[16px] text-[#2D3A1B]">Email Us</span>
              <span className="text-[14px] text-[#2D3A1B] font-medium">hello@shuddhadeva.com</span>
              <span className="text-[12px] text-[#A69C8F]">We reply within 24 hrs</span>
            </div>
          </div>

          {/* WhatsApp Us */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-start gap-3 border border-transparent hover:border-[#D49313] shadow-sm transition-colors">
            <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white flex-shrink-0">
              <FaWhatsapp size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[16px] text-[#2D3A1B]">WhatsApp Us</span>
              <span className="text-[14px] text-[#2D3A1B] font-medium">+91 987 654 3210</span>
              <span className="text-[12px] text-[#A69C8F]">Mon – Sat: 9AM – 6PM</span>
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
                123, Green Hive Road, Whitefield,<br />Bengaluru, KA – 560066
              </span>
              <a href="#" className="text-[13px] text-[#D49313] font-semibold mt-0.5">GET DIRECTIONS</a>
            </div>
          </div>
        </div>

        {/* FULL WIDTH MAP with overlay card */}
        <div className="relative mt-10 lg:mt-12 rounded-2xl overflow-hidden bg-[#EFE9DD] min-h-[420px] lg:min-h-[480px]">
          <iframe
            title="Shuddha Veda location map"
            src="https://www.google.com/maps?q=Whitefield+Bengaluru&output=embed"
            className="absolute inset-0 w-full h-full border-0 opacity-90"
            loading="lazy"
          />

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
              Shuddha Veda Studio, 4A, Sri Sai Enclave, ECC Road, Whitefield, Bengaluru, Karnataka 560066
            </p>
            <p className="text-[12px] sm:text-[13px] text-[#8D7F73] mt-1">
              Phone: +91 98765 43210 &nbsp;|&nbsp; Email: hello@shuddhadeva.com &nbsp;|&nbsp; Instagram: @shuddhadeva
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}