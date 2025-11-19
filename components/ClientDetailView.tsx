interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientDetailViewProps {
  client: Client;
}

export default function ClientDetailView({ client }: ClientDetailViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-light">Full Name</label>
        <p className="mt-1 text-lg text-dark-2">{client.fullName}</p>
      </div>

      {client.businessName && (
        <div>
          <label className="text-sm font-medium text-light">
            Business Name
          </label>
          <p className="mt-1 text-lg text-dark-2">{client.businessName}</p>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-light">Email</label>
        <p className="mt-1 text-lg text-dark-2">
          <a
            href={`mailto:${client.email}`}
            className="text-hover hover:text-default/80 transition-colors duration-200"
          >
            {client.email}
          </a>
        </p>
      </div>

      {client.phone && (
        <div>
          <label className="text-sm font-medium text-light">Phone</label>
          <p className="mt-1 text-lg text-dark-2">
            <a
              href={`tel:${client.phone}`}
              className="text-hover hover:text-default/80 transition-colors duration-200"
            >
              {client.phone}
            </a>
          </p>
        </div>
      )}

      {client.address && (
        <div>
          <label className="text-sm font-medium text-light">Address</label>
          <p className="mt-1 text-lg text-dark-2">{client.address}</p>
        </div>
      )}

      {client.notes && (
        <div>
          <label className="text-sm font-medium text-light">Notes</label>
          <p className="mt-1 text-dark-2 whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}

      <div className="border-t pt-6 mt-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-light">Created</label>
            <p className="mt-1 text-text-default">
              {new Date(client.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-light">Last Updated</label>
            <p className="mt-1 text-text-default">
              {new Date(client.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
