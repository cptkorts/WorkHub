import React from "react";

interface InvoiceTotalsProps {
  subtotal: number;
  tax: number;
  taxRate: string;
  total: number;
}

export default function InvoiceTotals({
  subtotal,
  tax,
  taxRate,
  total,
}: InvoiceTotalsProps) {
  return (
    <div className="border-t pt-6">
      <div className="max-w-sm ml-auto space-y-2">
        <div className="flex justify-between text-text-default">
          <span>Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-default/75">
          <span>Tax ({taxRate}%):</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-text-default pt-2 border-t">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
