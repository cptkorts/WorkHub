import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | WorkHub",
  description:
    "Track your business performance with revenue insights, client growth, and appointment trends.",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
