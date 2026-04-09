import React, { useState } from "react";
import Button from "../../../../ui/Button";
import {
  ArrowRight,
  Search,
  Activity,
  HeartPulse,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import CreateBloodRequest from "./CreateBloodRequest";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [createBloodRequest, setCreateBloodRequest] = useState(false);

  return (
    <section className="relative min-h-[90vh] lg:min-h-[95vh] flex items-center overflow-hidden bg-surface-primary transition-colors duration-base ease-smooth pt-20 lg:pt-0">
      {/* Decorative Background - Hidden on small screens for clarity */}
      <div className="absolute top-0 right-0 w-full lg:w-1/3 h-full bg-surface-secondary -skew-x-0 lg:-skew-x-12 translate-x-0 lg:translate-x-1/4 opacity-30 lg:opacity-50 dark:opacity-10 lg:dark:opacity-20" />

      <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10 py-12 lg:py-0">
        {/* Content Side: Centered on mobile, left-aligned on desktop */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-8 animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 w-fit px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-info-subtle text-info-text border border-info-border">
            <Activity size={14} className="animate-pulse lg:w-4 lg:h-4" />
            <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider">
              Trusted by 50+ Hospitals
            </span>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-display text-4xl sm:text-6xl lg:text-8xl font-bold text-content-primary leading-[1.1] lg:leading-[0.95] tracking-tight text-balance">
              Giving Blood <br />
              Is Giving <span className="text-primary-600">Life.</span>
            </h1>
            <p className="text-base lg:text-lg text-content-secondary max-w-lg leading-relaxed text-pretty mx-auto lg:mx-0">
              Experience the fastest way to connect with blood donors. Our
              platform ensures a seamless, secure, and instant response for
              every emergency.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
            <Button
              onClick={() => navigate("/register")}
              className="btn-lg btn-primary w-full sm:w-auto shadow-lg shadow-primary-500/20 hover:scale-[1.02] transition-transform"
            >
              Join as a donor
            </Button>
            <Button
              onClick={() => navigate("/find-donors")}
              variant="secondary"
              className="btn-lg btn-secondary w-full sm:w-auto"
            >
              Find a donor
            </Button>
          </div>

          {/* Trust Badges: Stacked on tiny screens, row on others */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-6 border-t border-border-default w-full lg:w-auto">
            <div className="flex items-center gap-2 text-content-secondary">
              <ShieldCheck size={18} className="text-success-solid" />
              <span className="text-sm font-medium">Verified Donors</span>
            </div>
            <div className="flex items-center gap-2 text-content-secondary">
              <MapPin size={18} className="text-primary-500" />
              <span className="text-sm font-medium">Real-time Tracking</span>
            </div>
          </div>
        </div>

        {/* Visual Side: Interaction Cards - Hidden on Mobile, Visible from LG up */}
        <div className="relative h-[400px] lg:h-[500px] w-full hidden lg:flex items-center justify-center animate-fade-in">
          {/* Main Card */}
          <div className="glass w-64 h-80 lg:w-80 lg:h-96 rounded-2xl shadow-xl p-6 lg:p-8 relative overflow-hidden rotate-3 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary-600 flex items-center justify-center text-content-inverse shadow-md">
                <HeartPulse size={28} className="lg:w-8 lg:h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl lg:text-2xl font-bold text-content-primary tracking-tight">
                  Immediate <br /> Assistance
                </h3>
                <p className="text-xs lg:text-sm text-content-secondary">
                  Connecting you to the nearest donor in under 2 minutes.
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-surface-tertiary rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-primary-600 rounded-full" />
            </div>
          </div>

          {/* Floating Request Card */}
          <div className="absolute top-1/2 -left-2 lg:-left-4 -translate-y-1/2 bg-surface-primary border border-border-strong text-content-primary p-4 lg:p-6 rounded-xl shadow-xl -rotate-6 max-w-[180px] lg:max-w-[210px] z-20">
            <p className="text-[8px] lg:text-[10px] text-content-muted uppercase tracking-widest font-bold mb-2 lg:mb-3">
              Active Requests
            </p>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-error-solid flex items-center justify-center font-bold text-[8px] lg:text-[10px] text-white">
                  O-
                </div>
                <div className="text-[9px] lg:text-[11px] font-medium leading-tight text-content-secondary">
                  Emergency at DMCH
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-[8px] lg:text-[10px] text-white">
                  A+
                </div>
                <div className="text-[9px] lg:text-[11px] font-medium leading-tight text-content-secondary">
                  Required at Apollo
                </div>
              </div>
            </div>
          </div>

          {/* Search Badge */}
          <div className="absolute bottom-6 lg:bottom-10 right-0 glass p-3 lg:p-4 rounded-lg shadow-lg flex items-center gap-3 lg:gap-4 animate-scale-in">
            <div className="p-1.5 lg:p-2 bg-success-subtle text-success-solid rounded-md">
              <Search size={16} className="lg:w-5 lg:h-5" />
            </div>
            <p className="text-xs lg:text-sm font-bold text-content-primary pr-2 lg:pr-4">
              Nearby Donor Found!
            </p>
          </div>
        </div>

        {/* Simplified Mobile Visual - Only shows on small screens */}
        <div className="lg:hidden flex justify-center w-full animate-fade-in mt-4">
          <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4 shadow-md border-primary-100">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white">
              <HeartPulse size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-content-primary leading-none">
                24/7 Support
              </p>
              <p className="text-[10px] text-content-muted mt-1">
                Ready for emergencies
              </p>
            </div>
          </div>
        </div>
      </div>

      {createBloodRequest && (
        <CreateBloodRequest onClose={() => setCreateBloodRequest(false)} />
      )}
    </section>
  );
};

export default Hero;
