"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavBarBottom from "@/components/NavBarBottom";
import TopBar from "@/components/TopBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import InvoiceDetailsForm from "@/components/InvoiceDetailsForm";
import InvoiceLineItems from "@/components/InvoiceLineItems";
import InvoiceTotals from "@/components/InvoiceTotals";
import InvoiceNotesField from "@/components/InvoiceNotesField";
import { useInvoiceCreate } from "@/hooks/useInvoiceCreate";
import { MoveLeft } from "lucide-react";

export default function CreateInvoicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    clients,
    loading,
    error,
    formData,
    setFormData,
    items,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
    handleSubmit,
  } = useInvoiceCreate(session);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background xl:flex xl:justify-center">
      <Navbar />
      <NavBarBottom />
      <TopBar />

      {/* Main Content */}
      <main className="xl:flex-1 xl:ml-64 py-6 px-8 max-w-5xl mb-20 xl:mb-0">
        {/* Back Button */}
        <Link
          href="/invoices"
          className="flex gap-1 items-center text-default hover:text-default/90 mb-6"
        >
          <MoveLeft size={16} /> Back to Invoices
        </Link>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-4 xl:p-8">
            <h1 className="text-3xl font-bold text-text-default mb-6">
              Create Invoice
            </h1>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Invoice Details */}
              <InvoiceDetailsForm
                formData={formData}
                clients={clients}
                onFormChange={(field, value) =>
                  setFormData({ ...formData, [field]: value })
                }
              />

              {/* Line Items */}
              <InvoiceLineItems
                items={items}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onItemChange={handleItemChange}
              />

              {/* Totals */}
              <InvoiceTotals
                subtotal={calculateSubtotal()}
                tax={calculateTax()}
                taxRate={formData.tax}
                total={calculateTotal()}
              />

              {/* Notes */}
              <InvoiceNotesField
                notes={formData.notes}
                onNotesChange={(notes) => setFormData({ ...formData, notes })}
              />

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/invoices")}
                  className="px-6 py-3 bg-background border border-border rounded-md text-success hover:text-light hover:bg-muted transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 font-semibold bg-success text-white rounded-md hover:bg-default/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Creating..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
