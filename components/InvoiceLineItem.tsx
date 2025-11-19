import React from "react";
import { X } from "lucide-react";
import { InvoiceItem } from "@/hooks/useInvoiceCreate";

interface InvoiceLineItemProps {
  item: InvoiceItem;
  index: number;
  canRemove: boolean;
  onItemChange: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
}

export default function InvoiceLineItem({
  item,
  index,
  canRemove,
  onItemChange,
  onRemove,
}: InvoiceLineItemProps) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5">
          <label className="block text-sm font-medium text-hover mb-1">
            Description *
          </label>
          <input
            type="text"
            required
            value={item.description}
            onChange={(e) => onItemChange(index, "description", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
            placeholder="Service or product description"
          />
        </div>

        <div className="col-span-6 md:col-span-2">
          <label className="block text-sm font-medium text-hover mb-1">
            Qty *
          </label>
          <input
            type="number"
            required
            min="1"
            value={item.quantity}
            onChange={(e) =>
              onItemChange(index, "quantity", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
          />
        </div>

        <div className="col-span-6 md:col-span-2">
          <label className="block text-sm font-medium text-hover mb-1">
            Price *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={item.price}
            onChange={(e) =>
              onItemChange(index, "price", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
          />
        </div>

        <div className="col-span-10 md:col-span-2">
          <label className="block text-sm font-medium text-hover mb-1">
            Total
          </label>
          <div className="px-3 py-2 bg-success/20 border border-border rounded-md font-semibold text-text-default">
            ${item.total.toFixed(2)}
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 flex items-end justify-center">
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="group flex items-center justify-center w-10 h-10 bg-error/20 text-error rounded-full hover:bg-error/30 transition-all duration-200 cursor-pointer"
              title="Remove item"
            >
              <X size={20} className="group-hover:scale-110" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
