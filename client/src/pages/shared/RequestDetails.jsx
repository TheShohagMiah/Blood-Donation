import React, { useState } from "react";
import { useGetBloodRequestByIdQuery } from "../../redux/features/bloodRequest/bloodRequestApi";
import { useParams } from "react-router-dom";
import { MapPin, Phone, Calendar, Clock, Droplets } from "lucide-react";
import Button from "../../ui/Button";
import DonationModal from "../../ui/DonationModal";
import { useSelector } from "react-redux";

const RequestDetails = () => {
  const { id } = useParams();
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const { data, isLoading, isError } = useGetBloodRequestByIdQuery(id);
  const { user } = useSelector((state) => state.auth);

  const request = data?.data;

  if (isLoading) return <p className="text-center py-20">Loading...</p>;

  if (isError || !request)
    return (
      <p className="text-center py-20 text-red-500">
        Failed to load request details.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-col flex gap-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {request.recipientName}
            </h1>
            <p className="text-sm text-gray-500">
              Requested by {request.requester?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Blood Group */}
          <span className="px-4 py-2 rounded-md bg-red-100 text-red-600 font-bold text-sm flex items-center gap-2">
            <Droplets size={16} /> {request.bloodGroup}
          </span>

          {/* Status */}
          <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-semibold capitalize">
            {request.status}
          </span>
        </div>
        <Button
          onClick={() => setOpenDonationModal(request)}
          variant="primary"
          className="px-4 py-2 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1"
        >
          Donate Now
        </Button>
      </div>

      {/* Info Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Patient Info */}
        <Card title="Patient Information">
          <Info label="Recipient" value={request.recipientName} />
          <Info label="Blood Group" value={request.bloodGroup} />
          <Info label="Urgency" value={request.urgency} highlight />
        </Card>

        {/* Location */}
        <Card title="Location Details">
          <Info
            icon={<MapPin size={14} />}
            label="Hospital"
            value={request.hospitalName}
          />
          <Info label="District" value={request.district} />
          <Info label="Upazila" value={request.upazila} />
          <Info label="Address" value={request.fullAddress} />
        </Card>

        {/* Schedule */}
        <Card title="Donation Schedule">
          <Info
            icon={<Calendar size={14} />}
            label="Date"
            value={new Date(request.donationDate).toLocaleDateString()}
          />
          <Info
            icon={<Clock size={14} />}
            label="Time"
            value={request.donationTime}
          />
        </Card>

        {/* Contact */}
        <Card title="Contact Information">
          <Info
            icon={<Phone size={14} />}
            label="Phone"
            value={request.contactNumber}
          />
          <Info
            label="Requester"
            value={`${request.requester?.name} (${request.requester?.email})`}
          />
        </Card>
      </div>

      {/* Notes */}
      {request.message && (
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
            Additional Notes
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {request.message}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {openDonationModal && (
        <DonationModal
          showName={user.name}
          showEmail={user.email}
          isOpen={!!openDonationModal}
          selectedRequest={openDonationModal}
          onClose={() => setOpenDonationModal(false)}
        />
      )}
    </div>
  );
};

/* Reusable Card */
const Card = ({ title, children }) => (
  <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl p-5 shadow-sm space-y-4">
    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
      {title}
    </h3>
    {children}
  </div>
);

/* Info Row */
const Info = ({ label, value, icon, highlight }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="text-gray-400 mt-1">{icon}</div>}
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p
        className={`text-sm ${
          highlight ? "text-red-600 font-semibold" : "text-gray-800"
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default RequestDetails;
