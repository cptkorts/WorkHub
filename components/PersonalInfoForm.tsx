import React from "react";
import { PersonalInfo } from "@/hooks/useDashboard";

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  isEditing: boolean;
  loading: boolean;
  provider: string;
  onPersonalInfoChange: (info: PersonalInfo) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function PersonalInfoForm({
  personalInfo,
  isEditing,
  loading,
  provider,
  onPersonalInfoChange,
  onSave,
  onCancel,
}: PersonalInfoFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-text-default mb-4">
        Personal Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-default mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={personalInfo.fullName}
          onChange={(e) =>
            onPersonalInfoChange({
              ...personalInfo,
              fullName: e.target.value,
            })
          }
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-muted disabled:bg-muted disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-default mb-2">
          Email
          {provider === "google" && (
            <span className="ml-2 text-xs text-text-muted">
              (Read-only - OAuth)
            </span>
          )}
        </label>
        <input
          type="email"
          value={personalInfo.email}
          disabled
          className="w-full px-4 py-2 border text-text-default border-border rounded-lg bg-muted cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-default mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={personalInfo.phone}
          onChange={(e) =>
            onPersonalInfoChange({
              ...personalInfo,
              phone: e.target.value,
            })
          }
          disabled={!isEditing}
          className="w-full px-4 py-2 text-text-default border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-muted disabled:bg-muted disabled:cursor-not-allowed"
          placeholder="+1 (555) 123-4567"
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
