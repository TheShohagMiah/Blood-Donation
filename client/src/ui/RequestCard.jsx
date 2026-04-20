import React from "react";
import { MapPin, Calendar, Droplet, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const RequestCard = React.memo(({ req, onView, onDonate }) => {
  const navigate = useNavigate();
  const urgencyConfig = {
    emergency: "bg-red-50 border-red-200 text-red-700",
    urgent: "bg-orange-50 border-orange-200 text-orange-700",
    normal: "bg-emerald-50 border-emerald-200 text-emerald-700",
    default: "bg-slate-50 border-slate-200 text-slate-700",
  };

  return (
    <div className="group bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-primary-600)] rounded-[var(--radius-xl)] p-5 transition-all flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-md bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] flex flex-col items-center justify-center shrink-0">
          <span className="text-lg font-black text-[var(--color-primary-600)]">
            {req.bloodGroup}
          </span>
          <Droplet
            size={10}
            className="text-[var(--color-primary-600)] fill-current"
          />
        </div>
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[var(--color-content-primary)] truncate">
              {req.recipientName}
            </h3>
            <span
              className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border ${urgencyConfig[req.urgency?.toLowerCase()] || urgencyConfig.default}`}
            >
              {req.urgency || "Normal"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-content-muted)] opacity-80">
            <MapPin size={12} className="text-[var(--color-primary-500)]" />
            <span className="truncate">{req.hospitalName}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-[11px] text-[var(--color-content-muted)] font-black bg-[var(--color-surface-secondary)] p-2.5 rounded-lg uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />{" "}
            {new Date(req.donationDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 border-l border-[var(--color-border-default)] pl-3">
            <Clock size={13} /> {req.donationTime}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={() => navigate(`/requests/${req._id}`)}
            variant="secondary"
            className="h-9 text-[10px] uppercase font-black"
          >
            View Details
          </Button>

          <Button
            onClick={onDonate}
            variant="primary"
            className="h-9 text-[10px] uppercase font-black"
          >
            Donate Now{" "}
            <ChevronRight
              size={14}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default RequestCard;
