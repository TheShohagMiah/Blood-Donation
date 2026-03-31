import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-surface-main)]">
      {/* Outer Pulse Ring */}
      <div className="relative flex items-center justify-center">
        {/* Animated Glow Layer */}
        <div className="absolute h-20 w-20 animate-ping rounded-full bg-[var(--color-primary-600)] opacity-20 duration-[2000ms]" />

        {/* Main Spinning Border */}
        <div className="h-16 w-16 animate-spin rounded-full border-[3px] border-[var(--color-border-default)] border-t-[var(--color-primary-600)]" />

        {/* Center Static Icon/Dot */}
        <div className="absolute h-2 w-2 rounded-full bg-[var(--color-primary-600)] shadow-[0_0_15px_var(--color-primary-600)]" />
      </div>

      {/* Terminal-Style Text
      <div className="mt-8 flex flex-col items-center gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-content-primary)] animate-pulse">
          Synchronizing Terminal
        </span>
        <div className="flex gap-1">
          <div className="h-[2px] w-8 rounded-full bg-[var(--color-border-default)] overflow-hidden">
            <div className="h-full w-full bg-[var(--color-primary-600)] animate-slide-infinite" />
          </div>
        </div>
      </div> */}

      {/* Adding custom keyframes directly via Tailwind style tag if not in config */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-infinite {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-slide-infinite {
          animation: slide-infinite 1.5s infinite linear;
        }
      `,
        }}
      />
    </div>
  );
};

export default Loader;
