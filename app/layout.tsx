import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { CartDrawer } from "@/components/modals/cart-drawer";
import { SearchModal } from "@/components/modals/search-modal";
import { VideoModal } from "@/components/modals/video-modal";
import { AuthModal } from "@/components/modals/auth-modal";
import { Toast } from "@/components/ui/toast";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant-garamond",
});

export const metadata: Metadata = {
  title: "Drinko Premium Coffee Experience",
  description:
    "Crafted with care, served with love. Your perfect coffee, anytime, anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} h-full scroll-smooth antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans bg-[var(--color-bg)] text-[var(--color-text)]"
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <SearchModal />
            <VideoModal />
            <AuthModal />
            <Toast />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
