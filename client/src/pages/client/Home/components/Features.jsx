import React from "react";
import {
  UserPlus,
  Calendar,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const Services = () => {
  const workflow = [
    {
      icon: <UserPlus size={20} />,
      title: "Identity Initialization",
      desc: "Create a secure donor profile. Your medical data is encrypted and used only for matching protocols.",
      step: "01",
    },
    {
      icon: <Calendar size={20} />,
      title: "Request Deployment",
      desc: "Submit a blood requirement or schedule a donation. Live sync ensures your district sees it instantly.",
      step: "02",
    },
    {
      icon: <HeartPulse size={20} />,
      title: "Direct Coordination",
      desc: "Connect via our secure bridge. Direct lines are opened between verified donors and urgent recipients.",
      step: "03",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Impact Validation",
      desc: "After a successful donation, the request is archived and your donor status is updated in the ledger.",
      step: "04",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-24 px-6">
      <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
        {/* Left: Sticky Sidebar Header */}
        <div className="lg:w-1/3 lg:sticky lg:top-24 space-y-6">
          <div className="space-y-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--color-primary-600)]">
              Operations Manual
            </h2>
            <h3 className="text-4xl font-bold text-[var(--color-content-primary)] tracking-tight leading-[1.1]">
              How the Ecosystem Functions.
            </h3>
          </div>
          <p className="text-sm text-[var(--color-content-muted)] leading-relaxed max-w-sm">
            Our platform operates on a high-integrity pipeline designed to
            minimize the time between request and transfusion.
          </p>
          <div className="pt-4">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-content-primary)] group">
              View Detailed Whitepaper
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Right: Steps Grid */}
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--color-border-default)] border border-[var(--color-border-default)] rounded-[var(--radius-2xl)] overflow-hidden shadow-2xl shadow-black/5">
          {workflow.map((item, index) => (
            <div
              key={index}
              className="bg-[var(--color-surface-card)] p-10 hover:bg-[var(--color-surface-secondary)] transition-colors duration-500 group relative"
            >
              {/* Step Number Overlay */}
              <span className="absolute top-8 right-8 text-5xl font-black text-[var(--color-content-primary)] opacity-[0.03] tabular-nums group-hover:opacity-[0.07] transition-opacity">
                {item.step}
              </span>

              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-600)] text-white flex items-center justify-center shadow-lg shadow-primary-600/20">
                  {item.icon}
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-[var(--color-content-primary)] tracking-tight flex items-center gap-3">
                    <span className="text-[10px] font-black text-[var(--color-primary-600)] tabular-nums">
                      {item.step}.
                    </span>
                    {item.title}
                  </h4>
                  <p className="text-sm text-[var(--color-content-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
