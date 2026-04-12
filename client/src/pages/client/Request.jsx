import React, { useMemo, useState, useCallback } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Droplet,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";
import { districts } from "../../data/districts";
import { bloodGroups } from "../../data/bloodGroups";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import DonationModal from "../../ui/DonationModal";
import RequestViewModal from "../../ui/RequestViewModal";
import CreateBloodRequest from "./Home/components/CreateBloodRequest";
import { useGetBloodRequestsQuery } from "../../redux/features/bloodRequest/bloodRequestApi";
import Loader from "../../ui/Loader";

const BloodRequests = () => {
  const {
    data: bloodRequests,
    isLoading,
    isFetching,
  } = useGetBloodRequestsQuery();

  // Modal States
  const [createRequest, setCreateRequest] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Search/Filter State Logic
  const [params, setParams] = useState({
    bloodGroup: "",
    district: "",
  });

  // This state holds the values that are currently being applied to the list
  const [activeParams, setActiveParams] = useState({
    bloodGroup: "",
    district: "",
  });

  const sortedDistricts = useMemo(
    () => [...districts].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  // Filter Logic triggered only by activeParams
  const filteredRequests = useMemo(() => {
    const baseRequests = bloodRequests?.requests || [];
    return baseRequests.filter((req) => {
      const matchGroup = activeParams.bloodGroup
        ? req.bloodGroup === activeParams.bloodGroup
        : true;
      const matchDistrict = activeParams.district
        ? req.district === activeParams.district
        : true;
      return matchGroup && matchDistrict;
    });
  }, [activeParams, bloodRequests]);

  const handleSearchTrigger = (e) => {
    e.preventDefault();
    setActiveParams(params);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Search Page Style Filter Bar */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] p-2 shadow-sm">
        <form
          onSubmit={handleSearchTrigger}
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
        >
          <div className="p-3 space-y-1">
            <Select
              label="Blood Group"
              icon={Droplet}
              value={params.bloodGroup}
              onChange={(e) =>
                setParams({ ...params, bloodGroup: e.target.value })
              }
            >
              <option value="">All Groups</option>
              {bloodGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </div>

          <div className="p-3 space-y-1 border-t md:border-t-0 md:border-l border-[var(--color-border-default)]">
            <Select
              label="District"
              icon={MapPin}
              value={params.district}
              onChange={(e) =>
                setParams({ ...params, district: e.target.value })
              }
            >
              <option value="">All Districts</option>
              {sortedDistricts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>

          <button
            type="submit"
            disabled={isFetching}
            className="flex items-center justify-center gap-2 transition-all bg-primary-600 rounded-md active:scale-95 h-full "
          >
            <Search size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Initiate Filter
            </span>
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
            Active Requests Identified ({filteredRequests.length})
          </h2>
          <Button
            onClick={() => setCreateRequest(true)}
            variant="primary"
            className="h-9 px-5 rounded-full text-[11px] uppercase tracking-wider"
          >
            <Plus size={14} className="mr-1" /> Add Request
          </Button>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <RequestCard
                key={req._id || req.id}
                req={req}
                onView={() => setViewRequest(req)}
                onDonate={() => setSelectedRequest(req)}
              />
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border-default)] rounded-[var(--radius-2xl)]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-content-muted)]">
                No matching records found in registry.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RequestViewModal
        onClose={() => setViewRequest(null)}
        data={viewRequest}
      />
      <DonationModal
        isOpen={!!selectedRequest}
        selectedRequest={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
      {createRequest && (
        <CreateBloodRequest onClose={() => setCreateRequest(false)} />
      )}
    </div>
  );
};

const RequestCard = React.memo(({ req, onView, onDonate }) => {
  const urgencyConfig = {
    emergency: "bg-red-50 border-red-200 text-red-700",
    urgent: "bg-orange-50 border-orange-200 text-orange-700",
    normal: "bg-emerald-50 border-emerald-200 text-emerald-700",
    default: "bg-slate-50 border-slate-200 text-slate-700",
  };

  return (
    <div className="group bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-primary-600)] rounded-[var(--radius-xl)] p-5 transition-all flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] flex flex-col items-center justify-center shrink-0">
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

        <div className="flex items-center gap-2">
          <Button
            onClick={onView}
            variant="secondary"
            className="flex-1 h-9 text-[10px] uppercase font-black"
          >
            Details
          </Button>
          <Button
            onClick={onDonate}
            variant="primary"
            className="flex-[1.5] h-9 text-[10px] uppercase font-black"
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

export default BloodRequests;
