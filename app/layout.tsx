import type { Metadata } from "next";
import "./globals.css";
import { Lato } from "next/font/google";
import { molgan } from "@/lib/fonts";
import Providers from "@/components/Providers";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "WorkHub - Manage Your Business",
  description:
    "Client management, appointments, and invoices for freelancers and small businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${molgan.variable} font-lato antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
