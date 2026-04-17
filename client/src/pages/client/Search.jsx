import React, { useState, useEffect, useMemo } from "react";
import {
  Search as SearchIcon,
  Droplets,
  MapPin,
  Navigation,
  User,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import Loader from "../../ui/Loader";
import { districts } from "../../data/districts";
import { upazilas } from "../../data/upazilas";
import { useGetDonorsQuery } from "../../redux/features/isAuth/authApi";
import DonorCard from "../../ui/DonorCard";
import Select from "../../ui/Select";
import Button from "../../ui/Button";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// PROFESSIONAL DUMMY DATA SET

const DonorSearchPage = () => {
  const { data: alldonors, isLoading, error } = useGetDonorsQuery();

  const [params, setParams] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [activeFilter, setActiveFilter] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filteredUpazilas = useMemo(() => {
    if (!params.district) return [];

    const dist = districts.find((d) => d.name === params.district);
    if (!dist) return [];

    return upazilas.filter((u) => u.district_id === dist.id);
  }, [params.district, districts, upazilas]);

  const handleApplyFilter = (e) => {
    e.preventDefault();

    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      setActiveFilter(params);
      setIsSearching(false);
    }, 500);
  };

  const handleReset = () => {
    const initial = { bloodGroup: "", district: "", upazila: "" };
    setParams(initial);
    setActiveFilter(initial);
  };

  const filteredDonors = useMemo(() => {
    if (
      !activeFilter.bloodGroup &&
      !activeFilter.district &&
      !activeFilter.upazila
    ) {
      return [];
    }

    const donors = alldonors?.data || [];

    return donors.filter((donor) => {
      const matchGroup = activeFilter.bloodGroup
        ? donor.bloodGroup === activeFilter.bloodGroup
        : true;
      const matchDistrict = activeFilter.district
        ? donor.district === activeFilter.district
        : true;
      const matchUpazila = activeFilter.upazila
        ? donor.upazila === activeFilter.upazila
        : true;
      return matchGroup && matchDistrict && matchUpazila;
    });
  }, [alldonors, activeFilter]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader />
      </div>
    );
  }
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
          onSubmit={handleApplyFilter}
          className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center justify-around p-4"
        >
          <div className="p-4 space-y-2">
            <Select
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
            </Select>
          </div>

          <div className="p-4 space-y-2 border-t md:border-t-0 md:border-l border-[var(--color-border-default)]">
            <Select
              value={params.district}
              onChange={(e) =>
                setParams({ ...params, district: e.target.value })
              }
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="p-4 space-y-2 border-t md:border-t-0 md:border-l border-[var(--color-border-default)]">
            <Select
              value={params.upazila}
              disabled={!params.district}
              onChange={(e) =>
                setParams({ ...params, upazila: e.target.value })
              }
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((upazila) => (
                <option key={upazila.id} value={upazila.name}>
                  {upazila.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" disabled={isSearching}>
              <SearchIcon size={18} />{" "}
              {isSearching ? "SEARCHING..." : " SEARCH"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isSearching}
              onClick={handleReset}
            >
              <RefreshCcw
                size={10}
                className="group-hover/reset:rotate-[-180deg] transition-transform duration-500"
              />
              Reset
            </Button>
          </div>
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
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDonors.map((donor) => (
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

export default DonorSearchPage;
