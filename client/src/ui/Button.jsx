import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  children,
}) => {
  // Base styles following your design language
  const baseStyles =
    "relative inline-flex items-center justify-center rounded-[var(--radius-lg)] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none font-bold uppercase tracking-[0.08em] text-[11px]";

  const variants = {
    primary:
      "bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] shadow-sm shadow-[var(--color-primary-subtle)]",
    secondary:
      "bg-[var(--color-surface-card)] text-[var(--color-content-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]",
    ghost:
      "bg-transparent text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)] hover:bg-[var(--color-surface-muted)]",
    danger: "bg-[var(--color-error-solid)] text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className} px-6 h-11`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {/* Support for both 'label' prop or 'children' for flexibility */}
          {label || children}
        </>
      )}
    </button>
  );
};

export default Button;
