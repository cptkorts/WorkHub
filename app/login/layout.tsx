import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | WorkHub",
  description: "Sign in to your WorkHub account to manage your business.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
