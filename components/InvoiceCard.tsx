import React from "react";
import Link from "next/link";
import { Invoice } from "@/hooks/useInvoices";

interface InvoiceCardProps {
  invoice: Invoice;
  clientName: string;
  isOverdue: (dueDate: string) => boolean;
}

export default function InvoiceCard({
  invoice,
  clientName,
  isOverdue,
}: InvoiceCardProps) {
  return (
    <Link
      href={`/invoices/${invoice._id}`}
      className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6 border-2 border-transparent hover:border-success/50"
    >
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-default">
            {invoice.invoiceNumber}
          </h3>
          <p className="text-sm text-light">{clientName}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            invoice.status === "paid"
              ? "bg-success/20 text-success"
              : isOverdue(invoice.dueDate)
              ? "bg-red-100 text-red-800"
              : "bg-error/20 text-error"
          }`}
        >
          {invoice.status === "paid"
            ? "Paid"
            : isOverdue(invoice.dueDate)
            ? "Overdue"
            : "Unpaid"}
        </span>
      </div>

      {/* Invoice Amount */}
      <div className="mb-4">
        <p className="text-3xl font-bold text-text-default">
          ${invoice.total.toFixed(2)}
        </p>
        <p className="text-sm text-light">{invoice.items.length} item(s)</p>
      </div>

      {/* Invoice Dates */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">Created:</span>
          <span className="text-text-default">
            {new Date(invoice.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Due:</span>
          <span
            className={
              isOverdue(invoice.dueDate) && invoice.status === "unpaid"
                ? "text-error font-semibold"
                : "text-text-default"
            }
          >
            {new Date(invoice.dueDate).toLocaleDateString()}
          </span>
        </div>
        {invoice.paidDate && (
          <div className="flex justify-between">
            <span className="text-text-muted">Paid:</span>
            <span className="text-green">
              {new Date(invoice.paidDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
