import React from "react";
const getStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "border-emerald-500/20 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400";
    case "In Progress":
      return "border-blue-500/20 text-blue-600 bg-blue-500/10 dark:text-blue-400";
    case "Pending":
    default:
      return "border-amber-500/20 text-amber-600 bg-amber-500/10 dark:text-amber-400";
  }
};
const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest shrink-0 ${getStatusStyle(status)}`}
    >
      {status === "in-progress" ? (
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          Done
        </span>
      ) : (
        status
      )}
    </span>
  );
};

export default StatusBadge;
