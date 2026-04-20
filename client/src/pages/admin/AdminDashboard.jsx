import React from "react";
import { Droplets, Users, ClipboardList, ArrowUpRight } from "lucide-react";
import StatsCard from "../../ui/StatsCard";
import { useSelector } from "react-redux";
import { useGetStatsQuery } from "../../redux/features/isAuth/authApi";
import { useGetPendingRequestsQuery } from "../../redux/features/bloodRequest/bloodRequestApi";
import Loader from "../../ui/Loader";
import { EncryptedText } from "../../components/ui/encrypted-text";
import RequestMobileCard from "../../components/admin/RequestMobileCard";
import RequestTableRow from "../../components/admin/RequestTableCard";
import RequestAnalyticsChart from "../../components/admin/RequestAnalyticsChart";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: stats, isLoading: statsLoading } = useGetStatsQuery();
  const { data: requestsData, isLoading: requestsLoading } =
    useGetPendingRequestsQuery();

  if (statsLoading || requestsLoading) return <Loader />;

  const recentRequests = requestsData?.data?.slice(0, 5) || [];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-content-primary)]">
            <EncryptedText
              text={`Welcome back, ${user?.name || "Admin"}!`}
              encryptedClassName="text-neutral-500"
              revealedClassName="dark:text-white text-black"
              revealDelayMs={50}
            />
          </h1>
          <p className="text-xs text-[var(--color-content-muted)] mt-1 font-medium uppercase tracking-widest">
            Here's what's happening today
          </p>
        </div>
        <button
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5
                           bg-[var(--color-surface-muted)] border border-[var(--color-border-default)]
                           rounded-md text-xs font-bold uppercase tracking-widest
                           hover:bg-[var(--color-border-default)] transition-all whitespace-nowrap"
        >
          Download Report <ArrowUpRight size={14} />
        </button>
      </header>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      {/* ✅ ADD THIS */}
      <RequestAnalyticsChart />
      {/* ── Recent Requests ── */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-md shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--color-border-default)]">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--color-content-primary)]">
              Recent Requests
            </h2>
            <p className="text-[10px] text-[var(--color-content-muted)] mt-0.5">
              Latest pending donation requests
            </p>
          </div>
          <span className="text-[10px] font-bold text-[var(--color-content-muted)] bg-[var(--color-surface-muted)] px-2.5 py-1 rounded-full border border-[var(--color-border-default)]">
            {recentRequests.length} entries
          </span>
        </div>

        {recentRequests.length === 0 ? (
          <div className="py-16 text-center">
            <Droplets
              size={32}
              className="mx-auto mb-3 text-[var(--color-content-muted)] opacity-20"
            />
            <p className="text-[11px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
              No requests yet.
            </p>
          </div>
        ) : (
          <>
            {/* ── Mobile cards (below lg) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
              {recentRequests.map((item) => (
                <RequestMobileCard
                  key={item._id}
                  item={item}
                  onView={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>

            {/* ── Desktop table (lg+) ── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-muted)]/40 border-b border-[var(--color-border-default)]">
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
                        className={`px-6 xl:px-8 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-content-muted)] ${col === "Group" ? "text-center" : ""}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-default)]">
                  {recentRequests.map((item) => (
                    <RequestTableRow
                      key={item._id}
                      item={item}
                      onView={() => {}}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onUpdateStatus={() => {}}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
