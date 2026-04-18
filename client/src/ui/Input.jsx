import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const Input = React.forwardRef(
  ({ label, type, error, icon: Icon, className = "", ...props }, ref) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const inputType =
      type === "password" ? (isPasswordVisible ? "text" : "password") : type;

    return (
      <div className="w-full space-y-1 animate-in fade-in duration-300">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-[11px] uppercase tracking-[0.08em] text-[var(--color-content-muted)] ml-1"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)] group-focus-within:text-[var(--color-primary-600)] transition-colors pointer-events-none">
              <Icon size={16} strokeWidth={2.2} />
            </div>
          )}

          <input
            type={inputType}
            ref={ref}
            {...props}
            className={`
              w-full h-9 px-4
              ${Icon ? "pl-11" : "pl-4"}
              ${type === "password" ? "pr-10" : ""}
              shadow-inner
              bg-[var(--color-surface-card)]
              border border-[var(--color-border-default)]
              rounded-[var(--radius-md)]
              text-sm font-normal text-[var(--color-content-primary)]
              placeholder:text-[var(--color-content-muted)]/50
              transition-all duration-200
              hover:border-[var(--color-border-strong)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-subtle)] focus:border-[var(--color-primary-600)]
              disabled:opacity-50 disabled:cursor-not-allowed
              read-only:opacity-60 read-only:cursor-default read-only:hover:border-[var(--color-border-default)]
              ${error ? "border-[var(--color-error-solid)] focus:ring-[var(--color-error-subtle)]" : ""}
              ${className}
            `}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setPasswordVisible((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)] transition-colors cursor-pointer select-none"
              tabIndex={-1}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-[10px] font-bold text-[var(--color-error-solid)] uppercase tracking-wide px-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
