import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoices | WorkHub",
  description: "Create, send, and track invoices for your business.",
};

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
