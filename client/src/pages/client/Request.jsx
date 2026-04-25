import React, { useMemo, useState } from "react";
import { Search, MapPin, Droplet, Plus } from "lucide-react";
import { districts } from "../../data/districts";
import { bloodGroups } from "../../data/bloodGroups";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import DonationModal from "../../ui/DonationModal";
import RequestViewModal from "../../ui/RequestViewModal";
import CreateBloodRequest from "./Home/components/CreateBloodRequest";
import { useGetPendingRequestsQuery } from "../../redux/features/bloodRequest/bloodRequestApi";
import RequestCard from "../../ui/RequestCard";
import { useSelector } from "react-redux";
import { Loader } from "../../ui/TextBlinkLoader";

const urgencies = ["Emergency", "Urgent", "Normal"];

const BloodRequests = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    data: bloodRequests,
    isLoading,
    isFetching,
  } = useGetPendingRequestsQuery();

  // Modal States
  const [createRequest, setCreateRequest] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Form input state
  const [params, setParams] = useState({
    bloodGroup: "",
    district: "",
    urgency: "",
  });

  // Applied filters state
  const [activeParams, setActiveParams] = useState({
    bloodGroup: "",
    district: "",
    urgency: "",
  });

  const sortedDistricts = useMemo(
    () => [...districts].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  // Filtering logic
  const filteredRequests = useMemo(() => {
    const baseRequests = bloodRequests?.data || [];

    return baseRequests.filter((req) => {
      const matchGroup = activeParams.bloodGroup
        ? req.bloodGroup === activeParams.bloodGroup
        : true;

      const matchDistrict = activeParams.district
        ? req.district === activeParams.district
        : true;

      const matchUrgency = activeParams.urgency
        ? req.urgency.toLowerCase() === activeParams.urgency.toLowerCase()
        : true;

      return matchGroup && matchDistrict && matchUrgency;
    });
  }, [activeParams, bloodRequests]);

  // Trigger filter manually
  const handleSearchTrigger = (e) => {
    e.preventDefault();
    setActiveParams(params);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 my-20 space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Filter Bar */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] p-2 shadow-sm">
        <form
          onSubmit={handleSearchTrigger}
          className="grid grid-cols-1 md:grid-cols-4 gap-2"
        >
          <div className="p-3 space-y-1">
            <Select
              label="Blood Group"
              icon={Droplet}
              value={params.bloodGroup}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  bloodGroup: e.target.value,
                }))
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

          <div className="p-3 space-y-1">
            <Select
              label="Urgency"
              icon={Droplet}
              value={params.urgency}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  urgency: e.target.value,
                }))
              }
            >
              <option value="">All Urgencies</option>
              {urgencies.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </Select>
          </div>

          <div className="p-3 space-y-1">
            <Select
              label="District"
              icon={MapPin}
              value={params.district}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  district: e.target.value,
                }))
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
            className="flex items-center justify-center min-h-8 mx-3 gap-2 transition-all bg-primary-600 rounded-md active:scale-95 h-full"
          >
            <Search size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Initiate Filter
            </span>
          </button>
        </form>
      </div>

      {/* Results */}
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

      {selectedRequest && (
        <DonationModal
          showName={user?.name || ""}
          showEmail={user?.email || ""}
          isOpen={!!selectedRequest}
          selectedRequest={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {createRequest && (
        <CreateBloodRequest onClose={() => setCreateRequest(false)} />
      )}
    </div>
  );
};

export default BloodRequests;
