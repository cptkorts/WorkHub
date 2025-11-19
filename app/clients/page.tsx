"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddClientModal from "@/components/AddClientModal";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import ClientStats from "@/components/ClientStats";
import ClientCard from "@/components/ClientCard";
import ClientsTable from "@/components/ClientsTable";
import ClientsEmptyState from "@/components/ClientsEmptyState";
import { useClients } from "@/hooks/useClients";
import { Plus } from "lucide-react";

export default function ClientsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    clients,
    filteredClients,
    loading,
    searchTerm,
    setSearchTerm,
    fetchClients,
  } = useClients(session);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background xl:flex">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-64 py-6 px-8">
        <div>
          {/* Page Header */}
          <div className="flex flex-col xl:flex-row gap-3 xl:gap-0 xl:justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-2 text-center xl:text-left">
                Clients
              </h1>
              <p className="text-text-muted mt-1">
                Manage your client database
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-success group text-white px-6 py-3 rounded-lg hover:bg-success/70 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span className="text-xl group-hover:scale-120 transition-transform duration-200">
                <Plus size={20} />
              </span>
              Add Client
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search clients by name, email, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-muted"
            />
          </div>

          {/* Stats */}
          <ClientStats clients={clients} />

          {/* Clients List */}
          {filteredClients.length === 0 ? (
            <ClientsEmptyState
              hasSearchTerm={!!searchTerm}
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
              onAddClient={() => setIsModalOpen(true)}
            />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="xl:hidden space-y-4 mb-20 xl:mb-0">
                {filteredClients.map((client) => (
                  <ClientCard key={client._id} client={client} />
                ))}
              </div>

              {/* Desktop Table View */}
              <ClientsTable clients={filteredClients} />
            </>
          )}
        </div>
      </main>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientAdded={fetchClients}
      />
    </div>
  );
}
