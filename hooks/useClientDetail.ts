import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export function useClientDetail(clientId: string, session: unknown) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setClient(data);
        setFormData({
          fullName: data.fullName,
          businessName: data.businessName || "",
          email: data.email,
          phone: data.phone || "",
          address: data.address || "",
          notes: data.notes || "",
        });
      } else if (response.status === 404) {
        setError("Client not found");
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      setError("Failed to load client");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && clientId) {
      fetchClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, clientId]);

  const handleUpdate = async () => {
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        setClient(updatedClient);
        setIsEditing(false);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update client");
      }
    } catch {
      setError("An error occurred while updating");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${client?.fullName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/clients");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete client");
      }
    } catch {
      setError("An error occurred while deleting");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (client) {
      setFormData({
        fullName: client.fullName,
        businessName: client.businessName || "",
        email: client.email,
        phone: client.phone || "",
        address: client.address || "",
        notes: client.notes || "",
      });
    }
  };

  return {
    client,
    loading,
    isEditing,
    saving,
    deleting,
    error,
    formData,
    setFormData,
    setIsEditing,
    handleUpdate,
    handleDelete,
    handleCancel,
  };
}
