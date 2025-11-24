import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans } from "next/font/google";
import { molgan } from "@/lib/fonts";
import Providers from "@/components/Providers";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "WorkHub - Manage Your Business",
  description:
    "Client management, appointments, and invoices for freelancers and small businesses",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${molgan.variable} font-noto-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
