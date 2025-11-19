import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MonthlyData {
  month: string;
  revenue: number;
  clients: number;
  appointments: number;
}

interface TrendsBarChartProps {
  data: MonthlyData[];
}

export default function TrendsBarChart({ data }: TrendsBarChartProps) {
  return (
    <div className="xl:hidden">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis yAxisId="left" tick={{ fontSize: 10 }} width={40} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10 }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "11px",
            }}
            formatter={(value: number, name: string) => {
              if (name === "Revenue") {
                return [`$${value.toFixed(2)}`, name];
              }
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }}
            iconSize={10}
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="#a8c686"
            name="Revenue"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="clients"
            fill="#cdaa5f"
            name="Clients"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="appointments"
            fill="#3b82f6"
            name="Appointments"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
