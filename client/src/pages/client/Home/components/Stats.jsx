import React from "react";
import { Droplet, Users, Heart, ShieldCheck, ArrowUpRight } from "lucide-react";

const Stats = () => {
  const statData = [
    {
      label: "Verified Donors",
      value: "12,408",
      icon: Users,
      color: "text-[var(--color-primary-600)]",
      bg: "bg-[var(--color-primary-50)]",
      trend: "+12% this month",
    },
    {
      label: "Emergency Saves",
      value: "45,210",
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-50",
      trend: "Critical Metric",
    },
    {
      label: "Operational Districts",
      value: "64",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "National Coverage",
    },
    {
      label: "Match Success",
      value: "99.8%",
      icon: Droplet,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "Live Probability",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-24 px-6">
      {/* Grid Layout with Industrial Bordering */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border-default)] border border-[var(--color-border-default)] rounded-[var(--radius-2xl)] overflow-hidden shadow-2xl shadow-black/5">
        {statData.map((stat, i) => (
          <div
            key={i}
            className="group relative bg-[var(--color-surface-card)] p-10 hover:bg-[var(--color-surface-secondary)] transition-all duration-500 ease-out flex flex-col justify-between min-h-[220px]"
          >
            {/* Top Row: Functional Icon */}
            <div className="flex justify-between items-start">
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg shadow-current/10`}
              >
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-end">
                <ArrowUpRight
                  size={18}
                  className="text-[var(--color-content-muted)] opacity-20 group-hover:opacity-100 group-hover:text-[var(--color-primary-600)] transition-all"
                />
              </div>
            </div>

            {/* Bottom Row: Data Architecture */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-4xl font-bold tracking-tighter text-[var(--color-content-primary)] tabular-nums">
                  {stat.value}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary-600)]">
                  {stat.label}
                </p>
              </div>

              {/* Trend/Context Label */}
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border-default)] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-[9px] font-bold text-[var(--color-content-muted)] uppercase tracking-widest">
                  {stat.trend}
                </span>
              </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-500)] opacity-0 group-hover:opacity-[0.02] blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity duration-700 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* System Pulse Footer */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-card)] shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-content-secondary)]">
            Real-Time Telemetry Active
          </span>
        </div>
      </div>
    </section>
  );
};

export default Stats;
