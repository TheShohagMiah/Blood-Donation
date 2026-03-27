import React from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteUserModal = ({ isOpen, onClose, userName, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[var(--color-surface-card)] rounded-[var(--radius-2xl)] border border-[var(--color-border-strong)] shadow-[var(--shadow-2xl)] overflow-hidden animate-scale-in">
        <div className="p-8">
          <div className="flex items-start gap-5">
            <div className="p-3 rounded-[var(--radius-xl)] bg-[var(--color-error-subtle)] text-[var(--color-error-solid)]">
              <AlertTriangle size={28} />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-[var(--color-content-primary)] font-display tracking-tight">
                Delete Member?
              </h3>
              <p className="text-[var(--color-content-secondary)] mt-2 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-bold text-[var(--color-content-primary)]">
                  "{userName}"
                </span>
                ? This action is irreversible and all associated data will be
                purged.
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn btn-secondary py-3 text-sm font-bold uppercase tracking-widest"
            >
              Keep Account
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-[var(--color-error-solid)] text-white hover:bg-[var(--color-error-solid)]/90 transition-all py-3 rounded-[var(--radius-lg)] text-sm font-bold uppercase tracking-widest shadow-[var(--shadow-md)] active:scale-[0.98]"
            >
              Yes, Delete
            </button>
          </div>
        </div>

        {/* Decorative footer stripe */}
        <div className="h-1.5 w-full bg-[var(--color-error-solid)] opacity-20" />
      </div>
    </div>
  );
};

export default DeleteUserModal;
