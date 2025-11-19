import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Appointment } from "@/hooks/useAppointments";

interface AppointmentCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  getAppointmentsForDate: (date: Date) => Appointment[];
}

export default function AppointmentCalendar({
  selectedDate,
  onDateChange,
  getAppointmentsForDate,
}: AppointmentCalendarProps) {
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

  return (
    <div className="lg:col-span-1 order-1">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Calendar
          onChange={(value) => onDateChange(value as Date)}
          value={selectedDate}
          tileContent={tileContent}
          className="border-0 w-full"
        />
      </div>
    </div>
  );
}
