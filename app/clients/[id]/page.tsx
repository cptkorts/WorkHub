"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import ClientDetailHeader from "@/components/ClientDetailHeader";
import ClientDetailView from "@/components/ClientDetailView";
import ClientEditForm from "@/components/ClientEditForm";
import { useClientDetail } from "@/hooks/useClientDetail";
import { MoveLeft } from "lucide-react";

export default function ClientDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const {
    client,
    loading,
    isEditing,
    saving,
    deleting,
    error,
    formData,
    setFormData,
    setIsEditing,
    handleUpdate,
    handleDelete,
    handleCancel,
  } = useClientDetail(clientId, session);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  if (error && !client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 text-lg">{error}</p>
            <Link
              href="/clients"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← Back to Clients
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="min-h-screen bg-background xl:flex xl:justify-center">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-60 py-6 px-8 max-w-5xl mb-20 xl:mb-0">
        {/* Back Button */}
        <Link
          href="/clients"
          className="flex gap-1 items-center text-default hover:text-default/90 mb-6"
        >
          <MoveLeft size={16} /> Back to Clients
        </Link>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Client Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ClientDetailHeader
            clientName={client.fullName}
            isEditing={isEditing}
            saving={saving}
            deleting={deleting}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
            onCancel={handleCancel}
            onSave={handleUpdate}
          />

          {/* Client Details */}
          <div className="p-6">
            {!isEditing ? (
              <ClientDetailView client={client} />
            ) : (
              <ClientEditForm formData={formData} onFormChange={setFormData} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
