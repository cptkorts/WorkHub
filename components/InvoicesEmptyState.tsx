import React from "react";
import { FilePlus } from "lucide-react";

interface InvoicesEmptyStateProps {
  filterStatus: "all" | "paid" | "unpaid";
  onCreateInvoice: () => void;
}

export default function InvoicesEmptyState({
  filterStatus,
  onCreateInvoice,
}: InvoicesEmptyStateProps) {
  return (
    <div className="bg-muted/10 rounded-lg shadow-sm p-12 flex flex-col items-center mb-20 xl:mb-0">
      <div className="text-6xl mb-4 text-default">
        <FilePlus size={80} />
      </div>
      <h3 className="text-xl font-semibold text-text-default mb-2">
        No invoices found
      </h3>
      <p className="text-light mb-6">
        {filterStatus === "all"
          ? "Create your first invoice to get started"
          : `No ${filterStatus} invoices`}
      </p>
      <button
        onClick={onCreateInvoice}
        className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors duration-200 cursor-pointer"
      >
        Create Invoice
      </button>
    </div>
  );
}
