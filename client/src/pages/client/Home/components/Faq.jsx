import React from "react";
import { ChevronDown } from "lucide-react";

const Faq = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className={`group border rounded-2xl transition-all duration-base ease-smooth overflow-hidden
      ${isOpen ? "border-primary-500 bg-surface-secondary shadow-lg shadow-primary-500/5" : "border-border-default bg-surface-primary hover:border-border-strong"}`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 lg:p-6 text-left cursor-pointer transition-colors"
      >
        <span
          className={`text-base lg:text-lg font-bold tracking-tight transition-colors 
          ${isOpen ? "text-primary-600" : "text-content-primary group-hover:text-primary-600"}`}
        >
          {question}
        </span>
        <div
          className={`p-1 rounded-full transition-transform duration-base ${isOpen ? "rotate-180 bg-primary-600 text-white" : "text-content-muted bg-surface-tertiary"}`}
        >
          <ChevronDown size={20} />
        </div>
      </button>

      {/* Animated Answer Wrapper */}
      <div
        className={`grid transition-all duration-base ease-smooth
        ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-6 lg:px-6 lg:pb-8 text-sm lg:text-base text-content-secondary leading-relaxed border-t border-primary-100/50 pt-4 mt-2 mx-5 lg:mx-6 text-pretty">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
