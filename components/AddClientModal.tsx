"use client";

import { X } from "lucide-react";
import { useState, FormEvent } from "react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

export default function AddClientModal({
  isOpen,
  onClose,
  onClientAdded,
}: AddClientModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create client");
      }

      // Reset form
      setFormData({
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
      });

      onClientAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 mb-20 xl:mb-0">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-default">
              Add New Client
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-dark-2 text-2xl cursor-pointer"
            >
              <X />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Theo Kortsos"
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
                placeholder="Acme Corp"
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
                placeholder="theo@example.com"
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
                placeholder="+1 (555) 123-4567"
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
                placeholder="123 Main St, City, State"
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
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                placeholder="Additional information about the client..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-success hover:text-light hover:bg-muted transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-success text-white rounded-md hover:bg-default transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Creating..." : "Create Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
