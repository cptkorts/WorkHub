"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface AnalyticsData {
  totalClients: number;
  upcomingAppointments: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalClients: 0,
    upcomingAppointments: 0,
    totalRevenue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchAnalytics();
    }
  }, [session]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics({
          totalClients: data.totalClients,
          upcomingAppointments: data.upcomingAppointments,
          totalRevenue: data.totalRevenue,
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoadingStats(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 ml-64 py-6 px-8">
        <div>
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
                  {loadingStats ? (
                    <div className="h-9 w-12 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.totalClients}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="text-4xl mr-4">📅</div>
                <div>
                  <p className="text-gray-500 text-sm">Upcoming Appointments</p>
                  {loadingStats ? (
                    <div className="h-9 w-12 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.upcomingAppointments}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="text-4xl mr-4">💰</div>
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  {loadingStats ? (
                    <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">
                      ${analytics.totalRevenue.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <a
              href="/analytics"
              className="bg-orange-50 border-2 border-orange-200 p-6 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analytics
              </h3>
              <p className="text-gray-600">View insights and reports</p>
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
