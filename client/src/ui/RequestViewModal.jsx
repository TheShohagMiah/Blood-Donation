import React from "react";
import {
  X,
  MapPin,
  Hospital,
  Calendar,
  Clock,
  Phone,
  User,
} from "lucide-react";

const RequestViewModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-[var(--color-surface-overlay)] backdrop-blur-sm animate-fade-in">
      {/* Modal Container using .card and .animate-scale-in */}
      <div className="card w-full max-w-lg overflow-hidden animate-scale-in !p-0 border-none shadow-xl">
        {/* Modal Header - Using Semantic Surface & Border Tokens */}
        <div className="px-8 py-6 border-b border-[var(--color-border-default)] flex justify-between items-center bg-[var(--color-surface-secondary)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-content-primary)] font-display">
              Request Details
            </h2>
            <p className="text-[10px] text-[var(--color-content-muted)] font-bold uppercase tracking-widest mt-1">
              Ref ID: {data.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost !p-2 rounded-full hover:bg-[var(--color-surface-primary)]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8 bg-[var(--color-surface-card)]">
          {/* Blood Group & Recipient Info */}
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-[var(--color-error-subtle)] border border-[var(--color-error-border)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[var(--color-error-solid)] leading-none">
                {data.bloodGroup}
              </span>
              <span className="text-[9px] font-bold text-[var(--color-error-text)] uppercase mt-1">
                Group
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-content-primary)] leading-tight">
                {data.recipient}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-[var(--color-content-secondary)]">
                <User size={14} />
                <span className="text-sm font-medium">
                  Requested by {data.requester}
                </span>
              </div>
            </div>
          </div>

          {/* Data Grid using DetailItem helper */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <DetailItem
              icon={<Hospital size={12} />}
              label="Hospital"
              value={data.hospital}
            />
            <DetailItem
              icon={<MapPin size={12} />}
              label="Location"
              value={data.location}
            />
            <DetailItem
              icon={<Calendar size={12} />}
              label="Date"
              value={data.date}
            />
            <DetailItem
              icon={<Clock size={12} />}
              label="Time"
              value={data.time}
            />
          </div>

          {/* Contact Banner - Using Info Semantic Tokens */}
          <div className="bg-[var(--color-info-subtle)] border border-[var(--color-info-border)] rounded-[var(--radius-lg)] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[var(--color-surface-primary)] rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-info-solid)] shadow-sm">
                <Phone size={18} />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-[var(--color-content-muted)] uppercase mb-0.5">
                  Contact Number
                </span>
                <span className="text-sm font-bold text-[var(--color-info-text)] tabular-nums">
                  {data.contact}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-[var(--color-surface-secondary)] border-t border-[var(--color-border-default)]">
          <button
            onClick={onClose}
            className="btn btn-secondary w-full py-3 !rounded-[var(--radius-md)] font-bold"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal Helper for Grid Items
const DetailItem = ({ icon, label, value }) => (
  <div className="space-y-1">
    <span className="text-[10px] font-bold text-[var(--color-content-muted)] uppercase tracking-widest flex items-center gap-2">
      <span className="text-[var(--color-primary-500)]">{icon}</span> {label}
    </span>
    <p className="text-sm font-semibold text-[var(--color-content-primary)]">
      {value}
    </p>
  </div>
);

export default RequestViewModal;
