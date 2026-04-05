import React, { useEffect, useRef, useState } from "react";
import {
  Edit3,
  ExternalLink,
  Trash2,
  MoreHorizontal,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { useGetBloodRequestsQuery } from "../../redux/features/bloodRequest/bloodRequestApi";
import RequestViewModal from "../../ui/RequestViewModal";
import DeleteUserModal from "../../ui/DeleteModal";
import Loader from "../../ui/Loader";

const getStatusStyles = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

const AllDonationRequests = () => {
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const menuRef = useRef(null);

  const {
    data: bloodRequests,
    isLoading,
    isError,
  } = useGetBloodRequestsQuery();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsActionDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="container-main section-sm max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold text-red-600">
          Failed to load requests. Please try again.
        </h2>
      </div>
    );
  }

  const donationRequestData = bloodRequests?.requests || [];

  const handleViewModal = (item) => {
    setViewData(item);
    setIsActionDropdownOpen(null);
  };

  // Helper to safely render requester name if it's an object
  const renderRequester = (requester) => {
    if (!requester) return "Unknown";
    return typeof requester === "object" ? requester.name : requester;
  };

  return (
    <div className="container-main section-sm max-w-7xl mx-auto px-4 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-content-primary)]">
          Donation Requests
        </h1>
        <p className="text-[var(--color-content-secondary)] text-base lg:text-lg mt-2">
          Review and manage community blood donation requirements.
        </p>
      </header>

      {/* Mobile/Tablet Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mb-8">
        {donationRequestData.map((item) => (
          <div
            key={item._id} // Fixed: Using _id for key
            className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm space-y-5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[var(--color-content-primary)] leading-tight">
                  {item.recipientName}
                </h3>
                <p className="text-xs font-medium text-[var(--color-content-muted)]">
                  By: {renderRequester(item.requester)}
                </p>
              </div>
              <span className="text-sm font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                {item.bloodGroup}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--color-border-default)]">
              <div className="space-y-1">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-content-muted)]">
                  <MapPin size={10} /> Hospital
                </span>
                <span className="text-xs font-semibold text-[var(--color-content-primary)] block truncate">
                  {item.hospitalName}
                </span>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-content-muted)]">
                  <Calendar size={10} /> Date
                </span>
                <span className="text-xs font-semibold text-[var(--color-content-primary)]">
                  {item.donationDate}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(item.status)}`}
              >
                {item.status}
              </span>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsActionDropdownOpen(
                      isActionDropdownOpen === item._id ? null : item._id,
                    );
                  }}
                  className="p-2 hover:bg-[var(--color-surface-tertiary)] rounded-lg transition-colors"
                >
                  <MoreHorizontal
                    size={20}
                    className="text-[var(--color-content-muted)]"
                  />
                </button>

                {isActionDropdownOpen === item._id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 bottom-full mb-2 w-48 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-xl shadow-2xl z-[100] py-1.5 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200"
                  >
                    <button
                      onClick={() => handleViewModal(item)}
                      className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-content-primary)] hover:bg-[var(--color-surface-tertiary)] flex items-center gap-3 font-medium"
                    >
                      <ExternalLink size={16} /> View Details
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-content-primary)] hover:bg-[var(--color-surface-tertiary)] flex items-center gap-3 font-medium">
                      <Edit3 size={16} /> Edit
                    </button>
                    <div className="h-px bg-[var(--color-border-default)] my-1" />
                    <button
                      onClick={() => {
                        setDeleteModal(item);
                        setIsActionDropdownOpen(null);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-bold"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border-default)] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-secondary)]/50 border-b border-[var(--color-border-default)]">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                Recipient
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                Location
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)] text-center">
                Group
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                Schedule
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                Status
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)]">
            {donationRequestData.map((item) => (
              <tr
                key={item._id} // Fixed: Using _id
                className="group hover:bg-[var(--color-surface-tertiary)]/30 transition-all"
              >
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-[var(--color-content-primary)]">
                      {item.recipientName}
                    </span>
                    <span className="text-xs text-[var(--color-content-muted)] font-medium">
                      By {renderRequester(item.requester)}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col max-w-[200px]">
                    <span className="text-sm font-semibold text-[var(--color-content-primary)] truncate">
                      {item.hospitalName}
                    </span>
                    <span className="text-xs text-[var(--color-content-muted)] italic">
                      {item.district}, {item.upazila}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="inline-block text-sm font-black text-red-600 bg-red-50 w-12 py-1.5 rounded-lg border border-red-100 shadow-sm">
                    {item.bloodGroup}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col tabular-nums">
                    <span className="text-sm font-bold text-[var(--color-content-primary)]">
                      {item.donationDate}
                    </span>
                    <span className="text-xs text-[var(--color-content-muted)] flex items-center gap-1">
                      <Clock size={12} /> {item.donationTime}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right relative">
                  <button
                    onClick={() =>
                      setIsActionDropdownOpen(
                        isActionDropdownOpen === item._id ? null : item._id,
                      )
                    }
                    className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-content-muted)] transition-all"
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {isActionDropdownOpen === item._id && (
                    <div
                      ref={menuRef}
                      className="absolute right-8 top-16 w-52 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-xl shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in duration-200"
                    >
                      <button
                        onClick={() => handleViewModal(item)}
                        className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-content-primary)] hover:bg-[var(--color-surface-tertiary)] flex items-center gap-3 font-medium"
                      >
                        <ExternalLink size={16} /> View Details
                      </button>
                      <button className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-content-primary)] hover:bg-[var(--color-surface-tertiary)] flex items-center gap-3 font-medium">
                        <Edit3 size={16} /> Edit Request
                      </button>
                      <div className="h-px bg-[var(--color-border-default)] my-1.5" />
                      <button
                        onClick={() => {
                          setDeleteModal(item);
                          setIsActionDropdownOpen(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-bold"
                      >
                        <Trash2 size={16} /> Delete Request
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewData && (
        <RequestViewModal data={viewData} onClose={() => setViewData(null)} />
      )}
      {deleteModal && (
        <DeleteUserModal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          userName={renderRequester(deleteModal.requester)}
          onDelete={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
};

export default AllDonationRequests;
