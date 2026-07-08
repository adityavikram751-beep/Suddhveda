import Image from "next/image";
import { FiPhone, FiMail, FiMapPin, FiArrowUp, FiChevronDown } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section className="bg-[#FAF6F0] py-10 lg:py-14 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 relative">

        {/* Decorative honey drip illustration - top left */}
        <div className="absolute -top-2 left-0 lg:left-2 w-[90px] sm:w-[160px] pointer-events-none select-none">
          <Image
            src="/contact.png"
            alt=""
            width={420}
            height={220}
            className="w-full h-auto"
          />
        </div>

        {/* Decorative bee + honeycomb - peeking from behind map corner only, kept below map's z-index */}
        <div className="hidden lg:block absolute right-38 bottom-80 w-[50px] pointer-events-none select-none z-0">
          <Image src="/MOVE TO VISIT.png" alt="" width={120} height={120} className="w-full h-auto" />
        </div>
        <div className="hidden lg:block absolute -right-1 bottom-90 w-[240px] pointer-events-none select-none z-0">
          <Image src="/customer.png" alt="" width={220} height={220} className="w-full h-auto" />
        </div>

        {/* TOP ROW - Form + Map */}
        <div className="grid lg:grid-cols-2 gap-18 lg:gap-22 pt-36 sm:pt-46 lg:pt-46">
          {/* LEFT - Form Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
            <p className="text-[#D49313] italic font-serif text-[17px] sm:text-[18px]">We'd love to</p>
            <h2 className="text-[26px] sm:text-[32px] font-serif text-[#2C241E] mt-1 mb-6">Hear From You</h2>

            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2C241E] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2C241E] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
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
                  className="w-full h-[50px] sm:h-[52px] px-4 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2C241E] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors"
                />
              </div>

              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E1D8] bg-[#FAF9F7] text-[14px] text-[#2C241E] placeholder:text-[#A69C8F] focus:outline-none focus:border-[#D49313] transition-colors resize-none"
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

              <div className="flex items-center justify-between flex-wrap gap-4 mt-2">
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
                  <span>We will get back<br />to you soon!</span>
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT - Map */}
          <div className="relative z-10 rounded-2xl overflow-hidden bg-white min-h-[320px] sm:min-h-[400px] lg:min-h-[520px]">
            <iframe
              title="ShudhVeda location map"
              src="https://www.google.com/maps?q=San+Francisco&output=embed"
              className="w-full h-full min-h-[320px] sm:min-h-[400px] lg:min-h-[520px] border-0"
              loading="lazy"
            />
          </div>
        </div>

        {/* BOTTOM ROW - Contact cards + company info + mini map */}
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-5 mt-22 lg:mt-24 items-stretch relative z-20">
          {/* 2x2 contact cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Call Us */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 flex items-center gap-5 border border-transparent hover:border-[#D49313] shadow-sm transition-colors h-full">
              <div className="w-14 h-14 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#D49313] flex-shrink-0">
                <FiPhone size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[19px] text-[#2C241E]">Call Us</span>
                <span className="text-[16px] text-[#2C241E] font-medium">+91 123 4567890</span>
                <span className="text-[14px] text-[#A69C8F]">Mon – Sat: 9AM – 6PM</span>
              </div>
            </div>

            {/* Email Us */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 flex items-center gap-5 border border-transparent hover:border-[#D49313] shadow-sm transition-colors h-full">
              <div className="w-14 h-14 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#D49313] flex-shrink-0">
                <FiMail size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[19px] text-[#2C241E]">Email Us</span>
                <span className="text-[16px] text-[#2C241E] font-medium">hello@shudhveda.com</span>
                <span className="text-[14px] text-[#A69C8F]">We reply within 24 hrs</span>
              </div>
            </div>

            {/* WhatsApp Us */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 flex items-center gap-5 border border-transparent hover:border-[#D49313] shadow-sm transition-colors h-full">
              <div className="w-14 h-14 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#D49313] flex-shrink-0">
                <FaWhatsapp size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[19px] text-[#2C241E]">WhatsApp Us</span>
                <span className="text-[16px] text-[#2C241E] font-medium">+91 987 6543210</span>
                <span className="text-[14px] text-[#A69C8F]">Mon – Sat: 9AM – 6PM</span>
              </div>
            </div>

            {/* Visit Our Studio */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 flex items-center gap-5 border border-transparent hover:border-[#D49313] shadow-sm transition-colors h-full">
              <div className="w-14 h-14 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#D49313] flex-shrink-0">
                <FiMapPin size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[19px] text-[#2C241E]">Visit Our Studio</span>
                <span className="text-[16px] text-[#2C241E] font-medium">Bengaluru, Karnataka, India</span>
                <a href="#" className="text-[15px] text-[#D49313] font-semibold">Get Directions →</a>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-transparent px-1 pt-1 h-full flex flex-col">
            <h3 className="font-bold text-[18px] text-[#2C241E]">ShudhVeda Honey Pvt. Ltd.</h3>
            <p className="text-[15px] text-[#8D7F73] mt-3 leading-relaxed">
              123, Green Hive Road,<br />
              Whitefield, Bengaluru,<br />
              Karnataka – 560066, India
            </p>
            <p className="text-[15px] text-[#2C241E] font-medium mt-4">Mon – Sat: 9AM – 6PM</p>
            <p className="text-[15px] text-[#8D7F73]">Sunday: Closed</p>
            <button className="mt-4 bg-[#D49313] hover:bg-[#B37B1B] transition-colors text-white h-[44px] px-6 rounded-xl flex items-center gap-2 font-medium text-[14px] w-fit">
              Get Directions <FiMapPin size={14} />
            </button>
          </div>

          {/* Mini Map */}
          <div className="relative h-full">
            <div className="hidden lg:block absolute -right-3 -bottom-4 w-[70px] pointer-events-none select-none z-0">
            </div>
            <div className="relative z-10 rounded-xl overflow-hidden border border-[#E8E1D8] h-[220px] lg:h-full min-h-[220px]">
              <iframe
                title="Mini location map"
                src="https://www.google.com/maps?q=San+Francisco&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}