import React from "react";
import { Invoice } from "@/hooks/useInvoiceDetail";

interface InvoiceActionButtonsProps {
  invoice: Invoice;
  updating: boolean;
  deleting: boolean;
  onTogglePaidStatus: () => void;
  onDownloadPDF: () => void;
  onDelete: () => void;
}

export default function InvoiceActionButtons({
  invoice,
  updating,
  deleting,
  onTogglePaidStatus,
  onDownloadPDF,
  onDelete,
}: InvoiceActionButtonsProps) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={onTogglePaidStatus}
        disabled={updating}
        className={`flex-1 px-3 py-2 xl:px-6 xl:py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          invoice.status === "paid"
            ? "bg-error text-white hover:bg-error/80"
            : "bg-success text-white hover:bg-success/80"
        }`}
      >
        {updating
          ? "Updating..."
          : invoice.status === "paid"
          ? "Mark as Unpaid"
          : "Mark as Paid"}
      </button>
      <button
        onClick={onDownloadPDF}
        className="px-3 py-2 xl:px-6 xl:py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors duration-200 cursor-pointer font-semibold"
      >
        Download PDF
      </button>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="px-3 py-2 xl:px-6 xl:py-3 bg-error text-white rounded-lg hover:bg-error/80 transition-colors duration-200 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
