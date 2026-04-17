import React from "react";
import { ChevronDown } from "lucide-react";

const Faq = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <div
      className={`group transition-all duration-500 ease-out border-b border-[var(--color-border-default)]
      ${isOpen ? "bg-[var(--color-surface-secondary)]" : "bg-transparent"}`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-7 px-4 lg:px-8 text-left cursor-pointer outline-none"
      >
        <div className="flex items-center gap-6 lg:gap-10">
          {/* Technical Indexing */}
          <span className="text-[10px] font-black text-[var(--color-primary-600)] tabular-nums tracking-widest opacity-70">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span
            className={`text-base lg:text-lg font-bold tracking-tight transition-all duration-300 
            ${isOpen ? "text-[var(--color-primary-600)] translate-x-1" : "text-[var(--color-content-primary)]"}`}
          >
            {question}
          </span>
        </div>

        {/* Geometric Toggle */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-500
          ${
            isOpen
              ? "rotate-180 bg-[var(--color-primary-600)] border-[var(--color-primary-600)] text-white shadow-lg shadow-primary-600/20"
              : "border-[var(--color-border-default)] text-[var(--color-content-muted)] bg-[var(--color-surface-card)]"
          }`}
        >
          <ChevronDown size={16} strokeWidth={2.5} />
        </div>
      </button>

      {/* Modern CSS Grid Animation */}
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-10 pb-8 lg:px-24 lg:pb-10 max-w-4xl">
            <div className="pt-2 text-sm lg:text-base text-[var(--color-content-muted)] leading-relaxed border-l-2 border-[var(--color-primary-600)] pl-6">
              {answer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
