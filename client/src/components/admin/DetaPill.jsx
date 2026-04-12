import React from "react";

const DetailPill = ({ label, value, accent }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--color-surface-muted)]/40 border border-[var(--color-border-default)] text-[9px] uppercase tracking-widest">
    <span className="text-[var(--color-content-muted)]">{label}:</span>
    <span
      className={`font-bold ${accent || "text-[var(--color-content-primary)]"}`}
    >
      {value}
    </span>
  </span>
);

export default DetailPill;
