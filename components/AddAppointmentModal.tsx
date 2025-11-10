"use client";

import { X } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";

interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
}

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentAdded: () => void;
  selectedDate?: Date;
}

export default function AddAppointmentModal({
  isOpen,
  onClose,
  onAppointmentAdded,
  selectedDate,
}: AddAppointmentModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: "",
    date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    time: "",
    service: "",
    price: "",
    status: "upcoming" as "upcoming" | "completed" | "canceled",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      if (selectedDate) {
        setFormData((prev) => ({
          ...prev,
          date: selectedDate.toISOString().split("T")[0],
        }));
      }
    }
  }, [isOpen, selectedDate]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create appointment");
      }

      // Reset form
      setFormData({
        clientId: "",
        date: "",
        time: "",
        service: "",
        price: "",
        status: "upcoming",
        notes: "",
      });

      onAppointmentAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-default">
              Add New Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-default text-2xl"
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
              <label className="block text-medium font-medium text-default mb-1">
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
              {clients.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No clients found. Please add a client first.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-medium font-medium text-default mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                />
              </div>

              <div>
                <label className="block text-medium font-medium text-default mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                />
              </div>
            </div>

            <div>
              <label className="block text-medium font-medium text-default mb-1">
                Service
              </label>
              <input
                type="text"
                required
                value={formData.service}
                onChange={(e) =>
                  setFormData({ ...formData, service: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                placeholder="e.g., Haircut, Photoshoot, Consultation"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-medium font-medium text-default mb-1">
                  Price
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-medium font-medium text-default mb-1">
                  Status
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "upcoming"
                        | "completed"
                        | "canceled",
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                >
                  <option value="upcoming" className="text-default">
                    Upcoming
                  </option>
                  <option value="completed" className="text-default">
                    Completed
                  </option>
                  <option value="canceled" className="text-default">
                    Canceled
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-medium font-medium text-default mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                placeholder="Additional notes about the appointment..."
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
                disabled={loading || clients.length === 0}
                className="flex-1 px-4 py-2 bg-success text-white rounded-md hover:bg-default transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Creating..." : "Create Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
