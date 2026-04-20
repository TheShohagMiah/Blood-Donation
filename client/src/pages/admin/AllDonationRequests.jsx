import React, { useEffect, useState } from "react";
import { Droplets } from "lucide-react";
import {
  useDeleteBloodRequestMutation,
  useGetAllBloodRequestsQuery,
} from "../../redux/features/bloodRequest/bloodRequestApi";
import RequestViewModal from "../../ui/RequestViewModal";
import DeleteUserModal from "../../ui/DeleteModal";
import Loader from "../../ui/Loader";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import RequestMobileCard from "../../components/admin/RequestMobileCard";
import RequestTableRow from "../../components/admin/RequestTableCard";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Pagination from "../../ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";

const ITEMS_PER_PAGE = 5;

const AllDonationRequests = () => {
  const [viewData, setViewData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const {
    data: bloodRequests,
    isLoading,
    isError,
    error,
  } = useGetAllBloodRequestsQuery();
  const [deleteBloodRequest] = useDeleteBloodRequestMutation();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortOrder]);

  const handleDelete = async () => {
    try {
      await deleteBloodRequest(deleteModal._id).unwrap();
      toast.success("Request deleted successfully.");
      setDeleteModal(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete request.");
    }
  };

  const donationRequestData = bloodRequests?.data || [];

  const filteredData = donationRequestData.filter((item) => {
    const matchesSearch = debouncedSearch
      ? item.recipientName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        item.hospitalName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        item.district.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.upazila.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true;
    const matchesStatus =
      statusFilter === "all" ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ITEMS_PER_PAGE));
  const paginatedData = sortedData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      {/* ── Toolbar: search + filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Search — full width on mobile, capped on larger screens */}
        <div className="w-full sm:max-w-xs lg:max-w-sm">
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="h-8 w-full"
          />
        </div>

        {/* Filters — wrap on very small screens, row on sm+ */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium uppercase tracking-widest text-[var(--color-content-muted)] sm:ml-auto">
          <Select
            className="flex-1 min-w-[120px] sm:flex-none sm:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <Select
            className="flex-1 min-w-[110px] sm:flex-none sm:w-auto"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </Select>
        </div>
      </div>

      {/* ── Empty state ── */}
      {sortedData.length === 0 ? (
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
          {/* ── Mobile / Tablet cards (hidden on lg+) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {paginatedData.map((item) => (
              <RequestMobileCard
                key={item._id}
                item={item}
                onView={() => setViewData(item)}
                onEdit={() => setEditModal(item)}
                onDelete={() => setDeleteModal(item)}
              />
            ))}
          </div>

          {/* ── Desktop table (hidden below lg) ── */}
          <div className="hidden lg:block bg-[var(--color-surface-card)] rounded-[var(--radius-md)] border border-[var(--color-border-default)] shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-muted)]/30 border-b border-[var(--color-border-default)]">
                  {[
                    "Recipient",
                    "Location",
                    "Group",
                    "Schedule",
                    "Status",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className={`px-6 xl:px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]${
                        col === "Group" ? " text-center" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-default)]">
                {paginatedData.map((item) => (
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

          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      )}

      {/* ── Modals ── */}
      {viewData && (
        <RequestViewModal data={viewData} onClose={() => setViewData(null)} />
      )}
      {editModal && (
        <Navigate to={`/dashboard/donation-requests/edit/${editModal._id}`} />
      )}
      {deleteModal && (
        <DeleteUserModal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          userName={`Request for ${deleteModal.recipientName}`}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AllDonationRequests;
