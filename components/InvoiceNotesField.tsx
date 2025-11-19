import React from "react";

interface InvoiceNotesFieldProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function InvoiceNotesField({
  notes,
  onNotesChange,
}: InvoiceNotesFieldProps) {
  return (
    <div>
      <label className="block font-medium text-hover mb-1">Notes</label>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        placeholder="Additional notes or payment terms..."
      />
    </div>
  );
}
