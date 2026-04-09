import React from "react";
import {
  CircleDollarSign,
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

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: stats, isLoading } = useGetStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-[var(--color-content-muted)]">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Mock data for the "Industrial" look
  const recentRequests = [
    {
      id: "REQ-001",
      user: "John Doe",
      type: "O+",
      status: "Pending",
      time: "2m ago",
    },
    {
      id: "REQ-002",
      user: "Jane Smith",
      type: "A-",
      status: "Completed",
      time: "1h ago",
    },
    {
      id: "REQ-003",
      user: "Robert Fox",
      type: "B+",
      status: "In Progress",
      time: "3h ago",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-content-primary)]">
              Welcome Back, {user?.name || "Admin"}{" "}
              <span className="wave">👋</span>
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

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatsCard
          label="Total Users"
          value={stats?.data.totalUsers}
          icon={Users}
        />
        <StatsCard
          label="Donation Requests"
          value={stats?.data.totalRequests}
          icon={ClipboardList}
        />
        <StatsCard
          label="Total Funding"
          value={stats?.data.totalFunding}
          icon={CircleDollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border-default)] flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
              Live Requests
            </h3>
            <MoreHorizontal
              size={16}
              className="text-[var(--color-content-muted)] cursor-pointer"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--color-surface-muted)]/30 text-[10px] font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Requester</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-default)]">
                {recentRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-[var(--color-surface-muted)]/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-mono font-bold text-[var(--color-primary-600)]">
                      {req.id}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                      {req.user}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">{req.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          req.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-right text-[var(--color-content-muted)]">
                      {req.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
