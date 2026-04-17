import React from "react";
import {
  UserPlus,
  Calendar,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const Services = () => {
  const steps = [
    {
      icon: <UserPlus size={20} />,
      title: "Identity Initialization",
      description:
        "Join our donor network to track impact metrics and receive district-specific urgent alerts.",
      tag: "Protocol 01",
    },
    {
      icon: <Calendar size={20} />,
      title: "Request Deployment",
      description:
        "Browse live feeds or post a blood requirement as a guest. System-wide sync is instantaneous.",
      tag: "Protocol 02",
    },
    {
      icon: <HeartPulse size={20} />,
      title: "Direct Coordination",
      description:
        "Secure bridge lines enable direct contact with hospital coordinators and verified recipients.",
      tag: "Protocol 03",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Safety Validation",
      description:
        "Every entry undergoes rate-limiting and metadata verification to ensure genuine clinical need.",
      tag: "Protocol 04",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-24 px-6">
      {/* Header with Technical Accent */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--color-primary-600)] mb-4 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[var(--color-primary-600)]" />
            Operational Ecosystem
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-[var(--color-content-primary)] tracking-tight leading-[1.1]">
            A streamlined pipeline from{" "}
            <span className="text-[var(--color-primary-600)]">
              request to transfusion.
            </span>
          </h3>
        </div>
        <p className="text-sm text-[var(--color-content-muted)] max-w-xs leading-relaxed border-l border-[var(--color-border-default)] pl-6 italic">
          High-integrity logistics for emergency blood distribution and donor
          management.
        </p>
      </div>

      {/* Modern Bento-Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border-default)] border border-[var(--color-border-default)] rounded-[var(--radius-2xl)] overflow-hidden shadow-2xl shadow-black/5">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative p-10 bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] transition-all duration-500"
          >
            {/* Step Index Watermark */}
            <span className="absolute top-8 right-8 text-5xl font-black text-[var(--color-content-primary)] opacity-[0.03] tabular-nums group-hover:opacity-[0.08] transition-opacity">
              0{index + 1}
            </span>

            <div className="relative z-10 space-y-8">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-600)] text-white flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>

              <div className="space-y-4">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-2 py-1 rounded">
                  {step.tag}
                </span>
                <h4 className="text-xl font-bold text-[var(--color-content-primary)] tracking-tight">
                  {step.title}
                </h4>
                <p className="text-sm leading-relaxed text-[var(--color-content-muted)]">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-content-primary)] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Initialize <ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="mt-12 flex flex-col md:flex-row items-center gap-8 justify-between p-8 rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border-default)]">
        <div className="flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <p className="text-xs font-bold text-[var(--color-content-secondary)] uppercase tracking-widest">
            System Status: Verified & Live Sync Active
          </p>
        </div>
        <button className="flex items-center gap-3 px-8 py-3 bg-[var(--color-content-primary)] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10">
          Security Overview <ShieldCheck size={14} />
        </button>
      </div>
    </section>
  );
};

export default Services;
