import React from "react";
import InvoiceCard from "./InvoiceCard";
import InvoicesEmptyState from "./InvoicesEmptyState";
import { Invoice, Client } from "@/hooks/useInvoices";

interface InvoicesGridProps {
  invoices: Invoice[];
  clients: { [key: string]: Client };
  filterStatus: "all" | "paid" | "unpaid";
  isOverdue: (dueDate: string) => boolean;
  onCreateInvoice: () => void;
}

export default function InvoicesGrid({
  invoices,
  clients,
  filterStatus,
  isOverdue,
  onCreateInvoice,
}: InvoicesGridProps) {
  if (invoices.length === 0) {
    return (
      <InvoicesEmptyState
        filterStatus={filterStatus}
        onCreateInvoice={onCreateInvoice}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 xl:mb-0">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice._id}
          invoice={invoice}
          clientName={clients[invoice.clientId]?.fullName || "Unknown Client"}
          isOverdue={isOverdue}
        />
      ))}
    </div>
  );
}
