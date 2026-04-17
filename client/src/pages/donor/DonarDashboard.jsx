import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Droplets,
  MoreHorizontal,
  Clock,
  Heart,
  TrendingUp,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Loader from "../../ui/Loader";
import { useGetDonationsByUserQuery } from "../../redux/features/donation/donationApi";
import ActionsMenu from "../../ui/ActionsMenu";
import { formatDate, formatTime } from "../../../lib/formateDate";
import Select from "../../ui/Select";
import { useForm } from "react-hook-form";
import { useUpdateBloodRequestMutation } from "../../redux/features/bloodRequest/bloodRequestApi";
import Button from "../../ui/Button";
import StatusBadge from "../../components/admin/donor/StatusBadge";
import StatsCard from "../../components/admin/StatsCard";
import DonationCard from "../../components/admin/DonationCard";

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [editTarget, setEditTarget] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const { data: donationsResponse, isLoading } = useGetDonationsByUserQuery();

  const donations = useMemo(
    () => donationsResponse?.data || [],
    [donationsResponse],
  );
  const totalCount =
    donationsResponse?.pagination?.total ?? donationsResponse?.total ?? 0;
  const recentDonations = useMemo(() => donations.slice(0, 3), [donations]);

  if (isLoading) return <Loader />;

  const donorLevel = totalCount > 10 ? "Elite" : "Active";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 space-y-8 w-full min-w-0">
      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <span className="inline-block px-2 py-0.5 rounded bg-[var(--color-primary-600)] text-white text-[10px] font-black uppercase tracking-widest mb-2">
            Donor Level: {donorLevel}
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-[var(--color-content-primary)] uppercase truncate">
            Welcome back,{" "}
            <span className="text-[var(--color-primary-600)]">
              {user?.name?.split(" ")[0] || "Donor"}
            </span>
          </h1>
        </div>
      </header>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard
          icon={<Heart size={18} />}
          label="Registry Contributions"
          value={totalCount}
          subtext="Total lifetime donations"
        />
        <StatsCard
          icon={<Droplets size={18} />}
          label="Blood Classification"
          value={user?.bloodGroup || "—"}
          color="text-red-500"
          subtext="Verified blood group"
        />
        <StatsCard
          icon={<Calendar size={18} />}
          label="Eligibility Status"
          value={user?.isAvailable ? "Eligible" : "Ineligible"}
          valueColor={user?.isAvailable ? "text-emerald-500" : "text-red-500"}
          subtext="Based on 90-day protocol"
        />
      </div>

      {/* ── Donation Log ── */}
      <section className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl overflow-hidden shadow-sm">
        {/* Section header */}
        <div className="px-4 sm:px-6 py-4 border-b border-[var(--color-border-default)] bg-[var(--color-surface-muted)]/10 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 shrink-0 rounded-full bg-[var(--color-primary-600)] animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-content-primary)] truncate">
              Personal Donation Logs
            </h3>
          </div>
          <MoreHorizontal
            size={16}
            className="shrink-0 text-[var(--color-content-muted)] cursor-pointer hover:text-[var(--color-content-primary)] transition-colors"
          />
        </div>

        {/* Empty state */}
        {recentDonations.length === 0 ? (
          <div className="px-6 py-20 text-center space-y-3">
            <Clock
              size={32}
              className="mx-auto text-[var(--color-content-muted)] opacity-20"
            />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-content-muted)]">
              No records found in registry
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table — hidden on small screens */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-muted)]/30 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)] border-b border-[var(--color-border-default)]">
                    <th className="px-6 py-4 whitespace-nowrap">Recipient</th>
                    <th className="px-6 py-4 whitespace-nowrap">Hospital</th>
                    <th className="px-6 py-4 whitespace-nowrap">Blood</th>
                    <th className="px-6 py-4 whitespace-nowrap">Location</th>
                    <th className="px-6 py-4 whitespace-nowrap">Contact</th>
                    <th className="px-6 py-4 whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 whitespace-nowrap text-right">
                      Status
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-default)]">
                  {recentDonations.map((donation) => {
                    const req = donation.requestId;
                    return (
                      <tr
                        key={donation._id}
                        className="hover:bg-[var(--color-surface-muted)]/20 transition-all group"
                      >
                        <td className="px-6 py-4">
                          <p className="text-[13px] font-bold text-[var(--color-content-primary)] uppercase tracking-tight group-hover:text-[var(--color-primary-600)] transition-colors">
                            {req?.recipientName || "Unknown"}
                          </p>
                          <p className="text-[9px] uppercase tracking-widest mt-0.5 text-[var(--color-content-muted)]">
                            Req by:{" "}
                            <span className="text-[var(--color-content-primary)]">
                              {req?.requester?.name || "System"}
                            </span>
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[11px] text-[var(--color-content-primary)]">
                            {req?.hospitalName || "Field Clinic"}
                          </p>
                          <p className="text-[9px] uppercase tracking-widest mt-0.5 text-[var(--color-content-muted)]">
                            {req?.fullAddress || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-red-500">
                            {req?.bloodGroup || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[11px] text-[var(--color-content-primary)] whitespace-nowrap">
                            {req?.upazila || "—"}
                          </p>
                          <p className="text-[9px] uppercase tracking-widest mt-0.5 text-[var(--color-content-muted)]">
                            {req?.district || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] text-[var(--color-content-primary)]">
                            {req?.contactNumber || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[11px] font-black text-[var(--color-content-primary)] tabular-nums uppercase whitespace-nowrap">
                            {formatDate(req?.donationDate)}
                          </p>
                          <p className="text-[9px] tabular-nums mt-0.5 text-[var(--color-content-muted)]">
                            {formatTime(req?.donationTime) || "ASAP"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <StatusBadge status={req?.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ActionsMenu
                            donation={req}
                            onEdit={() => setEditTarget(req)}
                            onDelete={() => setDeleteTarget(req)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet cards — shown below lg */}
            <div className="lg:hidden divide-y divide-[var(--color-border-default)]">
              {recentDonations.map((donation) => {
                const req = donation.requestId;
                return (
                  <DonationCard
                    key={donation._id}
                    donation={donation}
                    req={req}
                  />
                );
              })}
            </div>
          </>
        )}
        {editTarget && (
          <EditDonationModal
            donation={editTarget}
            onClose={() => setEditTarget(null)}
          />
        )}

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 bg-[var(--color-surface-muted)]/5 border-t border-[var(--color-border-default)]">
          <button className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--color-content-muted)] hover:text-[var(--color-primary-600)] transition-colors flex items-center gap-2">
            Access Full History Registry <TrendingUp size={12} />
          </button>
        </div>
      </section>
    </div>
  );
};

const EditDonationModal = ({ donation, onClose }) => {
  const [updateStatus] = useUpdateBloodRequestMutation();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: donation?.status || "",
    },
  });

  const handleStatusUpdate = async (data) => {
    try {
      await updateStatus({ id: donation._id, status: data.status });
    } catch (error) {
      console.error("Error updating donation status:", error);
    }
  };

  // Placeholder for edit functionality
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[var(--color-surface-card)] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit Donation Status</h2>
        <form action="" onSubmit={handleSubmit(handleStatusUpdate)}>
          {/* Form fields for editing donation would go here */}
          <Select
            label="Update Status"
            {...register("status", { required: "Required" })}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <Button type="submit" className="mt-4">
            Save Changes
          </Button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-[var(--color-primary-600)] text-white rounded hover:bg-[var(--color-primary-700)] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DonorDashboard;
