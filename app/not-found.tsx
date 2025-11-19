import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center gap-5">
      <div className="text-center space-y-4">
        <h2 className="text-2xl text-default">Not Found</h2>
        <p className="text-text-muted">Could not find requested resource</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-accent hover:text-accent/80 border-b border-transparent hover:border-accent transition-colors duration-200"
        >
          Return Home <ArrowLeft size={15} />
        </Link>
      </div>
    </main>
  );
}
