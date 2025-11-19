import React from "react";

interface InvoiceFilterTabsProps {
  filterStatus: "all" | "paid" | "unpaid";
  onFilterChange: (filter: "all" | "paid" | "unpaid") => void;
  totalCount: number;
  paidCount: number;
  unpaidCount: number;
}

export default function InvoiceFilterTabs({
  filterStatus,
  onFilterChange,
  totalCount,
  paidCount,
  unpaidCount,
}: InvoiceFilterTabsProps) {
  return (
    <div className="mb-6 flex gap-2">
      <button
        onClick={() => onFilterChange("all")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
          filterStatus === "all"
            ? "bg-accent text-white"
            : "text-accent hover:bg-accent/10"
        }`}
      >
        All ({totalCount})
      </button>
      <button
        onClick={() => onFilterChange("unpaid")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
          filterStatus === "unpaid"
            ? "bg-error text-white"
            : "text-accent hover:bg-error/20"
        }`}
      >
        Unpaid ({unpaidCount})
      </button>
      <button
        onClick={() => onFilterChange("paid")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
          filterStatus === "paid"
            ? "bg-success text-white"
            : "text-accent hover:bg-success/20"
        }`}
      >
        Paid ({paidCount})
      </button>
    </div>
  );
}
