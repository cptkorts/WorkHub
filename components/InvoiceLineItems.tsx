import React from "react";
import { Plus } from "lucide-react";
import InvoiceLineItem from "./InvoiceLineItem";
import { InvoiceItem } from "@/hooks/useInvoiceCreate";

interface InvoiceLineItemsProps {
  items: InvoiceItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
}

export default function InvoiceLineItems({
  items,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: InvoiceLineItemsProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text-default">Line Items</h2>
        <button
          type="button"
          onClick={onAddItem}
          className="flex gap-1 items-center group bg-success text-white px-4 py-2 rounded-md hover:bg-success/85 transition-all text-sm duration-200 cursor-pointer"
        >
          <Plus size={16} className="group-hover:scale-110" /> Add Item
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <InvoiceLineItem
            key={index}
            item={item}
            index={index}
            canRemove={items.length > 1}
            onItemChange={onItemChange}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
}
