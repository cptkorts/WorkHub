import React from "react";
import { Invoice } from "@/hooks/useInvoiceDetail";

interface InvoiceTotalsSummaryProps {
  invoice: Invoice;
}

export default function InvoiceTotalsSummary({
  invoice,
}: InvoiceTotalsSummaryProps) {
  return (
    <div className="flex justify-end mb-8">
      <div className="w-64 space-y-2">
        <div className="flex justify-between py-2 text-gray-700">
          <span>Subtotal:</span>
          <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 text-gray-700">
          <span>Tax:</span>
          <span className="font-semibold">${invoice.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-3 border-t-2 border-gray-300 text-xl font-bold text-gray-900">
          <span>TOTAL:</span>
          <span>${invoice.total.toFixed(2)}</span>
        </div>
        {invoice.paidDate && (
          <div className="flex justify-between py-2 text-green-600">
            <span>Paid on:</span>
            <span className="font-semibold">
              {new Date(invoice.paidDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
