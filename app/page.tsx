import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Showcase from "@/components/Showcase";

export default function Home() {
  return (
    <main className="bg-background">
      <Hero />
      <Problem />
      <Features />
      <Showcase />
    </main>
  );
}
