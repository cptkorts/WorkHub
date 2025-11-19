interface FormData {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface ClientEditFormProps {
  formData: FormData;
  onFormChange: (data: FormData) => void;
}

export default function ClientEditForm({
  formData,
  onFormChange,
}: ClientEditFormProps) {
  return (
    <form className="space-y-4 mb-5 xl:mb-0">
      <div>
        <label className="block font-medium text-default mb-1">Full Name</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) =>
            onFormChange({ ...formData, fullName: e.target.value })
          }
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        />
      </div>

      <div>
        <label className="block font-medium text-default mb-1">
          Business Name
        </label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) =>
            onFormChange({ ...formData, businessName: e.target.value })
          }
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        />
      </div>

      <div>
        <label className="block font-medium text-default mb-1">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        />
      </div>

      <div>
        <label className="block font-medium text-default mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        />
      </div>

      <div>
        <label className="block font-medium text-default mb-1">Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) =>
            onFormChange({ ...formData, address: e.target.value })
          }
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        />
      </div>

      <div>
        <label className="block font-medium text-default mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => onFormChange({ ...formData, notes: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-muted"
        />
      </div>
    </form>
  );
}
