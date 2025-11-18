"use client";

import { X } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";

interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
}

interface Appointment {
  _id: string;
  clientId: string;
  date: string;
  time: string;
  service: string;
  price: number;
  status: "upcoming" | "completed" | "canceled";
  notes?: string;
}

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentUpdated: () => void;
  appointment: Appointment | null;
}

export default function EditAppointmentModal({
  isOpen,
  onClose,
  onAppointmentUpdated,
  appointment,
}: EditAppointmentModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: "",
    date: "",
    time: "",
    service: "",
    price: "",
    status: "upcoming" as "upcoming" | "completed" | "canceled",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && appointment) {
      fetchClients();
      const aptDate = new Date(appointment.date);
      setFormData({
        clientId: appointment.clientId,
        date: aptDate.toISOString().split("T")[0],
        time: appointment.time,
        service: appointment.service,
        price: appointment.price.toString(),
        status: appointment.status,
        notes: appointment.notes || "",
      });
    }
  }, [isOpen, appointment]);

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
      const response = await fetch(`/api/appointments/${appointment?._id}`, {
        method: "PUT",
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
        throw new Error(data.error || "Failed to update appointment");
      }

      onAppointmentUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this appointment? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/appointments/${appointment?._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete appointment");
      }

      onAppointmentUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-default">
              Edit Appointment
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
                Client *
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
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
                placeholder="Additional notes about the appointment..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-error text-white rounded-md hover:bg-error/80 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <div className="flex-1"></div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border bg-background border-border rounded-md text-success hover:text-light hover:bg-muted transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-success text-white rounded-md hover:bg-default transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
