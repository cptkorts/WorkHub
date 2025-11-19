import React from "react";
import { Client } from "@/hooks/useInvoiceDetail";

interface InvoiceBillToProps {
  client: Client | null;
}

export default function InvoiceBillTo({ client }: InvoiceBillToProps) {
  if (!client) return null;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</h3>
      <div className="text-gray-900">
        <p className="font-semibold text-lg">{client.fullName}</p>
        {client.businessName && <p>{client.businessName}</p>}
        {client.email && <p>{client.email}</p>}
        {client.phone && <p>{client.phone}</p>}
        {client.address && <p>{client.address}</p>}
      </div>
    </div>
  );
}
