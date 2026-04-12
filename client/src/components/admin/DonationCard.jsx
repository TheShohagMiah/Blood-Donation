import React from "react";
import StatusBadge from "./donor/StatusBadge";
import DetailPill from "./DetaPill";
import { formatDate } from "../../../lib/formateDate";
import { Calendar } from "lucide-react";

const DonationCard = ({ donation, req }) => (
  <div className="px-4 py-4 sm:px-6 sm:py-5 hover:bg-[var(--color-surface-muted)]/20 transition-all group">
    {/* Row 1: recipient + status */}
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-[var(--color-content-primary)] uppercase tracking-tight truncate group-hover:text-[var(--color-primary-600)] transition-colors">
          {req?.recipientName || "Unknown"}
        </p>
        <p className="text-[10px] text-[var(--color-content-muted)] mt-0.5 uppercase tracking-widest">
          Req by:{" "}
          <span className="text-[var(--color-content-primary)]">
            {req?.requester?.name || "System"}
          </span>
        </p>
      </div>
      <StatusBadge status={req?.status} />
    </div>

    {/* Row 2: detail pills */}
    <div className="flex flex-wrap gap-2 mb-3">
      {req?.bloodGroup && (
        <DetailPill
          label="Blood"
          value={req.bloodGroup}
          accent="text-red-500"
        />
      )}
      {req?.hospitalName && (
        <DetailPill label="Hospital" value={req.hospitalName} />
      )}
      {(req?.upazila || req?.district) && (
        <DetailPill
          label="Location"
          value={[req.upazila, req.district].filter(Boolean).join(", ")}
        />
      )}
      {req?.contactNumber && (
        <DetailPill label="Contact" value={req.contactNumber} />
      )}
    </div>

    {/* Row 3: date */}
    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-content-muted)] uppercase tracking-widest">
      <Calendar size={11} />
      <span className="font-bold text-[var(--color-content-primary)]">
        {formatDate(req?.donationDate)}
      </span>
      {req?.donationTime && <span>· {req.donationTime}</span>}
    </div>
  </div>
);

export default DonationCard;
