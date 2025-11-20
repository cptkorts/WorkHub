import { CalendarPlus } from "lucide-react";

interface AppointmentsEmptyStateProps {
  onAddAppointment: () => void;
}

export default function AppointmentsEmptyState({
  onAddAppointment,
}: AppointmentsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-12">
      <div className="text-6xl mb-4 text-default">
        <CalendarPlus size={80} />
      </div>
      <h3 className="text-xl font-semibold text-text-default/80 mb-2">
        No appointments
      </h3>
      <p className="text-text-muted mb-6">
        You have no appointments scheduled for this day
      </p>
      <button
        onClick={onAddAppointment}
        className="bg-accent/90 text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors duration-200 cursor-pointer"
      >
        Schedule Appointment
      </button>
    </div>
  );
}
