import React from "react";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef(
  ({ label, error, icon: Icon, children, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 animate-in fade-in duration-300">
        {/* Label: Consistent with Input component */}
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-[11px] uppercase tracking-[0.08em] text-[var(--color-content-muted)] ml-1"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Leading Icon */}
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)] group-focus-within:text-[var(--color-primary-600)] transition-colors pointer-events-none z-10">
              <Icon size={16} strokeWidth={2.2} />
            </div>
          )}

          <select
            ref={ref}
            {...props}
            className={`
            w-full h-10 px-4 
            ${Icon ? "pl-11" : "pl-4"}
            pr-10
            bg-[var(--color-surface-card)] 
            border border-[var(--color-border-default)] 
            rounded-[var(--radius-md)] 
            text-sm font-normal text-[var(--color-content-primary)] 
            appearance-none
            transition-all duration-200
            placeholder:text-[var(--color-content-muted)]
            hover:border-[var(--color-border-strong)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-subtle)] focus:border-[var(--color-primary-600)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-[var(--color-error-solid)] focus:ring-[var(--color-error-subtle)]" : ""}
            ${className}
          `}
          >
            {children}
          </select>

          {/* Custom Chevron: Replaces the default browser arrow */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)] pointer-events-none">
            <ChevronDown size={16} strokeWidth={2.5} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-[10px] font-bold text-[var(--color-error-solid)] uppercase tracking-wide px-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
