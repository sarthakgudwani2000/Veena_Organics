import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Veena Organics — Pure & Natural Organic Products",
    template: "%s | Veena Organics",
  },
  description:
    "40+ years of trust. Premium quality organic spices, Ayurvedic herbs, dry fruits, and traditional Indian products sourced directly from certified organic farms.",
  keywords: [
    "organic products",
    "Ayurvedic herbs",
    "Indian spices",
    "dry fruits",
    "organic flour",
    "pooja samagri",
    "natural products India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Veena Organics",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-[#F6F1E8]"
        style={{ fontFamily: "'Sora', system-ui, sans-serif" }}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
