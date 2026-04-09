import React, { useState, useMemo } from "react";
import {
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Filter,
  RefreshCcw,
  Droplet,
  Activity,
} from "lucide-react";
import { districts } from "../../data/districts";
import Select from "../../ui/Select";
import Button from "../../ui/Button";

// Internal Data Store
const donors = [
  {
    id: 1,
    name: "Tanvir Ahmed",
    bloodGroup: "O+",
    district: "Dhaka",
    area: "Dhanmondi",
    status: "Available",
    lastDonation: "6 months ago",
  },
  {
    id: 2,
    name: "Sajid Hasan",
    bloodGroup: "AB-",
    district: "Tangail",
    area: "Uttara",
    status: "Available",
    lastDonation: "1 year ago",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    bloodGroup: "B+",
    district: "Chittagong",
    area: "Agrabad",
    status: "Away",
    lastDonation: "2 months ago",
  },
  {
    id: 4,
    name: "Ariful Islam",
    bloodGroup: "A-",
    district: "Dhaka",
    area: "Mirpur",
    status: "Available",
    lastDonation: "3 months ago",
  },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const FindDonors = () => {
  // 1. DRAFT STATE (What user sees in sidebar)
  const [params, setParams] = useState({
    bloodGroup: "",
    district: "",
    availability: "all",
  });

  // 2. ACTIVE STATE (What the grid is actually showing)
  const [activeFilter, setActiveFilter] = useState({
    bloodGroup: "",
    district: "",
    availability: "all",
  });

  // 3. Logic: Filtered donors derived from activeFilter
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchGroup = activeFilter.bloodGroup
        ? donor.bloodGroup === activeFilter.bloodGroup
        : true;
      const matchDistrict = activeFilter.district
        ? donor.district === activeFilter.district
        : true;
      const matchAvailability =
        activeFilter.availability === "available"
          ? donor.status === "Available"
          : true;
      return matchGroup && matchDistrict && matchAvailability;
    });
  }, [activeFilter]);

  const handleChangeFilter = (name, value) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    setActiveFilter(params);
  };

  const handleReset = () => {
    const initial = { bloodGroup: "", district: "", availability: "all" };
    setParams(initial);
    setActiveFilter(initial);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 pb-20">
      {/* 1. SIDEBAR: TECHNICAL CONTROL PANEL */}
      <aside className="w-full lg:w-80 group">
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] overflow-hidden lg:sticky lg:top-28 transition-all duration-300 hover:border-[var(--color-border-strong)] shadow-sm">
          {/* Header Section */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-default)] bg-[var(--color-surface-muted)]/30">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-content-primary)]">
                Registry Filter
              </h2>
            </div>
            <button
              onClick={handleReset}
              className="group/reset flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[var(--color-content-muted)] hover:text-red-500 transition-colors"
            >
              <RefreshCcw
                size={10}
                className="group-hover/reset:rotate-[-180deg] transition-transform duration-500"
              />
              Reset
            </button>
          </div>

          <form onSubmit={handleApplyFilter} className="p-5 space-y-7">
            <div className="space-y-6">
              {/* Classification Selector */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--color-content-muted)]">
                  <Droplet size={12} className="text-red-500" /> 01. Blood Group
                </label>
                <Select
                  value={params.bloodGroup}
                  onChange={(e) =>
                    handleChangeFilter("bloodGroup", e.target.value)
                  }
                  className="bg-[var(--color-surface-secondary)] border-transparent focus:border-[var(--color-primary-600)] font-bold text-sm h-11"
                >
                  <option value="">Any Classification</option>
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Select>
              </div>

              {/* District Selector */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--color-content-muted)]">
                  <MapPin size={12} /> 02. Geographic Region
                </label>
                <Select
                  value={params.district}
                  onChange={(e) =>
                    handleChangeFilter("district", e.target.value)
                  }
                  className="bg-[var(--color-surface-secondary)] border-transparent focus:border-[var(--color-primary-600)] font-bold text-sm h-11"
                >
                  <option value="">All Regions</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Status Toggle Selector */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--color-content-muted)]">
                  <Activity size={12} /> 03. Status Protocol
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[var(--color-surface-secondary)] p-1 rounded-lg border border-[var(--color-border-default)]">
                  {["all", "available"].map((status) => (
                    <label
                      key={status}
                      className={`
                        cursor-pointer text-center py-2 text-[10px] font-black uppercase tracking-tighter rounded-md transition-all
                        ${
                          params.availability === status
                            ? "bg-[var(--color-surface-card)] text-[var(--color-primary-600)] shadow-sm border border-[var(--color-border-default)]"
                            : "text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)]"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        name="availability"
                        value={status}
                        checked={params.availability === status}
                        onChange={(e) =>
                          handleChangeFilter("availability", e.target.value)
                        }
                      />
                      {status === "all" ? "Universal" : "Available"}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[var(--color-content-primary)] hover:bg-black text-white rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] border-none shadow-md"
            >
              <Filter size={16} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Initiate Search
              </span>
            </Button>

            <div className="pt-2 border-t border-[var(--color-border-default)]">
              <p className="text-[8px] font-bold text-[var(--color-content-muted)] uppercase tracking-widest leading-relaxed">
                System v3.0 // Ready for Query
              </p>
            </div>
          </form>
        </div>
      </aside>

      {/* 2. MAIN CONTENT: RESULTS GRID */}
      <main className="flex-1 space-y-6">
        <div className="flex items-center justify-between px-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
            Displaying{" "}
            <span className="text-[var(--color-content-primary)] font-black">
              {filteredDonors.length}
            </span>{" "}
            Verified Records
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-[var(--color-surface-muted)]/30 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-default)]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-content-muted)]">
                No matching records identified in registry
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Sub-component for clean rendering
const DonorCard = ({ donor }) => (
  <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-[var(--radius-xl)] hover:border-[var(--color-primary-600)] transition-all group hover:shadow-lg">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-muted)] flex items-center justify-center border border-[var(--color-border-default)]">
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
            {donor.area}, {donor.district}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="block text-2xl font-black text-[var(--color-primary-600)] leading-none italic">
          {donor.bloodGroup}
        </span>
        <span className="text-[9px] font-black uppercase tracking-tighter text-[var(--color-content-muted)]">
          Group
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-6">
      <DataBox label="Last Donated" value={donor.lastDonation} />
      <DataBox
        label="Status"
        value={donor.status}
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

export default FindDonors;
