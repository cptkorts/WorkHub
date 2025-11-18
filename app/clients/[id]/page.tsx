"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { MoveLeft, Settings } from "lucide-react";

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

export default function ClientDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  if (error && !client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 text-lg">{error}</p>
            <Link
              href="/clients"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← Back to Clients
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="min-h-screen bg-background xl:flex xl:justify-center">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-60 py-6 px-8 max-w-5xl mb-20 xl:mb-0">
        {/* Back Button */}
        <Link
          href="/clients"
          className="flex gap-1 items-center text-default hover:text-default/90 mb-6"
        >
          <MoveLeft size={16} /> Back to Clients
        </Link>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Client Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header with Actions */}
          <div className="bg-gray-50 px-6 py-4 border-b border-border flex justify-between items-center">
            <h1 className="text-xl xl:text-2xl font-bold text-hover">
              {client.fullName}
            </h1>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex gap-1 items-center group px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors duration-200 cursor-pointer"
                  >
                    <Settings
                      size={20}
                      className="group-hover:rotate-45 transition-all duration-200 ease-out"
                    />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-error text-white rounded-md hover:bg-error/80 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: client.fullName,
                        businessName: client.businessName || "",
                        email: client.email,
                        phone: client.phone || "",
                        address: client.address || "",
                        notes: client.notes || "",
                      });
                    }}
                    className="px-4 py-2 border border-border rounded-md text-default hover:bg-muted transition-colors duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Client Details */}
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-light">
                    Full Name
                  </label>
                  <p className="mt-1 text-lg text-dark-2">{client.fullName}</p>
                </div>

                {client.businessName && (
                  <div>
                    <label className="text-sm font-medium text-light">
                      Business Name
                    </label>
                    <p className="mt-1 text-lg text-dark-2">
                      {client.businessName}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-light">
                    Email
                  </label>
                  <p className="mt-1 text-lg text-dark-2">
                    <a
                      href={`mailto:${client.email}`}
                      className="text-hover hover:text-default/80 transition-colors duration-200"
                    >
                      {client.email}
                    </a>
                  </p>
                </div>

                {client.phone && (
                  <div>
                    <label className="text-sm font-medium text-light">
                      Phone
                    </label>
                    <p className="mt-1 text-lg text-dark-2">
                      <a
                        href={`tel:${client.phone}`}
                        className="text-hover hover:text-default/80 transition-colors duration-200"
                      >
                        {client.phone}
                      </a>
                    </p>
                  </div>
                )}

                {client.address && (
                  <div>
                    <label className="text-sm font-medium text-light">
                      Address
                    </label>
                    <p className="mt-1 text-lg text-dark-2">{client.address}</p>
                  </div>
                )}

                {client.notes && (
                  <div>
                    <label className="text-sm font-medium text-light">
                      Notes
                    </label>
                    <p className="mt-1 text-dark-2 whitespace-pre-wrap">
                      {client.notes}
                    </p>
                  </div>
                )}

                <div className="border-t pt-6 mt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-light">Created</label>
                      <p className="mt-1 text-text-default">
                        {new Date(client.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-light">Last Updated</label>
                      <p className="mt-1 text-text-default">
                        {new Date(client.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-4 mb-5 xl:mb-0">
                <div>
                  <label className="block font-medium text-default mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  />
                </div>

                <div>
                  <label className="block font-medium text-default mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  />
                </div>

                <div>
                  <label className="block font-medium text-default mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  />
                </div>

                <div>
                  <label className="block font-medium text-default mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  />
                </div>

                <div>
                  <label className="block font-medium text-default mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  />
                </div>

                <div>
                  <label className="block font-medium text-default mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
