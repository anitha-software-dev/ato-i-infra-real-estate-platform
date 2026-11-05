import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "A to I Infra | Premium Real Estate Consulting in India",
  description:
    "A to I Infra — Your gateway from Aspiration to Investment. Premium real estate consulting across Noida, Greater Noida, Delhi NCR, Gurgaon, Lucknow & Yamuna Expressway. Verified properties, expert guidance, zero brokerage.",
  keywords:
    "real estate consultant, property consultant Noida, real estate investment, luxury properties, commercial properties, residential properties, A to I Infra, ATOIINFRA",
  robots: "index, follow",
  openGraph: {
    title: "A to I Infra | Premium Real Estate Consulting",
    description:
      "Your gateway from Aspiration to Investment. Premium real estate consulting across India's fastest-growing markets.",
    type: "website",
    locale: "en_IN",
    siteName: "A to I Infra",
  },
  twitter: {
    card: "summary_large_image",
    title: "A to I Infra | Premium Real Estate Consulting",
    description:
      "Your gateway from Aspiration to Investment. Premium real estate consulting across India's fastest-growing markets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F8FAFC] text-[#0F172A]" suppressHydrationWarning>
        <div id="google_translate_element" className="hidden"></div>
        <Script
          strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCTA />
        </LanguageProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
