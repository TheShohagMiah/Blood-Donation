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
import { useGetBloodRequestsQuery } from "../../redux/features/bloodRequest/bloodRequestApi";
import Loader from "../../ui/Loader";
import { EncryptedText } from "../../components/ui/encrypted-text";

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

  // ✅ Fix 2: real data for recent requests
  const { data: requestsData, isLoading: requestsLoading } =
    useGetBloodRequestsQuery();

  if (statsLoading || requestsLoading) return <Loader />;

  // Show the 5 most recent requests
  const recentRequests = requestsData?.requests?.slice(0, 5) || [];

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
            <p className="text-[var(--color-content-muted)] mt-1 text-sm">
              Operational metrics for{" "}
              <span className="text-[var(--color-primary-600)] font-bold">
                LifeFlow Terminal
              </span>
              .
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-border-default)] transition-all">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests Table */}
        <div className="lg:col-span-2 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border-default)] flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
              Recent Requests
            </h3>
            <MoreHorizontal
              size={16}
              className="text-[var(--color-content-muted)] cursor-pointer"
            />
          </div>

          <div className="overflow-x-auto">
            {recentRequests.length === 0 ? (
              <p className="px-6 py-10 text-center text-[11px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
                No requests yet.
              </p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--color-surface-muted)]/30 text-[10px] font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                    <th className="px-6 py-3">Recipient</th>
                    <th className="px-6 py-3">Requester</th>
                    <th className="px-6 py-3">Blood Group</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Date</th>
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
                        {typeof req.requester === "object"
                          ? req.requester?.name
                          : req.requester || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* ✅ Fix 3: all statuses handled */}
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${getStatusStyle(req.status)}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-right text-[var(--color-content-muted)] tabular-nums">
                        {req.donationDate
                          ? new Date(req.donationDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Health Widget */}
        <div className="space-y-6">
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-2xl">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)] mb-4">
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 size={14} className="text-green-500" /> API
                  Gateway
                </div>
                <span className="text-[10px] font-bold text-green-500">
                  99.9%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Clock size={14} className="text-amber-500" /> Database Sync
                </div>
                <span className="text-[10px] font-bold text-amber-500">
                  Delayed
                </span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--color-border-default)]">
              <p className="text-[10px] text-[var(--color-content-muted)] leading-relaxed">
                Last system backup performed at{" "}
                <span className="font-bold">14:00 UTC</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
