"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FilePlus, Plus } from "lucide-react";

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
    return <LoadingSpinner />;
  }

  if (!session) return null;

  const filteredInvoices = getFilteredInvoices();

  return (
    <div className="min-h-screen bg-background xl:flex">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-64 py-6 px-8">
        <div>
          {/* Page Header */}
          <div className="flex flex-col xl:flex-row xl:justify-between gap-3 xl:gap-0 items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-default text-center xl:text-left">
                Invoices
              </h1>
              <p className="text-light mt-1">
                Manage invoices and track payments
              </p>
            </div>
            <button
              onClick={() => router.push("/invoices/create")}
              className="bg-success group text-white px-6 py-3 rounded-lg hover:bg-success/70 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span className="text-xl group-hover:scale-120 transition-transform duration-200">
                <Plus size={20} />
              </span>
              Create Invoice
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-light text-sm mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-text-default">
                {invoices.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-light text-sm mb-1">Paid</p>
              <p className="text-3xl font-bold text-hover">
                {getPaidInvoices().length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-light text-sm mb-1">Unpaid</p>
              <p className="text-3xl font-bold text-error">
                {getUnpaidInvoices().length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-light text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green">
                ${getTotalRevenue().toFixed(2)}
              </p>
            </div>
          </div>

          {/* Outstanding Balance Banner */}
          {getOutstandingBalance() > 0 && (
            <div className="bg-error/20 border border-error/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-error font-semibold">
                    Outstanding Balance
                  </p>
                  <p className="text-error/80 text-sm">
                    {getUnpaidInvoices().length} unpaid invoice(s)
                  </p>
                </div>
                <p className="text-2xl font-bold text-red-900">
                  ${getOutstandingBalance().toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                filterStatus === "all"
                  ? "bg-accent text-white"
                  : "text-accent hover:bg-accent/10"
              }`}
            >
              All ({invoices.length})
            </button>
            <button
              onClick={() => setFilterStatus("unpaid")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                filterStatus === "unpaid"
                  ? "bg-error text-white"
                  : "text-accent hover:bg-error/20"
              }`}
            >
              Unpaid ({getUnpaidInvoices().length})
            </button>
            <button
              onClick={() => setFilterStatus("paid")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                filterStatus === "paid"
                  ? "bg-success text-white"
                  : "text-accent hover:bg-success/20"
              }`}
            >
              Paid ({getPaidInvoices().length})
            </button>
          </div>

          {/* Invoices Grid */}
          {filteredInvoices.length === 0 ? (
            <div className="bg-muted/10 rounded-lg shadow-sm p-12 flex flex-col items-center mb-20 xl:mb-0">
              <div className="text-6xl mb-4 text-default">
                <FilePlus size={80} />
              </div>
              <h3 className="text-xl font-semibold text-text-default mb-2">
                No invoices found
              </h3>
              <p className="text-light mb-6">
                {filterStatus === "all"
                  ? "Create your first invoice to get started"
                  : `No ${filterStatus} invoices`}
              </p>
              <button
                onClick={() => router.push("/invoices/create")}
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors duration-200 cursor-pointer"
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
                  className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6 border-2 border-transparent hover:border-success/50"
                >
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text-default">
                        {invoice.invoiceNumber}
                      </h3>
                      <p className="text-sm text-light">
                        {clients[invoice.clientId]?.fullName ||
                          "Unknown Client"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === "paid"
                          ? "bg-success/20 text-success"
                          : isOverdue(invoice.dueDate)
                          ? "bg-red-100 text-red-800"
                          : "bg-error/20 text-error"
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
                    <p className="text-3xl font-bold text-text-default">
                      ${invoice.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-light">
                      {invoice.items.length} item(s)
                    </p>
                  </div>

                  {/* Invoice Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Created:</span>
                      <span className="text-text-default">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Due:</span>
                      <span
                        className={
                          isOverdue(invoice.dueDate) &&
                          invoice.status === "unpaid"
                            ? "text-error font-semibold"
                            : "text-text-default"
                        }
                      >
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {invoice.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Paid:</span>
                        <span className="text-green">
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
