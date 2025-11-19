interface AppointmentStatusProps {
  upcoming: number;
  completed: number;
  canceled: number;
}

export default function AppointmentStatus({
  upcoming,
  completed,
  canceled,
}: AppointmentStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 ">
      <h3 className="text-lg font-semibold text-default mb-4">
        Appointment Status
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-text-muted">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">{upcoming}</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-money/20 rounded-lg">
          <p className="text-sm font-medium text-text-muted ">Completed</p>
          <p className="text-2xl font-bold text-hover">{completed}</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-error/15 rounded-lg">
          <p className="text-sm font-medium text-text-muted">Canceled</p>
          <p className="text-2xl font-bold text-error">{canceled}</p>
        </div>
      </div>
    </div>
  );
}
