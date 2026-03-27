import React, { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { districts } from "../../data/districts";
import Select from "../../ui/Select";
import Button from "../../ui/Button";

const FindDonors = () => {
  // Sample donor data
  const donors = [
    {
      id: 1,
      name: "Tanvir Ahmed",
      group: "O+",
      district: "Dhaka",
      area: "Dhanmondi",
      status: "Available",
      lastDonation: "6 months ago",
    },
    {
      id: 2,
      name: "Sajid Hasan",
      group: "A-",
      district: "Dhaka",
      area: "Uttara",
      status: "Available",
      lastDonation: "1 year ago",
    },
    {
      id: 3,
      name: "Nusrat Jahan",
      group: "B+",
      district: "Chittagong",
      area: "Agrabad",
      status: "Away",
      lastDonation: "2 months ago",
    },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      {/* 1. Filter Sidebar */}
      <aside className="w-full lg:w-80 space-y-6">
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-[var(--radius-xl)] sticky top-28">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={16} className="text-[var(--color-primary-600)]" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-content-primary)]">
              Filter Donors
            </h2>
          </div>

          <div className="space-y-5">
            <Select label="Blood Group">
              <option value="">Any Group</option>
              {bloodGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>

            <Select label="District">
              <option value="">Any District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </Select>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-content-primary)] ml-1">
                Availability
              </label>
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-[10px] font-bold uppercase border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)] rounded-md">
                  Available
                </button>
                <button className="flex-1 py-2 text-[10px] font-bold uppercase border border-[var(--color-border-default)] text-[var(--color-content-muted)] rounded-md">
                  All
                </button>
              </div>
            </div>

            <Button variant="primary" className="w-full h-11 mt-4">
              Apply Filters
            </Button>
          </div>
        </div>
      </aside>

      {/* 2. Donors Grid */}
      <main className="flex-1 space-y-6">
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-[var(--color-content-muted)]">
            Showing{" "}
            <span className="font-bold text-[var(--color-content-primary)]">
              240
            </span>{" "}
            verified donors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-[var(--radius-xl)] hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-content-primary)] border border-[var(--color-border-default)]">
                    <ShieldCheck
                      size={20}
                      className={
                        donor.status === "Available"
                          ? "text-green-500"
                          : "text-amber-500"
                      }
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-content-primary)]">
                      {donor.name}
                    </h3>
                    <p className="text-[12px] text-[var(--color-content-muted)] flex items-center gap-1">
                      <MapPin size={12} /> {donor.area}, {donor.district}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-[var(--color-primary-600)] leading-none">
                    {donor.group}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-[var(--color-content-muted)]">
                    Group
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[var(--color-surface-muted)] p-2 rounded-lg text-center">
                  <p className="text-[9px] font-bold uppercase text-[var(--color-content-muted)]">
                    Last Donated
                  </p>
                  <p className="text-[11px] font-bold text-[var(--color-content-primary)]">
                    {donor.lastDonation}
                  </p>
                </div>
                <div className="bg-[var(--color-surface-muted)] p-2 rounded-lg text-center">
                  <p className="text-[9px] font-bold uppercase text-[var(--color-content-muted)]">
                    Status
                  </p>
                  <p
                    className={`text-[11px] font-bold ${donor.status === "Available" ? "text-green-600" : "text-amber-600"}`}
                  >
                    {donor.status}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 h-10 gap-2">
                  <MessageSquare size={14} /> Message
                </Button>
                <Button variant="primary" className="flex-1 h-10 gap-2">
                  <Phone size={14} /> Call Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FindDonors;
