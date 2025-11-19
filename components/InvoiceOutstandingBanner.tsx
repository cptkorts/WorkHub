import React from "react";

interface InvoiceOutstandingBannerProps {
  outstandingBalance: number;
  unpaidCount: number;
}

export default function InvoiceOutstandingBanner({
  outstandingBalance,
  unpaidCount,
}: InvoiceOutstandingBannerProps) {
  if (outstandingBalance <= 0) return null;

  return (
    <div className="bg-error/20 border border-error/50 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-error font-semibold">Outstanding Balance</p>
          <p className="text-error/80 text-sm">
            {unpaidCount} unpaid invoice(s)
          </p>
        </div>
        <p className="text-2xl font-bold text-red-900">
          ${outstandingBalance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
