import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Client } from "@/hooks/useClients";

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-semibold text-hover">
            {client.fullName}
          </h3>
          {client.businessName && (
            <p className="text-sm text-text-muted">{client.businessName}</p>
          )}
        </div>
        <Link
          href={`/clients/${client._id}`}
          className="text-hover hover:text-hover/90 flex items-center gap-1 text-sm"
        >
          View <MoveRight size={14} />
        </Link>
      </div>
      <div className="space-y-1 text-sm">
        <p className="text-dark-2">{client.email}</p>
        {client.phone && <p className="text-text-muted">{client.phone}</p>}
        <p className="text-text-muted text-xs pt-2">
          Added: {new Date(client.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
