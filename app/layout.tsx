import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Roboto } from "next/font/google";

import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500"],
});

/** Títulos de sección en home (estilo editorial / artístico). */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "dearteenlinea × qullqa",
  description:
    "Elige entre la galería curada de dearteenlinea o las obras públicas de qullqa gallery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${roboto.variable} ${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsentBanner />
        <WhatsAppFloatButton />
      </body>
    </html>
  );
}
