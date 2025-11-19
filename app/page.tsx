import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Cta from "@/components/Cta";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WorkHub | Manage Clients, Appointments & Invoices",
  description:
    "One dashboard for freelancers and small businesses. Manage clients, schedule appointments, send invoices, and track your business growth all in one place.",
  keywords: [
    "freelancer management",
    "client management",
    "appointment scheduling",
    "invoice generator",
    "small business software",
  ],
};

export default async function Home() {
  // Server-side session check
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/analytics"); // Redirect authenticated users to dashboard
  }

  return (
    <main className="bg-background">
      <Hero />
      <Problem />
      <Features />
      <Showcase />
      <Testimonials />
      <Cta />
      <Footer />
    </main>
  );
}
