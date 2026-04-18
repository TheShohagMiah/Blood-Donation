import React from "react";
import {
  Droplets,
  Users,
  ClipboardList,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
} from "lucide-react";
import StatsCard from "../../ui/StatsCard";
import { useSelector } from "react-redux";
import { useGetStatsQuery } from "../../redux/features/isAuth/authApi";
import { useGetPendingRequestsQuery } from "../../redux/features/bloodRequest/bloodRequestApi";
import Loader from "../../ui/Loader";
import { EncryptedText } from "../../components/ui/encrypted-text";
import {
  formatDate,
  formatDateTime,
  formatTime,
} from "../../../lib/formateDate";

// ✅ Fix 3: handle all 3 statuses
const getStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Pending":
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: stats, isLoading: statsLoading } = useGetStatsQuery();

  const { data: requestsData, isLoading: requestsLoading } =
    useGetPendingRequestsQuery();

  if (statsLoading || requestsLoading) return <Loader />;

  const recentRequests = requestsData?.data?.slice(0, 3) || [];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-content-primary)]">
              <EncryptedText
                text={`Welcome back, ${user?.name || "Admin"}!`}
                encryptedClassName="text-neutral-500"
                revealedClassName="dark:text-white text-black"
                revealDelayMs={50}
              />
            </h1>
          </div>
          <button className="w-fit flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-border-default)] transition-all">
            Download Report <ArrowUpRight size={14} />
          </button>
        </div>
      </header>

      {/* ✅ Fix 1 & 4: replaced totalFunding with totalDonations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label="Total Users"
          value={stats?.data?.totalUsers ?? 0}
          icon={Users}
        />
        <StatsCard
          label="Donation Requests"
          value={stats?.data?.totalRequests ?? 0}
          icon={ClipboardList}
        />
        <StatsCard
          label="Total Donations"
          value={stats?.data?.totalDonations ?? 0}
          icon={Droplets}
        />
      </div>

      <div className="">
        {/* Recent Requests Table */}
        <div className=" bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {recentRequests.length === 0 ? (
              <p className="px-6 py-10 text-center text-[11px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
                No requests yet.
              </p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--color-surface-muted)]/30 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Hospital</th>
                    <th className="px-6 py-4">Blood Group</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-default)]">
                  {recentRequests.map((req) => (
                    <tr
                      key={req._id}
                      className="hover:bg-[var(--color-surface-muted)]/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs font-bold text-[var(--color-content-primary)]">
                        {req.recipientName}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[var(--color-content-secondary)]">
                        {req.fullAddress || "—"}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-[var(--color-content-secondary)]">
                        {req.hospitalName || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                          {req.bloodGroup || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* ✅ Fix 3: all statuses handled */}
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${getStatusStyle(req.status)}`}
                        >
                          {req.status}
                          {req.status === "in-progress" && (
                            <Clock size={12} className="inline-block ml-1" />
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-right text-[var(--color-content-muted)] tabular-nums">
                        {formatDate(req.donationDate)}
                      </td>
                      <td className="px-6 py-4 text-xs text-right text-[var(--color-content-muted)] tabular-nums">
                        {req.donationTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
