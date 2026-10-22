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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://shuddhvedahoney.com");

const permanentOgImage = "https://shuddhvedahoney.com/ogimage.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ShuddhVeda Honey | Pure Raw & Natural Honey",
    template: "%s | ShuddhVeda Honey",
  },
  description:
    "Experience raw, unpasteurized & natural honey straight from hives. Savor authentic Mustard, Lychee, Ajwain & Multi-Flora Honey.",
  keywords: [
    "ShuddhVeda",
    "Mustard Honey",
    "Lychee Honey",
    "Fennel Honey",
    "Natural Honey",
    "Ajwain Honey",
    "Multi-flora Honey",
    "Raw Honey",
    "Pure Honey",
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
    title: "ShuddhVeda Honey | Pure Raw & Natural Honey",
    description:
      "Experience raw, unpasteurized & natural honey straight from hives. Savor authentic Mustard, Lychee, Ajwain & Multi-Flora Honey.",
    url: siteUrl,
    siteName: "ShuddhVeda Honey",
    images: [
      {
        url: permanentOgImage,
        width: 600,
        height: 600,
        alt: "ShuddhVeda Pure & Natural Honey",
      },
      {
        url: "/ogimage.png",
        width: 600,
        height: 600,
        alt: "ShuddhVeda Pure & Natural Honey",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ShuddhVeda Honey | Pure Raw & Natural Honey",
    description:
      "Experience raw, unpasteurized & natural honey straight from hives. Savor authentic Mustard, Lychee, Ajwain & Multi-Flora Honey.",
    images: [permanentOgImage],
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
        <meta property="og:image" content={permanentOgImage} />
        <meta property="og:image:secure_url" content={permanentOgImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="ShuddhVeda Pure & Natural Honey" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content={permanentOgImage} />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://api.shuddhvedahoney.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.shuddhvedahoney.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preload" as="image" href="/mustardnewdes.webp" type="image/webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/mustardnew.webp" type="image/webp" fetchPriority="high" />
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
