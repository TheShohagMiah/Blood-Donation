import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
const ActionsMenu = ({ donation, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Row actions"
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)]"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-md shadow-lg py-1 animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[11px] font-black uppercase tracking-widest text-[var(--color-content-muted)] hover:bg-[var(--color-surface-muted)]/40 hover:text-[var(--color-primary-600)] transition-colors"
          >
            <RefreshCw size={12} /> Update Status
          </button>
          <div className="mx-3 my-1 border-t border-[var(--color-border-default)]" />
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[11px] font-black uppercase tracking-widest text-[var(--color-content-muted)] hover:bg-red-500/5 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;
