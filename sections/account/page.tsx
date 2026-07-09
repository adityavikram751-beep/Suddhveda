"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/account", active: true },
  { icon: Package, label: "My Orders", href: "/account/orders" },
  { icon: Truck, label: "Track Order", href: "/account/track-order" },
  { icon: MapPin, label: "My Addresses", href: "/account/addresses" },
  { icon: CreditCard, label: "Payment Methods", href: "/account/payment-methods" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Bell, label: "Notifications", href: "/account/notifications" },
  { icon: Settings, label: "Account Settings", href: "/account/settings" },
];

const stats = [
  { label: "Orders Placed", value: 5, color: "bg-orange-100 text-orange-600" },
  { label: "Orders In Transit", value: 2, color: "bg-orange-50 text-orange-500" },
  { label: "Orders Delivered", value: 3, color: "bg-purple-100 text-purple-600" },
  { label: "Wishlist Items", value: 4, color: "bg-blue-100 text-blue-600" },
];

const recentOrders = [
  { id: "SVN1256789", date: "12 May, 2024", status: "In Transit", amount: "₹1,549" },
  { id: "SVN1245601", date: "12 May, 2024", status: "Delivered", amount: "₹899" },
  { id: "SVN1234789", date: "12 May, 2024", status: "Delivered", amount: "₹1,249" },
  { id: "SVN1223456", date: "12 May, 2024", status: "Delivered", amount: "₹750" },
];

export default function AccountDashboardPage() {
  return (
    <section className="bg-[#FFF8EF] min-h-screen py-10">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10">

       

        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-[34px] font-bold text-[#3C2015]">My Account</h1>
            <p className="text-[15px] text-[#B59A78] mt-1">Manage your orders, addresses and account details.</p>
          </div>
          <Image src="/honeyjar-icon.png" alt="" width={80} height={80} className="hidden sm:block" />
        </div>

        {/* items-start is what lets the sidebar column stick without stretching to match the main column's height */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-7 items-start">

          {/* Sidebar — sticky, docks right below the sticky header (h-20 / 80px, see Header.tsx) */}
          <aside className="bg-white border border-[#F0E2CC] rounded-2xl p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="flex items-center gap-3 px-2 pb-5 border-b border-[#F0E2CC]">
              <div className="w-12 h-12 rounded-full bg-[#F0E2CC] flex items-center justify-center text-[15px] font-semibold text-[#6B2E08]">
                RS
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#3C2015]">Rahul Sharma</p>
                <p className="text-[12px] text-[#B59A78]">rahulsharma123@gmail.com</p>
                <button className="text-[12px] text-[#D89A1B] font-medium">Edit Profile</button>
              </div>
            </div>

            <nav className="mt-4 space-y-1.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-colors
                      ${link.active ? "bg-[#FFF2D8] text-[#D89A1B]" : "text-[#6B2E08] hover:bg-[#FFF8EF]"}
                    `}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <button className="flex items-center gap-3 px-4 py-3 mt-3 text-[14px] font-medium text-red-500 hover:bg-red-50 rounded-xl w-full">
              <LogOut size={18} /> Logout
            </button>
          </aside>

          {/* Main */}
          <div>
            <div className="bg-white border border-[#F0E2CC] rounded-2xl p-7">
              <h3 className="text-[19px] font-bold text-[#3C2015]">Welcome back, Rahul! 👋</h3>
              <p className="text-[14px] text-[#B59A78] mt-1">Here&apos;s what&apos;s happening with your account.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-6">
                {stats.map((s) => (
                  <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
                    <p className="text-[28px] font-bold">{s.value}</p>
                    <p className="text-[13px] font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#F0E2CC] rounded-2xl p-7 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-[#3C2015]">Recent Orders</h3>
                <Link href="/account/orders" className="text-[13px] text-[#D89A1B] font-medium">View All Orders →</Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="text-[#B59A78] text-[12px] uppercase border-b border-[#F0E2CC]">
                      <th className="py-3">Order ID</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#F0E2CC] last:border-b-0">
                        <td className="py-4 font-medium text-[#3C2015]">{order.id}</td>
                        <td className="py-4 text-[#6B2E08]">{order.date}</td>
                        <td className="py-4">
                          <span
                            className={`
                              text-[12px] font-semibold px-3 py-1.5 rounded-full
                              ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}
                            `}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 font-semibold text-[#3C2015]">{order.amount}</td>
                        <td className="py-4">
                          <Link
                            href="/account/track-order"
                            className="text-[12px] font-semibold text-[#D89A1B] border border-[#D89A1B] rounded-lg px-4 py-1.5"
                          >
                            {order.status === "Delivered" ? "View Details" : "Track Order"}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FFF2D8] to-[#FDECC8] border border-[#F0DAAE] rounded-2xl p-7 mt-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Image
                  src="/honeyjar-icon.png"
                  alt="Refer and earn"
                  width={64}
                  height={64}
                  className="shrink-0"
                />
                <div>
                  <p className="text-[19px] font-bold text-[#3C2015]">Refer &amp; Earn Rewards!</p>
                  <p className="text-[15px] text-[#6B2E08] mt-1.5">
                    Refer your friends and get <span className="text-[#D89A1B] font-semibold">10% off</span> on their first order.
                  </p>
                  <button className="mt-4 bg-[#D89A1B] hover:bg-[#C98715] text-white text-[15px] font-semibold px-7 py-3 rounded-xl transition-colors">
                    Refer Now
                  </button>
                </div>
              </div>

              <Image
                src="/gift-icon.png"
                alt="Gift"
                width={80}
                height={80}
                className="hidden sm:block shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}