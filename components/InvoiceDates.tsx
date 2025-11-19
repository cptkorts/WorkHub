import React from "react";
import { Invoice } from "@/hooks/useInvoiceDetail";

interface InvoiceDatesProps {
  invoice: Invoice;
  isOverdue: (dueDate: string) => boolean;
}

export default function InvoiceDates({
  invoice,
  isOverdue,
}: InvoiceDatesProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div>
        <p className="text-sm text-gray-600">Issue Date</p>
        <p className="font-semibold">
          {new Date(invoice.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Due Date</p>
        <p
          className={`font-semibold ${
            isOverdue(invoice.dueDate) && invoice.status === "unpaid"
              ? "text-red-600"
              : ""
          }`}
        >
          {new Date(invoice.dueDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
