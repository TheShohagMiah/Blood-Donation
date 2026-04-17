import React from "react";
import { HelpCircle } from "lucide-react";

const StatsCard = ({ icon: Icon = HelpCircle, label, value }) => {
  return (
    <div className="flex flex-col bg-surface-card transition-all p-6 border border-border-default rounded-md shadow-md">
      <div className="bg-red-200 w-12 h-12 flex items-center justify-center text-primary-700 rounded-lg mb-6">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-content-muted font-bold uppercase tracking-wider">
          {label}
        </span>
        <span className="text-2xl font-semibold text-content-main">
          {value}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
