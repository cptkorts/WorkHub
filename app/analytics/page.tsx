"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ClipboardClock, HandCoins, PiggyBank, UserCheck } from "lucide-react";

interface MonthlyData {
  month: string;
  revenue: number;
  clients: number;
  appointments: number;
}

interface AnalyticsData {
  totalClients: number;
  monthlyRevenue: number;
  upcomingAppointments: number;
  totalRevenue: number;
  monthlyData: MonthlyData[];
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
            <h1 className="text-3xl font-bold text-text-default">Analytics</h1>
            <p className="text-light mt-1">
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
            <div className="group bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6 border-l-4 border-accent/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">
                    Total Clients
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    {analytics.totalClients}
                  </p>
                </div>
                <div className="text-4xl text-accent">
                  <UserCheck
                    size={35}
                    className="group-hover:scale-105 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            {/* This Month's Revenue */}
            <div className="group bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6 border-l-4 border-success">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">
                    {currentMonth} Revenue
                  </p>
                  <p className="text-3xl font-bold text-default">
                    ${analytics.monthlyRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="text-4xl text-default">
                  <HandCoins
                    size={35}
                    className="group-hover:scale-105 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="group bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6 border-l-4 border-blue-500/80">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">
                    Upcoming Appointments
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {analytics.upcomingAppointments}
                  </p>
                </div>
                <div className="text-4xl text-blue-600">
                  <ClipboardClock
                    size={35}
                    className="group-hover:scale-105 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="group bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6 border-l-4 border-money">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-money">
                    ${analytics.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="text-4xl text-money">
                  <PiggyBank
                    size={35}
                    className="group-hover:scale-105 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              6-Month Trends
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analytics.monthlyData}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "Revenue") {
                      return [`$${value.toFixed(2)}`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#a8c686"
                  strokeWidth={2}
                  name="Revenue"
                  dot={{ fill: "#a8c686", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="clients"
                  stroke="#cdaa5f"
                  strokeWidth={2}
                  name="Clients"
                  dot={{ fill: "#cdaa5f", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="appointments"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Appointments"
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-default mb-4">
                Invoice Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-money/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-text-muted">
                      Paid Invoices
                    </p>
                    <p className="text-2xl font-bold text-hover">
                      {analytics.invoices.paid.count}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-muted">Total</p>
                    <p className="text-xl font-semibold text-hover">
                      ${analytics.invoices.paid.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-error/15 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-text-muted">
                      Unpaid Invoices
                    </p>
                    <p className="text-2xl font-bold text-error">
                      {analytics.invoices.unpaid.count}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-muted">Outstanding</p>
                    <p className="text-xl font-semibold text-error">
                      ${analytics.invoices.unpaid.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-default mb-4">
                Appointment Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-text-muted">
                    Upcoming
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics.appointments.upcoming}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-money/20 rounded-lg">
                  <p className="text-sm font-medium text-text-muted ">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-hover">
                    {analytics.appointments.completed}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-error/15 rounded-lg">
                  <p className="text-sm font-medium text-text-muted">
                    Canceled
                  </p>
                  <p className="text-2xl font-bold text-error">
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
