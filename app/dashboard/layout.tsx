import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile & Settings | WorkHub",
  description:
    "Manage your profile, business information, and account settings.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
