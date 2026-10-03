import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import CartProvider from "@/components/cart/CartProvider";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: "ShuddhVeda | 100% Pure, Raw & Artisanal Honey",
    template: "%s | ShuddhVeda Honey",
  },
  description:
    "Ethically harvested 100% pure, raw, unpasteurized & unprocessed natural honey straight from hives.",
  keywords: [
    "ShuddhVeda",

    "Mustard Honey",
    "Litchi Honey",
    "Fannel Honey",
    "Natural Honey",
    "Ajwain Honey",
    "Multi-flora Honey",
  ],
  authors: [{ name: "ShuddhVeda Honey" }],
  creator: "ShuddhVeda Honey",
  publisher: "ShuddhVeda Honey",
  icons: {
    icon: "/yellow logo.png",
    shortcut: "/yellow logo.png",
    apple: "/yellow logo.png",
  },
  openGraph: {
    title: "ShuddhVeda | 100% Pure, Raw & Artisanal Honey",
    description:
      "Ethically harvested 100% pure, raw, unpasteurized & unprocessed natural honey straight from hives.",
    url: "https://shuddhveda.com",
    siteName: "ShuddhVeda Honey",
    images: [
      {
        url: "/yellow logo.png",
        width: 1200,
        height: 630,
        alt: "ShuddhVeda Pure & Artisanal Honey",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShuddhVeda | 100% Pure, Raw & Artisanal Honey",
    description:
      "Ethically harvested 100% pure, raw, unpasteurized & unprocessed natural honey straight from hives.",
    images: ["/yellow logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/yellow logo.png" type="image/png" />
        <link rel="shortcut icon" href="/yellow logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/yellow logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ShuddhVeda | 100% Pure, Raw & Artisanal Honey" />
        <meta property="og:description" content="Ethically harvested 100% pure, raw, unpasteurized & unprocessed natural honey straight from hives." />
        <meta property="og:image" content="/yellow logo.png" />
        <meta property="og:site_name" content="ShuddhVeda Honey" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShuddhVeda | 100% Pure, Raw & Artisanal Honey" />
        <meta name="twitter:description" content="Ethically harvested 100% pure, raw, unpasteurized & unprocessed natural honey straight from hives." />
        <meta name="twitter:image" content="/yellow logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <div className="app-shell">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
