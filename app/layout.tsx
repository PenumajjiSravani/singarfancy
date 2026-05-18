import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Singar Fancy",
    default: "Singar Fancy - Where Elegance Meets You",
  },
  description: "Premium e-commerce store for luxury jewelry, accessories, cosmetics, and clothing.",
  icons: {
    icon: [
      { url: "/Favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/Favicon.png", sizes: "96x96", type: "image/png" },
      { url: "/Favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/Favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/Favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${playfair.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-[#C9A84C] selection:text-black">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster position="bottom-right" richColors theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
