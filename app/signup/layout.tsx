import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | WorkHub",
  description:
    "Create your free WorkHub account and start managing clients, appointments, and invoices today.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
