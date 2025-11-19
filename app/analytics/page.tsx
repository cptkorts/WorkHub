"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import MetricCard from "@/components/MetricCard";
import TrendsLineChart from "@/components/TrendsLineChart";
import TrendsBarChart from "@/components/TrendsBarChart";
import InvoiceStatus from "@/components/InvoiceStatus";
import AppointmentStatus from "@/components/AppointmentStatus";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ClipboardClock, HandCoins, PiggyBank, UserCheck } from "lucide-react";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { analytics, loading, error } = useAnalytics(session);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session || !analytics) return null;

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background xl:flex">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-64 py-6 px-8">
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
            <MetricCard
              title="Total Clients"
              value={analytics.totalClients}
              icon={UserCheck}
              iconColor="text-accent"
              borderColor="border-accent/80"
              valueColor="text-accent"
            />
            <MetricCard
              title={`${currentMonth} Revenue`}
              value={`$${analytics.monthlyRevenue.toFixed(2)}`}
              icon={HandCoins}
              iconColor="text-default"
              borderColor="border-success"
              valueColor="text-default"
            />
            <MetricCard
              title="Upcoming Appointments"
              value={analytics.upcomingAppointments}
              icon={ClipboardClock}
              iconColor="text-blue-600"
              borderColor="border-blue-500/80"
              valueColor="text-blue-600"
            />
            <MetricCard
              title="Total Revenue"
              value={`$${analytics.totalRevenue.toFixed(2)}`}
              icon={PiggyBank}
              iconColor="text-money"
              borderColor="border-money"
              valueColor="text-money"
            />
          </div>

          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-lg shadow-sm xl:p-6 p-4 mb-8">
            <h2 className="text-lg xl:text-xl font-bold text-gray-900 mb-4 xl:mb-6">
              Six-Month Trends
            </h2>
            <TrendsBarChart data={analytics.monthlyData} />
            <TrendsLineChart data={analytics.monthlyData} />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 xl:mb-0">
            <InvoiceStatus
              paid={analytics.invoices.paid}
              unpaid={analytics.invoices.unpaid}
            />
            <AppointmentStatus
              upcoming={analytics.appointments.upcoming}
              completed={analytics.appointments.completed}
              canceled={analytics.appointments.canceled}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
