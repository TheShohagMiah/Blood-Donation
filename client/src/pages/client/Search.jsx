import React, { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Droplets,
  MapPin,
  Navigation,
  User,
} from "lucide-react";
import Loader from "../../ui/Loader";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// PROFESSIONAL DUMMY DATA SET
const DUMMY_DONORS = [
  {
    _id: "1",
    name: "ALEXANDER VANCE",
    bloodGroup: "A+",
    district: "Dhaka",
    upazila: "Gulshan",
    status: "active",
    avatar: null,
  },
  {
    _id: "2",
    name: "SARAH JENKINS",
    bloodGroup: "O-",
    district: "Dhaka",
    upazila: "Mirpur",
    status: "active",
    avatar: null,
  },
  {
    _id: "3",
    name: "MARCUS REED",
    bloodGroup: "B+",
    district: "Chittagong",
    upazila: "Pahartali",
    status: "active",
    avatar: null,
  },
  {
    _id: "4",
    name: "ELENA FISHER",
    bloodGroup: "AB+",
    district: "Dhaka",
    upazila: "Gulshan",
    status: "blocked",
    avatar: null,
  },
];

const DonorSearchPage = () => {
  const [params, setParams] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);

    // Simulate Network Latency for UI Testing
    setTimeout(() => {
      const filtered = DUMMY_DONORS.filter((donor) => {
        return (
          donor.bloodGroup === params.bloodGroup &&
          donor.district === params.district &&
          donor.upazila === params.upazila
        );
      });
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-2xl text-red-600 mb-2">
          <SearchIcon size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--color-content-primary)] uppercase">
          Find a Donor
        </h1>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-content-muted)] max-w-md mx-auto leading-relaxed">
          Access our high-precision database of verified volunteer blood donors.
        </p>
      </div>

      {/* Search Form Card */}
      <div className="max-w-5xl mx-auto bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-2xl)] p-2 shadow-sm transition-all hover:shadow-md">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-2"
        >
          <div className="p-4 space-y-2">
            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
              <Droplets size={14} className="text-red-500" /> Blood Group
            </label>
            <select
              required
              className="w-full bg-transparent border-none text-[13px] font-bold focus:ring-0 outline-none p-0 appearance-none cursor-pointer text-[var(--color-content-primary)]"
              value={params.bloodGroup}
              onChange={(e) =>
                setParams({ ...params, bloodGroup: e.target.value })
              }
            >
              <option value="">Select Group</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 space-y-2 border-t md:border-t-0 md:border-l border-[var(--color-border-default)]">
            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
              <MapPin size={14} /> District
            </label>
            <select
              required
              className="w-full bg-transparent border-none text-[13px] font-bold focus:ring-0 outline-none p-0 appearance-none cursor-pointer text-[var(--color-content-primary)]"
              value={params.district}
              onChange={(e) =>
                setParams({ ...params, district: e.target.value })
              }
            >
              <option value="">Select District</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
            </select>
          </div>

          <div className="p-4 space-y-2 border-t md:border-t-0 md:border-l border-[var(--color-border-default)]">
            <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
              <Navigation size={14} /> Upazila
            </label>
            <select
              required
              className="w-full bg-transparent border-none text-[13px] font-bold focus:ring-0 outline-none p-0 appearance-none cursor-pointer text-[var(--color-content-primary)]"
              value={params.upazila}
              onChange={(e) =>
                setParams({ ...params, upazila: e.target.value })
              }
            >
              <option value="">Select Upazila</option>
              {params.district === "Dhaka" && (
                <>
                  <option value="Gulshan">Gulshan</option>
                  <option value="Mirpur">Mirpur</option>
                </>
              )}
              {params.district === "Chittagong" && (
                <option value="Pahartali">Pahartali</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all h-full min-h-[64px] flex items-center justify-center gap-2"
          >
            <SearchIcon size={18} />{" "}
            {isSearching ? "SEARCHING..." : "INITIATE SEARCH"}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <section className="mt-16">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-content-muted)] animate-pulse">
              Filtering Registry...
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((donor) => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="max-w-md mx-auto text-center py-24 border-2 border-dashed border-[var(--color-border-default)] rounded-[var(--radius-3xl)]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-content-muted)]">
              No matching profiles located.
            </p>
          </div>
        ) : (
          <div className="text-center py-32 opacity-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-content-muted)]">
              Awaiting Search Parameters
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

const DonorCard = ({ donor }) => (
  <div className="group bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-8 rounded-[var(--radius-2xl)] hover:border-red-500/30 transition-all shadow-sm hover:shadow-xl">
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] overflow-hidden flex items-center justify-center">
          {donor.avatar ? (
            <img
              src={donor.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={24} className="text-[var(--color-content-muted)]" />
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-md font-black text-[var(--color-content-primary)] tracking-tight uppercase">
            {donor.name}
          </h3>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
            <MapPin size={10} /> {donor.district} / {donor.upazila}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-600 shadow-inner">
        <span className="text-sm font-black uppercase">{donor.bloodGroup}</span>
      </div>
    </div>

    <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border-default)]">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${donor.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}
        />
        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-content-secondary)]">
          {donor.status}
        </span>
      </div>
      <button className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 hover:text-red-700 transition-colors">
        View Full Profile
      </button>
    </div>
  </div>
);

export default DonorSearchPage;
