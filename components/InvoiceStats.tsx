import React from "react";

interface InvoiceStatsProps {
  totalCount: number;
  paidCount: number;
  unpaidCount: number;
  totalRevenue: number;
}

export default function InvoiceStats({
  totalCount,
  paidCount,
  unpaidCount,
  totalRevenue,
}: InvoiceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-light text-sm mb-1">Total Invoices</p>
        <p className="text-3xl font-bold text-text-default">{totalCount}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-light text-sm mb-1">Paid</p>
        <p className="text-3xl font-bold text-hover">{paidCount}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-light text-sm mb-1">Unpaid</p>
        <p className="text-3xl font-bold text-error">{unpaidCount}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-light text-sm mb-1">Total Revenue</p>
        <p className="text-3xl font-bold text-green">
          ${totalRevenue.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
