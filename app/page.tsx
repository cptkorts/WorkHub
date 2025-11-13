import Cta from "@/components/Cta";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";

export default function Home() {
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
