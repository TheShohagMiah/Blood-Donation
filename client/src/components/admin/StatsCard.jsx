import React from "react";

const StatsCard = ({
  icon,
  label,
  value,
  subtext,
  color = "text-[var(--color-content-primary)]",
  valueColor,
}) => (
  <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-5 sm:p-6 rounded-2xl group hover:border-[var(--color-primary-600)] transition-all cursor-default relative overflow-hidden">
    {/* Background icon */}
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
      {React.cloneElement(icon, { size: 48 })}
    </div>

    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-content-muted)] group-hover:bg-[var(--color-primary-50)] group-hover:text-[var(--color-primary-600)] transition-all">
        {icon}
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)] leading-tight">
        {label}
      </p>
    </div>

    <div className="space-y-0.5">
      <p
        className={`text-xl sm:text-2xl font-black uppercase tracking-tighter ${valueColor || color}`}
      >
        {value}
      </p>
      <p className="text-[9px] uppercase tracking-wide text-[var(--color-content-muted)]">
        {subtext}
      </p>
    </div>
  </div>
);

export default StatsCard;
