"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  _id: string;
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
}

interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
}

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "unpaid">(
    "all"
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchInvoices();
      fetchClients();
    }
  }, [session]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        const clientsMap: { [key: string]: Client } = {};
        data.forEach((client: Client) => {
          clientsMap[client._id] = client;
        });
        setClients(clientsMap);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const getFilteredInvoices = () => {
    if (filterStatus === "all") return invoices;
    return invoices.filter((inv) => inv.status === filterStatus);
  };

  const getPaidInvoices = () => invoices.filter((inv) => inv.status === "paid");
  const getUnpaidInvoices = () =>
    invoices.filter((inv) => inv.status === "unpaid");

  const getTotalRevenue = () => {
    return getPaidInvoices().reduce((sum, inv) => sum + inv.total, 0);
  };

  const getOutstandingBalance = () => {
    return getUnpaidInvoices().reduce((sum, inv) => sum + inv.total, 0);
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
          <p className="mt-4 text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const filteredInvoices = getFilteredInvoices();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 ml-64 py-6 px-8">
        <div>
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600 mt-1">
                Manage invoices and track payments
              </p>
            </div>
            <button
              onClick={() => router.push("/invoices/create")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Create Invoice
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">
                {invoices.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm mb-1">Paid</p>
              <p className="text-3xl font-bold text-green-600">
                {getPaidInvoices().length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm mb-1">Unpaid</p>
              <p className="text-3xl font-bold text-orange-600">
                {getUnpaidInvoices().length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-600">
                ${getTotalRevenue().toFixed(2)}
              </p>
            </div>
          </div>

          {/* Outstanding Balance Banner */}
          {getOutstandingBalance() > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-800 font-semibold">
                    Outstanding Balance
                  </p>
                  <p className="text-orange-600 text-sm">
                    {getUnpaidInvoices().length} unpaid invoice(s)
                  </p>
                </div>
                <p className="text-2xl font-bold text-orange-900">
                  ${getOutstandingBalance().toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setFilterStatus("unpaid")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "unpaid"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Unpaid ({getUnpaidInvoices().length})
            </button>
            <button
              onClick={() => setFilterStatus("paid")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "paid"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Paid ({getPaidInvoices().length})
            </button>
          </div>

          {/* Invoices Grid */}
          {filteredInvoices.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No invoices found
              </h3>
              <p className="text-gray-500 mb-6">
                {filterStatus === "all"
                  ? "Create your first invoice to get started"
                  : `No ${filterStatus} invoices`}
              </p>
              <button
                onClick={() => router.push("/invoices/create")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Invoice
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvoices.map((invoice) => (
                <Link
                  key={invoice._id}
                  href={`/invoices/${invoice._id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-2 border-transparent hover:border-blue-200"
                >
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {invoice.invoiceNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {clients[invoice.clientId]?.fullName ||
                          "Unknown Client"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : isOverdue(invoice.dueDate)
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {invoice.status === "paid"
                        ? "Paid"
                        : isOverdue(invoice.dueDate)
                        ? "Overdue"
                        : "Unpaid"}
                    </span>
                  </div>

                  {/* Invoice Amount */}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900">
                      ${invoice.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.items.length} item(s)
                    </p>
                  </div>

                  {/* Invoice Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due:</span>
                      <span
                        className={
                          isOverdue(invoice.dueDate) &&
                          invoice.status === "unpaid"
                            ? "text-red-600 font-semibold"
                            : "text-gray-900"
                        }
                      >
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {invoice.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid:</span>
                        <span className="text-green-600">
                          {new Date(invoice.paidDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
