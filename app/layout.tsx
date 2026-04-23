import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const fredokaOne = Fredoka({
  weight: "400",
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PlayNest | Kids Toys Online — South Africa's Favourite Toy Store",
  description:
    "Shop hundreds of safe, fun, award-winning toys for babies, toddlers, and kids up to 12. Fast delivery, free returns. PlayNest — where wonder lives.",
  openGraph: {
    title: "PlayNest | Kids Toys Online",
    description: "Where Wonder Lives — hundreds of carefully chosen toys for ages 0–12.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredokaOne.variable} ${nunito.variable} antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
