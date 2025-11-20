import { UserPlus } from "lucide-react";

interface ClientsEmptyStateProps {
  hasSearchTerm: boolean;
  searchTerm: string;
  onClearSearch: () => void;
  onAddClient: () => void;
}

export default function ClientsEmptyState({
  hasSearchTerm,
  searchTerm,
  onClearSearch,
  onAddClient,
}: ClientsEmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      {hasSearchTerm ? (
        <>
          <p className="text-gray-500 text-lg">
            No clients found matching &quot;{searchTerm}&quot;
          </p>
          <button
            onClick={onClearSearch}
            className="mt-4 text-hover hover:text-hover"
          >
            Clear search
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center py-12">
          <div className="text-6xl mb-4 text-default">
            <UserPlus size={80} />
          </div>
          <h3 className="text-xl font-semibold text-dark-3 mb-2">
            No clients yet
          </h3>
          <p className="text-text-muted mb-6">
            Get started by adding your first client
          </p>
          <button
            onClick={onAddClient}
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors cursor-pointer"
          >
            Add Your First Client
          </button>
        </div>
      )}
    </div>
  );
}
