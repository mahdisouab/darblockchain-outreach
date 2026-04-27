import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  metadataBase: new URL("https://moon-ventures.fr"),
  title: {
    default: "Moon Ventures — Sites qui ramènent vos clients en direct",
    template: "%s — Moon Ventures",
  },
  description:
    "Moon Ventures conçoit et déploie des sites avec agent IA pour PME françaises. Livraison 7 à 21 jours. À partir de 990 €.",
  keywords: [
    "site web restaurant",
    "site cabinet médical",
    "site artisan",
    "agent IA PME",
    "agence digitale Marseille",
    "agence digitale Paris",
  ],
  authors: [{ name: "Moon Ventures" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://moon-ventures.fr",
    siteName: "Moon Ventures",
    title: "Moon Ventures — Sites qui ramènent vos clients en direct",
    description:
      "Sites avec agent IA pour restaurants, cabinets de santé et artisans. Livrés en 7 à 21 jours, à partir de 990 €.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Moon Ventures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon Ventures — Sites qui ramènent vos clients en direct",
    description:
      "Sites avec agent IA pour PME françaises. Livraison 7 à 21 jours.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c1326",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-mv-ink">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
