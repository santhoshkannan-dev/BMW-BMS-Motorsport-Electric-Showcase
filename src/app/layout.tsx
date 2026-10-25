import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bmw-showcase.local"),
  title: "BMW & BMS Performance | The Ultimate Driving Experience",
  description: "Experience the pinnacle of high-performance luxury automotive engineering. Interactive 3D showcase featuring BMW M8 Competition, Vision M NEXT, and i7 M70 with real-time configurator.",
  keywords: ["BMW", "BMS", "M Performance", "Supercar", "Luxury Car", "Interactive 3D", "Three.js", "Electric Vehicle", "M8 Competition"],
  openGraph: {
    title: "BMW & BMS Performance | The Ultimate Driving Experience",
    description: "Explore the next generation of performance, luxury, and electric innovation in real-time 3D.",
    images: [{ url: "/images/bmw_vision_concept.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMW & BMS Performance Showcase",
    description: "Experience pure automotive excellence in interactive 3D.",
    images: ["/images/bmw_vision_concept.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
