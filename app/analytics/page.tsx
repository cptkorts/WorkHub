"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MonthlyIncomeData {
  month: string;
  income: number;
  count: number;
}

interface AnalyticsData {
  totalClients: number;
  monthlyRevenue: number;
  upcomingAppointments: number;
  totalRevenue: number;
  monthlyIncome: MonthlyIncomeData[];
  invoices: {
    paid: { count: number; total: number };
    unpaid: { count: number; total: number };
  };
  appointments: {
    upcoming: number;
    completed: number;
    canceled: number;
  };
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setAnalytics(data);
      } else {
        setError("Failed to load analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!session || !analytics) return null;

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 ml-64 py-6 px-8">
        <div>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Business insights and performance metrics
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Clients */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Clients
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.totalClients}
                  </p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            {/* This Month's Revenue */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {currentMonth} Revenue
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ${analytics.monthlyRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Upcoming Appointments
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {analytics.upcomingAppointments}
                  </p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${analytics.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>
          </div>

          {/* Monthly Income Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Monthly Income (Last 6 Months)
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analytics.monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#3b82f6"
                  name="Income"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Invoice Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Paid Invoices
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {analytics.invoices.paid.count}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-semibold text-green-600">
                      ${analytics.invoices.paid.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Unpaid Invoices
                    </p>
                    <p className="text-2xl font-bold text-orange-700">
                      {analytics.invoices.unpaid.count}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Outstanding</p>
                    <p className="text-xl font-semibold text-orange-600">
                      ${analytics.invoices.unpaid.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointment Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {analytics.appointments.upcoming}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-700">
                    {analytics.appointments.completed}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Canceled</p>
                  <p className="text-2xl font-bold text-red-700">
                    {analytics.appointments.canceled}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
