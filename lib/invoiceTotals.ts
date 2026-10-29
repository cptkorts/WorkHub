export interface RawInvoiceItem {
  description?: unknown;
  quantity?: unknown;
  price?: unknown;
}

export interface NormalizedInvoice {
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const isNonNegativeNumber = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n) && n >= 0;

// Recomputes line totals, subtotal and total on the server so that
// client-supplied amounts are never trusted. Returns null for invalid input.
export function normalizeInvoiceAmounts(
  rawItems: unknown,
  rawTax: unknown
): NormalizedInvoice | null {
  if (!Array.isArray(rawItems) || rawItems.length === 0) return null;
  const tax = rawTax === undefined || rawTax === null ? 0 : rawTax;
  if (!isNonNegativeNumber(tax)) return null;

  const items: NormalizedInvoice["items"] = [];
  for (const item of rawItems as RawInvoiceItem[]) {
    if (
      !item ||
      typeof item.description !== "string" ||
      !item.description.trim() ||
      !isNonNegativeNumber(item.quantity) ||
      !isNonNegativeNumber(item.price)
    ) {
      return null;
    }
    items.push({
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: round2(item.quantity * item.price),
    });
  }

  const subtotal = round2(items.reduce((sum, i) => sum + i.total, 0));
  const roundedTax = round2(tax);
  return {
    items,
    subtotal,
    tax: roundedTax,
    total: round2(subtotal + roundedTax),
  };
}
