import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  valueColor: string;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor,
  borderColor,
  valueColor,
}: MetricCardProps) {
  return (
    <div
      className={`group bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200 p-4 lg:p-6 border-l-4 ${borderColor}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <div className={`text-4xl ${iconColor}`}>
          <Icon
            size={35}
            className="group-hover:scale-110 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
}
