"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddAppointmentModal from "@/components/AddAppointmentModal";
import EditAppointmentModal from "@/components/EditAppointmentModal";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import AppointmentCalendar from "@/components/AppointmentCalendar";
import AppointmentsList from "@/components/AppointmentsList";
import AppointmentsStats from "@/components/AppointmentsStats";
import { useAppointments, Appointment } from "@/hooks/useAppointments";
import { Plus } from "lucide-react";

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    appointments,
    clients,
    loading,
    fetchAppointments,
    getAppointmentsForDate,
    getAppointmentsForWeek,
    getDaysOfWeek,
  } = useAppointments(session);

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

  const handleEditAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsEditModalOpen(true);
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  const displayedAppointments =
    viewMode === "daily"
      ? getAppointmentsForDate(selectedDate)
      : getAppointmentsForWeek(selectedDate);

  return (
    <div className="min-h-screen bg-background xl:flex">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-64 py-6 px-8">
        <div>
          {/* Page Header */}
          <div className="flex flex-col xl:flex-row xl:justify-between gap-5 xl:gap-0 items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-default text-center xl:text-left">
                Appointments
              </h1>
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
          <div className="mb-6 flex gap-2 justify-center xl:justify-start">
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
            <div className="lg:col-span-1 order-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <AppointmentCalendar
                  selectedDate={selectedDate}
                  onDateChange={(value) => setSelectedDate(value as Date)}
                  getAppointmentsForDate={getAppointmentsForDate}
                />
              </div>
            </div>

            {/* Appointments List */}
            <div className="lg:col-span-2 lg:row-span-2 order-2">
              <div className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6">
                <AppointmentsList
                  viewMode={viewMode}
                  selectedDate={selectedDate}
                  displayedAppointments={displayedAppointments}
                  clients={clients}
                  getDaysOfWeek={getDaysOfWeek}
                  getAppointmentsForDate={getAppointmentsForDate}
                  onEditAppointment={handleEditAppointment}
                  onAddAppointment={() => setIsModalOpen(true)}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-1 lg:justify-items-stretch order-3 mb-20 xl:mb-0">
              <div className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-6">
                <AppointmentsStats appointments={appointments} />
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
