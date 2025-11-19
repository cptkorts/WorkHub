import React from "react";

interface InvoiceNotesDisplayProps {
  notes?: string;
}

export default function InvoiceNotesDisplay({
  notes,
}: InvoiceNotesDisplayProps) {
  if (!notes) return null;

  return (
    <div className="border-t pt-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">NOTES:</h3>
      <p className="text-gray-700">{notes}</p>
    </div>
  );
}
