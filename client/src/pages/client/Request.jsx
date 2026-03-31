import React, { useMemo, useState } from "react";
import { Search, MapPin, Calendar, Droplet, ChevronRight } from "lucide-react";
import { districts } from "../../data/districts";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import DonationModal from "../../ui/DonationModal";

const requests = [
  {
    id: 1,
    patient: "Abdur Rahman",
    bloodGroup: "A+",
    district: "Dhaka",
    hospital: "DMCH",
    date: "2026-03-28",
    urgency: "Emergency",
  },
  {
    id: 2,
    patient: "Sultana Kamal",
    bloodGroup: "O-",
    district: "Chattogram",
    hospital: "Apollo",
    date: "2026-03-30",
    urgency: "Normal",
  },
  {
    id: 3,
    patient: "Karim Uddin",
    bloodGroup: "B+",
    district: "Sylhet",
    hospital: "Osmani Medical",
    date: "2026-03-27",
    urgency: "Critical",
  },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodRequests = () => {
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

  const filterRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchBloodGroup = activeFilter.bloodGroup
        ? request.bloodGroup === activeFilter.bloodGroup
        : true;
      const matchDistrict = activeFilter.district
        ? request.district === activeFilter.district
        : true;
      return matchBloodGroup && matchDistrict;
    });
  }, [activeFilter]);

  const handleDonationSubmit = (data) => {
    console.log("Donation for:", selectedRequest?.patient, data);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
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

      <div className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-content-muted)] ml-2">
          Recent Urgent Requests
        </h2>
        <div className="grid gap-4">
          {filterRequests.length > 0 ? (
            filterRequests.map((req) => (
              <div
                key={req.id}
                className="group bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-primary-600)] rounded-[var(--radius-xl)] p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-[var(--color-primary-600)]">
                      {req.bloodGroup}
                    </span>
                    <Droplet
                      size={12}
                      className="text-[var(--color-primary-600)] fill-current"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-[var(--color-content-primary)]">
                        {req.patient}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          req.urgency === "Emergency" ||
                          req.urgency === "Critical"
                            ? "bg-red-50 border-red-100 text-red-600"
                            : "bg-blue-50 border-blue-100 text-blue-600"
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[13px] text-[var(--color-content-muted)]">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} /> {req.hospital}, {req.district}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {req.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    className="h-10 px-6 hidden sm:flex"
                  >
                    Details
                  </Button>
                  <Button
                    onClick={() => setSelectedRequest(req)}
                    variant="primary"
                    className="h-10 px-8 group-hover:translate-x-1 transition-transform"
                  >
                    Donate Now <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-[var(--color-content-muted)]">
              No requests found.
            </p>
          )}
        </div>
      </div>

      <DonationModal
        isOpen={!!selectedRequest}
        selectedRequest={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onSubmit={handleDonationSubmit}
      />
    </div>
  );
};

export default BloodRequests;
