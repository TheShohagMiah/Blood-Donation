import React, { useEffect } from "react";
import {
  X,
  MapPin,
  Hospital,
  Calendar,
  Clock,
  Phone,
  User,
  Home,
  MessageSquare,
} from "lucide-react";

const RequestViewModal = ({ data, onClose }) => {
  useEffect(() => {
    if (data) {
      document.body.style.overflow = "hidden";
    }
    return () => (document.body.style.overflow = "unset");
  }, [data]);

  if (!data) return null;

  const {
    _id,
    bloodGroup,
    recipientName,
    hospitalName,
    fullAddress,
    district,
    upazila,
    donationDate,
    donationTime,
    contactNumber,
    message,
    urgency,
  } = data;

  // Industrial Urgency Mapping
  const getUrgencyStyles = (level) => {
    const status = level?.toLowerCase();
    switch (status) {
      case "emergency":
        return "bg-red-50 border-red-100 text-red-600";
      case "urgent":
        return "bg-orange-50 border-orange-100 text-orange-600";
      case "normal":
        return "bg-emerald-50 border-emerald-100 text-emerald-600";
      default:
        return "bg-blue-50 border-blue-100 text-blue-600";
    }
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-[var(--color-surface-overlay)] backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[var(--color-surface-card)] rounded-[var(--radius-2xl)] border border-[var(--color-border-strong)] shadow-[var(--shadow-2xl)] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--color-border-default)] flex justify-between items-center bg-[var(--color-surface-secondary)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-content-primary)]">
              Emergency Details
            </h2>
            <p className="text-[10px] text-[var(--color-content-muted)] font-black uppercase tracking-widest mt-1">
              Ref ID: {_id?.slice(-8).toUpperCase() || "PENDING"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-surface-tertiary)] rounded-full transition-colors text-[var(--color-content-muted)]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Blood Group & Name */}
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] rounded-[var(--radius-xl)] flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-black text-[var(--color-primary-600)] leading-none">
                {bloodGroup}
              </span>
              <span className="text-[9px] font-bold text-[var(--color-primary-700)] uppercase mt-1">
                Group
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-[var(--color-content-primary)]">
                  {recipientName}
                </h3>
                {/* Dynamically Styled Badge */}
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getUrgencyStyles(urgency)}`}
                >
                  {urgency || "Normal"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-content-muted)]">
                <User size={14} />
                <span className="text-xs font-medium">
                  Requested via Portal
                </span>
              </div>
            </div>
          </div>

          {/* Logistics Grid */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            <DetailItem
              icon={<Hospital size={14} />}
              label="Hospital"
              value={hospitalName}
            />
            <DetailItem
              icon={<MapPin size={14} />}
              label="Area"
              value={`${upazila}, ${district}`}
            />
            <DetailItem
              icon={<Calendar size={14} />}
              label="Date"
              value={new Date(donationDate).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            />
            <DetailItem
              icon={<Clock size={14} />}
              label="Time"
              value={donationTime}
            />
          </div>

          {/* Full Address Block */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-black text-[var(--color-content-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
              <Home size={12} className="text-[var(--color-primary-500)]" />{" "}
              Exact Location
            </span>
            <p className="text-sm font-medium text-[var(--color-content-secondary)] bg-[var(--color-surface-secondary)] p-3 rounded-lg border border-[var(--color-border-default)] leading-relaxed">
              {fullAddress || "Contact requester for exact room/ward details."}
            </p>
          </div>

          {/* Message/Notes Block */}
          {message && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black text-[var(--color-content-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
                <MessageSquare
                  size={12}
                  className="text-[var(--color-primary-500)]"
                />{" "}
                Clinical Notes
              </span>
              <p className="text-sm italic text-[var(--color-content-secondary)] border-l-2 border-[var(--color-primary-200)] pl-4">
                "{message}"
              </p>
            </div>
          )}

          {/* Contact Banner */}
          <div className="bg-[var(--color-primary-600)] rounded-[var(--radius-xl)] p-5 flex items-center justify-between text-white shadow-lg shadow-primary-500/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <span className="block text-[10px] font-bold opacity-80 uppercase tracking-widest mb-0.5">
                  Direct Line
                </span>
                <span className="text-lg font-black tracking-wider tabular-nums">
                  {contactNumber}
                </span>
              </div>
            </div>
            <a
              href={`tel:${contactNumber}`}
              className="bg-white text-[var(--color-primary-600)] text-[10px] font-black uppercase px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Call Now
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-[var(--color-surface-secondary)] border-t border-[var(--color-border-default)]">
          <button
            onClick={onClose}
            className="w-full bg-[var(--color-surface-card)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-tertiary)] text-[var(--color-content-primary)] py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="space-y-2">
    <span className="text-[10px] font-black text-[var(--color-content-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
      <span className="text-[var(--color-primary-500)]">{icon}</span> {label}
    </span>
    <p
      className="text-sm font-bold text-[var(--color-content-primary)] truncate"
      title={value}
    >
      {value}
    </p>
  </div>
);

export default RequestViewModal;
