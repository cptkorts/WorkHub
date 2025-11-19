import { Appointment, Client } from "@/hooks/useAppointments";
import AppointmentCard from "./AppointmentCard";
import AppointmentsEmptyState from "./AppointmentsEmptyState";

interface AppointmentsListProps {
  viewMode: "daily" | "weekly";
  selectedDate: Date;
  displayedAppointments: Appointment[];
  clients: { [key: string]: Client };
  getDaysOfWeek: (date: Date) => Date[];
  getAppointmentsForDate: (date: Date) => Appointment[];
  onEditAppointment: (apt: Appointment) => void;
  onAddAppointment: () => void;
}

export default function AppointmentsList({
  viewMode,
  selectedDate,
  displayedAppointments,
  clients,
  getDaysOfWeek,
  getAppointmentsForDate,
  onEditAppointment,
  onAddAppointment,
}: AppointmentsListProps) {
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

  return (
    <div className="lg:col-span-2 lg:row-span-2 order-2">
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
              {getDaysOfWeek(selectedDate)[0].toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
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
                            onClick={() => onEditAppointment(apt)}
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
          <AppointmentsEmptyState onAddAppointment={onAddAppointment} />
        ) : (
          <div className="space-y-4">
            {displayedAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((apt) => (
                <AppointmentCard
                  key={apt._id}
                  appointment={apt}
                  clientName={
                    clients[apt.clientId]?.fullName || "Unknown Client"
                  }
                  onClick={() => onEditAppointment(apt)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
