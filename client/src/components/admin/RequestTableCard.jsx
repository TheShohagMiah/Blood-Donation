import React, { useState } from "react";
import {
  Clock,
  Edit3,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import { formatDate } from "../../../lib/formateDate";

const getStatusStyles = (status) => {
  switch (status) {
    case "Completed":
    case "Done":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Canceled":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

const RequestTableRow = ({
  item,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const [open, setOpen] = useState(false);
  const isInProgress = item.status === "in-progress";

  return (
    <tr className="hover:bg-[var(--color-surface-tertiary)]/20 transition-colors">
      {/* ── Recipient ── */}
      <td className="px-4 xl:px-8 py-4 xl:py-5">
        <div className="flex flex-col gap-1 min-w-[120px]">
          <span className="text-sm font-bold text-[var(--color-content-primary)] leading-tight">
            {item.recipientName}
          </span>
          <span className="text-[10px] text-[var(--color-content-muted)] font-bold uppercase tracking-widest">
            By {item.requester?.name || "System"}
          </span>

          {isInProgress && item.donor && (
            <div className="mt-1.5 flex flex-col p-2 rounded-lg bg-blue-50/50 border border-blue-100/50">
              <span className="text-[9px] font-black uppercase text-blue-600 flex items-center gap-1">
                <User size={9} /> Active Donor
              </span>
              <span className="text-[10px] font-bold text-blue-800 leading-tight">
                {item.donor.name}
              </span>
              <span className="text-[10px] text-blue-600/80 truncate max-w-[140px]">
                {item.donor.email}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* ── Location ── */}
      <td className="px-4 xl:px-8 py-4 xl:py-5">
        <div className="flex flex-col min-w-[130px] max-w-[180px]">
          <span className="text-xs font-bold text-[var(--color-content-primary)] truncate">
            {item.hospitalName}
          </span>
          <span className="text-[10px] text-[var(--color-content-muted)] font-medium uppercase tracking-tighter">
            {item.district}, {item.upazila}
          </span>
        </div>
      </td>

      {/* ── Blood Group ── */}
      <td className="px-4 xl:px-8 py-4 xl:py-5 text-center">
        <span className="inline-flex items-center justify-center text-xs font-black text-red-600 bg-red-50 w-9 h-8 rounded-lg border border-red-100">
          {item.bloodGroup}
        </span>
      </td>

      {/* ── Schedule ── */}
      <td className="px-4 xl:px-8 py-4 xl:py-5">
        <div className="flex flex-col tabular-nums min-w-[90px]">
          <span className="text-xs font-bold text-[var(--color-content-primary)]">
            {formatDate(item.donationDate)}
          </span>
          <span className="text-[10px] text-[var(--color-content-muted)] flex items-center gap-1 font-bold">
            <Clock size={11} /> {item.donationTime}
          </span>
        </div>
      </td>

      {/* ── Status ── */}
      <td className="px-4 xl:px-8 py-4 xl:py-5">
        <div className="flex flex-col gap-2 min-w-[100px]">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border w-fit ${getStatusStyles(item.status)}`}
          >
            {isInProgress && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            )}
            {item.status || "Pending"}
          </span>

          {isInProgress && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onUpdateStatus(item._id, "Completed")}
                className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <CheckCircle size={13} /> Done
              </button>
              <button
                onClick={() => onUpdateStatus(item._id, "Canceled")}
                className="flex items-center gap-1 text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors"
              >
                <XCircle size={13} /> Cancel
              </button>
            </div>
          )}
        </div>
      </td>

      {/* ── Actions ── */}
      <td className="px-4 xl:px-8 py-4 xl:py-5 text-right">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-content-muted)] transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>

          {open && (
            <>
              {/* Backdrop to close on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-md shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    onView();
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[var(--color-surface-muted)] flex items-center gap-3"
                >
                  <ExternalLink size={15} /> View Details
                </button>
                <button
                  onClick={() => {
                    onEdit();
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[var(--color-surface-muted)] flex items-center gap-3"
                >
                  <Edit3 size={15} /> Edit Request
                </button>
                <div className="my-1 border-t border-[var(--color-border-default)]" />
                <button
                  onClick={() => {
                    onDelete();
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default RequestTableRow;
