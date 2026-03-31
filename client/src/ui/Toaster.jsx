import React from "react";

const Toaster = () => {
  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className:
            "border border-[var(--color-border-default)] font-medium uppercase tracking-[0.20em] text-[10px]",
          duration: 4000,
          style: {
            background: "var(--color-surface-card)",
            color: "var(--color-content-primary)",
            backdropFilter: "blur(8px)",
            padding: "12px 24px",
            borderRadius: "12px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "var(--color-primary-600)",
              secondary: "white",
            },
            style: { borderLeft: "4px solid var(--color-primary-600)" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "white" },
            style: { borderLeft: "4px solid #ef4444" },
          },
        }}
      />
    </div>
  );
};

export default Toaster;
