import { useState, useEffect } from "react";
import { Session } from "next-auth";

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
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

export interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
}

export const useInvoices = (session: Session | null) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [loading, setLoading] = useState(true);

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

  const getPaidInvoices = () => invoices.filter((inv) => inv.status === "paid");
  const getUnpaidInvoices = () =>
    invoices.filter((inv) => inv.status === "unpaid");

  const getTotalRevenue = () => {
    return getPaidInvoices().reduce((sum, inv) => sum + inv.total, 0);
  };

  const getOutstandingBalance = () => {
    return getUnpaidInvoices().reduce((sum, inv) => sum + inv.total, 0);
  };

  const getFilteredInvoices = (filterStatus: "all" | "paid" | "unpaid") => {
    if (filterStatus === "all") return invoices;
    return invoices.filter((inv) => inv.status === filterStatus);
  };

  const isOverdue = (dueDate: string) => {
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  return {
    invoices,
    clients,
    loading,
    fetchInvoices,
    getPaidInvoices,
    getUnpaidInvoices,
    getTotalRevenue,
    getOutstandingBalance,
    getFilteredInvoices,
    isOverdue,
  };
};
