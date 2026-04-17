import React from "react";

const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="pagination flex items-center justify-end gap-6 mt-6">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-[var(--color-surface-muted)] rounded-lg text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {totalPages === 0 ? "No users found" : `Page ${page} of ${totalPages}`}
      </span>
      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        className="px-4 py-2 bg-[var(--color-surface-muted)] rounded-lg text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
