import React from "react";
import { User, Mail, Phone, MapPin, Globe } from "lucide-react";
import { PersonalInfo, BusinessInfo } from "@/hooks/useDashboard";

interface ProfileOverviewCardProps {
  personalInfo: PersonalInfo;
  businessInfo: BusinessInfo;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export default function ProfileOverviewCard({
  personalInfo,
  businessInfo,
  isEditing,
  onToggleEdit,
}: ProfileOverviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      {/* Profile Photo */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-linear-to-br from-accent to-success/80 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
            <User size={48} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-default mt-4 text-center">
          {personalInfo.fullName || "User Name"}
        </h2>

        {businessInfo.businessName && (
          <p className="text-light text-center">{businessInfo.businessName}</p>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-3 text-sm">
          <Mail size={16} className="text-text-muted" />
          <span className="text-hover">{personalInfo.email}</span>
        </div>

        {personalInfo.phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-text-muted" />
            <span className="text-default">{personalInfo.phone}</span>
          </div>
        )}

        {businessInfo.address && (
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-text-muted" />
            <span className="text-default">{businessInfo.address}</span>
          </div>
        )}

        {businessInfo.website && (
          <div className="flex items-center gap-3 text-sm">
            <Globe size={16} className="text-text-muted" />
            <a
              href={businessInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hover hover:underline"
            >
              {businessInfo.website}
            </a>
          </div>
        )}
      </div>

      {/* Edit Button */}
      <button
        onClick={onToggleEdit}
        className="w-full mt-6 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors cursor-pointer font-medium"
      >
        {isEditing ? "Cancel Edit" : "Edit Profile"}
      </button>
    </div>
  );
}
