import React from "react";
import { User, Building2 } from "lucide-react";

interface ProfileTabNavigationProps {
  activeTab: "personal" | "business" | "security";
  onTabChange: (tab: "personal" | "business" | "security") => void;
}

export default function ProfileTabNavigation({
  activeTab,
  onTabChange,
}: ProfileTabNavigationProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      <div className="flex border-b border-border">
        <button
          onClick={() => onTabChange("personal")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
            activeTab === "personal"
              ? "text-accent border-b-2 border-accent"
              : "text-text-muted hover:text-default"
          }`}
        >
          <User size={18} />
          Personal Info
        </button>
        <button
          onClick={() => onTabChange("business")}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
            activeTab === "business"
              ? "text-accent border-b-2 border-accent"
              : "text-text-muted hover:text-default"
          }`}
        >
          <Building2 size={18} />
          Business Info
        </button>
      </div>
    </div>
  );
}
