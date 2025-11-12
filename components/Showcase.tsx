import Image from "next/image";

export default function Showcase() {
  return (
    <section className="min-h-screen w-full p-12 border-b border-border">
      <h2 className="text-4xl md:text-5xl font-bold text-text-default mb-4 text-center">
        See your business clearly.
      </h2>
      <p className="text-text-muted max-w-2xl mx-auto mb-18 text-center">
        Track every client, booking, and payment from a single dashboard — stay
        organized and stress-free.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        <div className="relative w-full max-w-[600px] aspect-16/10 overflow-hidden rounded-lg shadow-md cursor-pointer group mx-auto">
          <Image
            src="/images/workhub-screenshot-1.webp"
            alt="WorkHub Screenshot 1"
            fill
            className="object-contain group-hover:blur-sm transition-all duration-300"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <h3 className="text-2xl font-bold text-hover mb-3 text-center">
              Your clients, organized.
            </h3>
            <p className="text-success text-center">
              From contact info to preferences — everything&apos;s one click
              away.
            </p>
          </div>
        </div>
        <div className="relative w-full max-w-[600px] aspect-16/10 overflow-hidden rounded-lg shadow-md cursor-pointer group mx-auto">
          <Image
            src="/images/workhub-screenshot-2.webp"
            alt="WorkHub Screenshot 1"
            fill
            className="object-contain group-hover:blur-sm transition-all duration-300"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <h3 className="text-2xl font-bold text-hover mb-3 text-center">
              Stay booked, never busy.
            </h3>
            <p className="text-success text-center">
              Manage your calendar effortlessly with one clean dashboard.
            </p>
          </div>
        </div>
        <div className="relative w-full max-w-[600px] aspect-16/10 overflow-hidden rounded-lg shadow-md cursor-pointer group mx-auto">
          <Image
            src="/images/workhub-screenshot-3.webp"
            alt="WorkHub Screenshot 1"
            fill
            className="object-contain group-hover:blur-sm transition-all duration-300"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <h3 className="text-2xl font-bold text-hover mb-3 text-center">
              Invoice like a pro.
            </h3>
            <p className="text-success text-center">
              Send professional invoices and track payments in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
