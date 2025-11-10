"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClientsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Client Management</h1>
        <p className="text-gray-600">Coming soon - Manage your clients here</p>
        <a
          href="/dashboard"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}
