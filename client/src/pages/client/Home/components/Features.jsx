import React from "react";
import { Search, ShieldCheck, Lock, ArrowRight } from "lucide-react";

const Features = () => {
  const featuresData = [
    {
      title: "Quick Search",
      desc: "Filter by blood group and district to find the nearest match in seconds.",
      icon: Search,
      color: "text-primary-600",
      bg: "bg-primary-50 dark:bg-primary-900/20",
    },
    {
      title: "Verified Donors",
      desc: "Our multi-step verification process ensures high-quality medical data.",
      icon: ShieldCheck,
      color: "text-success-solid",
      bg: "bg-success-subtle",
    },
    {
      title: "Privacy First",
      desc: "Your contact details are encrypted and only shared with verified requesters.",
      icon: Lock,
      color: "text-info-solid",
      bg: "bg-info-subtle",
    },
  ];

  return (
    <section className="container-main section animate-fade-in">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-16 lg:mb-20">
        <h2 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-primary-600">
          Why LifeFlow?
        </h2>
        <p className="text-3xl lg:text-5xl font-bold text-content-primary tracking-tight text-balance max-w-2xl mx-auto">
          Modernizing the Donation Pipeline
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {featuresData.map((feature, i) => (
          <div
            key={i}
            className="card group p-8 lg:p-10 border-border-default hover:border-primary-500 hover:shadow-xl transition-all duration-slow ease-smooth relative overflow-hidden"
          >
            {/* Top Row: Icon */}
            <div
              className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:-rotate-3`}
            >
              <feature.icon size={28} strokeWidth={2.5} />
            </div>

            {/* Content */}
            <div className="space-y-4 relative z-10">
              <h4 className="text-xl lg:text-2xl font-bold text-content-primary tracking-tight">
                {feature.title}
              </h4>
              <p className="text-sm lg:text-base text-content-secondary leading-relaxed">
                {feature.desc}
              </p>
            </div>

            {/* Subtle Hover Link Indicator */}
            <div className="pt-6 flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 cursor-pointer">
              Learn More <ArrowRight size={14} />
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-surface-tertiary rounded-full opacity-50 group-hover:scale-150 transition-transform duration-slow" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
