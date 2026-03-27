import React, { useState } from "react";
import {
  MoreHorizontal,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { users as initialData } from "../../data/user";

const statusOptions = ["all", "active", "blocked"];

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState(initialData);
  const [activeMenu, setActiveMenu] = useState(null);
  const [filter, setFilter] = useState("all");

  const updateUser = (id, updates) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    );
    setActiveMenu(null);
  };

  const filteredUsers = allUsers.filter((user) =>
    filter === "all" ? true : user.status === filter,
  );

  return (
    <div className="container-main section-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-content-primary)] font-display">
            Users
          </h1>
          <p className="text-[var(--color-content-secondary)] mt-2">
            Manage member permissions and platform access.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[var(--color-surface-tertiary)] p-1 rounded-[var(--radius-xl)] border border-[var(--color-border-default)]">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-1.5 text-xs rounded-full transition-all capitalize font-medium ${
                  filter === s
                    ? "bg-[var(--color-primary-600)] text-[var(--color-content-inverse)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary !p-2.5 rounded-[var(--radius-xl)]">
            <Filter size={18} className="text-[var(--color-content-muted)]" />
          </button>
        </div>
      </div>

      {/* Modern Table Container - Using .card */}
      <div className="card !p-0 overflow-hidden shadow-[var(--shadow-lg)] animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-secondary)] border-b border-[var(--color-border-default)]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-content-muted)]">
                  User Profile
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-content-muted)]">
                  Access Role
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-content-muted)]">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-content-muted)] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)]">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-[var(--color-surface-tertiary)] transition-all duration-200"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          className="w-12 h-12 rounded-[var(--radius-lg)] object-cover border border-[var(--color-border-strong)] transition-all group-hover:scale-105"
                          alt=""
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--color-surface-card)] ${
                            user.status === "active"
                              ? "bg-[var(--color-success-solid)]"
                              : "bg-[var(--color-content-muted)]"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--color-content-primary)] tracking-tight">
                          {user.name}
                        </span>
                        <span className="text-[13px] text-[var(--color-content-muted)] mt-0.5 flex items-center gap-1.5 font-medium">
                          <Mail size={12} className="opacity-60" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`badge ${
                        user.role === "admin"
                          ? "badge-info"
                          : user.role === "donor"
                            ? "badge-success"
                            : "badge-warning"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        user.status === "active"
                          ? "text-[var(--color-success-text)] bg-[var(--color-success-subtle)]"
                          : "text-[var(--color-error-text)] bg-[var(--color-error-subtle)]"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === user.id ? null : user.id)
                      }
                      className="btn btn-ghost !p-2 rounded-[var(--radius-md)]"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === user.id && (
                      <div className="absolute right-12 top-16 w-56 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] z-[var(--z-dropdown)] py-2 text-left animate-scale-in">
                        <div className="px-4 py-2 text-[10px] font-bold text-[var(--color-content-muted)] uppercase tracking-widest">
                          Account Security
                        </div>
                        <button
                          onClick={() =>
                            updateUser(user.id, {
                              status:
                                user.status === "active" ? "blocked" : "active",
                            })
                          }
                          className={`w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                            user.status === "active"
                              ? "text-[var(--color-error-solid)] hover:bg-[var(--color-error-subtle)]"
                              : "text-[var(--color-success-solid)] hover:bg-[var(--color-success-subtle)]"
                          }`}
                        >
                          {user.status === "active" ? (
                            <>
                              <ShieldAlert size={16} /> Block Member
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={16} /> Unblock Member
                            </>
                          )}
                        </button>

                        <div className="divider my-2 opacity-50" />

                        <div className="px-4 py-2 text-[10px] font-bold text-[var(--color-content-muted)] uppercase tracking-widest">
                          Role Permissions
                        </div>
                        <RoleActions user={user} onUpdate={updateUser} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-[var(--color-surface-secondary)] flex items-center justify-between border-t border-[var(--color-border-default)]">
          <p className="text-[13px] text-[var(--color-content-muted)] font-medium">
            Showing{" "}
            <span className="text-[var(--color-content-primary)] font-bold">
              1-{filteredUsers.length}
            </span>{" "}
            of {allUsers.length}
          </p>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary !p-2 opacity-50 cursor-not-allowed">
              <ChevronLeft size={18} />
            </button>
            <button className="btn btn-secondary !p-2">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Cleaner Role Logic
const RoleActions = ({ user, onUpdate }) => {
  const roles = ["admin", "donor", "volunteer"].filter((r) => r !== user.role);

  return roles.map((role) => (
    <button
      key={role}
      onClick={() => onUpdate(user.id, { role })}
      className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-content-secondary)] hover:bg-[var(--color-surface-tertiary)] flex items-center gap-3 transition-colors capitalize"
    >
      <UserPlus size={16} className="text-[var(--color-content-muted)]" /> Make{" "}
      {role}
    </button>
  ));
};

export default AllUsers;
