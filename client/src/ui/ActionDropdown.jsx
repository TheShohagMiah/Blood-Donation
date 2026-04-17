import React, { useState, useEffect } from "react";
import { MoreHorizontal, ExternalLink, Edit3, Trash2 } from "lucide-react";

const ActionDropdown = ({ onView, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const close = () => setIsOpen(false);
    if (isOpen) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(() => !isOpen);
        }}
        className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-content-muted)] transition-colors"
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-52 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200"
        >
          <button
            onClick={() => {
              onView();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[var(--color-surface-muted)] flex items-center gap-3"
          >
            <ExternalLink size={16} /> View Details
          </button>
          {/* ✅ Fix 6: Edit now calls onEdit instead of doing nothing */}
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[var(--color-surface-muted)] flex items-center gap-3"
          >
            <Edit3 size={16} /> Edit Request
          </button>
          <div className="my-1 border-t border-[var(--color-border-default)]" />
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 flex items-center gap-3"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
export default ActionDropdown;
