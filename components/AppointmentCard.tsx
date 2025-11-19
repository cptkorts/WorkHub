import { Appointment } from "@/hooks/useAppointments";

interface AppointmentCardProps {
  appointment: Appointment;
  clientName: string;
  onClick: () => void;
}

export default function AppointmentCard({
  appointment,
  clientName,
  onClick,
}: AppointmentCardProps) {
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
    <div
      onClick={onClick}
      className={`border-2 border-border p-4 rounded-lg cursor-pointer shadow-xs hover:shadow-sm transition-shadow duration-200 ${getStatusColor(
        appointment.status
      )}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold">
            {appointment.time} - {appointment.service}
          </h3>
          <p className="text-gray-600">Client: {clientName}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">${appointment.price.toFixed(2)}</p>
          <span className="text-sm capitalize">{appointment.status}</span>
        </div>
      </div>
      {appointment.notes && (
        <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
      )}
    </div>
  );
}
