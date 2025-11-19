import React from "react";
import { InvoiceItem } from "@/hooks/useInvoiceDetail";

interface InvoiceLineItemsTableProps {
  items: InvoiceItem[];
}

export default function InvoiceLineItemsTable({
  items,
}: InvoiceLineItemsTableProps) {
  return (
    <div className="mb-8">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
              Description
            </th>
            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 w-20">
              Qty
            </th>
            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 w-28">
              Price
            </th>
            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 w-28">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-3 px-2 text-gray-900">{item.description}</td>
              <td className="py-3 px-2 text-right text-gray-900">
                {item.quantity}
              </td>
              <td className="py-3 px-2 text-right text-gray-900">
                ${item.price.toFixed(2)}
              </td>
              <td className="py-3 px-2 text-right text-gray-900 font-semibold">
                ${item.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
