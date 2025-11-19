import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Client } from "@/hooks/useClients";

interface ClientsTableProps {
  clients: Client[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  return (
    <div className="hidden xl:block bg-white rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200 overflow-hidden">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
              Business
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
              Added
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-border">
          {clients.map((client) => (
            <tr key={client._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-dark-2">
                  {client.fullName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-dark-2">
                  {client.businessName || "-"}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-dark-2">{client.email}</div>
                {client.phone && (
                  <div className="text-sm text-text-muted">{client.phone}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/clients/${client._id}`}
                  className="text-hover hover:text-hover/90 flex items-center justify-end gap-2"
                >
                  View Details <MoveRight size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
