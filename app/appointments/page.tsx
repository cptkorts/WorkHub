"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddAppointmentModal from "@/components/AddAppointmentModal";
import EditAppointmentModal from "@/components/EditAppointmentModal";
import Navbar from "@/components/Navbar";
import { CalendarCheck, Plus } from "lucide-react";

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

interface Client {
  _id: string;
  fullName: string;
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchAppointments();
      fetchClients();
    }
  }, [session]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
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

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      );
    });
  };

  const getAppointmentsForWeek = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= weekStart && aptDate <= weekEnd;
    });
  };

  const getDaysOfWeek = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const handleEditAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100/80 text-blue-800 border-blue-200";
      case "completed":
        return "bg-success/30 text-default border-light";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dayAppointments = getAppointmentsForDate(date);
    if (dayAppointments.length > 0) {
      return (
        <div className="flex justify-center mt-1">
          <div className="w-2 h-2 bg-success/50 rounded-full"></div>
        </div>
      );
    }
    return null;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const displayedAppointments =
    viewMode === "daily"
      ? getAppointmentsForDate(selectedDate)
      : getAppointmentsForWeek(selectedDate);

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 ml-64 py-6 px-8">
        <div>
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-default">Appointments</h1>
              <p className="text-light mt-1">
                Manage your appointment schedule
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-success group text-white px-6 py-3 rounded-lg hover:bg-success/70 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span className="text-xl group-hover:scale-120 transition-transform duration-200">
                <Plus size={20} />
              </span>
              Add Appointment
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "daily"
                  ? "bg-success text-white"
                  : "bg-white text-default hover:bg-muted transition-colors duration-200 cursor-pointer"
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "weekly"
                  ? "bg-success text-white"
                  : "bg-white text-default hover:bg-muted transition-colors duration-200 cursor-pointer"
              }`}
            >
              Weekly View
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="border-0 w-full"
                />
              </div>

              {/* Stats */}
              <div className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-default">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-accent">Total</span>
                    <span className="font-semibold text-text-default/80">
                      {appointments.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent">Upcoming</span>
                    <span className="font-semibold text-green-600">
                      {
                        appointments.filter((a) => a.status === "upcoming")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent">Completed</span>
                    <span className="font-semibold text-blue-600">
                      {
                        appointments.filter((a) => a.status === "completed")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {viewMode === "daily" ? (
                    <>
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </>
                  ) : (
                    <>
                      Week of{" "}
                      {getDaysOfWeek(selectedDate)[0].toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </>
                  )}
                </h2>

                {viewMode === "weekly" ? (
                  <div className="space-y-4">
                    {getDaysOfWeek(selectedDate).map((day) => {
                      const dayAppointments = getAppointmentsForDate(day);
                      return (
                        <div key={day.toISOString()} className="border-b pb-4">
                          <h3 className="font-semibold text-text-default/80 mb-2">
                            {day.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                            <span className="ml-2 text-sm text-green">
                              ({dayAppointments.length})
                            </span>
                          </h3>
                          {dayAppointments.length === 0 ? (
                            <p className="text-gray-400 text-sm ml-4">
                              No appointments
                            </p>
                          ) : (
                            <div className="space-y-2 ml-4">
                              {dayAppointments
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map((apt) => (
                                  <div
                                    key={apt._id}
                                    onClick={() => handleEditAppointment(apt)}
                                    className={`border border-border p-3 rounded-lg cursor-pointer shadow-xs hover:shadow-md transition-shadow duration-200 ${getStatusColor(
                                      apt.status
                                    )}`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-semibold">
                                          {apt.time} - {apt.service}
                                        </p>
                                        <p className="text-sm">
                                          {clients[apt.clientId]?.fullName ||
                                            "Unknown Client"}
                                        </p>
                                      </div>
                                      <span className="font-semibold">
                                        ${apt.price.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : displayedAppointments.length === 0 ? (
                  <div className="flex flex-col items-center py-12">
                    <div className="text-6xl mb-4 text-default">
                      <CalendarCheck size={80} />
                    </div>
                    <h3 className="text-xl font-semibold text-text-default/80 mb-2">
                      No appointments
                    </h3>
                    <p className="text-text-muted mb-6">
                      You have no appointments scheduled for this day
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-accent/90 text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors duration-200 cursor-pointer"
                    >
                      Schedule Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((apt) => (
                        <div
                          key={apt._id}
                          onClick={() => handleEditAppointment(apt)}
                          className={`border-2 border-border p-4 rounded-lg cursor-pointer shadow-xs hover:shadow-sm transition-shadow duration-200 ${getStatusColor(
                            apt.status
                          )}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {apt.time} - {apt.service}
                              </h3>
                              <p className="text-gray-600">
                                Client:{" "}
                                {clients[apt.clientId]?.fullName ||
                                  "Unknown Client"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">
                                ${apt.price.toFixed(2)}
                              </p>
                              <span className="text-sm capitalize">
                                {apt.status}
                              </span>
                            </div>
                          </div>
                          {apt.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              {apt.notes}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAppointmentAdded={fetchAppointments}
        selectedDate={selectedDate}
      />

      {/* Edit Appointment Modal */}
      <EditAppointmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAppointment(null);
        }}
        onAppointmentUpdated={fetchAppointments}
        appointment={selectedAppointment}
      />
    </div>
  );
}
