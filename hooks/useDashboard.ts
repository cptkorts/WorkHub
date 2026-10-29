import { useState, useEffect } from "react";
import { Session } from "next-auth";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  profilePhoto: string;
}

interface BusinessInfo {
  businessName: string;
  logo: string;
  address: string;
  website: string;
}

export const useDashboard = (session: Session | null) => {
  const [activeTab, setActiveTab] = useState<
    "personal" | "business" | "security"
  >("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    profilePhoto: "",
  });

  // Business Info State
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    logo: "",
    address: "",
    website: "",
  });

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setPersonalInfo({
          fullName: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          profilePhoto: data.user.logo || "",
        });
        setBusinessInfo({
          businessName: data.user.businessName || "",
          logo: data.user.logo || "",
          address: data.user.address || "",
          website: data.user.website || "",
        });
      } else {
        console.error("Failed to fetch profile:", response.status);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    if (session) {
      fetchUserProfile();
    }
  }, [session]);

  const handleSavePersonalInfo = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: personalInfo.fullName,
          phone: personalInfo.phone,
        }),
      });

      if (response.ok) {
        setSuccess("Personal information updated successfully!");
        setIsEditing(false);
        // Refresh session to update displayed name
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update profile");
      }
    } catch {
      setError("An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusinessInfo = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: personalInfo.fullName,
          businessName: businessInfo.businessName,
          address: businessInfo.address,
          website: businessInfo.website,
        }),
      });

      if (response.ok) {
        setSuccess("Business information updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update profile");
      }
    } catch {
      setError("An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    loading,
    error,
    success,
    personalInfo,
    setPersonalInfo,
    businessInfo,
    setBusinessInfo,
    handleSavePersonalInfo,
    handleSaveBusinessInfo,
  };
};

export type { PersonalInfo, BusinessInfo };
