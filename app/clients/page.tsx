"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddClientModal from "@/components/AddClientModal";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { MoveRight, Plus } from "lucide-react";

interface Client {
  _id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export default function ClientsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchClients();
    }
  }, [session]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    const search = searchTerm.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(search) ||
      client.email.toLowerCase().includes(search) ||
      client.businessName?.toLowerCase().includes(search)
    );
  });

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="flex-1 ml-64 py-6 px-8">
        <div>
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-2">Clients</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200">
              <p className="text-text-muted text-sm">Total Clients</p>
              <p className="text-3xl font-bold text-dark-2">{clients.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200">
              <p className="text-text-muted text-sm">With Business</p>
              <p className="text-3xl font-bold text-dark-2">
                {clients.filter((c) => c.businessName).length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200">
              <p className="text-text-muted text-sm">This Month</p>
              <p className="text-3xl font-bold text-dark-2">
                {
                  clients.filter((c) => {
                    const clientDate = new Date(c.createdAt);
                    const now = new Date();
                    return (
                      clientDate.getMonth() === now.getMonth() &&
                      clientDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>

          {/* Clients List */}
          {filteredClients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              {searchTerm ? (
                <>
                  <p className="text-gray-500 text-lg">
                    No clients found matching &quot;{searchTerm}&quot;
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-hover hover:text-hover"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">📇</div>
                  <h3 className="text-xl font-semibold text-dark-3 mb-2">
                    No clients yet
                  </h3>
                  <p className="text-text-muted mb-6">
                    Get started by adding your first client
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Add Your First Client
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-xs hover:shadow-sm transition-shadow duration-200 overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                      Added
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {filteredClients.map((client) => (
                    <tr
                      key={client._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-dark-2">
                          {client.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark-2">
                          {client.businessName || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-dark-2">
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="text-sm text-text-muted">
                            {client.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/clients/${client._id}`}
                          className="text-hover hover:text-hover/90 flex items-center justify-end gap-2"
                        >
                          View Details <MoveRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
