import { useState, useEffect } from "react";

export interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export function useClients(session: unknown) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (session) {
      fetchClients();
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
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    const search = searchTerm.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(search) ||
      client.email.toLowerCase().includes(search) ||
      client.businessName?.toLowerCase().includes(search)
    );
  });

  return {
    clients,
    filteredClients,
    loading,
    searchTerm,
    setSearchTerm,
    fetchClients,
  };
}
