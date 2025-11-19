import { Appointment } from "@/hooks/useAppointments";

interface AppointmentsStatsProps {
  appointments: Appointment[];
}

export default function AppointmentsStats({
  appointments,
}: AppointmentsStatsProps) {
  return (
    <div className="lg:col-span-1 order-3 mb-20 xl:mb-0">
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-default">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-accent">Total</span>
            <span className="font-semibold text-text-default/80">
              {appointments.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-accent">Upcoming</span>
            <span className="font-semibold text-blue-600">
              {appointments.filter((a) => a.status === "upcoming").length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-accent">Completed</span>
            <span className="font-semibold text-green-600">
              {appointments.filter((a) => a.status === "completed").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
