"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  User,
  Building2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "personal" | "business" | "security"
  >("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    profilePhoto: "",
  });

  // Business Info State
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    logo: "",
    address: "",
    website: "",
  });

  // Security State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user data:", data); // Debug log
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (err) {
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
    } catch (err) {
      setError("An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // TODO: Implement password change
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // TODO: Implement account deletion
    }
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 ml-60 py-6 px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-default">
            Profile Settings
          </h1>
          <p className="text-text-muted mt-1">
            Manage your account and business information
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview Card */}
          <div className="lg:col-span-1">
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
                  <p className="text-light text-center">
                    {businessInfo.businessName}
                  </p>
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
                onClick={() => setIsEditing(!isEditing)}
                className="w-full mt-6 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors cursor-pointer font-medium"
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Right Column - Editable Information */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab("personal")}
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
                  onClick={() => setActiveTab("business")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === "business"
                      ? "text-accent border-b-2 border-accent"
                      : "text-text-muted hover:text-default"
                  }`}
                >
                  <Building2 size={18} />
                  Business Info
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === "security"
                      ? "text-accent border-b-2 border-accent"
                      : "text-text-muted hover:text-default"
                  }`}
                >
                  <Lock size={18} />
                  Security
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
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
                        setPersonalInfo({
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
                      {session.user.provider === "google" && (
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
                        setPersonalInfo({
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
                        onClick={handleSavePersonalInfo}
                        disabled={loading}
                        className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/80 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="px-6 py-2 border border-border text-default rounded-lg hover:bg-muted transition-colors cursor-pointer font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Business Info Tab */}
              {activeTab === "business" && (
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
                        setBusinessInfo({
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
                        setBusinessInfo({
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
                        setBusinessInfo({
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
                        onClick={handleSaveBusinessInfo}
                        disabled={loading}
                        className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/80 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="px-6 py-2 border border-border text-default rounded-lg hover:bg-muted transition-colors cursor-pointer font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-dark-2 mb-4">
                    Security Settings
                  </h3>

                  {session.user.provider === "credentials" ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                          Change your password to keep your account secure
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-default mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-default mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-default mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="••••••••"
                        />
                      </div>

                      <button
                        onClick={handleChangePassword}
                        className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors cursor-pointer font-medium"
                      >
                        Change Password
                      </button>
                    </>
                  ) : (
                    <div className="bg-gray-50 border border-border rounded-lg p-6 text-center">
                      <Lock
                        size={48}
                        className="mx-auto text-text-muted mb-4"
                      />
                      <p className="text-default mb-2">OAuth Account</p>
                      <p className="text-sm text-text-muted">
                        You&apos;re signed in with {session.user.provider}.
                        Password management is handled by your OAuth provider.
                      </p>
                    </div>
                  )}

                  {/* Danger Zone */}
                  <div className="border-t border-border pt-6 mt-8">
                    <h4 className="text-lg font-semibold text-error mb-4">
                      Danger Zone
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-6 py-2 bg-error text-white rounded-lg hover:bg-error/80 transition-colors cursor-pointer font-medium"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
