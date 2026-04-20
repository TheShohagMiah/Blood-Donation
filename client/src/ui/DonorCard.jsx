import React from "react";

import {
  ShieldCheck,
  MapPin,
  Droplet,
  MessageSquare,
  Phone,
} from "lucide-react";
import { formatDate } from "../../lib/formateDate";
import Button from "./Button";

const DonorCard = ({ donor }) => (
  <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-[var(--radius-xl)] hover:border-[var(--color-primary-600)] transition-all group hover:shadow-lg">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-[var(--color-surface-muted)] flex items-center justify-center border border-[var(--color-border-default)]">
          <ShieldCheck
            size={20}
            className={
              donor.status === "Available" ? "text-green-500" : "text-amber-500"
            }
          />
        </div>
        <div>
          <h3 className="font-bold text-[var(--color-content-primary)] uppercase tracking-tight leading-none mb-1">
            {donor.name}
          </h3>
          <p className="text-[11px] font-bold text-[var(--color-content-muted)] flex items-center gap-1 opacity-80">
            <MapPin size={12} className="text-[var(--color-primary-500)]" />{" "}
            {donor.upazila}, {donor.district}
          </p>
        </div>
      </div>
      <div className="text-right flex items-center gap-1">
        {" "}
        <Droplet size={14} className="text-red-600 fill-current" />
        <span className="block text-2xl font-black text-[var(--color-primary-600)]">
          {donor.bloodGroup}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Last Donation Date */}
      {donor.lastDonationDate ? (
        <DataBox
          label="Last Donation"
          value={formatDate(donor.lastDonationDate)}
        />
      ) : (
        <DataBox label="Last Donation" value="Not yet" />
      )}
      <DataBox
        label="Status"
        value={donor?.isAvailable ? "Available" : "Unavailable"}
        colorClass={
          donor.status === "Available" ? "text-green-600" : "text-amber-600"
        }
      />
    </div>

    <div className="flex gap-2 pt-2">
      <Button
        variant="secondary"
        className="flex-1 h-10 gap-2 text-[10px] font-black uppercase tracking-widest"
      >
        <MessageSquare size={14} /> Message
      </Button>
      <Button
        variant="primary"
        className="flex-1 h-10 gap-2 text-[10px] font-black uppercase tracking-widest"
      >
        <Phone size={14} /> Call Now
      </Button>
    </div>
  </div>
);

const DataBox = ({
  label,
  value,
  colorClass = "text-[var(--color-content-primary)]",
}) => (
  <div className="bg-[var(--color-surface-muted)]/50 p-2.5 rounded-lg border border-[var(--color-border-default)]/50">
    <p className="text-[8px] font-black uppercase text-[var(--color-content-muted)] tracking-widest mb-0.5">
      {label}
    </p>
    <p className={`text-[11px] font-black uppercase ${colorClass}`}>{value}</p>
  </div>
);
export default DonorCard;
