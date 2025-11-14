import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients | WorkHub",
  description: "View and manage all your clients in one place.",
};

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
