"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import InvoiceStats from "@/components/InvoiceStats";
import InvoiceOutstandingBanner from "@/components/InvoiceOutstandingBanner";
import InvoiceFilterTabs from "@/components/InvoiceFilterTabs";
import InvoicesGrid from "@/components/InvoicesGrid";
import { useInvoices } from "@/hooks/useInvoices";
import { Plus } from "lucide-react";

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    invoices,
    clients,
    loading,
    getPaidInvoices,
    getUnpaidInvoices,
    getTotalRevenue,
    getOutstandingBalance,
    getFilteredInvoices,
    isOverdue,
  } = useInvoices(session);

  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid">(
    "all"
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  const filteredInvoices = getFilteredInvoices(filterStatus);

  return (
    <div className="min-h-screen bg-background xl:flex">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-64 py-6 px-8">
        <div>
          {/* Page Header */}
          <div className="flex flex-col xl:flex-row xl:justify-between gap-3 xl:gap-0 items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-default text-center xl:text-left">
                Invoices
              </h1>
              <p className="text-light mt-1">
                Manage invoices and track payments
              </p>
            </div>
            <button
              onClick={() => router.push("/invoices/create")}
              className="bg-success group text-white px-6 py-3 rounded-lg hover:bg-success/70 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span className="text-xl group-hover:scale-120 transition-transform duration-200">
                <Plus size={20} />
              </span>
              Create Invoice
            </button>
          </div>

          {/* Stats Cards */}
          <InvoiceStats
            totalCount={invoices.length}
            paidCount={getPaidInvoices().length}
            unpaidCount={getUnpaidInvoices().length}
            totalRevenue={getTotalRevenue()}
          />

          {/* Outstanding Balance Banner */}
          <InvoiceOutstandingBanner
            outstandingBalance={getOutstandingBalance()}
            unpaidCount={getUnpaidInvoices().length}
          />

          {/* Filter Tabs */}
          <InvoiceFilterTabs
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            totalCount={invoices.length}
            paidCount={getPaidInvoices().length}
            unpaidCount={getUnpaidInvoices().length}
          />

          {/* Invoices Grid */}
          <InvoicesGrid
            invoices={filteredInvoices}
            clients={clients}
            filterStatus={filterStatus}
            isOverdue={isOverdue}
            onCreateInvoice={() => router.push("/invoices/create")}
          />
        </div>
      </main>
    </div>
  );
}
