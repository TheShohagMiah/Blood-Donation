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
  useDeleteBloodRequestMutation,
  useGetOwnBloodRequestsQuery,
} from "../../redux/features/bloodRequest/bloodRequestApi";
import RequestViewModal from "../../ui/RequestViewModal";
import DeleteUserModal from "../../ui/DeleteModal";
import Loader from "../../ui/Loader";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import RequestMobileCard from "../../components/admin/RequestMobileCard";
import RequestTableRow from "../../components/admin/RequestTableCard";

const AllDonationRequests = () => {
  const [viewData, setViewData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const {
    data: bloodRequests,
    isLoading,
    isError,
    error,
  } = useGetOwnBloodRequestsQuery();
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

  const donationRequestData = bloodRequests?.data || [];
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
          <div className="hidden lg:block bg-[var(--color-surface-card)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] shadow-sm overflow-hidden">
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
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                    Actions
                  </th>
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

export default AllDonationRequests;
