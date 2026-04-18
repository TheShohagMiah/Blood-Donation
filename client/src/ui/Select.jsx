import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const Select = ({
  label,
  error,
  className = "",
  children,
  value,
  onChange,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const options = React.Children.toArray(children)
    .filter((child) => child.type === "option")
    .map((child) => ({
      value: child.props.value ?? "",
      label: child.props.children,
    }));

  const selected = options.find((o) => o.value === value);

  // Calculate position every time it opens
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 220; // max-height estimate
    const spaceBelow = viewportHeight - rect.bottom;
    const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(openUpward
        ? { bottom: viewportHeight - rect.top + 4 } // opens upward
        : { top: rect.bottom + 4 }), // opens downward
    });
  };

  const handleOpen = () => {
    updatePosition();
    setOpen((v) => !v);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reposition on scroll or resize while open
  useEffect(() => {
    if (!open) return;
    const handler = () => updatePosition();
    window.addEventListener("scroll", handler, true); // capture: true catches all scroll events
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open]);

  const handleSelect = (optionValue) => {
    onChange?.({ target: { value: optionValue } });
    setOpen(false);
  };

  return (
    <div className="w-full space-y-1 animate-in fade-in duration-300">
      {label && (
        <label className="block text-[11px] uppercase tracking-[0.08em] text-[var(--color-content-muted)] ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          className={`
            w-full h-9 pl-4 pr-9
            shadow-inner
            bg-[var(--color-surface-card)]
            border border-[var(--color-border-default)]
            rounded-[var(--radius-md)]
            text-sm text-left font-normal
            transition-all duration-200
            hover:border-[var(--color-border-strong)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-subtle)] focus:border-[var(--color-primary-600)]
            ${error ? "border-[var(--color-error-solid)] focus:ring-[var(--color-error-subtle)]" : ""}
            ${!selected || selected.value === "" ? "text-[var(--color-content-muted)]/50" : "text-[var(--color-content-primary)]"}
            ${className}
          `}
        >
          {selected?.label ?? "Select..."}
        </button>

        <div
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown size={15} strokeWidth={2} />
        </div>
      </div>

      {error && (
        <p className="text-[10px] font-bold text-[var(--color-error-solid)] uppercase tracking-wide px-1">
          {error}
        </p>
      )}

      {/* Portal — renders outside all overflow:hidden parents */}
      {open &&
        createPortal(
          <ul
            ref={dropdownRef}
            style={dropdownStyle}
            className="
            bg-[var(--color-surface-card)]
            border border-[var(--color-border-default)]
            rounded-[var(--radius-md)]
            shadow-md py-1
            max-h-[220px] overflow-y-auto
            animate-in fade-in slide-in-from-top-1 duration-150
          "
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                mx-1 px-3 py-2 text-sm rounded-[var(--radius-sm)]
                cursor-pointer transition-colors duration-100
                ${
                  option.value === value
                    ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary-600)] font-medium"
                    : "text-[var(--color-content-primary)] hover:bg-[var(--color-surface-muted)]"
                }
              `}
              >
                {option.label}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
};

export default Select;
