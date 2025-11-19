import { Client } from "@/hooks/useClients";

interface ClientStatsProps {
  clients: Client[];
}

export default function ClientStats({ clients }: ClientStatsProps) {
  const thisMonthClients = clients.filter((c) => {
    const clientDate = new Date(c.createdAt);
    const now = new Date();
    return (
      clientDate.getMonth() === now.getMonth() &&
      clientDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200">
        <p className="text-text-muted text-sm">Total Clients</p>
        <p className="text-3xl font-bold text-dark-2">{clients.length}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200">
        <p className="text-text-muted text-sm">With Business</p>
        <p className="text-3xl font-bold text-dark-2">
          {clients.filter((c) => c.businessName).length}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200">
        <p className="text-text-muted text-sm">This Month</p>
        <p className="text-3xl font-bold text-dark-2">{thisMonthClients}</p>
      </div>
    </div>
  );
}
