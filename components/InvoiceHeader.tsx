import React from "react";
import { Invoice } from "@/hooks/useInvoiceDetail";

interface InvoiceHeaderProps {
  invoice: Invoice;
  isOverdue: (dueDate: string) => boolean;
}

export default function InvoiceHeader({
  invoice,
  isOverdue,
}: InvoiceHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
        <p className="text-lg text-gray-600">{invoice.invoiceNumber}</p>
      </div>
      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold ${
          invoice.status === "paid"
            ? "bg-success/20 text-success"
            : isOverdue(invoice.dueDate)
            ? "bg-red-100 text-red-800"
            : "bg-error/20 text-error"
        }`}
      >
        {invoice.status === "paid"
          ? "PAID"
          : isOverdue(invoice.dueDate)
          ? "OVERDUE"
          : "UNPAID"}
      </span>
    </div>
  );
}
