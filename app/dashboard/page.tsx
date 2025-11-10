"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">WorkHub</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{session.user.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to your dashboard, {session.user.name}! 🎉
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Email:</strong> {session.user.email}
              </p>
              <p>
                <strong>User ID:</strong> {session.user.id}
              </p>
              {session.user.businessName && (
                <p>
                  <strong>Business:</strong> {session.user.businessName}
                </p>
              )}
              <p>
                <strong>Sign-in Provider:</strong>{" "}
                {session.user.provider || "credentials"}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="text-4xl mr-4">📇</div>
                <div>
                  <p className="text-gray-500 text-sm">Total Clients</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="text-4xl mr-4">📅</div>
                <div>
                  <p className="text-gray-500 text-sm">Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="text-4xl mr-4">💰</div>
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">$0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/clients"
              className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-4xl mb-2">📇</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Manage Clients
              </h3>
              <p className="text-gray-600">
                Add and manage your client database
              </p>
            </a>
            <a
              href="/appointments"
              className="bg-green-50 border-2 border-green-200 p-6 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-4xl mb-2">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Appointments
              </h3>
              <p className="text-gray-600">Schedule and track appointments</p>
            </a>
            <a
              href="/invoices"
              className="bg-purple-50 border-2 border-purple-200 p-6 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Invoices
              </h3>
              <p className="text-gray-600">Create and manage invoices</p>
            </a>
          </div>

          {/* User Created Successfully Message */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <p className="font-semibold text-green-800">
                  Your account is active!
                </p>
                <p className="text-green-700 text-sm">
                  Your user profile has been successfully created in the
                  database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
