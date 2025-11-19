import { BusinessInfo } from "@/hooks/useDashboard";

interface BusinessInfoFormProps {
  businessInfo: BusinessInfo;
  isEditing: boolean;
  loading: boolean;
  onBusinessInfoChange: (info: BusinessInfo) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function BusinessInfoForm({
  businessInfo,
  isEditing,
  loading,
  onBusinessInfoChange,
  onSave,
  onCancel,
}: BusinessInfoFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-dark-2 mb-4">
        Business Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-default mb-2">
          Business Name
        </label>
        <input
          type="text"
          value={businessInfo.businessName}
          onChange={(e) =>
            onBusinessInfoChange({
              ...businessInfo,
              businessName: e.target.value,
            })
          }
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-muted disabled:bg-muted disabled:cursor-not-allowed"
          placeholder="Your Business Name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-default mb-2">
          Business Address
        </label>
        <input
          type="text"
          value={businessInfo.address}
          onChange={(e) =>
            onBusinessInfoChange({
              ...businessInfo,
              address: e.target.value,
            })
          }
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-muted disabled:bg-muted disabled:cursor-not-allowed"
          placeholder="123 Business St, City, State 12345"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-default mb-2">
          Website
        </label>
        <input
          type="url"
          value={businessInfo.website}
          onChange={(e) =>
            onBusinessInfoChange({
              ...businessInfo,
              website: e.target.value,
            })
          }
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-muted disabled:bg-muted disabled:cursor-not-allowed"
          placeholder="https://yourbusiness.com"
        />
      </div>

      {isEditing && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={onSave}
            disabled={loading}
            className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/80 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-border text-default rounded-lg hover:bg-muted transition-colors cursor-pointer font-medium disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
