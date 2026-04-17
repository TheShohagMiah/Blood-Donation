import React from "react";
import { MapPin, Calendar } from "lucide-react";
import { formatDate } from "../../../lib/formateDate";
import ActionDropdown from "../../ui/ActionDropdown";
const getStatusStyles = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};
const RequestMobileCard = ({ item, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-bold text-[var(--color-content-primary)]">
            {item.recipientName}
          </h3>
          <p className="text-[10px] font-black text-[var(--color-content-muted)] uppercase tracking-widest">
            By: {item.requester?.name || "System"}
          </p>
        </div>
        <span className="text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
          {item.bloodGroup}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--color-border-default)]">
        <div className="space-y-1">
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
            <MapPin size={10} /> Hospital
          </span>
          <span className="text-xs font-bold text-[var(--color-content-primary)] block truncate">
            {item.hospitalName}
          </span>
        </div>
        <div className="space-y-1">
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
            <Calendar size={10} /> Schedule
          </span>
          <span className="text-xs font-bold text-[var(--color-content-primary)]">
            {formatDate(item.donationDate)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(item.status)}`}
        >
          {item.status}
        </span>
        <ActionDropdown onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default RequestMobileCard;
