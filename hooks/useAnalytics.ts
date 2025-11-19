import { useState, useEffect } from "react";

interface MonthlyData {
  month: string;
  revenue: number;
  clients: number;
  appointments: number;
}

export interface AnalyticsData {
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

export function useAnalytics(session: unknown) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return { analytics, loading, error };
}
