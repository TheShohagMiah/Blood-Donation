import React, { useMemo, useState } from "react";
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

const urgencyConfig = {
  emergency: {
    label: "Emergency",
    classes: "bg-red-50 border-red-200 text-red-700",
  },
  urgent: {
    label: "Urgent",
    classes: "bg-orange-50 border-orange-200 text-orange-700",
  },
  normal: {
    label: "Normal",
    classes: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  default: {
    label: "Routine",
    classes: "bg-slate-50 border-slate-200 text-slate-700",
  },
};
const BloodRequests = () => {
  const { data: bloodRequests, isLoading } = useGetBloodRequestsQuery();
  const [createRequest, setCreateRequest] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [tempFilter, setTempFilter] = useState({
    bloodGroup: "",
    district: "",
  });
  const [activeFilter, setActiveFilter] = useState({
    bloodGroup: "",
    district: "",
  });

  const sortedDistrictsList = useMemo(() => {
    return [...districts].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter Logic: Uses the derived 'activeFilter' state
  const filteredRequests = useMemo(() => {
    const baseRequests = bloodRequests?.requests || [];
    return baseRequests.filter((request) => {
      const matchBloodGroup = activeFilter.bloodGroup
        ? request.bloodGroup === activeFilter.bloodGroup
        : true;
      const matchDistrict = activeFilter.district
        ? request.district === activeFilter.district
        : true;
      return matchBloodGroup && matchDistrict;
    });
  }, [activeFilter, bloodRequests]);

  const handleDonationSubmit = (data) => {
    console.log("Donation for:", selectedRequest?.recipientName, data);
    setSelectedRequest(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-10 h-10 border-2 border-[var(--color-primary-100)] border-t-[var(--color-primary-600)] rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-content-muted)]">
          Synchronizing Live Feed...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[var(--color-surface-card)] p-6 rounded-[var(--radius-xl)] border border-[var(--color-border-default)]">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Blood Group"
            value={tempFilter.bloodGroup}
            onChange={(e) =>
              setTempFilter({ ...tempFilter, bloodGroup: e.target.value })
            }
          >
            <option value="">All Groups</option>
            {bloodGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>

          <Select
            label="District"
            value={tempFilter.district}
            onChange={(e) =>
              setTempFilter({ ...tempFilter, district: e.target.value })
            }
          >
            <option value="">All Districts</option>
            {sortedDistrictsList.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>
        <Button
          onClick={() => setActiveFilter(tempFilter)}
          className="h-11 px-8"
        >
          <Search size={18} className="mr-2" /> Filter Results
        </Button>
      </div>

      <div className="space-y-6">
        {/* Sub-header with CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
              Urgent Requests ({filteredRequests.length})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--color-content-secondary)]">
              Need Blood?
            </span>
            <Button
              onClick={() => setCreateRequest(true)}
              variant="primary"
              className="h-9 px-5 rounded-full text-[11px] uppercase tracking-wider"
            >
              <Plus size={14} className="mr-1" /> Add Request
            </Button>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <div
                key={req._id || req.id}
                className="group bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-primary-600)] rounded-[var(--radius-xl)] p-5 transition-all flex flex-col gap-6 hover:shadow-lg hover:shadow-primary-500/5"
              >
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
                        className={`
        text-[9px] 
        font-black 
        uppercase 
        tracking-[0.15em] 
        px-2 
        py-0.5 
        rounded-md 
        border 
        shadow-sm
        transition-all 
        duration-300
        ${urgencyConfig[req.urgency?.toLowerCase()]?.classes || urgencyConfig.default.classes}
      `}
                      >
                        {req.urgency || "Normal"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[12px] text-[var(--color-content-muted)]">
                      <span className="flex items-center gap-1 truncate opacity-80">
                        <MapPin
                          size={12}
                          className="text-[var(--color-primary-500)]"
                        />{" "}
                        {req.hospitalName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-content-muted)] font-medium bg-[var(--color-surface-secondary)] p-2.5 rounded-lg">
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
                      onClick={() => setViewRequest(req)}
                      variant="secondary"
                      className="flex-1 h-9 text-[10px] uppercase font-black"
                    >
                      Details
                    </Button>
                    <Button
                      onClick={() => setSelectedRequest(req)}
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
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border-default)] rounded-[var(--radius-2xl)] bg-[var(--color-surface-secondary)]">
              <Search
                className="text-[var(--color-content-muted)] mb-3 opacity-20"
                size={40}
              />
              <p className="text-[var(--color-content-muted)] font-bold uppercase tracking-widest text-xs">
                No matching requests found
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
        onSubmit={handleDonationSubmit}
      />
      {createRequest && (
        <CreateBloodRequest onClose={() => setCreateRequest(false)} />
      )}
    </div>
  );
};

export default BloodRequests;
