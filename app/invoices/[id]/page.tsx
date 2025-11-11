"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import Navbar from "@/components/Navbar";
import { MoveLeft } from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  _id: string;
  userId: string;
  clientId: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "paid" | "unpaid";
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function InvoiceDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetchInvoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, params.id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
        fetchClient(data.clientId);
      } else {
        setError("Invoice not found");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setError("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  const fetchClient = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setClient(data);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    }
  };

  const handleTogglePaidStatus = async () => {
    if (!invoice) return;

    const newStatus = invoice.status === "paid" ? "unpaid" : "paid";
    setUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/invoices/${invoice._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update invoice status");
      }

      const updatedInvoice = await response.json();
      setInvoice(updatedInvoice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this invoice? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/invoices/${invoice?._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete invoice");
      }

      router.push("/invoices");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setDeleting(false);
    }
  };

  const generatePDF = () => {
    if (!invoice || !client) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, yPos, { align: "center" });

    yPos += 15;

    // Invoice Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, yPos);
    doc.text(
      `Date: ${new Date(invoice.createdAt).toLocaleDateString()}`,
      pageWidth - 20,
      yPos,
      { align: "right" }
    );

    yPos += 6;
    doc.text(
      `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
      pageWidth - 20,
      yPos,
      { align: "right" }
    );

    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(
      invoice.status === "paid" ? 0 : 200,
      invoice.status === "paid" ? 150 : 80,
      0
    );
    doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 20, yPos, {
      align: "right",
    });
    doc.setTextColor(0, 0, 0);

    yPos += 15;

    // Client Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("BILL TO:", 20, yPos);

    yPos += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(client.fullName, 20, yPos);

    if (client.businessName) {
      yPos += 5;
      doc.text(client.businessName, 20, yPos);
    }
    if (client.email) {
      yPos += 5;
      doc.text(client.email, 20, yPos);
    }
    if (client.phone) {
      yPos += 5;
      doc.text(client.phone, 20, yPos);
    }
    if (client.address) {
      yPos += 5;
      doc.text(client.address, 20, yPos);
    }

    yPos += 15;

    // Line Items Table
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, pageWidth - 40, 8, "F");

    doc.text("Description", 22, yPos);
    doc.text("Qty", pageWidth - 90, yPos, { align: "right" });
    doc.text("Price", pageWidth - 60, yPos, { align: "right" });
    doc.text("Total", pageWidth - 22, yPos, { align: "right" });

    yPos += 10;
    doc.setFont("helvetica", "normal");

    invoice.items.forEach((item) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(item.description, 22, yPos);
      doc.text(item.quantity.toString(), pageWidth - 90, yPos, {
        align: "right",
      });
      doc.text(`$${item.price.toFixed(2)}`, pageWidth - 60, yPos, {
        align: "right",
      });
      doc.text(`$${item.total.toFixed(2)}`, pageWidth - 22, yPos, {
        align: "right",
      });

      yPos += 7;
    });

    yPos += 5;

    // Totals
    doc.line(pageWidth - 80, yPos, pageWidth - 20, yPos);
    yPos += 8;

    doc.text("Subtotal:", pageWidth - 60, yPos);
    doc.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - 22, yPos, {
      align: "right",
    });

    yPos += 6;
    doc.text("Tax:", pageWidth - 60, yPos);
    doc.text(`$${invoice.tax.toFixed(2)}`, pageWidth - 22, yPos, {
      align: "right",
    });

    yPos += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL:", pageWidth - 60, yPos);
    doc.text(`$${invoice.total.toFixed(2)}`, pageWidth - 22, yPos, {
      align: "right",
    });

    // Notes
    if (invoice.notes) {
      yPos += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Notes:", 20, yPos);

      yPos += 6;
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 40);
      doc.text(splitNotes, 20, yPos);
    }

    // Save PDF
    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  const isOverdue = (dueDate: string) => {
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!session || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">
            {error || "Invoice not found"}
          </p>
          <Link href="/invoices" className="text-blue-600 hover:underline">
            ← Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

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
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleTogglePaidStatus}
              disabled={updating}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                invoice.status === "paid"
                  ? "bg-error text-white hover:bg-error/80"
                  : "bg-success text-white hover:bg-success/80"
              }`}
            >
              {updating
                ? "Updating..."
                : invoice.status === "paid"
                ? "Mark as Unpaid"
                : "Mark as Paid"}
            </button>
            <button
              onClick={generatePDF}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors duration-200 cursor-pointer font-semibold"
            >
              Download PDF
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-3 bg-error text-white rounded-lg hover:bg-error/80 transition-colors duration-200 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>

          {/* Invoice Display */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  INVOICE
                </h1>
                <p className="text-lg text-gray-600">{invoice.invoiceNumber}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  invoice.status === "paid"
                    ? "bg-success/20 text-success"
                    : isOverdue(invoice.dueDate)
                    ? "bg-red-100 text-red-800"
                    : "bg-error/20 text-error"
                }`}
              >
                {invoice.status === "paid"
                  ? "PAID"
                  : isOverdue(invoice.dueDate)
                  ? "OVERDUE"
                  : "UNPAID"}
              </span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="font-semibold">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p
                  className={`font-semibold ${
                    isOverdue(invoice.dueDate) && invoice.status === "unpaid"
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Bill To */}
            {client && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  BILL TO:
                </h3>
                <div className="text-gray-900">
                  <p className="font-semibold text-lg">{client.fullName}</p>
                  {client.businessName && <p>{client.businessName}</p>}
                  {client.email && <p>{client.email}</p>}
                  {client.phone && <p>{client.phone}</p>}
                  {client.address && <p>{client.address}</p>}
                </div>
              </div>
            )}

            {/* Line Items */}
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
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-2 text-gray-900">
                        {item.description}
                      </td>
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

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between py-2 text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    ${invoice.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-gray-700">
                  <span>Tax:</span>
                  <span className="font-semibold">
                    ${invoice.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300 text-xl font-bold text-gray-900">
                  <span>TOTAL:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
                {invoice.paidDate && (
                  <div className="flex justify-between py-2 text-green-600">
                    <span>Paid on:</span>
                    <span className="font-semibold">
                      {new Date(invoice.paidDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  NOTES:
                </h3>
                <p className="text-gray-700">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
