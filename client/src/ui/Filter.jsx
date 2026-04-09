import React from "react";
import { Filter, RefreshCcw, Droplet, MapPin, Activity } from "lucide-react";
import Select from "../../ui/Select";
import Button from "../../ui/Button";

const FilterSection = ({
  params,
  handleChangeFilter,
  handleApplyFilter,
  handleReset,
}) => {
  return (
    <aside className="w-full lg:w-80 group">
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] overflow-hidden lg:sticky lg:top-28 transition-all duration-300 hover:border-[var(--color-border-strong)]">
        {/* 1. Header: Technical Tab Style */}
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
          {/* 2. Grouped Inputs with Micro-Labels */}
          <div className="space-y-6">
            {/* Blood Group Selector */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--color-content-muted)]">
                <Droplet size={12} className="text-red-500" /> 01. Blood
                Classification
              </label>
              <Select
                value={params.bloodGroup}
                onChange={(e) =>
                  handleChangeFilter("bloodGroup", e.target.value)
                }
                className="bg-[var(--color-surface-secondary)] border-transparent focus:border-[var(--color-primary-600)] font-bold text-sm h-11"
              >
                <option value="">Any Classification</option>
                {/* Options mapped here */}
              </Select>
            </div>

            {/* District Selector */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] text-[var(--color-content-muted)]">
                <MapPin size={12} /> 02. Geographic Region
              </label>
              <Select
                value={params.district}
                onChange={(e) => handleChangeFilter("district", e.target.value)}
                className="bg-[var(--color-surface-secondary)] border-transparent focus:border-[var(--color-primary-600)] font-bold text-sm h-11"
              >
                <option value="">All Regions</option>
                {/* Districts mapped here */}
              </Select>
            </div>

            {/* Availability: Toggle Style Radio */}
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

          {/* 3. Action Button: High Impact */}
          <Button
            type="submit"
            className="w-full h-12 bg-[var(--color-content-primary)] hover:bg-black text-white rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] border-none"
          >
            <Filter size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Initiate Search
            </span>
          </Button>

          {/* 4. Footer Metadata */}
          <div className="pt-2 border-t border-[var(--color-border-default)]">
            <p className="text-[8px] font-bold text-[var(--color-content-muted)] uppercase tracking-widest leading-relaxed">
              System v3.0 // Ready for Query
            </p>
          </div>
        </form>
      </div>
    </aside>
  );
};

export default FilterSection;
