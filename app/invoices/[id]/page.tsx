"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import InvoiceActionButtons from "@/components/InvoiceActionButtons";
import InvoiceHeader from "@/components/InvoiceHeader";
import InvoiceDates from "@/components/InvoiceDates";
import InvoiceBillTo from "@/components/InvoiceBillTo";
import InvoiceLineItemsTable from "@/components/InvoiceLineItemsTable";
import InvoiceTotalsSummary from "@/components/InvoiceTotalsSummary";
import InvoiceNotesDisplay from "@/components/InvoiceNotesDisplay";
import { useInvoiceDetail } from "@/hooks/useInvoiceDetail";
import { generateInvoicePDF } from "@/utils/generateInvoicePDF";
import { MoveLeft } from "lucide-react";

export default function InvoiceDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const {
    invoice,
    client,
    loading,
    updating,
    deleting,
    error,
    handleTogglePaidStatus,
    handleDelete,
    isOverdue,
  } = useInvoiceDetail(session, params.id as string);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleGeneratePDF = () => {
    if (invoice && client) {
      generateInvoicePDF(invoice, client);
    }
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">
            {error || "Invoice not found"}
          </p>
          <Link href="/invoices" className="text-blue-600 hover:underline">
            ← Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:min-h-screen bg-background xl:flex xl:justify-center">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-64 py-6 px-8 max-w-5xl mb-20 xl:mb-0">
        {/* Back Button */}
        <Link
          href="/invoices"
          className="flex gap-1 items-center text-default hover:text-default/90 mb-6"
        >
          <MoveLeft size={16} /> Back to Invoices
        </Link>

        <div>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <InvoiceActionButtons
            invoice={invoice}
            updating={updating}
            deleting={deleting}
            onTogglePaidStatus={handleTogglePaidStatus}
            onDownloadPDF={handleGeneratePDF}
            onDelete={handleDelete}
          />

          {/* Invoice Display */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Invoice Header */}
            <InvoiceHeader invoice={invoice} isOverdue={isOverdue} />

            {/* Dates */}
            <InvoiceDates invoice={invoice} isOverdue={isOverdue} />

            {/* Bill To */}
            <InvoiceBillTo client={client} />

            {/* Line Items */}
            <InvoiceLineItemsTable items={invoice.items} />

            {/* Totals */}
            <InvoiceTotalsSummary invoice={invoice} />

            {/* Notes */}
            <InvoiceNotesDisplay notes={invoice.notes} />
          </div>
        </div>
      </main>
    </div>
  );
}
