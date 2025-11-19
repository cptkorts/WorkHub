import React from "react";
import { Client } from "@/hooks/useInvoiceCreate";

interface InvoiceDetailsFormProps {
  formData: {
    clientId: string;
    invoiceNumber: string;
    dueDate: string;
    tax: string;
  };
  clients: Client[];
  onFormChange: (field: string, value: string) => void;
}

export default function InvoiceDetailsForm({
  formData,
  clients,
  onFormChange,
}: InvoiceDetailsFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block font-medium text-hover mb-1">Client</label>
        <select
          required
          value={formData.clientId}
          onChange={(e) => onFormChange("clientId", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        >
          <option value="" className="text-default">
            Select a client
          </option>
          {clients.map((client) => (
            <option
              key={client._id}
              value={client._id}
              className="text-default"
            >
              {client.fullName}
              {client.businessName && ` (${client.businessName})`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block  font-medium text-hover mb-1">
          Invoice Number
        </label>
        <input
          type="text"
          required
          value={formData.invoiceNumber}
          onChange={(e) => onFormChange("invoiceNumber", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
          placeholder="INV-202411-001"
        />
      </div>

      <div>
        <label className="block font-medium text-hover mb-1">Due Date</label>
        <input
          type="date"
          required
          value={formData.dueDate}
          onChange={(e) => onFormChange("dueDate", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        />
      </div>

      <div>
        <label className="block font-medium text-hover mb-1">Tax (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={formData.tax}
          onChange={(e) => onFormChange("tax", e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
          placeholder="0"
        />
      </div>
    </div>
  );
}
