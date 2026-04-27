import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotLea from "@/components/ChatbotLea";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bistro Oberkampf — Cuisine de saison à Paris 11",
    template: "%s | Bistro Oberkampf",
  },
  description:
    "Bistrot parisien, ouvert midi et soir du mardi au samedi. Cuisine de saison, 47 rue Oberkampf, Paris 11.",
  openGraph: {
    title: "Bistro Oberkampf",
    description:
      "Cuisine de saison, à deux pas d'Oberkampf. Bistrot parisien à Paris 11.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bistro-cream text-bistro-charcoal">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotLea />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#2d4a3a",
              color: "#fff",
              border: "none",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
