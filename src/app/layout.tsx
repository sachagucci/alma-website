import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Alma — The AI workforce for healthcare.",
  description: "Alma is the AI workforce for healthcare. Mia, our AI receptionist, predicts which patients won't show up, calls them proactively to confirm, and fills cancellations within minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full`}
        style={{ background: '#FAF9F7' }}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TPP9G0CCPD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TPP9G0CCPD');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
