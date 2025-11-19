import { Settings } from "lucide-react";

interface ClientDetailHeaderProps {
  clientName: string;
  isEditing: boolean;
  saving: boolean;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ClientDetailHeader({
  clientName,
  isEditing,
  saving,
  deleting,
  onEdit,
  onDelete,
  onCancel,
  onSave,
}: ClientDetailHeaderProps) {
  return (
    <div className="bg-gray-50 px-6 py-4 border-b border-border flex justify-between items-center">
      <h1 className="text-xl xl:text-2xl font-bold text-hover">{clientName}</h1>
      <div className="flex gap-2">
        {!isEditing ? (
          <>
            <button
              onClick={onEdit}
              className="flex gap-1 items-center group px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors duration-200 cursor-pointer"
            >
              <Settings
                size={20}
                className="group-hover:rotate-45 transition-all duration-200 ease-out"
              />
              Edit
            </button>
            <button
              onClick={onDelete}
              disabled={deleting}
              className="px-4 py-2 bg-error text-white rounded-md hover:bg-error/80 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-border rounded-md text-default hover:bg-muted transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 bg-success text-white rounded-md hover:bg-success/80 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
