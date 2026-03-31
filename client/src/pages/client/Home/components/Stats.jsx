import React from "react";
import { Droplet, Users, Heart, ShieldCheck, ArrowUpRight } from "lucide-react";

const Stats = () => {
  const statData = [
    {
      label: "Active Donors",
      value: "12k+",
      icon: Users,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "Lives Saved",
      value: "45k+",
      icon: Heart,
      color: "text-error-solid",
      bg: "bg-error-subtle",
    },
    {
      label: "Districts",
      value: "64",
      icon: ShieldCheck,
      color: "text-success-solid",
      bg: "bg-success-subtle",
    },
    {
      label: "Success Rate",
      value: "99%",
      icon: Droplet,
      color: "text-info-solid",
      bg: "bg-info-subtle",
    },
  ];

  return (
    <section className="container-main py-20 bg-surface-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statData.map((stat, i) => (
          <div
            key={i}
            className="card group hover:border-primary-300 transition-all duration-base ease-smooth flex flex-col justify-between min-h-[160px] animate-fade-in"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {/* Top Row: Icon and Action */}
            <div className="flex justify-between items-start">
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}
              >
                <stat.icon size={22} />
              </div>
              <ArrowUpRight
                size={18}
                className="text-content-muted opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Bottom Row: Data */}
            <div className="space-y-1">
              <h3 className="text-4xl font-bold tracking-tighter text-content-primary">
                {stat.value}
              </h3>
              <p className="text-[11px] font-black uppercase tracking-[0.15em] text-content-muted">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
