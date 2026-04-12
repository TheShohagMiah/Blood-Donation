import React, { useEffect, useState } from "react";
import {
  Edit3,
  ExternalLink,
  Trash2,
  MoreHorizontal,
  MapPin,
  Calendar,
  Clock,
  Droplets,
} from "lucide-react";
import {
  useGetBloodRequestsQuery,
  useDeleteBloodRequestMutation,
} from "../../redux/features/bloodRequest/bloodRequestApi";
import RequestViewModal from "../../ui/RequestViewModal";
import DeleteUserModal from "../../ui/DeleteModal";
import Loader from "../../ui/Loader";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
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

const getRequesterName = (requester) => {
  if (!requester) return "Unknown User";
  if (typeof requester === "object") return requester.name || "Anonymous";
  return String(requester);
};

const AllDonationRequests = () => {
  const [viewData, setViewData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const {
    data: bloodRequests,
    isLoading,
    isError,
    error,
  } = useGetBloodRequestsQuery();

  // ✅ Fix 2: actually call delete mutation
  const [deleteBloodRequest] = useDeleteBloodRequestMutation();

  const handleDelete = async () => {
    try {
      await deleteBloodRequest(deleteModal._id).unwrap();
      toast.success("Request deleted successfully.");
      setDeleteModal(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete request.");
    }
  };

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-red-600 uppercase tracking-widest">
          {error?.data?.message || "Failed to load donation requests."}
        </h2>
      </div>
    );
  }

  const donationRequestData = bloodRequests?.requests || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-red-600">
            <Droplets size={32} strokeWidth={2.5} />
            <h1 className="text-4xl font-black tracking-tight text-[var(--color-content-primary)]">
              Blood Requests
            </h1>
          </div>
          <p className="text-[var(--color-content-muted)] font-medium">
            Review and manage active blood donation requirements.
          </p>
        </div>
      </header>

      {/* ✅ Fix 3: empty state */}
      {donationRequestData.length === 0 ? (
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-2xl)] py-20 text-center">
          <Droplets
            size={40}
            className="mx-auto text-[var(--color-content-muted)] mb-4 opacity-30"
          />
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
            No blood requests found.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile/Tablet Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {donationRequestData.map((item) => (
              <RequestMobileCard
                key={item._id}
                item={item}
                onView={() => setViewData(item)}
                onEdit={() => setEditModal(item)}
                onDelete={() => setDeleteModal(item)}
              />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-[var(--color-surface-card)] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-muted)]/30 border-b border-[var(--color-border-default)]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                    Recipient
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                    Location
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)] text-center">
                    Group
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                    Schedule
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-default)]">
                {donationRequestData.map((item) => (
                  <RequestTableRow
                    key={item._id}
                    item={item}
                    onView={() => setViewData(item)}
                    onEdit={() => setEditModal(item)}
                    onDelete={() => setDeleteModal(item)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modals */}
      {viewData && (
        <RequestViewModal data={viewData} onClose={() => setViewData(null)} />
      )}

      {/* ✅ Fix 4: editModal placeholder — swap with your real edit modal */}
      {editModal && (
        <Navigate to={`/dashboard/donation-requests/edit/${editModal._id}`} />
      )}

      {deleteModal && (
        <DeleteUserModal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          userName={`Request for ${deleteModal.recipientName}`}
          onDelete={handleDelete} // ✅ Fix 5: was just closing modal, now calls API
        />
      )}
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const ActionDropdown = ({ onView, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const close = () => setIsOpen(false);
    if (isOpen) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] text-[var(--color-content-muted)] transition-colors"
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-52 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200"
        >
          <button
            onClick={() => {
              onView();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[var(--color-surface-muted)] flex items-center gap-3"
          >
            <ExternalLink size={16} /> View Details
          </button>
          {/* ✅ Fix 6: Edit now calls onEdit instead of doing nothing */}
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest hover:bg-[var(--color-surface-muted)] flex items-center gap-3"
          >
            <Edit3 size={16} /> Edit Request
          </button>
          <div className="my-1 border-t border-[var(--color-border-default)]" />
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 flex items-center gap-3"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

const RequestTableRow = ({ item, onView, onEdit, onDelete }) => (
  <tr className="hover:bg-[var(--color-surface-tertiary)]/20 transition-colors">
    <td className="px-8 py-5">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-[var(--color-content-primary)]">
          {item.recipientName}
        </span>
        <span className="text-[10px] text-[var(--color-content-muted)] font-bold uppercase tracking-widest">
          By {getRequesterName(item.requester)}
        </span>
      </div>
    </td>
    <td className="px-8 py-5">
      <div className="flex flex-col max-w-[180px]">
        <span className="text-xs font-bold text-[var(--color-content-primary)] truncate">
          {item.hospitalName}
        </span>
        <span className="text-[10px] text-[var(--color-content-muted)] font-medium uppercase tracking-tighter">
          {item.district}, {item.upazila}
        </span>
      </div>
    </td>
    <td className="px-8 py-5 text-center">
      <span className="inline-flex items-center justify-center text-xs font-black text-red-600 bg-red-50 w-10 h-8 rounded-lg border border-red-100">
        {item.bloodGroup}
      </span>
    </td>
    <td className="px-8 py-5">
      <div className="flex flex-col tabular-nums">
        <span className="text-xs font-bold text-[var(--color-content-primary)]">
          {formatDate(item.donationDate)}
        </span>
        <span className="text-[10px] text-[var(--color-content-muted)] flex items-center gap-1 font-bold">
          <Clock size={12} /> {formatTime(item.donationTime)}
        </span>
      </div>
    </td>
    <td className="px-8 py-5">
      <span
        className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${getStatusStyles(item.status)}`}
      >
        {item.status}
      </span>
    </td>
    <td className="px-8 py-5 text-right">
      <ActionDropdown onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </td>
  </tr>
);

const RequestMobileCard = ({ item, onView, onEdit, onDelete }) => (
  <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border-default)] shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h3 className="font-bold text-[var(--color-content-primary)]">
          {item.recipientName}
        </h3>
        <p className="text-[10px] font-black text-[var(--color-content-muted)] uppercase tracking-widest">
          By: {getRequesterName(item.requester)}
        </p>
      </div>
      <span className="text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
        {item.bloodGroup}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 py-4 border-y border-[var(--color-border-default)]">
      <div className="space-y-1">
        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
          <MapPin size={10} /> Hospital
        </span>
        <span className="text-xs font-bold text-[var(--color-content-primary)] block truncate">
          {item.hospitalName}
        </span>
      </div>
      <div className="space-y-1">
        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
          <Calendar size={10} /> Schedule
        </span>
        <span className="text-xs font-bold text-[var(--color-content-primary)]">
          {formatDate(item.donationDate)}
        </span>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <span
        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(item.status)}`}
      >
        {item.status}
      </span>
      <ActionDropdown onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </div>
  </div>
);

export default AllDonationRequests;
