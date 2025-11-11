"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { MoveLeft, Plus, X } from "lucide-react";

interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
  email?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export default function CreateInvoicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: "",
    dueDate: "",
    tax: "0",
    notes: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, price: 0, total: 0 },
  ]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchClients();
      generateInvoiceNumber();
    }
  }, [session]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    setFormData((prev) => ({
      ...prev,
      invoiceNumber: `INV-${year}${month}-${random}`,
    }));
  };

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate total for the item
    if (field === "quantity" || field === "price") {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }

    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * parseFloat(formData.tax || "0")) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate items
    const validItems = items.filter(
      (item) => item.description.trim() && item.quantity > 0 && item.price >= 0
    );

    if (validItems.length === 0) {
      setError("Please add at least one valid item");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: formData.clientId,
          invoiceNumber: formData.invoiceNumber,
          items: validItems,
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          total: calculateTotal(),
          status: "unpaid",
          dueDate: formData.dueDate,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      const invoice = await response.json();
      router.push(`/invoices/${invoice._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 ml-60 py-6 px-8 max-w-5xl">
        {/* Back Button */}
        <Link
          href="/invoices"
          className="flex gap-1 items-center text-default hover:text-default/90 mb-6"
        >
          <MoveLeft size={16} /> Back to Invoices
        </Link>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-text-default mb-6">
              Create Invoice
            </h1>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-hover mb-1">
                    Client
                  </label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) =>
                      setFormData({ ...formData, clientId: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invoiceNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                    placeholder="INV-202411-001"
                  />
                </div>

                <div>
                  <label className="block font-medium text-hover mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  />
                </div>

                <div>
                  <label className="block font-medium text-hover mb-1">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.tax}
                    onChange={(e) =>
                      setFormData({ ...formData, tax: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-text-default">
                    Line Items
                  </h2>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex gap-1 items-center group bg-success text-white px-4 py-2 rounded-md hover:bg-success/85 transition-all text-sm duration-200 cursor-pointer"
                  >
                    <Plus size={16} className="group-hover:scale-110" /> Add
                    Item
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-5">
                          <label className="block text-sm font-medium text-hover mb-1">
                            Description *
                          </label>
                          <input
                            type="text"
                            required
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
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
                              handleItemChange(
                                index,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
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
                              handleItemChange(
                                index,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
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
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="group flex items-center justify-center w-10 h-10 bg-error/20 text-error rounded-full hover:bg-error/30 transition-all duration-200 cursor-pointer"
                              title="Remove item"
                            >
                              <X size={20} className="group-hover:scale-110" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-6">
                <div className="max-w-sm ml-auto space-y-2">
                  <div className="flex justify-between text-text-default">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-default/75">
                    <span>Tax ({formData.tax}%):</span>
                    <span className="font-semibold">
                      ${calculateTax().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-text-default pt-2 border-t">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-medium text-hover mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  placeholder="Additional notes or payment terms..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/invoices")}
                  className="px-6 py-3 bg-background border border-border rounded-md text-success hover:text-light hover:bg-muted transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 font-semibold bg-success text-white rounded-md hover:bg-default/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
