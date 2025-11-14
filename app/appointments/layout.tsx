import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointments | WorkHub",
  description: "Schedule and manage your appointments with ease.",
};

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
