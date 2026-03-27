import React from "react";
import { ArrowRight, Droplet, Users, Heart, ShieldCheck } from "lucide-react";
import Button from "../../ui/Button";

const Home = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 lg:pt-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-50)] border border-[var(--color-primary-100)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary-400)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary-600)]"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-700)]">
              Live Donations Tracking
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[var(--color-content-primary)] leading-[1.1]">
            Your Donation <br />
            <span className="text-[var(--color-primary-600)]">
              Saves Lives.
            </span>
          </h1>

          <p className="text-lg text-[var(--color-content-muted)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Connect with thousands of donors instantly. LifeFlow is the most
            efficient way to bridge the gap between blood donors and those in
            urgent need.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button variant="primary" className="h-12 px-8 w-full sm:w-auto">
              Find a Donor <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button variant="secondary" className="h-12 px-8 w-full sm:w-auto">
              Register as Donor
            </Button>
          </div>
        </div>

        {/* Hero Visual Unit */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-square rounded-[2rem] bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-surface-muted)] border border-[var(--color-border-default)] flex items-center justify-center overflow-hidden">
            <Droplet
              size={180}
              className="text-[var(--color-primary-600)] opacity-20 absolute -bottom-10 -right-10"
            />
            <div className="z-10 bg-[var(--color-surface-card)] p-8 rounded-2xl shadow-xl border border-[var(--color-border-default)] space-y-4 animate-in fade-in zoom-in duration-1000">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
                  O+
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-content-primary)]">
                    Emergency Request
                  </p>
                  <p className="text-xs text-[var(--color-content-muted)]">
                    Dhaka Medical College • 2m ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-[var(--color-border-default)]">
        {[
          { label: "Active Donors", value: "12k+", icon: Users },
          { label: "Lives Saved", value: "45k+", icon: Heart },
          { label: "Districts", value: "64", icon: ShieldCheck },
          { label: "Success Rate", value: "99%", icon: Droplet },
        ].map((stat, i) => (
          <div key={i} className="text-center space-y-2">
            <div className="flex justify-center text-[var(--color-primary-600)] mb-3">
              <stat.icon size={24} />
            </div>
            <h3 className="text-3xl font-bold text-[var(--color-content-primary)]">
              {stat.value}
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* 3. Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-600)]">
            Why LifeFlow?
          </h2>
          <p className="text-3xl font-bold text-[var(--color-content-primary)]">
            Modernizing the Donation Pipeline
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Quick Search",
              desc: "Filter by blood group and district to find the nearest match in seconds.",
            },
            {
              title: "Verified Donors",
              desc: "Our multi-step verification process ensures high-quality medical data.",
            },
            {
              title: "Privacy First",
              desc: "Your contact details are encrypted and only shared with verified requesters.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-[var(--radius-xl)] bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-primary-600)] transition-colors group"
            >
              <h4 className="text-lg font-bold mb-3 text-[var(--color-content-primary)]">
                {feature.title}
              </h4>
              <p className="text-sm text-[var(--color-content-muted)] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
