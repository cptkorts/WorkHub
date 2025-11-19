"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProfileOverviewCard from "@/components/ProfileOverviewCard";
import ProfileTabNavigation from "@/components/ProfileTabNavigation";
import PersonalInfoForm from "@/components/PersonalInfoForm";
import BusinessInfoForm from "@/components/BusinessInfoForm";
import { useDashboard } from "@/hooks/useDashboard";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
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
  } = useDashboard(session);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="xl:min-h-screen bg-background xl:flex">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-64 py-6 px-8 mb-20 xl:mb-0">
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
            <ProfileOverviewCard
              personalInfo={personalInfo}
              businessInfo={businessInfo}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
            />
          </div>

          {/* Right Column - Editable Information */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <ProfileTabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <PersonalInfoForm
                  personalInfo={personalInfo}
                  isEditing={isEditing}
                  loading={loading}
                  provider={session.user.provider || ""}
                  onPersonalInfoChange={setPersonalInfo}
                  onSave={handleSavePersonalInfo}
                  onCancel={() => setIsEditing(false)}
                />
              )}

              {/* Business Info Tab */}
              {activeTab === "business" && (
                <BusinessInfoForm
                  businessInfo={businessInfo}
                  isEditing={isEditing}
                  loading={loading}
                  onBusinessInfoChange={setBusinessInfo}
                  onSave={handleSaveBusinessInfo}
                  onCancel={() => setIsEditing(false)}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
