import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import InfoBar from "@/components/new-landing/info-bar";
import Navbar from "@/components/new-landing/navbar";

// Display face: headings and the wordmark.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

// Body copy.
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

// UI default.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

// Figures, labels and stat readouts are always set in mono.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seerix \u00b7 The Search Console platform that explains why",
  description:
    "Seerix connects to your Google Search Console, monitors your SERPs, and tracks every ranking change, then tells you why it happened and what to do next.",
  openGraph: {
    title: "Seerix \u00b7 SEO answers with receipts",
    description:
      "Diagnoses with receipts, not dashboards with homework. Read-only Search Console access, revocable anytime.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${inter.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <meta name="theme-color" content="#36363B" />
      </head>
      <body className="flex min-h-dvh flex-col bg-white font-sans text-black">
        <InfoBar />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
