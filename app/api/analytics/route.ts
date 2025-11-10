import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Client from "@/lib/models/Client";
import Invoice from "@/lib/models/Invoice";
import Appointment from "@/lib/models/Appointment";
import mongoose from "mongoose";

// GET analytics data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;
    const userObjectId = new mongoose.Types.ObjectId(session.user.id);

    // Get current month start and end
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Aggregate: Total Clients
    const totalClientsResult = await Client.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $count: "total",
      },
    ]);
    const totalClients = totalClientsResult[0]?.total || 0;

    // Aggregate: This Month's Revenue (paid invoices)
    const monthlyRevenueResult = await Invoice.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: "paid",
          paidDate: {
            $gte: monthStart,
            $lte: monthEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);
    const monthlyRevenue = monthlyRevenueResult[0]?.totalRevenue || 0;

    // Aggregate: Upcoming Appointments (status: upcoming)
    const upcomingAppointmentsResult = await Appointment.aggregate([
      {
        $match: {
          userId: userId,
          status: "upcoming",
          date: { $gte: now },
        },
      },
      {
        $count: "total",
      },
    ]);
    const upcomingAppointments = upcomingAppointmentsResult[0]?.total || 0;

    // Aggregate: Total Revenue (all paid invoices)
    const totalRevenueResult = await Invoice.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);
    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    // Aggregate: Monthly Income Chart Data (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyIncomeResult = await Invoice.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: "paid",
          paidDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paidDate" },
            month: { $month: "$paidDate" },
          },
          income: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Format monthly income data
    const monthlyIncome = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const dataPoint = monthlyIncomeResult.find(
        (item) => item._id.year === year && item._id.month === month
      );

      monthlyIncome.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        income: dataPoint?.income || 0,
        count: dataPoint?.count || 0,
      });
    }

    // Aggregate: Paid vs Unpaid Invoices
    const invoiceStatusResult = await Invoice.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
    ]);

    const paidInvoices = invoiceStatusResult.find(
      (item) => item._id === "paid"
    ) || {
      count: 0,
      total: 0,
    };
    const unpaidInvoices = invoiceStatusResult.find(
      (item) => item._id === "unpaid"
    ) || {
      count: 0,
      total: 0,
    };

    // Aggregate: Appointment Status Breakdown
    const appointmentStatusResult = await Appointment.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const appointmentsByStatus = {
      upcoming:
        appointmentStatusResult.find((item) => item._id === "upcoming")
          ?.count || 0,
      completed:
        appointmentStatusResult.find((item) => item._id === "completed")
          ?.count || 0,
      canceled:
        appointmentStatusResult.find((item) => item._id === "canceled")
          ?.count || 0,
    };

    return NextResponse.json({
      totalClients,
      monthlyRevenue,
      upcomingAppointments,
      totalRevenue,
      monthlyIncome,
      invoices: {
        paid: paidInvoices,
        unpaid: unpaidInvoices,
      },
      appointments: appointmentsByStatus,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
