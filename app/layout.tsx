import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#17281F",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cocoroots.com"),
  title: "COCO ROOTS — Modern Botanical Hair Wellness & Care",
  description:
    "Elevated haircare combining pure botanical richness with contemporary hair wellness. Nourishing scalp and strand rituals crafted with cold-pressed oils and restorative botanicals.",
  keywords: [
    "Coco Roots",
    "haircare",
    "botanical hair wellness",
    "scalp serum",
    "cold-pressed hair oil",
    "luxury haircare",
  ],
  openGraph: {
    title: "COCO ROOTS — Modern Botanical Hair Wellness & Care",
    description:
      "Nourishing scalp and strand rituals crafted with cold-pressed oils and restorative botanicals.",
    url: "https://cocoroots.com",
    siteName: "COCO ROOTS",
    images: [
      {
        url: "/images/hero-product.jpg",
        width: 1200,
        height: 900,
        alt: "Coco Roots Botanical Hair Care",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "COCO ROOTS — Modern Botanical Hair Wellness",
    description:
      "Elevated haircare combining pure botanical richness with contemporary hair wellness.",
    images: ["/images/hero-product.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F5] text-[#222724] font-sans selection:bg-[#2D4536] selection:text-[#FBF9F5]">
        {children}
      </body>
    </html>
  );
}
