import type { Metadata } from "next";
import { Averia_Serif_Libre, DM_Sans } from "next/font/google";
import CartProvider from "@/components/cart/CartProvider";
import "./globals.css";

const averia = Averia_Serif_Libre({
  variable: "--font-averia",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShuddhVeda | 100% Pure Raw & Unprocessed Honey",
  description: "Ethically harvested raw and unprocessed honey straight from natural hives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${averia.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <div className="app-shell">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
