import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsent } from "@/components/CookieConsent";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GRUPO +351 — Hub de Negócios e Joint Ventures",
  description:
    "Construímos empresas combinando experiência, parceiros estratégicos e oportunidades reais de mercado. Sediados em Cascais, Portugal.",
  metadataBase: new URL("https://grupo351.com"),
  openGraph: {
    title: "GRUPO +351 — Hub de Negócios e Joint Ventures",
    description:
      "Construímos empresas combinando experiência, parceiros estratégicos e oportunidades reais de mercado.",
    locale: "pt_PT",
    type: "website",
    siteName: "GRUPO +351",
  },
  twitter: {
    card: "summary_large_image",
    title: "GRUPO +351 — Hub de Negócios e Joint Ventures",
    description:
      "Construímos empresas combinando experiência, parceiros estratégicos e oportunidades reais de mercado.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://grupo351.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GRUPO +351",
              description:
                "Hub de Negócios e Joint Ventures sediado em Cascais, Portugal.",
              url: "https://grupo351.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Cascais",
                addressRegion: "Lisboa",
                addressCountry: "PT",
              },
              foundingDate: "2024",
              founders: [
                { "@type": "Person", name: "Henrique Lemos" },
                { "@type": "Person", name: "Fernando Vieira" },
                { "@type": "Person", name: "Herson Rosa" },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
