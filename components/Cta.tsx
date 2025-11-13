import Link from "next/link";

export default function Cta() {
  return (
    <section className="bg-money/30 p-12 border-b border-border flex flex-col justify-center items-center gap-5">
      <h2 className="text-4xl md:text-5xl font-bold text-default mb-4 text-center">
        Take control of your business today.
      </h2>
      <p className="text-text-muted max-w-2xl mx-auto text-center mb-5">
        Simplify your freelance life with one tool that keeps everything
        connected.
      </p>
      <Link
        href="/signup"
        className="relative inline-block w-max px-6 py-3 border-2 border-accent text-accent font-semibold z-10 shadow-lg text-center overflow-hidden
   before:content-[''] before:absolute before:top-0 before:left-1/2 before:right-1/2 before:h-full before:bg-accent before:opacity-0 before:-z-10 before:transition-all before:duration-300
   hover:before:left-0 hover:before:right-0 hover:before:opacity-100
   focus:before:left-0 focus:before:right-0 focus:before:opacity-100
   active:before:left-0 active:before:right-0 active:before:opacity-100
   hover:text-white focus:text-white active:text-white rounded-lg"
      >
        Try WorkHub for free
      </Link>
    </section>
  );
}
