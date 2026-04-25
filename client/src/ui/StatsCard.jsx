import React from "react";
import { HelpCircle } from "lucide-react";

const StatsCard = ({ icon: Icon = HelpCircle, label, value }) => {
  return (
    <div className="group relative overflow-hidden rounded-md border border-border-default bg-surface-card backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent" />
      <div className="bg-primary-600 w-12 h-12 flex items-center justify-center text-white rounded-md mb-6">
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
